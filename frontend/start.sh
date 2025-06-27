#!/bin/bash

# Build check script for deployment
echo "🔍 Checking for build files..."

if [ ! -d "dist" ]; then
    echo "❌ No dist directory found"
    echo "🔨 Running build..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ No index.html found in dist"
    echo "🔨 Running build..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

echo "✅ Build files found"
echo "🚀 Starting server..."
node server.js
