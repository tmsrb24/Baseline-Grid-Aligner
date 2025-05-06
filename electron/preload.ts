import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Settings
    getSettings: (key: string) => ipcRenderer.invoke('get-settings', key),
    setSettings: (key: string, value: any) => ipcRenderer.invoke('set-settings', key, value),
    
    // File operations
    openFile: () => ipcRenderer.invoke('open-file-dialog'),
    saveFile: (options: any) => ipcRenderer.invoke('save-file-dialog', options),
    
    // Event listeners
    on: (channel: string, callback: Function) => {
      // Whitelist channels
      const validChannels = ['file-opened', 'save-settings'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (_, ...args) => callback(...args));
      }
    },
    
    // Remove event listeners
    removeAllListeners: (channel: string) => {
      const validChannels = ['file-opened', 'save-settings'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  }
);
