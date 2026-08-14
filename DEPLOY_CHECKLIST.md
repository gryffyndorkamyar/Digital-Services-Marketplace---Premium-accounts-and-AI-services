# ✅ چک‌لیست Deploy - مطمئن شوید همه چیز آماده است

## قبل از Zip کردن:

### 1. Build فرانت‌اند:
```bash
cd frontend
npm install
npm run build
cd ..
```

### 2. بررسی فایل‌های ضروری:
- ✅ `frontend/build/index.html` باید وجود داشته باشد
- ✅ `frontend/build/static/` باید وجود داشته باشد
- ✅ `liara.json` باید وجود داشته باشد
- ✅ `.txt` باید وجود داشته باشد (برای اینماد)

### 3. فایل‌هایی که باید از Zip حذف شوند:
- ❌ `frontend/node_modules/` (حدود 500+ مگابایت)
- ❌ `frontend/src/` (فقط build لازم است)
- ❌ `__pycache__/` (در همه جا)
- ❌ `.git/`
- ❌ `venv/` یا `env/`
- ❌ `staticfiles/` (در Liara ساخته می‌شود)
- ❌ `media/` (روی disk mount می‌شود)

### 4. فایل‌هایی که باید در Zip باشند:
- ✅ `frontend/build/` (کل پوشه)
- ✅ تمام فایل‌های `.py`
- ✅ `requirements.txt`
- ✅ `manage.py`
- ✅ `liara.json`
- ✅ `.txt`

## بعد از Deploy در Liara:

### 1. بررسی Environment Variables:
- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS` (شامل دامنه Liara)
- `DATABASE_URL` یا تنظیمات دیتابیس
- `CORS_ALLOWED_ORIGINS` (شامل دامنه Liara)

### 2. بررسی Build Logs:
- باید `pip install` موفق باشد
- باید `collectstatic` موفق باشد
- نباید خطای `npm install` باشد (چون در build command نیست)

### 3. تست فرانت‌اند:
- باز کردن دامنه در مرورگر
- باید صفحه React نمایش داده شود
- باید API calls کار کنند (`/api/...`)
- باید static files (CSS, JS) لود شوند

## اگر فرانت‌اند نمایش داده نشد:

1. **بررسی Logs در Liara:**
   - آیا `frontend/build` در پروژه است؟
   - آیا `collectstatic` اجرا شده؟

2. **بررسی Console مرورگر:**
   - آیا خطای 404 برای static files وجود دارد؟
   - آیا خطای CORS وجود دارد?

3. **بررسی Network Tab:**
   - آیا `index.html` لود می‌شود؟
   - آیا static files (JS, CSS) لود می‌شوند؟

4. **بررسی Django:**
   - آیا `REACT_BUILD_DIR` درست تنظیم شده؟
   - آیا `STATICFILES_DIRS` شامل `frontend/build/static` است؟

## نکات مهم:

- ✅ `frontend/build` باید در zip باشد
- ✅ `frontend/node_modules` نباید در zip باشد
- ✅ Build فرانت‌اند را قبل از zip کردن انجام دهید
- ✅ Environment variables را در Liara تنظیم کنید
- ✅ بعد از deploy، `collectstatic` باید اجرا شود

