import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import MignumLogo from './MignumLogo';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 overflow-visible">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-visible">
        {/* عکس‌های متحرک در اطراف سکشن - پشت همه چیز */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          {/* عکس 1 - بالا چپ دور */}
          <div className="absolute top-10 -left-[24px] md:top-20 md:-left-[88px] lg:-left-[120px] animate-float-slow">
            <img
              src="/11d301d4ce8371a4e293255787aff91b.png"
              alt="Game"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 9 - کنار عکس 1 (بالا چپ) */}
          <div className="absolute top-[44px] -left-[200px] md:top-[74px] md:-left-[240px] lg:top-[94px] lg:-left-[280px] animate-float-slow" style={{ animationDelay: '1.4s' }}>
            <img
              src="/9.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 2 - بالا راست دور */}
          <div className="absolute top-10 -right-[24px] md:top-20 md:-right-[88px] lg:-right-[120px] animate-float-reverse">
            <img
              src="/1d30e9382a09933fefae50b5d8dc1d7a.png"
              alt="Game"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 10 - کنار عکس 2 (بالا راست) */}
          <div className="absolute top-[70px] -right-[200px] md:top-[100px] md:-right-[240px] lg:top-[120px] lg:-right-[280px] animate-float-reverse" style={{ animationDelay: '1.6s' }}>
            <img
              src="/10.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 3 - پایین چپ دور */}
          <div className="absolute bottom-5 -left-[19px] md:bottom-20 md:-left-[64px] lg:-left-[104px] animate-float-slow-delayed">
            <img
              src="/31c57b54718309a92b5d2900a15ace5b.png"
              alt="Game"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 12 - کنار عکس 3 (پایین چپ) */}
          <div className="absolute bottom-[65px] -left-[195px] md:bottom-[100px] md:-left-[224px] lg:bottom-[120px] lg:-left-[228px] animate-float-slow-delayed" style={{ animationDelay: '1.8s' }}>
            <img
              src="/12.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 4 - پایین راست دور (ChatGPT) */}
          <div className="absolute bottom-5 -right-[19px] md:bottom-20 md:-right-[64px] lg:-right-[104px] animate-float-reverse-delayed">
            <img
              src="/vecteezy_chat-gpt-logo-on-white-polygon_69331175.png"
              alt="ChatGPT"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 13 - کنار عکس 4 (پایین راست) */}
          <div className="absolute bottom-[65px] -right-[195px] md:bottom-[100px] md:-right-[224px] lg:bottom-[120px] lg:-right-[228px] animate-float-reverse-delayed" style={{ animationDelay: '2s' }}>
            <img
              src="/13.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 5 - وسط چپ */}
          <div className="absolute top-1/3 -left-[29px] md:-left-[64px] lg:-left-[88px] animate-float-slow" style={{ animationDelay: '0.5s' }}>
            <img
              src="/333d58c7e0f288428cf09fed66f50206.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 14 - کنار عکس 5 (وسط چپ بالا) */}
          <div className="absolute top-[calc(33.333%+48px)] -left-[377px] md:top-[calc(33.333%+28px)] md:-left-[396px] lg:top-[calc(33.333%+8px)] lg:-left-[352px] animate-float-slow" style={{ animationDelay: '2.2s' }}>
            <img
              src="/14.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 16 - کنار عکس 5 (وسط چپ پایین) */}
          <div className="absolute top-[calc(33.333%+80px)] -left-[205px] md:top-[calc(33.333%+100px)] md:-left-[224px] lg:top-[calc(33.333%+120px)] lg:-left-[180px] animate-float-slow" style={{ animationDelay: '2.6s' }}>
            <img
              src="/16.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس me - کنار عکس 16 (بالا) */}
          <div className="absolute top-[calc(33.333%-160px)] -left-[485px] md:top-[calc(33.333%-140px)] md:-left-[504px] lg:top-[calc(33.333%-120px)] lg:-left-[460px] animate-float-slow" style={{ animationDelay: '2.8s' }}>
            <img
              src="/me.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس you - کنار عکس 16 (پایین) */}
          <div className="absolute top-[calc(33.333%+140px)] -left-[485px] md:top-[calc(33.333%+160px)] md:-left-[504px] lg:top-[calc(33.333%+180px)] lg:-left-[460px] animate-float-slow" style={{ animationDelay: '3s' }}>
            <img
              src="/you.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 6 - وسط راست */}
          <div className="absolute top-1/3 -right-[29px] md:-right-[64px] lg:-right-[88px] animate-float-reverse" style={{ animationDelay: '0.7s' }}>
            <img
              src="/c186f8bc6debfb3881f0f72cbc3cc76f.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 15 - کنار عکس 6 (وسط راست) */}
          <div className="absolute top-[calc(33.333%+60px)] -right-[325px] md:top-[calc(33.333%+40px)] md:-right-[344px] lg:top-[calc(33.333%+20px)] lg:-right-[300px] animate-float-reverse" style={{ animationDelay: '2.4s' }}>
            <img
              src="/15.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 7 - بالا وسط */}
          <div className="absolute top-[215px] md:top-[210px] lg:top-[204px] -right-[420px] md:-right-[420px] lg:-right-[420px] animate-float-slow" style={{ animationDelay: '1s' }}>
            <img
              src="/ed4304c71234a91e510a0bf663995c5a.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* عکس 8 - پایین وسط */}
          <div className="absolute bottom-[85px] md:bottom-[90px] lg:bottom-[96px] -right-[420px] md:-right-[420px] lg:-right-[420px] animate-float-reverse" style={{ animationDelay: '1.2s' }}>
            <img
              src="/f03cbba6cf582970f35cdfad6c6dc671.png"
              alt="Game"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* لوگو اصلی - در مرکز و بالاتر از عکس‌ها */}
        <div className="relative z-30 flex justify-center items-center mb-12 min-h-[400px] md:min-h-[500px]">
          <div className="animate-fade-in">
            <MignumLogo className="w-64 h-auto md:w-80 md:h-auto lg:w-96 lg:h-auto" />
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="relative z-30 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
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

