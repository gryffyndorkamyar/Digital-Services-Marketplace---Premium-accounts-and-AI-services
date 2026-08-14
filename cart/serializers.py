# cart/serializers.py
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal

from .models import Cart, CartItem, Order, OrderItem, Coupon, Payment
from .constants import ERROR_MESSAGES, SUCCESS_MESSAGES


class CartItemSerializer(serializers.ModelSerializer):
    """سریالایزر آیتم سبد خرید"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.main_image', read_only=True)
    variant_name = serializers.CharField(source='variant.name', read_only=True)
    total_price = serializers.ReadOnlyField()
    final_price = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    download_file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_name', 'product_image', 'variant', 'variant_name',
            'quantity', 'price', 'discount_amount', 'total_price', 'final_price',
            'status', 'is_available', 'content', 'download_file', 'download_file_url',
            'download_url', 'is_delivered', 'delivered_at', 'added_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'price', 'discount_amount', 'status', 'added_at', 'updated_at', 'delivered_at',
            'download_file', 'download_file_url'
        ]

    def get_download_file_url(self, obj):
        if obj.download_file and hasattr(obj.download_file, 'url') and obj.download_file.url:
            request = self.context.get('request')
            if request:
                try:
                    return request.build_absolute_uri(obj.download_file.url)
                except Exception:
                    return obj.download_file.url
            return obj.download_file.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        # نمایش محتوا فقط در صورتی که تحویل شده باشد و کاربر صاحب سبد یا ادمین باشد
        is_owner = user and (user.is_staff or user.is_superuser or instance.cart.user == user)
        if not instance.is_delivered or not is_owner:
            data['content'] = None
            data['download_file_url'] = None
            data['download_url'] = None
        return data


class CartSerializer(serializers.ModelSerializer):
    """سریالایزر سبد خرید"""
    items = serializers.SerializerMethodField()
    total_items = serializers.ReadOnlyField()
    subtotal = serializers.ReadOnlyField()
    discount_amount = serializers.ReadOnlyField()
    total = serializers.ReadOnlyField()
    can_checkout = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'session_key', 'status', 'items', 'total_items',
            'subtotal', 'discount_amount', 'total', 'can_checkout', 'is_expired',
            'created_at', 'updated_at', 'expires_at'
        ]
        read_only_fields = [
            'id', 'user', 'session_key', 'status', 'created_at', 'updated_at', 'expires_at'
        ]
    
    def get_items(self, obj):
        """فقط آیتم‌های active را برگردان"""
        active_items = obj.items.filter(status='active')
        return CartItemSerializer(active_items, many=True, context=self.context).data


class CartCreateSerializer(serializers.ModelSerializer):
    """سریالایزر ایجاد سبد خرید"""
    class Meta:
        model = Cart
        fields = ['session_key']
        # user از request.user میاد و نباید در body باشه


class AddToCartSerializer(serializers.Serializer):
    """سریالایزر افزودن به سبد خرید"""
    product_id = serializers.UUIDField()
    variant_id = serializers.UUIDField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, max_value=100, default=1)

    def validate(self, data):
        """اعتبارسنجی"""
        from common.models import Product, ProductVariant
        
        try:
            product = Product.objects.get(id=data['product_id'])
            if not product.is_active or product.status != 'active':
                raise ValidationError('محصول در دسترس نیست.')
            
            if data.get('variant_id'):
                try:
                    variant = ProductVariant.objects.get(
                        id=data['variant_id'],
                        product=product
                    )
                    if not variant.is_unlimited_stock and variant.stock_quantity < data['quantity']:
                        raise ValidationError(ERROR_MESSAGES['insufficient_stock'])
                except ProductVariant.DoesNotExist:
                    raise ValidationError('نوع محصول یافت نشد.')
            else:
                if not product.is_unlimited_stock and product.stock_quantity < data['quantity']:
                    raise ValidationError(ERROR_MESSAGES['insufficient_stock'])
        
        except Product.DoesNotExist:
            raise ValidationError('محصول یافت نشد.')
        
        return data


class UpdateCartItemSerializer(serializers.ModelSerializer):
    """سریالایزر بروزرسانی آیتم سبد خرید"""
    class Meta:
        model = CartItem
        fields = ['quantity']

    def validate_quantity(self, value):
        """اعتبارسنجی تعداد"""
        if value < 1:
            raise ValidationError(ERROR_MESSAGES['invalid_quantity'])
        
        # بررسی موجودی
        if self.instance.variant:
            if self.instance.variant.stock_quantity < value:
                raise ValidationError(ERROR_MESSAGES['insufficient_stock'])
        else:
            if self.instance.product.stock_quantity < value:
                raise ValidationError(ERROR_MESSAGES['insufficient_stock'])
        
        return value


class CouponSerializer(serializers.ModelSerializer):
    """سریالایزر کوپن"""
    is_valid = serializers.ReadOnlyField()
    
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'title', 'description', 'coupon_type', 'discount_value',
            'min_order_amount', 'max_discount_amount', 'usage_limit', 'used_count',
            'status', 'valid_from', 'valid_until', 'is_valid', 'created_at'
        ]
        read_only_fields = [
            'id', 'used_count', 'status', 'created_at'
        ]


class ApplyCouponSerializer(serializers.Serializer):
    """سریالایزر اعمال کوپن"""
    code = serializers.CharField(max_length=20)

    def validate_code(self, value):
        """اعتبارسنجی کد کوپن"""
        try:
            coupon = Coupon.objects.get(code=value.upper())
            if not coupon.is_valid():
                raise ValidationError(ERROR_MESSAGES['coupon_expired'])
        except Coupon.DoesNotExist:
            raise ValidationError(ERROR_MESSAGES['invalid_coupon'])
        
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    """سریالایزر آیتم سفارش"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.main_image', read_only=True)
    variant_name = serializers.CharField(source='variant.name', read_only=True)
    download_file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_image', 'variant', 'variant_name',
            'quantity', 'price', 'discount_amount', 'total_price',
            'content', 'download_file_url', 'download_url', 'is_delivered', 'delivered_at'
        ]
        read_only_fields = [
            'id', 'price', 'discount_amount', 'total_price', 
            'content', 'download_file_url', 'download_url', 'is_delivered', 'delivered_at'
        ]
    
    def get_download_file_url(self, obj):
        """URL فایل دانلود"""
        if obj.download_file and hasattr(obj.download_file, 'url') and obj.download_file.url:
            request = self.context.get('request')
            if request:
                try:
                    return request.build_absolute_uri(obj.download_file.url)
                except:
                    return obj.download_file.url
            return obj.download_file.url
        return None
    
    def to_representation(self, instance):
        """نمایش محتوا فقط بعد از پرداخت و تحویل"""
        data = super().to_representation(instance)
        
        request = self.context.get('request')
        
        # اگر سفارش پرداخت نشده یا تحویل نشده، محتوا رو نشون نده
        if instance.order.payment_status != 'completed' or not instance.is_delivered:
            data['content'] = None
            data['download_file_url'] = None
            data['download_url'] = None
        
        # اگر کاربر صاحب سفارش نیست و admin هم نیست، محتوا رو نشون نده
        if request:
            if request.user != instance.order.user and not (request.user.is_staff or request.user.is_superuser):
                data['content'] = None
                data['download_file_url'] = None
                data['download_url'] = None
        
        return data


