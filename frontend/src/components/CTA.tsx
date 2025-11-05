import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-dark-dark relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neonOrange/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neonOrange/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <Zap className="w-16 h-16 text-neonOrange neon-pulse" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 neon-glow">
          آماده شروع هستی؟
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          به دنیای <span className="text-neonOrange font-bold">ما</span> بپیوند و از بهترین خدمات دیجیتال بهره‌مند شو
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-4 neon-button rounded-lg text-white font-bold text-lg flex items-center gap-2 group"
          >
            <span>شروع کنید</span>
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/products"
            className="px-8 py-4 border-2 border-neonOrange rounded-lg text-neonOrange font-bold text-lg hover:bg-neonOrange/10 transition-all"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;

