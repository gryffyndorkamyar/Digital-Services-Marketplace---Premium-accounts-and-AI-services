# راهنمای ساده RunFlare — OVYRA

## فقط ۳ کار در پنل RunFlare

### کار ۱ — متغیرهای محیطی
برو: **سرویس Django** → **تنظیم متغیر محیطی**

فایل `deploy/RUNFLARE_ENV_COPY_PASTE.txt` را باز کن و **هر خط** را در پنل اضافه کن.
جاهای `[...]` را با مقدار واقعی عوض کن.

### کار ۲ — دیسک media
یک دیسک به نام **`media`** بساز و mount کن روی **`media`**.

### کار ۳ — Redeploy
بعد از ذخیره env → **Deploy / Redeploy** از شاخه **`stage`**.

---

## ۴ چیز که باید خودت داشته باشی

| # | چی لازم داری؟ | از کجا؟ |
|---|---------------|---------|
| 1 | **SECRET_KEY** | خودت بساز (رشته تصادفی ۵۰+ کاراکتر) |
| 2 | **DB_HOST, DB_PASSWORD, DB_USER, DB_NAME** | RunFlare → Database → PostgreSQL → Connection Info |
| 3 | **دامنه** | ovyraworld.com به همین سرویس وصل باشد |
| 4 | **ZARINPAL_MERCHANT_ID** | پنل زرین‌پال (فعلاً برای بالا آمدن سایت اجباری نیست) |

---

## Postgres یا SQLite؟

**Postgres بماند.** SQLite روی RunFlare با هر Redeploy دیتا را از دست می‌دهی.
پروژه از اول برای Postgres آماده است — فقط env دیتابیس را درست بزن.

---

## بعد از Deploy — تست

1. `https://ovyraworld.com/health/` → باید بنویسد: **ok**
2. `https://ovyraworld.com/` → صفحه OVYRA

---

## اگر باز خطا داد — لاگ را بخوان

| پیام در لاگ | یعنی چی؟ | چکار کن؟ |
|-------------|----------|----------|
| `Missing required environment variables: SECRET_KEY` | SECRET_KEY نزدی | در پنل env اضافه کن |
| `Missing ... DB_HOST` | اطلاعات Postgres ناقص | از Database → Connection Info کپی کن |
| `Worker failed to boot` | معمولاً env ناقص | همه خطوط بخش ۱ و ۲ را چک کن |
| `==> OVYRA — starting gunicorn` | درست است | سایت باید بالا بیاید |

---

## دستور اولیه / CMD

**عوض نکن.** `runflare.json` خودش `sh start.sh` را اجرا می‌کند.
