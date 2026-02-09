@echo off
echo Building release APK...

REM Check if release keystore exists
if not exist "app\release.keystore" (
    echo ❌ Release keystore not found!
    echo Please create a release keystore first.
    echo You can use keytool to generate one:
    echo keytool -genkey -v -keystore app\release.keystore -alias your_alias -keyalg RSA -keysize 2048 -validity 10000
    pause
    exit /b 1
)

REM Clean previous builds
call gradlew clean

REM Build release APK
call gradlew assembleRelease

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Release APK built successfully!
    echo 📱 APK location: app\build\outputs\apk\release\app-release.apk
    echo.
    echo 🎉 Your APK is ready for Play Store submission!
    echo 📋 Make sure to:
    echo    - Test the APK thoroughly
    echo    - Update version code and name in build.gradle if needed
    echo    - Create a Play Store listing
) else (
    echo ❌ Release APK build failed!
    pause
    exit /b 1
)

pause
