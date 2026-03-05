#!/bin/bash

# Mayra Impex - Setup Verification Script
# This script checks if your environment is properly configured

echo "🔍 Mayra Impex Setup Verification"
echo "=================================="
echo ""

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null
then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check if backend dependencies are installed
echo ""
echo "Checking backend dependencies..."
if [ -d "mayra-impex-backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Backend dependencies not installed"
    echo "   Run: cd mayra-impex-backend && npm install"
fi

# Check if mobile dependencies are installed
echo ""
echo "Checking mobile dependencies..."
if [ -d "mayra-impex-mobile/node_modules" ]; then
    echo "✅ Mobile dependencies installed"
else
    echo "⚠️  Mobile dependencies not installed"
    echo "   Run: cd mayra-impex-mobile && npm install"
fi

# Check backend .env file
echo ""
echo "Checking backend configuration..."
if [ -f "mayra-impex-backend/.env" ]; then
    echo "✅ Backend .env file exists"
    
    # Check for required variables
    if grep -q "JWT_SECRET=" mayra-impex-backend/.env; then
        echo "✅ JWT_SECRET configured"
    else
        echo "❌ JWT_SECRET not found in .env"
    fi
    
    if grep -q "SUPABASE_URL=" mayra-impex-backend/.env; then
        echo "✅ SUPABASE_URL configured"
    else
        echo "❌ SUPABASE_URL not found in .env"
    fi
    
    if grep -q "EMAIL_USER=" mayra-impex-backend/.env; then
        echo "✅ EMAIL_USER configured"
    else
        echo "❌ EMAIL_USER not found in .env"
    fi
else
    echo "❌ Backend .env file not found"
    echo "   Run: cp mayra-impex-backend/.env.example mayra-impex-backend/.env"
fi

# Test backend server (if running)
echo ""
echo "Testing backend server..."
if curl -s http://localhost:5000/health &> /dev/null; then
    echo "✅ Backend server is running on port 5000"
else
    echo "⚠️  Backend server not running"
    echo "   Start with: cd mayra-impex-backend && npm run dev"
fi

# Check Expo CLI
echo ""
echo "Checking Expo CLI..."
if command -v expo &> /dev/null
then
    EXPO_VERSION=$(expo --version)
    echo "✅ Expo CLI installed: $EXPO_VERSION"
else
    echo "⚠️  Expo CLI not found"
    echo "   Install with: npm install -g expo-cli"
fi

# Summary
echo ""
echo "=================================="
echo "📋 Setup Summary"
echo "=================================="
echo ""

if [ -f "mayra-impex-backend/.env" ] && [ -d "mayra-impex-backend/node_modules" ] && [ -d "mayra-impex-mobile/node_modules" ]; then
    echo "✅ Your environment looks good!"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: cd mayra-impex-backend && npm run dev"
    echo "2. Start mobile: cd mayra-impex-mobile && npm start"
    echo ""
    echo "📚 Documentation:"
    echo "- Quick start: QUICK_START.md"
    echo "- Full guide: README.md"
    echo "- API docs: API_DOCUMENTATION.md"
else
    echo "⚠️  Some setup steps are missing"
    echo ""
    echo "Follow these steps:"
    echo "1. Install backend dependencies:"
    echo "   cd mayra-impex-backend && npm install"
    echo ""
    echo "2. Configure environment:"
    echo "   cp mayra-impex-backend/.env.example mayra-impex-backend/.env"
    echo "   Edit .env with your credentials"
    echo ""
    echo "3. Install mobile dependencies:"
    echo "   cd mayra-impex-mobile && npm install"
    echo ""
    echo "4. Read QUICK_START.md for detailed setup"
fi

echo ""
echo "=================================="
