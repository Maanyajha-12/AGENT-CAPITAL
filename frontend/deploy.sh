#!/bin/bash

# AGENT CAPITAL Frontend Deployment Script
# This script deploys the frontend to Vercel

echo "🚀 AGENT CAPITAL Frontend Deployment Script"
echo "==========================================="
echo ""

# Check if in frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "✅ Detected frontend directory"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deploying to Vercel..."
    echo "Note: Make sure you have logged in to Vercel using 'vercel login'"
    echo ""
    
    # Deploy to Vercel
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo "🎉 Your AGENT CAPITAL frontend is now live!"
    else
        echo "❌ Deployment failed. Please check the error messages above."
        exit 1
    fi
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
