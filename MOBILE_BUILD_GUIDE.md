# 🦋 Bazario Admin Suite - Mobile Build Guide

This guide will help you build and deploy the Bazario Admin Suite as a mobile app using Capacitor for both Android and iOS platforms.

## 📋 Prerequisites

### For Android Development:
- [Android Studio](https://developer.android.com/studio) (latest version)
- [Java Development Kit (JDK)](https://adoptium.net/) (version 11 or higher)
- [Android SDK](https://developer.android.com/sdk)
- [Gradle](https://gradle.org/) (usually bundled with Android Studio)

### For iOS Development:
- [Xcode](https://developer.apple.com/xcode/) (latest version)
- [CocoaPods](https://cocoapods.org/) (`sudo gem install cocoapods`)
- [Apple Developer Account](https://developer.apple.com/) (for App Store distribution)

### General Requirements:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Web App
```bash
npm run build
```

### 3. Sync with Mobile Platforms
```bash
npx cap sync
```

## 📱 Android Build Instructions

### Debug Build (Development)

1. **Generate Debug Keystore** (if not exists):
   ```bash
   # On Windows
   cd android
   generate-keystore.bat
   
   # On macOS/Linux
   cd android
   chmod +x generate-keystore.sh
   ./generate-keystore.sh
   ```

2. **Build Debug APK**:
   ```bash
   # On Windows
   cd android
   build-debug.bat
   
   # On macOS/Linux
   cd android
   chmod +x build-debug.sh
   ./build-debug.sh
   ```

3. **Install on Device**:
   ```bash
   npx cap run android
   ```

### Release Build (Production)

1. **Generate Release Keystore**:
   ```bash
   # On macOS/Linux
   cd android
   chmod +x generate-release-keystore.sh
   ./generate-release-keystore.sh
   ```
   
   Follow the prompts to create your release keystore. **Keep the credentials safe!**

2. **Set Environment Variables** (optional):
   ```bash
   export KEYSTORE_PASSWORD='your_keystore_password'
   export KEY_ALIAS='your_key_alias'
   export KEY_PASSWORD='your_key_password'
   ```

3. **Build Release APK**:
   ```bash
   # On Windows
   cd android
   build-release.bat
   
   # On macOS/Linux
   cd android
   chmod +x build-release.sh
   ./build-release.sh
   ```

4. **APK Location**: `android/app/build/outputs/apk/release/app-release.apk`

## 🍎 iOS Build Instructions

### Debug Build (Development)

1. **Open in Xcode**:
   ```bash
   npx cap open ios
   ```

2. **Build Debug IPA**:
   ```bash
   cd ios
   chmod +x build-debug.sh
   ./build-debug.sh
   ```

3. **Install on Device**:
   ```bash
   npx cap run ios
   ```

### Release Build (Production)

1. **Set Environment Variables**:
   ```bash
   export DEVELOPMENT_TEAM='YOUR_TEAM_ID'
   export CODE_SIGN_IDENTITY='iPhone Distribution: Your Name'
   ```

2. **Build Release IPA**:
   ```bash
   cd ios
   chmod +x build-release.sh
   ./build-release.sh
   ```

3. **Archive Location**: `ios/App/build/App.xcarchive`

## 🔧 Configuration

### Android Configuration

The Android build is configured in `android/app/build.gradle`:

- **Application ID**: `com.bazario.admin.suite`
- **Version Code**: 1
- **Version Name**: "1.0"
- **Min SDK**: 22
- **Target SDK**: 34

### iOS Configuration

The iOS build is configured in Xcode:

- **Bundle Identifier**: `com.bazario.admin.suite`
- **Version**: 1.0
- **Build**: 1

### Capacitor Configuration

The Capacitor configuration is in `capacitor.config.ts`:

```typescript
{
  appId: 'com.bazario.admin.suite',
  appName: 'Bazario Admin Suite',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffff",
      // ... more configuration
    }
  }
}
```

## 📦 Build Scripts

### NPM Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run cap:sync              # Sync with mobile platforms
npm run cap:open:android      # Open Android Studio
npm run cap:open:ios          # Open Xcode
npm run cap:run:android       # Run on Android device/emulator
npm run cap:run:ios           # Run on iOS device/simulator

# Mobile Builds
npm run android:debug         # Build debug APK
npm run android:release       # Build release APK
npm run ios:build             # Open iOS in Xcode
```

## 🎯 Mobile-Specific Features

### Responsive Design
- Mobile-optimized sidebar with touch interactions
- Responsive layouts for different screen sizes
- Touch-friendly buttons and form elements

### Native Features
- Haptic feedback for interactions
- Status bar customization
- Keyboard handling
- App state management
- Back button handling (Android)

### Performance Optimizations
- Code splitting for smaller bundle sizes
- Optimized images and assets
- Efficient rendering for mobile devices

## 🚨 Troubleshooting

### Common Android Issues

1. **Gradle Build Fails**:
   - Clean project: `cd android && ./gradlew clean`
   - Update Gradle version if needed
   - Check Java version compatibility

2. **Keystore Issues**:
   - Ensure keystore file exists in `android/app/`
   - Verify keystore passwords are correct
   - Check file permissions

3. **Device Not Recognized**:
   - Enable USB debugging on device
   - Install device drivers
   - Check ADB connection: `adb devices`

### Common iOS Issues

1. **Xcode Build Fails**:
   - Clean build folder in Xcode
   - Update CocoaPods: `pod install`
   - Check signing certificates

2. **Code Signing Issues**:
   - Verify Apple Developer account
   - Check provisioning profiles
   - Ensure certificates are valid

3. **Simulator Issues**:
   - Reset simulator content
   - Update Xcode to latest version
   - Check iOS deployment target

### General Issues

1. **Capacitor Sync Fails**:
   ```bash
   npx cap clean
   npm run build
   npx cap sync
   ```

2. **Plugin Issues**:
   ```bash
   npx cap update
   npx cap sync
   ```

## 📱 App Store Submission

### Google Play Store

1. **Create Developer Account**: [Google Play Console](https://play.google.com/console)
2. **Upload APK**: Use the release APK from `android/app/build/outputs/apk/release/`
3. **Create Listing**: Add app details, screenshots, and description
4. **Submit for Review**: Follow Google's guidelines

### Apple App Store

1. **Create Developer Account**: [Apple Developer](https://developer.apple.com/)
2. **Upload IPA**: Use Xcode or Application Loader
3. **Create Listing**: Add app details in App Store Connect
4. **Submit for Review**: Follow Apple's guidelines

## 🔒 Security Considerations

### Android
- Keep release keystore secure
- Use environment variables for sensitive data
- Enable ProGuard for code obfuscation
- Implement proper app signing

### iOS
- Secure code signing certificates
- Use App Transport Security
- Implement proper entitlements
- Follow Apple's security guidelines

## 📞 Support

For issues and questions:
1. Check the [Capacitor Documentation](https://capacitorjs.com/docs)
2. Review [Android Developer Guides](https://developer.android.com/guide)
3. Consult [Apple Developer Documentation](https://developer.apple.com/documentation)

## 📝 License

This project is part of the Bazario Admin Suite. Please refer to the main project license for details.
