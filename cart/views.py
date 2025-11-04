# cart/views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from django.core.cache import cache
from django.shortcuts import get_object_or_404
from datetime import timedelta
import logging

from .models import Cart, CartItem, Order, OrderItem, Coupon, Payment
from .serializers import (
    CartSerializer, CartCreateSerializer, CartItemSerializer, AddToCartSerializer,
    UpdateCartItemSerializer, OrderSerializer, OrderCreateSerializer, OrderItemSerializer,
    CouponSerializer, ApplyCouponSerializer, PaymentSerializer,
    CartStatsSerializer, OrderStatsSerializer
)
from .constants import ERROR_MESSAGES, SUCCESS_MESSAGES

logger = logging.getLogger(__name__)


class CartViewSet(viewsets.ModelViewSet):
    """ViewSet برای مدیریت سبد خرید"""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """QuerySet سفارشی"""
        return Cart.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return CartCreateSerializer
        return CartSerializer

    def perform_create(self, serializer):
        """ایجاد سبد خرید"""
        serializer.save(user=self.request.user)
        logger.info(f"Cart created for user: {self.request.user.username}")

    @action(detail=False, methods=['get'])
    def active(self, request):
        """سبد خرید فعال"""
        cart = self.get_queryset().filter(status='active').first()
        if not cart:
            cart = Cart.objects.create(user=request.user)
        
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        """افزودن آیتم به سبد خرید"""
        cart = self.get_object()
        serializer = AddToCartSerializer(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            product_id = data['product_id']
            variant_id = data.get('variant_id')
            quantity = data['quantity']
            
            # بررسی وجود آیتم در سبد خرید
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_id=product_id,
                variant_id=variant_id,
                defaults={
                    'quantity': quantity,
                    'price': self.get_product_price(product_id, variant_id)
                }
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            logger.info(f"Item added to cart: {cart_item.product.name}")
            return Response({
                'message': SUCCESS_MESSAGES['item_added'],
                'cart_item': CartItemSerializer(cart_item).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def remove_item(self, request, pk=None):
        """حذف آیتم از سبد خرید"""
        cart = self.get_object()
        item_id = request.data.get('item_id')
        
        try:
            cart_item = cart.items.get(id=item_id)
            cart_item.status = 'removed'
            cart_item.save()
            
            logger.info(f"Item removed from cart: {cart_item.product.name}")
            return Response({'message': SUCCESS_MESSAGES['item_removed']})
        
        except CartItem.DoesNotExist:
            return Response(
                {'error': ERROR_MESSAGES['item_not_found']},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def update_item(self, request, pk=None):
        """بروزرسانی آیتم سبد خرید"""
        cart = self.get_object()
        item_id = request.data.get('item_id')
        
        try:
            cart_item = cart.items.get(id=item_id)
            serializer = UpdateCartItemSerializer(cart_item, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Cart item updated: {cart_item.product.name}")
                return Response({
                    'message': SUCCESS_MESSAGES['item_updated'],
                    'cart_item': CartItemSerializer(cart_item).data
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except CartItem.DoesNotExist:
            return Response(
                {'error': ERROR_MESSAGES['item_not_found']},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def clear(self, request, pk=None):
        """پاک کردن سبد خرید"""
        cart = self.get_object()
        cart.clear()
        
        logger.info(f"Cart cleared for user: {request.user.username}")
        return Response({'message': SUCCESS_MESSAGES['cart_cleared']})

    @action(detail=True, methods=['post'])
    def apply_coupon(self, request, pk=None):
        """اعمال کوپن"""
        cart = self.get_object()
        serializer = ApplyCouponSerializer(data=request.data)
        
        if serializer.is_valid():
            code = serializer.validated_data['code']
            try:
                coupon = Coupon.objects.get(code=code.upper())
                
                if not coupon.can_use(request.user, cart.get_total()):
                    return Response(
                        {'error': ERROR_MESSAGES['invalid_coupon']},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # اعمال تخفیف به آیتم‌ها
                discount_amount = coupon.calculate_discount(cart.get_subtotal())
                self.apply_discount_to_items(cart, discount_amount)
                
                logger.info(f"Coupon applied: {coupon.code}")
                return Response({
                    'message': SUCCESS_MESSAGES['coupon_applied'],
                    'discount_amount': discount_amount
                })
            
            except Coupon.DoesNotExist:
                return Response(
                    {'error': ERROR_MESSAGES['invalid_coupon']},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_product_price(self, product_id, variant_id=None):
        """دریافت قیمت محصول"""
        from common.models import Product, ProductVariant
        
        if variant_id:
            variant = ProductVariant.objects.get(id=variant_id)
            return variant.current_price
        else:
            product = Product.objects.get(id=product_id)
            return product.current_price

    def apply_discount_to_items(self, cart, total_discount):
        """اعمال تخفیف به آیتم‌ها"""
        items = cart.items.filter(status='active')
        if not items:
            return
        
        # تقسیم تخفیف بر اساس قیمت آیتم‌ها
        total_price = sum(item.get_total_price() for item in items)
        for item in items:
            item_discount = (item.get_total_price() / total_price) * total_discount
            item.discount_amount = item_discount
            item.save()


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet برای مدیریت سفارشات"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'payment_method']
    search_fields = ['order_number']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']

    def get_queryset(self):
        """QuerySet سفارشی"""
        # اگر کاربر staff یا superuser باشه، همه سفارشات رو نشون بده
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Order.objects.all()
        # وگرنه فقط سفارشات خود کاربر رو نشون بده
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        """ساخت سفارش با response کامل"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = self.perform_create(serializer)
        
        # برگرداندن response با OrderSerializer
        response_serializer = OrderSerializer(order, context={'request': request})
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """ایجاد سفارش"""
        # cart از serializer.validated_data میاد (یا خودکار پیدا شده یا کاربر ارسال کرده)
        cart = serializer.validated_data.get('cart')
        
        # بررسی اینکه cart موجود باشه (باید در serializer validate شده باشه)
        if not cart:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'cart': 'سبد خرید یافت نشد.'})
        
        # بررسی اینکه cart متعلق به کاربر فعلی باشه (امنیت)
        if cart.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('شما اجازه دسترسی به این سبد خرید را ندارید.')
        
        # اگر cart status != 'active' باشه ولی آیتم‌های فعال داشته باشه، active کن
        if cart.status != 'active' and cart.get_total_items() > 0:
            cart.status = 'active'
            cart.save()
        
        coupon_code = serializer.validated_data.get('coupon_code')
        
        # محاسبه مبالغ
        subtotal = cart.get_subtotal()
        discount_amount = cart.get_discount_amount()
        
        # اعمال کوپن
        coupon = None
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper())
                if coupon.can_use(self.request.user, subtotal):
                    coupon_discount = coupon.calculate_discount(subtotal)
                    discount_amount += coupon_discount
                    coupon.used_count += 1
                    coupon.save()
            except Coupon.DoesNotExist:
                pass
        
        total_amount = subtotal - discount_amount
        
        # ایجاد سفارش
        order = serializer.save(
            user=self.request.user,
            subtotal=subtotal,
            discount_amount=discount_amount,
            total_amount=total_amount,
            coupon=coupon
        )
        
        # ایجاد آیتم‌های سفارش
        self.create_order_items(order, cart)
        
        # تغییر وضعیت سبد خرید
        cart.status = 'converted'
        cart.save()
        
        logger.info(f"Order created: {order.order_number}")
        return order

    def create_order_items(self, order, cart):
        """ایجاد آیتم‌های سفارش"""
        for cart_item in cart.items.filter(status='active'):
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                quantity=cart_item.quantity,
                price=cart_item.price,
                discount_amount=cart_item.discount_amount
            )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """لغو سفارش"""
        order = self.get_object()
        
        if order.can_cancel():
            order.cancel()
            logger.info(f"Order cancelled: {order.order_number}")
            return Response({'message': SUCCESS_MESSAGES['order_cancelled']})
        
        return Response(
            {'error': 'سفارش قابل لغو نیست.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        """پردازش پرداخت با زرین پال"""
        order = self.get_object()
        
        # بررسی اینکه سفارش قابل پرداخت باشه
        if order.payment_status == 'completed':
            return Response(
                {'error': 'این سفارش قبلاً پرداخت شده است.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # بررسی نوع پرداخت
        if order.payment_method == 'online':
            # استفاده از درگاه زرین پال
            from .zarinpal import get_zarinpal_gateway
            from django.urls import reverse
            
            gateway = get_zarinpal_gateway()
            
            # ایجاد callback URL
            callback_url = request.build_absolute_uri(
                f'/api/orders/{order.id}/zarinpal-callback/'
            )
            
            # اطلاعات کاربر
            mobile = getattr(order.user, 'phone_number', None)
            email = getattr(order.user, 'email', None)
            
            # ایجاد درخواست پرداخت
            result = gateway.create_payment_request(
                amount=order.total_amount,
                description=f"پرداخت سفارش {order.order_number}",
                callback_url=callback_url,
                mobile=mobile,
                email=email
            )
            
            if result['success']:
                # ایجاد رکورد پرداخت
                payment = Payment.objects.create(
                    order=order,
                    payment_id=result['authority'],
                    amount=order.total_amount,
                    payment_method=order.payment_method,
                    status='pending',
                    gateway_response=result.get('data', {})
                )
                
                logger.info(f"Payment request created: {result['authority']} for order {order.order_number}")
                return Response({
                    'message': 'درخواست پرداخت با موفقیت ایجاد شد.',
                    'payment_url': result['payment_url'],
                    'authority': result['authority'],
                    'payment_id': payment.id
                })
            else:
                logger.error(f"Payment request failed: {result.get('message', 'Unknown error')}")
                return Response(
                    {'error': result.get('message', 'خطا در ایجاد درخواست پرداخت')},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # برای سایر روش‌های پرداخت (wallet, credit, etc.)
            payment = Payment.objects.create(
                order=order,
                payment_id=f"PAY{timezone.now().strftime('%Y%m%d%H%M%S')}",
                amount=order.total_amount,
                payment_method=order.payment_method,
                status='completed'
            )
            
            order.payment_status = 'completed'
            order.status = 'paid'
            order.paid_at = timezone.now()
            order.save()
            
            logger.info(f"Payment processed: {payment.payment_id}")
            return Response({
                'message': SUCCESS_MESSAGES['payment_successful'],
                'payment': PaymentSerializer(payment).data
            })
    
    @action(detail=True, methods=['get', 'post'], url_path='zarinpal-callback', permission_classes=[AllowAny])
    def zarinpal_callback(self, request, pk=None):
        """Callback از زرین پال"""
        # به جای self.get_object() که نیاز به authentication داره
        # مستقیم سفارش رو پیدا می‌کنیم چون زرین‌پال token نمی‌فرسته
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': 'سفارش یافت نشد.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # دریافت authority و status از query parameters
        authority = request.query_params.get('Authority') or request.data.get('Authority')
        status_code = request.query_params.get('Status') or request.data.get('Status')
        
        if not authority:
            return Response(
                {'error': 'Authority parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # پیدا کردن payment با authority
        try:
            payment = Payment.objects.get(
                order=order,
                payment_id=authority,
                status='pending'
            )
        except Payment.DoesNotExist:
            return Response(
                {'error': 'پرداخت یافت نشد.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # بررسی status از زرین پال
        if status_code != 'OK':
            payment.status = 'failed'
            payment.gateway_response = {
                'status': status_code,
                'message': 'کاربر پرداخت را لغو کرد.'
            }
            payment.save()
            
            return Response({
                'message': 'پرداخت لغو شد.',
                'status': 'cancelled'
            })
        
        # تایید پرداخت با زرین پال
        from .zarinpal import get_zarinpal_gateway
        
        gateway = get_zarinpal_gateway()
        verify_result = gateway.verify_payment(
            authority=authority,
            amount=order.total_amount
        )
        
        if verify_result['success']:
            # پرداخت موفق
            payment.status = 'completed'
            payment.payment_id = verify_result.get('ref_id', authority)
            payment.gateway_response = verify_result.get('data', {})
            payment.completed_at = timezone.now()
            payment.save()
            
            order.payment_status = 'completed'
            order.status = 'paid'
            order.paid_at = timezone.now()
            order.save()
            
            logger.info(f"Payment verified: {payment.payment_id} for order {order.order_number}")
            return Response({
                'message': 'پرداخت با موفقیت انجام شد.',
                'status': 'success',
                'payment': PaymentSerializer(payment).data
            })
        else:
            # پرداخت ناموفق
            payment.status = 'failed'
            payment.gateway_response = verify_result.get('data', {})
            payment.save()
            
            logger.error(f"Payment verification failed: {verify_result.get('message', 'Unknown')}")
            return Response({
                'message': verify_result.get('message', 'خطا در تایید پرداخت'),
                'status': 'failed'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='items/(?P<item_id>[^/.]+)/content')
    def item_content(self, request, pk=None, item_id=None):
        """دریافت محتوای یک آیتم سفارش"""
        order = self.get_object()
        
        # بررسی اینکه سفارش متعلق به کاربر فعلی باشه
        if order.user != request.user and not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'شما اجازه دسترسی به این سفارش را ندارید.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            item = order.items.get(id=item_id)
        except OrderItem.DoesNotExist:
            return Response(
                {'error': 'آیتم سفارش یافت نشد.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # فقط اگر سفارش پرداخت شده و تحویل شده، محتوا رو نشون بده
        if order.payment_status != 'completed' or not item.is_delivered:
            return Response({
                'message': 'محصول هنوز تحویل نشده است.',
                'is_delivered': item.is_delivered,
                'payment_status': order.payment_status
            })
        
        serializer = OrderItemSerializer(item, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post', 'patch'], url_path='items/(?P<item_id>[^/.]+)/upload_content')
    def upload_item_content(self, request, pk=None, item_id=None):
        """آپلود محتوای یک آیتم سفارش (فقط برای Admin)"""
        # بررسی دسترسی admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'شما اجازه انجام این عملیات را ندارید.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order = self.get_object()
        
        try:
            item = order.items.get(id=item_id)
        except OrderItem.DoesNotExist:
            return Response(
                {'error': 'آیتم سفارش یافت نشد.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # به‌روزرسانی محتوا
        item.content = request.data.get('content', item.content)
        item.download_url = request.data.get('download_url', item.download_url)
        
        # آپلود فایل (اگر ارسال شده)
        if 'download_file' in request.FILES:
            item.download_file = request.FILES['download_file']
        
        # اگر is_delivered ارسال شده
        if 'is_delivered' in request.data:
            is_delivered = request.data.get('is_delivered')
            if isinstance(is_delivered, str):
                is_delivered = is_delivered.lower() in ['true', '1', 'yes']
            item.is_delivered = bool(is_delivered)
            
            # اگر تحویل شده ولی تاریخ تحویل نداره، تاریخ رو تنظیم کن
            if item.is_delivered and not item.delivered_at:
                item.delivered_at = timezone.now()
        
        item.save()
        
        logger.info(f"Content uploaded for order item: {item.id} by admin: {request.user.username}")
        serializer = OrderItemSerializer(item, context={'request': request})
        return Response({
            'message': 'محتوای محصول با موفقیت به‌روزرسانی شد.',
            'item': serializer.data
        })


class CouponViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet برای کوپن‌ها"""
    queryset = Coupon.objects.filter(status='active')
    serializer_class = CouponSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['coupon_type']
    search_fields = ['code', 'title']

    @action(detail=False, methods=['post'])
    def validate(self, request):
        """اعتبارسنجی کوپن"""
        code = request.data.get('code')
        if not code:
            return Response(
                {'error': 'کد کوپن الزامی است.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            coupon = Coupon.objects.get(code=code.upper())
            if coupon.is_valid():
                return Response({
                    'valid': True,
                    'coupon': CouponSerializer(coupon).data
                })
            else:
                return Response({
                    'valid': False,
                    'error': ERROR_MESSAGES['coupon_expired']
                })
        except Coupon.DoesNotExist:
            return Response({
                'valid': False,
                'error': ERROR_MESSAGES['invalid_coupon']
            })


class CartStatsViewSet(viewsets.ViewSet):
    """ViewSet برای آمار سبد خرید"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """آمار سبد خرید"""
        carts = Cart.objects.filter(user=request.user)
        
        stats = {
            'total_carts': carts.count(),
            'active_carts': carts.filter(status='active').count(),
            'expired_carts': carts.filter(status='expired').count(),
            'total_items': carts.aggregate(
                total=Sum('items__quantity', filter=Q(items__status='active'))
            )['total'] or 0,
            'average_items_per_cart': carts.aggregate(
                avg=Avg('items__quantity', filter=Q(items__status='active'))
            )['avg'] or 0,
            'total_value': carts.aggregate(
                total=Sum('items__price', filter=Q(items__status='active'))
            )['total'] or 0,
            'average_cart_value': carts.aggregate(
                avg=Avg('items__price', filter=Q(items__status='active'))
            )['avg'] or 0,
        }
        
        serializer = CartStatsSerializer(stats)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """آمار سبد خرید (alias)"""
        return self.list(request)


class OrderStatsViewSet(viewsets.ViewSet):
    """ViewSet برای آمار سفارشات"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """آمار سفارشات"""
        orders = Order.objects.filter(user=request.user)
        now = timezone.now()
        
        stats = {
            'total_orders': orders.count(),
            'pending_orders': orders.filter(status='pending').count(),
            'completed_orders': orders.filter(status='delivered').count(),
            'cancelled_orders': orders.filter(status='cancelled').count(),
            'total_revenue': orders.filter(status='delivered').aggregate(
                total=Sum('total_amount')
            )['total'] or 0,
            'average_order_value': orders.aggregate(
                avg=Avg('total_amount')
            )['avg'] or 0,
            'orders_today': orders.filter(created_at__date=now.date()).count(),
            'orders_this_week': orders.filter(
                created_at__gte=now - timedelta(days=7)
            ).count(),
            'orders_this_month': orders.filter(
                created_at__gte=now - timedelta(days=30)
            ).count(),
            'status_distribution': dict(
                orders.values('status').annotate(count=Count('id')).values_list('status', 'count')
            ),
        }
        
        serializer = OrderStatsSerializer(stats)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """آمار سفارشات (alias)"""
        return self.list(request)

    permission_classes = [IsAuthenticated]

    def list(self, request):
        """آمار سفارشات"""
        orders = Order.objects.filter(user=request.user)
        now = timezone.now()
        
        stats = {
            'total_orders': orders.count(),
            'pending_orders': orders.filter(status='pending').count(),
            'completed_orders': orders.filter(status='delivered').count(),
            'cancelled_orders': orders.filter(status='cancelled').count(),
            'total_revenue': orders.filter(status='delivered').aggregate(
                total=Sum('total_amount')
            )['total'] or 0,
            'average_order_value': orders.aggregate(
                avg=Avg('total_amount')
            )['avg'] or 0,
            'orders_today': orders.filter(created_at__date=now.date()).count(),
            'orders_this_week': orders.filter(
                created_at__gte=now - timedelta(days=7)
            ).count(),
            'orders_this_month': orders.filter(
                created_at__gte=now - timedelta(days=30)
            ).count(),
            'status_distribution': dict(
                orders.values('status').annotate(count=Count('id')).values_list('status', 'count')
            ),
        }
        
        serializer = OrderStatsSerializer(stats)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """آمار سفارشات (alias)"""
        return self.list(request)
