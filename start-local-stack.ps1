param()

$ErrorActionPreference = 'Stop'

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  KHCRF LOCAL DEVELOPMENT LAUNCHER" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Verify Ports
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port4000 = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "ERROR: Port 3000 is already in use." -ForegroundColor Red
    exit 1
}
if ($port4000) {
    Write-Host "ERROR: Port 4000 is already in use." -ForegroundColor Red
    exit 1
}

Write-Host "`nStarting Backend on port 4000..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd backend && npm run dev" -PassThru -NoNewWindow

Write-Host "Waiting 5 seconds for backend to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 5

Write-Host "Checking Backend Readiness (hcrf_db_clean expected)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:4000/health/readiness" -Method Get -ErrorAction Stop
    if ($response.databaseIdentityValid -eq $true) {
        Write-Host "Backend is READY. Connected to: $($response.databaseName)" -ForegroundColor Green
    } else {
        Write-Host "Backend reported readiness but failed identity check." -ForegroundColor Red
        Stop-Process -Id $backendProcess.Id -Force
        exit 1
    }
} catch {
    Write-Host "Failed to reach backend readiness endpoint." -ForegroundColor Red
    Stop-Process -Id $backendProcess.Id -Force
    exit 1
}

Write-Host "`nStarting Frontend on port 3000..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd frontend && npm run dev" -PassThru -NoNewWindow

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  STACK IS RUNNING." -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop both services." -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "`nShutting down stack..." -ForegroundColor Yellow
    taskkill /T /F /PID $backendProcess.Id | Out-Null
    taskkill /T /F /PID $frontendProcess.Id | Out-Null
    Write-Host "Stack stopped cleanly." -ForegroundColor Green
}
