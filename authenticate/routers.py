# authenticate/routers.py
from rest_framework.routers import DefaultRouter
from . import views

# ایجاد router اصلی
auth_router = DefaultRouter()

# ثبت ViewSet ها
auth_router.register(r'users', views.UserViewSet, basename='user')
auth_router.register(r'auth', views.AuthViewSet, basename='auth')
auth_router.register(r'stats', views.UserStatsViewSet, basename='stats')

# URL patterns
urlpatterns = auth_router.urls
