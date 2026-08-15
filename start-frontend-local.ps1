# Start Mignum LOCAL frontend (CRA on :3000 → API :8010)
# Or run both:  .\start-dev.ps1  (from project root)
$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\frontend"
Write-Host "Frontend: http://localhost:3000  (hot reload on save)"
Write-Host "API target: http://127.0.0.1:8010/api"
Write-Host "Tip: run .\start-dev.ps1 from repo root to start backend + frontend together"
npm start
