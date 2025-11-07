import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';

type AuthMode = 'login' | 'register';

type Props = {
  mode?: 'page' | 'modal';
  onSuccess?: () => void;
  onClose?: () => void;
};

const AuthForm: React.FC<Props> = ({ mode = 'page', onSuccess, onClose }) => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetState = () => {
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
  };

  const handleLogin = async () => {
    await login(formData.username.trim(), formData.password);
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('گذرواژه و تکرار آن یکسان نیستند');
      return;
    }

    await usersAPI.register({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      password_confirm: formData.confirmPassword,
    });

    toast.success('ثبت‌نام با موفقیت انجام شد');
    await handleLogin();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (authMode === 'login') {
        await handleLogin();
      } else {
        await handleRegister();
      }
      resetState();
      onSuccess?.();
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error?.message || 'خطایی رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = mode === 'modal'
    ? 'bg-dark-card/95 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8 shadow-2xl'
    : 'bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8 shadow-2xl max-w-md mx-auto';

  return (
    <div className={mode === 'page' ? 'min-h-[calc(100vh-8rem)] flex items-center justify-center' : ''}>
      <div className="w-full">
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-dark-surface/70 border border-neonOrange/40 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`px-6 py-3 text-sm font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-neonOrange text-white'
                  : 'text-gray-400 hover:text-neonOrange'
              }`}
              disabled={loading}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`px-6 py-3 text-sm font-bold transition-all ${
                authMode === 'register'
                  ? 'bg-neonOrange text-white'
                  : 'text-gray-400 hover:text-neonOrange'
              }`}
              disabled={loading}
            >
              ثبت‌نام
            </button>
          </div>
        </div>

        <div className={containerClasses}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white caret-neonOrange placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">نام کاربری</label>
              <div className="relative">
                <UserPlus className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white caret-neonOrange placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                  placeholder="نام کاربری"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">گذرواژه</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pr-10 pl-10 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white caret-neonOrange placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                  placeholder="گذرواژه"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neonOrange transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">تکرار گذرواژه</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white caret-neonOrange placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                    placeholder="تکرار گذرواژه"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 neon-button rounded-lg text-white font-bold text-lg transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <span className="animate-spin">●</span>
                ) : authMode === 'login' ? (
                  <LogIn className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
                <span>{authMode === 'login' ? 'ورود' : 'ثبت‌نام'}</span>
              </div>
            </button>

            {mode === 'modal' && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-sm text-gray-400 hover:text-neonOrange transition-colors"
              >
                لغو و بازگشت
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
