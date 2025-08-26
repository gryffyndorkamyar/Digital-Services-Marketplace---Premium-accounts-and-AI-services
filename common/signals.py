# common/signals.py
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.core.cache import cache
from django.utils import timezone
from django.db.models import F, Sum
from .models import Product, Review, Category


@receiver(post_save, sender=Product)
def create_product_analytics(sender, instance, created, **kwargs):
    """ایجاد رکورد analytics برای محصولات جدید"""
    if created:
        # در اینجا می‌تونیم ProductAnalytics بسازیم
        # فعلاً فقط کش رو پاک می‌کنیم
        pass
    
    # پاک کردن کش‌های مربوط به محصول
    cache_keys = [
        f'product_{instance.id}',
        f'category_products_{instance.category_id}',
        'featured_products',
        'bestseller_products',
        'trending_products',
        'new_products'
    ]
    for key in cache_keys:
        cache.delete(key)


@receiver(post_save, sender=Review)
def update_product_rating_on_review(sender, instance, **kwargs):
    """به‌روزرسانی امتیاز محصول هنگام ذخیره نظر"""
    instance.product.update_rating()
    
    # پاک کردن کش محصول
    cache.delete(f'product_{instance.product.id}')


@receiver(post_delete, sender=Review)
def update_product_rating_on_review_delete(sender, instance, **kwargs):
    """به‌روزرسانی امتیاز محصول هنگام حذف نظر"""
    instance.product.update_rating()
    
    # پاک کردن کش محصول
    cache.delete(f'product_{instance.product.id}')


@receiver(pre_save, sender=Product)
def update_product_status(sender, instance, **kwargs):
    """به‌روزرسانی وضعیت محصول قبل از ذخیره"""
    # اگر محصول فعال شد، تاریخ انتشار رو تنظیم کن
    if instance.status == 'active' and not instance.published_at:
        instance.published_at = timezone.now()
    
    # به‌روزرسانی پرچم "جدید"
    if instance.created_at:
        days_since_creation = (timezone.now() - instance.created_at).days
        instance.is_new = days_since_creation <= 30


@receiver(post_save, sender=Product)
def update_category_product_count(sender, instance, **kwargs):
    """به‌روزرسانی تعداد محصولات دسته‌بندی"""
    if instance.category:
        # این کار توسط property product_count انجام می‌شه
        # ولی می‌تونیم کش رو پاک کنیم
        cache.delete(f'category_{instance.category.id}')


@receiver(post_save, sender=Category)
def clear_category_cache(sender, instance, **kwargs):
    """پاک کردن کش هنگام تغییر دسته‌بندی"""
    cache_keys = [
        f'category_{instance.id}',
        f'category_products_{instance.id}',
        'all_categories',
        'featured_categories'
    ]
    for key in cache_keys:
        cache.delete(key)


@receiver(pre_save, sender=Product)
def validate_sale_price(sender, instance, **kwargs):
    """اعتبارسنجی قیمت تخفیف"""
    if instance.sale_price and instance.sale_price >= instance.base_price:
        from django.core.exceptions import ValidationError
        raise ValidationError('قیمت تخفیف باید کمتر از قیمت اصلی باشد.')


@receiver(post_save, sender=Product)
def handle_low_stock_notification(sender, instance, **kwargs):
    """هشدار کمبود موجودی"""
    if (not instance.is_unlimited_stock and 
        instance.stock_quantity <= instance.low_stock_threshold):
        # اینجا می‌تونیم ایمیل به مدیر ارسال کنیم
        # یا notification در سیستم ایجاد کنیم
        pass


@receiver(post_save, sender=Product)
def handle_sale_notification(sender, instance, **kwargs):
    """اعلان تخفیف محصول"""
    if instance.is_on_sale:
        # اینجا می‌تونیم:
        # - ایمیل به مشتریان ارسال کنیم
        # - notification ایجاد کنیم
        # - در صفحه اصلی نمایش بدهیم
        pass


@receiver(pre_save, sender=Product)
def update_trending_status(sender, instance, **kwargs):
    """به‌روزرسانی وضعیت محبوبیت محصول"""
    # اگر محصول در 7 روز گذشته بازدید زیادی داشته
    if instance.view_count > 100:  # مثال
        instance.is_trending = True
    else:
        instance.is_trending = False


@receiver(post_save, sender=Product)
def update_bestseller_status(sender, instance, **kwargs):
    """به‌روزرسانی وضعیت پرفروش بودن محصول"""
    # اگر محصول خرید زیادی داشته
    if instance.purchase_count > 50:  # مثال
        instance.is_bestseller = True
    else:
        instance.is_bestseller = False


@receiver(post_save, sender=Review)
def update_product_stats(sender, instance, **kwargs):
    """به‌روزرسانی آمار محصول"""
    if instance.is_approved:
        # به‌روزرسانی تعداد نظرات تایید شده
        instance.product.review_count = instance.product.reviews.filter(
            is_approved=True
        ).count()
        instance.product.save(update_fields=['review_count'])


