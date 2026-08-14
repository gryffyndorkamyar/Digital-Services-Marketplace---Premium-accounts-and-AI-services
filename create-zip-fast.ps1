# Fast zip creation - excludes large directories but includes frontend/build
Write-Host "Creating zip file (fast method)..." -ForegroundColor Green

# Remove old zip
if (Test-Path "mignum-deploy.zip") {
    Remove-Item "mignum-deploy.zip" -Force
}

# Exclude list
$exclude = @('node_modules', '__pycache__', '.git', 'venv', 'env', '.venv', 
             'staticfiles', 'media', '.vscode', '.idea', 'create-deploy-zip*.ps1', 
             'build.sh', 'mignum-deploy.zip', '.env')

# Get items to zip (exclude large dirs but keep frontend/build)
$items = Get-ChildItem -Path . -Force | Where-Object {
    $_.Name -notin $exclude -and $_.Name -notlike '*.pyc' -and $_.Name -notlike '*.log'
}

Write-Host "Found $($items.Count) root items to zip" -ForegroundColor Cyan

# Check if frontend/build exists
if (Test-Path "frontend\build") {
    Write-Host "frontend/build found - will be included" -ForegroundColor Green
} else {
    Write-Host "WARNING: frontend/build not found!" -ForegroundColor Red
}

# Create zip directly (this is faster)
Write-Host "Creating zip file (this may take a minute)..." -ForegroundColor Green
$items | Compress-Archive -DestinationPath "mignum-deploy.zip" -Force

# Check size
$zipSize = (Get-Item "mignum-deploy.zip").Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)
Write-Host "`nZip created: mignum-deploy.zip" -ForegroundColor Green
Write-Host "Size: $zipSizeMB MB" -ForegroundColor Cyan

if ($zipSizeMB -gt 254) {
    Write-Host "WARNING: Size exceeds 254 MB!" -ForegroundColor Red
} else {
    Write-Host "OK: Size is within limit!" -ForegroundColor Green
}

