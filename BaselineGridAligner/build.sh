#!/bin/bash
# Build script for BaselineGridAligner plugin on macOS
# Requires Adobe InDesign SDK to be installed and INDESIGN_SDK_DIR environment variable to be set

if [ -z "$INDESIGN_SDK_DIR" ]; then
    echo "Error: INDESIGN_SDK_DIR environment variable is not set."
    echo "Please set it to the path of your InDesign SDK installation."
    echo "Example: export INDESIGN_SDK_DIR=/path/to/InDesignSDK"
    exit 1
fi

echo "Building BaselineGridAligner plugin for InDesign 2024..."

# Create build directory
mkdir -p build

# Set compiler flags
CXXFLAGS="-std=c++17 -O2 -fvisibility=hidden -fvisibility-inlines-hidden -DMAC_ENV -arch arm64 -arch x86_64 -fopenmp"
INCLUDES="-I$INDESIGN_SDK_DIR/source/public -I$INDESIGN_SDK_DIR/source/public/includes -Isource -Isource/includes"
LIBPATH="-L$INDESIGN_SDK_DIR/build/mac/release"
LIBS="-framework Cocoa -framework Carbon -framework CoreFoundation -lPublic"

# Compile source files
clang++ $CXXFLAGS $INCLUDES -c source/BaselineGridAligner.cpp -o build/BaselineGridAligner.o
clang++ $CXXFLAGS $INCLUDES -c source/BaselineGridAlignerSettings.cpp -o build/BaselineGridAlignerSettings.o
clang++ $CXXFLAGS $INCLUDES -c source/BaselineGridAlignerPanel.cpp -o build/BaselineGridAlignerPanel.o

# Link object files
clang++ -dynamiclib -o build/BaselineGridAligner.dylib build/BaselineGridAligner.o build/BaselineGridAlignerSettings.o build/BaselineGridAlignerPanel.o $LIBPATH $LIBS

# Create plugin directory structure
mkdir -p build/BaselineGridAligner.InDesignPlugin/Contents/MacOS
mkdir -p build/BaselineGridAligner.InDesignPlugin/Contents/Resources

# Create Info.plist
cat > build/BaselineGridAligner.InDesignPlugin/Contents/Info.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>English</string>
    <key>CFBundleExecutable</key>
    <string>BaselineGridAligner</string>
    <key>CFBundleIdentifier</key>
    <string>cz.baselinegrid.aligner</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>BaselineGridAligner</string>
    <key>CFBundlePackageType</key>
    <string>BNDL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CSResourcesFileMapped</key>
    <true/>
</dict>
</plist>
EOF

# Copy files to plugin directory
cp build/BaselineGridAligner.dylib build/BaselineGridAligner.InDesignPlugin/Contents/MacOS/BaselineGridAligner
cp resources/manifest.xml build/BaselineGridAligner.InDesignPlugin/Contents/Resources/

# Set permissions
chmod -R 755 build/BaselineGridAligner.InDesignPlugin

echo "Build completed successfully."
echo "Plugin is located at: $(pwd)/build/BaselineGridAligner.InDesignPlugin"
echo ""
echo "To install the plugin, copy the BaselineGridAligner.InDesignPlugin folder to:"
echo "/Applications/Adobe InDesign 2024/Plug-Ins"
