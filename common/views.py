from django.shortcuts import render

# Create your views here.
# common/views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F, Count, Avg
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.shortcuts import get_object_or_404
import logging

from .models import Category, Product, Review, Tag, ProductVariant, ProductImage
from .serializers import (
    CategorySerializer, CategoryListSerializer, ProductListSerializer, 
    ProductDetailSerializer, ProductCreateSerializer, ProductUpdateSerializer,
    ReviewSerializer, ReviewCreateSerializer, TagSerializer,
    ProductVariantSerializer, ProductImageSerializer
)
from .utils import get_related_products, get_trending_products, search_products

logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet برای دسته‌بندی‌ها"""
    queryset = Category.objects.filter(is_active=True, is_deleted=False)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category_type', 'is_featured', 'parent']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'sort_order', 'created_at']
    ordering = ['sort_order', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        return CategorySerializer

    @method_decorator(cache_page(60 * 15))  # 15 minutes cache
    def list(self, request, *args, **kwargs):
        """لیست دسته‌بندی‌ها با کش"""
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """محصولات یک دسته‌بندی"""
        category = self.get_object()
        products = category.products.filter(
            is_active=True, 
            is_deleted=False,
            status='active'
        ).select_related('category').prefetch_related('tags')
        
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """دسته‌بندی‌های ویژه"""
        categories = self.queryset.filter(is_featured=True)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def tree(self, request):
        """ساختار درختی دسته‌بندی‌ها"""
        root_categories = self.queryset.filter(parent=None)
        serializer = self.get_serializer(root_categories, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet برای محصولات"""
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'category', 'product_type', 'status', 'is_featured', 
        'is_bestseller', 'is_new', 'is_trending', 'currency'
    ]
    search_fields = ['name', 'description', 'short_description', 'sku']
    ordering_fields = [
        'name', 'base_price', 'sale_price', 'rating', 'view_count', 
        'purchase_count', 'created_at', 'published_at'
    ]
    ordering = ['-created_at']

    def get_queryset(self):
        """QuerySet بهینه شده"""
        return Product.objects.filter(
            is_active=True, 
            is_deleted=False
        ).select_related(
            'category', 'created_by', 'updated_by'
        ).prefetch_related(
            'tags', 'variants', 'product_images', 'reviews'
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            total_reviews=Count('reviews', filter=Q(reviews__is_approved=True))  # نام رو تغییر دادم
        )

    def get_serializer_class(self):
        if self.action == 'create':
            return ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def retrieve(self, request, *args, **kwargs):
        """نمایش جزئیات محصول با افزایش بازدید"""
        instance = self.get_object()
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        """تغییر وضعیت ویژه بودن"""
        product = self.get_object()
        product.is_featured = not product.is_featured
        product.save(update_fields=['is_featured'])
        return Response({'is_featured': product.is_featured})

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        """محصولات مرتبط"""
        product = self.get_object()
        related_products = get_related_products(product, limit=6)
        serializer = ProductListSerializer(related_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """محصولات ویژه"""
        products = self.get_queryset().filter(is_featured=True)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        """محصولات پرفروش"""
        products = self.get_queryset().filter(is_bestseller=True)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def new_products(self, request):
        """محصولات جدید"""
        products = self.get_queryset().filter(is_new=True)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """محصولات محبوب"""
        products = get_trending_products(limit=10)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """محصولات تخفیف‌دار"""
        products = self.get_queryset().filter(
            sale_price__isnull=False,
            sale_price__gt=0
        )
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """جستجوی پیشرفته"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Query parameter required'}, status=400)
        
        products = search_products(query)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet برای نظرات"""
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['product', 'rating', 'is_approved', 'is_verified_purchase']
    ordering_fields = ['rating', 'created_at', 'helpful_votes']
    ordering = ['-created_at']

    def get_queryset(self):
        return Review.objects.filter(
            is_approved=True,
            is_deleted=False
        ).select_related('user', 'product')

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ReviewSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        """ایجاد نظر با کاربر فعلی"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def helpful(self, request, pk=None):
        """رای مفید به نظر"""
        review = self.get_object()
        review.helpful_votes = F('helpful_votes') + 1
        review.total_votes = F('total_votes') + 1
        review.save(update_fields=['helpful_votes', 'total_votes'])
        return Response({'message': 'Vote recorded'})

    @action(detail=True, methods=['post'])
    def not_helpful(self, request, pk=None):
        """رای غیرمفید به نظر"""
        review = self.get_object()
        review.total_votes = F('total_votes') + 1
        review.save(update_fields=['total_votes'])
        return Response({'message': 'Vote recorded'})


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet برای تگ‌ها"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_featured']
    search_fields = ['name', 'description']

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """محصولات یک تگ"""
        tag = self.get_object()
        products = tag.products.filter(
            is_active=True, 
            is_deleted=False,
            status='active'
        )
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)