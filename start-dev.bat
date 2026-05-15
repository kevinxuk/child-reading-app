@echo off
chcp 65001 >nul
cd /d "C:\Users\MSI_NB\Documents\1mycode\child-reading-app"
start "NextDev" cmd /c "npx next dev -p 3000 > server_output.log 2>&1"
echo Server starting...
