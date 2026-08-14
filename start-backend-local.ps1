# Start Mignum LOCAL backend on port 8010
# Does NOT touch :8000 (Business-OS) or :8001 (MardeKuhestan)
# Uses dedicated Docker Postgres on :55434

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Prefer project venv so global Python packages from other projects do not collide
if (Test-Path ".\.venv\Scripts\python.exe") {
  $Python = (Resolve-Path ".\.venv\Scripts\python.exe").Path
} else {
  Write-Host "Creating .venv ..."
  python -m venv .venv
  $Python = (Resolve-Path ".\.venv\Scripts\python.exe").Path
  & $Python -m pip install -q --upgrade pip
  & $Python -m pip install -q -r requirements.txt
}
Write-Host "Using Python: $Python"

$container = "mignum-postgres"
$port = "55434"

$exists = docker ps -a --format "{{.Names}}" | Where-Object { $_ -eq $container }
if (-not $exists) {
  Write-Host "Creating dedicated Postgres container '$container' on port $port ..."
  docker run -d --name $container `
    -e POSTGRES_USER=mignum `
    -e POSTGRES_PASSWORD=mignum_local `
    -e POSTGRES_DB=mignum `
    -p "${port}:5432" `
    postgres:16 | Out-Null
} else {
  $running = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $container }
  if (-not $running) {
    Write-Host "Starting existing container '$container' ..."
    docker start $container | Out-Null
  } else {
    Write-Host "Container '$container' already running."
  }
}

Write-Host "Waiting for Postgres to accept connections..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  docker exec $container pg_isready -U mignum -d mignum 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { $ready = $true; break }
  Start-Sleep -Seconds 1
}
if (-not $ready) { throw "Postgres container did not become ready in time." }

$env:USE_LOCAL_DB = "True"
$env:USE_SQLITE = "False"
$env:DEBUG = "True"
$env:ZARINPAL_SANDBOX = "True"
$env:SECURE_SSL_REDIRECT = "False"
$env:LOCAL_DB_NAME = "mignum"
$env:LOCAL_DB_USER = "mignum"
$env:LOCAL_DB_PASSWORD = "mignum_local"
$env:LOCAL_DB_HOST = "127.0.0.1"
$env:LOCAL_DB_PORT = $port
$env:ALLOWED_HOSTS = "localhost,127.0.0.1"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000,http://127.0.0.1:8010,http://localhost:8010"

Write-Host "Running migrations..."
& $Python manage.py migrate --noinput

Write-Host "Ensuring local admin (admin / admin123)..."
& $Python -c @"
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
u, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@localhost'})
u.set_password('admin123')
u.is_staff = True
u.is_superuser = True
u.is_active = True
u.save()
print('admin ready')
"@

Write-Host "Seeding sample catalog if empty..."
& $Python -c @"
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()
from decimal import Decimal
from common.models import Category, Product
if not Product.objects.exists():
    cat, _ = Category.objects.get_or_create(
        slug='sample',
        defaults={'name': 'نمونه', 'is_active': True, 'is_featured': True},
    )
    Product.objects.create(
        name='محصول تست لوکال',
        slug='local-test-product',
        sku='LOCAL-TEST-001',
        category=cat,
        short_description='محصول تست برای خرید لوکال',
        description='این محصول فقط برای تست فلو خرید روی لوکال ساخته شده است.',
        base_price=Decimal('10000'),
        currency='IRR',
        stock_quantity=100,
        is_unlimited_stock=True,
        is_active=True,
        is_featured=True,
    )
    print('sample product created')
else:
    print('products already exist:', Product.objects.count())
"@

Write-Host ""
Write-Host "============================================"
Write-Host " Mignum backend : http://127.0.0.1:8010/"
Write-Host " Admin          : http://127.0.0.1:8010/admin/  (admin / admin123)"
Write-Host " Frontend CRA   : http://localhost:3000   (run start-frontend-local.ps1)"
Write-Host " DB             : 127.0.0.1:55434 (docker: mignum-postgres)"
Write-Host " Left alone     : :8000 Business-OS, :8001 MardeKuhestan"
Write-Host "============================================"
Write-Host ""

& $Python manage.py runserver 127.0.0.1:8010
