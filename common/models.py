# common/models.py
import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.urls import reverse
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex
from django.db.models import Q, F, Sum, Count, Avg
from django.db.models.functions import Coalesce
from django.utils.text import slugify
from django.core.cache import cache
from django.conf import settings
import logging

from .constants import PRODUCT_TYPES, CATEGORY_TYPES, PRODUCT_STATUS, DELIVERY_METHODS, CURRENCIES
from .validators import validate_price_positive, validate_stock_quantity, validate_rating_range
from .utils import generate_unique_sku, generate_slug, calculate_discount_percentage, is_product_on_sale, get_product_current_price
from .managers import CategoryManager, ProductManager, ReviewManager

logger = logging.getLogger(__name__)

User = get_user_model()


class TimeStampedModel(models.Model):
    """مدل پایه با فیلدهای زمان و کاربر"""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name=_('تاریخ ایجاد'))
    updated_at = models.DateTimeField(auto_now=True, db_index=True, verbose_name=_('تاریخ بروزرسانی'))
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created',
        verbose_name=_('ایجاد شده توسط')
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated',
        verbose_name=_('بروزرسانی شده توسط')
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']


class SoftDeleteModel(models.Model):
    """مدل پایه با قابلیت حذف نرم"""
    is_deleted = models.BooleanField(default=False, db_index=True, verbose_name=_('حذف شده'))
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name=_('تاریخ حذف'))
    deleted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_deleted',
        verbose_name=_('حذف شده توسط')
    )

    class Meta:
        abstract = True

    def soft_delete(self, user=None):
        """حذف نرم شیء"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = user
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])

    def restore(self, user=None):
        """بازیابی شیء حذف شده"""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])


class Category(TimeStampedModel, SoftDeleteModel):
    """دسته‌بندی محصولات"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name=_('نام دسته‌بندی'))
    slug = models.SlugField(max_length=120, unique=True, verbose_name=_('Slug'))
    description = models.TextField(blank=True, verbose_name=_('توضیحات'))
    category_type = models.CharField(
        max_length=20,
        choices=CATEGORY_TYPES,
        default='other',
        verbose_name=_('نوع دسته‌بندی')
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('دسته‌بندی والد')
    )
    icon = models.CharField(max_length=50, blank=True, verbose_name=_('کلاس آیکون'))
    image = models.ImageField(
        upload_to='categories/',
        null=True,
        blank=True,
        verbose_name=_('تصویر دسته‌بندی')
    )
    is_active = models.BooleanField(default=True, verbose_name=_('فعال'))
    is_featured = models.BooleanField(default=False, verbose_name=_('ویژه'))
    sort_order = models.PositiveIntegerField(default=0, verbose_name=_('ترتیب نمایش'))
    meta_title = models.CharField(max_length=60, blank=True, verbose_name=_('عنوان متا'))
    meta_description = models.CharField(max_length=160, blank=True, verbose_name=_('توضیحات متا'))
    seo_keywords = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list,
        verbose_name=_('کلمات کلیدی SEO')
    )

    objects = CategoryManager()

    class Meta:
        verbose_name = _('دسته‌بندی')
        verbose_name_plural = _('دسته‌بندی‌ها')
        ordering = ['sort_order', 'name']
        indexes = [
            models.Index(fields=['category_type', 'is_active']),
            models.Index(fields=['slug']),
            GinIndex(fields=['seo_keywords']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_slug(self.name, Category, self)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('category_detail', kwargs={'slug': self.slug})

    @property
    def product_count(self):
        """تعداد محصولات فعال در این دسته‌بندی"""
        return self.products.filter(is_active=True, is_deleted=False).count()

    @property
    def all_children(self):
        """همه دسته‌بندی‌های فرزند به صورت بازگشتی"""
        children = list(self.children.all())
        for child in self.children.all():
            children.extend(child.all_children)
        return children

    def get_breadcrumbs(self):
        """مسیر دسته‌بندی"""
        breadcrumbs = []
        current = self
        while current:
            breadcrumbs.insert(0, current)
            current = current.parent
        return breadcrumbs


class Tag(TimeStampedModel):
    """تگ‌های محصولات"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True, verbose_name=_('نام تگ'))
    slug = models.SlugField(max_length=60, unique=True, verbose_name=_('Slug'))
    color = models.CharField(max_length=7, default='#3B82F6', verbose_name=_('رنگ تگ'))
    description = models.TextField(blank=True, verbose_name=_('توضیحات'))
    is_featured = models.BooleanField(default=False, verbose_name=_('ویژه'))

    class Meta:
        verbose_name = _('تگ')
        verbose_name_plural = _('تگ‌ها')
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_slug(self.name, Tag, self)
        super().save(*args, **kwargs)


class Product(TimeStampedModel, SoftDeleteModel):
    """محصولات اصلی"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=50, unique=True, verbose_name=_('SKU'))
    name = models.CharField(max_length=200, verbose_name=_('نام محصول'))
    slug = models.SlugField(max_length=250, unique=True, verbose_name=_('Slug'))
    description = models.TextField(verbose_name=_('توضیحات'))
    short_description = models.CharField(
        max_length=300,
        blank=True,
        verbose_name=_('توضیحات کوتاه')
    )
    
    # جزئیات محصول
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPES,
        default='account',
        verbose_name=_('نوع محصول')
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('دسته‌بندی')
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='products',
        verbose_name=_('تگ‌ها')
    )
    
    # قیمت‌گذاری
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01')), validate_price_positive],
        verbose_name=_('قیمت اصلی')
    )
    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_('قیمت تخفیف')
    )
    cost_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('قیمت تمام شده')
    )
    currency = models.CharField(
        max_length=3,
        choices=CURRENCIES,
        default='USD',
        verbose_name=_('واحد پول')
    )
    
    # موجودی و در دسترس بودن
    stock_quantity = models.PositiveIntegerField(
        default=0,
        validators=[validate_stock_quantity],
        verbose_name=_('موجودی')
    )
    low_stock_threshold = models.PositiveIntegerField(
        default=5,
        verbose_name=_('حد کمبود موجودی')
    )
    is_unlimited_stock = models.BooleanField(
        default=False,
        verbose_name=_('موجودی نامحدود')
    )
    is_active = models.BooleanField(default=True, verbose_name=_('فعال'))
    status = models.CharField(
        max_length=20,
        choices=PRODUCT_STATUS,
        default='draft',
        verbose_name=_('وضعیت')
    )
    
    # تحویل و تکمیل
    delivery_method = models.CharField(
        max_length=20,
        choices=DELIVERY_METHODS,
        default='instant',
        verbose_name=_('روش تحویل')
    )
    delivery_time = models.PositiveIntegerField(
        default=0,
        help_text=_('زمان تحویل به دقیقه'),
        verbose_name=_('زمان تحویل')
    )
    auto_fulfill = models.BooleanField(
        default=True,
        verbose_name=_('تکمیل خودکار')
    )
    
    # ویژگی‌ها و مشخصات
    features = models.JSONField(default=dict, blank=True, verbose_name=_('ویژگی‌ها'))
    specifications = models.JSONField(default=dict, blank=True, verbose_name=_('مشخصات'))
    requirements = models.TextField(blank=True, verbose_name=_('نیازمندی‌ها'))
    instructions = models.TextField(blank=True, verbose_name=_('دستورالعمل‌ها'))
    
    # رسانه
    main_image = models.ImageField(
        upload_to='products/main/',
        null=True,
        blank=True,
        verbose_name=_('تصویر اصلی')
    )
    images = models.JSONField(default=list, blank=True, verbose_name=_('تصاویر اضافی'))
    video_url = models.URLField(blank=True, verbose_name=_('لینک ویدیو'))
    
    # SEO و بازاریابی
    meta_title = models.CharField(max_length=60, blank=True, verbose_name=_('عنوان متا'))
    meta_description = models.CharField(max_length=160, blank=True, verbose_name=_('توضیحات متا'))
    seo_keywords = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list,
        verbose_name=_('کلمات کلیدی SEO')
    )
    
    # تحلیل و عملکرد
    view_count = models.PositiveIntegerField(default=0, verbose_name=_('تعداد بازدید'))
    purchase_count = models.PositiveIntegerField(default=0, verbose_name=_('تعداد خرید'))
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('میانگین امتیاز')
    )
    review_count = models.PositiveIntegerField(default=0, verbose_name=_('تعداد نظرات'))
    
    # پرچم‌ها
    is_featured = models.BooleanField(default=False, verbose_name=_('ویژه'))
    is_bestseller = models.BooleanField(default=False, verbose_name=_('پرفروش'))
    is_new = models.BooleanField(default=True, verbose_name=_('جدید'))
    is_trending = models.BooleanField(default=False, verbose_name=_('محبوب'))
    
    # زمان‌بندی
    published_at = models.DateTimeField(null=True, blank=True, verbose_name=_('تاریخ انتشار'))
    sale_start_date = models.DateTimeField(null=True, blank=True, verbose_name=_('شروع تخفیف'))
    sale_end_date = models.DateTimeField(null=True, blank=True, verbose_name=_('پایان تخفیف'))

    objects = ProductManager()

    class Meta:
        verbose_name = _('محصول')
        verbose_name_plural = _('محصولات')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product_type', 'is_active']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['is_bestseller']),
            models.Index(fields=['rating']),
            models.Index(fields=['published_at']),
            models.Index(fields=['sale_start_date', 'sale_end_date']),
            GinIndex(fields=['seo_keywords']),
            GinIndex(fields=['features']),
            GinIndex(fields=['specifications']),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_slug(self.name, Product, self)
        if not self.sku:
            self.sku = generate_unique_sku(self.product_type)
        if self.status == 'active' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('product_detail', kwargs={'slug': self.slug})

    @property
    def current_price(self):
        """قیمت فعلی محصول"""
        return get_product_current_price(self)

    @property
    def is_on_sale(self):
        """آیا محصول تخفیف‌دار است؟"""
        return is_product_on_sale(self)

    @property
    def discount_percentage(self):
        """درصد تخفیف"""
        return calculate_discount_percentage(self.base_price, self.sale_price)

    @property
    def is_in_stock(self):
        """آیا محصول موجود است؟"""
        if self.is_unlimited_stock:
            return True
        return self.stock_quantity > 0

    @property
    def is_low_stock(self):
        """آیا محصول کم موجودی است؟"""
        if self.is_unlimited_stock:
            return False
        return self.stock_quantity <= self.low_stock_threshold

    def increment_view_count(self):
        """افزایش تعداد بازدید"""
        self.view_count = F('view_count') + 1
        self.save(update_fields=['view_count'])

    def increment_purchase_count(self):
        """افزایش تعداد خرید"""
        self.purchase_count = F('purchase_count') + 1
        self.save(update_fields=['purchase_count'])

    def update_rating(self):
        """به‌روزرسانی امتیاز از نظرات"""
        from .utils import update_product_rating
        update_product_rating(self)

    def get_related_products(self, limit=6):
        """محصولات مرتبط"""
        from .utils import get_related_products
        return get_related_products(self, limit)


