# Bazario Admin Suite - Mobile App

A comprehensive admin dashboard for managing customers, stores, and delivery partners in your bazario ecommerce platform. Now available as a mobile app using Capacitor!

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with touch-friendly interfaces
- 🔐 **Authentication**: Secure login system with protected routes
- 📊 **Dashboard**: Real-time analytics and key metrics
- 👥 **User Management**: Manage customers and user accounts
- 🛍️ **Product Management**: Handle product catalog and inventory
- 📦 **Order Management**: Track and manage orders
- 🏪 **Store Management**: Manage store locations and details
- 🚚 **Rider Management**: Coordinate delivery partners
- 📈 **Analytics**: Comprehensive reporting and insights
- ⚙️ **Settings**: App configuration and preferences
- 🌙 **Dark Mode**: Beautiful dark theme support
- 📱 **PWA Support**: Install as a Progressive Web App
- 🔔 **Push Notifications**: Real-time updates and alerts

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Radix UI + Tailwind CSS
- **Mobile**: Capacitor 6
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- **Git**

### For iOS Development:
- **Xcode** (latest version)
- **CocoaPods**
- **iOS Simulator** or physical iOS device

### For Android Development:
- **Android Studio**
- **Android SDK**
- **Android Emulator** or physical Android device

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bazario-admin-suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Install Capacitor CLI globally**
   ```bash
   npm install -g @capacitor/cli
   ```

## Development

### Web Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:3000`

### Mobile Development

1. **Build the web app**
   ```bash
   npm run build
   ```

2. **Add mobile platforms**
   ```bash
   # Add iOS
   npm run cap:add
   npx cap add ios
   
   # Add Android
   npm run cap:add
   npx cap add android
   ```

3. **Sync the project**
   ```bash
   npm run cap:sync
   ```

4. **Open in native IDEs**
   ```bash
   # Open iOS project in Xcode
   npm run cap:open:ios
   
   # Open Android project in Android Studio
   npm run cap:open:android
   ```

5. **Run on devices/simulators**
   ```bash
   # Run on iOS Simulator
   npm run cap:run:ios
   
   # Run on Android Emulator
   npm run cap:run:android
   ```

## Build for Production

### Web Build
```bash
npm run build
```

### Mobile Builds

1. **iOS Build**
   ```bash
   npm run cap:build:ios
   ```

2. **Android Build**
   ```bash
   npm run cap:build:android
   ```

## Project Structure

```
bazario-admin-suite/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Radix UI components
│   │   ├── AdminLayout.tsx # Main layout component
│   │   └── AppSidebar.tsx  # Navigation sidebar
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication hook
│   │   └── useMobile.tsx   # Mobile-specific functionality
│   ├── pages/              # Page components
│   ├── lib/                # Utility functions and API
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── capacitor.config.ts     # Capacitor configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## Mobile-Specific Features

### Touch Interactions
- Haptic feedback on button presses
- Touch-friendly button sizes (minimum 44px)
- Smooth animations and transitions

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Safe area handling for notched devices

### Native Features
- Status bar customization
- Keyboard handling
- App state management
- Deep linking support

### PWA Features
- Offline support
- App installation prompts
- Background sync
- Push notifications (coming soon)

## Configuration

### Capacitor Configuration
The `capacitor.config.ts` file contains mobile-specific settings:

```typescript
{
  appId: 'com.bazario.admin',
  appName: 'Bazario Admin Suite',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff"
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff'
    }
  }
}
```

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=Bazario Admin Suite
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run cap:sync` - Sync web code to mobile projects
- `npm run cap:open:ios` - Open iOS project in Xcode
- `npm run cap:open:android` - Open Android project in Android Studio
- `npm run cap:run:ios` - Run on iOS Simulator
- `npm run cap:run:android` - Run on Android Emulator

## Troubleshooting

### Common Issues

1. **Capacitor sync fails**
   ```bash
   # Remove and re-add platforms
   npx cap remove ios
   npx cap remove android
   npx cap add ios
   npx cap add android
   npx cap sync
   ```

2. **iOS build issues**
   - Ensure Xcode is up to date
   - Check CocoaPods installation
   - Clean build folder in Xcode

3. **Android build issues**
   - Update Android SDK
   - Check Gradle version compatibility
   - Clean project in Android Studio

4. **PWA not working**
   - Ensure HTTPS is enabled
   - Check service worker registration
   - Verify manifest.json configuration

### Performance Tips

1. **Optimize images** for mobile devices
2. **Use lazy loading** for components
3. **Minimize bundle size** with code splitting
4. **Cache API responses** for offline support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Happy coding!**
