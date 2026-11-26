@echo off
title Cricket Live API Server (Port 4000)
cd /d "%~dp0apps\api"
echo Starting Cricket Express REST + Socket.IO Server...
node --experimental-strip-types src/server.ts
pause
