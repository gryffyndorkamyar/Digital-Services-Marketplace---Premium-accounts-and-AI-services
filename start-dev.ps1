# Start Mignum full local stack (backend :8010 + frontend :3000)
# Usage:
#   .\start-dev.ps1           → two PowerShell windows
#   .\start-dev.ps1 -Quick    → skip migrate/seed on backend (faster restart)

param(
  [switch]$Quick
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host ""
Write-Host "============================================"
Write-Host " OVYRA / Mignum — local dev"
Write-Host "============================================"
Write-Host " Frontend  ->  http://localhost:3000"
Write-Host " Backend   ->  http://127.0.0.1:8010/"
Write-Host " Admin     ->  http://127.0.0.1:8010/admin/  (admin / admin123)"
Write-Host ""
Write-Host " Hot reload: save files in frontend/src or Django apps"
Write-Host " Stop both:  .\stop-dev.ps1"
Write-Host "============================================"
Write-Host ""

$backendArgs = @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-File", (Join-Path $Root "start-backend-local.ps1")
)
if ($Quick) { $backendArgs += "-Quick" }

Start-Process powershell -ArgumentList $backendArgs -WorkingDirectory $Root

# Give Postgres + Django a head start before CRA opens
Start-Sleep -Seconds 4

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-File", (Join-Path $Root "start-frontend-local.ps1")
) -WorkingDirectory $Root

Write-Host "Started backend + frontend in separate windows."