class OrderSerializer(serializers.ModelSerializer):
    """سریالایزر سفارش"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    coupon_code = serializers.CharField(source='coupon.code', read_only=True)
    total_items = serializers.ReadOnlyField()
    can_cancel = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'user_name', 'user_email', 'cart', 'coupon', 'coupon_code',
            'status', 'subtotal', 'discount_amount', 'total_amount', 'payment_method',
            'payment_status', 'notes', 'items', 'total_items', 'can_cancel',
            'created_at', 'updated_at', 'paid_at'
        ]
        read_only_fields = [
            'id', 'order_number', 'user', 'cart', 'coupon', 'status', 'subtotal',
            'discount_amount', 'total_amount', 'payment_status', 'created_at',
            'updated_at', 'paid_at'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """سریالایزر ایجاد سفارش"""
    coupon_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    cart = serializers.PrimaryKeyRelatedField(
        queryset=Cart.objects.none(),  # در متد __init__ override می‌شه
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Order
        fields = ['cart', 'payment_method', 'notes', 'coupon_code']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # تنظیم queryset برای cart بر اساس request.user
        # همه سبد خریدهای کاربر رو شامل می‌کنه (نه فقط active)
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            self.fields['cart'].queryset = Cart.objects.filter(
                user=request.user
            )

    def validate_cart(self, value):
        """اعتبارسنجی سبد خرید"""
        # اگر cart ارسال نشد، خودکار پیدا کن
        if not value:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                from .models import Cart, CartItem
                from django.db.models import Sum
                
                # ابتدا دنبال سبد خرید فعال که آیتم فعال داشته باشه بگرد
                cart_ids_with_items = CartItem.objects.filter(
                    status='active',
                    cart__user=request.user,
                    cart__status='active'
                ).values('cart_id').annotate(
                    total=Sum('quantity')
                ).filter(total__gt=0).values_list('cart_id', flat=True)
                
                if cart_ids_with_items:
                    value = Cart.objects.get(id=cart_ids_with_items[0])
                else:
                    # اگر پیدا نکرد، دنبال هر سبد خرید با آیتم‌های فعال بگرد
                    cart_ids_with_items = CartItem.objects.filter(
                        status='active',
                        cart__user=request.user
                    ).values('cart_id').annotate(
                        total=Sum('quantity')
                    ).filter(total__gt=0).values_list('cart_id', flat=True)
                    
                    if cart_ids_with_items:
                        value = Cart.objects.get(id=cart_ids_with_items[0])
        
        if not value:
            raise ValidationError('شما سبد خرید فعالی ندارید. لطفاً ابتدا محصولی به سبد خرید اضافه کنید.')
        
        # بررسی شرایط checkout
        errors = []
        
        if value.status == 'converted':
            errors.append('این سبد خرید قبلاً به سفارش تبدیل شده است. لطفاً یک سبد خرید جدید بسازید.')
        elif value.status != 'active':
            # اگر status != 'active' ولی آیتم فعال داره، status رو active کن
            if value.get_total_items() > 0:
                value.status = 'active'
                value.save()
            else:
                errors.append(f'وضعیت سبد خرید باید active باشد (فعلاً: {value.get_status_display()})')
        
        if value.is_expired():
            errors.append('سبد خرید منقضی شده است.')
        
        # بررسی دقیق‌تر: آیا واقعاً آیتم فعال وجود دارد؟
        total_items = value.get_total_items()
        if total_items == 0:
            # یک بار دیگر بررسی کن - شاید مشکل در cache باشد
            from django.db.models import Sum
            from .models import CartItem
            actual_count = CartItem.objects.filter(
                cart=value,
                status='active'
            ).aggregate(total=Sum('quantity'))['total'] or 0
            
            if actual_count == 0:
                errors.append('سبد خرید باید حداقل یک آیتم فعال داشته باشد. لطفاً ابتدا محصولی به سبد خرید اضافه کنید.')
        
        if errors:
            raise ValidationError('. '.join(errors))
        
        return value

    def validate_coupon_code(self, value):
        """اعتبارسنجی کد کوپن"""
        if value:
            try:
                coupon = Coupon.objects.get(code=value.upper())
                if not coupon.is_valid():
                    raise ValidationError(ERROR_MESSAGES['coupon_expired'])
            except Coupon.DoesNotExist:
                raise ValidationError(ERROR_MESSAGES['invalid_coupon'])
        return value


class PaymentSerializer(serializers.ModelSerializer):
    """سریالایزر پرداخت"""
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    is_successful = serializers.ReadOnlyField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_number', 'payment_id', 'amount', 'payment_method',
            'status', 'gateway_response', 'is_successful', 'created_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'order', 'payment_id', 'gateway_response', 'created_at', 'completed_at'
        ]


class CartStatsSerializer(serializers.Serializer):
    """سریالایزر آمار سبد خرید"""
    total_carts = serializers.IntegerField()
    active_carts = serializers.IntegerField()
    expired_carts = serializers.IntegerField()
    total_items = serializers.IntegerField()
    average_items_per_cart = serializers.FloatField()
    total_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_cart_value = serializers.DecimalField(max_digits=10, decimal_places=2)


class OrderStatsSerializer(serializers.Serializer):
    """سریالایزر آمار سفارشات"""
    total_orders = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    completed_orders = serializers.IntegerField()
    cancelled_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    orders_today = serializers.IntegerField()
    orders_this_week = serializers.IntegerField()
    orders_this_month = serializers.IntegerField()
    status_distribution = serializers.DictField()
