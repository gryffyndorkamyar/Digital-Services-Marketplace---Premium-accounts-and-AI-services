# cart/zarinpal.py
"""
ماژول مدیریت درگاه پرداخت زرین‌پال
"""
import requests
from django.conf import settings
from django.urls import reverse
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

# URL های زرین پال
ZARINPAL_SANDBOX_URL = "https://sandbox.zarinpal.com/pg/v4/pay"
ZARINPAL_SANDBOX_VERIFY_URL = "https://sandbox.zarinpal.com/pg/v4/verify"
ZARINPAL_PRODUCTION_URL = "https://api.zarinpal.com/pg/v4/pay"
ZARINPAL_PRODUCTION_VERIFY_URL = "https://api.zarinpal.com/pg/v4/verify"


class ZarinpalGateway:
    """کلاس مدیریت درگاه زرین پال"""
    
    def __init__(self, merchant_id=None, is_sandbox=True):
        """
        مقداردهی اولیه
        
        Args:
            merchant_id: مرچنت کد زرین پال
            is_sandbox: استفاده از محیط تست
        """
        self.merchant_id = merchant_id or getattr(settings, 'ZARINPAL_MERCHANT_ID', '')
        self.is_sandbox = is_sandbox if hasattr(settings, 'ZARINPAL_SANDBOX') else getattr(settings, 'ZARINPAL_SANDBOX', True)
        
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
            amount: مبلغ به ریال
            description: توضیحات
            callback_url: آدرس بازگشت
            mobile: شماره موبایل (اختیاری)
            email: ایمیل (اختیاری)
        
        Returns:
            dict: شامل authority و payment_url
        """
        # بررسی وجود Merchant ID
        if not self.merchant_id:
            logger.error("ZARINPAL_MERCHANT_ID is not set")
            return {
                'success': False,
                'message': 'Merchant ID زرین پال تنظیم نشده است. لطفاً ZARINPAL_MERCHANT_ID را در فایل .env تنظیم کنید.'
            }
        
        try:
            # تبدیل مبلغ به تومان (اگر لازم باشه) - زرین پال بر اساس ریال کار می‌کنه
            # اگر مبلغ به تومان باشه، باید در 10 ضرب کنیم
            amount_in_rial = int(float(amount) * 10) if amount < 1000 else int(amount)
            
            payload = {
                "merchant_id": self.merchant_id,
                "amount": amount_in_rial,
                "description": description,
                "callback_url": callback_url,
            }
            
            # اضافه کردن موبایل و ایمیل اگر موجود باشند
            if mobile:
                payload["mobile"] = mobile
            if email:
                payload["email"] = email
            
            response = requests.post(self.payment_url, json=payload, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('data') and data.get('data').get('code') == 100:
                authority = data['data']['authority']
                payment_url = f"https://{'sandbox.' if self.is_sandbox else ''}zarinpal.com/pg/StartPay/{authority}"
                
                logger.info(f"Zarinpal payment request created: {authority}")
                return {
                    'success': True,
                    'authority': authority,
                    'payment_url': payment_url,
                    'data': data
                }
            else:
                error_code = data.get('errors', {}).get('code', 'Unknown')
                logger.error(f"Zarinpal payment request failed: {error_code}")
                return {
                    'success': False,
                    'error_code': error_code,
                    'message': data.get('errors', {}).get('message', 'خطا در ایجاد درخواست پرداخت'),
                    'data': data
                }
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Zarinpal request exception: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'message': 'خطا در ارتباط با درگاه پرداخت'
            }
        except Exception as e:
            logger.error(f"Zarinpal unexpected error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'message': 'خطای غیرمنتظره در درگاه پرداخت'
            }
    
    def verify_payment(self, authority, amount):
        """
        تایید پرداخت
        
        Args:
            authority: کد authority از زرین پال
            amount: مبلغ به ریال
        
        Returns:
            dict: شامل نتیجه تایید
        """
        try:
            # تبدیل مبلغ به تومان (اگر لازم باشه)
            amount_in_rial = int(float(amount) * 10) if amount < 1000 else int(amount)
            
            payload = {
                "merchant_id": self.merchant_id,
                "amount": amount_in_rial,
                "authority": authority
            }
            
            response = requests.post(self.verify_url, json=payload, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('data') and data.get('data').get('code') == 100:
                ref_id = data['data'].get('ref_id')
                logger.info(f"Zarinpal payment verified: {ref_id}")
                return {
                    'success': True,
                    'ref_id': ref_id,
                    'data': data
                }
            else:
                error_code = data.get('errors', {}).get('code', 'Unknown')
                logger.error(f"Zarinpal payment verification failed: {error_code}")
                return {
                    'success': False,
                    'error_code': error_code,
                    'message': data.get('errors', {}).get('message', 'خطا در تایید پرداخت'),
                    'data': data
                }
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Zarinpal verify exception: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'message': 'خطا در ارتباط با درگاه پرداخت'
            }
        except Exception as e:
            logger.error(f"Zarinpal verify unexpected error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'message': 'خطای غیرمنتظره در تایید پرداخت'
            }


def get_zarinpal_gateway():
    """دریافت instance از ZarinpalGateway"""
    from django.conf import settings
    merchant_id = getattr(settings, 'ZARINPAL_MERCHANT_ID', '')
    is_sandbox = getattr(settings, 'ZARINPAL_SANDBOX', True)
    return ZarinpalGateway(merchant_id=merchant_id, is_sandbox=is_sandbox)

