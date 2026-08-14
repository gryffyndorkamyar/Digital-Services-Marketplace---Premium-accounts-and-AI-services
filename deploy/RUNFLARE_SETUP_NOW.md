# RunFlare — مراحل بعد از اتصال Git

## ۱. Git (انجام شده؟)
- آدرس: `https://github.com/gryffyndorkamyar/Digital-Services-Marketplace---Premium-accounts-and-AI-services.git`
- شاخه: **`stage`**

## ۲. Environment Variables
فایل **`deploy/runflare-panel.env`** را باز کن — هر خط را در پنل RunFlare اضافه کن.

یا تک‌تک از پنل → Environment Variables:

| Key | Value |
|-----|-------|
| DEBUG | False |
| SECRET_KEY | (از runflare-panel.env) |
| ALLOWED_HOSTS | ovyraworld.runflare.run,ovyraword.runflare.run,ovyraworld-nd7-ovyraworld.runflare.cloud |
| CORS_ALLOWED_ORIGINS | https://ovyraworld.runflare.run,https://ovyraword.runflare.run,https://ovyraworld-nd7-ovyraworld.runflare.cloud |
| CSRF_TRUSTED_ORIGINS | همان CORS |
| DB_* | از runflare-panel.env (Liara Postgres) |
| ZARINPAL_* | از runflare-panel.env |

## ۳. دیسک media
در RunFlare یک **Disk** بساز و mount کن روی `media`

## ۴. Deploy
بعد از env → **Deploy** / **Redeploy** بزن

## ۵. تست
- https://ovyraworld.runflare.run/
- https://ovyraworld-nd7-ovyraworld.runflare.cloud/
- /admin/

## ۶. createsuperuser
از Console RunFlare:
```bash
python manage.py createsuperuser
```

## عیب‌یابی
| خطا | کار |
|-----|-----|
| **502 Bad Gateway** | لاگ **Runtime** را ببین. `args` باید آرایه باشد: `["gunicorn","main.wsgi:application","-c","gunicorn.conf.py"]`. envها (SECRET_KEY, DB_*) را چک کن. |
| DisallowedHost | ALLOWED_HOSTS را چک کن |
| DB connection | DB_HOST/PORT از Liara در RunFlare باز باشد |
| صفحه سفید | لاگ deploy — frontend/build باید در repo باشد |
