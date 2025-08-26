# authenticate/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from django.utils import timezone
import logging

from .models import User, UserProfile, UserSession, PasswordResetToken

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """ایجاد پروفایل کاربر هنگام ایجاد کاربر جدید"""
    if created:
        UserProfile.objects.create(user=instance)
        logger.info(f"User profile created for: {instance.username}")


@receiver(post_save, sender=User)
def update_user_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش کاربر"""
    cache_key = f"user_{instance.id}"
    cache.set(cache_key, instance, timeout=3600)  # 1 hour


@receiver(post_delete, sender=User)
def delete_user_cache(sender, instance, **kwargs):
    """حذف کش کاربر"""
    cache_key = f"user_{instance.id}"
    cache.delete(cache_key)


@receiver(post_save, sender=UserSession)
def update_session_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش جلسه"""
    cache_key = f"session_{instance.session_key}"
    cache.set(cache_key, instance, timeout=3600)  # 1 hour


@receiver(post_delete, sender=UserSession)
def delete_session_cache(sender, instance, **kwargs):
    """حذف کش جلسه"""
    cache_key = f"session_{instance.session_key}"
    cache.delete(cache_key)


@receiver(post_save, sender=PasswordResetToken)
def cleanup_expired_tokens(sender, instance, **kwargs):
    """پاکسازی توکن‌های منقضی شده"""
    PasswordResetToken.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()


@receiver(post_save, sender=User)
def send_verification_email(sender, instance, created, **kwargs):
    """ارسال ایمیل تایید برای کاربران جدید"""
    if created and instance.email and not instance.is_email_verified:
        # در اینجا می‌توانید کد ارسال ایمیل را اضافه کنید
        logger.info(f"Verification email should be sent to: {instance.email}")


@receiver(post_save, sender=User)
def update_user_stats_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش آمار کاربران"""
    cache.delete('user_stats')
    logger.info("User stats cache cleared")
