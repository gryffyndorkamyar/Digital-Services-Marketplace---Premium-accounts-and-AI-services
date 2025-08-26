from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta

from .models import Category, Tag, Product, ProductVariant, ProductImage, Review
from .constants import PRODUCT_TYPES, CATEGORY_TYPES, PRODUCT_STATUS


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_type', 'parent', 'product_count', 'is_active', 'is_featured', 'sort_order']
    list_filter = ['category_type', 'is_active', 'is_featured', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'is_featured', 'sort_order']
    ordering = ['sort_order', 'name']
    
    fieldsets = (
        (_('اطلاعات اصلی'), {
            'fields': ('name', 'slug', 'description', 'category_type', 'parent')
        }),
        (_('تصاویر'), {
            'fields': ('icon', 'image'),
            'classes': ('collapse',)
        }),
        (_('تنظیمات'), {
            'fields': ('is_active', 'is_featured', 'sort_order')
        }),
        (_('SEO'), {
            'fields': ('meta_title', 'meta_description', 'seo_keywords'),
            'classes': ('collapse',)
        }),
    )
    
    def product_count(self, obj):
        return obj.product_count
    product_count.short_description = _('تعداد محصولات')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'color_display', 'is_featured', 'product_count']
    list_filter = ['is_featured', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured']
    
    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 3px;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = _('رنگ')
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = _('تعداد محصولات')


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ['name', 'sku', 'price_modifier', 'stock_quantity', 'is_unlimited_stock', 'is_active']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'caption', 'sort_order', 'is_active']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'sku', 'category', 'base_price', 'stock_quantity', 
        'is_active', 'is_featured', 'is_bestseller', 'is_new', 'is_trending'
    ]
    list_filter = [
        'product_type', 'category', 'status', 'is_active', 'is_featured', 
        'is_bestseller', 'is_new', 'is_trending', 'delivery_method', 'currency',
        'created_at', 'published_at'
    ]
    search_fields = ['name', 'sku', 'description', 'short_description']
    prepopulated_fields = {'slug': ('name',)}
    # list_editable = ['is_featured', 'is_bestseller', 'is_new', 'is_trending']  # این خط رو کامنت کن
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    inlines = [ProductVariantInline, ProductImageInline]
    
    fieldsets = (
        (_('اطلاعات اصلی'), {
            'fields': ('name', 'slug', 'sku', 'description', 'short_description')
        }),
        (_('دسته‌بندی و تگ‌ها'), {
            'fields': ('product_type', 'category', 'tags')
        }),
        (_('قیمت‌گذاری'), {
            'fields': ('base_price', 'sale_price', 'cost_price', 'currency')
        }),
        (_('موجودی'), {
            'fields': ('stock_quantity', 'low_stock_threshold', 'is_unlimited_stock')
        }),
        (_('وضعیت'), {
            'fields': ('is_active', 'status', 'published_at')
        }),
        (_('تحویل'), {
            'fields': ('delivery_method', 'delivery_time', 'auto_fulfill')
        }),
        (_('ویژگی‌ها'), {
            'fields': ('features', 'specifications', 'requirements', 'instructions'),
            'classes': ('collapse',)
        }),
        (_('رسانه'), {
            'fields': ('main_image', 'images', 'video_url')
        }),
        (_('SEO'), {
            'fields': ('meta_title', 'meta_description', 'seo_keywords'),
            'classes': ('collapse',)
        }),
        (_('پرچم‌ها'), {
            'fields': ('is_featured', 'is_bestseller', 'is_new', 'is_trending')
        }),
        (_('تخفیف'), {
            'fields': ('sale_start_date', 'sale_end_date'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['view_count', 'purchase_count', 'rating', 'review_count']
    
    def current_price_display(self, obj):
        if obj.is_on_sale:
            return format_html(
                '<span style="color: red; text-decoration: line-through;">{}</span> <span style="color: green;">{}</span>',
                obj.base_price, obj.current_price
            )
        return obj.current_price
    current_price_display.short_description = _('قیمت فعلی')
    
    def stock_status(self, obj):
        if obj.is_unlimited_stock:
            return format_html('<span style="color: green;">نامحدود</span>')
        elif obj.stock_quantity == 0:
            return format_html('<span style="color: red;">تمام شده</span>')
        elif obj.is_low_stock:
            return format_html('<span style="color: orange;">کم موجودی</span>')
        else:
            return format_html('<span style="color: green;">موجود</span>')
    stock_status.short_description = _('وضعیت موجودی')
    
    def rating_display(self, obj):
        if obj.rating:
            return format_html('{}★ ({})', obj.rating, obj.review_count)
        return '-'
    rating_display.short_description = _('امتیاز')
    
    actions = ['make_active', 'make_inactive', 'make_featured', 'remove_featured', 'duplicate_product']
    
    def make_active(self, request, queryset):
        updated = queryset.update(status='active', is_active=True)
        self.message_user(request, f'{updated} محصول فعال شد.')
    make_active.short_description = _('فعال کردن محصولات انتخاب شده')
    
    def make_inactive(self, request, queryset):
        updated = queryset.update(status='inactive', is_active=False)
        self.message_user(request, f'{updated} محصول غیرفعال شد.')
    make_inactive.short_description = _('غیرفعال کردن محصولات انتخاب شده')
    
    def make_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} محصول ویژه شد.')
    make_featured.short_description = _('ویژه کردن محصولات انتخاب شده')
    
    def remove_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} محصول از حالت ویژه خارج شد.')
    remove_featured.short_description = _('حذف از محصولات ویژه')
    
    def duplicate_product(self, request, queryset):
        for product in queryset:
            product.pk = None
            product.name = f"{product.name} (کپی)"
            product.sku = f"{product.sku}-COPY"
            product.slug = f"{product.slug}-copy"
            product.is_active = False
            product.status = 'draft'
            product.save()
        self.message_user(request, f'{queryset.count()} محصول کپی شد.')
    duplicate_product.short_description = _('کپی کردن محصولات انتخاب شده')


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'sku', 'price_modifier', 'current_price', 'stock_status', 'is_active']
    list_filter = ['is_active', 'is_unlimited_stock', 'created_at']
    search_fields = ['name', 'sku', 'product__name']
    list_editable = ['is_active']
    
    def current_price(self, obj):
        return obj.current_price
    current_price.short_description = _('قیمت فعلی')
    
    def stock_status(self, obj):
        if obj.is_unlimited_stock:
            return format_html('<span style="color: green;">نامحدود</span>')
        elif obj.stock_quantity == 0:
            return format_html('<span style="color: red;">تمام شده</span>')
        else:
            return format_html('<span style="color: green;">موجود</span>')
    stock_status.short_description = _('وضعیت موجودی')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image_display', 'alt_text', 'sort_order', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['product__name', 'alt_text', 'caption']
    list_editable = ['sort_order', 'is_active']
    ordering = ['product', 'sort_order']
    
    def image_display(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return '-'
    image_display.short_description = _('تصویر')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating_display', 'title', 'is_approved', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_approved', 'is_verified_purchase', 'created_at']
    search_fields = ['product__name', 'user__username', 'title', 'comment']
    list_editable = ['is_approved']
    ordering = ['-created_at']
    readonly_fields = ['helpful_votes', 'total_votes', 'helpful_percentage']
    
    fieldsets = (
        (_('اطلاعات اصلی'), {
            'fields': ('product', 'user', 'order')
        }),
        (_('محتوای نظر'), {
            'fields': ('rating', 'title', 'comment')
        }),
        (_('تایید'), {
            'fields': ('is_approved', 'is_verified_purchase')
        }),
        (_('آمار'), {
            'fields': ('helpful_votes', 'total_votes', 'helpful_percentage'),
            'classes': ('collapse',)
        }),
    )
    
    def rating_display(self, obj):
        return format_html('{}★', obj.rating)
    rating_display.short_description = _('امتیاز')
    
    actions = ['approve_reviews', 'disapprove_reviews']
    
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} نظر تایید شد.')
    approve_reviews.short_description = _('تایید نظرات انتخاب شده')
    
    def disapprove_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} نظر رد شد.')
    disapprove_reviews.short_description = _('رد نظرات انتخاب شده')


# Custom Admin Site
class MignumAdminSite(admin.AdminSite):
    site_header = _('مدیریت فروشگاه Mignum')
    site_title = _('پنل مدیریت')
    index_title = _('خوش آمدید به پنل مدیریت')


# Register with custom admin site
admin_site = MignumAdminSite(name='mignum_admin')

# Register models with custom admin site
admin_site.register(Category, CategoryAdmin)
admin_site.register(Tag, TagAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(ProductVariant, ProductVariantAdmin)
admin_site.register(ProductImage, ProductImageAdmin)
admin_site.register(Review, ReviewAdmin)
