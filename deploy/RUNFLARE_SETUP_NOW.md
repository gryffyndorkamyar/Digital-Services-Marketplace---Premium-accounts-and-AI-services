# RunFlare — مراحل بعد از اتصال Git

## ۱. Git
- آدرس: `https://github.com/gryffyndorkamyar/Digital-Services-Marketplace---Premium-accounts-and-AI-services.git`
- شاخه: **`stage`**
- فایل کانفیگ: **`runflare.json`** (نه `liara.json` — حذف شده)

## ۲. Environment Variables
فایل **`deploy/runflare-panel.env`** را باز کن — هر خط را در پنل RunFlare اضافه کن.

| Key | Value |
|-----|-------|
| DEBUG | False |
| SECRET_KEY | (از runflare-panel.env) |
| ALLOWED_HOSTS | ovyraworld.runflare.run,ovyraword.runflare.run,ovyraworld-nd7-ovyraworld.runflare.cloud |
| CORS_ALLOWED_ORIGINS | https://ovyraworld.runflare.run,... |
| CSRF_TRUSTED_ORIGINS | همان CORS |
| USE_LOCAL_DB | False |
| DB_* | Postgres (ممکن است host لیارا باشد — مشکلی نیست) |
| ZARINPAL_* | از runflare-panel.env |

## ۳. دیسک media
فقط یک دیسک **`media`** بساز و mount کن روی `media` (دیسک `data` لازم نیست).

## ۴. Deploy
Redeploy بزن. استارت با **`start.sh`** → gunicorn روی `PORT` (8000).

## ۵. تست
- https://ovyraworld.runflare.run/
- https://ovyraworld.runflare.run/health/ → باید `ok` بدهد
- /admin/

## ۶. createsuperuser
```bash
python manage.py createsuperuser
```

## عیب‌یابی 502
| علت | راه‌حل |
|-----|--------|
| gunicorn start نشده | Runtime log — باید `Starting gunicorn on 0.0.0.0:8000` ببینی |
| env ناقص | SECRET_KEY و DB_* در پنل |
| دیسک `data` تعریف شده ولی ساخته نشده | فقط `media` در runflare.json |
| پورت | سرویس Django = **8000** |
| `liara.json` قدیمی | حذف شد — فقط `runflare.json` |
