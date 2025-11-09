import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Edit, LogIn, ClipboardCopy, Download, Shield, Eye } from 'lucide-react';
import { usersAPI, ordersAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_number?: string;
  avatar?: string;
  address?: string;
  bio?: string;
  website?: string;
}

interface DeliverableItem {
  orderId: string;
  orderNumber: string;
  itemId: string;
  productName: string;
  deliveredAt?: string | null;
  content?: string | null;
  downloadFileUrl?: string | null;
  downloadUrl?: string | null;
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, showAuthModal } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [deliverablesLoading, setDeliverablesLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });

  const sanitizedProfile = useCallback((data: any): UserProfile => {
    const user = data?.user || {};
    return {
      username: user.username || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone_number || '',
      phone_number: user.phone_number || '',
      avatar: user.avatar_url || '',
      address: data?.location || '',
      bio: data?.bio || '',
      website: data?.website || '',
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const profileData = await usersAPI.getProfile();
      const mapped = sanitizedProfile(profileData);
      setProfile(mapped);
      setFormData(mapped);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error(error?.message || 'خطا در بارگذاری پروفایل');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sanitizedProfile]);

  const fetchDeliverables = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setDeliverablesLoading(true);
      const orders = await ordersAPI.getAll<any>();
      const items: DeliverableItem[] = [];
      orders.forEach((order: any) => {
        const orderItems = order?.items || [];
        orderItems.forEach((item: any) => {
          const isDelivered = item?.is_delivered || item?.status === 'delivered';
          const hasContent = item?.content || item?.download_file_url || item?.download_url;
          if (isDelivered && hasContent) {
            items.push({
              orderId: order.id,
              orderNumber: order.order_number,
              itemId: item.id,
              productName: item.product_name || item.product?.name || 'محصول',
              deliveredAt: item.delivered_at || order.paid_at || order.updated_at,
              content: item.content,
              downloadFileUrl: item.download_file_url,
              downloadUrl: item.download_url,
            });
          }
        });
      });
      setDeliverables(items);
    } catch (error: any) {
      console.error('Error fetching deliverables:', error);
    } finally {
      setDeliverablesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProfile();
    fetchDeliverables();
  }, [fetchProfile, fetchDeliverables, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      setSaving(true);
      await Promise.all([
        usersAPI.updateMe({
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone,
        }),
        usersAPI.updateProfile({
          location: formData.address,
          bio: formData.bio,
          website: formData.website,
        }),
      ]);
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const backendMessage = error?.payload?.detail || error?.payload?.error;
      toast.error(backendMessage || error?.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAvatarUploading(true);
      await usersAPI.uploadAvatar(file);
      toast.success('آواتار با موفقیت به‌روزرسانی شد');
      fetchProfile();
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error?.message || 'خطا در بارگذاری تصویر');
    } finally {
      setAvatarUploading(false);
    }
  };

  const copyToClipboard = async (value?: string | null) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success('در کلیپ‌بورد کپی شد');
    } catch (error) {
      toast.error('امکان کپی وجود ندارد');
    }
  };

  const formattedDeliverables = useMemo(() => {
    return deliverables.sort((a, b) => (b.deliveredAt || '').localeCompare(a.deliveredAt || ''));
  }, [deliverables]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 neon-bg">
          <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-20">
          <User className="w-24 h-24 text-neonOrange mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-neonOrange">برای مشاهده پروفایل وارد شوید</h2>
          <p className="text-gray-300 mb-8">برای دسترسی به اطلاعات شخصی و محصولات تحویل‌داده‌شده باید وارد حساب کاربری شوید.</p>
          <button
            onClick={() => showAuthModal()}
            className="inline-flex items-center gap-2 px-6 py-3 neon-button rounded-lg text-white font-bold"
          >
            <LogIn className="w-5 h-5" />
            ورود / ثبت‌نام
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-neonOrange mx-auto mb-4 animate-spin" />
          <p className="text-gray-300">در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  const inputClass = (editable: boolean) =>
    `auth-input ${editable ? 'text-white' : 'text-gray-300 cursor-not-allowed opacity-80'} `;

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* هدر */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold neon-glow mb-2">پروفایل من</h1>
            <p className="text-gray-300">مدیریت اطلاعات شخصی و دسترسی به خریدهای تحویل‌شده</p>
          </div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 py-3 px-5 neon-button rounded-lg text-white font-bold transition-all hover:scale-105"
            >
              <Edit className="w-5 h-5" />
              ویرایش پروفایل
            </button>
          ) : null}
        </div>

        {/* اطلاعات ویرایش */}
        <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* آواتار */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-dark-surface border-4 border-neonOrange/30 overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neonOrange/20">
                      <User className="w-16 h-16 text-neonOrange" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-neonOrange rounded-full cursor-pointer hover:bg-neonOrange-light transition-colors flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={avatarUploading} />
                </label>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-neonOrange">
                {formData.first_name && formData.last_name ? `${formData.first_name} ${formData.last_name}` : formData.username}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نام کاربری</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    readOnly={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input type="email" value={formData.email} readOnly className={inputClass(false)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نام</label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  readOnly={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نام خانوادگی</label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  readOnly={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">تلفن</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, phone_number: e.target.value })}
                    readOnly={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">آدرس</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neonOrange w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    readOnly={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">بیوگرافی (اختیاری)</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  readOnly={!isEditing}
                  className={`${inputClass(isEditing)} min-h-[120px] resize-y`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">وب‌سایت</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  readOnly={!isEditing}
                  className={inputClass(isEditing)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-neonOrange/20">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 neon-button rounded-lg text-white font-bold transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (profile) {
                        setFormData(profile);
                      }
                    }}
                    className="px-6 py-3 bg-dark-surface border border-neonOrange/30 rounded-lg text-neonOrange font-bold hover:border-neonOrange transition-colors"
                  >
                    انصراف
                  </button>
                </>
              ) : null}
            </div>
          </form>
        </div>

        {/* تحویل‌های کاربر */}
        <div className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-neonOrange" />
            <h2 className="text-2xl font-bold text-neonOrange">محصولات تحویل‌شده</h2>
          </div>

          {deliverablesLoading ? (
            <div className="text-gray-300">در حال بررسی سفارشات...</div>
          ) : formattedDeliverables.length === 0 ? (
            <div className="text-gray-400">هنوز محتوای تحویل‌شده‌ای برای نمایش وجود ندارد.</div>
          ) : (
            <div className="space-y-4">
              {formattedDeliverables.map((item) => {
                const deliveredDate = item.deliveredAt ? new Date(item.deliveredAt).toLocaleString('fa-IR') : '---';
                return (
                  <div key={item.itemId} className="border border-neonOrange/20 rounded-xl p-5 bg-dark-surface/50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">شماره سفارش: {item.orderNumber}</p>
                        <h3 className="text-lg font-bold text-white">{item.productName}</h3>
                        <p className="text-sm text-gray-500">تاریخ تحویل: {deliveredDate}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {item.downloadFileUrl && (
                          <a
                            href={item.downloadFileUrl}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-neonOrange/40 text-white rounded-lg hover:bg-neonOrange/10 transition"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4" />
                            دانلود فایل
                          </a>
                        )}
                        {item.downloadUrl && (
                          <a
                            href={item.downloadUrl}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-neonOrange/40 text-white rounded-lg hover:bg-neonOrange/10 transition"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4" />
                            مشاهده لینک
                          </a>
                        )}
                        {item.content && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.content || '')}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-neonOrange/40 text-white rounded-lg hover:bg-neonOrange/10 transition"
                          >
                            <ClipboardCopy className="w-4 h-4" />
                            کپی محتوا
                          </button>
                        )}
                      </div>
                    </div>
                    {item.content && (
                      <div className="bg-black/40 border border-neonOrange/10 rounded-lg p-4 text-sm text-neonOrange/80 overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-words font-mono text-xs md:text-sm leading-6">{item.content}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

