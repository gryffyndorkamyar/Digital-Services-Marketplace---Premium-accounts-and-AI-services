import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.chdir(ROOT)

os.environ.setdefault("DEBUG", "False")
os.environ.setdefault("SECRET_KEY", "local-prod-check-key")
os.environ.setdefault("USE_SQLITE", "True")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")

import django

django.setup()

from django.conf import settings
from django.test import Client

print("ALLOWED_HOSTS:", "ovyraworld.com" in settings.ALLOWED_HOSTS, "www.ovyraworld.com" in settings.ALLOWED_HOSTS)
print("CSRF https:", "https://ovyraworld.com" in settings.CSRF_TRUSTED_ORIGINS)
print("CSRF http:", "http://ovyraworld.com" in settings.CSRF_TRUSTED_ORIGINS)
print("SECURE_SSL_REDIRECT:", settings.SECURE_SSL_REDIRECT)

client = Client()
for host in ("ovyraworld.com", "www.ovyraworld.com"):
    for proto in ("http", "https"):
        extra = {"HTTP_X_FORWARDED_PROTO": proto} if proto == "https" else {}
        r = client.get("/health/", HTTP_HOST=host, secure=(proto == "https"), **extra)
        print(f"{host} {proto}: {r.status_code} {r.content.decode()}")
    r = client.get("/", HTTP_HOST=host, secure=True, HTTP_X_FORWARDED_PROTO="https")
    has_html = b"<html" in r.content.lower()
    print(f"{host} / (https): {r.status_code}, html={has_html}")
