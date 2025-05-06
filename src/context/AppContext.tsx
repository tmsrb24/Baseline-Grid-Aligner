import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DocumentData, 
  TextFrame, 
  AlignmentSettings, 
  GridSettings, 
  Preset 
} from '../types/document';

// Define the context type
interface AppContextType {
  // Document state
  currentDocument: DocumentData | null;
  setCurrentDocument: (document: DocumentData | null) => void;
  textFrames: TextFrame[];
  setTextFrames: (frames: TextFrame[]) => void;
  selectedFrameIds: string[];
  setSelectedFrameIds: (ids: string[]) => void;
  
  // Settings state
  alignmentSettings: AlignmentSettings;
  setAlignmentSettings: (settings: AlignmentSettings) => void;
  gridSettings: GridSettings;
  setGridSettings: (settings: GridSettings) => void;
  
  // Presets state
  presets: Preset[];
  setPresets: (presets: Preset[]) => void;
  activePresetId: string | null;
  setActivePresetId: (id: string | null) => void;
  
  // UI state
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  
  // Actions
  openDocument: () => Promise<void>;
  saveSettings: () => Promise<void>;
  applyAlignment: () => void;
  generatePreview: () => void;
  clearPreview: () => void;
  savePreset: (name: string, description: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  // Document state
  currentDocument: null,
  setCurrentDocument: () => {},
  textFrames: [],
  setTextFrames: () => {},
  selectedFrameIds: [],
  setSelectedFrameIds: () => {},
  
  // Settings state
  alignmentSettings: {
    type: 'tracking',
    highlightColor: 'rgba(128, 200, 255, 0.3)',
    wordSpacingFactor: 1.0,
    autoApply: true,
    showWarnings: true,
    previewEnabled: true
  },
  setAlignmentSettings: () => {},
  gridSettings: {
    baselineSize: 12,
    gridColor: 'rgba(0, 0, 255, 0.5)',
    gridOpacity: 0.5,
    showGrid: true,
    snapToGrid: true,
    gridOffset: 0,
    horizontalGrid: false,
    verticalGrid: false,
    horizontalSpacing: 20,
    verticalSpacing: 20
  },
  setGridSettings: () => {},
  
  // Presets state
  presets: [],
  setPresets: () => {},
  activePresetId: null,
  setActivePresetId: () => {},
  
  // UI state
  isDarkMode: false,
  setIsDarkMode: () => {},
  language: 'en',
  setLanguage: () => {},
  
  // Actions
  openDocument: async () => {},
  saveSettings: async () => {},
  applyAlignment: () => {},
  generatePreview: () => {},
  clearPreview: () => {},
  savePreset: () => {},
  loadPreset: () => {},
  deletePreset: () => {}
});

// Create the provider component
export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Document state
  const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null);
  const [textFrames, setTextFrames] = useState<TextFrame[]>([]);
  const [selectedFrameIds, setSelectedFrameIds] = useState<string[]>([]);
  
  // Settings state
  const [alignmentSettings, setAlignmentSettings] = useState<AlignmentSettings>({
    type: 'tracking',
    highlightColor: 'rgba(128, 200, 255, 0.3)',
    wordSpacingFactor: 1.0,
    autoApply: true,
    showWarnings: true,
    previewEnabled: true
  });
  
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    baselineSize: 12,
    gridColor: 'rgba(0, 0, 255, 0.5)',
    gridOpacity: 0.5,
    showGrid: true,
    snapToGrid: true,
    gridOffset: 0,
    horizontalGrid: false,
    verticalGrid: false,
    horizontalSpacing: 20,
    verticalSpacing: 20
  });
  
  // Presets state
  const [presets, setPresets] = useState<Preset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  
  // UI state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  
  // Load settings from electron-store on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load alignment settings
        const storedAlignmentSettings = await window.api.getSettings('alignmentSettings');
        if (storedAlignmentSettings) {
          setAlignmentSettings(storedAlignmentSettings);
        }
        
        // Load grid settings
        const storedGridSettings = await window.api.getSettings('gridSettings');
        if (storedGridSettings) {
          setGridSettings(storedGridSettings);
        }
        
        // Load presets
        const storedPresets = await window.api.getSettings('presets');
        if (storedPresets) {
          setPresets(storedPresets);
        }
        
        // Load UI settings
        const storedDarkMode = await window.api.getSettings('isDarkMode');
        if (storedDarkMode !== undefined) {
          setIsDarkMode(storedDarkMode);
        }
        
        const storedLanguage = await window.api.getSettings('language');
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
    
    // Listen for save settings event from main process
    window.api.on('save-settings', saveSettings);
    
    return () => {
      window.api.removeAllListeners('save-settings');
    };
  }, []);
  
  // Actions
  const openDocument = async () => {
    await window.api.openFile();
  };
  
  const saveSettings = async () => {
    try {
      await window.api.setSettings('alignmentSettings', alignmentSettings);
      await window.api.setSettings('gridSettings', gridSettings);
      await window.api.setSettings('presets', presets);
      await window.api.setSettings('isDarkMode', isDarkMode);
      await window.api.setSettings('language', language);
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  
  const applyAlignment = () => {
    // TODO: Implement alignment logic
    console.log('Applying alignment with settings:', alignmentSettings);
  };
  
  const generatePreview = () => {
    // TODO: Implement preview generation
    console.log('Generating preview with settings:', alignmentSettings);
  };
  
  const clearPreview = () => {
    // TODO: Implement preview clearing
    console.log('Clearing preview');
  };
  
  const savePreset = (name: string, description: string) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      description,
      dateCreated: new Date(),
      alignmentSettings: { ...alignmentSettings },
      gridSettings: { ...gridSettings }
    };
    
    setPresets([...presets, newPreset]);
    setActivePresetId(newPreset.id);
  };
  
  const loadPreset = (id: string) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setAlignmentSettings({ ...preset.alignmentSettings });
      setGridSettings({ ...preset.gridSettings });
      setActivePresetId(id);
    }
  };
  
  const deletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
    if (activePresetId === id) {
      setActivePresetId(null);
    }
  };
  
  // Provide the context value
  const contextValue: AppContextType = {
    // Document state
    currentDocument,
    setCurrentDocument,
    textFrames,
    setTextFrames,
    selectedFrameIds,
    setSelectedFrameIds,
    
    // Settings state
    alignmentSettings,
    setAlignmentSettings,
    gridSettings,
    setGridSettings,
    
    // Presets state
    presets,
    setPresets,
    activePresetId,
    setActivePresetId,
    
    // UI state
    isDarkMode,
    setIsDarkMode,
    language,
    setLanguage,
    
    // Actions
    openDocument,
    saveSettings,
    applyAlignment,
    generatePreview,
    clearPreview,
    savePreset,
    loadPreset,
    deletePreset
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);

export default AppContext;
