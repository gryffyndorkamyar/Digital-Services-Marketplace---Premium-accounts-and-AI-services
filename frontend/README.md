# Mignum Frontend - Landing Page

صفحه اصلی زیبا و مدرن برای پروژه Mignum با طراحی مشکی و مینیمال مناسب برای گیمرها.

## 🚀 ویژگی‌ها

- ✅ طراحی مدرن و مینیمال با تم مشکی
- ✅ انیمیشن‌های smooth و جذاب
- ✅ کاملاً Responsive
- ✅ استفاده از فونت‌های مدرن (Inter, Space Grotesk)
- ✅ رنگ‌بندی جذاب برای گیمرها (Purple, Pink, Cyan)
- ✅ بهینه‌سازی شده برای Performance

## 📦 نصب و راه‌اندازی

```bash
# نصب وابستگی‌ها
cd frontend
npm install

# راه‌اندازی سرور توسعه
npm start
```

سپس مرورگر را در آدرس `http://localhost:3000` باز کنید.

## 🏗️ ساختار پروژه

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.tsx       # منوی ناوبری
│   │   ├── Hero.tsx         # بخش اصلی (Hero Section)
│   │   ├── Features.tsx     # ویژگی‌ها
│   │   ├── Services.tsx     # خدمات
│   │   ├── Stats.tsx        # آمار
│   │   ├── CTA.tsx          # دعوت به اقدام
│   │   └── Footer.tsx        # فوتر
│   ├── pages/
│   │   └── LandingPage.tsx # صفحه اصلی
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css            # استایل‌های اصلی
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 بخش‌های صفحه

1. **Navbar**: منوی ناوبری ثابت با افکت blur
2. **Hero**: بخش اصلی با انیمیشن‌های جذاب
3. **Features**: نمایش ویژگی‌های کلیدی
4. **Services**: معرفی خدمات
5. **Stats**: نمایش آمار و اعداد
6. **CTA**: دعوت به ثبت‌نام
7. **Footer**: فوتر با لینک‌ها

## 🛠️ تکنولوژی‌ها

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (برای انیمیشن‌ها)
- Lucide React (آیکون‌ها)

## 📝 نکات

- تمام فایل‌ها با TypeScript نوشته شده‌اند
- از Tailwind CSS برای استایل‌دهی استفاده شده
- انیمیشن‌ها با Framer Motion پیاده‌سازی شده‌اند
- طراحی کاملاً Responsive است

