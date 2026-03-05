# Mayra Impex Mobile App

Production-ready React Native mobile application for Mayra Impex B2B Wholesale Ordering System with modern premium UI.

## ✨ NEW: Modern Premium UI

A beautiful, modern gift shopping UI with soft pastel colors and smooth animations has been added!

**Quick Links:**

- 📖 [Quick Start Guide](./QUICK_START_MODERN_UI.md) - Get started in 5 minutes
- 📚 [Complete UI Guide](./MODERN_UI_GUIDE.md) - Detailed documentation
- 📊 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - What was built
- 🎨 [UI Layout Preview](./UI_LAYOUT_PREVIEW.md) - Visual guide

**Key Features:**

- 🎨 Soft pastel color palette (peach, light orange, white)
- 🔲 Rounded modern components (24px radius)
- ✨ Smooth animations and transitions
- 📱 Bottom navigation with floating center button
- 🎁 Premium gift shopping design
- 📦 Ready to use - fully documented

## 🚀 Tech Stack

- **Framework:** React Native (Expo)
- **Navigation:** React Navigation v6 + Bottom Tabs
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Storage:** Expo SecureStore (tokens) + minimal AsyncStorage metadata
- **Animations:** React Native Animated API

## 📁 Project Structure

```
mayra-impex-mobile/
├── src/
│   ├── api/              # API configuration and endpoints
│   │   ├── client.js     # Axios instance with interceptors
│   │   └── index.js      # API methods
│   ├── components/       # Reusable components
│   │   ├── Button.js
│   │   ├── TextInput.js
│   │   ├── ProductCard.js
│   │   ├── OrderStatusBadge.js
│   │   ├── LoadingSpinner.js
│   │   ├── Header.js                    # NEW: Modern header
│   │   ├── ProductCardModern.js         # NEW: Modern product card
│   │   ├── ProductCardAnimated.js       # NEW: Animated version
│   │   ├── TagItem.js                   # NEW: Feature tags
│   │   ├── OrderCard.js                 # NEW: Order tracking
│   │   ├── BottomNavigation.js          # NEW: Custom bottom nav
│   │   └── index.js                     # NEW: Component exports
│   ├── constants/        # App constants
│   │   └── index.js      # Colors, fonts, spacing
│   ├── data/             # NEW: Data and mocks
│   │   └── mockData.js   # NEW: Sample data for modern UI
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.js
│   │   └── ModernNavigator.js           # NEW: Modern UI navigation
│   ├── screens/          # Screen components
│   │   ├── auth/         # Authentication screens
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── customer/     # Customer screens
│   │   │   ├── HomeScreen.js
│   │   │   ├── ProductDetailScreen.js
│   │   │   ├── CartScreen.js
│   │   │   └── MyOrdersScreen.js
│   │   ├── admin/        # Admin screens
│   │   │   └── AdminDashboardScreen.js
│   │   ├── HomeScreenModern.js          # NEW: Modern home
│   │   ├── HomeScreenAnimated.js        # NEW: With animations
│   │   ├── SearchScreenModern.js        # NEW: Search
│   │   ├── AddScreenModern.js           # NEW: Add
│   │   ├── NotificationsScreenModern.js # NEW: Notifications
│   │   └── ProfileScreenModern.js       # NEW: Profile
│   ├── store/            # Zustand stores
│   │   ├── authStore.js  # Authentication state
│   │   └── cartStore.js  # Cart state
│   └── utils/            # Utility functions
│       └── authStorage.js
├── assets/               # Static assets
├── App.js               # App entry point
├── App.modern.js        # NEW: Modern UI entry point
├── tailwind.config.js   # NEW: Tailwind configuration
├── babel.config.js      # UPDATED: NativeWind support
├── app.json             # Expo configuration
├── package.json
├── eas.json             # EAS Build configuration
├── QUICK_START_MODERN_UI.md        # NEW: Quick start guide
├── MODERN_UI_GUIDE.md              # NEW: Complete UI guide
├── IMPLEMENTATION_SUMMARY.md       # NEW: What was built
└── UI_LAYOUT_PREVIEW.md            # NEW: Visual guide
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo account (for EAS Build)

### 1. Install Dependencies

```bash
cd mayra-impex-mobile
npm install
```

### 2. Configure API URL

Create a local environment file from `.env.example` and set:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_IP:5001/api
```

