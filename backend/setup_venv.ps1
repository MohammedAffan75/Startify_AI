# Backend Virtual Environment Setup Script
# This script creates a Python 3.11 virtual environment and installs all dependencies

Write-Host "🔧 Setting up Backend Virtual Environment with Python 3.11..." -ForegroundColor Cyan
Write-Host ""

# Check if Python 3.11 is installed
Write-Host "Checking for Python 3.11..." -ForegroundColor Yellow
$python311 = py -3.11 --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python 3.11 not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.11 from: https://www.python.org/downloads/" -ForegroundColor Red
    Write-Host "After installation, run this script again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Found: $python311" -ForegroundColor Green
Write-Host ""

# Remove old virtual environment if exists
if (Test-Path "venv") {
    Write-Host "Removing old virtual environment..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force venv
    Write-Host "✅ Old venv removed" -ForegroundColor Green
    Write-Host ""
}

# Create new virtual environment with Python 3.11
Write-Host "Creating virtual environment with Python 3.11..." -ForegroundColor Yellow
py -3.11 -m venv venv
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create virtual environment!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Virtual environment created" -ForegroundColor Green
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "✅ Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Verify Python version
Write-Host "Verifying Python version in venv..." -ForegroundColor Yellow
$venvPython = python --version
Write-Host "✅ Using: $venvPython" -ForegroundColor Green
Write-Host ""

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet
Write-Host "✅ pip upgraded" -ForegroundColor Green
Write-Host ""

# Install requirements
Write-Host "Installing dependencies from requirements.txt..." -ForegroundColor Yellow
Write-Host "(This may take a few minutes...)" -ForegroundColor Gray
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Download spaCy model
Write-Host "Downloading spaCy language model..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to download spaCy model!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ spaCy model downloaded" -ForegroundColor Green
Write-Host ""

# Verify spaCy installation
Write-Host "Verifying spaCy installation..." -ForegroundColor Yellow
$spacyVersion = python -c "import spacy; print(spacy.__version__)"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ spaCy version: $spacyVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️  spaCy verification failed, but installation may still work" -ForegroundColor Yellow
}
Write-Host ""

# Success message
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the backend server:" -ForegroundColor Cyan
Write-Host "  1. Activate venv:  .\venv\Scripts\activate" -ForegroundColor White
Write-Host "  2. Run server:     python -m uvicorn app.main:app --reload --port 8000" -ForegroundColor White
Write-Host ""
Write-Host "Or simply run:  .\run_backend.ps1" -ForegroundColor Cyan
Write-Host ""
