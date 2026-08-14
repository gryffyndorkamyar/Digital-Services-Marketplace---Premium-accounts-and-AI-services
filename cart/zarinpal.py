# cart/zarinpal.py
"""
ماژول مدیریت درگاه پرداخت زرین‌پال
"""
import requests
from django.conf import settings
from decimal import Decimal, ROUND_HALF_UP
import logging

logger = logging.getLogger(__name__)

# URL های زرین پال (API v4)
ZARINPAL_SANDBOX_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
ZARINPAL_SANDBOX_VERIFY_URL = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
ZARINPAL_PRODUCTION_URL = "https://api.zarinpal.com/pg/v4/payment/request.json"
ZARINPAL_PRODUCTION_VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json"


def to_zarinpal_rial(amount) -> int:
    """
    تبدیل مبلغ سفارش به ریال برای API زرین‌پال.

    قیمت‌های فروشگاه به تومان (IRT) هستند مگر اینکه ZARINPAL_CURRENCY_UNIT=IRR باشد.
    """
    value = Decimal(str(amount))
    unit = getattr(settings, 'ZARINPAL_CURRENCY_UNIT', 'IRT').upper()
    if unit in ('IRT', 'TOMAN', 'TMN'):
        value = value * Decimal('10')
    amount_rial = int(value.quantize(Decimal('1'), rounding=ROUND_HALF_UP))
    if amount_rial < 1000:
        raise ValueError('حداقل مبلغ قابل پرداخت ۱۰۰۰ ریال است.')
    return amount_rial


