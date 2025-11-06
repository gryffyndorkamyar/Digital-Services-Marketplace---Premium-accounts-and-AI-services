import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Edit } from 'lucide-react';
import { usersAPI } from '../services/api';

interface UserProfile {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
  address?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await usersAPI.getProfile();
      setProfile(profileData);
      setFormData(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersAPI.updateProfile(formData);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await usersAPI.uploadAvatar(file);
      fetchProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-neonOrange mx-auto mb-4 animate-spin" />
          <p className="text-gray-300">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* هدر */}
        <div className="mb-8 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-glow mb-2">پروفایل من</h1>
          <p className="text-gray-300">مدیریت اطلاعات شخصی</p>
        </div>

        {/* کارت پروفایل */}
        <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8">
          {/* آواتار */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-dark-surface border-4 border-neonOrange/30 overflow-hidden">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neonOrange/20">
                    <User className="w-16 h-16 text-neonOrange" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-neonOrange rounded-full cursor-pointer hover:bg-neonOrange-light transition-colors">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-2xl font-bold mt-4 text-neonOrange">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.username}
            </h2>
          </div>

          {/* فرم */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نام کاربری
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all disabled:opacity-50"
                    placeholder="نام کاربری"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ایمیل
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all disabled:opacity-50"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نام
                </label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all disabled:opacity-50"
                  placeholder="نام"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all disabled:opacity-50"
                  placeholder="نام خانوادگی"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  تلفن
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all disabled:opacity-50"
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  آدرس
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonOrange focus:ring-2 focus:ring-neonOrange/50 transition-all disabled:opacity-50"
                    placeholder="آدرس"
                  />
                </div>
              </div>
            </div>

            {/* دکمه‌های عملیات */}
            <div className="flex gap-4 pt-6 border-t border-neonOrange/20">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 neon-button rounded-lg text-white font-bold transition-all hover:scale-105"
                  >
                    <Save className="w-5 h-5" />
                    ذخیره تغییرات
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(profile || formData);
                    }}
                    className="px-6 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-neonOrange font-bold hover:border-neonOrange transition-colors"
                  >
                    انصراف
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 neon-button rounded-lg text-white font-bold transition-all hover:scale-105"
                >
                  <Edit className="w-5 h-5" />
                  ویرایش پروفایل
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

