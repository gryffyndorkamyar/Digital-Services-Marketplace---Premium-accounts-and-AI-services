import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Package, User, Grid, LogOut, LogIn } from 'lucide-react';
import MignumLogo from './MignumLogo';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, showAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await logout();
      navigate('/');
    } else {
      showAuthModal();
    }
    setIsMenuOpen(false);
  };

  const commonLinks = [
    { to: '/', label: 'خانه', icon: null },
    { to: '/categories', label: 'دسته‌بندی‌ها', icon: <Grid className="w-4 h-4" /> },
    { to: '/products', label: 'محصولات', icon: null },
    { to: '/cart', label: 'سبد خرید', icon: <ShoppingCart className="w-4 h-4" /> },
    { to: '/orders', label: 'سفارشات', icon: <Package className="w-4 h-4" /> },
    { to: '/about', label: 'درباره ما', icon: null },
    { to: '/contact', label: 'تماس با ما', icon: null },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-100/80 backdrop-blur-md border-b border-neonOrange/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <MignumLogo className="h-10 w-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {commonLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:text-neonOrange transition-colors duration-200 font-medium flex items-center gap-1"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="text-white hover:text-neonOrange transition-colors duration-200 font-medium flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                پروفایل
              </Link>
            )}
            <button
              onClick={handleAuthAction}
              className="flex items-center gap-2 px-4 py-2 neon-button rounded-lg text-white font-medium"
            >
              {isAuthenticated ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isAuthenticated ? 'خروج' : 'ورود / ثبت‌نام'}
            </button>
          </div>

          <button
            className="md:hidden text-white hover:text-neonOrange transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-down">
            {commonLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-white hover:text-neonOrange transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="block text-white hover:text-neonOrange transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                پروفایل
              </Link>
            )}
            <button
              onClick={handleAuthAction}
              className="w-full px-4 py-3 neon-button rounded-lg text-white font-medium text-center flex items-center justify-center gap-2"
            >
              {isAuthenticated ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isAuthenticated ? 'خروج' : 'ورود / ثبت‌نام'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

