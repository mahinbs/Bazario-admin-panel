@echo off
REM Bazario Admin Suite - Mobile Setup Script (Windows)
REM This script helps set up the mobile development environment

echo 🦋 Setting up Bazario Admin Suite for mobile development...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 18 (
    echo ❌ Node.js version 18 or higher is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Install Capacitor CLI globally
echo 🔧 Installing Capacitor CLI...
call npm install -g @capacitor/cli

REM Build the project
echo 🏗️ Building the project...
call npm run build

REM Check if Android development tools are available
adb version >nul 2>&1
if %errorlevel% equ 0 (
    echo 🤖 Android development tools detected
    echo 📱 Adding Android platform...
    call npx cap add android
    echo ✅ Android platform added successfully
) else (
    echo ⚠️ Android development tools not found. Skipping Android setup.
    echo    To enable Android development, install Android Studio and Android SDK.
)

REM Sync the project
echo 🔄 Syncing project...
call npx cap sync

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. For web development: npm run dev
echo 2. For Android development: npm run cap:open:android
echo.
echo 📚 Check the README.md file for detailed instructions.
echo.
echo Happy coding! 🦋
pause
