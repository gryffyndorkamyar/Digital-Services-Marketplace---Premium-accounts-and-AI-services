# cart/constants.py

# وضعیت سفارش
ORDER_STATUS = [
    ('pending', 'در انتظار پرداخت'),
    ('paid', 'پرداخت شده'),
    ('processing', 'در حال پردازش'),
    ('shipped', 'ارسال شده'),
    ('delivered', 'تحویل داده شده'),
    ('cancelled', 'لغو شده'),
    ('refunded', 'بازپرداخت شده'),
    ('failed', 'ناموفق'),
]

# وضعیت سبد خرید
CART_STATUS = [
    ('active', 'فعال'),
    ('merged', 'ادغام شده'),
    ('saved', 'ذخیره شده'),
    ('expired', 'منقضی شده'),
    ('converted', 'تبدیل شده'),
]

# روش‌های پرداخت
PAYMENT_METHODS = [
    ('online', 'پرداخت آنلاین'),
    ('wallet', 'کیف پول'),
    ('credit', 'اعتبار'),
    ('gift_card', 'کارت هدیه'),
    ('crypto', 'ارز دیجیتال'),
]

# وضعیت پرداخت
PAYMENT_STATUS = [
    ('pending', 'در انتظار'),
    ('processing', 'در حال پردازش'),
    ('completed', 'تکمیل شده'),
    ('failed', 'ناموفق'),
    ('cancelled', 'لغو شده'),
    ('refunded', 'بازپرداخت شده'),
]

# نوع‌های کوپن
COUPON_TYPES = [
    ('percentage', 'درصدی'),
    ('fixed', 'مبلغ ثابت'),
    ('free_shipping', 'ارسال رایگان'),
    ('buy_one_get_one', 'یکی بخر یکی هدیه بگیر'),
]

# وضعیت کوپن
COUPON_STATUS = [
    ('active', 'فعال'),
    ('inactive', 'غیرفعال'),
    ('expired', 'منقضی شده'),
    ('used', 'استفاده شده'),
]

# نوع‌های تخفیف
DISCOUNT_TYPES = [
    ('percentage', 'درصدی'),
    ('fixed', 'مبلغ ثابت'),
    ('free_shipping', 'ارسال رایگان'),
]

# وضعیت آیتم سبد خرید
CART_ITEM_STATUS = [
    ('active', 'فعال'),
    ('removed', 'حذف شده'),
    ('out_of_stock', 'ناموجود'),
    ('expired', 'منقضی شده'),
]

# تنظیمات پیش‌فرض
DEFAULT_CART_EXPIRY_DAYS = 30
DEFAULT_COUPON_EXPIRY_DAYS = 7
DEFAULT_ORDER_EXPIRY_MINUTES = 30
DEFAULT_MIN_ORDER_AMOUNT = 0
DEFAULT_MAX_ORDER_AMOUNT = 1000000000

# محدودیت‌ها
MAX_CART_ITEMS = 50
MAX_QUANTITY_PER_ITEM = 100
MIN_QUANTITY_PER_ITEM = 1

# پیام‌های خطا
ERROR_MESSAGES = {
    'cart_not_found': 'سبد خرید یافت نشد.',
    'item_not_found': 'آیتم در سبد خرید یافت نشد.',
    'insufficient_stock': 'موجودی کافی نیست.',
    'invalid_quantity': 'تعداد نامعتبر است.',
    'cart_expired': 'سبد خرید منقضی شده است.',
    'order_not_found': 'سفارش یافت نشد.',
    'invalid_coupon': 'کوپن نامعتبر است.',
    'coupon_expired': 'کوپن منقضی شده است.',
    'coupon_already_used': 'کوپن قبلاً استفاده شده است.',
    'minimum_order_amount': 'مبلغ سفارش کمتر از حداقل مجاز است.',
    'maximum_order_amount': 'مبلغ سفارش بیشتر از حداکثر مجاز است.',
    'payment_failed': 'پرداخت ناموفق بود.',
    'order_cancelled': 'سفارش لغو شده است.',
    'refund_failed': 'بازپرداخت ناموفق بود.',
}

# پیام‌های موفقیت
SUCCESS_MESSAGES = {
    'cart_created': 'سبد خرید ایجاد شد.',
    'item_added': 'آیتم به سبد خرید اضافه شد.',
    'item_updated': 'آیتم بروزرسانی شد.',
    'item_removed': 'آیتم از سبد خرید حذف شد.',
    'cart_cleared': 'سبد خرید پاک شد.',
    'order_created': 'سفارش ایجاد شد.',
    'order_updated': 'سفارش بروزرسانی شد.',
    'order_cancelled': 'سفارش لغو شد.',
    'payment_successful': 'پرداخت با موفقیت انجام شد.',
    'coupon_applied': 'کوپن اعمال شد.',
    'coupon_removed': 'کوپن حذف شد.',
    'refund_successful': 'بازپرداخت با موفقیت انجام شد.',
}
