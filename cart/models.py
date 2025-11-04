# cart/models.py
import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.cache import cache
from django.db.models import Sum, F, DecimalField
from decimal import Decimal

from authenticate.models import User
from common.models import Product, ProductVariant
from .constants import (
    ORDER_STATUS, CART_STATUS, PAYMENT_METHODS, PAYMENT_STATUS,
    COUPON_TYPES, COUPON_STATUS, DISCOUNT_TYPES, CART_ITEM_STATUS,
    DEFAULT_CART_EXPIRY_DAYS, DEFAULT_COUPON_EXPIRY_DAYS,
    MAX_CART_ITEMS, MAX_QUANTITY_PER_ITEM, MIN_QUANTITY_PER_ITEM
)


class Cart(models.Model):
    """مدل سبد خرید"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='carts',
        verbose_name=_('کاربر')
    )
    session_key = models.CharField(
        max_length=40,
        blank=True,
        null=True,
        verbose_name=_('کلید جلسه')
    )
    status = models.CharField(
        max_length=20,
        choices=CART_STATUS,
        default='active',
        verbose_name=_('وضعیت')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('تاریخ ایجاد')
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('تاریخ بروزرسانی')
    )
    expires_at = models.DateTimeField(
        verbose_name=_('تاریخ انقضا')
    )

    class Meta:
        verbose_name = _('سبد خرید')
        verbose_name_plural = _('سبدهای خرید')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['session_key', 'status']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"سبد خرید {self.user.username} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        """تنظیم تاریخ انقضا"""
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(days=DEFAULT_CART_EXPIRY_DAYS)
        super().save(*args, **kwargs)

    def get_total_items(self):
        """تعداد کل آیتم‌ها"""
        return self.items.filter(status='active').aggregate(
            total=Sum('quantity')
        )['total'] or 0

    def get_subtotal(self):
        """مجموع بدون تخفیف"""
        return self.items.filter(status='active').aggregate(
            subtotal=Sum(F('quantity') * F('price'), output_field=DecimalField())
        )['subtotal'] or Decimal('0.00')

    def get_discount_amount(self):
        """مبلغ تخفیف"""
        return self.items.filter(status='active').aggregate(
            discount=Sum(F('quantity') * F('discount_amount'), output_field=DecimalField())
        )['discount'] or Decimal('0.00')

    def get_total(self):
        """مجموع نهایی"""
        return self.get_subtotal() - self.get_discount_amount()

    def is_expired(self):
        """آیا منقضی شده است؟"""
        return timezone.now() > self.expires_at

    def can_checkout(self):
        """آیا می‌تواند checkout شود؟"""
        return (
            self.status == 'active' and
            not self.is_expired() and
            self.get_total_items() > 0
        )

    def clear(self):
        """پاک کردن سبد خرید"""
        self.items.all().update(status='removed')
        self.status = 'expired'
        self.save()


class CartItem(models.Model):
    """مدل آیتم سبد خرید"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('سبد خرید')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name=_('محصول')
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name='cart_items',
        null=True,
        blank=True,
        verbose_name=_('نوع محصول')
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(MIN_QUANTITY_PER_ITEM), MaxValueValidator(MAX_QUANTITY_PER_ITEM)],
        verbose_name=_('تعداد')
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('قیمت واحد')
    )
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name=_('مبلغ تخفیف')
    )
    status = models.CharField(
        max_length=20,
        choices=CART_ITEM_STATUS,
        default='active',
        verbose_name=_('وضعیت')
    )
    added_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('تاریخ افزودن')
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('تاریخ بروزرسانی')
    )

    class Meta:
        verbose_name = _('آیتم سبد خرید')
        verbose_name_plural = _('آیتم‌های سبد خرید')
        ordering = ['-added_at']
        unique_together = ['cart', 'product', 'variant']
        indexes = [
            models.Index(fields=['cart', 'status']),
            models.Index(fields=['product', 'status']),
        ]

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    def get_total_price(self):
        """قیمت کل آیتم"""
        return self.quantity * self.price

    def get_final_price(self):
        """قیمت نهایی با تخفیف"""
        return self.get_total_price() - self.discount_amount

    def is_available(self):
        """آیا موجود است؟"""
        if self.variant:
            return self.variant.stock_quantity >= self.quantity
        return self.product.stock_quantity >= self.quantity


