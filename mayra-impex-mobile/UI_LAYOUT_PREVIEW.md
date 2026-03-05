# Modern UI Layout Preview

## Visual Layout Guide

### 📱 Home Screen Layout

```
┌─────────────────────────────────────────┐
│  ☰   Mayra Impex                    🔍  │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  Gift Product Catalog                   │ ← Section Title
│                                         │
│  ╭─────────╮  ╭─────────╮  ╭─────────╮│
│  │  🎁     │  │  🎁     │  │  🎁     ││ ← Product Cards
│  │         │  │         │  │         ││   (Horizontal Scroll)
│  │Premium  │  │Luxury   │  │Elegant  ││
│  │₹1,299   │  │₹2,499   │  │₹1,899   ││
│  ╰─────────╯  ╰─────────╯  ╰─────────╯│
│                                         │
│  Premium Features                       │ ← Section Title
│                                         │
│  ● Carbon tone      ● Lack aromatics   │ ← Feature Tags
│  ● Click nut comm   ● Soft blush       │
│                                         │
│  Order Tracking                         │ ← Section Title
│                                         │
│  ┌──────────┐      ┌──────────┐       │
│  │  🎁      │      │  🎁      │       │ ← Order Cards
│  │ Last From│      │ Last From│       │
│  │ Gift Box │      │ Hamper   │       │
│  └──────────┘      └──────────┘       │
│                                         │
│  ╔═════════════════════════════════╗  │
│  ║  Special Offers                 ║  │ ← Promo Banner
│  ║  Get up to 30% off on bulk     ║  │
│  ║  orders                         ║  │
│  ╚═════════════════════════════════╝  │
│                                         │
├─────────────────────────────────────────┤
│  🏠     🔍      ➕       🔔      👤   │ ← Bottom Nav
│ Home  Search   Add   Notif   Profile   │
└─────────────────────────────────────────┘
```

### 🎨 Component Anatomy

#### Product Card (Rounded, with Shadow)

```
    ╭─────────────────╮
    │                 │
    │      🎁         │  ← Product Image
    │                 │     (Rounded corners)
    │                 │
    ├─────────────────┤
    │ Premium Gift    │  ← Product Name
    │ Box             │     (Max 2 lines)
    │                 │
    │ ₹1,299          │  ← Price (Bold)
    ╰─────────────────╯
     └─ Shadow (Soft Peach)
```

#### Feature Tag

```
    ┌────────────────────┐
    │ ● Carbon tone      │  ← Colored Dot + Text
    └────────────────────┘
     └─ Rounded Pill Shape
        Soft Background
```

#### Order Card

```
    ┌───────────────┐
    │   🎁          │  ← Order Image
    │               │     (Soft background)
    ├───────────────┤
    │ Last From     │  ← Subtitle
    │ Gift Box      │  ← Order Name
    └───────────────┘
```

#### Bottom Navigation

```
┌─────────────────────────────────────────┐
│   🏠      🔍      🌟       🔔      👤  │
│  Home   Search   Add    Notif   Profile│
│                  ▲                      │
│                  │                      │
│            Floating Button              │
│            (Elevated)                   │
└─────────────────────────────────────────┘
```

### 🎯 Screen Flow

```
    ┌─────────┐
    │  Home   │ ────────────┐
    └─────────┘             │
         │                  │
         ├─→ Search         │
         ├─→ Add            │
         ├─→ Notifications  │
         └─→ Profile        │
                            │
                            ▼
                    ┌───────────────┐
                    │  Bottom Nav   │
                    │  (Always On)  │
                    └───────────────┘
```

### 📐 Spacing & Sizing

#### Product Card Dimensions

```
Width: 42% of screen width
Height: Width * 1.1 (for image)
Border Radius: 24px
Margin Right: 16px
Shadow: Soft peach, 4px offset
```

#### Section Spacing

```
Top Margin: 24px
Bottom Margin: 8px
Horizontal Padding: 20px
Title Font Size: 22px
```

#### Feature Tags

```
Dot Size: 8px (circular)
Padding: 8px vertical, 16px horizontal
Border Radius: 20px
Margin: 12px right, 12px bottom
```

### 🎨 Color Visualization

#### Primary Palette

```
Primary (Peach):     #FF8C50  ████████
Primary Light:       #FFA573  ████████
Primary Dark:        #E5611F  ████████

Secondary (Orange):  #FFBE99  ████████
Background:          #FAFAFA  ████████
Card Background:     #FFFFFF  ████████

Light Peach:         #FFF5F0  ████████
Light Orange:        #FFE8DC  ████████

Text Dark:           #333333  ████████
Text Medium:         #666666  ████████
Text Light:          #999999  ████████
```

