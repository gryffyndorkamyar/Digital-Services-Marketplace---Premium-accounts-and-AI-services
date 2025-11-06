import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 neon-glow">
            تماس با ما
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ما همیشه آماده پاسخگویی به سوالات و پیشنهادات شما هستیم
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* اطلاعات تماس */}
          <div className="space-y-6">
            <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-6 hover:border-neonOrange/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-neonOrange/20 rounded-lg">
                  <Mail className="w-6 h-6 text-neonOrange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neonOrange">ایمیل</h3>
                  <p className="text-gray-300">info@mignum.com</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-6 hover:border-neonOrange/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-neonOrange/20 rounded-lg">
                  <Phone className="w-6 h-6 text-neonOrange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neonOrange">تلفن</h3>
                  <p className="text-gray-300">021-12345678</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-6 hover:border-neonOrange/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-neonOrange/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-neonOrange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neonOrange">آدرس</h3>
                  <p className="text-gray-300">تهران، خیابان ولیعصر</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-6 hover:border-neonOrange/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-neonOrange/20 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-neonOrange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neonOrange">پشتیبانی</h3>
                  <p className="text-gray-300">24/7 در خدمت شما هستیم</p>
                </div>
              </div>
            </div>
          </div>

          {/* فرم تماس */}
          <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-neonOrange">ارسال پیام</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                  placeholder="نام شما"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  موضوع
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all"
                  placeholder="موضوع پیام"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  پیام
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all resize-none"
                  placeholder="پیام خود را بنویسید..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 neon-button rounded-lg text-white font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                ارسال پیام
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

