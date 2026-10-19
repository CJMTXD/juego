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
  python -c "import sys; sys.exit(0 if sys.version_info.major >= 3 else 1)" >nul 2>&1
  if not errorlevel 1 goto python
)
where node >nul 2>&1
if not errorlevel 1 goto node
echo Instala Python 3 desde python.org y activa Add Python to PATH, o instala Node.js LTS.
pause
exit /b 1
:pythonlauncher
py -3 server.py --open --lan
 goto end
:python
python server.py --open --lan
 goto end
:node
node server.cjs --open --lan
:end
if errorlevel 1 echo No se pudo iniciar. Comprueba si el puerto 8000 esta ocupado.
pause
