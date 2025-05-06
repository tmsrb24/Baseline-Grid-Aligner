/// <reference types="react-scripts" />

interface Window {
  api: {
    // Settings
    getSettings: (key: string) => Promise<any>;
    setSettings: (key: string, value: any) => Promise<boolean>;
    
    // File operations
    openFile: () => Promise<void>;
    saveFile: (options: {
      title?: string;
      filters?: { name: string; extensions: string[] }[];
      defaultPath?: string;
    }) => Promise<string | null>;
    
    // Event listeners
    on: (channel: string, callback: Function) => void;
    removeAllListeners: (channel: string) => void;
  };
}
