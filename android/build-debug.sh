#!/bin/bash

# Build debug APK for Android
echo "Building debug APK..."

# Clean previous builds
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Debug APK built successfully!"
    echo "📱 APK location: app/build/outputs/apk/debug/app-debug.apk"
    echo "📊 APK size: $(du -h app/build/outputs/apk/debug/app-debug.apk | cut -f1)"
else
    echo "❌ Debug APK build failed!"
    exit 1
fi
