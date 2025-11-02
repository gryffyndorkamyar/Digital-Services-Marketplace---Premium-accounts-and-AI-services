# authenticate/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count

from .models import User, UserProfile, UserSession, PasswordResetToken


class UserProfileInline(admin.StackedInline):
    """Inline برای پروفایل کاربر"""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'پروفایل'


class UserSessionInline(admin.TabularInline):
    """Inline برای جلسات کاربر"""
    model = UserSession
    extra = 0
    readonly_fields = ['session_key', 'ip_address', 'user_agent', 'created_at', 'last_activity']
    can_delete = True


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """مدیریت کاربران"""
    inlines = [UserProfileInline, UserSessionInline]
    list_display = [
        'username', 'email', 'full_name', 'user_type', 'status',
        'is_verified', 'is_active', 'date_joined', 'last_login'
    ]
    list_filter = [
        'user_type', 'status', 'is_active', 'is_email_verified',
        'is_phone_verified', 'date_joined', 'last_login'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering = ['-date_joined']
    readonly_fields = [
        'id', 'date_joined', 'last_login', 'login_count',
        'email_verified_at', 'phone_verified_at', 'last_activity'
    ]
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('اطلاعات شخصی'), {
            'fields': ('first_name', 'last_name', 'email', 'phone_number', 'date_of_birth', 'avatar')
        }),
        (_('نوع و وضعیت'), {
            'fields': ('user_type', 'status', 'is_active', 'is_staff', 'is_superuser')
        }),
        (_('تایید'), {
            'fields': ('is_email_verified', 'is_phone_verified', 'verification_method', 
                      'email_verification_token', 'phone_verification_code')
        }),
        (_('تنظیمات'), {
            'fields': ('language', 'timezone')
        }),
        (_('آمار'), {
            'fields': ('login_count', 'last_login_ip', 'last_activity'),
            'classes': ('collapse',)
        }),
        (_('زمان‌ها'), {
            'fields': ('date_joined', 'email_verified_at', 'phone_verified_at'),
            'classes': ('collapse',)
        }),
        (_('مجوزها'), {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type'),
        }),
    )

    def full_name(self, obj):
        """نام کامل کاربر"""
        return obj.get_full_name()
    full_name.short_description = _('نام کامل')

    def is_verified(self, obj):
        """آیا کاربر تایید شده است؟"""
        if obj.is_verified():
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    is_verified.short_description = _('تایید شده')

    def get_queryset(self, request):
        """QuerySet با آمار"""
        return super().get_queryset(request).annotate(
            session_count=Count('sessions')
        )

    def session_count(self, obj):
        """تعداد جلسات فعال"""
        return obj.sessions.filter(is_active=True).count()
    session_count.short_description = _('جلسات فعال')
    
    actions = ['generate_email_token', 'generate_phone_code']
    
    def generate_email_token(self, request, queryset):
        """تولید توکن تایید ایمیل برای کاربران انتخاب شده"""
        for user in queryset:
            token = user.generate_email_verification_token()
            self.message_user(
                request,
                f'توکن تایید ایمیل برای {user.username} ساخته شد: {token}'
            )
    generate_email_token.short_description = _('تولید توکن تایید ایمیل')
    
    def generate_phone_code(self, request, queryset):
        """تولید کد تایید تلفن برای کاربران انتخاب شده"""
        for user in queryset:
            code = user.generate_phone_verification_code()
            self.message_user(
                request,
                f'کد تایید تلفن برای {user.username} ساخته شد: {code}'
            )
    generate_phone_code.short_description = _('تولید کد تایید تلفن')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """مدیریت پروفایل‌های کاربران"""
    list_display = ['user', 'location', 'is_profile_public', 'show_email', 'show_phone']
    list_filter = ['is_profile_public', 'show_email', 'show_phone', 'email_notifications', 'sms_notifications']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name', 'location']
    readonly_fields = ['user']
    
    fieldsets = (
        (None, {'fields': ('user',)}),
        (_('اطلاعات تکمیلی'), {
            'fields': ('bio', 'website', 'location')
        }),
        (_('تنظیمات حریم خصوصی'), {
            'fields': ('is_profile_public', 'show_email', 'show_phone')
        }),
        (_('تنظیمات اعلان‌ها'), {
            'fields': ('email_notifications', 'sms_notifications', 'push_notifications')
        }),
    )


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """مدیریت جلسات کاربران"""
    list_display = ['user', 'ip_address', 'user_agent_short', 'created_at', 'last_activity', 'is_active']
    list_filter = ['is_active', 'created_at', 'last_activity']
    search_fields = ['user__username', 'user__email', 'ip_address', 'user_agent']
    readonly_fields = ['user', 'session_key', 'ip_address', 'user_agent', 'created_at', 'last_activity']
    ordering = ['-last_activity']
    
    def user_agent_short(self, obj):
        """نمایش کوتاه User Agent"""
        if len(obj.user_agent) > 50:
            return obj.user_agent[:50] + '...'
        return obj.user_agent
    user_agent_short.short_description = _('User Agent')

    def has_add_permission(self, request):
        """غیرفعال کردن افزودن دستی"""
        return False


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """مدیریت توکن‌های بازنشانی رمز عبور"""
    list_display = ['user', 'token_short', 'created_at', 'expires_at', 'is_used', 'is_expired']
    list_filter = ['is_used', 'created_at', 'expires_at']
    search_fields = ['user__username', 'user__email', 'token']
    readonly_fields = ['user', 'token', 'created_at', 'expires_at']
    ordering = ['-created_at']
    
    def token_short(self, obj):
        """نمایش کوتاه توکن"""
        return obj.token[:20] + '...'
    token_short.short_description = _('توکن')

    def is_expired(self, obj):
        """آیا توکن منقضی شده است؟"""
        if obj.is_expired():
            return format_html('<span style="color: red;">✓</span>')
        return format_html('<span style="color: green;">✗</span>')
    is_expired.short_description = _('منقضی شده')

    def has_add_permission(self, request):
        """غیرفعال کردن افزودن دستی"""
        return False
