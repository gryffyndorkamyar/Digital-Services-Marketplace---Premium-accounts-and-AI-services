import React from 'react';
import { Zap, Users, Target, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 neon-glow">
            درباره ما
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ما در MIGNUM به دنبال ایجاد تجربه‌ای منحصر به فرد برای گیمرها هستیم
          </p>
        </div>

        {/* بخش‌های اصلی */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* ماموریت */}
          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8 hover:border-neonOrange/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-neonOrange/20 rounded-lg">
                <Target className="w-8 h-8 text-neonOrange" />
              </div>
              <h2 className="text-2xl font-bold text-neonOrange">ماموریت ما</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              ماموریت ما این است که بهترین خدمات و محصولات را برای گیمرها فراهم کنیم و تجربه‌ای فراموش‌نشدنی برای آن‌ها ایجاد کنیم.
            </p>
          </div>

          {/* چشم‌انداز */}
          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8 hover:border-neonOrange/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-neonOrange/20 rounded-lg">
                <Zap className="w-8 h-8 text-neonOrange" />
              </div>
              <h2 className="text-2xl font-bold text-neonOrange">چشم‌انداز</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              ما می‌خواهیم به بزرگ‌ترین پلتفرم خدمات گیمینگ در منطقه تبدیل شویم و برای میلیون‌ها گیمر ارزش ایجاد کنیم.
            </p>
          </div>
        </div>

        {/* ارزش‌ها */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 text-center hover:border-neonOrange/50 transition-all">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-neonOrange/20 rounded-full">
                <Users className="w-10 h-10 text-neonOrange" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-neonOrange">مشتری‌محوری</h3>
            <p className="text-gray-300 text-sm">
              رضایت مشتریان در اولویت اول ماست
            </p>
          </div>

          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 text-center hover:border-neonOrange/50 transition-all">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-neonOrange/20 rounded-full">
                <Award className="w-10 h-10 text-neonOrange" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-neonOrange">کیفیت</h3>
            <p className="text-gray-300 text-sm">
              ارائه بهترین کیفیت در تمام خدمات
            </p>
          </div>

          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 text-center hover:border-neonOrange/50 transition-all">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-neonOrange/20 rounded-full">
                <Zap className="w-10 h-10 text-neonOrange" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-neonOrange">نوآوری</h3>
            <p className="text-gray-300 text-sm">
              همیشه در حال پیشرفت و نوآوری هستیم
            </p>
          </div>
        </div>

        {/* تیم */}
        <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-neonOrange">تیم ما</h2>
          <p className="text-gray-300 text-center leading-relaxed max-w-3xl mx-auto">
            تیم MIGNUM متشکل از متخصصان با تجربه در زمینه گیمینگ، فناوری و خدمات مشتری است. 
            ما با عشق و علاقه به کار خود، بهترین تجربه را برای شما فراهم می‌کنیم.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

