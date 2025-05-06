/**
 * Electron API interface
 */
interface ElectronAPI {
  // Settings
  getSettings: (key: string) => Promise<any>;
  setSettings: (key: string, value: any) => Promise<boolean>;
  
  // File operations
  openFile: () => Promise<string | null>;
  saveFile: (options: any) => Promise<string | null>;
  getDocumentPreview: (filePath: string) => Promise<{
    fileSize: number;
    dimensions: {
      width: number;
      height: number;
    };
    pages: number;
    previewData: {
      type: string;
      content: string;
    } | null;
  } | null>;
  
  // Event listeners
  on: (channel: string, callback: Function) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}

export {};
