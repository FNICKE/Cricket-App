@echo off
title Cricket Fan Live Web Portal (Port 3000)
cd /d "%~dp0apps\web"
echo Starting CricLive Fan Web Portal on http://localhost:3000...
npm.cmd run dev
pause
