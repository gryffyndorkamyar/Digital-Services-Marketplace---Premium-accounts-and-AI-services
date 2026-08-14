"""Gunicorn config — RunFlare / production."""
import multiprocessing
import os

# RunFlare/Liara nginx proxies to the platform-assigned PORT (see runflare.json "port").
_port = os.environ.get("PORT", "8000")
bind = f"0.0.0.0:{_port}"
workers = min(multiprocessing.cpu_count() * 2 + 1, 4)
worker_class = "sync"
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 50
accesslog = "-"
errorlog = "-"
capture_output = True
