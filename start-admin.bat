@echo off
title Cricket Scorer Admin Panel (Port 5173)
cd /d "%~dp0apps\admin"
echo Starting Scorer Admin Panel on http://localhost:5173...
npm.cmd run dev
pause
