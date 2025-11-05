import React from 'react';
import { Users, ShoppingCart, Star, TrendingUp } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: '10K+',
      label: 'کاربران راضی',
      color: 'text-neonOrange',
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      number: '50K+',
      label: 'فروش موفق',
      color: 'text-neonOrange',
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: '4.9',
      label: 'امتیاز کاربران',
      color: 'text-neonOrange',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: '99%',
      label: 'رضایت مشتری',
      color: 'text-neonOrange',
    },
  ];

  return (
    <section className="py-20 bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-dark-200 p-6 rounded-lg neon-border-subtle"
            >
              <div className={`${stat.color} mb-4 flex justify-center neon-pulse`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-white mb-2 neon-glow-subtle">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

