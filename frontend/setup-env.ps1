<#
setup-env.ps1

Prepares a local Node "virtual environment" for this project on Windows PowerShell.

What it does:
- reads the preferred Node version from `.nvmrc`
- if `nvm` (nvm-windows) is installed, attempts to install and use that Node version
- falls back to asking you to install Node manually if `nvm` is not available
- runs `npm install` to install dependencies

Run from the project root in PowerShell:
  .\setup-env.ps1
#>

try {
    $NodeVersion = (Get-Content -Raw .nvmrc).Trim()
} catch {
    $NodeVersion = $null
}

if (-not $NodeVersion) {
    Write-Host "WARNING: .nvmrc not found or empty. We'll proceed but you should install Node 18+ manually if needed."
} else {
    Write-Host "Preferred Node version from .nvmrc: $NodeVersion"
}

# Try to find nvm (nvm-windows commonly exposes `nvm.exe` in LOCALAPPDATA or `nvm` command if user installed it differently)
$nvmCmd = Get-Command nvm -ErrorAction SilentlyContinue
if (-not $nvmCmd) {
    $nvmPathGuess = Join-Path $env:LOCALAPPDATA "nvm\nvm.exe"
    if (Test-Path $nvmPathGuess) { $nvmCmd = $nvmPathGuess }
}

if ($nvmCmd) {
    Write-Host "nvm found. Attempting to install/use Node $NodeVersion via nvm..."
    try {
        & $nvmCmd install $NodeVersion 2>&1 | Write-Host
        & $nvmCmd use $NodeVersion 2>&1 | Write-Host
    } catch {
        Write-Host "nvm command failed; you may need to run nvm manually or open a new PowerShell instance."
    }
} else {
    Write-Host "nvm not found. If you don't have a local Node install matching the version in .nvmrc, please install Node or nvm-windows: https://github.com/coreybutler/nvm-windows"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found after attempting to set Node. Ensure Node is installed and on PATH."
    exit 1
}

Write-Host "Installing project dependencies (this may take a minute)..."
npm install

Write-Host "All done. To start the dev server run: npm run dev"
Write-Host "If you need a preview of the production build: npm run build && npx vite preview"

exit 0
