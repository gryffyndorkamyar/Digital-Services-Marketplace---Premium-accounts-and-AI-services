# cart/admin.py
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.db.models import Sum, Count
from django.utils import timezone

from .models import Cart, CartItem, Order, OrderItem, Coupon, Payment


class CartItemInline(admin.TabularInline):
    """Inline برای آیتم‌های سبد خرید"""
    model = CartItem
    extra = 0
    readonly_fields = ['price', 'discount_amount', 'added_at', 'updated_at']
    fields = ['product', 'variant', 'quantity', 'price', 'discount_amount', 'status']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """مدیریت سبدهای خرید"""
    inlines = [CartItemInline]
    list_display = [
        'id', 'user', 'status', 'total_items', 'subtotal', 'total',
        'is_expired', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'expires_at']
    search_fields = ['user__username', 'user__email', 'session_key']
    readonly_fields = [
        'id', 'session_key', 'created_at', 'updated_at', 'expires_at'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('user', 'session_key', 'status')}),
        (_('زمان‌ها'), {
            'fields': ('created_at', 'updated_at', 'expires_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """ذخیره مدل با تنظیم user در صورت نبودن"""
        if not obj.user_id:  # اگر user انتخاب نشده
            obj.user = request.user  # از ادمین فعلی استفاده کن
        super().save_model(request, obj, form, change)
    
    def save_formset(self, request, form, formset, change):
        """ذخیره formset با تنظیم price برای CartItem‌ها"""
        instances = formset.save(commit=False)
        for instance in instances:
            # اگر price تنظیم نشده و product وجود داره
            if not instance.price and instance.product:
                if instance.variant:
                    # اگر variant داره، از variant استفاده کن
                    instance.price = instance.variant.current_price
                else:
                    # اگر variant نداره، از product استفاده کن
                    instance.price = instance.product.current_price
            
            # اگر quantity تنظیم نشده، default بذار
            if not instance.quantity:
                instance.quantity = 1
            
            instance.save()
        formset.save_m2m()

    def total_items(self, obj):
        """تعداد کل آیتم‌ها"""
        return obj.get_total_items()
    total_items.short_description = _('تعداد آیتم‌ها')

    def subtotal(self, obj):
        """مجموع بدون تخفیف"""
        return obj.get_subtotal()
    subtotal.short_description = _('مجموع')

    def total(self, obj):
        """مجموع نهایی"""
        return obj.get_total()
    total.short_description = _('مجموع نهایی')

    def is_expired(self, obj):
        """آیا منقضی شده است؟"""
        if obj.is_expired():
            return format_html('<span style="color: red;">✓</span>')
        return format_html('<span style="color: green;">✗</span>')
    is_expired.short_description = _('منقضی شده')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """مدیریت آیتم‌های سبد خرید"""
    list_display = [
        'id', 'cart', 'product', 'variant', 'quantity', 'price',
        'total_price', 'final_price', 'status', 'added_at'
    ]
    list_filter = ['status', 'added_at', 'updated_at']
    search_fields = ['cart__user__username', 'product__name', 'variant__name']
    readonly_fields = ['id', 'price', 'discount_amount', 'added_at', 'updated_at']
    ordering = ['-added_at']

    def total_price(self, obj):
        """قیمت کل آیتم"""
        return obj.get_total_price()
    total_price.short_description = _('قیمت کل')

    def final_price(self, obj):
        """قیمت نهایی با تخفیف"""
        return obj.get_final_price()
    final_price.short_description = _('قیمت نهایی')


class OrderItemInline(admin.TabularInline):
    """Inline برای آیتم‌های سفارش"""
    model = OrderItem
    extra = 0
    readonly_fields = ['discount_amount', 'total_price']
    fields = [
        'product', 'variant', 'quantity', 'price', 'discount_amount', 'total_price',
        'content', 'download_file', 'download_url', 'is_delivered', 'delivered_at'
    ]
    
    def save_formset(self, request, form, formset, change):
        """ذخیره formset با تنظیم تاریخ تحویل"""
        instances = formset.save(commit=False)
        for instance in instances:
            if instance.is_delivered and not instance.delivered_at:
                from django.utils import timezone
                instance.delivered_at = timezone.now()
            instance.save()
        formset.save_m2m()


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """مدیریت سفارشات"""
    inlines = [OrderItemInline]
    list_display = [
        'order_number', 'user', 'status', 'payment_status', 'total_items',
        'subtotal', 'discount_amount', 'total_amount', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__username', 'user__email']
    readonly_fields = [
        'id', 'order_number', 'user', 'cart', 'coupon', 'created_at',
        'updated_at', 'paid_at'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('order_number', 'user', 'cart', 'coupon')}),
        (_('وضعیت'), {
            'fields': ('status', 'payment_status', 'payment_method')
        }),
        (_('مبالغ'), {
            'fields': ('subtotal', 'discount_amount', 'total_amount')
        }),
        (_('یادداشت‌ها'), {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        (_('زمان‌ها'), {
            'fields': ('created_at', 'updated_at', 'paid_at'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        """ذخیره مدل با تنظیم user در صورت نبودن"""
        if not obj.user_id:  # اگر user انتخاب نشده
            obj.user = request.user  # از ادمین فعلی استفاده کن
        super().save_model(request, obj, form, change)
    
    def save_formset(self, request, form, formset, change):
        """ذخیره formset با تنظیم price برای OrderItem‌ها"""
        from django.utils import timezone
        
        instances = formset.save(commit=False)
        for instance in instances:
            # اگر price تنظیم نشده و product وجود داره
            if not instance.price and instance.product:
                if instance.variant:
                    # اگر variant داره، از variant استفاده کن
                    instance.price = instance.variant.current_price
                else:
                    # اگر variant نداره، از product استفاده کن
                    instance.price = instance.product.current_price
            
            # اگر quantity تنظیم نشده، default بذار
            if not instance.quantity:
                instance.quantity = 1
            
            # اگر is_delivered=True شده ولی delivered_at نداره، تاریخ تحویل رو تنظیم کن
            if instance.is_delivered and not instance.delivered_at:
                instance.delivered_at = timezone.now()
            
            instance.save()
        formset.save_m2m()

    def total_items(self, obj):
        """تعداد کل آیتم‌ها"""
        return obj.get_total_items()
    total_items.short_description = _('تعداد آیتم‌ها')

    def can_cancel(self, obj):
        """آیا می‌تواند لغو شود؟"""
        if obj.can_cancel():
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    can_cancel.short_description = _('قابل لغو')

    actions = ['mark_as_paid', 'mark_as_delivered', 'cancel_orders']

    def mark_as_paid(self, request, queryset):
        """علامت‌گذاری به عنوان پرداخت شده"""
        updated = queryset.update(
            payment_status='completed',
            status='paid',
            paid_at=timezone.now()
        )
        self.message_user(request, f'{updated} سفارش پرداخت شد.')
    mark_as_paid.short_description = _('علامت‌گذاری به عنوان پرداخت شده')

    def mark_as_delivered(self, request, queryset):
        """علامت‌گذاری به عنوان تحویل داده شده"""
        updated = queryset.update(status='delivered')
        self.message_user(request, f'{updated} سفارش تحویل داده شد.')
    mark_as_delivered.short_description = _('علامت‌گذاری به عنوان تحویل داده شده')

    def cancel_orders(self, request, queryset):
        """لغو سفارشات"""
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} سفارش لغو شد.')
    cancel_orders.short_description = _('لغو سفارشات')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """مدیریت آیتم‌های سفارش"""
    list_display = [
        'id', 'order', 'product', 'variant', 'quantity', 'price',
        'discount_amount', 'total_price', 'is_delivered', 'delivered_at'
    ]
    list_filter = ['order__status', 'order__created_at', 'is_delivered']
    search_fields = ['order__order_number', 'product__name', 'variant__name', 'content']
    readonly_fields = ['id', 'price', 'discount_amount', 'total_price', 'delivered_at']
    fieldsets = (
        ('اطلاعات سفارش', {
            'fields': ('order', 'product', 'variant', 'quantity')
        }),
        ('قیمت‌گذاری', {
            'fields': ('price', 'discount_amount', 'total_price')
        }),
        ('تحویل محصول', {
            'fields': ('content', 'download_file', 'download_url', 'is_delivered', 'delivered_at'),
            'description': 'اطلاعات محصول رو در اینجا وارد کن. بعد از تنظیم، is_delivered رو تیک بزن.'
        }),
    )
    ordering = ['-order__created_at']
    
    def save_model(self, request, obj, form, change):
        """ذخیره با تنظیم تاریخ تحویل"""
        if obj.is_delivered and not obj.delivered_at:
            from django.utils import timezone
            obj.delivered_at = timezone.now()
        elif not obj.is_delivered:
            obj.delivered_at = None
        super().save_model(request, obj, form, change)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    """مدیریت کوپن‌ها"""
    list_display = [
        'code', 'title', 'coupon_type', 'discount_value', 'usage_limit',
        'used_count', 'status', 'is_valid', 'valid_from', 'valid_until'
    ]
    list_filter = ['coupon_type', 'status', 'valid_from', 'valid_until']
    search_fields = ['code', 'title', 'description']
    readonly_fields = ['id', 'used_count', 'created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('code', 'title', 'description')}),
        (_('تنظیمات تخفیف'), {
            'fields': ('coupon_type', 'discount_value', 'min_order_amount', 'max_discount_amount')
        }),
        (_('محدودیت‌ها'), {
            'fields': ('usage_limit', 'used_count')
        }),
        (_('وضعیت'), {
            'fields': ('status', 'valid_from', 'valid_until')
        }),
        (_('زمان‌ها'), {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def is_valid(self, obj):
        """آیا کوپن معتبر است؟"""
        if obj.is_valid():
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    is_valid.short_description = _('معتبر')

    actions = ['activate_coupons', 'deactivate_coupons']

    def activate_coupons(self, request, queryset):
        """فعال کردن کوپن‌ها"""
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} کوپن فعال شد.')
    activate_coupons.short_description = _('فعال کردن کوپن‌ها')

    def deactivate_coupons(self, request, queryset):
        """غیرفعال کردن کوپن‌ها"""
        updated = queryset.update(status='inactive')
        self.message_user(request, f'{updated} کوپن غیرفعال شد.')
    deactivate_coupons.short_description = _('غیرفعال کردن کوپن‌ها')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """مدیریت پرداخت‌ها"""
    list_display = [
        'payment_id', 'order', 'amount', 'payment_method', 'status',
        'is_successful', 'created_at', 'completed_at'
    ]
    list_filter = ['status', 'payment_method', 'created_at', 'completed_at']
    search_fields = ['payment_id', 'order__order_number', 'order__user__username']
    readonly_fields = [
        'id', 'payment_id', 'gateway_response', 'created_at', 'completed_at'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('اطلاعات پایه', {
            'fields': ('order', 'payment_id', 'amount', 'payment_method', 'status')
        }),
        ('اطلاعات درگاه', {
            'fields': ('gateway_response',),
            'classes': ('collapse',)
        }),
        ('زمان‌ها', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )

    def get_form(self, request, obj=None, **kwargs):
        """تنظیم فرم برای محدود کردن انتخاب order"""
        form = super().get_form(request, obj, **kwargs)
        
        # اگر در حال ایجاد payment جدید هستیم (نه ویرایش)
        if obj is None:
            # فقط order هایی رو نشون بده که payment_status='pending' یا 'processing' دارن
            # یا order هایی که payment ندارن
            form.base_fields['order'].queryset = Order.objects.filter(
                payment_status__in=['pending', 'processing']
            ).order_by('-created_at')
        else:
            # اگر در حال ویرایش هستیم، فقط order فعلی رو نشون بده
            form.base_fields['order'].queryset = Order.objects.filter(id=obj.order_id)
        
        return form

    def save_model(self, request, obj, form, change):
        """ذخیره مدل با بررسی order"""
        # اگر order انتخاب نشده، خطا بده
        if not obj.order_id:
            from django.core.exceptions import ValidationError
            raise ValidationError('لطفاً یک سفارش را انتخاب کنید.')
        
        # بررسی اینکه order وجود داره
        try:
            order = Order.objects.get(id=obj.order_id)
        except Order.DoesNotExist:
            from django.core.exceptions import ValidationError
            raise ValidationError('سفارش انتخاب شده یافت نشد.')
        
        # اگر payment_id تنظیم نشده، یک payment_id منحصر به فرد بساز
        if not obj.payment_id:
            import uuid
            obj.payment_id = f"PAY-{uuid.uuid4().hex[:12].upper()}"
        
        # اگر status='completed' شده ولی completed_at نداره، تاریخ رو تنظیم کن
        if obj.status == 'completed' and not obj.completed_at:
            from django.utils import timezone
            obj.completed_at = timezone.now()
            # همچنین order رو هم به completed تبدیل کن
            if order.payment_status != 'completed':
                order.payment_status = 'completed'
                order.save(update_fields=['payment_status'])
        
        super().save_model(request, obj, form, change)

    def is_successful(self, obj):
        """آیا پرداخت موفق بوده است؟"""
        if obj.is_successful():
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    is_successful.short_description = _('موفق')
