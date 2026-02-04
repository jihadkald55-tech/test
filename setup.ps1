# E-Court System - Quick Setup for Windows
# Run in PowerShell as Administrator

Write-Host "================================" -ForegroundColor Green
Write-Host "E-Court System - Setup & Launch" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed." -ForegroundColor Red
    exit 1
}

# Backend Setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Push-Location backend
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file" -ForegroundColor Green
}
npm install
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Pop-Location

# Frontend Setup
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Push-Location frontend
if (-not (Test-Path ".env.local")) {
    @"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✓ Created .env.local file" -ForegroundColor Green
}
npm install
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Pop-Location

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the system, open TWO PowerShell windows:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd backend ; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd frontend ; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then visit: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