class ZarinpalGateway:
    """کلاس مدیریت درگاه زرین پال"""

    def __init__(self, merchant_id=None, is_sandbox=None):
        """
        مقداردهی اولیه

        Args:
            merchant_id: مرچنت کد زرین پال
            is_sandbox: استفاده از محیط تست (None = از settings)
        """
        self.merchant_id = merchant_id or getattr(settings, 'ZARINPAL_MERCHANT_ID', '')
        if is_sandbox is None:
            self.is_sandbox = bool(getattr(settings, 'ZARINPAL_SANDBOX', True))
        else:
            self.is_sandbox = bool(is_sandbox)

        if self.is_sandbox:
            self.payment_url = ZARINPAL_SANDBOX_URL
            self.verify_url = ZARINPAL_SANDBOX_VERIFY_URL
        else:
            self.payment_url = ZARINPAL_PRODUCTION_URL
            self.verify_url = ZARINPAL_PRODUCTION_VERIFY_URL

    def create_payment_request(self, amount, description, callback_url, mobile=None, email=None):
        """
        ایجاد درخواست پرداخت

        Args:
            amount: مبلغ سفارش (تومان مگر IRR)
            description: توضیحات
            callback_url: آدرس بازگشت
            mobile: شماره موبایل (اختیاری)
            email: ایمیل (اختیاری)

        Returns:
            dict: شامل authority و payment_url
        """
        if not self.merchant_id:
            logger.error("ZARINPAL_MERCHANT_ID is not set")
            return {
                'success': False,
                'message': 'Merchant ID زرین پال تنظیم نشده است. لطفاً ZARINPAL_MERCHANT_ID را در فایل .env تنظیم کنید.'
            }

        try:
            amount_in_rial = to_zarinpal_rial(amount)

            payload = {
                "merchant_id": self.merchant_id,
                "amount": amount_in_rial,
                "description": description,
                "callback_url": callback_url,
            }

            if mobile:
                payload["mobile"] = mobile
            if email:
                payload["email"] = email

            merchant_preview = f"{self.merchant_id[:8]}..." if len(self.merchant_id) >= 8 else self.merchant_id
            logger.info(
                "Zarinpal request - URL: %s, Merchant ID: %s, Amount(rial): %s",
                self.payment_url,
                merchant_preview,
                amount_in_rial,
            )

            response = requests.post(self.payment_url, json=payload, timeout=15)
            response.raise_for_status()

            data = response.json()

            if data.get('data') and data.get('data').get('code') == 100:
                authority = data['data']['authority']
                payment_url = (
                    f"https://{'sandbox.' if self.is_sandbox else 'www.'}"
                    f"zarinpal.com/pg/StartPay/{authority}"
                )

                logger.info("Zarinpal payment request created: %s, URL: %s", authority, payment_url)
                return {
                    'success': True,
                    'authority': authority,
                    'payment_url': payment_url,
                    'amount_rial': amount_in_rial,
                    'data': data,
                }

            errors = data.get('errors') or {}
            error_code = errors.get('code', 'Unknown') if isinstance(errors, dict) else 'Unknown'
            error_message = errors.get('message', 'خطا در ایجاد درخواست پرداخت') if isinstance(errors, dict) else 'خطا در ایجاد درخواست پرداخت'
            logger.error("Zarinpal payment request failed: %s %s", error_code, error_message)
            return {
                'success': False,
                'error_code': error_code,
                'message': error_message,
                'data': data,
            }

        except ValueError as e:
            logger.error("Zarinpal amount error: %s", e)
            return {
                'success': False,
                'message': str(e),
            }
        except requests.exceptions.RequestException as e:
            logger.error("Zarinpal request exception: %s", e)
            return {
                'success': False,
                'error': str(e),
                'message': 'خطا در ارتباط با درگاه پرداخت',
            }
        except Exception as e:
            logger.error("Zarinpal unexpected error: %s", e)
            return {
                'success': False,
                'error': str(e),
                'message': 'خطای غیرمنتظره در درگاه پرداخت',
            }

    def verify_payment(self, authority, amount):
        """
        تایید پرداخت

        Args:
            authority: کد authority از زرین پال
            amount: مبلغ سفارش (همان واحد create)

        Returns:
            dict: شامل نتیجه تایید
        """
        try:
            amount_in_rial = to_zarinpal_rial(amount)

            payload = {
                "merchant_id": self.merchant_id,
                "amount": amount_in_rial,
                "authority": authority,
            }

            response = requests.post(self.verify_url, json=payload, timeout=15)
            response.raise_for_status()

            data = response.json()
            code = (data.get('data') or {}).get('code')

            # 100 = موفق، 101 = قبلاً تایید شده
            if code in (100, 101):
                ref_id = data['data'].get('ref_id')
                logger.info("Zarinpal payment verified: %s (code=%s)", ref_id, code)
                return {
                    'success': True,
                    'ref_id': ref_id,
                    'already_verified': code == 101,
                    'data': data,
                }

            errors = data.get('errors') or {}
            error_code = errors.get('code', code or 'Unknown') if isinstance(errors, dict) else (code or 'Unknown')
            error_message = errors.get('message', 'خطا در تایید پرداخت') if isinstance(errors, dict) else 'خطا در تایید پرداخت'
            logger.error("Zarinpal payment verification failed: %s", error_code)
            return {
                'success': False,
                'error_code': error_code,
                'message': error_message,
                'data': data,
            }

        except ValueError as e:
            logger.error("Zarinpal verify amount error: %s", e)
            return {
                'success': False,
                'message': str(e),
            }
        except requests.exceptions.RequestException as e:
            logger.error("Zarinpal verify exception: %s", e)
            return {
                'success': False,
                'error': str(e),
                'message': 'خطا در ارتباط با درگاه پرداخت',
            }
        except Exception as e:
            logger.error("Zarinpal verify unexpected error: %s", e)
            return {
                'success': False,
                'error': str(e),
                'message': 'خطای غیرمنتظره در تایید پرداخت',
            }


def get_zarinpal_gateway():
    """دریافت instance از ZarinpalGateway"""
    merchant_id = getattr(settings, 'ZARINPAL_MERCHANT_ID', '')
    is_sandbox = getattr(settings, 'ZARINPAL_SANDBOX', True)
    return ZarinpalGateway(merchant_id=merchant_id, is_sandbox=is_sandbox)
