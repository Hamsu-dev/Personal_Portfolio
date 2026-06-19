@echo off
cd /d "%~dp0"
echo.
start "" "http://127.0.0.1:8080/"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Serve-Local-Site.ps1"
exit /b %ERRORLEVEL%
