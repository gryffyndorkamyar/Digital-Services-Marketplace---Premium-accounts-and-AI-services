# Start Mignum LOCAL frontend (CRA on :3000 → API :8010)
$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\frontend"
Write-Host "Frontend: http://localhost:3000"
Write-Host "API target: http://127.0.0.1:8010/api"
npm start
