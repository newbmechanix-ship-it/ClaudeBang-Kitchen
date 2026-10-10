@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js or download the portable Windows ZIP from Releases.
  pause
  exit /b 1
)
node server.mjs --open
pause
