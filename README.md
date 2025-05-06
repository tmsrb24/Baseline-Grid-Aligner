# Baseline Grid Aligner

A powerful standalone application for typography alignment and grid management.

## Features

- Baseline grid visualization and customization
- Typography alignment tools
- Document statistics and analysis
- Preset management for quick settings application
- Cross-platform support (Windows, macOS, Linux)
- Dark mode support
- Localization (English, Czech)

## Development

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/BaselineGridAligner.git
cd BaselineGridAligner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

This will start both the React development server and the Electron app concurrently.

## Building

The application can be built for Windows, macOS, and Linux. Each platform has its own build script.

### Building for Linux

To build for Linux (AppImage, DEB, RPM):

```bash
./build-linux.sh
```

### Building for Windows

To build for Windows (NSIS installer, portable):

```bash
./build-windows.sh
```

**Note:** Building for Windows on a non-Windows platform requires Wine to be installed and properly configured.

### Building for macOS

To build for macOS (DMG, ZIP):

```bash
./build-macos.sh
```

**Note:** Building for macOS is only fully supported on macOS systems. Building on other platforms may require additional configuration.

## Platform-Specific Requirements

### Windows Build Requirements

- On Windows: No additional requirements
- On Linux/macOS: Wine 1.6 or later

### macOS Build Requirements

- On macOS: XCode Command Line Tools
- On Linux/Windows: Not fully supported for building macOS packages

### Linux Build Requirements

- On Linux: No additional requirements
- On Windows/macOS: No additional requirements

## Packaging

The packaged applications will be created in the `release` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
