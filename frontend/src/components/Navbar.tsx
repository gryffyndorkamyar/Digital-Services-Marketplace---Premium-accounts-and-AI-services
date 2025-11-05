import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import MignumLogo from './MignumLogo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-100/80 backdrop-blur-md border-b border-neonOrange/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* لوگو */}
          <Link to="/" className="flex items-center">
            <MignumLogo className="h-10 w-auto" />
          </Link>

          {/* منوی دسکتاپ */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link
              to="/"
              className="text-white hover:text-neonOrange transition-colors duration-200 font-medium"
            >
              خانه
            </Link>
            <Link
              to="/products"
              className="text-white hover:text-neonOrange transition-colors duration-200 font-medium"
            >
              محصولات
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-neonOrange transition-colors duration-200 font-medium"
            >
              درباره ما
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-neonOrange transition-colors duration-200 font-medium"
            >
              تماس با ما
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 neon-button rounded-lg text-white font-medium"
            >
              ورود
            </Link>
          </div>

          {/* دکمه منوی موبایل */}
          <button
            className="md:hidden text-white hover:text-neonOrange transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* منوی موبایل */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-down">
            <Link
              to="/"
              className="block text-white hover:text-neonOrange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              خانه
            </Link>
            <Link
              to="/products"
              className="block text-white hover:text-neonOrange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              محصولات
            </Link>
            <Link
              to="/about"
              className="block text-white hover:text-neonOrange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              درباره ما
            </Link>
            <Link
              to="/contact"
              className="block text-white hover:text-neonOrange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              تماس با ما
            </Link>
            <Link
              to="/login"
              className="block px-4 py-2 neon-button rounded-lg text-white font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              ورود
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

