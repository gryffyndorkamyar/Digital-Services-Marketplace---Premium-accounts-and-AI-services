import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      title: 'حساب‌های بازی',
      description: 'حساب‌های پریمیوم برای بازی‌های محبوب',
      image: '🎮',
      link: '/products?category=gaming',
    },
    {
      title: 'سرویس‌های AI',
      description: 'دسترسی به بهترین سرویس‌های هوش مصنوعی',
      image: '🤖',
      link: '/products?category=ai',
    },
    {
      title: 'خدمات دیجیتال',
      description: 'انواع خدمات و محصولات دیجیتال',
      image: '💻',
      link: '/products?category=digital',
    },
  ];

  return (
    <section className="py-20 bg-dark-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 neon-glow-subtle">
            خدمات ما
          </h2>
          <p className="text-gray-400 text-lg">
            انتخاب از بین بهترین خدمات دیجیتال
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="bg-dark-100 p-8 rounded-lg neon-border-subtle hover:neon-border transition-all duration-300 group"
            >
              <div className="text-6xl mb-4 text-center">{service.image}</div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neonOrange transition-colors text-center">
                {service.title}
              </h3>
              <p className="text-gray-400 text-center mb-4">
                {service.description}
              </p>
              <div className="flex items-center justify-center text-neonOrange group-hover:translate-x-1 transition-transform">
                <span className="font-medium">مشاهده بیشتر</span>
                <ArrowLeft className="w-5 h-5 mr-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

