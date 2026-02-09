@echo off
echo Building debug APK...

REM Clean previous builds
call gradlew clean

REM Build debug APK
call gradlew assembleDebug

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Debug APK built successfully!
    echo 📱 APK location: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ❌ Debug APK build failed!
    pause
    exit /b 1
)

pause
