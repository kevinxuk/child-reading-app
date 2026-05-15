@echo off
chcp 65001 >nul
cd /d "C:\Users\MSI_NB\Documents\1mycode\child-reading-app"
start /B /MIN cmd /c "npx next dev > server.log 2>&1"
echo Server starting...
