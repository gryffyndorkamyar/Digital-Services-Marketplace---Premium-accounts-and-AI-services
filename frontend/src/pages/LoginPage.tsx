import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import MignumLogo from '../components/MignumLogo';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login/register logic
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4 relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* لوگو */}
        <div className="flex justify-center mb-8">
          <MignumLogo className="w-48 h-auto" />
        </div>

        {/* کارت فرم */}
        <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8 shadow-2xl neon-glow">
          {/* تب‌های ورود/ثبت‌نام */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                isLogin
                  ? 'neon-button text-white'
                  : 'bg-dark-surface text-gray-400 hover:text-neonOrange'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                ورود
              </div>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                !isLogin
                  ? 'neon-button text-white'
                  : 'bg-dark-surface text-gray-400 hover:text-neonOrange'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                ثبت‌نام
              </div>
            </button>
          </div>

          {/* فرم */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ایمیل
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                    placeholder="example@email.com"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                نام کاربری
              </label>
              <div className="relative">
                <UserPlus className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                  placeholder="نام کاربری"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10 pl-10 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                  placeholder="رمز عبور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neonOrange transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  تکرار رمز عبور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                    placeholder="تکرار رمز عبور"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-neonOrange bg-dark-surface border-neonOrange/30 rounded focus:ring-neonOrange"
                  />
                  مرا به خاطر بسپار
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-neonOrange hover:text-neonOrange-light transition-colors"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 neon-button rounded-lg text-white font-bold text-lg transition-all hover:scale-105"
            >
              {isLogin ? 'ورود' : 'ثبت‌نام'}
            </button>
          </form>

          {/* لینک بازگشت */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-neonOrange transition-colors"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

