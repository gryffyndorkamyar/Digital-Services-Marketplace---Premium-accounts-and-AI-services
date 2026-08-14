#!/usr/bin/env bash
# RunCloud deploy hook — run from project root on the server
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "==> Mignum / OVYRA — RunCloud deploy"
echo "    Project: $PROJECT_ROOT"

# Optional: build frontend on server (requires Node.js on the VPS)
if [[ "${BUILD_FRONTEND_ON_SERVER:-0}" == "1" ]]; then
  echo "==> Building frontend..."
  cd frontend
  npm ci
  npm run build
  cd "$PROJECT_ROOT"
else
  if [[ ! -f frontend/build/index.html ]]; then
    echo "ERROR: frontend/build/index.html not found."
    echo "Build locally (npm run build) or set BUILD_FRONTEND_ON_SERVER=1"
    exit 1
  fi
  echo "==> Using pre-built frontend/build/"
fi

echo "==> Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo "==> Django migrate + collectstatic..."
python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput

echo "==> Deploy finished. Restart Gunicorn from RunCloud panel or:"
echo "    sudo systemctl restart <your-gunicorn-service>"
