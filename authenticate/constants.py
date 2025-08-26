# authenticate/constants.py

# انواع کاربران
USER_TYPES = [
    ('customer', 'مشتری'),
    ('admin', 'مدیر'),
    ('staff', 'کارمند'),
    ('vendor', 'فروشنده'),
    ('moderator', 'ناظر'),
]

# وضعیت کاربران
USER_STATUS = [
    ('active', 'فعال'),
    ('inactive', 'غیرفعال'),
    ('suspended', 'معلق'),
    ('banned', 'مسدود'),
    ('pending', 'در انتظار تایید'),
]

# روش‌های تایید
VERIFICATION_METHODS = [
    ('email', 'ایمیل'),
    ('phone', 'تلفن'),
    ('both', 'هر دو'),
    ('none', 'بدون تایید'),
]

# انواع اعلان‌ها
NOTIFICATION_TYPES = [
    ('email', 'ایمیل'),
    ('sms', 'پیامک'),
    ('push', 'اعلان push'),
    ('in_app', 'درون برنامه'),
]

# تنظیمات امنیتی
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 128
LOGIN_ATTEMPT_LIMIT = 5
LOGIN_ATTEMPT_TIMEOUT = 15  # دقیقه
SESSION_TIMEOUT = 60 * 24 * 7  # 7 روز
PASSWORD_RESET_TIMEOUT = 60 * 24  # 24 ساعت
EMAIL_VERIFICATION_TIMEOUT = 60 * 24 * 7  # 7 روز
PHONE_VERIFICATION_TIMEOUT = 10  # دقیقه

# تنظیمات پیش‌فرض
DEFAULT_USER_TYPE = 'customer'
DEFAULT_USER_STATUS = 'active'
DEFAULT_VERIFICATION_METHOD = 'email'
DEFAULT_LANGUAGE = 'fa'
DEFAULT_TIMEZONE = 'Asia/Tehran'

# پیام‌های خطا
ERROR_MESSAGES = {
    'invalid_credentials': 'ایمیل یا رمز عبور اشتباه است.',
    'account_disabled': 'حساب کاربری شما غیرفعال شده است.',
    'account_suspended': 'حساب کاربری شما معلق شده است.',
    'account_banned': 'حساب کاربری شما مسدود شده است.',
    'email_not_verified': 'ایمیل شما تایید نشده است.',
    'phone_not_verified': 'شماره تلفن شما تایید نشده است.',
    'too_many_attempts': 'تعداد تلاش‌های شما بیش از حد مجاز است.',
    'invalid_token': 'توکن نامعتبر است.',
    'expired_token': 'توکن منقضی شده است.',
    'password_too_weak': 'رمز عبور باید حداقل 8 کاراکتر باشد.',
    'email_already_exists': 'این ایمیل قبلاً ثبت شده است.',
    'phone_already_exists': 'این شماره تلفن قبلاً ثبت شده است.',
    'username_already_exists': 'این نام کاربری قبلاً ثبت شده است.',
}

# پیام‌های موفقیت
SUCCESS_MESSAGES = {
    'registration_successful': 'ثبت‌نام با موفقیت انجام شد.',
    'login_successful': 'ورود با موفقیت انجام شد.',
    'logout_successful': 'خروج با موفقیت انجام شد.',
    'password_changed': 'رمز عبور با موفقیت تغییر یافت.',
    'password_reset_sent': 'ایمیل بازنشانی رمز عبور ارسال شد.',
    'email_verified': 'ایمیل با موفقیت تایید شد.',
    'phone_verified': 'شماره تلفن با موفقیت تایید شد.',
    'profile_updated': 'پروفایل با موفقیت بروزرسانی شد.',
    'verification_code_sent': 'کد تایید ارسال شد.',
}
