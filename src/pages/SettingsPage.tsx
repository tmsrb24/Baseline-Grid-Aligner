import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Refresh as ResetIcon,
  Save as SaveIcon,
  Palette as ThemeIcon,
  Translate as LanguageIcon,
  Keyboard as KeyboardIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

// Mock keyboard shortcuts for demonstration
const mockKeyboardShortcuts = [
  { id: 'open', name: 'Open Document', shortcut: 'Ctrl+O' },
  { id: 'save', name: 'Save Settings', shortcut: 'Ctrl+S' },
  { id: 'apply', name: 'Apply Alignment', shortcut: 'Ctrl+A' },
  { id: 'preview', name: 'Toggle Preview', shortcut: 'Ctrl+P' },
  { id: 'grid', name: 'Toggle Grid', shortcut: 'Ctrl+G' },
  { id: 'reset', name: 'Reset Settings', shortcut: 'Ctrl+R' }
];

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    isDarkMode, 
    setIsDarkMode, 
    language, 
    setLanguage,
    saveSettings
  } = useAppContext();
  
  // State for reset confirmation
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  // State for shortcut editing
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);
  const [newShortcut, setNewShortcut] = useState('');
  const [shortcutDialogOpen, setShortcutDialogOpen] = useState(false);
  
  // Local state for settings
  const [localLanguage, setLocalLanguage] = useState(language);
  const [localTheme, setLocalTheme] = useState(isDarkMode ? 'dark' : 'light');
  
  // Apply settings changes
  const applySettings = () => {
    // Apply language change
    if (localLanguage !== language) {
      setLanguage(localLanguage);
      i18n.changeLanguage(localLanguage);
    }
    
    // Apply theme change
    const newDarkMode = localTheme === 'dark';
    if (newDarkMode !== isDarkMode) {
      setIsDarkMode(newDarkMode);
      localStorage.setItem('theme', localTheme);
    }
    
    // Save settings to storage
    saveSettings();
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    setLocalLanguage('en');
    setLocalTheme('light');
    setResetDialogOpen(false);
  };
  
  // Handle shortcut edit
  const handleEditShortcut = (id: string, currentShortcut: string) => {
    setEditingShortcut(id);
    setNewShortcut(currentShortcut);
    setShortcutDialogOpen(true);
  };
  
  const saveShortcut = () => {
    // In a real app, this would save the shortcut
    setShortcutDialogOpen(false);
    setEditingShortcut(null);
  };
  
  // Apply settings when component unmounts
  useEffect(() => {
    return () => {
      applySettings();
    };
  }, []);
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('settings.title')}
      </Typography>
      
      <Grid container spacing={3}>
        {/* General settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('settings.general')}
            </Typography>
            
            <Grid container spacing={2}>
              {/* Language selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="language-select-label">
                    {t('settings.language')}
                  </InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={localLanguage}
                    label={t('settings.language')}
                    onChange={(e) => setLocalLanguage(e.target.value as string)}
                    startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="cs">Čeština</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Theme selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="theme-select-label">
                    {t('settings.theme')}
                  </InputLabel>
                  <Select
                    labelId="theme-select-label"
                    value={localTheme}
                    label={t('settings.theme')}
                    onChange={(e) => setLocalTheme(e.target.value as string)}
                    startAdornment={<ThemeIcon sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="light">{t('settings.themes.light')}</MenuItem>
                    <MenuItem value="dark">{t('settings.themes.dark')}</MenuItem>
                    <MenuItem value="system">{t('settings.themes.system')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              {/* Action buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={applySettings}
                  >
                    {t('common.apply')}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<ResetIcon />}
                    onClick={() => setResetDialogOpen(true)}
                    color="warning"
                  >
                    {t('settings.resetSettings')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Keyboard shortcuts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('settings.keyboardShortcuts')}
              </Typography>
              
              <Tooltip title={t('settings.customizeShortcuts')}>
                <IconButton>
                  <KeyboardIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <List>
              {mockKeyboardShortcuts.map((shortcut) => (
                <ListItem key={shortcut.id} divider>
                  <ListItemText
                    primary={shortcut.name}
                    secondary={t('settings.shortcutAction')}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditShortcut(shortcut.id, shortcut.shortcut)}
                    >
                      {shortcut.shortcut}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* About section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('menu.about')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Baseline Grid Aligner v1.0.0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('app.description')}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2">
                  © 2025 BaselineGridAligner Team. All rights reserved.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Reset confirmation dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      >
        <DialogTitle>{t('settings.resetSettings')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('settings.confirmReset')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={resetSettings} color="warning" autoFocus>
            {t('common.reset')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Shortcut editing dialog */}
      <Dialog
        open={shortcutDialogOpen}
        onClose={() => setShortcutDialogOpen(false)}
      >
        <DialogTitle>{t('settings.editShortcut')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('settings.pressKeyCombination')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t('settings.shortcut')}
            fullWidth
            variant="outlined"
            value={newShortcut}
            onChange={(e) => setNewShortcut(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShortcutDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={saveShortcut} color="primary">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
