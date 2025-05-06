import React, { useState } from 'react';
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
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  Slider,
  Alert,
  Tooltip,
  IconButton,
  Chip
} from '@mui/material';
import {
  FormatAlignCenter as AlignIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
  Help as HelpIcon,
  ColorLens as ColorIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { AlignmentSettings } from '../types/document';

const AlignmentPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    currentDocument, 
    alignmentSettings, 
    setAlignmentSettings,
    applyAlignment,
    generatePreview,
    clearPreview,
    savePreset
  } = useAppContext();
  
  // Local state for preset saving
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [showPresetForm, setShowPresetForm] = useState(false);
  
  // Handle settings changes
  const handleSettingChange = (setting: keyof AlignmentSettings, value: any) => {
    setAlignmentSettings({
      ...alignmentSettings,
      [setting]: value
    });
    
    // If auto-apply is enabled, generate preview
    if (alignmentSettings.autoApply && alignmentSettings.previewEnabled) {
      generatePreview();
    }
  };
  
  // Handle alignment type change
  const handleAlignmentTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    handleSettingChange('type', event.target.value as AlignmentSettings['type']);
  };
  
  // Handle word spacing factor change
  const handleWordSpacingFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      handleSettingChange('wordSpacingFactor', value);
    }
  };
  
  // Handle auto apply toggle
  const handleAutoApplyToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange('autoApply', event.target.checked);
  };
  
  // Handle show warnings toggle
  const handleShowWarningsToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange('showWarnings', event.target.checked);
  };
  
  // Handle preview enabled toggle
  const handlePreviewEnabledToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    handleSettingChange('previewEnabled', newValue);
    
    if (!newValue) {
      clearPreview();
    } else if (alignmentSettings.autoApply) {
      generatePreview();
    }
  };
  
  // Handle apply button click
  const handleApplyClick = () => {
    applyAlignment();
  };
  
  // Handle reset button click
  const handleResetClick = () => {
    setAlignmentSettings({
      type: 'tracking',
      highlightColor: 'rgba(128, 200, 255, 0.3)',
      wordSpacingFactor: 1.0,
      autoApply: true,
      showWarnings: true,
      previewEnabled: true
    });
    clearPreview();
  };
  
  // Handle save preset
  const handleSavePreset = () => {
    if (presetName.trim()) {
      savePreset(presetName, presetDescription);
      setPresetName('');
      setPresetDescription('');
      setShowPresetForm(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('alignment.title')}
      </Typography>
      
      {!currentDocument ? (
        // No document loaded
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('document.noDocuments')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Alignment settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('alignment.settings')}
              </Typography>
              
              <Grid container spacing={2}>
                {/* Alignment type */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="alignment-type-label">
                      {t('alignment.type')}
                    </InputLabel>
                    <Select
                      labelId="alignment-type-label"
                      value={alignmentSettings.type}
                      label={t('alignment.type')}
                      onChange={handleAlignmentTypeChange}
                    >
                      <MenuItem value="tracking">{t('alignment.types.tracking')}</MenuItem>
                      <MenuItem value="baseline">{t('alignment.types.baseline')}</MenuItem>
                      <MenuItem value="wordSpacing">{t('alignment.types.wordSpacing')}</MenuItem>
                      <MenuItem value="combined">{t('alignment.types.combined')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Word spacing factor - only show for word spacing and combined types */}
                {(alignmentSettings.type === 'wordSpacing' || alignmentSettings.type === 'combined') && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('alignment.wordSpacingFactor')}
                      type="number"
                      inputProps={{ step: 0.1, min: 0.1, max: 5 }}
                      value={alignmentSettings.wordSpacingFactor}
                      onChange={handleWordSpacingFactorChange}
                    />
                  </Grid>
                )}
                
                {/* Highlight color */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      {t('alignment.highlightColor')}
                    </Typography>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: alignmentSettings.highlightColor,
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
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                {/* Toggles */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={alignmentSettings.autoApply}
                        onChange={handleAutoApplyToggle}
                      />
                    }
                    label={t('alignment.autoApply')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={alignmentSettings.showWarnings}
                        onChange={handleShowWarningsToggle}
                      />
                    }
                    label={t('alignment.showWarnings')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={alignmentSettings.previewEnabled}
                        onChange={handlePreviewEnabledToggle}
                      />
                    }
                    label={t('alignment.preview')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                {/* Action buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AlignIcon />}
                      onClick={handleApplyClick}
                    >
                      {t('alignment.apply')}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ResetIcon />}
                      onClick={handleResetClick}
                    >
                      {t('alignment.reset')}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<SaveIcon />}
                      onClick={() => setShowPresetForm(true)}
                    >
                      {t('presets.save')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Save preset form */}
            {showPresetForm && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('presets.save')}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('presets.presetName')}
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('presets.presetDescription')}
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSavePreset}
                      >
                        {t('common.save')}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        onClick={() => setShowPresetForm(false)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>
          
          {/* Preview area */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', minHeight: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {t('alignment.preview')}
                </Typography>
                
                <Chip
                  icon={<PreviewIcon />}
                  label={alignmentSettings.previewEnabled ? t('common.enabled') : t('common.disabled')}
                  color={alignmentSettings.previewEnabled ? 'primary' : 'default'}
                />
              </Box>
              
              <Box
                sx={{
                  height: 'calc(100% - 40px)',
                  border: '1px dashed rgba(0, 0, 0, 0.2)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2
                }}
              >
                {alignmentSettings.previewEnabled ? (
                  <Typography variant="body1" align="center">
                    {t('alignment.previewContent')}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    {t('alignment.previewDisabled')}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Batch processing */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('alignment.batch')}
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('alignment.batchInfo')}
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined">
                  {t('alignment.selectAll')}
                </Button>
                
                <Button variant="outlined">
                  {t('alignment.selectNone')}
                </Button>
                
                <Button variant="outlined">
                  {t('alignment.invertSelection')}
                </Button>
                
                <Button variant="contained" color="primary">
                  {t('alignment.applyToSelected')}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AlignmentPage;
