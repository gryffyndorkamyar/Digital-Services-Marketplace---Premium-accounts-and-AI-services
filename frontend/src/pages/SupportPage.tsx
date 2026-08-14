import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const SupportPage: React.FC = () => (
  <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
    <h1 className="text-3xl md:text-4xl font-bold mb-6 neon-glow">پشتیبانی و ثبت شکایات</h1>
    <div className="space-y-6 text-gray-300 leading-8">
      <section className="space-y-3">
        <p>ما متعهد به پاسخ‌گویی سریع و منصفانه به درخواست‌ها و شکایات شما هستیم.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-neonOrange" />
              <h3 className="font-bold text-neonOrange">ایمیل پشتیبانی</h3>
            </div>
            <p>grifindorekamyar@gmail.com</p>
          </div>
          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-neonOrange" />
              <h3 className="font-bold text-neonOrange">شماره تماس پشتیبانی</h3>
            </div>
            <p>09379146130</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">ساعات پاسخ‌گویی</h2>
        <p>هر روز از ساعت ۱۰:۳۰ صبح تا ۶:۳۰ عصر.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">رویه رسیدگی</h2>
        <ul className="list-disc pr-5 space-y-2">
          <li>ثبت درخواست از طریق ایمیل یا فرم تماس.</li>
          <li>دریافت پاسخ اولیه حداکثر طی ۲۴ تا ۴۸ ساعت کاری.</li>
          <li>در صورت نیاز به بررسی بیشتر، زمان‌بندی به شما اطلاع داده می‌شود.</li>
        </ul>
      </section>
      <section className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-5 h-5 text-neonOrange" />
          <h3 className="font-bold text-neonOrange">شبکه اجتماعی</h3>
        </div>
        <p>اینستاگرام: <a className="text-neonOrange underline" href="https://instagram.com/mignum_" target="_blank" rel="noreferrer">@mignum_</a></p>
      </section>
    </div>
  </div>
);

export default SupportPage;


