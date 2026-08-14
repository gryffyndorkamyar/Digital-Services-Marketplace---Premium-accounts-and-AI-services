"""Gunicorn config — RunFlare / production."""
import multiprocessing

bind = "0.0.0.0:8000"
workers = min(multiprocessing.cpu_count() * 2 + 1, 4)
worker_class = "sync"
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 50
accesslog = "-"
errorlog = "-"
capture_output = True
