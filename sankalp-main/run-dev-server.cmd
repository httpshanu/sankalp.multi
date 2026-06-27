@echo off
cd /d "%~dp0"
echo Starting SANKALP dev server at http://127.0.0.1:5173
echo Logs: %~dp0dev-server.log
npm.cmd run dev -- --host 127.0.0.1 --port 5173 > "%~dp0dev-server.log" 2>&1
