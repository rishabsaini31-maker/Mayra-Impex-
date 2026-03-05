# Home Banner Setup Guide

## Step 1: Create Supabase Storage Bucket

### 1.1 Access Supabase Dashboard

1. Go to https://supabase.com
2. Sign in to your account
3. Select your **Mayra Impex** project

### 1.2 Create the Home Banners Bucket

1. Click on **"Storage"** in the left sidebar
2. Click the **"New bucket"** button (top right)
3. Fill in the following details:
   - **Name**: `home-banners`
   - **Public bucket**: ✅ **Enable** (Check this box)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: Leave empty (or add: image/jpeg, image/jpg, image/png, image/webp)
4. Click **"Create bucket"**

### 1.3 Configure Bucket Policies (Optional - for extra security)

If you want only admins to upload but everyone to view:

1. Click on the **home-banners** bucket
2. Go to **"Policies"** tab
3. Add these policies:
   - **SELECT (View)**: Public access (enabled by default for public buckets)
   - **INSERT (Upload)**: Only authenticated admin users
   - **DELETE**: Only authenticated admin users

---

## Step 2: Test the Setup

### 2.1 Start Your Backend Server

```bash
cd mayra-impex-backend
npm start
```

### 2.2 Start Your Mobile App

```bash
cd mayra-impex-mobile
npm start
# or
npx expo start
```

### 2.3 Upload Banner Images

1. Open your mobile app
2. **Login as Admin**
3. Navigate to **"Slider Images"** from the admin sidebar
4. Click the **"+"** button (top right)
5. Select an image from your gallery
6. Repeat to add 4-8 images

### 2.4 View the Slider

1. Navigate to the **"Home"** tab (customer view)
2. Scroll down past the categories
3. You should see the **"Featured Offers"** slider with your images
4. The slider auto-scrolls every 3 seconds from right to left

---

## Features Included

✅ **Dedicated Storage Bucket**: `home-banners` bucket for slider images  
✅ **Admin Upload**: Upload images from Admin Dashboard → Slider Images  
✅ **Image Limit**: Maximum 8 slider images  
✅ **Auto-Scroll**: Carousel slides automatically every 3 seconds  
✅ **Dot Indicators**: Shows current slide position  
✅ **Delete Images**: Remove images from admin panel  
✅ **Display Order**: Images ordered by display_order field

---

## API Endpoints

| Method | Endpoint                    | Description                       | Auth Required |
| ------ | --------------------------- | --------------------------------- | ------------- |
| GET    | `/api/banners`              | Get active slider images (public) | No            |
| GET    | `/api/banners/admin/all`    | Get all slider images             | Admin         |
| POST   | `/api/banners/upload-image` | Upload banner image               | Admin         |
| POST   | `/api/banners`              | Create banner entry               | Admin         |
| PUT    | `/api/banners/:id`          | Update banner                     | Admin         |
| DELETE | `/api/banners/:id`          | Delete banner                     | Admin         |

---

## Troubleshooting

### Slider not showing on Home screen?

- **Check 1**: Did you run the `add-home-banners.sql` migration in Supabase?
- **Check 2**: Did you create the `home-banners` bucket in Supabase Storage?
- **Check 3**: Did you upload at least one image from the admin panel?
- **Check 4**: Are you on the "Home" tab (not "Products" tab)?

### Images not uploading?

- **Check**: Bucket is set to **public** in Supabase
- **Check**: Backend server is running
- **Check**: You're logged in as an admin user
- **Check**: Image file size is under 5MB

### API errors?

- **Check**: Backend server logs in terminal
- **Check**: Mobile app logs for error messages
- **Check**: Network connection between mobile app and backend

---

## Database Schema

```sql
CREATE TABLE home_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Code Updates Made

### Backend:

- ✅ `banner.controller.js` - Added `uploadBannerImage` method
- ✅ `banner.routes.js` - Added `/upload-image` route
- ✅ Uses `home-banners` bucket instead of `product-images`

### Mobile:

- ✅ `api/index.js` - Added `bannerAPI.uploadImage` method
- ✅ `AdminDashboardScreen.js` - Updated to use `bannerAPI.uploadImage`
- ✅ "Slider Images" menu already in admin sidebar (with images icon)

---

## Next Steps

1. ✅ Create `home-banners` bucket in Supabase (follow Step 1 above)
2. ✅ Start backend server
3. ✅ Start mobile app
4. ✅ Login as admin
5. ✅ Upload 4-8 images from "Slider Images" section
6. ✅ View the slider on the Home screen

**Your home banner slider is now ready to use!** 🎉
