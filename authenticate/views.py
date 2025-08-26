# authenticate/views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from django.core.cache import cache
from django.shortcuts import get_object_or_404
from django.contrib.auth import login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from datetime import timedelta
import logging

from .models import User, UserProfile, UserSession, PasswordResetToken
from .serializers import (
    UserSerializer, UserProfileSerializer, UserCreateSerializer, UserUpdateSerializer,
    UserProfileUpdateSerializer, LoginSerializer, PasswordChangeSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    EmailVerificationSerializer, PhoneVerificationSerializer,
    PhoneVerificationRequestSerializer, UserSessionSerializer, UserStatsSerializer
)
from .constants import ERROR_MESSAGES, SUCCESS_MESSAGES

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet برای مدیریت کاربران"""
    queryset = User.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user_type', 'status', 'is_email_verified', 'is_phone_verified']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering_fields = ['username', 'email', 'date_joined', 'last_login', 'login_count']
    ordering = ['-date_joined']

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        """تنظیم مجوزها"""
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return super().get_permissions()

    def perform_create(self, serializer):
        """ایجاد کاربر"""
        user = serializer.save()
        logger.info(f"New user registered: {user.username}")

    @action(detail=False, methods=['get'])
    def me(self, request):
        """اطلاعات کاربر فعلی"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """بروزرسانی اطلاعات کاربر فعلی"""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """پروفایل کاربر فعلی"""
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """بروزرسانی پروفایل کاربر فعلی"""
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def sessions(self, request):
        """جلسات کاربر فعلی"""
        sessions = UserSession.objects.filter(user=request.user, is_active=True)
        serializer = UserSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def terminate_session(self, request, pk=None):
        """خاتمه جلسه"""
        session = get_object_or_404(UserSession, id=pk, user=request.user)
        session.is_active = False
        session.save()
        return Response({'message': 'جلسه با موفقیت خاتمه یافت'})

    @action(detail=False, methods=['post'])
    def terminate_all_sessions(self, request):
        """خاتمه همه جلسات"""
        UserSession.objects.filter(user=request.user, is_active=True).update(is_active=False)
        return Response({'message': 'همه جلسات با موفقیت خاتمه یافتند'})


class AuthViewSet(viewsets.ViewSet):
    """ViewSet برای احراز هویت"""
    permission_classes = [AllowAny]
    authentication_classes = []  # هیچ authentication class

    def list(self, request):
        """لیست endpoint های موجود"""
        return Response({
            'available_endpoints': [
                'login',
                'logout', 
                'password_change',
                'password_reset_request',
                'password_reset_confirm',
                'email_verification',
                'phone_verification_request',
                'phone_verification',
                'test_login'
            ]
        })

    @action(detail=False, methods=['post'])
    def test_login(self, request):
        """تست ساده login"""
        return Response({
            'message': 'Login endpoint works!',
            'data': request.data
        })

    @action(detail=False, methods=['post'])
    def login(self, request):
        """ورود کاربر"""
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                remember_me = serializer.validated_data.get('remember_me', False)

                # 1. غیرفعال کردن همه session های قبلی کاربر
                UserSession.objects.filter(user=user, is_active=True).update(is_active=False)

                # 2. به‌روزرسانی آمار
                user.increment_login_count()
                user.update_last_activity()

                # 3. تولید توکن JWT
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                # 4. تنظیم زمان انقضا
                if remember_me:
                    access_token.set_exp(lifetime=timedelta(days=30))
                    refresh.set_exp(lifetime=timedelta(days=30))

                # 5. ساخت session جدید با session_key یکتا
                import uuid
                unique_session_key = f"jwt_{uuid.uuid4().hex[:30]}"
                
                UserSession.objects.create(
                    user=user,
                    session_key=unique_session_key,
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )

                logger.info(f"User logged in: {user.username}")

                return Response({
                    'access_token': str(access_token),
                    'refresh_token': str(refresh),
                    'user': UserSerializer(user).data,
                    'message': SUCCESS_MESSAGES['login_successful']
                })

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'error': 'خطا در ورود',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """خروج کاربر"""
        if request.user.is_authenticated:
            # خاتمه همه session های کاربر
            UserSession.objects.filter(
                user=request.user,
                is_active=True
            ).update(is_active=False)
            
            logger.info(f"User logged out: {request.user.username}")
        
        return Response({'message': SUCCESS_MESSAGES['logout_successful']})

    @action(detail=False, methods=['post'])
    def password_change(self, request):
        """تغییر رمز عبور"""
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            logger.info(f"Password changed for user: {user.username}")
            return Response({'message': SUCCESS_MESSAGES['password_changed']})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def password_reset_request(self, request):
        """درخواست بازنشانی رمز عبور"""
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # تولید توکن
            import secrets
            token = secrets.token_urlsafe(32)
            expires_at = timezone.now() + timedelta(hours=24)
            
            PasswordResetToken.objects.create(
                user=user,
                token=token,
                expires_at=expires_at
            )
            
            # ارسال ایمیل (در اینجا فقط لاگ می‌کنیم)
            logger.info(f"Password reset token generated for {email}: {token}")
            
            return Response({'message': SUCCESS_MESSAGES['password_reset_sent']})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def password_reset_confirm(self, request):
        """تایید بازنشانی رمز عبور"""
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = PasswordResetToken.objects.get(token=serializer.validated_data['token'])
            user = token.user
            
            # تغییر رمز عبور
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # علامت‌گذاری توکن به عنوان استفاده شده
            token.is_used = True
            token.save()
            
            logger.info(f"Password reset completed for user: {user.username}")
            return Response({'message': SUCCESS_MESSAGES['password_changed']})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def email_verification(self, request):
        """تایید ایمیل"""
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            user = User.objects.get(email_verification_token=token)
            
            if user.verify_email(token):
                logger.info(f"Email verified for user: {user.username}")
                return Response({'message': SUCCESS_MESSAGES['email_verified']})
            
            return Response({'error': ERROR_MESSAGES['invalid_token']}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def phone_verification_request(self, request):
        """درخواست کد تایید تلفن"""
        serializer = PhoneVerificationRequestSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            user = User.objects.get(phone_number=phone_number)
            
            # تولید کد تایید
            code = user.generate_phone_verification_code()
            
            # ارسال پیامک (در اینجا فقط لاگ می‌کنیم)
            logger.info(f"Phone verification code sent to {phone_number}: {code}")
            
            return Response({'message': SUCCESS_MESSAGES['verification_code_sent']})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def phone_verification(self, request):
        """تایید تلفن"""
        serializer = PhoneVerificationSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            user = User.objects.get(phone_verification_code=code)
            
            if user.verify_phone(code):
                logger.info(f"Phone verified for user: {user.username}")
                return Response({'message': SUCCESS_MESSAGES['phone_verified']})
            
            return Response({'error': 'کد تایید نامعتبر است'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        """دریافت IP کلاینت"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserStatsViewSet(viewsets.ViewSet):
    """ViewSet برای آمار کاربران"""
    permission_classes = [IsAuthenticated]

    @method_decorator(cache_page(60 * 5))  # 5 minutes cache
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """آمار کلی کاربران"""
        now = timezone.now()
        today = now.date()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'verified_users': User.objects.filter(
                Q(is_email_verified=True) | Q(is_phone_verified=True)
            ).count(),
            'new_users_today': User.objects.filter(date_joined__date=today).count(),
            'new_users_this_week': User.objects.filter(date_joined__gte=week_ago).count(),
            'new_users_this_month': User.objects.filter(date_joined__gte=month_ago).count(),
            'online_users': UserSession.objects.filter(
                is_active=True,
                last_activity__gte=now - timedelta(minutes=15)
            ).count(),
            'user_types_distribution': dict(
                User.objects.values('user_type').annotate(count=Count('id')).values_list('user_type', 'count')
            ),
            'verification_status_distribution': {
                'email_verified': User.objects.filter(is_email_verified=True).count(),
                'phone_verified': User.objects.filter(is_phone_verified=True).count(),
                'both_verified': User.objects.filter(
                    is_email_verified=True, is_phone_verified=True
                ).count(),
                'not_verified': User.objects.filter(
                    is_email_verified=False, is_phone_verified=False
                ).count(),
            }
        }
        
        serializer = UserStatsSerializer(stats)
        return Response(serializer.data)
