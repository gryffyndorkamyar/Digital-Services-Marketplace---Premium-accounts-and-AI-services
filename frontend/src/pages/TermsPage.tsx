import React from 'react';

const TermsPage: React.FC = () => (
  <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
    <h1 className="text-3xl md:text-4xl font-bold mb-6 neon-glow">قوانین و مقررات</h1>
    <div className="space-y-6 text-gray-300 leading-8">
      <section>
        <h2 className="text-xl font-bold mb-2">شرایط استفاده</h2>
        <p>استفاده از وب‌سایت و ثبت سفارش به منزله پذیرش قوانین و مقررات زیر است. لطفاً قبل از خرید، این شرایط را مطالعه کنید.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">ثبت سفارش و پرداخت</h2>
        <p>سفارش‌ها پس از تکمیل فرآیند پرداخت ثبت و در صف پردازش قرار می‌گیرند. مسئولیت صحت اطلاعات وارد شده بر عهده کاربر است.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">تحویل و فعال‌سازی</h2>
        <p>محصولات/خدمات دیجیتال پس از ثبت موفق پرداخت، حداکثر طی ۶ تا ۸ ساعت کاری فعال/تحویل می‌شوند. جزئیات هر سفارش از طریق حساب کاربری یا ایمیل اطلاع‌رسانی خواهد شد.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">محدودیت‌های استفاده</h2>
        <p>هرگونه سوءاستفاده از سرویس‌ها، نقض حقوق مالکیت معنوی یا استفاده برخلاف قوانین کشور، ممنوع است و می‌تواند منجر به لغو دسترسی شود.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">مسئولیت‌ها</h2>
        <p>وب‌سایت متعهد به ارائه خدمات مطابق توضیحات است. مسئولیت استفاده نادرست از خدمات یا ارائه اطلاعات نادرست بر عهده کاربر است.</p>
      </section>
    </div>
  </div>
);

export default TermsPage;


