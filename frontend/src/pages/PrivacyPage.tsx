import React from 'react';

const PrivacyPage: React.FC = () => (
  <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
    <h1 className="text-3xl md:text-4xl font-bold mb-6 neon-glow">حریم خصوصی</h1>
    <div className="space-y-6 text-gray-300 leading-8">
      <p>ما برای ارائه خدمات بهتر، برخی اطلاعات را جمع‌آوری می‌کنیم و آن‌ها را با رعایت اصول امنیتی نگهداری می‌نماییم.</p>
      <section>
        <h2 className="text-xl font-bold mb-2">داده‌های جمع‌آوری‌شده</h2>
        <p>نام، ایمیل، شماره موبایل، سوابق سفارش، لاگ‌های فنی و اطلاعات پرداخت (صرفاً از طریق درگاه‌های امن).</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">هدف استفاده</h2>
        <p>انجام سفارش، پشتیبانی، ارتباط با کاربر، بهبود کیفیت خدمات و الزامات قانونی.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">اشتراک‌گذاری با اشخاص ثالث</h2>
        <p>اطلاعات صرفاً در حد ضرورت با ارائه‌دهندگان ضروری (مانند درگاه‌های پرداخت) به‌صورت امن به اشتراک گذاشته می‌شود.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">حقوق کاربر</h2>
        <p>برای درخواست مشاهده، اصلاح یا حذف داده‌های شخصی، از طریق ایمیل پشتیبانی با ما در ارتباط باشید: <span className="text-neonOrange">grifindorekamyar@gmail.com</span></p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">امنیت و نگهداری</h2>
        <p>ما از روش‌های متعارف برای حفاظت از اطلاعات استفاده می‌کنیم. مدت نگهداری اطلاعات بر اساس نیازهای قانونی و عملیاتی تعیین می‌شود.</p>
      </section>
    </div>
  </div>
);

export default PrivacyPage;


