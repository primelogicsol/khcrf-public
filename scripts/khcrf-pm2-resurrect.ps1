$ErrorActionPreference = "Stop"

# 1. Set the correct PM2_HOME explicitly
$env:PM2_HOME = "C:\Users\Fayaz\.pm2"

# 2. Locate pm2.cmd explicitly
$pm2 = "C:\Users\Fayaz\AppData\Roaming\npm\pm2.cmd"

# 3. Run pm2 resurrect
Write-Host "Running PM2 resurrect..."
& $pm2 resurrect

# 4. Wait briefly
Start-Sleep -Seconds 10

# 5. Verify port 3000
$port3000 = netstat -ano | findstr :3000 | findstr LISTENING
if (-not $port3000) {
    throw "Port 3000 is not listening."
}
Write-Host "Port 3000 is listening."

# 6. Verify port 4000
$port4000 = netstat -ano | findstr :4000 | findstr LISTENING
if (-not $port4000) {
    throw "Port 4000 is not listening."
}
Write-Host "Port 4000 is listening."

# 7. Call readiness
Write-Host "Checking readiness endpoint..."
$response = Invoke-RestMethod -Uri "http://127.0.0.1:4000/health/readiness" -ErrorAction Stop

# 8. Fail if databaseName != hcrf_db_clean
if ($response.data.databaseName -ne 'hcrf_db_clean') {
    throw "Database mismatch! Expected hcrf_db_clean, got $($response.data.databaseName)"
}
Write-Host "Readiness check passed. Connected to hcrf_db_clean."
