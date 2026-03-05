# Deployment Guide - Mayra Impex

## 🚀 Backend Deployment

## 🔒 Nginx + Cloudflare Security Hardening (Production)

Use these production artifacts from the backend folder:

- Nginx hardened config: `mayra-impex-backend/deploy/nginx/mayra-impex-api.conf`
- Cloudflare checklist: `mayra-impex-backend/deploy/cloudflare-security-checklist.md`

The Cloudflare checklist now includes copy-paste WAF expressions and rate-limit thresholds.

### Apply Nginx Config

```bash
sudo cp mayra-impex-backend/deploy/nginx/mayra-impex-api.conf /etc/nginx/sites-available/mayra-impex-api.conf
sudo ln -s /etc/nginx/sites-available/mayra-impex-api.conf /etc/nginx/sites-enabled/mayra-impex-api.conf
sudo nginx -t
sudo systemctl reload nginx
```

### Cloudflare Required Baseline

1. SSL mode: **Full (strict)**
2. Enable: **Always Use HTTPS**, **TLS 1.3**, **Managed WAF**, **OWASP ruleset**
3. Add strict rate limits for:

- `/api/auth/login`
- `/api/auth/refresh-token`
- admin write API routes

4. Restrict origin firewall to Cloudflare IP ranges only

### Option 1: Deploy to Render

#### Step 1: Prepare Repository

```bash
cd mayra-impex-backend
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

#### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub/GitLab repository
4. Configure:
   - **Name**: mayra-impex-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter ($7/month)

#### Step 3: Add Environment Variables

In Render dashboard, add all variables from `.env`:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
EMAIL_USER=<your-email>
EMAIL_PASS=<app-password>
TWILIO_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=whatsapp:+919876543210
FRONTEND_URL=*
```

#### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

Your API will be available at: `https://mayra-impex-api.onrender.com`

---

### Option 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `mayra-impex-backend`
5. Add environment variables
6. Deploy automatically

---

### Option 3: Deploy to AWS EC2

#### Step 1: Launch EC2 Instance

1. Launch Ubuntu 22.04 LTS instance
2. Configure security group:
   - Allow SSH (22)
   - Allow HTTP (80)
   - Allow HTTPS (443)
   - Allow Custom TCP (5000) for testing

#### Step 2: Connect and Setup

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd mayra-impex-backend

# Install dependencies
npm install

# Create .env file
nano .env
# Paste your environment variables

# Start with PM2
pm2 start server.js --name mayra-impex-api
pm2 startup
pm2 save
```

#### Step 3: Setup Nginx (Optional)

```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/mayra-impex
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/mayra-impex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📱 Mobile App Deployment

### Prerequisites

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login
```

### Step 1: Configure Project

```bash
cd mayra-impex-mobile

# Initialize EAS
eas build:configure
```

This creates `eas.json` with build profiles.

### Step 2: Update API URL

Edit `src/api/client.js`:

```javascript
const API_URL = "https://mayra-impex-api.onrender.com/api";
```

### Step 3: Update app.json

```json
{
  "expo": {
    "name": "Mayra Impex",
    "slug": "mayra-impex",
    "version": "1.0.0",
    "android": {
      "package": "com.mayraimpex.app",
      "versionCode": 1
    },
    "ios": {
      "bundleIdentifier": "com.mayraimpex.app",
      "buildNumber": "1.0.0"
    }
  }
}
```

### Step 4: Build Android APK

```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

EAS will build in the cloud and provide download link.

### Step 5: Build iOS App

```bash
# Build for App Store
eas build --platform ios --profile production
```

Note: Requires Apple Developer account ($99/year).

### Step 6: Submit to Stores

#### Google Play Store

1. Create Google Play Console account ($25 one-time fee)
2. Create new app listing
3. Upload APK/AAB:

```bash
eas submit --platform android
```

4. Fill out store listing:
   - App name: Mayra Impex
   - Description
   - Screenshots
   - Privacy policy URL
   - Category: Business

#### Apple App Store

