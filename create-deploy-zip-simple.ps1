# Simple script to create deployment zip for Liara
Write-Host "Creating deployment zip for Liara..." -ForegroundColor Green

# Remove existing zip if exists
if (Test-Path "mignum-deploy.zip") {
    Remove-Item "mignum-deploy.zip" -Force
    Write-Host "Removed existing zip file" -ForegroundColor Yellow
}

# Create temp directory
$tempDir = Join-Path $env:TEMP "mignum-deploy-$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Write-Host "Using temp directory: $tempDir" -ForegroundColor Cyan

# Copy all files except excluded ones
$excludePatterns = @(
    "node_modules",
    "__pycache__",
    ".git",
    "venv",
    "env",
    ".venv",
    "staticfiles",
    "media",
    ".vscode",
    ".idea",
    ".env",
    "*.pyc",
    "*.log",
    "create-deploy-zip*.ps1",
    "build.sh",
    "mignum-deploy.zip"
)

# Copy root files and directories
Get-ChildItem -Path . -Force | Where-Object {
    $shouldExclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($_.Name -like $pattern -or $_.Name -eq $pattern) {
            $shouldExclude = $true
            break
        }
    }
    -not $shouldExclude
} | ForEach-Object {
    $dest = Join-Path $tempDir $_.Name
    Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
    Write-Host "Copied: $($_.Name)" -ForegroundColor Gray
}

# Remove node_modules from frontend if copied
$frontendNodeModules = Join-Path $tempDir "frontend\node_modules"
if (Test-Path $frontendNodeModules) {
    Remove-Item $frontendNodeModules -Recurse -Force
    Write-Host "Removed frontend/node_modules" -ForegroundColor Yellow
}

# Remove __pycache__ directories recursively
Get-ChildItem -Path $tempDir -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Path $tempDir -Recurse -File -Filter "*.pyc" | Remove-Item -Force

# Calculate size before zipping
$sizeBefore = (Get-ChildItem -Path $tempDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
$sizeMB = [math]::Round($sizeBefore / 1MB, 2)
Write-Host "`nTotal size before compression: $sizeMB MB" -ForegroundColor Cyan

# Create zip file
Write-Host "`nCreating zip file..." -ForegroundColor Green
$zipPath = Join-Path (Get-Location) "mignum-deploy.zip"
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Calculate final zip size
$zipSize = (Get-Item $zipPath).Length
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

