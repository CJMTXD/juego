@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if not errorlevel 1 (
  py -3 --version >nul 2>&1
  if not errorlevel 1 goto pythonlauncher
)
where python >nul 2>&1
if not errorlevel 1 (
  python --version >nul 2>&1
  if not errorlevel 1 goto python
)
where node >nul 2>&1
if not errorlevel 1 goto node
echo Instala Python 3 desde python.org y activa Add Python to PATH, o instala Node.js LTS.
pause
exit /b 1
:pythonlauncher
start "" "http://127.0.0.1:8000"
py -3 -m http.server 8000 --bind 127.0.0.1
 goto end
:python
start "" "http://127.0.0.1:8000"
python -m http.server 8000 --bind 127.0.0.1
 goto end
:node
start "" "http://127.0.0.1:8000"
node server.cjs
:end
if errorlevel 1 echo No se pudo iniciar. Comprueba si el puerto 8000 esta ocupado.
pause
