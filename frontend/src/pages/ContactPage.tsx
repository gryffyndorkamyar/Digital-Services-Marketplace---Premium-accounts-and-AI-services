import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { SEASON_02 } from '../brand/ovyra';
import OvyraPageShell from '../components/ovyra/OvyraPageShell';
import OvyraPageHeader from '../components/ovyra/OvyraPageHeader';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const infoCards = [
    { icon: Mail, title: 'ایمیل', value: 'grifindorekamyar@gmail.com' },
    { icon: Phone, title: 'تلفن', value: '09379146130' },
    { icon: MapPin, title: 'آدرس', value: 'تهران، ایران' },
    { icon: MessageCircle, title: 'ساعات پاسخ‌گویی', value: 'هر روز ۱۰:۳۰ تا ۱۸:۳۰' },
  ];

  return (
    <OvyraPageShell>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <OvyraPageHeader
          eyebrow="CONTACT · OVYRA"
          title="تماس با آرشیو"
          description="سوالات سفارش، همکاری یا اطلاع‌رسانی سیزن بعدی"
        />

        <div className="ovyra-neon-panel mb-10 px-5 py-4">
          <p className="font-display text-[10px] tracking-[0.35em] text-ovyra-violet">
            {SEASON_02.archiveTag} · {SEASON_02.label}
          </p>
          <p className="mt-2 font-display text-sm tracking-[0.12em] text-white/90">{SEASON_02.titleEn}</p>
          <p className="font-fa mt-2 text-sm text-ovyra-mist/75" dir="rtl">
            برای اطلاع از باز شدن {SEASON_02.titleFa}، موضوع پیام را «{SEASON_02.archiveTag}» بگذارید.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {infoCards.map(({ icon: Icon, title, value }) => (
              <div key={title} className="ovyra-neon-panel flex items-center gap-4 p-5">
                <div className="rounded-lg border border-ovyra-gold/30 bg-ovyra-gold/10 p-3">
                  <Icon className="h-6 w-6 text-ovyra-gold" />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-[0.2em] text-ovyra-gold">{title}</h3>
                  <p className="mt-1 text-ovyra-mist/80">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ovyra-neon-panel p-6 sm:p-8">
            <h2 className="font-display text-xl tracking-[0.15em] text-white">ارسال پیام</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {(['name', 'email', 'subject'] as const).map((field) => (
                <div key={field}>
                  <label className="mb-2 block text-sm text-ovyra-mist/70">
                    {field === 'name' ? 'نام' : field === 'email' ? 'ایمیل' : 'موضوع'}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="ovyra-input"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="mb-2 block text-sm text-ovyra-mist/70">پیام</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="ovyra-input resize-none"
                  required
                />
              </div>
              <button type="submit" className="ovyra-btn-neon flex w-full items-center justify-center gap-2">
                <Send className="h-5 w-5" />
                ارسال
              </button>
            </form>
          </div>
        </div>
      </div>
    </OvyraPageShell>
  );
};

export default ContactPage;
