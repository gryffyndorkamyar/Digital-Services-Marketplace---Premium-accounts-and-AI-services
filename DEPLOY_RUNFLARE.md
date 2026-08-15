# دیپلوی OVYRA روی RunFlare

دامنه‌ها:
- **https://ovyraworld.com** / **http://ovyraworld.com**
- **https://www.ovyraworld.com** / **http://www.ovyraworld.com**
- **https://ovyraworld.runflare.run**
- **https://ovyraword.runflare.run**
- **https://ovyraworld-nd7-ovyraworld.runflare.cloud**
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
ALLOWED_HOSTS=ovyraworld.com,www.ovyraworld.com,ovyraworld.runflare.run,ovyraword.runflare.run,ovyraworld-nd7-ovyraworld.runflare.cloud
CORS_ALLOWED_ORIGINS=https://ovyraworld.com,http://ovyraworld.com,https://www.ovyraworld.com,http://www.ovyraworld.com,https://ovyraworld.runflare.run,https://ovyraword.runflare.run,https://ovyraworld-nd7-ovyraworld.runflare.cloud
CSRF_TRUSTED_ORIGINS=https://ovyraworld.com,http://ovyraworld.com,https://www.ovyraworld.com,http://www.ovyraworld.com,https://ovyraworld.runflare.run,https://ovyraword.runflare.run,https://ovyraworld-nd7-ovyraworld.runflare.cloud
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

`runflare.json` → build: pip + migrate + collectstatic  
Runtime → `start.sh` → gunicorn **sync/WSGI** روی `$PORT` (8000)

**مهم:** در `runflare.json` فیلد `args` باید **رشته** باشد: `"args": "sh start.sh"` — اگر آرایه باشد RunFlare نادیده می‌گیرد و UvicornWorker پیش‌فرض بالا می‌آید.

فقط دیسک **`media`** لازم است. `liara.json` حذف شده — فقط `runflare.json`.

## ۷. تست

- https://ovyraworld.com/health/
- https://ovyraworld.com/
- https://ovyraworld.runflare.run/health/

## نکات

- `frontend/build` باید داخل zip باشد
- `REACT_APP_API_BASE_URL` لازم نیست (same-origin)
- پس از دیپلوی: `createsuperuser` از console RunFlare
