# common/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.db.models import Avg, Count

from .models import Category, Tag, Product, ProductVariant, ProductImage, Review
from .utils import get_product_current_price, is_product_on_sale, calculate_discount_percentage
from .constants import PRODUCT_TYPES, CATEGORY_TYPES, PRODUCT_STATUS, DELIVERY_METHODS, CURRENCIES

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """سریالایزر کاربر"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class CategorySerializer(serializers.ModelSerializer):
    """سریالایزر دسته‌بندی"""
    product_count = serializers.ReadOnlyField()
    children = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'category_type', 'parent', 'parent_name',
            'icon', 'image', 'is_active', 'is_featured', 'sort_order', 'product_count',
            'children', 'meta_title', 'meta_description', 'seo_keywords'
        ]
        read_only_fields = ['id', 'slug', 'product_count']
    
    def get_children(self, obj):
        """دریافت دسته‌بندی‌های فرزند"""
        children = Category.objects.filter(parent=obj, is_active=True, is_deleted=False)
        return CategorySerializer(children, many=True).data


class CategoryListSerializer(serializers.ModelSerializer):
    """سریالایزر لیست دسته‌بندی‌ها"""
    product_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'category_type', 'icon', 'image', 'product_count']


class TagSerializer(serializers.ModelSerializer):
    """سریالایزر تگ"""
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'color', 'description', 'is_featured', 'product_count']
        read_only_fields = ['id', 'slug', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.count()


class ProductImageSerializer(serializers.ModelSerializer):
    """سریالایزر تصاویر محصول"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'caption', 'sort_order', 'is_active']
        read_only_fields = ['id']
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None


class ProductVariantSerializer(serializers.ModelSerializer):
    """سریالایزر انواع محصول"""
    current_price = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'name', 'sku', 'price_modifier', 'current_price', 'stock_quantity',
            'is_unlimited_stock', 'is_in_stock', 'attributes', 'is_active', 'sort_order'
        ]
        read_only_fields = ['id', 'current_price', 'is_in_stock']
    
    def get_current_price(self, obj):
        return float(obj.current_price)


