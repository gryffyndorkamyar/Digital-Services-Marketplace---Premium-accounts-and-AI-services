import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Globe, 
  CreditCard, 
  Smartphone, 
  Gamepad2,
  Lock,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'تحویل فوری',
      description: 'محصولات شما در کمتر از 5 دقیقه آماده می‌شود',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: '100% امن',
      description: 'تمام تراکنش‌ها با بالاترین سطح امنیت انجام می‌شود',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Gamepad2,
      title: 'محصولات متنوع',
      description: 'از کلش آف کلنز تا کال آف دیوتی و خیلی بیشتر',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'پشتیبانی 24/7',
      description: 'تیم پشتیبانی ما همیشه آماده کمک به شماست',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CreditCard,
      title: 'پرداخت آسان',
      description: 'پرداخت با تمام کارت‌های بانکی و کیف پول‌های دیجیتال',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Smartphone,
      title: 'دسترسی از همه جا',
      description: 'از موبایل، تبلت یا کامپیوتر به راحتی خرید کنید',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Lock,
      title: 'گارانتی',
      description: 'در صورت مشکل، مبلغ شما بازگردانده می‌شود',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'قیمت‌های رقابتی',
      description: 'بهترین قیمت‌ها در بازار با کیفیت تضمینی',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Clock,
      title: 'زمان صرفه‌جویی',
      description: 'دیگر نیازی به صرف ساعت‌ها وقت برای خرید نیست',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Award,
      title: 'کیفیت بالا',
      description: 'فقط محصولات با کیفیت و تایید شده ارائه می‌دهیم',
      color: 'from-yellow-500 to-amber-500',
    },
  ];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk']">
            <span className="text-white">چرا </span>
            <span className="text-gradient">Mignum</span>
            <span className="text-white">؟</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            ما بهترین تجربه خرید را برای گیمرها فراهم می‌کنیم
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

