# دیپلوی OVYRA / Mignum روی RunCloud

پروژه **تک‌سرور** است: Django + Gunicorn هم API و هم React build را سرو می‌کند.

---

## پیش‌نیازها

- سرور VPS متصل به **RunCloud**
- **Python 3.10+** (از RunCloud Web Application)
- **PostgreSQL** (روی همان سرور یا سرویس جدا)
- دامنه با DNS به IP سرور
- SSL از RunCloud (Let's Encrypt)

---

## مرحله ۱ — Build فرانت‌اند (روی کامپیوتر خودت)

```powershell
cd frontend
npm ci
npm run build
cd ..
```

بعد از build باید `frontend/build/index.html` وجود داشته باشد.

---

## مرحله ۲ — آپلود کد روی سرور

### روش A: Git (پیشنهادی)

1. پروژه را روی GitHub/GitLab push کن
2. در RunCloud → Web Application → Git deployment را وصل کن
3. Branch: `main`

### روش B: Zip

```powershell
.\create-deploy-runcloud.ps1
```

فایل `mignum-runcloud.zip` را با SFTP در مسیر web app آپلود و extract کن.

---

## مرحله ۳ — ساخت Web Application در RunCloud

1. **RunCloud** → سرور → **Web Application** → Create
2. **Domain:** دامنه واقعی (مثلاً `ovyra.ir`)
3. **Web Application Type:** Custom یا Python (بسته به پلن)
4. **Document root:** مسیر ریشه پروژه (جایی که `manage.py` هست)

### Start / Process Manager

دستور اجرای Gunicorn:

```bash
gunicorn main.wsgi:application --bind 127.0.0.1:8000 --workers 2 --timeout 120
```

در RunCloud معمولاً از **Supervisor** یا **Process Manager** همین دستور را ثبت می‌کنی.

### Deploy Script (Post-deploy)

```bash
bash deploy/runcloud-deploy.sh
```

یا در RunCloud Deploy Script:

```bash
pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput
```

---

## مرحله ۴ — Environment Variables

از `deploy/runcloud.env.example` کپی بگیر و در RunCloud Environment Variables بگذار.

**حتماً:**

| متغیر | مثال |
|--------|------|
| `DEBUG` | `False` |
| `SECRET_KEY` | یک رشته تصادفی طولانی |
| `ALLOWED_HOSTS` | `ovyra.ir,www.ovyra.ir` |
| `CORS_ALLOWED_ORIGINS` | `https://ovyra.ir,https://www.ovyra.ir` |
| `DB_*` | اطلاعات PostgreSQL |

---

## مرحله ۵ — Nginx

در RunCloud → Web Application → **Nginx Config** → Custom Config

از `deploy/nginx-runcloud.conf.example` استفاده کن و `YOUR_DOMAIN` را عوض کن.

RunCloud SSL را فعال کن تا `X-Forwarded-Proto: https` به Django برسد.

---

## مرحله ۶ — PostgreSQL

روی RunCloud یا دستی:

```sql
CREATE USER mignum_user WITH PASSWORD 'your-password';
CREATE DATABASE mignum OWNER mignum_user;
```

سپس migrate:

```bash
python manage.py migrate
python manage.py createsuperuser
```

---

## مرحله ۷ — Media (آپلود تصاویر)

پوشه `media/` باید **بین deployها پاک نشود**.

- مسیر ثابت خارج از release، مثلاً `/home/runcloud/media/mignum`
- یا symlink از `media` به آن مسیر

---

## تست بعد از دیپلوی

- [ ] `https://YOUR_DOMAIN/` — لندینگ React
- [ ] `https://YOUR_DOMAIN/api/` — API
- [ ] `https://YOUR_DOMAIN/admin/` — پنل ادمین
- [ ] `https://YOUR_DOMAIN/brand/ovyra-logo.png` — asset استاتیک
- [ ] ثبت‌نام / ورود / سبد

---

## عیب‌یابی

| مشکل | راه‌حل |
|------|--------|
| صفحه سفید | `frontend/build` روی سرور نیست — دوباره build و deploy |
| 502 Bad Gateway | Gunicorn خاموش — Process Manager را چک کن |
| DisallowedHost | `ALLOWED_HOSTS` را با دامنه درست کن |
| CSRF / CORS | `CORS_ALLOWED_ORIGINS` با `https://` |
| Static 404 | `collectstatic` را دوباره اجرا کن |

---

## نکته

- **Node روی سرور لازم نیست** اگر `frontend/build` را از قبل آپلود کرده‌ای
- WebSocket (Channels) با Gunicorn WSGI کار نمی‌کند — برای prod فعلاً critical نیست
- پرداخت زرین‌پال: `ZARINPAL_SANDBOX=False` و Merchant ID واقعی
