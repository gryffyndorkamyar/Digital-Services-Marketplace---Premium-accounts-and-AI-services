import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, MessageCircle } from 'lucide-react';
import MignumLogo from './MignumLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-100 border-t border-neonOrange/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* درباره ما */}
          <div>
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <MignumLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-neonOrange neon-glow-subtle">
                MIGNUM
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              جایی که گیمرها سطح خود را بالا می‌برند و فراتر از محدودیت‌ها می‌روند
            </p>
            <p className="text-gray-500 text-xs neon-glow-subtle">
              WHERE GAMERS LEVEL BEYOND LIMITS
            </p>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="text-white font-bold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  خانه
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  محصولات
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* خدمات */}
          <div>
            <h3 className="text-white font-bold mb-4">خدمات</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=gaming" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  حساب‌های بازی
                </Link>
              </li>
              <li>
                <Link to="/products?category=ai" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  سرویس‌های AI
                </Link>
              </li>
              <li>
                <Link to="/products?category=digital" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  خدمات دیجیتال
                </Link>
              </li>
            </ul>
          </div>

          {/* تماس با ما */}
          <div>
            <h3 className="text-white font-bold mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 space-x-reverse">
                <Mail className="w-4 h-4 text-neonOrange" />
                <a href="mailto:info@mignum.com" className="text-gray-400 hover:text-neonOrange transition-colors text-sm">
                  info@mignum.com
                </a>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <Phone className="w-4 h-4 text-neonOrange" />
                <span className="text-gray-400 text-sm">021-12345678</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="w-4 h-4 text-neonOrange" />
                <span className="text-gray-400 text-sm">تهران، ایران</span>
              </li>
            </ul>
            <div className="flex items-center space-x-4 space-x-reverse mt-4">
              <a href="#" className="text-gray-400 hover:text-neonOrange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neonOrange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neonOrange transition-colors" title="Telegram">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* کپی رایت */}
        <div className="border-t border-neonOrange/20 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MIGNUM. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
