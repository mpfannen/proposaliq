@echo off
echo ================================
echo ProposalIQ Development Setup
echo ================================
echo.

REM Check if Docker is available
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Docker is not installed or not running
    echo [!] Please install Docker Desktop or use a different database option
    echo [!] See DATABASE_SETUP.md for alternatives
    echo.
    pause
    exit /b 1
)

echo [1/4] Starting PostgreSQL database with Docker...
docker-compose up -d

echo.
echo [2/4] Waiting for database to be ready...
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Checking database status...
docker ps | findstr proposaliq-postgres
if %ERRORLEVEL% NEQ 0 (
    echo [!] Database failed to start
    echo [!] Check: docker logs proposaliq-postgres
    pause
    exit /b 1
)

echo.
echo [4/4] Database is ready!
echo.
echo ================================
echo Next Steps:
echo ================================
echo 1. Open a new terminal and run:
echo    cd backend
echo    npm run dev
echo.
echo 2. Open another terminal and run:
echo    cd frontend
echo    npm start
echo.
echo 3. Visit http://localhost:3000
echo ================================
echo.
echo To stop the database later, run: docker-compose down
echo To view database logs, run: docker logs proposaliq-postgres
echo.
pause
