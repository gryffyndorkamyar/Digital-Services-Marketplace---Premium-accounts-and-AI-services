"""
Middleware برای غیرفعال کردن CSRF برای API endpoints
"""
from django.utils.deprecation import MiddlewareMixin
from django.middleware.csrf import CsrfViewMiddleware


class DisableCSRFForAPI(MiddlewareMixin):
    """
    غیرفعال کردن CSRF برای تمام API endpoints
    """
    def process_request(self, request):
        # اگر درخواست به /api/ می‌رود، CSRF را غیرفعال کن
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None

