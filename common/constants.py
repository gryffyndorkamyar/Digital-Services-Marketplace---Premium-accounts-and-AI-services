# common/constants.py

# انواع محصولات
PRODUCT_TYPES = [
    ('account', 'حساب کاربری'),
    ('service', 'سرویس'),
    ('software', 'نرم‌افزار'),
    ('game', 'بازی'),
    ('subscription', 'اشتراک'),
    ('other', 'سایر'),
]

# انواع دسته‌بندی
CATEGORY_TYPES = [
    ('game', 'بازی'),
    ('ai', 'هوش مصنوعی'),
    ('software', 'نرم‌افزار'),
    ('service', 'سرویس'),
    ('entertainment', 'سرگرمی'),
    ('productivity', 'بهره‌وری'),
    ('other', 'سایر'),
]

# وضعیت محصولات
PRODUCT_STATUS = [
    ('draft', 'پیش‌نویس'),
    ('active', 'فعال'),
    ('inactive', 'غیرفعال'),
    ('archived', 'آرشیو شده'),
]

# روش‌های تحویل
DELIVERY_METHODS = [
    ('instant', 'فوری'),
    ('email', 'ایمیل'),
    ('manual', 'دستی'),
    ('api', 'API'),
]

# واحدهای پول
CURRENCIES = [
    ('USD', 'دلار آمریکا'),
    ('EUR', 'یورو'),
    ('GBP', 'پوند انگلیس'),
    ('IRR', 'ریال ایران'),
    ('BTC', 'بیت‌کوین'),
    ('ETH', 'اتریوم'),
]

# مقادیر پیش‌فرض
DEFAULT_CURRENCY = 'USD'
DEFAULT_DELIVERY_TIME = 0  # دقیقه
DEFAULT_LOW_STOCK_THRESHOLD = 5
DEFAULT_NEW_PRODUCT_DAYS = 30