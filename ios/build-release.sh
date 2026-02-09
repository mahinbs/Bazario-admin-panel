#!/bin/bash

# Build release IPA for iOS
echo "Building release IPA for iOS..."

# Check if required environment variables are set
if [ -z "$DEVELOPMENT_TEAM" ]; then
    echo "❌ DEVELOPMENT_TEAM environment variable not set!"
    echo "Please set your Apple Developer Team ID:"
    echo "export DEVELOPMENT_TEAM='YOUR_TEAM_ID'"
    exit 1
fi

if [ -z "$CODE_SIGN_IDENTITY" ]; then
    echo "❌ CODE_SIGN_IDENTITY environment variable not set!"
    echo "Please set your code signing identity:"
    echo "export CODE_SIGN_IDENTITY='iPhone Distribution: Your Name'"
    exit 1
fi

# Navigate to iOS directory
cd ios/App

# Clean previous builds
xcodebuild clean -workspace App.xcworkspace -scheme App

# Build release IPA
xcodebuild archive \
  -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath build/App.xcarchive \
  -destination generic/platform=iOS \
  DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" \
  CODE_SIGN_IDENTITY="$CODE_SIGN_IDENTITY"

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Release IPA built successfully!"
    echo "📱 Archive location: ios/App/build/App.xcarchive"
    echo "📊 Archive size: $(du -h build/App.xcarchive | cut -f1)"
    echo ""
    echo "🎉 Your IPA is ready for App Store submission!"
    echo "📋 Make sure to:"
    echo "   - Test the IPA thoroughly"
    echo "   - Update version and build number in Xcode if needed"
    echo "   - Create an App Store listing"
else
    echo "❌ Release IPA build failed!"
    exit 1
fi
