import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto mt-10">
        <h1 className="text-center text-4xl font-bold neon-glow mb-8">ورود / ثبت‌نام</h1>
        <AuthForm mode="page" />
      </div>
    </div>
  );
};

export default LoginPage;

