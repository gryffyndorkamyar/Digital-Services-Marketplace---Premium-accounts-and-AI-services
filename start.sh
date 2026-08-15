#!/usr/bin/env sh
# RunFlare / Liara-compatible production entrypoint
set -eu

if [ -d /usr/src/app ]; then
  cd /usr/src/app
else
  cd "$(dirname "$0")"
fi

PORT="${PORT:-8000}"

missing=""
for var in SECRET_KEY DB_ENGINE DB_NAME DB_USER DB_PASSWORD DB_HOST DB_PORT; do
  eval "val=\${$var:-}"
  if [ -z "$val" ]; then
    missing="${missing} ${var}"
  fi
done

if [ -n "$missing" ]; then
  echo "ERROR: Missing required environment variables:${missing}" >&2
  echo "Set them in RunFlare → Environment Variables (see deploy/runflare.env.example)." >&2
  exit 1
fi

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
