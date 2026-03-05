#!/bin/bash

echo "🔄 Restarting Mayra Impex Backend & Mobile App..."
echo ""

# Stop existing processes
echo "1️⃣ Stopping existing backend server..."
pkill -f "node.*server.js" 2>/dev/null
sleep 1

echo "2️⃣ Stopping Expo/Metro bundler..."
pkill -f "expo start" 2>/dev/null
pkill -f "node.*metro" 2>/dev/null 
pkill -f "node.*8081" 2>/dev/null
sleep 2

echo ""
echo "✅ All stopped. Now starting fresh..."
echo ""

# Get the script's directory
SCRIPT_DIR="/Users/rishab/Desktop/SCS Project /Mayra Impex"

# Start backend in background
echo "3️⃣ Starting Backend Server..."
cd "$SCRIPT_DIR/mayra-impex-backend"
nohup node server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 2

# Check if backend started
if lsof -ti:5001 > /dev/null 2>&1; then
  echo "   ✅ Backend running on port 5001"
else
  echo "   ❌ Backend failed to start. Check backend.log"
  exit 1
fi

# Start Expo
echo ""
echo "4️⃣ Starting Expo (with cleared cache)..."
cd "$SCRIPT_DIR/mayra-impex-mobile"
npx expo start --clear

echo ""
echo "🎉 All services started!"
echo "📋 Backend logs: mayra-impex-backend/backend.log"
