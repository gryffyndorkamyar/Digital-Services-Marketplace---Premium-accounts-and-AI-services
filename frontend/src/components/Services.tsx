import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, Zap, Users, Crown, Target } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Crown,
      title: 'حساب‌های پریمیوم',
      description: 'حساب‌های بازی‌های محبوب با پیشرفت بالا و آیتم‌های نادر',
      items: ['Clash of Clans', 'Call of Duty', 'PUBG Mobile', 'Free Fire'],
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-900/20 to-pink-900/20',
    },
    {
      icon: Sparkles,
      title: 'ژتون‌ها و Coin',
      description: 'خرید مستقیم و فوری ژتون، سکه و ارزهای بازی',
      items: ['Clash of Clans Gems', 'PUBG UC', 'Free Fire Diamonds', 'CODM CP'],
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-900/20 to-cyan-900/20',
    },
    {
      icon: Zap,
      title: 'خدمات هوش مصنوعی',
      description: 'بهترین ابزارهای AI برای کارهای شما',
      items: ['ChatGPT Plus', 'Midjourney', 'DALL-E', 'Claude AI'],
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-900/20 to-emerald-900/20',
    },
    {
      icon: Target,
      title: 'اکانت‌های استریم',
      description: 'حساب‌های پریمیوم سرویس‌های استریم',
      items: ['Netflix', 'Spotify', 'Disney+', 'YouTube Premium'],
      gradient: 'from-red-600 to-orange-600',
      bgGradient: 'from-red-900/20 to-orange-900/20',
    },
  ];

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk']">
            <span className="text-white">خدمات </span>
            <span className="text-gradient">ما</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            هر چیزی که برای ارتقای تجربه بازی و دیجیتال شما نیاز دارید
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${service.bgGradient} border border-purple-500/30 p-8 group cursor-pointer`}
            >
              {/* Decorative Elements */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors font-['Space_Grotesk']">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Items */}
                <div className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center space-x-2 space-x-reverse text-gray-300 group-hover:text-white transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-6 px-6 py-2.5 bg-gradient-to-r ${service.gradient} rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300`}
                >
                  مشاهده محصولات
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

