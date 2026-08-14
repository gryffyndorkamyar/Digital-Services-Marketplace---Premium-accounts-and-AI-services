# Create deployment zip for RunCloud (pre-built frontend, no node_modules)
Write-Host "Creating RunCloud deployment zip..." -ForegroundColor Green

if (-not (Test-Path "frontend\build\index.html")) {
    Write-Host "ERROR: frontend/build not found. Run: cd frontend; npm run build" -ForegroundColor Red
    exit 1
}

$zipName = "mignum-runcloud.zip"
if (Test-Path $zipName) { Remove-Item $zipName -Force }

$excludeDirs = @(
    "node_modules", "__pycache__", ".git", "venv", "env", ".venv",
    "staticfiles", "media", ".vscode", ".idea", ".cursor", "agent-transcripts"
)
$excludeFiles = @(".env", ".env.local", "*.pyc", "*.log", "mignum-deploy.zip", "mignum-runcloud.zip")

$tempDir = Join-Path $env:TEMP ("mignum-runcloud-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

Get-ChildItem -Path . -Force | Where-Object {
    $n = $_.Name
    $n -notin $excludeDirs -and $n -notlike "mignum-*.zip"
} | ForEach-Object {
    Copy-Item $_.FullName -Destination (Join-Path $tempDir $_.Name) -Recurse -Force
}

# Strip heavy / secret paths
@(
    (Join-Path $tempDir "frontend\node_modules"),
    (Join-Path $tempDir ".env"),
    (Join-Path $tempDir ".env.local")
) | Where-Object { Test-Path $_ } | ForEach-Object { Remove-Item $_ -Recurse -Force }

Get-ChildItem -Path $tempDir -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue |
    Remove-Item -Recurse -Force

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipName -Force
Remove-Item $tempDir -Recurse -Force

$sizeMB = [math]::Round((Get-Item $zipName).Length / 1MB, 2)
Write-Host "Created $zipName ($sizeMB MB)" -ForegroundColor Cyan
Write-Host "Upload to RunCloud web app directory and run: bash deploy/runcloud-deploy.sh" -ForegroundColor Green
