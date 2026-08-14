# Script to create deployment zip for Liara
# This script excludes unnecessary files to keep zip size under 254MB

Write-Host "Creating deployment zip for Liara..." -ForegroundColor Green

# Remove existing zip if exists
if (Test-Path "mignum-deploy.zip") {
    Remove-Item "mignum-deploy.zip" -Force
    Write-Host "Removed existing zip file" -ForegroundColor Yellow
}

# Get all files and folders to exclude
$excludeItems = @(
    "node_modules",
    "__pycache__",
    ".git",
    "venv",
    "env",
    ".venv",
    "*.pyc",
    "*.log",
    "staticfiles",
    "media",
    ".vscode",
    ".idea",
    "*.swp",
    "*.swo",
    ".DS_Store",
    ".env",
    ".coverage",
    "htmlcov",
    ".pytest_cache",
    "*.bak",
    "*.tmp",
    ".cache",
    "create-deploy-zip.ps1",
    "build.sh"
)

# Get all items in current directory
$items = Get-ChildItem -Path . -Force

# Filter out excluded items
$itemsToZip = $items | Where-Object {
    $shouldExclude = $false
    foreach ($exclude in $excludeItems) {
        if ($_.Name -like $exclude -or $_.Name -eq $exclude) {
            $shouldExclude = $true
            break
        }
    }
    -not $shouldExclude
}

# Create temporary directory for zip
$tempDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }
Write-Host "Using temp directory: $tempDir" -ForegroundColor Cyan

# Copy files to temp directory
foreach ($item in $itemsToZip) {
    $destPath = Join-Path $tempDir $item.Name
    Copy-Item -Path $item.FullName -Destination $destPath -Recurse -Force -Exclude $excludeItems
    Write-Host "Copied: $($item.Name)" -ForegroundColor Gray
}

# Also exclude node_modules from frontend if it exists
if (Test-Path (Join-Path $tempDir "frontend\node_modules")) {
    Remove-Item (Join-Path $tempDir "frontend\node_modules") -Recurse -Force
    Write-Host "Removed frontend/node_modules" -ForegroundColor Yellow
}

# Also exclude __pycache__ directories recursively
Get-ChildItem -Path $tempDir -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Path $tempDir -Recurse -File -Filter "*.pyc" | Remove-Item -Force

# Calculate size before zipping
$sizeBefore = (Get-ChildItem -Path $tempDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
$sizeMB = [math]::Round($sizeBefore / 1MB, 2)
Write-Host "`nTotal size before compression: $sizeMB MB" -ForegroundColor Cyan

# Create zip file
Write-Host "`nCreating zip file..." -ForegroundColor Green
Compress-Archive -Path "$tempDir\*" -DestinationPath "mignum-deploy.zip" -Force

# Calculate final zip size
$zipSize = (Get-Item "mignum-deploy.zip").Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)
Write-Host "`nZip file created: mignum-deploy.zip" -ForegroundColor Green
Write-Host "Final zip size: $zipSizeMB MB" -ForegroundColor Cyan

if ($zipSizeMB -gt 254) {
    Write-Host "`nWARNING: Zip size ($zipSizeMB MB) exceeds 254 MB limit!" -ForegroundColor Red
    Write-Host "Consider removing more files or optimizing assets." -ForegroundColor Yellow
} else {
    Write-Host "`nOK: Zip size is within limit (254 MB)" -ForegroundColor Green
}

# Cleanup
Remove-Item $tempDir -Recurse -Force
Write-Host "`nCleanup completed." -ForegroundColor Gray

