@echo off
echo Copying universal APK to app-debug.apk...

if exist "app\build\outputs\apk\debug\app-universal-debug.apk" (
    copy "app\build\outputs\apk\debug\app-universal-debug.apk" "app\build\outputs\apk\debug\app-debug.apk"
    echo ✅ APK copied successfully!
) else (
    echo ❌ Universal APK not found. Please build the project first.
    exit /b 1
)

