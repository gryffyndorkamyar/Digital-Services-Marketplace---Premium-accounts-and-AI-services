# راهنمای Deploy روی Liara

## فایل‌هایی که باید در Zip باشند:
- ✅ تمام فایل‌های Python (`.py`)
- ✅ `requirements.txt`
- ✅ `manage.py`
- ✅ `runflare.json` (تنظیمات RunFlare)
- ✅ `frontend/build/` (کل پوشه build)
- ✅ `.txt` (برای اینماد)
- ✅ `templates/` (اگر وجود دارد)

## فایل‌هایی که نباید در Zip باشند (حذف کنید):
- ❌ `frontend/node_modules/` (خیلی بزرگ است - حدود 500+ مگابایت)
- ❌ `frontend/src/` (فقط build لازم است)
- ❌ `__pycache__/` (در همه جا)
- ❌ `.git/`
- ❌ `venv/` یا `env/`
- ❌ `staticfiles/` (در Liara ساخته می‌شود)
- ❌ `media/` (روی disk mount می‌شود)
- ❌ `.vscode/`, `.idea/`
- ❌ `*.pyc`, `*.log`
- ❌ `create-deploy-zip*.ps1`, `build.sh` (اسکریپت‌های محلی)

## مراحل Deploy:

1. **Build فرانت‌اند در کامپیوتر محلی:**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

2. **Zip کردن پروژه:**
   - فقط فایل‌های لازم را zip کنید
   - مطمئن شوید `frontend/build/` در zip باشد
   - مطمئن شوید `frontend/node_modules/` در zip نباشد

3. **بررسی حجم:**
   - حجم zip باید کمتر از 254 مگابایت باشد
   - اگر بیشتر است، `frontend/node_modules` را حذف کنید

4. **آپلود در Liara:**
   - Zip را drag & drop کنید
   - Liara خودش extract می‌کند و build command را اجرا می‌کند

## تنظیمات Liara:

- **Platform:** Python
- **Port:** 8000
- **Build Command:** فقط `pip install` و `collectstatic` (npm install در Liara انجام نمی‌شود)
- **Start Command:** `gunicorn main.wsgi:application --bind 0.0.0.0:8000`

## نکات مهم:

- ✅ `frontend/build` باید در zip باشد (Django از این پوشه استفاده می‌کند)
- ✅ `frontend/node_modules` نباید در zip باشد (خیلی بزرگ است)
- ✅ Build فرانت‌اند را قبل از zip کردن انجام دهید
- ✅ Environment variables را در Liara تنظیم کنید

