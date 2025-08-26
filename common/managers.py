# common/managers.py
from django.db import models
from django.db.models import Q, F, Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta


class CategoryManager(models.Manager):
    """مدیر پیشرفته برای دسته‌بندی‌ها"""
    
    def active(self):
        """فقط دسته‌بندی‌های فعال"""
        return self.filter(is_active=True, is_deleted=False)
    
    def with_product_count(self):
        """دسته‌بندی‌ها با تعداد محصولات"""
        return self.annotate(
            product_count=Count('products', filter=Q(products__is_active=True, products__is_deleted=False))
        )
    
    def featured(self):
        """دسته‌بندی‌های ویژه"""
        return self.active().filter(is_featured=True)


class ProductQuerySet(models.QuerySet):
    """QuerySet پیشرفته برای محصولات"""
    
    def active(self):
        """فقط محصولات فعال"""
        return self.filter(is_active=True, is_deleted=False)
    
    def published(self):
        """فقط محصولات منتشر شده"""
        return self.active().filter(status='active')
    
    def in_stock(self):
        """محصولات موجود"""
        return self.filter(
            Q(is_unlimited_stock=True) | Q(stock_quantity__gt=0)
        )
    
    def on_sale(self):
        """محصولات تخفیف‌دار"""
        now = timezone.now()
        return self.filter(
            sale_price__isnull=False,
            sale_start_date__lte=now,
            sale_end_date__gte=now
        )
    
    def featured(self):
        """محصولات ویژه"""
        return self.published().filter(is_featured=True)
    
    def bestsellers(self):
        """محصولات پرفروش"""
        return self.published().filter(is_bestseller=True)
    
    def new_products(self, days=30):
        """محصولات جدید"""
        cutoff_date = timezone.now() - timedelta(days=days)
        return self.published().filter(created_at__gte=cutoff_date)
    
    def by_category(self, category):
        """محصولات یک دسته‌بندی"""
        return self.published().filter(category=category)
    
    def search(self, query):
        """جستجو در محصولات"""
        return self.published().filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(tags__name__icontains=query) |
            Q(category__name__icontains=query)
        ).distinct()
    
    def with_related_data(self):
        """با داده‌های مرتبط"""
        return self.select_related('category').prefetch_related(
            'tags', 'variants', 'product_images'
        )


class ProductManager(models.Manager):
    """مدیر پیشرفته برای محصولات"""
    
    def get_queryset(self):
        return ProductQuerySet(self.model, using=self._db)
    
    def active(self):
        return self.get_queryset().active()
    
    def published(self):
        return self.get_queryset().published()
    
    def in_stock(self):
        return self.get_queryset().in_stock()
    
    def on_sale(self):
        return self.get_queryset().on_sale()
    
    def featured(self):
        return self.get_queryset().featured()
    
    def bestsellers(self):
        return self.get_queryset().bestsellers()
    
    def new_products(self, days=30):
        return self.get_queryset().new_products(days)
    
    def search(self, query):
        return self.get_queryset().search(query)
    
    def with_related_data(self):
        return self.get_queryset().with_related_data()


class ReviewManager(models.Manager):
    """مدیر برای نظرات"""
    
    def approved(self):
        """فقط نظرات تایید شده"""
        return self.filter(is_approved=True)
    
    def by_rating(self, rating):
        """نظرات با امتیاز خاص"""
        return self.approved().filter(rating=rating)
    
    def verified_purchases(self):
        """نظرات خریدهای تایید شده"""
        return self.approved().filter(is_verified_purchase=True)