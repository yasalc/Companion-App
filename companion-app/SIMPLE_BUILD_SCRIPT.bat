@echo off
echo ============================================
echo    Zoom Connection Plugin Builder
echo    Building Windows installer...
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart your computer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js found
echo.

REM Navigate to companion-app directory
if not exist "package.json" (
    echo ERROR: This script must be run from the companion-app directory!
    echo.
    echo Please:
    echo 1. Navigate to the companion-app folder
    echo 2. Run this script from there
    echo.
    pause
    exit /b 1
)

echo ✓ Found package.json
echo.

REM Install dependencies
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo.
    echo Try running as Administrator:
    echo 1. Right-click Command Prompt
    echo 2. Select "Run as administrator"
    echo 3. Navigate back to this folder
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✓ Dependencies installed
echo.

REM Build the application
echo Building Windows installer...
echo This may take 2-5 minutes...
echo.
npm run build:win
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    echo.
    echo Common solutions:
    echo 1. Make sure you have at least 2GB free disk space
    echo 2. Close other programs and try again
    echo 3. Run as Administrator
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo    BUILD SUCCESSFUL! 🎉
echo ============================================
echo.

REM Show the output directory
if exist "dist" (
    echo Your installer is ready:
    echo.
    dir dist\*.exe /b 2>nul
    echo.
    echo Location: %CD%\dist\
    echo.
    echo Next steps:
    echo 1. Upload the .exe file to your website
    echo 2. Update the download URL in movkafqkx8.html
    echo 3. Test the download and installation
    echo.
) else (
    echo Warning: dist folder not found
    echo The build may have completed but files are in a different location
    echo.
)

echo Press any key to open the dist folder...
pause >nul
if exist "dist" (
    start "" "dist"
)