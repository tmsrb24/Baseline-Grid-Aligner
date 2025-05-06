#!/bin/bash

# Build script for macOS packages

# Build the React app and compile TypeScript
npm run build

# Package the app for macOS
npx electron-builder build --mac -c.extraMetadata.main=dist/main.js --publish never

echo "macOS packages have been created in the 'release' directory."
