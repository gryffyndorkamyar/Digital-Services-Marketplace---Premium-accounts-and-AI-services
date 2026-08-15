#!/usr/bin/env sh
# RunFlare / Liara-compatible production entrypoint
set -eu

for appdir in /usr/src/app /app "$(dirname "$0")"; do
  if [ -f "$appdir/manage.py" ]; then
    cd "$appdir"
    break
  fi
done

PORT="${PORT:-8000}"

missing=""
if [ "${USE_SQLITE:-False}" = "True" ] || [ "${USE_SQLITE:-false}" = "true" ] || [ "${USE_SQLITE:-0}" = "1" ]; then
  for var in SECRET_KEY; do
    eval "val=\${$var:-}"
    if [ -z "$val" ]; then
      missing="${missing} ${var}"
    fi
  done
else
  for var in SECRET_KEY DB_ENGINE DB_NAME DB_USER DB_PASSWORD DB_HOST DB_PORT; do
    eval "val=\${$var:-}"
    if [ -z "$val" ]; then
      missing="${missing} ${var}"
    fi
  done
fi

if [ -n "$missing" ]; then
  echo "ERROR: Missing required environment variables:${missing}" >&2
  echo "Set them in RunFlare → Environment Variables (see deploy/RUNFLARE_FINAL.env)." >&2
  exit 1
fi

mkdir -p media staticfiles

echo "==> OVYRA — migrate + collectstatic"
python manage.py migrate --noinput
python manage.py collectstatic --noinput

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
