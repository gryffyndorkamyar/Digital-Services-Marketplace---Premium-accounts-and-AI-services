# RunFlare — مراحل بعد از اتصال Git

## ۱. Git
- آدرس: `https://github.com/gryffyndorkamyar/Digital-Services-Marketplace---Premium-accounts-and-AI-services.git`
- شاخه: **`stage`**
- فایل کانفیگ: **`runflare.json`** (نه `liara.json` — حذف شده)

## ۲. Environment Variables (الزامی — بدون این‌ها worker کرش می‌کند)

در RunFlare → **تنظیم متغیر محیطی** → همه خطوط `deploy/runflare.env.example` را اضافه کن.

**حداقل اجباری:**

| Key | توضیح |
|-----|--------|
| `SECRET_KEY` | **بدون این gunicorn worker بالا نمی‌آید** |
| `DEBUG` | `False` |
| `DB_ENGINE` | `django.db.backends.postgresql` |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | از دیتابیس RunFlare |
| `ALLOWED_HOSTS` | شامل `ovyraworld.com` و دامنه RunFlare |

بعد از ذخیره env → **Redeploy** بزن.

## ۳. دیسک media
فقط یک دیسک **`media`** بساز و mount کن روی `media` (دیسک `data` لازم نیست).

## ۴. Deploy
Redeploy بزن. استارت با **`start.sh`** → gunicorn روی `PORT` (8000).

## ۵. تست
- https://ovyraworld.com/
- https://ovyraworld.com/health/ → باید `ok` بدهد
- https://ovyraworld.runflare.run/
- /admin/

## ۶. createsuperuser
```bash
python manage.py createsuperuser
```

## عیب‌یابی 502
| علت | راه‌حل |
|-----|--------|
| gunicorn start نشده | Runtime log — باید `==> OVYRA — starting gunicorn (WSGI/sync)` ببینی (نه UvicornWorker) |
| لاگ `UvicornWorker` | `runflare.json` → `"args": "sh start.sh"` (رشته، نه آرایه) |
| Worker failed to boot | **SECRET_KEY** یا **DB_*** در پنل ست نشده — env را کامل کن و Redeploy |
| دیسک `data` تعریف شده ولی ساخته نشده | فقط `media` در runflare.json |
| پورت | سرویس Django = **8000** |
| `liara.json` قدیمی | حذف شد — فقط `runflare.json` |
