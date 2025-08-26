# common/consumers.py
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache
from .models import Product, Category, Review
from .serializers import ProductListSerializer, CategorySerializer, ReviewSerializer

logger = logging.getLogger(__name__)


class ProductConsumer(AsyncWebsocketConsumer):
    """WebSocket Consumer برای محصولات"""
    
    async def connect(self):
        """اتصال WebSocket"""
        await self.accept()
        logger.info(f"WebSocket connected: {self.channel_name}")

    async def disconnect(self, close_code):
        """قطع اتصال WebSocket"""
        logger.info(f"WebSocket disconnected: {self.channel_name}")

    async def receive(self, text_data):
        """دریافت پیام از کلاینت"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'subscribe_products':
                await self.subscribe_products(data)
            elif message_type == 'subscribe_category':
                await self.subscribe_category(data)
            elif message_type == 'search_products':
                await self.search_products(data)
            elif message_type == 'get_product_updates':
                await self.get_product_updates(data)
            else:
                await self.send(text_data=json.dumps({
                    'error': 'Unknown message type'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON'
            }))
        except Exception as e:
            logger.error(f"Error in receive: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Internal server error'
            }))

    @database_sync_to_async
    def get_featured_products(self):
        """دریافت محصولات ویژه"""
        products = Product.objects.filter(
            is_active=True, 
            is_deleted=False,
            is_featured=True
        ).select_related('category')[:10]
        return ProductListSerializer(products, many=True).data

    @database_sync_to_async
    def get_trending_products(self):
        """دریافت محصولات محبوب"""
        products = Product.objects.filter(
            is_active=True, 
            is_deleted=False,
            is_trending=True
        ).select_related('category')[:10]
        return ProductListSerializer(products, many=True).data

    @database_sync_to_async
    def get_new_products(self):
        """دریافت محصولات جدید"""
        products = Product.objects.filter(
            is_active=True, 
            is_deleted=False,
            is_new=True
        ).select_related('category')[:10]
        return ProductListSerializer(products, many=True).data

    async def subscribe_products(self, data):
        """اشتراک در محصولات"""
        try:
            featured_products = await self.get_featured_products()
            trending_products = await self.get_trending_products()
            new_products = await self.get_new_products()
            
            await self.send(text_data=json.dumps({
                'type': 'products_update',
                'featured': featured_products,
                'trending': trending_products,
                'new': new_products
            }))
            
        except Exception as e:
            logger.error(f"Error in subscribe_products: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Failed to get products'
            }))

    async def subscribe_category(self, data):
        """اشتراک در دسته‌بندی"""
        category_id = data.get('category_id')
        if not category_id:
            await self.send(text_data=json.dumps({
                'error': 'Category ID required'
            }))
            return
            
        try:
            category_products = await self.get_category_products(category_id)
            await self.send(text_data=json.dumps({
                'type': 'category_update',
                'category_id': category_id,
                'products': category_products
            }))
            
        except Exception as e:
            logger.error(f"Error in subscribe_category: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Failed to get category products'
            }))

    @database_sync_to_async
    def get_category_products(self, category_id):
        """دریافت محصولات یک دسته‌بندی"""
        products = Product.objects.filter(
            category_id=category_id,
            is_active=True,
            is_deleted=False
        ).select_related('category')[:20]
        return ProductListSerializer(products, many=True).data

    async def search_products(self, data):
        """جستجوی محصولات"""
        query = data.get('query', '')
        if not query:
            await self.send(text_data=json.dumps({
                'error': 'Search query required'
            }))
            return
            
        try:
            search_results = await self.perform_search(query)
            await self.send(text_data=json.dumps({
                'type': 'search_results',
                'query': query,
                'results': search_results
            }))
            
        except Exception as e:
            logger.error(f"Error in search_products: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Search failed'
            }))

    @database_sync_to_async
    def perform_search(self, query):
        """انجام جستجو"""
        from .utils import search_products
        products = search_products(query)[:10]
        return ProductListSerializer(products, many=True).data

    async def get_product_updates(self, data):
        """دریافت به‌روزرسانی‌های محصول"""
        product_id = data.get('product_id')
        if not product_id:
            await self.send(text_data=json.dumps({
                'error': 'Product ID required'
            }))
            return
            
        try:
            product_data = await self.get_product_data(product_id)
            await self.send(text_data=json.dumps({
                'type': 'product_update',
                'product': product_data
            }))
            
        except Exception as e:
            logger.error(f"Error in get_product_updates: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Failed to get product updates'
            }))

    @database_sync_to_async
    def get_product_data(self, product_id):
        """دریافت اطلاعات محصول"""
        try:
            product = Product.objects.get(
                id=product_id,
                is_active=True,
                is_deleted=False
            )
            return ProductDetailSerializer(product).data
        except Product.DoesNotExist:
            return None


class ReviewConsumer(AsyncWebsocketConsumer):
    """WebSocket Consumer برای نظرات"""
    
    async def connect(self):
        """اتصال WebSocket"""
        await self.accept()
        logger.info(f"Review WebSocket connected: {self.channel_name}")

    async def disconnect(self, close_code):
        """قطع اتصال WebSocket"""
        logger.info(f"Review WebSocket disconnected: {self.channel_name}")

    async def receive(self, text_data):
        """دریافت پیام از کلاینت"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'subscribe_reviews':
                await self.subscribe_reviews(data)
            elif message_type == 'add_review':
                await self.add_review(data)
            else:
                await self.send(text_data=json.dumps({
                    'error': 'Unknown message type'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON'
            }))
        except Exception as e:
            logger.error(f"Error in receive: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Internal server error'
            }))

    async def subscribe_reviews(self, data):
        """اشتراک در نظرات محصول"""
        product_id = data.get('product_id')
        if not product_id:
            await self.send(text_data=json.dumps({
                'error': 'Product ID required'
            }))
            return
            
        try:
            reviews = await self.get_product_reviews(product_id)
            await self.send(text_data=json.dumps({
                'type': 'reviews_update',
                'product_id': product_id,
                'reviews': reviews
            }))
            
        except Exception as e:
            logger.error(f"Error in subscribe_reviews: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Failed to get reviews'
            }))

    @database_sync_to_async
    def get_product_reviews(self, product_id):
        """دریافت نظرات محصول"""
        reviews = Review.objects.filter(
            product_id=product_id,
            is_approved=True,
            is_deleted=False
        ).select_related('user')[:20]
        return ReviewSerializer(reviews, many=True).data

    async def add_review(self, data):
        """افزودن نظر جدید"""
        # این بخش نیاز به authentication دارد
        # فعلاً فقط پیام دریافت می‌کند
        await self.send(text_data=json.dumps({
                'type': 'review_added',
                'message': 'Review will be processed'
            }))
