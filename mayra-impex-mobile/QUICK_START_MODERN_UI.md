# Modern UI Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

The dependencies are already installed. If needed, run:

```bash
cd mayra-impex-mobile
npm install
```

### 2. Start the App

#### Using Modern UI

To test the new modern UI independently:

**Option A: Temporary Test**
In `App.js`, replace the import:

```javascript
// Replace this:
import Navigation from "./src/navigation/AppNavigator";

// With this:
import ModernNavigator from "./src/navigation/ModernNavigator";

// And update the component:
<ModernNavigator />;
```

**Option B: Side-by-side**
Use the provided `App.modern.js` file:

```bash
# Backup current App.js
mv App.js App.backup.js

# Use modern version
mv App.modern.js App.js

# Start app
npm start
```

### 3. Test on Device

```bash
npm start
# Scan QR code with Expo Go app
```

## 📱 What's Included

### New Components (in `/src/components/`)

✅ **Header.js** - App header with menu & search
✅ **ProductCardModern.js** - Modern product cards
✅ **ProductCardAnimated.js** - Animated product cards
✅ **TagItem.js** - Feature tags with colored dots
✅ **OrderCard.js** - Order tracking cards
✅ **BottomNavigation.js** - Custom bottom tabs with floating button
✅ **HeaderAnimated.js** - Animated header

### New Screens (in `/src/screens/`)

✅ **HomeScreenModern.js** - Main home screen
✅ **HomeScreenAnimated.js** - Home with animations
✅ **SearchScreenModern.js** - Search placeholder
✅ **AddScreenModern.js** - Add placeholder
✅ **NotificationsScreenModern.js** - Notifications placeholder
✅ **ProfileScreenModern.js** - Profile placeholder

### Configuration

✅ **tailwind.config.js** - Tailwind configuration
✅ **babel.config.js** - Updated with NativeWind plugin
✅ **mockData.js** - Sample data for testing

### Navigation

✅ **ModernNavigator.js** - Bottom tab navigation setup

## 🎨 UI Features

### Design Elements

- ✨ Soft pastel color palette (peach, light orange, white)
- 🔲 Rounded card components (20-24px radius)
- 🌟 Minimalist modern design
- 📏 Clean spacing and subtle shadows
- 🎭 Smooth UI transitions and animations

### Home Screen Sections

1. **Header** - Hamburger menu, title, search icon
2. **Product Catalog** - Horizontal scrolling cards
3. **Premium Features** - Feature tags with dots
4. **Order Tracking** - Recent order cards
5. **Promotional Banner** - Special offers section

### Bottom Navigation

- 🏠 Home
- 🔍 Search
- ➕ Add (center floating button)
- 🔔 Notifications
- 👤 Profile

## 🔧 Customization

### Change Colors

Edit styles in components or update `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#FF8C50', // Change to your color
  },
}
```

### Add Real Products

Replace mock data in `HomeScreenModern.js`:

```javascript
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

const { data: products } = useQuery({
  queryKey: ["products"],
  queryFn: () => api.get("/products"),
});
```

### Enable Animations

Replace `ProductCardModern` with `ProductCardAnimated`:

```javascript
import ProductCardAnimated from "../components/ProductCardAnimated";

// In render:
<ProductCardAnimated product={item} index={index} />;
```

Replace `Header` with `HeaderAnimated`:

```javascript
import HeaderAnimated from '../components/HeaderAnimated';

// In render:
<HeaderAnimated onMenuPress={...} onSearchPress={...} />
```

## 📂 Integration with Existing App

### Option 1: Replace Home Screen

In your customer navigation:

```javascript
import HomeScreenModern from "../screens/HomeScreenModern";

// Replace existing HomeScreen
<Tab.Screen name="Home" component={HomeScreenModern} />;
```

### Option 2: Add as New Tab

```javascript
<Tab.Screen
  name="Shop"
  component={HomeScreenModern}
  options={{ tabBarIcon: "gift" }}
/>
```

### Option 3: Use Components Separately

```javascript
// Import individual components
import { ProductCardModern, TagItem } from "../components";

// Use in your existing screens
<ProductCardModern product={product} onPress={handlePress} />;
```

## 🧪 Testing Checklist

- [ ] App starts without errors
- [ ] Header menu and search buttons respond
- [ ] Product cards scroll horizontally
- [ ] Product cards are tappable
- [ ] Feature tags display with colored dots
- [ ] Order tracking cards show
- [ ] Bottom navigation switches tabs
- [ ] Center add button is elevated
- [ ] Works on iOS and Android
- [ ] Safe area respected on notched devices

## 🐛 Troubleshooting

### "Cannot find module 'nativewind'"

```bash
npm install nativewind tailwindcss@3.3.2
```

### Images not loading

- Check internet connection
- Verify image URLs
- Use placeholder URLs for testing

### Bottom nav overlapping content

- Add bottom padding to ScrollView content
- Check safe area configuration

### Animations not working

- Ensure `useNativeDriver: true` for transform/opacity
- Check Animated API imports

## 📚 Documentation

For detailed documentation, see:

- **MODERN_UI_GUIDE.md** - Complete implementation guide
- **Component Documentation** - Props and usage examples
- **Integration Guide** - How to integrate with existing app

## 🎯 Next Steps

1. **Test the UI** - Run app and navigate through screens
2. **Customize Colors** - Match your brand colors
3. **Add Real Data** - Connect to backend API
4. **Implement Features** - Add product detail, cart, etc.
5. **Polish** - Add loading states, error handling
6. **Deploy** - Build and publish

## 💡 Tips

- Start with the non-animated version, add animations later
- Use mock data for initial development
- Test on both iOS and Android
- Use Expo Go for quick testing
- Commit frequently as you customize

## 📞 Support

Questions? Check:

- Component files for inline comments
- MODERN_UI_GUIDE.md for detailed docs
- React Native documentation
- Expo documentation

---

**Ready to start?** Run `npm start` and scan the QR code! 🚀
