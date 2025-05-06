import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Slider,
  Alert,
  Tooltip,
  IconButton,
  Chip
} from '@mui/material';
import {
  GridOn as GridIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
  ColorLens as ColorIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { GridSettings } from '../types/document';

const GridPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    currentDocument, 
    gridSettings, 
    setGridSettings,
    saveSettings
  } = useAppContext();
  
  // Handle settings changes
  const handleSettingChange = (setting: keyof GridSettings, value: any) => {
    setGridSettings({
      ...gridSettings,
      [setting]: value
    });
  };
  
  // Handle baseline size change
  const handleBaselineSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0) {
      handleSettingChange('baselineSize', value);
    }
  };
  
  // Handle grid opacity change
  const handleGridOpacityChange = (_event: Event, value: number | number[]) => {
    handleSettingChange('gridOpacity', value as number);
  };
  
  // Handle grid offset change
  const handleGridOffsetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      handleSettingChange('gridOffset', value);
    }
  };
  
  // Handle horizontal spacing change
  const handleHorizontalSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0) {
      handleSettingChange('horizontalSpacing', value);
    }
  };
  
  // Handle vertical spacing change
  const handleVerticalSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0) {
      handleSettingChange('verticalSpacing', value);
    }
  };
  
  // Handle show grid toggle
  const handleShowGridToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange('showGrid', event.target.checked);
  };
  
  // Handle snap to grid toggle
  const handleSnapToGridToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange('snapToGrid', event.target.checked);
  };
  
  // Handle horizontal grid toggle
  const handleHorizontalGridToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange('horizontalGrid', event.target.checked);
  };
  
  // Handle vertical grid toggle
  const handleVerticalGridToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange('verticalGrid', event.target.checked);
  };
  
  // Handle reset button click
  const handleResetClick = () => {
    setGridSettings({
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
  };
  
  // Handle save button click
  const handleSaveClick = () => {
    saveSettings();
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('grid.title')}
      </Typography>
      
      {!currentDocument ? (
        // No document loaded
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('document.noDocuments')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Grid settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('grid.settings')}
              </Typography>
              
              <Grid container spacing={2}>
                {/* Baseline size */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('grid.baselineSize')}
                    type="number"
                    inputProps={{ step: 0.5, min: 1 }}
                    value={gridSettings.baselineSize}
                    onChange={handleBaselineSizeChange}
                  />
                </Grid>
                
                {/* Grid color */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      {t('grid.gridColor')}
                    </Typography>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: gridSettings.gridColor,
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer'
                      }}
                      // In a real app, this would open a color picker
                      onClick={() => {}}
                    />
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <ColorIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                
                {/* Grid opacity */}
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    {t('grid.gridOpacity')}
                  </Typography>
                  <Slider
                    value={gridSettings.gridOpacity}
                    onChange={handleGridOpacityChange}
                    min={0}
                    max={1}
                    step={0.05}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value: number) => `${Math.round(value * 100)}%`}
                  />
                </Grid>
                
                {/* Grid offset */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('grid.gridOffset')}
                    type="number"
                    inputProps={{ step: 0.5 }}
                    value={gridSettings.gridOffset}
                    onChange={handleGridOffsetChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                {/* Toggles */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={gridSettings.showGrid}
                        onChange={handleShowGridToggle}
                      />
                    }
                    label={t('grid.showGrid')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={gridSettings.snapToGrid}
                        onChange={handleSnapToGridToggle}
                      />
                    }
                    label={t('grid.snapToGrid')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                {/* Horizontal grid */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={gridSettings.horizontalGrid}
                        onChange={handleHorizontalGridToggle}
                      />
                    }
                    label={t('grid.horizontalGrid')}
                  />
                </Grid>
                
                {gridSettings.horizontalGrid && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('grid.horizontalSpacing')}
                      type="number"
                      inputProps={{ step: 1, min: 1 }}
                      value={gridSettings.horizontalSpacing}
                      onChange={handleHorizontalSpacingChange}
                    />
                  </Grid>
                )}
                
                {/* Vertical grid */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={gridSettings.verticalGrid}
                        onChange={handleVerticalGridToggle}
                      />
                    }
                    label={t('grid.verticalGrid')}
                  />
                </Grid>
                
                {gridSettings.verticalGrid && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('grid.verticalSpacing')}
                      type="number"
                      inputProps={{ step: 1, min: 1 }}
                      value={gridSettings.verticalSpacing}
                      onChange={handleVerticalSpacingChange}
                    />
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                {/* Action buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveClick}
                    >
                      {t('common.save')}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ResetIcon />}
                      onClick={handleResetClick}
                    >
                      {t('common.reset')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Grid preview */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', minHeight: 500 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {t('grid.preview')}
                </Typography>
                
                <Chip
                  icon={<VisibilityIcon />}
                  label={gridSettings.showGrid ? t('common.visible') : t('common.hidden')}
                  color={gridSettings.showGrid ? 'primary' : 'default'}
                />
              </Box>
              
              <Box
                sx={{
                  height: 'calc(100% - 40px)',
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Grid visualization */}
                {gridSettings.showGrid && (
                  <>
                    {/* Baseline grid */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `repeating-linear-gradient(
                          to bottom,
                          transparent,
                          transparent ${gridSettings.baselineSize - 1}px,
                          ${gridSettings.gridColor} ${gridSettings.baselineSize - 1}px,
                          ${gridSettings.gridColor} ${gridSettings.baselineSize}px
                        )`,
                        backgroundPosition: `0 ${gridSettings.gridOffset}px`,
                        opacity: gridSettings.gridOpacity
                      }}
                    />
                    
                    {/* Horizontal grid */}
                    {gridSettings.horizontalGrid && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: `repeating-linear-gradient(
                            to bottom,
                            transparent,
                            transparent ${gridSettings.horizontalSpacing - 1}px,
                            rgba(255, 0, 0, ${gridSettings.gridOpacity}) ${gridSettings.horizontalSpacing - 1}px,
                            rgba(255, 0, 0, ${gridSettings.gridOpacity}) ${gridSettings.horizontalSpacing}px
                          )`,
                          opacity: gridSettings.gridOpacity * 0.7
                        }}
                      />
                    )}
                    
                    {/* Vertical grid */}
                    {gridSettings.verticalGrid && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: `repeating-linear-gradient(
                            to right,
                            transparent,
                            transparent ${gridSettings.verticalSpacing - 1}px,
                            rgba(0, 128, 0, ${gridSettings.gridOpacity}) ${gridSettings.verticalSpacing - 1}px,
                            rgba(0, 128, 0, ${gridSettings.gridOpacity}) ${gridSettings.verticalSpacing}px
                          )`,
                          opacity: gridSettings.gridOpacity * 0.7
                        }}
                      />
                    )}
                  </>
                )}
                
                {/* Sample text */}
                <Box sx={{ position: 'relative', p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    {t('grid.sampleTitle')}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {t('grid.sampleText')}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default GridPage;