class ProductVariant(TimeStampedModel):
    """انواع مختلف محصول"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name=_('محصول')
    )
    name = models.CharField(max_length=100, verbose_name=_('نام نوع'))
    sku = models.CharField(max_length=50, unique=True, verbose_name=_('SKU'))
    
    # قیمت‌گذاری
    price_modifier = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_('تغییر قیمت')
    )
    
    # موجودی
    stock_quantity = models.PositiveIntegerField(
        default=0,
        validators=[validate_stock_quantity],
        verbose_name=_('موجودی')
    )
    is_unlimited_stock = models.BooleanField(
        default=False,
        verbose_name=_('موجودی نامحدود')
    )
    
    # تنظیمات
    attributes = models.JSONField(default=dict, verbose_name=_('ویژگی‌ها'))
    is_active = models.BooleanField(default=True, verbose_name=_('فعال'))
    sort_order = models.PositiveIntegerField(default=0, verbose_name=_('ترتیب نمایش'))

    class Meta:
        verbose_name = _('نوع محصول')
        verbose_name_plural = _('انواع محصولات')
        ordering = ['sort_order', 'name']
        indexes = [
            models.Index(fields=['product', 'is_active']),
            models.Index(fields=['sku']),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.name}"

    @property
    def current_price(self):
        """قیمت فعلی نوع محصول"""
        return self.product.current_price + self.price_modifier

    @property
    def is_in_stock(self):
        """آیا نوع محصول موجود است؟"""
        if self.is_unlimited_stock:
            return True
        return self.stock_quantity > 0


class ProductImage(TimeStampedModel):
    """تصاویر اضافی محصولات"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='product_images',
        verbose_name=_('محصول')
    )
    image = models.ImageField(upload_to='products/images/', verbose_name=_('تصویر'))
    alt_text = models.CharField(max_length=200, blank=True, verbose_name=_('متن جایگزین'))
    caption = models.CharField(max_length=200, blank=True, verbose_name=_('عنوان'))
    sort_order = models.PositiveIntegerField(default=0, verbose_name=_('ترتیب نمایش'))
    is_active = models.BooleanField(default=True, verbose_name=_('فعال'))

    class Meta:
        verbose_name = _('تصویر محصول')
        verbose_name_plural = _('تصاویر محصولات')
        ordering = ['sort_order', 'created_at']
        indexes = [
            models.Index(fields=['product', 'is_active']),
        ]

    def __str__(self):
        return f"{self.product.name} - تصویر {self.sort_order}"


