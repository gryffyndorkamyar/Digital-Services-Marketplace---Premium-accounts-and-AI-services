# cart/signals.py
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.core.cache import cache
from django.utils import timezone
import logging

from .models import Cart, CartItem, Order, OrderItem, Coupon, Payment

logger = logging.getLogger(__name__)


@receiver(post_save, sender=CartItem)
def update_cart_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش سبد خرید"""
    cache_key = f"cart_{instance.cart.id}"
    cache.delete(cache_key)
    logger.info(f"Cart cache cleared for cart: {instance.cart.id}")


@receiver(post_delete, sender=CartItem)
def clear_cart_cache_on_delete(sender, instance, **kwargs):
    """پاک کردن کش سبد خرید هنگام حذف آیتم"""
    cache_key = f"cart_{instance.cart.id}"
    cache.delete(cache_key)
    logger.info(f"Cart cache cleared after item deletion: {instance.cart.id}")


@receiver(post_save, sender=Order)
def update_order_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش سفارش"""
    cache_key = f"order_{instance.id}"
    cache.delete(cache_key)
    logger.info(f"Order cache cleared for order: {instance.order_number}")


@receiver(post_save, sender=Order)
def send_order_notification(sender, instance, created, **kwargs):
    """ارسال اعلان سفارش جدید"""
    if created:
        logger.info(f"New order created: {instance.order_number}")
        # در اینجا کد ارسال اعلان قرار می‌گیرد


@receiver(post_save, sender=Order)
def update_inventory(sender, instance, **kwargs):
    """به‌روزرسانی موجودی محصولات"""
    if instance.status == 'paid':
        for item in instance.items.all():
            if item.variant:
                item.variant.stock_quantity -= item.quantity
                item.variant.save()
            else:
                item.product.stock_quantity -= item.quantity
                item.product.save()
        
        logger.info(f"Inventory updated for order: {instance.order_number}")


@receiver(post_save, sender=Payment)
def update_order_payment_status(sender, instance, **kwargs):
    """به‌روزرسانی وضعیت پرداخت سفارش"""
    if instance.status == 'completed':
        instance.order.payment_status = 'completed'
        instance.order.status = 'paid'
        instance.order.paid_at = timezone.now()
        instance.order.save()
        
        logger.info(f"Order payment status updated: {instance.order.order_number}")


@receiver(post_save, sender=Coupon)
def update_coupon_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش کوپن"""
    cache_key = f"coupon_{instance.code}"
    cache.delete(cache_key)
    logger.info(f"Coupon cache cleared: {instance.code}")


@receiver(pre_save, sender=Cart)
def set_cart_expiry(sender, instance, **kwargs):
    """تنظیم تاریخ انقضای سبد خرید"""
    if not instance.expires_at:
        from .constants import DEFAULT_CART_EXPIRY_DAYS
        instance.expires_at = timezone.now() + timezone.timedelta(days=DEFAULT_CART_EXPIRY_DAYS)


@receiver(post_save, sender=Cart)
def cleanup_expired_carts(sender, instance, **kwargs):
    """پاکسازی سبدهای خرید منقضی شده"""
    expired_carts = Cart.objects.filter(
        expires_at__lt=timezone.now(),
        status='active'
    )
    for cart in expired_carts:
        cart.status = 'expired'
        cart.save()
    
    if expired_carts.exists():
        logger.info(f"Cleaned up {expired_carts.count()} expired carts")


@receiver(post_save, sender=Order)
def update_cart_status_on_order(sender, instance, created, **kwargs):
    """تغییر وضعیت سبد خرید هنگام ایجاد سفارش"""
    if created and instance.cart:
        instance.cart.status = 'converted'
        instance.cart.save()
        logger.info(f"Cart converted to order: {instance.cart.id}")


@receiver(post_save, sender=OrderItem)
def update_order_totals(sender, instance, **kwargs):
    """به‌روزرسانی مجموع سفارش"""
    order = instance.order
    order.subtotal = order.items.aggregate(
        total=models.Sum(models.F('quantity') * models.F('price'))
    )['total'] or 0
    order.discount_amount = order.items.aggregate(
        total=models.Sum('discount_amount')
    )['total'] or 0
    order.total_amount = order.subtotal - order.discount_amount
    order.save(update_fields=['subtotal', 'discount_amount', 'total_amount'])


@receiver(post_save, sender=Order)
def clear_user_cart_cache(sender, instance, **kwargs):
    """پاک کردن کش سبد خرید کاربر"""
    cache_key = f"user_carts_{instance.user.id}"
    cache.delete(cache_key)
    logger.info(f"User cart cache cleared: {instance.user.username}")


@receiver(post_save, sender=Order)
def update_order_stats_cache(sender, instance, **kwargs):
    """به‌روزرسانی کش آمار سفارشات"""
    cache.delete('order_stats')
    logger.info("Order stats cache cleared")
