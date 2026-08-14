# دیپلوی OVYRA روی RunFlare

دامنه‌ها:
- **https://ovyraworld.runflare.run**
- **https://ovyraword.runflare.run**

---

## ۱. Build فرانت (لوکال)

```powershell
cd frontend
npm ci
npm run build
cd ..
```

## ۲. ساخت Zip

```powershell
.\create-deploy-runflare.ps1
```

خروجی: `ovyra-runflare.zip`

## ۳. RunFlare Panel

1. پروژه **ovyraword** (یا ovyraworld) بساز
2. سرویس **Django / Python**
3. هر دو دامنه را به سرویس وصل کن
4. دیسک **media** برای آپلود تصاویر

## ۴. Environment Variables

از `deploy/runflare.env.example` کپی کن در پنل RunFlare:

```
ALLOWED_HOSTS=ovyraworld.runflare.run,ovyraword.runflare.run
CORS_ALLOWED_ORIGINS=https://ovyraworld.runflare.run,https://ovyraword.runflare.run
CSRF_TRUSTED_ORIGINS=https://ovyraworld.runflare.run,https://ovyraword.runflare.run
DEBUG=False
SECRET_KEY=...
DB_*=...
```

## ۵. آپلود

**CLI:**
```powershell
runflare deploy
```

یا zip را در پنل آپلود کن.

## ۶. Build روی سرور (خودکار)

`runflare.json`:
```json
pip install -r requirements.txt && migrate && collectstatic
gunicorn main.wsgi:application --bind 0.0.0.0:8000
```

## ۷. تست

- https://ovyraworld.runflare.run/
- https://ovyraword.runflare.run/
- /api/ و /admin/

## نکات

- `frontend/build` باید داخل zip باشد
- `REACT_APP_API_BASE_URL` لازم نیست (same-origin)
- پس از دیپلوی: `createsuperuser` از console RunFlare
