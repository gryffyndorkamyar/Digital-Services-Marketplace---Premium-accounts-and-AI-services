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
        {/* لوگو اصلی */}
        <div className="relative flex justify-center items-center mb-12 min-h-[400px] md:min-h-[500px]">
          {/* لوگو در مرکز */}
          <div className="relative z-20 animate-fade-in">
            <MignumLogo className="w-64 h-auto md:w-80 md:h-auto" />
          </div>

          {/* عکس‌های متحرک اطراف لوگو */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* عکس 1 - بالا چپ */}
            <div className="absolute top-10 left-10 md:top-20 md:left-20 animate-float-slow">
              <img
                src="/11d301d4ce8371a4e293255787aff91b.png"
                alt="Game"
                className="w-16 h-16 md:w-20 md:h-20 opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* عکس 2 - بالا راست */}
            <div className="absolute top-10 right-10 md:top-20 md:right-20 animate-float-reverse">
              <img
                src="/1d30e9382a09933fefae50b5d8dc1d7a.png"
                alt="Game"
                className="w-16 h-16 md:w-20 md:h-20 opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* عکس 3 - پایین چپ */}
            <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 animate-float-slow-delayed">
              <img
                src="/31c57b54718309a92b5d2900a15ace5b.png"
                alt="Game"
                className="w-16 h-16 md:w-20 md:h-20 opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* عکس 4 - پایین راست (ChatGPT) */}
            <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 animate-float-reverse-delayed">
              <img
                src="/vecteezy_chat-gpt-logo-on-white-polygon_69331175.png"
                alt="ChatGPT"
                className="w-16 h-16 md:w-20 md:h-20 opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* عکس 5 - وسط چپ */}
            <div className="absolute top-1/2 left-5 md:left-10 animate-float-slow" style={{ animationDelay: '0.5s' }}>
              <img
                src="/333d58c7e0f288428cf09fed66f50206.png"
                alt="Game"
                className="w-12 h-12 md:w-16 md:h-16 opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* عکس 6 - وسط راست */}
            <div className="absolute top-1/2 right-5 md:right-10 animate-float-reverse" style={{ animationDelay: '0.7s' }}>
              <img
                src="/c186f8bc6debfb3881f0f72cbc3cc76f.png"
                alt="Game"
                className="w-12 h-12 md:w-16 md:h-16 opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* عکس 7 - بالا وسط */}
            <div className="absolute top-5 md:top-10 left-1/2 transform -translate-x-1/2 animate-float-slow" style={{ animationDelay: '1s' }}>
              <img
                src="/ed4304c71234a91e510a0bf663995c5a.png"
                alt="Game"
                className="w-12 h-12 md:w-16 md:h-16 opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* عکس 8 - پایین وسط */}
            <div className="absolute bottom-5 md:bottom-10 left-1/2 transform -translate-x-1/2 animate-float-reverse" style={{ animationDelay: '1.2s' }}>
              <img
                src="/f03cbba6cf582970f35cdfad6c6dc671.png"
                alt="Game"
                className="w-12 h-12 md:w-16 md:h-16 opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

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

