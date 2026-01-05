# Running this project (Windows PowerShell)

This project is a Vite + React app. Below are exact PowerShell commands and a small helper script that prepares a local Node environment and installs dependencies.

1) (Optional) Install Node version manager (recommended)
- Install nvm-windows: https://github.com/coreybutler/nvm-windows
- This allows switching Node versions easily (the project prefers Node 18 as declared in `.nvmrc`).

2) Use the included helper to prepare the environment and install deps
From the project root (where `package.json` is):

PowerShell commands (copy/paste):

```powershell
# If you want to use the helper script that will try to use nvm and then run npm install:
.\setup-env.ps1

# Alternatively, you can run the manual steps below:
# 1) Ensure Node 18+ is installed (or use nvm to install/use the version in .nvmrc)
node -v
npm -v

# 2) Install dependencies
npm install

# 3) Start the dev server (Vite)
npm run dev

# 4) Build for production (optional)
npm run build

# 5) Preview production build (optional)
npx vite preview
```

Notes and troubleshooting
- If `npm install` fails with resolution errors, remove `node_modules` and `package-lock.json` and try again:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  Remove-Item package-lock.json
  npm install
  ```
- If the app needs Supabase env values, set them before starting:
  ```powershell
  $env:VITE_SUPABASE_URL = "https://your-supabase-url"
  $env:VITE_SUPABASE_KEY = "your-anon-key"
  npm run dev
  ```

If you'd like, I can run `npm install` and `npm run dev` here and report the output. Say "Run install and dev" and I'll execute them and share results.
