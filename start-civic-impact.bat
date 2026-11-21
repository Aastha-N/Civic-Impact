@echo off
title Civic Impact Launcher
echo ===================================================
echo        Civic Impact - Smart City Platform
echo ===================================================
echo.
echo Starting Backend Server on port 5000...
start "Civic Impact Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server on port 5173...
start "Civic Impact Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Launching Web Browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===================================================
echo Civic Impact is now running!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api
echo ===================================================
echo Keep the backend and frontend terminal windows open.
pause