For local development:

- iOS Simulator: `http://localhost:5000/api`
- Android Emulator: `http://10.0.2.2:5000/api`
- Physical Device: `http://YOUR_LOCAL_IP:5000/api`

### 3. Start Development Server

```bash
npm start
```

This will start Expo DevTools. You can then:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

## 📱 Features

### Customer Features

1. **Authentication**
   - Register with phone number
   - Login with credentials
   - Persistent session

2. **Product Browsing**
   - View all active products
   - Search and filter products
   - View product details

3. **Shopping Cart**
   - Add products to cart
   - Update quantities
   - Remove items
   - View total price

4. **Order Management**
   - Place orders
   - View order history
   - Track order status

### Admin Features

1. **Dashboard**
   - View statistics
   - Total products
   - Total orders
   - Pending orders

2. **Product Management**
   - Add new products
   - Edit existing products
   - Delete products
   - Upload product images
   - Activate/Deactivate products

3. **Order Management**
   - View all orders
   - Update order status
   - View customer details

## 🎨 Design System

### Colors

- **Primary:** Navy Blue (#1e3a8a)
- **Success:** Green (#10b981)
- **Error:** Red (#ef4444)
- **Warning:** Amber (#f59e0b)

### Typography

- System fonts for optimal performance
- Font sizes: 12px to 32px
- Font weights: 400, 600, 700

## 🔐 Authentication Flow

1. User opens app
2. Check SecureStore for token
3. If token exists:
   - Validate token
   - Navigate to appropriate screen (Admin/Customer)
4. If no token:
   - Show Login/Register screen

## 📦 State Management

### Zustand Stores

#### Auth Store (`authStore.js`)

```javascript
{
   user: { id, name, email, role },
  token: 'jwt_token',
  isAuthenticated: boolean,
  isLoading: boolean
}
```

#### Cart Store (`cartStore.js`)

```javascript
{
  items: [
    {
      productId: "uuid",
      product: { id, name, price, image_url },
      quantity: number,
    },
  ];
}
```

## 🌐 API Integration

All API calls are centralized in `src/api/index.js`:

```javascript
import { authAPI, productAPI, orderAPI, categoryAPI } from "./api";

// Example usage
const products = await productAPI.getAll({ page: 1, limit: 20 });
```

## 🚀 Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build APK
eas build --platform android --profile production
```

### iOS

```bash
# Build iOS app
eas build --platform ios --profile production
```

### Submitting to Stores

```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

## 📄 Environment Configuration

Update `app.json` for your specific configuration:

```json
{
  "expo": {
    "name": "Mayra Impex",
    "slug": "mayra-impex",
    "version": "1.0.0",
    "android": {
      "package": "com.mayraimpex.app"
    },
    "ios": {
      "bundleIdentifier": "com.mayraimpex.app"
    }
  }
}
```

## 🧪 Testing

### Test Credentials

**Customer:**

- Phone: Any 10-digit number (register first)
- Password: Any password (min 6 characters)

**Admin:**

- Phone: 9999999999
- Password: admin123

## 📱 Screenshots

Add screenshots to `assets/screenshots/` directory.

## 🐛 Troubleshooting

### Common Issues

**1. Network Error**

- Check if backend server is running
- Verify API_URL in `src/api/client.js`
- For physical devices, use your machine's IP address

**2. Login Not Working**

- Clear AsyncStorage: `AsyncStorage.clear()`
- Check network connectivity
- Verify backend is responding

**3. Images Not Loading**

- Check Supabase Storage configuration
- Verify image URLs are public
- Check CORS settings on backend

## 📚 Additional Resources

- [React Native Documentation](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)

## 🔄 Updates

To update dependencies:

```bash
npm update
expo upgrade
```

## 📄 License

ISC

## 👨‍💻 Support

For issues and support, contact the development team.

---

**Note:** This app requires the Mayra Impex backend API to be running. Ensure the backend is deployed and accessible before testing the mobile app.
