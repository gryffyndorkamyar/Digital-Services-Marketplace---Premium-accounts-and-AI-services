#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "==> OVYRA — RunFlare deploy"

if [[ "${BUILD_FRONTEND_ON_SERVER:-0}" == "1" ]]; then
  cd frontend && npm ci && npm run build && cd "$PROJECT_ROOT"
elif [[ ! -f frontend/build/index.html ]]; then
  echo "ERROR: frontend/build missing — build locally first."
  exit 1
fi

python3 -m pip install -r requirements.txt
python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput

echo "==> Done."
