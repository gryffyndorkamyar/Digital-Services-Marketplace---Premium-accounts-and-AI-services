# RunFlare deploy zip (pre-built frontend, includes runflare.json)
Write-Host "Creating RunFlare deployment zip..." -ForegroundColor Green

if (-not (Test-Path "frontend\build\index.html")) {
    Write-Host "ERROR: Run: cd frontend; npm run build" -ForegroundColor Red
    exit 1
}

$zipName = "ovyra-runflare.zip"
if (Test-Path $zipName) { Remove-Item $zipName -Force }

$excludeDirs = @(
    "node_modules", "__pycache__", ".git", "venv", "env", ".venv",
    "staticfiles", "media", ".vscode", ".idea", ".cursor", "agent-tools"
)

$tempDir = Join-Path $env:TEMP ("ovyra-runflare-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

Get-ChildItem -Path . -Force | Where-Object {
    $_.Name -notin $excludeDirs -and $_.Name -notlike "*.zip"
} | ForEach-Object {
    Copy-Item $_.FullName -Destination (Join-Path $tempDir $_.Name) -Recurse -Force
}

@(
    (Join-Path $tempDir "frontend\node_modules"),
    (Join-Path $tempDir ".env"),
    (Join-Path $tempDir ".env.local")
) | Where-Object { Test-Path $_ } | ForEach-Object { Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue }

Get-ChildItem -Path $tempDir -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue |
    Remove-Item -Recurse -Force

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipName -Force
Remove-Item $tempDir -Recurse -Force

$sizeMB = [math]::Round((Get-Item $zipName).Length / 1MB, 2)
Write-Host "Created $zipName ($sizeMB MB)" -ForegroundColor Cyan
Write-Host "Upload via RunFlare CLI or panel. Set env from deploy/runflare.env.example" -ForegroundColor Green