class Coupon(models.Model):
    """مدل کوپن تخفیف"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name=_('کد کوپن')
    )
    title = models.CharField(
        max_length=100,
        verbose_name=_('عنوان')
    )
    description = models.TextField(
        blank=True,
        verbose_name=_('توضیحات')
    )
    coupon_type = models.CharField(
        max_length=20,
        choices=COUPON_TYPES,
        verbose_name=_('نوع کوپن')
    )
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('مقدار تخفیف')
    )
    min_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name=_('حداقل مبلغ سفارش')
    )
    max_discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('حداکثر مبلغ تخفیف')
    )
    usage_limit = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_('محدودیت استفاده')
    )
    used_count = models.PositiveIntegerField(
        default=0,
        verbose_name=_('تعداد استفاده شده')
    )
    status = models.CharField(
        max_length=20,
        choices=COUPON_STATUS,
        default='active',
        verbose_name=_('وضعیت')
    )
    valid_from = models.DateTimeField(
        verbose_name=_('اعتبار از')
    )
    valid_until = models.DateTimeField(
        verbose_name=_('اعتبار تا')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('تاریخ ایجاد')
    )

    class Meta:
        verbose_name = _('کوپن')
        verbose_name_plural = _('کوپن‌ها')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['status']),
            models.Index(fields=['valid_from', 'valid_until']),
        ]

    def __str__(self):
        return f"{self.code} - {self.title}"

    def is_valid(self):
        """آیا کوپن معتبر است؟"""
        now = timezone.now()
        return (
            self.status == 'active' and
            now >= self.valid_from and
            now <= self.valid_until and
            (self.usage_limit is None or self.used_count < self.usage_limit)
        )

    def can_use(self, user, order_amount):
        """آیا می‌تواند استفاده شود؟"""
        if not self.is_valid():
            return False
        
        if order_amount < self.min_order_amount:
            return False
        
        # بررسی استفاده قبلی کاربر
        if self.orders.filter(user=user).exists():
            return False
        
        return True

    def calculate_discount(self, order_amount):
        """محاسبه تخفیف"""
        if self.coupon_type == 'percentage':
            discount = order_amount * (self.discount_value / 100)
            if self.max_discount_amount:
                discount = min(discount, self.max_discount_amount)
        elif self.coupon_type == 'fixed':
            discount = min(self.discount_value, order_amount)
        else:
            discount = Decimal('0.00')
        
        return discount


class Order(models.Model):
    """مدل سفارش"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(
        max_length=30,
        unique=True,
        verbose_name=_('شماره سفارش')
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name=_('کاربر')
    )
    cart = models.ForeignKey(
        Cart,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name=_('سبد خرید')
    )
    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name=_('کوپن')
    )
    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS,
        default='pending',
        verbose_name=_('وضعیت')
    )
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('مجموع بدون تخفیف')
    )
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name=_('مبلغ تخفیف')
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('مجموع نهایی')
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        verbose_name=_('روش پرداخت')
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='pending',
        verbose_name=_('وضعیت پرداخت')
    )
    notes = models.TextField(
        blank=True,
        verbose_name=_('یادداشت‌ها')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('تاریخ ایجاد')
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('تاریخ بروزرسانی')
    )
    paid_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('تاریخ پرداخت')
    )

    class Meta:
        verbose_name = _('سفارش')
        verbose_name_plural = _('سفارش‌ها')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'payment_status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"سفارش {self.order_number} - {self.user.username}"

    def save(self, *args, **kwargs):
        """تنظیم شماره سفارش"""
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)

    def generate_order_number(self):
        """تولید شماره سفارش"""
        import random
        import string
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"ORD{timestamp}{random_chars}"

    def get_total_items(self):
        """تعداد کل آیتم‌ها"""
        return self.items.aggregate(
            total=Sum('quantity')
        )['total'] or 0

    def can_cancel(self):
        """آیا می‌تواند لغو شود؟"""
        return self.status in ['pending', 'paid']

    def cancel(self):
        """لغو سفارش"""
        if self.can_cancel():
            self.status = 'cancelled'
            self.save()


class OrderItem(models.Model):
    """مدل آیتم سفارش"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('سفارش')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='order_items',
        verbose_name=_('محصول')
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name='order_items',
        null=True,
        blank=True,
        verbose_name=_('نوع محصول')
    )
    quantity = models.PositiveIntegerField(
        verbose_name=_('تعداد')
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('قیمت واحد')
    )
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name=_('مبلغ تخفیف')
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('قیمت کل')
    )
    
    # محتوای محصول (برای تحویل به کاربر)
    content = models.TextField(
        blank=True,
        verbose_name=_('محتوای محصول'),
        help_text=_('اطلاعات محصول مثل username/password، کلید محصول، لینک دانلود و...')
    )
    download_file = models.FileField(
        upload_to='orders/files/',
        null=True,
        blank=True,
        verbose_name=_('فایل دانلود')
    )
    download_url = models.URLField(
        blank=True,
        verbose_name=_('لینک دانلود')
    )
    is_delivered = models.BooleanField(
        default=False,
        verbose_name=_('تحویل شده')
    )
    delivered_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('تاریخ تحویل')
    )

    class Meta:
        verbose_name = _('آیتم سفارش')
        verbose_name_plural = _('آیتم‌های سفارش')
        indexes = [
            models.Index(fields=['order', 'product']),
        ]

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    def save(self, *args, **kwargs):
        """محاسبه قیمت کل"""
        # محاسبه قیمت کل فقط در صورت وجود quantity و price
        if self.quantity and self.price:
            self.total_price = (self.quantity * self.price) - (self.discount_amount or 0)
        super().save(*args, **kwargs)


class Payment(models.Model):
    """مدل پرداخت"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name=_('سفارش')
    )
    payment_id = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('شناسه پرداخت')
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('مبلغ')
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        verbose_name=_('روش پرداخت')
    )
    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='pending',
        verbose_name=_('وضعیت')
    )
    gateway_response = models.JSONField(
        default=dict,
        verbose_name=_('پاسخ درگاه')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('تاریخ ایجاد')
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('تاریخ تکمیل')
    )

    class Meta:
        verbose_name = _('پرداخت')
        verbose_name_plural = _('پرداخت‌ها')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment_id']),
            models.Index(fields=['order', 'status']),
        ]

    def __str__(self):
        return f"پرداخت {self.payment_id} - {self.order.order_number}"

    def is_successful(self):
        """آیا پرداخت موفق بوده است؟"""
        return self.status == 'completed'
