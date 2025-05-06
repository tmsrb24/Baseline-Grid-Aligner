import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  FolderOpen as OpenIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { DocumentData } from '../../types/document';

interface AppHeaderProps {
  title: string;
  toggleSidebar: () => void;
  document: DocumentData | null;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, toggleSidebar, document }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    isDarkMode, 
    setIsDarkMode, 
    language, 
    setLanguage, 
    openDocument 
  } = useAppContext();
  
  // Language menu
  const [languageMenuAnchor, setLanguageMenuAnchor] = React.useState<null | HTMLElement>(null);
  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };
  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };
  
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    handleLanguageMenuClose();
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Save to localStorage for theme.ts to use
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };
  
  // Navigate to settings
  const goToSettings = () => {
    navigate('/settings');
  };
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Sidebar toggle */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* App title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
          {document && (
            <Typography variant="subtitle1" component="span" sx={{ ml: 2, opacity: 0.8 }}>
              - {document.name}
            </Typography>
          )}
        </Typography>
        
        {/* Open document button */}
        <Button
          color="inherit"
          startIcon={<OpenIcon />}
          onClick={openDocument}
          sx={{ mr: 2 }}
        >
          {t('document.open')}
        </Button>
        
        {/* Language selector */}
        <Tooltip title={t('settings.language')}>
          <IconButton
            color="inherit"
            aria-label="change language"
            onClick={handleLanguageMenuOpen}
            sx={{ mr: 1 }}
          >
            <TranslateIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={handleLanguageMenuClose}
        >
          <MenuItem 
            onClick={() => changeLanguage('en')} 
            selected={language === 'en'}
          >
            English
          </MenuItem>
          <MenuItem 
            onClick={() => changeLanguage('cs')} 
            selected={language === 'cs'}
          >
            Čeština
          </MenuItem>
        </Menu>
        
        {/* Dark mode toggle */}
        <Tooltip title={isDarkMode ? t('settings.themes.light') : t('settings.themes.dark')}>
          <IconButton
            color="inherit"
            aria-label="toggle dark mode"
            onClick={toggleDarkMode}
            sx={{ mr: 1 }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        
        {/* Settings */}
        <Tooltip title={t('settings.title')}>
          <IconButton
            color="inherit"
            aria-label="settings"
            onClick={goToSettings}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
