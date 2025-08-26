# common/utils.py
import random
import string
from datetime import timedelta
from django.utils import timezone
from django.utils.text import slugify
from django.db.models import Q


def generate_unique_sku(product_type):
    """تولید SKU یکتا برای محصولات"""
    prefix = product_type.upper()[:3]
    timestamp = timezone.now().strftime('%Y%m%d%H%M')
    random_suffix = ''.join(random.choices(string.digits, k=2))
    return f"{prefix}-{timestamp}{random_suffix}"


def generate_slug(name, model_class, instance=None):
    """تولید slug یکتا برای مدل‌ها"""
    base_slug = slugify(name)
    slug = base_slug
    counter = 1
    
    while True:
        if instance:
            exists = model_class.objects.filter(slug=slug).exclude(pk=instance.pk).exists()
        else:
            exists = model_class.objects.filter(slug=slug).exists()
        
        if not exists:
            break
        
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug


def calculate_discount_percentage(base_price, sale_price):
    """محاسبه درصد تخفیف"""
    if not sale_price or sale_price >= base_price:
        return 0
    
    discount = ((base_price - sale_price) / base_price) * 100
    return round(discount, 2)


def is_product_on_sale(product):
    """بررسی تخفیف‌دار بودن محصول"""
    if not product.sale_price:
        return False
    
    now = timezone.now()
    
    if product.sale_start_date and now < product.sale_start_date:
        return False
    
    if product.sale_end_date and now > product.sale_end_date:
        return False
    
    return True


def get_product_current_price(product):
    """دریافت قیمت فعلی محصول"""
    if is_product_on_sale(product):
        return product.sale_price
    return product.base_price


def get_related_products(product, limit=6):
    """دریافت محصولات مرتبط"""
    from .models import Product
    
    related = Product.objects.filter(
        Q(category=product.category) | Q(tags__in=product.tags.all()),
        is_active=True,
        is_deleted=False
    ).exclude(id=product.id).distinct()
    
    return related[:limit]


def get_trending_products(days=7, limit=10):
    """دریافت محصولات محبوب"""
    from .models import Product
    
    cutoff_date = timezone.now() - timedelta(days=days)
    
    trending = Product.objects.filter(
        is_active=True,
        is_deleted=False,
        created_at__gte=cutoff_date
    ).order_by('-view_count', '-purchase_count')[:limit]
    
    return trending


def get_featured_products(limit=12):
    """دریافت محصولات ویژه"""
    from .models import Product
    
    featured = Product.objects.filter(
        is_active=True,
        is_deleted=False,
        is_featured=True
    ).order_by('-created_at')[:limit]
    
    return featured


def get_bestseller_products(limit=12):
    """دریافت محصولات پرفروش"""
    from .models import Product
    
    bestsellers = Product.objects.filter(
        is_active=True,
        is_deleted=False,
        is_bestseller=True
    ).order_by('-purchase_count')[:limit]
    
    return bestsellers


def search_products(query, category=None, min_price=None, max_price=None, tags=None):
    """جستجوی پیشرفته محصولات"""
    from .models import Product
    from django.db.models import Q
    
    products = Product.objects.filter(
        is_active=True,
        is_deleted=False
    )
    
    # جستجوی متنی
    if query:
        products = products.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(tags__name__icontains=query) |
            Q(category__name__icontains=query)
        ).distinct()
    
    # فیلتر دسته‌بندی
    if category:
        products = products.filter(category=category)
    
    # فیلتر قیمت
    if min_price is not None:
        products = products.filter(base_price__gte=min_price)
    if max_price is not None:
        products = products.filter(base_price__lte=max_price)
    
    # فیلتر تگ‌ها
    if tags:
        products = products.filter(tags__in=tags).distinct()
    
    return products.order_by('-created_at')


def update_product_rating(product):
    """به‌روزرسانی امتیاز محصول از نظرات"""
    from .models import Review
    from django.db.models import Avg
    
    reviews = Review.objects.filter(
        product=product,
        is_approved=True
    )
    
    if reviews.exists():
        avg_rating = reviews.aggregate(avg=Avg('rating'))['avg']
        product.rating = round(avg_rating, 2)
        product.review_count = reviews.count()
    else:
        product.rating = None
        product.review_count = 0
    
    product.save(update_fields=['rating', 'review_count'])


def get_category_breadcrumbs(category):
    """دریافت مسیر دسته‌بندی"""
    breadcrumbs = []
    current = category
    
    while current:
        breadcrumbs.insert(0, current)
        current = current.parent
    
    return breadcrumbs


def generate_product_report(start_date=None, end_date=None):
    """تولید گزارش عملکرد محصولات"""
    from .models import Product
    from django.db.models import F
    
    if not start_date:
        start_date = timezone.now() - timedelta(days=30)
    if not end_date:
        end_date = timezone.now()
    
    report = {
        'period': {
            'start': start_date,
            'end': end_date
        },
        'total_products': Product.objects.filter(
            created_at__range=(start_date, end_date)
        ).count(),
        'active_products': Product.objects.filter(
            is_active=True,
            is_deleted=False
        ).count(),
        'low_stock_products': Product.objects.filter(
            is_unlimited_stock=False,
            stock_quantity__lte=F('low_stock_threshold')
        ).count(),
        'out_of_stock_products': Product.objects.filter(
            is_unlimited_stock=False,
            stock_quantity=0
        ).count(),
        'top_selling_products': Product.objects.filter(
            is_active=True,
            is_deleted=False
        ).order_by('-purchase_count')[:10],
        'top_rated_products': Product.objects.filter(
            is_active=True,
            is_deleted=False,
            rating__isnull=False
        ).order_by('-rating')[:10],
    }
    
    return report