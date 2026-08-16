"""
WSGI config for main project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()


def _ensure_staticfiles():
    """RunFlare build may skip collectstatic — create staticfiles if missing."""
    try:
        from django.conf import settings
        from django.core.management import call_command

        static_root = Path(settings.STATIC_ROOT)
        static_root.mkdir(parents=True, exist_ok=True)
        has_main_js = any(static_root.glob('js/main.*.js'))
        if not has_main_js and Path(settings.REACT_BUILD_DIR).exists():
            call_command('collectstatic', interactive=False, verbosity=0)
    except Exception as exc:
        import sys

        print(f"OVYRA: collectstatic skipped ({exc})", file=sys.stderr)


_ensure_staticfiles()
