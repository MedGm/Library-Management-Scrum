#!/bin/bash

echo "🚀 Deploying Library Management System..."

# 1. Install & Build Client
echo "📦 Building Frontend..."
cd client
npm install
npm run build
cd ..

# 2. Install Server
echo "📦 Installing Backend..."
cd server
npm install
# Run seeds if needed (optional, maybe check env flag)
# npm run seed

# 3. Start Server
echo "✅ Starting Server on port 3000..."
npm start
