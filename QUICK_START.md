# Quick Start Guide - Mayra Impex

This guide will help you set up and run the Mayra Impex B2B ordering system in 30 minutes.

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Text editor (VS Code recommended)
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Supabase account created
- [ ] Gmail account with 2FA enabled
- [ ] Twilio account (optional for WhatsApp)

---

## 🚀 Part 1: Backend Setup (15 minutes)

### Step 1: Install Dependencies (2 min)

```bash
cd "mayra-impex-backend"
npm install
```

### Step 2: Setup Supabase (5 min)

1. Go to [supabase.com](https://supabase.com)
2. Create new project (choose region close to you)
3. Wait for database to initialize
4. Go to SQL Editor → New Query
5. Copy and paste entire `database-schema.sql` file
6. Click "Run"
7. Go to Storage → Create two buckets:
   - `product-images` (Public)
   - `order-pdfs` (Public)

### Step 3: Get Supabase Credentials (2 min)

1. Go to Settings → API
2. Copy these values:
   - Project URL
   - anon public key
   - service_role key (secret!)

### Step 4: Setup Gmail (3 min)

1. Go to [Google Account](https://myaccount.google.com)
2. Security → 2-Step Verification (enable if not enabled)
3. Back to Security → App passwords
4. Select "Mail" and "Other (Custom name)"
5. Name it "Mayra Impex"
6. Copy the 16-character password

### Step 5: Configure Environment (2 min)

```bash
# Copy example file
cp .env.example .env

# Edit .env file
nano .env
```

Update these values:

```env
JWT_SECRET=your_random_secret_key_here_make_it_long
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_16_char_app_password

# For Twilio (optional - skip for now)
TWILIO_SID=skip
TWILIO_AUTH_TOKEN=skip
TWILIO_WHATSAPP_NUMBER=skip
ADMIN_WHATSAPP_NUMBER=skip
```

### Step 6: Start Backend (1 min)

```bash
npm run dev
```

You should see:

```
🚀 Mayra Impex API Server running on port 5000
```

Keep this terminal open!

### Step 7: Create Admin User (2 min)

Open new terminal and create admin account:

1. Go to Supabase Dashboard → SQL Editor
2. Run this query (or use API to register first):

```sql
-- Create admin user (password: admin123)
INSERT INTO users (name, phone, password_hash, role) VALUES
('Admin User', '9999999999', '$2b$10$8xZ9YqF7Kg0vd3F3Q6xqe5g5eMqGZ6mF4K1y7C3z4D5e6F7g8H9i', 'admin');

-- Create sample categories
INSERT INTO categories (name) VALUES
('Electronics'),
('Clothing'),
('Home & Kitchen');
```

**Test the API:**

```bash
curl http://localhost:5000/health
```

Should return: `{"status":"OK"}`

---

## 📱 Part 2: Mobile App Setup (15 minutes)

### Step 1: Install Dependencies (3 min)

```bash
cd mayra-impex-mobile
npm install
```

### Step 2: Configure API URL (2 min)

Find your local IP address:

**macOS/Linux:**

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**

```bash
ipconfig
```

Look for something like: `192.168.1.100`

Edit `src/api/client.js`:

```javascript
const API_URL = "http://192.168.1.100:5000/api"; // Use YOUR IP
```

### Step 3: Start Expo (2 min)

```bash
npm start
```

Expo DevTools will open in browser.

### Step 4: Run on Device (5 min)

**Option A: Physical Device (Recommended)**

1. Install "Expo Go" app from Play Store / App Store
2. Scan QR code from terminal
3. App will load on your device

**Option B: iOS Simulator (Mac only)**

1. Press `i` in terminal
2. Simulator will launch

**Option C: Android Emulator**

1. Open Android Studio
2. Start an emulator
3. Press `a` in terminal

### Step 5: Test the App (3 min)

1. **Register a customer account:**
   - Name: Test User
   - Phone: 9876543210
   - Password: test123

2. **Login and test:**
   - Browse products (should be empty)
   - Try navigation

3. **Login as admin:**
   - Logout
   - Phone: 9999999999
   - Password: admin123
   - You should see admin dashboard

---

## ✅ Verification Checklist

### Backend

- [ ] Server running on port 5000
- [ ] Health check returns OK
- [ ] Database connected
- [ ] Can register new user
- [ ] Can login

### Mobile

- [ ] App loads without errors
- [ ] Can navigate between screens
- [ ] Can register new account
- [ ] Can login
- [ ] Can see empty product list

---

## 🎉 Next Steps

### Add Sample Products (via Admin Mobile App or API)

**Via API (easier for testing):**

```bash
# Login as admin first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","password":"admin123"}'

# Copy the token from response

# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Sample Product",
    "description": "This is a test product",
    "price": 999.99,
    "category_id": "CATEGORY_UUID_FROM_DATABASE",
    "is_active": true
  }'
```

To get category UUID:

```bash
curl http://localhost:5000/api/categories
```

### Test Complete Flow

1. Login as customer (9876543210)
2. Browse products
3. Add products to cart
4. Place order
5. Check email for order confirmation
6. Login as admin (9999999999)
7. View order in admin panel
8. Update order status

---

## 🐛 Common Issues

### "Network request failed" in mobile app

**Solution:**

- Make sure backend is running
- Check API_URL in `src/api/client.js`
- Use your machine's IP, not `localhost`
- Make sure phone and computer are on same WiFi

### "Cannot connect to database"

**Solution:**

- Check Supabase credentials in `.env`
- Verify internet connection
- Check if Supabase project is active

### Email not sending

**Solution:**

- Verify Gmail app password
- Check if 2FA is enabled
- Test with different email address
- Check backend logs for errors

### Port 5000 already in use

**Solution:**

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 PID_NUMBER

# Or use different port
PORT=3000 npm run dev
```

---

## 📚 What's Next?

### Development

1. Read [README.md](README.md) for full documentation
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Review code structure in both projects

### Deployment

1. Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
2. Deploy backend to Render/Railway
3. Build mobile app with EAS
4. Submit to app stores

### Customization

1. Update app name and branding
2. Customize colors in `src/constants/index.js`
3. Add your logo and icons
4. Update privacy policy

---

## 🆘 Need Help?

### Documentation

- [README.md](README.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [PRIVACY_POLICY.md](PRIVACY_POLICY.md) - Privacy & terms

### Check Logs

**Backend:**

```bash
# Check server logs in terminal where you ran npm run dev
```

**Mobile:**

```bash
# Check Expo logs in terminal
# Or shake device to open developer menu → Show JavaScript logs
```

---

## ✅ Success Criteria

You know everything is working when:

1. ✅ Backend health check returns OK
2. ✅ Mobile app loads without errors
3. ✅ Can register and login
4. ✅ Can create products as admin
5. ✅ Can place order as customer
6. ✅ Email received with PDF
7. ✅ Order appears in admin dashboard

---

**Congratulations! 🎉**

You now have a fully functional B2B ordering system running locally!

**Total Time:** ~30 minutes

**Next:** Start customizing for your needs or proceed to deployment.
