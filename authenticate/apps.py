from django.apps import AppConfig


class AuthenticateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authenticate'
    verbose_name = 'احراز هویت'

    def ready(self):
        """هنگام آماده شدن اپ"""
        import authenticate.signals
