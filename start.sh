#!/usr/bin/env sh
# RunFlare / Liara-compatible production entrypoint
set -eu

if [ -d /usr/src/app ]; then
  cd /usr/src/app
else
  cd "$(dirname "$0")"
fi

PORT="${PORT:-8000}"

echo "==> OVYRA — starting gunicorn (WSGI/sync) on 0.0.0.0:${PORT}"

exec gunicorn main.wsgi:application \
  -c gunicorn.conf.py \
  --bind "0.0.0.0:${PORT}" \
  --workers 2 \
  --worker-class sync \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  --capture-output \
  --log-level info
