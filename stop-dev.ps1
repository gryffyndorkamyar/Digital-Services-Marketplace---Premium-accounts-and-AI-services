# Stop local Mignum dev servers on :8010 (Django) and :3000 (CRA)

$ErrorActionPreference = "SilentlyContinue"

function Stop-Port($port) {
  $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($c in $conns) {
    $pid = $c.OwningProcess
    if ($pid -and $pid -ne 0) {
      Write-Host "Stopping PID $pid on port $port ..."
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
  }
}

Stop-Port 8010
Stop-Port 3000

Write-Host "Done. (Postgres container 'mignum-postgres' is left running.)"