1. Create Apple Developer account ($99/year)
2. Create App Store Connect listing
3. Submit build:

```bash
eas submit --platform ios
```

4. Fill out store listing and submit for review

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Project

1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Choose region closest to users
4. Set strong database password

### Step 2: Run Database Schema

1. Go to SQL Editor
2. Create new query
3. Paste contents of `database-schema.sql`
4. Run query

### Step 3: Create Storage Buckets

1. Go to Storage
2. Create bucket: `product-images`
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

3. Create bucket: `order-pdfs`
   - Public: Yes (or No for private)
   - File size limit: 10MB
   - Allowed MIME types: application/pdf

### Step 4: Configure Storage Policies

For `product-images`:

```sql
-- Allow public read
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated upload
CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

### Step 5: Get API Keys

Go to Settings → API:

- Copy `Project URL`
- Copy `anon public` key
- Copy `service_role` key (keep secret!)

---

## 📧 Email Setup (Gmail)

### Step 1: Enable 2-Factor Authentication

1. Go to Google Account settings
2. Security → 2-Step Verification
3. Enable 2FA

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other"
3. Name it "Mayra Impex"
4. Copy the 16-character password

### Step 3: Add to Environment

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

---

## 📱 WhatsApp Setup (Twilio)

### Step 1: Create Twilio Account

1. Sign up at [Twilio.com](https://www.twilio.com/try-twilio)
2. Verify your phone number
3. Get free trial credits

### Step 2: Setup WhatsApp Sandbox (Testing)

1. Go to Messaging → Try it out → Send a WhatsApp message
2. Follow instructions to connect your WhatsApp
3. Send "join <sandbox-code>" to the Twilio number

### Step 3: Get Credentials

1. Go to Console Dashboard
2. Copy Account SID
3. Copy Auth Token

### Step 4: Add to Environment

```env
TWILIO_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=whatsapp:+919876543210
```

### Step 5: Production WhatsApp (Optional)

For production, request WhatsApp Business API access:

1. Go to Twilio Console
2. Request access for production WhatsApp
3. Approval takes 1-2 weeks

---

## ✅ Post-Deployment Checklist

### Backend

- [ ] API accessible via HTTPS
- [ ] Environment variables set
- [ ] Database connected
- [ ] Email sending working
- [ ] WhatsApp sending working
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Error logging setup

### Mobile

- [ ] API URL updated to production
- [ ] App builds successfully
- [ ] Testing on physical devices
- [ ] Icons and splash screens added
- [ ] Privacy policy included
- [ ] Store listings created

### Testing

- [ ] Test user registration
- [ ] Test user login
- [ ] Test product browsing
- [ ] Test adding to cart
- [ ] Test order placement
- [ ] Test email delivery
- [ ] Test WhatsApp delivery
- [ ] Test admin dashboard
- [ ] Test product management

---

## 🔧 Monitoring & Maintenance

### Backend Monitoring

**Using PM2 (if on EC2):**

```bash
pm2 status
pm2 logs mayra-impex-api
pm2 restart mayra-impex-api
```

**Using Render:**

- View logs in Render dashboard
- Set up alerts for downtime
- Monitor resource usage

### Database Monitoring

Use Supabase dashboard:

- Monitor query performance
- Check storage usage
- Review API logs

### Error Tracking

Consider adding:

- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage

---

## 🚨 Troubleshooting

### Common Issues

**API not accessible**

- Check firewall/security groups
- Verify service is running
- Check DNS configuration

**Database connection failed**

- Verify Supabase credentials
- Check RLS policies
- Ensure service role key is correct

**Email not sending**

- Verify app password
- Check 2FA enabled
- Test with different email

**WhatsApp not working**

- Verify Twilio credentials
- Check sandbox setup
- Ensure number format is correct

---

## 📞 Support Resources

- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app
- **Expo**: https://docs.expo.dev
- **Supabase**: https://supabase.com/docs
- **Twilio**: https://www.twilio.com/docs

---

**Deployment complete! 🎉**
