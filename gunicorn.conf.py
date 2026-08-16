"""Gunicorn config — RunFlare / production."""
import multiprocessing
import os

# RunFlare/Liara nginx proxies to the platform-assigned PORT (see runflare.json "port").
_port = os.environ.get("PORT", "8000")
bind = f"0.0.0.0:{_port}"
# RunFlare free tier is 512MB RAM — one worker avoids OOM during deploy
workers = int(os.environ.get("WEB_CONCURRENCY", "1"))
worker_class = "sync"
preload_app = False
timeout = 120
keepalive = 2
max_requests = 500
max_requests_jitter = 50
accesslog = "-"
errorlog = "-"
capture_output = True
loglevel = "info"
