# common/routers.py
from rest_framework.routers import DefaultRouter
from . import views

# ایجاد router اصلی
api_router = DefaultRouter()

# ثبت ViewSet ها
api_router.register(r'categories', views.CategoryViewSet, basename='category')
api_router.register(r'products', views.ProductViewSet, basename='product')
api_router.register(r'reviews', views.ReviewViewSet, basename='review')
api_router.register(r'tags', views.TagViewSet, basename='tag')

# URL patterns
urlpatterns = api_router.urls
