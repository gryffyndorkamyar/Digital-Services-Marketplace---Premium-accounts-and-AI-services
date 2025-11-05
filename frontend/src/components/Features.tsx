import React from 'react';
import { Shield, Zap, Gamepad2, CreditCard } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Gamepad2 className="w-12 h-12" />,
      title: 'حساب‌های بازی',
      description: 'حساب‌های پریمیوم بازی‌های محبوب مثل Clash of Clans، Call of Duty و...',
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'سرویس‌های AI',
      description: 'ChatGPT Plus، Claude Pro و سایر سرویس‌های هوش مصنوعی',
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'امن و مطمئن',
      description: 'تمام حساب‌ها با ضمانت کامل و پشتیبانی 24/7',
    },
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: 'پرداخت آسان',
      description: 'پرداخت سریع و امن با درگاه زرین‌پال',
    },
  ];

  return (
    <section className="py-20 bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 neon-glow-subtle">
            چرا ما؟
          </h2>
          <p className="text-gray-400 text-lg">
            پلتفرم جامع برای خرید و فروش خدمات دیجیتال
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-dark-200 p-6 rounded-lg neon-border-subtle hover:neon-border transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-neonOrange mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neonOrange transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

