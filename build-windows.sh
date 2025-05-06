#!/bin/bash

# Build script for Windows packages

# Build the React app and compile TypeScript
npm run build

# Package the app for Windows
npx electron-builder build --win -c.extraMetadata.main=dist/main.js --publish never

echo "Windows packages have been created in the 'release' directory."