### 📱 Responsive Behavior

#### Horizontal Scroll (Product Cards)

```
┌─────────────────────────────────────────┐
│ ╭───╮  ╭───╮  ╭───╮  ╭───╮  ╭───╮ →   │
│ │ 1 │  │ 2 │  │ 3 │  │ 4 │  │ 5 │     │
│ ╰───╯  ╰───╯  ╰───╯  ╰───╯  ╰───╯     │
└─────────────────────────────────────────┘
         Swipe left/right →
```

#### Feature Tags (Wrap Layout)

```
┌─────────────────────────────────────────┐
│ ● Tag 1    ● Tag 2    ● Tag 3          │
│ ● Tag 4    ● Tag 5    ● Tag 6          │
│                                         │
└─────────────────────────────────────────┘
         Wraps to next line
```

### 🎭 Animation States

#### Card Press Animation

```
Normal State:
    ╭─────────╮
    │  🎁     │  Scale: 1.0
    ╰─────────╯  Opacity: 1.0

Pressed State:
   ╭──────╮
   │  🎁  │     Scale: 0.95
   ╰──────╯     Opacity: 1.0
```

#### Card Entrance Animation

```
1. Initial (Hidden)
   Opacity: 0
   TranslateY: +50px

2. Animating
   Opacity: 0 → 1
   TranslateY: +50px → 0

3. Final (Visible)
   Opacity: 1
   TranslateY: 0
```

### 📏 Component Hierarchy

```
HomeScreenModern
├── SafeAreaView
│   ├── Header
│   │   ├── MenuButton (☰)
│   │   ├── Title (Mayra Impex)
│   │   └── SearchButton (🔍)
│   │
│   └── ScrollView
│       ├── Section: Product Catalog
│       │   ├── Title
│       │   └── FlatList (Horizontal)
│       │       └── ProductCardModern (×N)
│       │
│       ├── Section: Premium Features
│       │   ├── Title
│       │   └── TagsContainer
│       │       └── TagItem (×N)
│       │
│       ├── Section: Order Tracking
│       │   ├── Title
│       │   └── OrdersContainer
│       │       └── OrderCard (×N)
│       │
│       └── PromoBanner
│
└── BottomNavigation
    ├── HomeTab
    ├── SearchTab
    ├── AddTab (Center, Elevated)
    ├── NotificationsTab
    └── ProfileTab
```

### 🎨 Shadow & Depth

```
Card Shadow (Elevation):

    ┌─────────┐
    │         │
    │  Card   │  ← Main card
    │         │
    └─────────┘
      ░░░░░░░    ← Soft shadow
       ░░░░░      (Peach tint)
        ░░░
         ░

Floating Button:

        ┌───┐
        │ + │    ← Button
        └───┘
        ░░░░░    ← Stronger shadow
        ░░░░
         ░░
```

### 📱 Device Compatibility

```
iPhone (Notched):
┌─────────────┐
│  │  ◯  │   │  ← Notch
├─────────────┤
│   Header    │
│             │
│  Content    │
│             │
└─────────────┘
    Bottom Safe Area

Android:
┌─────────────┐
│   Header    │
│             │
│  Content    │
│             │
└─────────────┘
    Navigation Buttons Area
```

### 🔄 State Transitions

#### Tab Navigation

```
Home (Active)      Search (Inactive)
  🏠 ●                 🔍 ○
Color: #FF8C50      Color: #999
```

#### Card States

```
Normal → Pressed → Released
  1.0      0.95       1.0   (Scale)

With spring animation:
  ━━━━●    ●━━━━    ━━━━●
  (Smooth bounce effect)
```

---

## 💡 Implementation Notes

### Z-Index / Layering

```
Layer 5: Floating Add Button (Highest)
Layer 4: Bottom Navigation Bar
Layer 3: Cards with Shadows
Layer 2: Background Elements
Layer 1: Base Background
```

### Touch Targets

```
Minimum Touch Target: 44×44 px
Button Size: 44×44 px
Card: Full width/height
Tags: Full pill area
```

### Accessibility

```
✅ Touch targets meet minimum size
✅ Text contrast ratios are good
✅ Icons have accessible labels
✅ Tap areas are generous
```

---

This visual guide helps you understand the layout and structure of the modern UI without needing actual screenshots!
