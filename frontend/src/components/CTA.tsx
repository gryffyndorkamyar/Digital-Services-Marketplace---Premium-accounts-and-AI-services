import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">آماده شروع هستید؟</span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-['Space_Grotesk']">
            <span className="text-white">شروع کنید و </span>
            <span className="text-gradient">تجربه کنید</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            همین الان حساب کاربری بسازید و از تخفیف ویژه اول ثبت‌نام بهره‌مند شوید
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 glow-pink flex items-center space-x-2 space-x-reverse"
            >
              <span>ثبت‌نام رایگان</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-900/50 border-2 border-purple-500/50 rounded-xl font-bold text-lg hover:border-purple-500 hover:bg-gray-900/70 transition-all duration-300 backdrop-blur-sm"
            >
              مشاهده محصولات
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>100% امن</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>ضمانت بازگشت وجه</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>پشتیبانی 24/7</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

