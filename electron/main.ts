import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import Store from 'electron-store';

// Initialize the settings store
const store = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    backgroundColor: '#f5f5f5',
    title: 'Baseline Grid Aligner'
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
      
      // Open DevTools in development mode
      if (isDev) {
        mainWindow.webContents.openDevTools();
      }
    }
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createApplicationMenu();
}

// Create the application menu
function createApplicationMenu() {
  const isMac = process.platform === 'darwin';
  
  const template: any = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    
    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Document',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            openDocument();
          }
        },
        {
          label: 'Save Settings',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('save-settings');
            }
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    
    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        ...(isDev ? [{ role: 'toggleDevTools' }] : []),
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    
    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/baselinegridaligner/docs');
          }
        },
        {
          label: 'About',
          click: () => {
            showAboutDialog();
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Open document dialog
async function openDocument() {
  if (!mainWindow) return;
  
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Document',
    filters: [
      { name: 'Documents', extensions: ['pdf', 'docx', 'txt', 'indd'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });
  
  if (!canceled && filePaths.length > 0) {
    console.log('File selected:', filePaths[0]);
    mainWindow.webContents.send('file-opened', filePaths[0]);
    return filePaths[0];
  }
  
  return null;
}

// Show about dialog
function showAboutDialog() {
  dialog.showMessageBox({
    title: 'About Baseline Grid Aligner',
    message: 'Baseline Grid Aligner',
    detail: 'Version 1.0.0\n\nA powerful standalone application for typography alignment and grid management.\n\n© 2025 BaselineGridAligner Team',
    buttons: ['OK'],
    icon: path.join(__dirname, '../assets/icon.png')
  });
}

// IPC handlers
function setupIpcHandlers() {
  // Get settings
  ipcMain.handle('get-settings', (event, key) => {
    return store.get(key);
  });
  
  // Set settings
  ipcMain.handle('set-settings', (event, key, value) => {
    store.set(key, value);
    return true;
  });
  
  // Open file dialog
  ipcMain.handle('open-file-dialog', async () => {
    return await openDocument();
  });
  
  // Save file dialog
  ipcMain.handle('save-file-dialog', async (event, options) => {
    if (!mainWindow) return;
    
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: options.title || 'Save File',
      filters: options.filters || [{ name: 'All Files', extensions: ['*'] }],
      defaultPath: options.defaultPath || ''
    });
    
    if (!canceled && filePath) {
      return filePath;
    }
    
    return null;
  });
  
  // Get document preview
  ipcMain.handle('get-document-preview', async (event, filePath) => {
    try {
      if (!filePath) return null;
      
      const fs = require('fs');
      const path = require('path');
      const { promisify } = require('util');
      
      const readFileAsync = promisify(fs.readFile);
      const statAsync = promisify(fs.stat);
      
      // Get file stats
      const stats = await statAsync(filePath);
      const fileSize = Math.round(stats.size / 1024); // Convert to KB
      
      // Get file extension
      const fileExt = path.extname(filePath).toLowerCase().substring(1);
      
      // Handle different file types
      let previewData: any = null;
      let dimensions = { width: 0, height: 0 };
      let pages = 1;
      
      if (fileExt === 'txt') {
        // For text files, read the content directly
        const content = await readFileAsync(filePath, 'utf8');
        previewData = {
          type: 'text',
          content: content.substring(0, 5000) // Limit to first 5000 chars
        };
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
        // For images, read as base64
        const content = await readFileAsync(filePath);
        previewData = {
          type: 'image',
          content: `data:image/${fileExt === 'jpg' ? 'jpeg' : fileExt};base64,${content.toString('base64')}`
        };
        
        // TODO: Get image dimensions
      } else if (fileExt === 'pdf') {
        try {
          // For PDFs, use pdf-parse
          const pdfParse = require('pdf-parse');
          const dataBuffer = await readFileAsync(filePath);
          const pdfData = await pdfParse(dataBuffer);
          
          // Get page count and content
          pages = pdfData.numpages || 1;
          previewData = {
            type: 'text',
            content: pdfData.text.substring(0, 5000) // Limit to first 5000 chars
          };
        } catch (error) {
          console.error('Error parsing PDF:', error);
          previewData = {
            type: 'document',
            content: `Error parsing PDF: ${error.message}`
          };
        }
      } else if (fileExt === 'docx') {
        try {
          // For DOCX, use mammoth
          const mammoth = require('mammoth');
          const result = await mammoth.extractRawText({path: filePath});
          
          previewData = {
            type: 'text',
            content: result.value.substring(0, 5000) // Limit to first 5000 chars
          };
        } catch (error) {
          console.error('Error parsing DOCX:', error);
          previewData = {
            type: 'document',
            content: `Error parsing DOCX: ${error.message}`
          };
        }
      }
      
      return {
        fileSize,
        dimensions,
        pages,
        previewData
      };
    } catch (error) {
      console.error('Error getting document preview:', error);
      return null;
    }
  });
}

// App event handlers
app.on('ready', () => {
  createWindow();
  setupIpcHandlers();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
