#!/bin/bash

# Build release APK for Android
echo "Building release APK..."

# Check if release keystore exists
if [ ! -f "app/release.keystore" ]; then
    echo "❌ Release keystore not found!"
    echo "Please run ./generate-release-keystore.sh first to create a release keystore."
    exit 1
fi

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Release APK built successfully!"
    echo "📱 APK location: app/build/outputs/apk/release/app-release.apk"
    echo "📊 APK size: $(du -h app/build/outputs/apk/release/app-release.apk | cut -f1)"
    echo ""
    echo "🎉 Your APK is ready for Play Store submission!"
    echo "📋 Make sure to:"
    echo "   - Test the APK thoroughly"
    echo "   - Update version code and name in build.gradle if needed"
    echo "   - Create a Play Store listing"
else
    echo "❌ Release APK build failed!"
    exit 1
fi
