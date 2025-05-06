import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  ContentCopy as DuplicateIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { Preset } from '../types/document';

// Mock presets for demonstration
const mockPresets: Preset[] = [
  {
    id: '1',
    name: 'Default Typography',
    description: 'Standard typography settings for body text',
    dateCreated: new Date('2025-01-15'),
    alignmentSettings: {
      type: 'tracking',
      highlightColor: 'rgba(128, 200, 255, 0.3)',
      wordSpacingFactor: 1.0,
      autoApply: true,
      showWarnings: true,
      previewEnabled: true
    },
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
    }
  },
  {
    id: '2',
    name: 'Heading Typography',
    description: 'Optimized for headings and titles',
    dateCreated: new Date('2025-02-10'),
    alignmentSettings: {
      type: 'baseline',
      highlightColor: 'rgba(255, 128, 128, 0.3)',
      wordSpacingFactor: 1.2,
      autoApply: false,
      showWarnings: true,
      previewEnabled: true
    },
    gridSettings: {
      baselineSize: 18,
      gridColor: 'rgba(255, 0, 0, 0.5)',
      gridOpacity: 0.6,
      showGrid: true,
      snapToGrid: true,
      gridOffset: 0,
      horizontalGrid: false,
      verticalGrid: false,
      horizontalSpacing: 20,
      verticalSpacing: 20
    }
  },
  {
    id: '3',
    name: 'Dense Layout',
    description: 'Compact layout with tighter spacing',
    dateCreated: new Date('2025-03-05'),
    alignmentSettings: {
      type: 'combined',
      highlightColor: 'rgba(128, 255, 128, 0.3)',
      wordSpacingFactor: 0.9,
      autoApply: true,
      showWarnings: false,
      previewEnabled: true
    },
    gridSettings: {
      baselineSize: 10,
      gridColor: 'rgba(0, 128, 0, 0.5)',
      gridOpacity: 0.4,
      showGrid: true,
      snapToGrid: true,
      gridOffset: 0,
      horizontalGrid: true,
      verticalGrid: true,
      horizontalSpacing: 15,
      verticalSpacing: 15
    }
  }
];

const PresetsPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    presets: contextPresets, 
    setPresets, 
    loadPreset, 
    deletePreset,
    savePreset,
    activePresetId
  } = useAppContext();
  
  // Use mock presets for demonstration
  const presets = contextPresets.length > 0 ? contextPresets : mockPresets;
  
  // State for new preset form
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [showNewPresetForm, setShowNewPresetForm] = useState(false);
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
  
  // Handle save preset
  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      savePreset(newPresetName, newPresetDescription);
      setNewPresetName('');
      setNewPresetDescription('');
      setShowNewPresetForm(false);
    }
  };
  
  // Handle load preset
  const handleLoadPreset = (id: string) => {
    loadPreset(id);
  };
  
  // Handle delete preset
  const handleDeleteClick = (id: string) => {
    setPresetToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeletePreset = () => {
    if (presetToDelete) {
      deletePreset(presetToDelete);
      setPresetToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  // Handle duplicate preset
  const handleDuplicatePreset = (preset: Preset) => {
    savePreset(`${preset.name} (Copy)`, preset.description);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('presets.title')}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Presets list */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {t('presets.savedPresets')}
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowNewPresetForm(true)}
              >
                {t('presets.save')}
              </Button>
            </Box>
            
            {presets.length === 0 ? (
              <Alert severity="info">
                {t('presets.noPresets')}
              </Alert>
            ) : (
              <List>
                {presets.map((preset) => (
                  <React.Fragment key={preset.id}>
                    <ListItem 
                      selected={activePresetId === preset.id}
                      sx={{ 
                        borderRadius: 1,
                        '&.Mui-selected': {
                          backgroundColor: 'action.selected',
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {preset.name}
                            {activePresetId === preset.id && (
                              <Chip 
                                label={t('presets.active')} 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span" color="text.secondary">
                              {preset.description}
                            </Typography>
                            <Typography variant="caption" component="div" color="text.secondary">
                              {t('presets.created')}: {formatDate(preset.dateCreated)}
                            </Typography>
                            <Typography variant="caption" component="div" color="text.secondary">
                              {t('alignment.type')}: {t(`alignment.types.${preset.alignmentSettings.type}`)}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="load"
                          onClick={() => handleLoadPreset(preset.id)}
                          sx={{ mr: 1 }}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="duplicate"
                          onClick={() => handleDuplicatePreset(preset)}
                          sx={{ mr: 1 }}
                        >
                          <DuplicateIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteClick(preset.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Import/Export */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('presets.importExport')}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ImportIcon />}
                fullWidth
              >
                {t('presets.import')}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                fullWidth
                disabled={presets.length === 0}
              >
                {t('presets.export')}
              </Button>
            </Box>
          </Paper>
          
          {/* New preset form */}
          {showNewPresetForm && (
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('presets.save')}
              </Typography>
              
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label={t('presets.presetName')}
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  fullWidth
                  required
                />
                
                <TextField
                  label={t('presets.presetDescription')}
                  value={newPresetDescription}
                  onChange={(e) => setNewPresetDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowNewPresetForm(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={handleSavePreset}
                    disabled={!newPresetName.trim()}
                  >
                    {t('common.save')}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('presets.confirmDelete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('presets.deleteWarning')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmDeletePreset} color="error" autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PresetsPage;