@receiver(post_save, sender=Product)
def clear_search_cache(sender, instance, **kwargs):
    """پاک کردن کش جستجو"""
    cache_keys = [
        'search_results_*',
        'category_search_*',
        'tag_search_*'
    ]
    for pattern in cache_keys:
        # در production از cache.delete_pattern استفاده کنید
        cache.delete(pattern)


@receiver(post_save, sender=Product)
def update_related_products_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش محصولات مرتبط"""
    # پاک کردن کش محصولات مرتبط
    cache.delete(f'related_products_{instance.id}')


@receiver(post_save, sender=Product)
def handle_featured_product_update(sender, instance, **kwargs):
    """مدیریت محصولات ویژه"""
    if instance.is_featured:
        # اگر محصول ویژه شد، کش رو پاک کن
        cache.delete('featured_products')
    else:
        # اگر محصول از حالت ویژه خارج شد، کش رو پاک کن
        cache.delete('featured_products')


@receiver(post_save, sender=Product)
def handle_new_product_update(sender, instance, **kwargs):
    """مدیریت محصولات جدید"""
    if instance.is_new:
        # اگر محصول جدید است، کش رو پاک کن
        cache.delete('new_products')
    else:
        # اگر محصول قدیمی شد، کش رو پاک کن
        cache.delete('new_products')


@receiver(post_save, sender=Product)
def handle_trending_product_update(sender, instance, **kwargs):
    """مدیریت محصولات محبوب"""
    if instance.is_trending:
        # اگر محصول محبوب شد، کش رو پاک کن
        cache.delete('trending_products')
    else:
        # اگر محصول از حالت محبوب خارج شد، کش رو پاک کن
        cache.delete('trending_products')


@receiver(post_save, sender=Product)
def handle_bestseller_product_update(sender, instance, **kwargs):
    """مدیریت محصولات پرفروش"""
    if instance.is_bestseller:
        # اگر محصول پرفروش شد، کش رو پاک کن
        cache.delete('bestseller_products')
    else:
        # اگر محصول از حالت پرفروش خارج شد، کش رو پاک کن
        cache.delete('bestseller_products')


# Signal برای به‌روزرسانی آمار کلی
@receiver(post_save, sender=Product)
def update_global_stats(sender, instance, **kwargs):
    """به‌روزرسانی آمار کلی فروشگاه"""
    cache_keys = [
        'total_products',
        'active_products',
        'featured_products_count',
        'new_products_count',
        'trending_products_count',
        'bestseller_products_count'
    ]
    for key in cache_keys:
        cache.delete(key)


# Signal برای مدیریت SEO
@receiver(post_save, sender=Product)
def update_seo_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش SEO"""
    if instance.meta_title or instance.meta_description or instance.seo_keywords:
        cache.delete(f'product_seo_{instance.id}')


# Signal برای مدیریت تصاویر
@receiver(post_save, sender=Product)
def handle_image_cache(sender, instance, **kwargs):
    """مدیریت کش تصاویر"""
    if instance.main_image:
        cache.delete(f'product_image_{instance.id}')


# Signal برای مدیریت واریانت‌ها
@receiver(post_save, sender=Product)
def update_variant_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش واریانت‌ها"""
    if instance.variants.exists():
        cache.delete(f'product_variants_{instance.id}')


# Signal برای مدیریت تگ‌ها
@receiver(post_save, sender=Product)
def update_tag_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش تگ‌ها"""
    if instance.tags.exists():
        for tag in instance.tags.all():
            cache.delete(f'tag_products_{tag.id}')


# Signal برای مدیریت دسته‌بندی‌ها
@receiver(post_save, sender=Product)
def update_category_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش دسته‌بندی‌ها"""
    if instance.category:
        cache.delete(f'category_products_{instance.category.id}')
        cache.delete(f'category_stats_{instance.category.id}')


# Signal برای مدیریت قیمت‌ها
@receiver(post_save, sender=Product)
def handle_price_update(sender, instance, **kwargs):
    """مدیریت تغییرات قیمت"""
    if instance.sale_price:
        # اگر محصول تخفیف داره، کش رو پاک کن
        cache.delete('sale_products')
        cache.delete(f'product_price_{instance.id}')


# Signal برای مدیریت موجودی
@receiver(post_save, sender=Product)
def handle_stock_update(sender, instance, **kwargs):
    """مدیریت تغییرات موجودی"""
    if not instance.is_unlimited_stock:
        if instance.stock_quantity == 0:
            # محصول تمام شده
            cache.delete('in_stock_products')
        elif instance.stock_quantity <= instance.low_stock_threshold:
            # موجودی کم
            cache.delete('low_stock_products')
