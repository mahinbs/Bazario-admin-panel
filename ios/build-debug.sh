#!/bin/bash

# Build debug IPA for iOS
echo "Building debug IPA for iOS..."

# Navigate to iOS directory
cd ios/App

# Clean previous builds
xcodebuild clean -workspace App.xcworkspace -scheme App

# Build debug IPA
xcodebuild archive \
  -workspace App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -archivePath build/App.xcarchive \
  -destination generic/platform=iOS

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Debug IPA built successfully!"
    echo "📱 Archive location: ios/App/build/App.xcarchive"
    echo "📊 Archive size: $(du -h build/App.xcarchive | cut -f1)"
else
    echo "❌ Debug IPA build failed!"
    exit 1
fi
