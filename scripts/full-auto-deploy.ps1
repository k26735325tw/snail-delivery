Write-Host "=== FULL AUTO DEPLOY START ==="

if (Test-Path ".next") {
  Remove-Item -Recurse -Force .next
}

npm install
if ($LASTEXITCODE -ne 0) { exit 1 }

npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

git add .
git commit -m "chore: auto deploy update"
git push origin main

Write-Host "=== PUSH DONE, WAIT VERCEL DEPLOY ==="
Start-Sleep -Seconds 20

try {
  $res = Invoke-WebRequest -Uri "https://snail-delivery-z3bs.vercel.app" -UseBasicParsing
  Write-Host "Production status:" $res.StatusCode
} catch {
  Write-Host "Production check failed"
  exit 1
}

Write-Host "=== FULL AUTO DEPLOY END ==="

