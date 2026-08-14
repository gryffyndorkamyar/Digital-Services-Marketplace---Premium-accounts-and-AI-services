#!/usr/bin/env sh
# RunFlare / Liara-compatible production entrypoint
set -eu

if [ -d /usr/src/app ]; then
  cd /usr/src/app
else
  cd "$(dirname "$0")"
fi

PORT="${PORT:-8000}"

echo "==> OVYRA — starting gunicorn on 0.0.0.0:${PORT}"

exec gunicorn main.wsgi:application \
  --bind "0.0.0.0:${PORT}" \
  --workers 2 \
  --threads 2 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  --capture-output \
  --log-level info
