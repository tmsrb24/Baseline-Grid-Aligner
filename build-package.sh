#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18.x or later."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm 9.x or later."
    exit 1
fi

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "Building the application..."
npm run build

# Package the application
echo "Packaging the application..."
npm run package

echo "Build and packaging complete. Check the 'dist' directory for the distributable packages."
