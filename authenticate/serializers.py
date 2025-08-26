# authenticate/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from datetime import timedelta

from .models import User, UserProfile, UserSession, PasswordResetToken
from .constants import USER_TYPES, USER_STATUS, VERIFICATION_METHODS, ERROR_MESSAGES, SUCCESS_MESSAGES


class UserSerializer(serializers.ModelSerializer):
    """سریالایزر کاربر"""
    full_name = serializers.SerializerMethodField()
    is_verified = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone_number', 'date_of_birth', 'avatar', 'user_type', 'status',
            'is_email_verified', 'is_phone_verified', 'is_verified',
            'language', 'timezone', 'login_count', 'last_activity',
            'date_joined', 'last_login'
        ]
        read_only_fields = [
            'id', 'is_email_verified', 'is_phone_verified', 'is_verified',
            'login_count', 'last_activity', 'date_joined', 'last_login'
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserProfileSerializer(serializers.ModelSerializer):
    """سریالایزر پروفایل کاربر"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'bio', 'website', 'location',
            'is_profile_public', 'show_email', 'show_phone',
            'email_notifications', 'sms_notifications', 'push_notifications'
        ]
        read_only_fields = ['id', 'user']


class UserCreateSerializer(serializers.ModelSerializer):
    """سریالایزر ایجاد کاربر"""
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        max_length=128,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'phone_number',
            'date_of_birth', 'password', 'password_confirm', 'user_type'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
        }

    def validate_email(self, value):
        """اعتبارسنجی ایمیل"""
        if User.objects.filter(email=value).exists():
            raise ValidationError(ERROR_MESSAGES['email_already_exists'])
        return value

    def validate_username(self, value):
        """اعتبارسنجی نام کاربری"""
        if User.objects.filter(username=value).exists():
            raise ValidationError(ERROR_MESSAGES['username_already_exists'])
        return value

    def validate_phone_number(self, value):
        """اعتبارسنجی شماره تلفن"""
        if value and User.objects.filter(phone_number=value).exists():
            raise ValidationError(ERROR_MESSAGES['phone_already_exists'])
        return value

    def validate(self, data):
        """اعتبارسنجی کلی"""
        if data['password'] != data['password_confirm']:
            raise ValidationError({'password_confirm': 'رمز عبور و تکرار آن یکسان نیستند.'})
        
        # اعتبارسنجی رمز عبور
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise ValidationError({'password': e.messages})
        
        return data

    def create(self, validated_data):
        """ایجاد کاربر"""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        # ایجاد پروفایل کاربر
        UserProfile.objects.create(user=user)
        
        # تولید توکن تایید ایمیل
        if user.email:
            user.generate_email_verification_token()
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """سریالایزر بروزرسانی کاربر"""
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number', 'date_of_birth',
            'avatar', 'language', 'timezone'
        ]

    def validate_phone_number(self, value):
        """اعتبارسنجی شماره تلفن"""
        user = self.instance
        if value and User.objects.filter(phone_number=value).exclude(id=user.id).exists():
            raise ValidationError(ERROR_MESSAGES['phone_already_exists'])
        return value


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """سریالایزر بروزرسانی پروفایل"""
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'website', 'location', 'is_profile_public',
            'show_email', 'show_phone', 'email_notifications',
            'sms_notifications', 'push_notifications'
        ]


class LoginSerializer(serializers.Serializer):
    """سریالایزر ورود"""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(
        max_length=128,
        style={'input_type': 'password'}
    )
    remember_me = serializers.BooleanField(default=False)

    def validate(self, data):
        """اعتبارسنجی ورود"""
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise ValidationError(ERROR_MESSAGES['invalid_credentials'])
            
            if not user.is_active:
                raise ValidationError(ERROR_MESSAGES['account_disabled'])
            
            if user.status == 'suspended':
                raise ValidationError(ERROR_MESSAGES['account_suspended'])
            
            if user.status == 'banned':
                raise ValidationError(ERROR_MESSAGES['account_banned'])
            
            data['user'] = user
        else:
            raise ValidationError(ERROR_MESSAGES['invalid_credentials'])

        return data


class PasswordChangeSerializer(serializers.Serializer):
    """سریالایزر تغییر رمز عبور"""
    current_password = serializers.CharField(
        max_length=128,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        max_length=128,
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        max_length=128,
        style={'input_type': 'password'}
    )

    def validate_current_password(self, value):
        """اعتبارسنجی رمز عبور فعلی"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise ValidationError('رمز عبور فعلی اشتباه است.')
        return value

    def validate(self, data):
        """اعتبارسنجی کلی"""
        if data['new_password'] != data['new_password_confirm']:
            raise ValidationError({'new_password_confirm': 'رمز عبور جدید و تکرار آن یکسان نیستند.'})
        
        # اعتبارسنجی رمز عبور جدید
        try:
            validate_password(data['new_password'])
        except ValidationError as e:
            raise ValidationError({'new_password': e.messages})
        
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """سریالایزر درخواست بازنشانی رمز عبور"""
    email = serializers.EmailField()

    def validate_email(self, value):
        """اعتبارسنجی ایمیل"""
        if not User.objects.filter(email=value, is_active=True).exists():
            raise ValidationError('کاربری با این ایمیل یافت نشد.')
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """سریالایزر تایید بازنشانی رمز عبور"""
    token = serializers.CharField()
    new_password = serializers.CharField(
        max_length=128,
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        max_length=128,
        style={'input_type': 'password'}
    )

    def validate_token(self, value):
        """اعتبارسنجی توکن"""
        try:
            token = PasswordResetToken.objects.get(token=value)
            if not token.is_valid():
                raise ValidationError(ERROR_MESSAGES['expired_token'])
        except PasswordResetToken.DoesNotExist:
            raise ValidationError(ERROR_MESSAGES['invalid_token'])
        
        return value

    def validate(self, data):
        """اعتبارسنجی کلی"""
        if data['new_password'] != data['new_password_confirm']:
            raise ValidationError({'new_password_confirm': 'رمز عبور جدید و تکرار آن یکسان نیستند.'})
        
        # اعتبارسنجی رمز عبور جدید
        try:
            validate_password(data['new_password'])
        except ValidationError as e:
            raise ValidationError({'new_password': e.messages})
        
        return data


class EmailVerificationSerializer(serializers.Serializer):
    """سریالایزر تایید ایمیل"""
    token = serializers.CharField()

    def validate_token(self, value):
        """اعتبارسنجی توکن"""
        try:
            user = User.objects.get(email_verification_token=value)
            if user.is_email_verified:
                raise ValidationError('ایمیل قبلاً تایید شده است.')
        except User.DoesNotExist:
            raise ValidationError(ERROR_MESSAGES['invalid_token'])
        
        return value


class PhoneVerificationSerializer(serializers.Serializer):
    """سریالایزر تایید تلفن"""
    code = serializers.CharField(max_length=6)

    def validate_code(self, value):
        """اعتبارسنجی کد"""
        try:
            user = User.objects.get(phone_verification_code=value)
            if user.is_phone_verified:
                raise ValidationError('شماره تلفن قبلاً تایید شده است.')
        except User.DoesNotExist:
            raise ValidationError('کد تایید نامعتبر است.')
        
        return value


class PhoneVerificationRequestSerializer(serializers.Serializer):
    """سریالایزر درخواست کد تایید تلفن"""
    phone_number = serializers.CharField(max_length=17)

    def validate_phone_number(self, value):
        """اعتبارسنجی شماره تلفن"""
        try:
            user = User.objects.get(phone_number=value)
            if user.is_phone_verified:
                raise ValidationError('شماره تلفن قبلاً تایید شده است.')
        except User.DoesNotExist:
            raise ValidationError('کاربری با این شماره تلفن یافت نشد.')
        
        return value


class UserSessionSerializer(serializers.ModelSerializer):
    """سریالایزر جلسات کاربر"""
    class Meta:
        model = UserSession
        fields = [
            'id', 'session_key', 'ip_address', 'user_agent',
            'created_at', 'last_activity', 'is_active'
        ]
        read_only_fields = ['id', 'session_key', 'ip_address', 'user_agent', 'created_at', 'last_activity']


class UserStatsSerializer(serializers.Serializer):
    """سریالایزر آمار کاربر"""
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    verified_users = serializers.IntegerField()
    new_users_today = serializers.IntegerField()
    new_users_this_week = serializers.IntegerField()
    new_users_this_month = serializers.IntegerField()
    online_users = serializers.IntegerField()
    user_types_distribution = serializers.DictField()
    verification_status_distribution = serializers.DictField()
