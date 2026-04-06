@echo off
echo Starting LogiEdge Servers...
echo.

cd backend
start cmd /k "title Backend Server && node models/dbInit.js && node index.js"

cd ../frontend
start cmd /k "title Frontend Server && npm run dev"

echo Both servers are starting up in separate windows!
echo Please check the "Frontend Server" window to see which port it opens on (it might be localhost:5173 or localhost:5174).
pause
