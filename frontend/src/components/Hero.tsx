import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import MignumLogo from './MignumLogo';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* لوگو */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <MignumLogo className="w-32 h-32" />
        </div>

        {/* عنوان اصلی */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-glow animate-slide-up">
          <span className="text-neonOrange">MIGNUM</span>
        </h1>

        {/* زیرعنوان */}
        <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          WHERE GAMERS LEVEL
        </p>
        <p className="text-xl md:text-2xl text-neonOrange mb-12 animate-slide-up neon-glow-subtle" style={{ animationDelay: '0.4s' }}>
          BEYOND LIMITS
        </p>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Link
            to="/products"
            className="px-8 py-4 neon-button rounded-lg text-white font-bold text-lg flex items-center gap-2 group"
          >
            <span>مشاهده محصولات</span>
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 border-2 border-neonOrange rounded-lg text-neonOrange font-bold text-lg hover:bg-neonOrange/10 transition-all"
          >
            درباره ما
          </Link>
        </div>

        {/* آیکون رعد و برق */}
        <div className="mt-16 flex justify-center animate-bounce-gentle">
          <Zap className="w-8 h-8 text-neonOrange neon-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

