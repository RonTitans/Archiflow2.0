@echo off
echo ========================
echo ArchiFlow Setup Script
echo ========================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Docker is running
echo.

REM Stop any existing containers
echo Stopping any existing containers...
docker-compose down

REM Start all services
echo Starting all services...
docker-compose up -d

echo.
echo Waiting for services to start (30 seconds)...
timeout /t 30 /nobreak >nul

REM Check service status
echo.
echo Checking service status...
docker-compose ps

echo.
echo ========================
echo Setup Complete!
echo ========================
echo.
echo Access URLs:
echo   Frontend:    http://localhost:3000
echo   Backend API: http://localhost:8000
echo   API Docs:    http://localhost:8000/swagger/
echo   pgAdmin:     http://localhost:5050
echo.
echo Login Credentials:
echo   App:     admin / admin123
echo   pgAdmin: admin@admin.com / admin
echo.
pause