#!/bin/bash

# Build script for Linux packages

# Build the React app and compile TypeScript
npm run build

# Package the app for Linux
npx electron-builder build --linux -c.extraMetadata.main=dist/main.js --publish never

echo "Linux packages have been created in the 'release' directory."
