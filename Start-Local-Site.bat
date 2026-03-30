@echo off
cd /d "%~dp0"

where python >nul 2>&1
if %ERRORLEVEL% equ 0 goto run

where py >nul 2>&1
if %ERRORLEVEL% equ 0 goto run_py

echo Python was not found. Install from https://www.python.org/downloads/
echo and enable "Add python.exe to PATH", then run this file again.
pause
exit /b 1

:run_py
set PY=py -3
goto serve

:run
set PY=python

:serve
echo.
echo Portfolio folder: %CD%
echo Serving at http://localhost:8080/
echo Keep this window open. Press Ctrl+C to stop.
echo.
start "" "http://localhost:8080/"
%PY% -m http.server 8080
exit /b %ERRORLEVEL%
