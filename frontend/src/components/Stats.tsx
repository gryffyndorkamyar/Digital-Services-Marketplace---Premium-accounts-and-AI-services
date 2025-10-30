import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingCart, Star, TrendingUp } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'مشتری راضی',
      change: '+25%',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ShoppingCart,
      value: '50,000+',
      label: 'فروش موفق',
      change: '+40%',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'امتیاز رضایت',
      change: '+0.2',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      value: '99%',
      label: 'نرخ موفقیت',
      change: '+2%',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black"></div>
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk']">
            <span className="text-white">آمار </span>
            <span className="text-gradient">ما</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            اعداد و ارقامی که نشان می‌دهند چرا به ما اعتماد می‌کنند
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                {/* Value */}
                <div className="text-4xl font-bold mb-2 text-white group-hover:text-gradient transition-all">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-gray-400 mb-2">{stat.label}</div>

                {/* Change */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

