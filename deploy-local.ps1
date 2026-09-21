<#
.SYNOPSIS
  Deploy HCR Foundation to VPS (no local Docker required)
.DESCRIPTION
  SCPs source code to VPS, builds/pushes Docker images there, then deploys.
  Requires: OpenSSH Client (built-in Windows 10/11)
#>
param()

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

# Cleanup any leftover temp files from previous runs
Remove-Item (Join-Path $env:TEMP "hcrf_deploy_key_*.pem") -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $env:TEMP "hcrf-source.tar.gz") -Force -ErrorAction SilentlyContinue

Write-Host "=== HCR Foundation - Deploy to VPS ===" -ForegroundColor Cyan

# --- 1. Load env vars ---
$envVpsPath = Join-Path $ProjectRoot ".env.vps"
if (-not (Test-Path $envVpsPath)) { Write-Error ".env.vps not found"; exit 1 }

$envContent = Get-Content $envVpsPath -Raw
Get-Content $envVpsPath | ForEach-Object {
    if ($_ -match '^([A-Za-z_][A-Za-z0-9_]*)=(.*)$' -and $matches[1] -ne "VPS_SSH_KEY") {
        Set-Item -Path "env:$($matches[1])" -Value $matches[2] -ErrorAction SilentlyContinue
    }
}

# --- 2. Extract SSH key ---
$sshKeyMatch = [regex]::Match($envContent, '(-----BEGIN[^\n]*-----[\s\S]*?-----END[^\n]*-----)')
if (-not $sshKeyMatch.Success) { Write-Error "SSH key not found in .env.vps"; exit 1 }
$cleanKey = ($sshKeyMatch.Groups[1].Value -split "`r`n|`n" | ForEach-Object { $_.TrimStart() }) -join "`n"
$sshKeyPath = Join-Path $env:TEMP "hcrf_deploy_key_$(Get-Random).pem"
[System.IO.File]::WriteAllText($sshKeyPath, $cleanKey, [System.Text.UTF8Encoding]::new($false))
& icacls $sshKeyPath /inheritance:r /grant:r "$($env:USERNAME):(R)" 2>$null

$vpsHost = $env:VPS_HOST; $vpsUser = $env:VPS_USERNAME
$dockerUser = $env:DOCKER_USERNAME; $dockerPass = $env:DOCKER_PASSWORD
$sshTarget = "${vpsUser}@${vpsHost}"
$sshOpts = @("-i", $sshKeyPath, "-o", "StrictHostKeyChecking=no")

Write-Host "Target: $sshTarget" -ForegroundColor Yellow

# --- 3. Create source archive (excluding node_modules, .next, .git) ---
Write-Host "`n=== Creating source archive ===" -ForegroundColor Cyan
$archiveName = "hcrf-source.tar.gz"
$archivePath = Join-Path $env:TEMP $archiveName

# Use tar (built-in Windows 10/11) to create archive excluding junk
& tar -czf $archivePath `
    --exclude=node_modules --exclude=.next --exclude=.git `
    -C $ProjectRoot `
    docker-compose.yml nginx frontend backend
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create archive"; exit 1 }

$archiveSize = (Get-Item $archivePath).Length / 1MB
Write-Host "Archive: $([math]::Round($archiveSize, 1)) MB" -ForegroundColor Green

# --- 4. SCP archive to VPS ---
Write-Host "`n=== Uploading to VPS ===" -ForegroundColor Cyan
& ssh @sshOpts $sshTarget "mkdir -p ~/app"
& scp @sshOpts $archivePath "${sshTarget}:~/app/${archiveName}"

# --- 5. SSH: extract, build, push, deploy ---
Write-Host "`n=== Building & deploying on VPS ===" -ForegroundColor Cyan

# Build args for frontend
$feBuildArgs = "--build-arg NEXT_PUBLIC_RAZORPAY_KEY_ID=$env:NEXT_PUBLIC_RAZORPAY_KEY_ID"
$feBuildArgs += " --build-arg NEXT_PUBLIC_API_URL=$env:NEXT_PUBLIC_API_URL"
$feBuildArgs += " --build-arg NEXT_PUBLIC_API_BASE=$env:NEXT_PUBLIC_API_BASE"
$feBuildArgs += " --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$env:NEXT_PUBLIC_GOOGLE_CLIENT_ID"

$remoteCmds = @"
set -e
cd ~/app

echo "=== Extracting source ==="
tar -xzf hcrf-source.tar.gz
rm hcrf-source.tar.gz

echo "=== Docker login ==="
echo "$dockerPass" | docker login -u "$dockerUser" --password-stdin

echo "=== Building frontend ==="
docker build $feBuildArgs -t ${dockerUser}/hcrf:frontend -f frontend/Dockerfile frontend/

echo "=== Building backend ==="
docker build -t ${dockerUser}/hcrf:backend -f backend/Dockerfile backend/

echo "=== Pushing images ==="
docker push ${dockerUser}/hcrf:frontend
docker push ${dockerUser}/hcrf:backend

echo "=== Writing .env ==="
cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://$env:POSTGRES_USER:$env:POSTGRES_PASSWORD@$env:POSTGRES_HOST:5432/$env:POSTGRES_DB
POSTGRES_USER=$env:POSTGRES_USER
POSTGRES_PASSWORD=$env:POSTGRES_PASSWORD
POSTGRES_DB=$env:POSTGRES_DB
RAZORPAY_KEY_SECRET=$env:RAZORPAY_KEY_SECRET
RAZORPAY_KEY_ID=$env:RAZORPAY_KEY_ID
CLOUDINARY_API_SECRET=$env:CLOUDINARY_API_SECRET
CLOUDINARY_API_KEY=$env:CLOUDINARY_API_KEY
CLOUDINARY_CLOUD_NAME=$env:CLOUDINARY_CLOUD_NAME
FRONTEND_URL=$env:FRONTEND_URL
NEXT_PUBLIC_API_BASE=$env:NEXT_PUBLIC_API_BASE
NEXT_PUBLIC_API_URL=$env:NEXT_PUBLIC_API_URL
NEXT_PUBLIC_RAZORPAY_KEY_ID=$env:NEXT_PUBLIC_RAZORPAY_KEY_ID
DOCKER_USERNAME=$env:DOCKER_USERNAME
RESEND_API_KEY=$env:RESEND_API_KEY
GOOGLE_CLIENT_ID=$env:GOOGLE_CLIENT_ID
ENVEOF

echo "=== Pulling & deploying ==="
docker compose pull
docker compose up -d --remove-orphans
docker system prune -f
docker compose restart nginx

echo "=== Done! ==="
"@

& ssh @sshOpts $sshTarget $remoteCmds

if ($LASTEXITCODE -ne 0) {
    Remove-Item $sshKeyPath -Force -ErrorAction SilentlyContinue
    Remove-Item $archivePath -Force -ErrorAction SilentlyContinue
    Write-Error "Deploy failed"; exit 1
}

# --- Cleanup ---
Remove-Item $sshKeyPath -Force -ErrorAction SilentlyContinue
Remove-Item $archivePath -Force -ErrorAction SilentlyContinue
Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
