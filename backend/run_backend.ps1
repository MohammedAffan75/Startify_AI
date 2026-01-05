# Quick script to run the backend server
# Activates virtual environment and starts uvicorn

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if venv exists
if (-not (Test-Path "venv")) {
    Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run setup_venv.ps1 first:" -ForegroundColor Yellow
    Write-Host "  .\setup_venv.ps1" -ForegroundColor White
    exit 1
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Verify Python version
$pythonVersion = python --version
Write-Host "✅ Using: $pythonVersion" -ForegroundColor Green
Write-Host ""

# Start server
Write-Host "Starting uvicorn server on http://localhost:8000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
python -m uvicorn app.main:app --reload --port 8000
