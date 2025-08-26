from django.db import models

# Create your models here.
# authenticate/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.validators import RegexValidator
from django.core.cache import cache

from .constants import USER_TYPES, USER_STATUS, VERIFICATION_METHODS


class User(AbstractUser):
    """مدل کاربر سفارشی"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # اطلاعات شخصی
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message=_('شماره تلفن باید به فرمت +989123456789 باشد.')
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        verbose_name=_('شماره تلفن')
    )
    date_of_birth = models.DateField(
        null=True,
        blank=True,
        verbose_name=_('تاریخ تولد')
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        verbose_name=_('تصویر پروفایل')
    )
    
    # نوع کاربر
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPES,
        default='customer',
        verbose_name=_('نوع کاربر')
    )
    status = models.CharField(
        max_length=20,
        choices=USER_STATUS,
        default='active',
        verbose_name=_('وضعیت')
    )
    
    # تایید
    is_email_verified = models.BooleanField(
        default=False,
        verbose_name=_('ایمیل تایید شده')
    )
    is_phone_verified = models.BooleanField(
        default=False,
        verbose_name=_('تلفن تایید شده')
    )
    email_verification_token = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('توکن تایید ایمیل')
    )
    phone_verification_code = models.CharField(
        max_length=6,
        blank=True,
        verbose_name=_('کد تایید تلفن')
    )
    verification_method = models.CharField(
        max_length=20,
        choices=VERIFICATION_METHODS,
        default='email',
        verbose_name=_('روش تایید')
    )
    
    # تنظیمات
    language = models.CharField(
        max_length=10,
        default='fa',
        verbose_name=_('زبان')
    )
    timezone = models.CharField(
        max_length=50,
        default='Asia/Tehran',
        verbose_name=_('منطقه زمانی')
    )
    
    # آمار
    login_count = models.PositiveIntegerField(
        default=0,
        verbose_name=_('تعداد ورود')
    )
    last_login_ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name=_('آخرین IP ورود')
    )
    
    # زمان‌ها
    email_verified_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('زمان تایید ایمیل')
    )
    phone_verified_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('زمان تایید تلفن')
    )
    last_activity = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('آخرین فعالیت')
    )

    class Meta:
        verbose_name = _('کاربر')
        verbose_name_plural = _('کاربران')
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone_number']),
            models.Index(fields=['user_type']),
            models.Index(fields=['status']),
            models.Index(fields=['is_email_verified']),
            models.Index(fields=['is_phone_verified']),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    def get_full_name(self):
        """نام کامل کاربر"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username

    def get_short_name(self):
        """نام کوتاه کاربر"""
        return self.first_name or self.username

    def is_verified(self):
        """آیا کاربر تایید شده است؟"""
        if self.verification_method == 'email':
            return self.is_email_verified
        elif self.verification_method == 'phone':
            return self.is_phone_verified
        return True

    def update_last_activity(self):
        """به‌روزرسانی آخرین فعالیت"""
        self.last_activity = timezone.now()
        self.save(update_fields=['last_activity'])

    def increment_login_count(self):
        """افزایش تعداد ورود"""
        self.login_count += 1
        self.save(update_fields=['login_count'])

    def generate_email_verification_token(self):
        """تولید توکن تایید ایمیل"""
        import secrets
        self.email_verification_token = secrets.token_urlsafe(32)
        self.save(update_fields=['email_verification_token'])
        return self.email_verification_token

    def generate_phone_verification_code(self):
        """تولید کد تایید تلفن"""
        import random
        self.phone_verification_code = str(random.randint(100000, 999999))
        self.save(update_fields=['phone_verification_code'])
        return self.phone_verification_code

    def verify_email(self, token):
        """تایید ایمیل"""
        if self.email_verification_token == token:
            self.is_email_verified = True
            self.email_verified_at = timezone.now()
            self.email_verification_token = ''
            self.save(update_fields=['is_email_verified', 'email_verified_at', 'email_verification_token'])
            return True
        return False

    def verify_phone(self, code):
        """تایید تلفن"""
        if self.phone_verification_code == code:
            self.is_phone_verified = True
            self.phone_verified_at = timezone.now()
            self.phone_verification_code = ''
            self.save(update_fields=['is_phone_verified', 'phone_verified_at', 'phone_verification_code'])
            return True
        return False


class UserProfile(models.Model):
    """پروفایل تکمیلی کاربر"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name=_('کاربر')
    )
    
    # اطلاعات تکمیلی
    bio = models.TextField(
        blank=True,
        verbose_name=_('بیوگرافی')
    )
    website = models.URLField(
        blank=True,
        verbose_name=_('وب‌سایت')
    )
    location = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('موقعیت جغرافیایی')
    )
    
    # تنظیمات حریم خصوصی
    is_profile_public = models.BooleanField(
        default=True,
        verbose_name=_('پروفایل عمومی')
    )
    show_email = models.BooleanField(
        default=False,
        verbose_name=_('نمایش ایمیل')
    )
    show_phone = models.BooleanField(
        default=False,
        verbose_name=_('نمایش تلفن')
    )
    
    # تنظیمات اعلان‌ها
    email_notifications = models.BooleanField(
        default=True,
        verbose_name=_('اعلان‌های ایمیل')
    )
    sms_notifications = models.BooleanField(
        default=False,
        verbose_name=_('اعلان‌های پیامک')
    )
    push_notifications = models.BooleanField(
        default=True,
        verbose_name=_('اعلان‌های push')
    )

    class Meta:
        verbose_name = _('پروفایل کاربر')
        verbose_name_plural = _('پروفایل‌های کاربران')

    def __str__(self):
        return f"پروفایل {self.user.get_full_name()}"


class UserSession(models.Model):
    """جلسات کاربر"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sessions',
        verbose_name=_('کاربر')
    )
    session_key = models.CharField(
        max_length=40,
        unique=True,
        verbose_name=_('کلید جلسه')
    )
    ip_address = models.GenericIPAddressField(
        verbose_name=_('آدرس IP')
    )
    user_agent = models.TextField(
        verbose_name=_('User Agent')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('تاریخ ایجاد')
    )
    last_activity = models.DateTimeField(
        auto_now=True,
        verbose_name=_('آخرین فعالیت')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('فعال')
    )

    class Meta:
        verbose_name = _('جلسه کاربر')
        verbose_name_plural = _('جلسات کاربران')
        ordering = ['-last_activity']

    def __str__(self):
        return f"جلسه {self.user.username} - {self.ip_address}"


class PasswordResetToken(models.Model):
    """توکن‌های بازنشانی رمز عبور"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens',
        verbose_name=_('کاربر')
    )
    token = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('توکن')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('تاریخ ایجاد')
    )
    expires_at = models.DateTimeField(
        verbose_name=_('تاریخ انقضا')
    )
    is_used = models.BooleanField(
        default=False,
        verbose_name=_('استفاده شده')
    )

    class Meta:
        verbose_name = _('توکن بازنشانی رمز عبور')
        verbose_name_plural = _('توکن‌های بازنشانی رمز عبور')
        ordering = ['-created_at']

    def __str__(self):
        return f"توکن {self.user.username}"

    def is_expired(self):
        """آیا توکن منقضی شده است؟"""
        return timezone.now() > self.expires_at

    def is_valid(self):
        """آیا توکن معتبر است؟"""
        return not self.is_used and not self.is_expired()