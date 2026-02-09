@echo off
echo Generating debug keystore...

REM Create debug keystore
keytool -genkey -v -keystore app\debug.keystore ^
  -storepass android ^
  -alias androiddebugkey ^
  -keypass android ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -dname "CN=Android Debug,O=Android,C=US"

echo Debug keystore generated successfully!
echo Location: android\app\debug.keystore
pause
