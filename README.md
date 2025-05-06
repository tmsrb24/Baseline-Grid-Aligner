# Baseline Grid Aligner - Standalone Application

A powerful standalone application for typography alignment and grid management, based on the InDesign plugin "Baseline Grid Aligner".

![Baseline Grid Aligner](https://github.com/tmsrb24/Baseline-Grid-Aligner/raw/main/screenshot.png)

## Features

### Core Features (from original plugin)
- **Multiple Alignment Types**: Tracking, Baseline, Word Spacing, or Combined
- **Live Preview**: See changes in real-time before applying
- **Customizable Parameters**: Alignment settings, highlight colors, word spacing factors
- **Settings Management**: Save and load your preferred configurations

### New Advanced Features
- **Modern UI**: Intuitive, responsive interface with dark/light themes
- **Document-Wide Analysis**: Scan entire documents for grid alignment issues
- **Grid Visualization**: Interactive grid overlay with customizable appearance
- **Batch Processing**: Apply alignment to multiple text frames or documents
- **Smart Alignment**: AI-assisted suggestions for optimal alignment settings
- **Typography Statistics**: Detailed reports on text metrics and alignment quality
- **Presets System**: Save and share alignment configurations
- **Export/Import**: Share settings between team members
- **Undo/Redo**: Multi-level history for all operations
- **Keyboard Shortcuts**: Customizable shortcuts for power users
- **Multi-Language Support**: Interface available in multiple languages

## Technology Stack
- **Framework**: Electron for cross-platform compatibility
- **UI**: React with Material-UI for modern interface components
- **Core Logic**: TypeScript for type safety and maintainability
- **Text Processing**: Custom text rendering engine with OpenType support
- **Performance**: WebAssembly modules for computationally intensive operations

## Installation

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later

### Development Setup
1. Clone the repository:
   ```
   git clone https://github.com/baselinegridaligner/app.git
   cd app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Building for Production
To build the application for production:

```
npm run build
```

To package the application for distribution:

```
npm run package
```

This will create distributable packages for Windows, macOS, and Linux in the `dist` directory.

## Usage

### Opening Documents
1. Launch the application
2. Click "Open Document" in the header or use Ctrl+O
3. Select a document to open

### Aligning Text
1. Navigate to the "Alignment" tab
2. Choose an alignment type (Tracking, Baseline, Word Spacing, or Combined)
3. Adjust parameters as needed
4. Click "Apply" to apply the alignment

### Working with Grids
1. Navigate to the "Grid" tab
2. Customize grid settings (size, color, opacity)
3. Toggle grid visibility
4. Enable/disable snap to grid

### Using Presets
1. Navigate to the "Presets" tab
2. Create new presets or select existing ones
3. Apply presets to your documents

### Analyzing Typography
1. Navigate to the "Statistics" tab
2. View detailed statistics about your document
3. Identify and fix alignment issues

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Based on the InDesign plugin "Baseline Grid Aligner" by Tomáš Srb
- Inspired by typography best practices from Adobe and other industry leaders