class Review(TimeStampedModel, SoftDeleteModel):
    """نظرات مشتریان"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('محصول')
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('کاربر')
    )
    order = models.ForeignKey('cart.Order', on_delete=models.CASCADE, null=True, blank=True, verbose_name=_('سفارش'))
    
    # محتوای نظر
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5), validate_rating_range],
        verbose_name=_('امتیاز')
    )
    title = models.CharField(max_length=200, verbose_name=_('عنوان نظر'))
    comment = models.TextField(verbose_name=_('متن نظر'))
    
    # تایید
    is_approved = models.BooleanField(default=False, verbose_name=_('تایید شده'))
    is_verified_purchase = models.BooleanField(default=True, verbose_name=_('خرید تایید شده'))
    
    # تحلیل
    helpful_votes = models.PositiveIntegerField(default=0, verbose_name=_('رای مفید'))
    total_votes = models.PositiveIntegerField(default=0, verbose_name=_('کل رای‌ها'))

    objects = ReviewManager()

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'product', 'order']  # user، product و order
        indexes = [
            models.Index(fields=['product', 'is_approved']),
            models.Index(fields=['rating']),
            models.Index(fields=['is_verified_purchase']),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.user.username} - {self.rating}★"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.product.update_rating()

    @property
    def helpful_percentage(self):
        """درصد مفید بودن"""
        if self.total_votes == 0:
            return 0
        return round((self.helpful_votes / self.total_votes) * 100, 1)
