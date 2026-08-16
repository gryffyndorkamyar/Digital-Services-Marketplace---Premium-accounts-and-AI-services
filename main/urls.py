"""
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from common.routers import urlpatterns as common_urls
from authenticate.routers import urlpatterns as auth_urls
from cart.routers import urlpatterns as cart_urls
from main.views import health_check, static_health, serve_txt_file
from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('health/static/', static_health, name='static_health'),
    path('admin/', admin.site.urls),
    
    # JWT Token URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # App URLs
    path('api/', include(common_urls)),
    path('api/', include(auth_urls)),
    path('api/', include(cart_urls)),
    
    # Serve .txt file for اینماد verification
    # Both /txt and /47366271.txt will serve the same file
    path('txt', serve_txt_file, name='txt_file'),
    path('47366271.txt', serve_txt_file, name='enamad_txt_file'),
]

# Serve React index.html for all non-API routes (both development and production)
@never_cache
def serve_react(request):
    react_build_index = settings.REACT_BUILD_DIR / 'index.html'
    if react_build_index.exists():
        with open(react_build_index, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    return HttpResponse('<html><body><h1>React build not found. Please run: cd frontend && npm run build</h1></body></html>', content_type='text/html')

# Media must be served explicitly in production (WhiteNoise does not serve MEDIA)
from django.views.static import serve as static_serve
from pathlib import Path
from django.http import Http404


@never_cache
def serve_prod_static(request, path):
    """Serve JS/CSS when RunFlare nginx blocks /static/ — uses /ovyra-static/static/."""
    roots = [
        Path(settings.STATIC_ROOT),
        settings.REACT_BUILD_DIR / 'static',
    ]
    for root in roots:
        file_path = root / path
        if file_path.is_file():
            return static_serve(request, path, document_root=str(root))
    raise Http404(f"Static file not found: {path}")


@never_cache
def serve_ovyra_static_build(request, path):
    """Serve React build root files under /ovyra-static/ (logo, manifest, brand/, etc.)."""
    file_path = settings.REACT_BUILD_DIR / path
    if file_path.is_file():
        return static_serve(request, path, document_root=str(settings.REACT_BUILD_DIR))
    raise Http404(f"Build file not found: {path}")


urlpatterns += [
    re_path(r'^ovyra-static/static/(?P<path>.*)$', serve_prod_static),
    re_path(r'^ovyra-static/(?!static/)(?P<path>.*)$', serve_ovyra_static_build),
    re_path(r'^media/(?P<path>.*)$', static_serve, {'document_root': settings.MEDIA_ROOT}),
]

# In DEBUG, also expose django static helpers (WhiteNoise covers production static)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve files from React build root (for public assets like images)
# This serves files like /31c57b54718309a92b5d2900a15ace5b.png from build/
if settings.REACT_BUILD_DIR.exists():
    def serve_build_files(request, path):
        """Serve files from React build root, excluding index.html"""
        if path == 'index.html':
            return serve_react(request)
        # homepage=/ovyra-static — strip prefix for files under build/
        if path.startswith('ovyra-static/'):
            path = path[len('ovyra-static/') :]
        file_path = settings.REACT_BUILD_DIR / path
        if file_path.exists() and file_path.is_file():
            return static_serve(request, path, document_root=str(settings.REACT_BUILD_DIR))
        return serve_react(request)

    # Serve React app and build files for all non-API routes
    urlpatterns += [
        re_path(
            r'^(?!admin|api|media|static|ovyra-static|health|txt|47366271\.txt)(?P<path>.*)$',
            serve_build_files,
        ),
    ]
else:
    # Serve React app for all non-API routes
    urlpatterns += [
        re_path(r'^(?!admin|api|media|static|ovyra-static|health|txt|47366271\.txt).*', serve_react),
    ]
