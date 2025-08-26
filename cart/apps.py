from django.apps import AppConfig


class CartConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cart'
    verbose_name = 'سبد خرید و سفارشات'

    def ready(self):
        """هنگام آماده شدن اپ"""
        import cart.signals
