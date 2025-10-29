# common/validators.py
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
import re


def validate_sku_format(value):
    """تایید فرمت SKU"""
    if not re.match(r'^[A-Z]{3}-\d{12}$', value):
        raise ValidationError(
            _('SKU باید به فرمت XXX-YYYYMMDDHHMM باشد (مثل ACC-202412011430)')
        )


def validate_price_positive(value):
    """تایید مثبت بودن قیمت"""
    if value <= 0:
        raise ValidationError(_('قیمت باید بزرگتر از صفر باشد.'))


def validate_sale_price_less_than_base(sale_price, base_price):
    """تایید کمتر بودن قیمت تخفیف از قیمت اصلی"""
    if sale_price and sale_price >= base_price:
        raise ValidationError(_('قیمت تخفیف باید کمتر از قیمت اصلی باشد.'))


def validate_stock_quantity(value):
    """تایید موجودی"""
    if value < 0:
        raise ValidationError(_('موجودی نمی‌تواند منفی باشد.'))


def validate_delivery_time(value):
    """تایید زمان تحویل"""
    if value < 0:
        raise ValidationError(_('زمان تحویل نمی‌تواند منفی باشد.'))


def validate_rating_range(value):
    """تایید امتیاز بین 1 تا 5"""
    if not 1 <= value <= 5:
        raise ValidationError(_('امتیاز باید بین 1 تا 5 باشد.'))


def validate_meta_title_length(value):
    """تایید طول عنوان متا برای SEO"""
    if len(value) > 60:
        raise ValidationError(_('عنوان متا نباید بیشتر از 60 کاراکتر باشد.'))


def validate_meta_description_length(value):
    """تایید طول توضیحات متا برای SEO"""
    if len(value) > 160:
        raise ValidationError(_('توضیحات متا نباید بیشتر از 160 کاراکتر باشد.'))


# اعتبارسنج‌های فیلد
sku_validator = RegexValidator(
    regex=r'^[A-Z]{3}-\d{12}$',
    message=_('SKU باید به فرمت XXX-YYYYMMDDHHMM باشد'),
    code='invalid_sku'
)

currency_validator = RegexValidator(
    regex=r'^[A-Z]{3}$',
    message=_('واحد پول باید کد 3 حرفی ISO باشد (مثل USD, EUR)'),
    code='invalid_currency'
)

hex_color_validator = RegexValidator(
    regex=r'^#[0-9A-Fa-f]{6}$',
    message=_('رنگ باید فرمت هگز معتبر باشد (مثل #3B82F6)'),
    code='invalid_hex_color'
)

