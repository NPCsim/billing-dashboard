@echo off
echo Installing Backend Dependencies...
cd backend
call npm install
echo.
echo Installing Frontend Dependencies...
cd ../frontend
call npm install --legacy-peer-deps
echo.
echo Dependencies installed successfully!
echo You can now run the app.
pause
