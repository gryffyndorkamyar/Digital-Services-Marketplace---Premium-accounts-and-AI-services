import React from 'react';

const RefundPolicyPage: React.FC = () => (
  <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
    <h1 className="text-3xl md:text-4xl font-bold mb-6 neon-glow">سیاست لغو و بازگشت وجه</h1>
    <div className="space-y-6 text-gray-300 leading-8">
      <section>
        <h2 className="text-xl font-bold mb-2">بازه درخواست</h2>
        <p>درخواست بازگشت وجه تا ۴۸ ساعت پس از پرداخت قابل بررسی است.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">شرایط قابل استرداد</h2>
        <p>در صورتی که محتوا/کد/اکانت دیجیتال تحویل نشده یا فعال‌سازی انجام نشده باشد.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">موارد غیرقابل استرداد</h2>
        <p>پس از تحویل کد یا فعال‌سازی سرویس (به‌دلیل ماهیت دیجیتال)، بازگشت وجه امکان‌پذیر نیست.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">رویه درخواست</h2>
        <p>از طریق ایمیل پشتیبانی <span className="text-neonOrange">grifindorekamyar@gmail.com</span> درخواست خود را ارسال کنید. نتیجه بررسی حداکثر طی ۴۸ ساعت کاری اعلام و در صورت تایید، وجه طی ۳ تا ۵ روز کاری به همان روش پرداخت بازگشت داده می‌شود.</p>
      </section>
    </div>
  </div>
);

export default RefundPolicyPage;


