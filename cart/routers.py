# cart/routers.py
from rest_framework.routers import DefaultRouter
from . import views

# ایجاد router اصلی
cart_router = DefaultRouter()

# ثبت ViewSet ها
cart_router.register(r'carts', views.CartViewSet, basename='cart')
cart_router.register(r'orders', views.OrderViewSet, basename='order')
cart_router.register(r'coupons', views.CouponViewSet, basename='coupon')
cart_router.register(r'cart-stats', views.CartStatsViewSet, basename='cart-stats')
cart_router.register(r'order-stats', views.OrderStatsViewSet, basename='order-stats')

# URL patterns
urlpatterns = cart_router.urls
