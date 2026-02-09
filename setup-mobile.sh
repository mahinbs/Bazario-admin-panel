#!/bin/bash

# Bazario Admin Suite - Mobile Setup Script
# This script helps set up the mobile development environment

echo "🦋 Setting up Bazario Admin Suite for mobile development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Capacitor CLI globally
echo "🔧 Installing Capacitor CLI..."
npm install -g @capacitor/cli

# Build the project
echo "🏗️ Building the project..."
npm run build

# Check if iOS development tools are available
if command -v xcodebuild &> /dev/null; then
    echo "🍎 iOS development tools detected"
    echo "📱 Adding iOS platform..."
    npx cap add ios
    echo "✅ iOS platform added successfully"
else
    echo "⚠️ iOS development tools not found. Skipping iOS setup."
    echo "   To enable iOS development, install Xcode from the App Store."
fi

# Check if Android development tools are available
if command -v adb &> /dev/null; then
    echo "🤖 Android development tools detected"
    echo "📱 Adding Android platform..."
    npx cap add android
    echo "✅ Android platform added successfully"
else
    echo "⚠️ Android development tools not found. Skipping Android setup."
    echo "   To enable Android development, install Android Studio and Android SDK."
fi

# Sync the project
echo "🔄 Syncing project..."
npx cap sync

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. For web development: npm run dev"
echo "2. For iOS development: npm run cap:open:ios"
echo "3. For Android development: npm run cap:open:android"
echo ""
echo "📚 Check the README.md file for detailed instructions."
echo ""
echo "Happy coding! 🦋"
