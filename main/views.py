# main/views.py
from django.http import HttpResponse, Http404
from django.conf import settings
from pathlib import Path


def health_check(_request):
    """Lightweight probe for RunFlare / nginx upstream checks."""
    return HttpResponse("ok", content_type="text/plain")


def serve_txt_file(request):
    """نمایش فایل 47366271.txt از root پروژه برای اینماد"""
    # مسیر فایل 47366271.txt در root پروژه
    txt_file_path = Path(settings.BASE_DIR) / '47366271.txt'
    
    # بررسی وجود فایل
    if not txt_file_path.exists():
        raise Http404("فایل 47366271.txt یافت نشد")
    
    # خواندن محتوای فایل
    try:
        with open(txt_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        raise Http404(f"خطا در خواندن فایل: {str(e)}")
    
    # برگرداندن محتوا به صورت plain text
    return HttpResponse(content, content_type='text/plain; charset=utf-8')

