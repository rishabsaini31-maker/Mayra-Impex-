# Modern UI Implementation Guide

## Overview

This document describes the new modern premium gift shopping UI built for Mayra Impex mobile app.

## Tech Stack

- React Native
- Expo
- React Navigation (Bottom Tabs)
- NativeWind (Tailwind CSS for React Native)
- React Query

## Design System

### Color Palette

```javascript
Primary: #FF8C50 (Peach Orange)
Secondary: #FFBE99 (Light Orange)
Background: #FAFAFA (Light Gray)
Card Background: #FFFFFF (White)
Light Peach: #FFF5F0
Light Orange: #FFE8DC
Text: #333333
Border: #F5F5F5
```

### Border Radius

- Small: 12px
- Medium: 20px
- Large: 24px
- Extra Large: 30px

### Spacing

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px

## Component Structure

### `/src/components/`

#### 1. **Header.js**

Header component with hamburger menu and search icon.

```javascript
<Header
  onMenuPress={() => console.log("Menu")}
  onSearchPress={() => console.log("Search")}
  title="Mayra Impex"
/>
```

**Props:**

- `onMenuPress`: Function - Callback for menu button
- `onSearchPress`: Function - Callback for search button
- `title`: String - App title (default: "Mayra Impex")

#### 2. **ProductCardModern.js**

Modern product card for horizontal scrolling.

```javascript
<ProductCardModern
  product={productObject}
  onPress={() => handleProductPress(product)}
/>
```

**Props:**

- `product`: Object - Product data with `id`, `name`, `price`, `image_url`
- `onPress`: Function - Callback when card is pressed

**Features:**

- Rounded corners (24px)
- Soft shadow
- Responsive width
- Image placeholder support

#### 3. **TagItem.js**

Feature tag component with colored dot indicator.

```javascript
<TagItem label="Premium Quality" color="#FF8C50" />
```

**Props:**

- `label`: String - Tag text
- `color`: String - Hex color for dot indicator

#### 4. **OrderCard.js**

Order tracking card component.

```javascript
<OrderCard order={orderObject} />
```

**Props:**

- `order`: Object - Order data with `id`, `name`, `image_url`

#### 5. **BottomNavigation.js**

Custom bottom navigation with center floating button.

**Features:**

- 5 tabs (Home, Search, Add, Notifications, Profile)
- Center button is elevated and circular
- Active state indicators
- Smooth transitions

### `/src/screens/`

#### **HomeScreenModern.js**

Main home screen with all sections.

**Sections:**

1. Header with menu and search
2. Product Catalog (horizontal scroll)
3. Premium Features (tags)
4. Order Tracking
5. Promotional Banner

**Key Features:**

- FlatList for product horizontal scroll
- Animated scroll support
- Responsive layout
- Safe area handling

#### **SearchScreenModern.js**

Search screen placeholder.

#### **AddScreenModern.js**

Add/Create screen placeholder.

#### **NotificationsScreenModern.js**

Notifications screen placeholder.

#### **ProfileScreenModern.js**

Profile screen placeholder.

### `/src/data/mockData.js`

Contains sample data for development:

- `SAMPLE_PRODUCTS`: Array of product objects
- `RECENT_ORDERS`: Array of order objects
- `FEATURE_TAGS`: Array of feature tag objects
- `CATEGORIES`: Array of category objects
- `MODERN_COLORS`: Color palette object

### `/src/navigation/ModernNavigator.js`

Navigation setup using React Navigation Bottom Tabs with custom tab bar.

## How to Use

### Option 1: Replace Existing Navigation

In `App.js`:

```javascript
import ModernNavigator from "./src/navigation/ModernNavigator";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModernNavigator />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
```

### Option 2: Add as a New Stack

Integrate into existing navigation:

```javascript
import HomeScreenModern from "./src/screens/HomeScreenModern";

// In your stack navigator
<Stack.Screen name="ModernHome" component={HomeScreenModern} />;
```

## Performance Optimizations

### 1. FlatList Usage

```javascript
<FlatList
  data={products}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <ProductCardModern product={item} />}
/>
```

### 2. Image Loading

- Uses placeholder images
- `resizeMode="cover"` for consistent aspect ratios
- Lazy loading support

### 3. Animated Scroll

```javascript
const scrollY = useRef(new Animated.Value(0)).current;

<ScrollView
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  )}
  scrollEventThrottle={16}
/>;
```

## Animations

### Button Press Animation

All touchable components use `activeOpacity={0.7}` for gentle feedback.

### Card Hover Effect

To add scale animation on press:

```javascript
import { Animated } from "react-native";

const scale = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};
```

## Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
      },
    },
  },
}
```

Or update inline styles in components.

### Adding More Products

Edit `/src/data/mockData.js`:

```javascript
export const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Your Product",
    price: 999,
    image_url: "https://...",
  },
  // ... more products
];
```

### Customizing Tags

Edit feature tags in `mockData.js`:

```javascript
export const FEATURE_TAGS = [
  { id: 1, label: "Your Tag", color: "#FF8C50" },
  // ... more tags
];
```

## Integration with Backend API

Replace mock data with API calls:

```javascript
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const HomeScreenModern = () => {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products'),
  });

  return (
    // Use products.data instead of SAMPLE_PRODUCTS
  );
};
```

## Testing

### Manual Testing Checklist

- [ ] Header menu and search buttons work
- [ ] Product cards scroll horizontally
- [ ] Product cards are tappable
- [ ] Feature tags display correctly
- [ ] Order tracking section renders
- [ ] Bottom navigation switches tabs
- [ ] Center add button works
- [ ] Safe area works on notched devices
- [ ] Works on both iOS and Android

### Testing on Device

```bash
# Start Expo
npm start

# Scan QR code with Expo Go app
```

## File Structure

```
src/
├── components/
│   ├── Header.js
│   ├── ProductCardModern.js
│   ├── TagItem.js
│   ├── OrderCard.js
│   └── BottomNavigation.js
├── screens/
│   ├── HomeScreenModern.js
│   ├── SearchScreenModern.js
│   ├── AddScreenModern.js
│   ├── NotificationsScreenModern.js
│   └── ProfileScreenModern.js
├── navigation/
│   └── ModernNavigator.js
└── data/
    └── mockData.js
```

## Troubleshooting

### Issue: NativeWind not working

**Solution:** Ensure tailwind.config.js and babel.config.js are properly configured.

### Issue: Images not loading

**Solution:** Check network permissions and use placeholder URLs for testing.

### Issue: Bottom navigation overlapping content

**Solution:** Add bottom padding to ScrollView content:

```javascript
<View style={{ height: 100 }} />
```

### Issue: Safe area issues on iOS

**Solution:** Ensure SafeAreaView is imported from 'react-native-safe-area-context'.

## Future Enhancements

1. **Add Animations**
   - Card entrance animations
   - Parallax scroll effects
   - Gesture-based interactions

2. **Add Dark Mode**
   - Color scheme support
   - Theme switcher

3. **Enhance Product Cards**
   - Wishlist button
   - Quick add to cart
   - Badge indicators

4. **Add Search Functionality**
   - Real-time search
   - Filter options
   - Search suggestions

5. **Improve Performance**
   - Image caching
   - Code splitting
   - Memoization

## Support

For issues or questions:

- Check existing documentation
- Review component props and examples
- Test with sample data first
- Check console for errors

---

**Last Updated:** March 2026
**Version:** 1.0.0
**Author:** Mayra Impex Development Team
