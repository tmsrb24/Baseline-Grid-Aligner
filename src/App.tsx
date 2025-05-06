import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, CssBaseline } from '@mui/material';

// Layout components
import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';

// Pages
import DocumentPage from './pages/DocumentPage';
import AlignmentPage from './pages/AlignmentPage';
import GridPage from './pages/GridPage';
import StatisticsPage from './pages/StatisticsPage';
import PresetsPage from './pages/PresetsPage';
import SettingsPage from './pages/SettingsPage';

// Context
import { AppContextProvider } from './context/AppContext';

// Types
import { DocumentData } from './types/document';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null);

  // Listen for file open events from the main process
  useEffect(() => {
    const handleFileOpened = (filePath: string) => {
      console.log('File opened:', filePath);
      // TODO: Load document data
      setCurrentDocument({
        id: Date.now().toString(),
        path: filePath,
        name: filePath.split('/').pop() || '',
        type: filePath.split('.').pop() || '',
        size: 0,
        dimensions: { width: 0, height: 0 },
        pages: 0,
        dateOpened: new Date(),
      });
    };

    // Register event listener
    window.api.on('file-opened', handleFileOpened);

    // Clean up
    return () => {
      window.api.removeAllListeners('file-opened');
    };
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppContextProvider>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        
        {/* Header */}
        <AppHeader 
          title={t('app.title')} 
          toggleSidebar={toggleSidebar} 
          document={currentDocument}
        />
        
        {/* Sidebar */}
        <AppSidebar open={sidebarOpen} />
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8, // Below app bar
            overflow: 'auto',
            backgroundColor: 'background.default',
          }}
        >
          <Routes>
            <Route path="/" element={<DocumentPage />} />
            <Route path="/alignment" element={<AlignmentPage />} />
            <Route path="/grid" element={<GridPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/presets" element={<PresetsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
      </Box>
    </AppContextProvider>
  );
};

export default App;
