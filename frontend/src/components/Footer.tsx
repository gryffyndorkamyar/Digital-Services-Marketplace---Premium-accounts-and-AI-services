import React from 'react';
import { Gamepad2, Sparkles, Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { label: 'محصولات', href: '#services' },
      { label: 'قیمت‌ها', href: '#pricing' },
      { label: 'ویژگی‌ها', href: '#features' },
    ],
    company: [
      { label: 'درباره ما', href: '#about' },
      { label: 'تماس با ما', href: '#contact' },
      { label: 'قوانین', href: '#terms' },
    ],
    support: [
      { label: 'مرکز راهنما', href: '#help' },
      { label: 'پشتیبانی', href: '#support' },
      { label: 'سوالات متداول', href: '#faq' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'Github' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative border-t border-purple-500/20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-purple-500" />
                <Sparkles className="w-4 h-4 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent font-['Space_Grotesk']">
                Mignum
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              بهترین مارکت‌پلیس دیجیتال برای گیمرها. حساب‌های پریمیوم و خدمات هوش مصنوعی در یکجا.
            </p>
            <div className="flex items-center space-x-4 space-x-reverse">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-gray-800/50 border border-purple-500/20 flex items-center justify-center hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-bold mb-4">محصولات</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold mb-4">شرکت</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold mb-4">پشتیبانی</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Mignum. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-400">
            <a href="#privacy" className="hover:text-purple-400 transition-colors">حریم خصوصی</a>
            <a href="#terms" className="hover:text-purple-400 transition-colors">قوانین</a>
            <a href="#cookies" className="hover:text-purple-400 transition-colors">کوکی‌ها</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