class ReviewSerializer(serializers.ModelSerializer):
    """سریالایزر نظرات"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    helpful_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'user', 'user_name', 'user_username', 'order',
            'rating', 'title', 'comment', 'is_approved', 'is_verified_purchase',
            'helpful_votes', 'total_votes', 'helpful_percentage', 'created_at'
        ]
        read_only_fields = [
            'id', 'user_name', 'user_username', 'is_approved', 'is_verified_purchase',
            'helpful_votes', 'total_votes', 'helpful_percentage', 'created_at'
        ]
    
    def validate(self, data):
        """اعتبارسنجی نظر"""
        # چک کردن اینکه کاربر این محصول رو خریده یا نه
        user = self.context['request'].user
        product = data['product']
        
        if not user.orders.filter(
            items__product=product,
            status='completed'
        ).exists():
            raise ValidationError(_('شما باید این محصول را خریداری کرده باشید تا بتوانید نظر دهید.'))
        
        # چک کردن اینکه قبلاً نظر داده یا نه
        if Review.objects.filter(
            user=user,
            product=product,
            order=data['order']
        ).exists():
            raise ValidationError(_('شما قبلاً برای این سفارش نظر داده‌اید.'))
        
        return data


class ProductListSerializer(serializers.ModelSerializer):
    """سریالایزر لیست محصولات"""
    category = CategoryListSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    current_price = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    is_on_sale = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    main_image_url = serializers.SerializerMethodField()
    rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description', 'product_type',
            'category', 'tags', 'base_price', 'current_price', 'discount_percentage',
            'is_on_sale', 'currency', 'is_in_stock', 'is_low_stock', 'main_image_url',
            'delivery_method', 'delivery_time', 'rating', 'review_count',
            'is_featured', 'is_bestseller', 'is_new', 'is_trending', 'created_at'
        ]
        read_only_fields = [
            'id', 'slug', 'sku', 'current_price', 'discount_percentage', 'is_on_sale',
            'is_in_stock', 'is_low_stock', 'main_image_url', 'rating', 'review_count'
        ]
    
    def get_current_price(self, obj):
        return float(get_product_current_price(obj))
    
    def get_discount_percentage(self, obj):
        return calculate_discount_percentage(obj.base_price, obj.sale_price)
    
    def get_is_on_sale(self, obj):
        return is_product_on_sale(obj)
    
    def get_main_image_url(self, obj):
        if obj.main_image:
            return self.context['request'].build_absolute_uri(obj.main_image.url)
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """سریالایزر جزئیات محصول"""
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    current_price = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    is_on_sale = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    main_image_url = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'short_description',
            'product_type', 'category', 'tags', 'base_price', 'current_price',
            'discount_percentage', 'is_on_sale', 'currency', 'stock_quantity',
            'low_stock_threshold', 'is_unlimited_stock', 'is_in_stock', 'is_low_stock',
            'status', 'delivery_method', 'delivery_time', 'auto_fulfill',
            'features', 'specifications', 'requirements', 'instructions',
            'main_image_url', 'images', 'video_url', 'variants',
            'meta_title', 'meta_description', 'seo_keywords',
            'view_count', 'purchase_count', 'rating', 'review_count',
            'is_featured', 'is_bestseller', 'is_new', 'is_trending',
            'published_at', 'sale_start_date', 'sale_end_date',
            'reviews', 'related_products', 'average_rating', 'review_stats',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'sku', 'current_price', 'discount_percentage', 'is_on_sale',
            'is_in_stock', 'is_low_stock', 'main_image_url', 'view_count',
            'purchase_count', 'rating', 'review_count', 'published_at',
            'created_at', 'updated_at'
        ]
    
    def get_current_price(self, obj):
        return float(get_product_current_price(obj))
    
    def get_discount_percentage(self, obj):
        return calculate_discount_percentage(obj.base_price, obj.sale_price)
    
    def get_is_on_sale(self, obj):
        return is_product_on_sale(obj)
    
    def get_main_image_url(self, obj):
        if obj.main_image:
            return self.context['request'].build_absolute_uri(obj.main_image.url)
        return None
    
    def get_related_products(self, obj):
        from .utils import get_related_products
        related = get_related_products(obj, limit=6)
        return ProductListSerializer(related, many=True, context=self.context).data
    
    def get_average_rating(self, obj):
        if obj.rating:
            return float(obj.rating)
        return None
    
    def get_review_stats(self, obj):
        """آمار نظرات"""
        reviews = obj.reviews.filter(is_approved=True)
        stats = {
            'total': reviews.count(),
            'average': float(reviews.aggregate(Avg('rating'))['rating__avg'] or 0),
            'distribution': {}
        }
        
        # توزیع امتیازها
        for i in range(1, 6):
            count = reviews.filter(rating=i).count()
            stats['distribution'][i] = count
        
        return stats


class ProductCreateSerializer(serializers.ModelSerializer):
    """سریالایزر ایجاد محصول"""
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'short_description', 'product_type', 'category',
            'tags', 'base_price', 'sale_price', 'currency', 'stock_quantity',
            'low_stock_threshold', 'is_unlimited_stock', 'delivery_method',
            'delivery_time', 'auto_fulfill', 'features', 'specifications',
            'requirements', 'instructions', 'main_image', 'images', 'video_url',
            'meta_title', 'meta_description', 'seo_keywords', 'is_featured',
            'is_bestseller', 'is_new', 'is_trending', 'sale_start_date',
            'sale_end_date'
        ]
    
    def validate(self, data):
        """اعتبارسنجی داده‌های محصول"""
        # چک کردن قیمت تخفیف
        if data.get('sale_price') and data['sale_price'] >= data['base_price']:
            raise ValidationError(_('قیمت تخفیف باید کمتر از قیمت اصلی باشد.'))
        
        # چک کردن تاریخ‌های تخفیف
        if data.get('sale_start_date') and data.get('sale_end_date'):
            if data['sale_start_date'] >= data['sale_end_date']:
                raise ValidationError(_('تاریخ شروع تخفیف باید قبل از تاریخ پایان باشد.'))
        
        return data


class ProductUpdateSerializer(serializers.ModelSerializer):
    """سریالایزر بروزرسانی محصول"""
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'short_description', 'product_type', 'category',
            'tags', 'base_price', 'sale_price', 'currency', 'stock_quantity',
            'low_stock_threshold', 'is_unlimited_stock', 'status', 'delivery_method',
            'delivery_time', 'auto_fulfill', 'features', 'specifications',
            'requirements', 'instructions', 'main_image', 'images', 'video_url',
            'meta_title', 'meta_description', 'seo_keywords', 'is_featured',
            'is_bestseller', 'is_new', 'is_trending', 'sale_start_date',
            'sale_end_date'
        ]
    
    def validate(self, data):
        """اعتبارسنجی داده‌های محصول"""
        # چک کردن قیمت تخفیف
        if data.get('sale_price') and data['sale_price'] >= data['base_price']:
            raise ValidationError(_('قیمت تخفیف باید کمتر از قیمت اصلی باشد.'))
        
        # چک کردن تاریخ‌های تخفیف
        if data.get('sale_start_date') and data.get('sale_end_date'):
            if data['sale_start_date'] >= data['sale_end_date']:
                raise ValidationError(_('تاریخ شروع تخفیف باید قبل از تاریخ پایان باشد.'))
        
        return data


class ProductSearchSerializer(serializers.Serializer):
    """سریالایزر جستجوی محصولات"""
    query = serializers.CharField(max_length=200, required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)
    product_type = serializers.ChoiceField(choices=PRODUCT_TYPES, required=False)
    is_featured = serializers.BooleanField(required=False)
    is_on_sale = serializers.BooleanField(required=False)
    in_stock = serializers.BooleanField(required=False)
    sort_by = serializers.ChoiceField(
        choices=[
            ('name', _('نام')),
            ('price', _('قیمت')),
            ('created_at', _('تاریخ ایجاد')),
            ('rating', _('امتیاز')),
            ('purchase_count', _('تعداد خرید')),
            ('view_count', _('تعداد بازدید'))
        ],
        required=False
    )
    sort_order = serializers.ChoiceField(
        choices=[('asc', _('صعودی')), ('desc', _('نزولی'))],
        required=False
    )


class ProductFilterSerializer(serializers.Serializer):
    """سریالایزر فیلتر محصولات"""
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    price_range = serializers.ListField(
        child=serializers.DecimalField(max_digits=10, decimal_places=2),
        max_length=2,
        required=False
    )
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)
    product_type = serializers.ChoiceField(choices=PRODUCT_TYPES, required=False)
    delivery_method = serializers.ChoiceField(choices=DELIVERY_METHODS, required=False)
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False)
    is_featured = serializers.BooleanField(required=False)
    is_on_sale = serializers.BooleanField(required=False)
    in_stock = serializers.BooleanField(required=False)
    is_new = serializers.BooleanField(required=False)
    is_trending = serializers.BooleanField(required=False)
    is_bestseller = serializers.BooleanField(required=False)


class ReviewCreateSerializer(serializers.ModelSerializer):
    """سریالایزر ایجاد نظر"""
    class Meta:
        model = Review
        fields = ['product', 'order', 'rating', 'title', 'comment']
    
    def validate_rating(self, value):
        """اعتبارسنجی امتیاز"""
        if not 1 <= value <= 5:
            raise ValidationError(_('امتیاز باید بین 1 تا 5 باشد.'))
        return value
    
    def validate(self, data):
        """اعتبارسنجی نظر"""
        user = self.context['request'].user
        product = data['product']
        order = data['order']
        
        # چک کردن اینکه سفارش متعلق به کاربر است
        if order.user != user:
            raise ValidationError(_('شما فقط می‌توانید برای سفارشات خود نظر دهید.'))
        
        # چک کردن اینکه محصول در سفارش وجود دارد
        if not order.items.filter(product=product).exists():
            raise ValidationError(_('این محصول در سفارش شما وجود ندارد.'))
        
        # چک کردن اینکه قبلاً نظر داده نشده
        if Review.objects.filter(user=user, product=product, order=order).exists():
            raise ValidationError(_('شما قبلاً برای این سفارش نظر داده‌اید.'))
        
        return data


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """سریالایزر بروزرسانی نظر"""
    class Meta:
        model = Review
        fields = ['rating', 'title', 'comment']
        read_only_fields = ['user', 'product', 'order']
    
    def validate_rating(self, value):
        """اعتبارسنجی امتیاز"""
        if not 1 <= value <= 5:
            raise ValidationError(_('امتیاز باید بین 1 تا 5 باشد.'))
        return value


class ProductAnalyticsSerializer(serializers.Serializer):
    """سریالایزر آمار محصولات"""
    total_products = serializers.IntegerField()
    active_products = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    out_of_stock_products = serializers.IntegerField()
    featured_products = serializers.IntegerField()
    new_products = serializers.IntegerField()
    on_sale_products = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    top_selling_products = ProductListSerializer(many=True)
    top_rated_products = ProductListSerializer(many=True)
    trending_products = ProductListSerializer(many=True)
