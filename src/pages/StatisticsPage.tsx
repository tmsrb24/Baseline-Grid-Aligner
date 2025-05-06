import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  BarChart as ChartIcon,
  PictureAsPdf as PdfIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { AlignmentIssue } from '../types/document';

// Mock data for demonstration
const mockStatistics = {
  textFrames: 12,
  characters: 8547,
  words: 1423,
  lines: 156,
  paragraphs: 32,
  alignmentIssues: 18,
  baselineDeviations: 8,
  trackingIssues: 6,
  wordSpacingIssues: 4
};

// Mock alignment issues for demonstration
const mockIssues: AlignmentIssue[] = [
  {
    id: '1',
    textFrameId: 'frame1',
    type: 'baseline',
    severity: 'high',
    position: { start: 120, end: 145 },
    description: 'Significant baseline deviation detected'
  },
  {
    id: '2',
    textFrameId: 'frame1',
    type: 'tracking',
    severity: 'medium',
    position: { start: 230, end: 280 },
    description: 'Inconsistent tracking in paragraph'
  },
  {
    id: '3',
    textFrameId: 'frame2',
    type: 'wordSpacing',
    severity: 'low',
    position: { start: 50, end: 75 },
    description: 'Minor word spacing inconsistency'
  },
  {
    id: '4',
    textFrameId: 'frame3',
    type: 'baseline',
    severity: 'high',
    position: { start: 10, end: 40 },
    description: 'Text not aligned to baseline grid'
  },
  {
    id: '5',
    textFrameId: 'frame4',
    type: 'tracking',
    severity: 'medium',
    position: { start: 300, end: 350 },
    description: 'Tracking needs adjustment for proper alignment'
  }
];

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentDocument } = useAppContext();
  
  // State for selected issues (for potential batch fixing)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  
  // Toggle issue selection
  const toggleIssueSelection = (id: string) => {
    if (selectedIssues.includes(id)) {
      setSelectedIssues(selectedIssues.filter(issueId => issueId !== id));
    } else {
      setSelectedIssues([...selectedIssues, id]);
    }
  };
  
  // Select all issues
  const selectAllIssues = () => {
    setSelectedIssues(mockIssues.map(issue => issue.id));
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedIssues([]);
  };
  
  // Get severity color
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Get issue type label
  const getIssueTypeLabel = (type: 'baseline' | 'tracking' | 'wordSpacing') => {
    switch (type) {
      case 'baseline':
        return t('statistics.baselineDeviations');
      case 'tracking':
        return t('statistics.trackingIssues');
      case 'wordSpacing':
        return t('statistics.wordSpacingIssues');
      default:
        return type;
    }
  };
  
  // Calculate alignment score (0-100)
  const calculateAlignmentScore = () => {
    // This would be a more complex calculation in a real app
    const totalIssues = mockStatistics.alignmentIssues;
    const totalElements = mockStatistics.paragraphs;
    
    // Simple score calculation: 100 - (issues / elements) * 100
    // With a minimum of 0 and maximum of 100
    const score = 100 - (totalIssues / totalElements) * 100;
    return Math.max(0, Math.min(100, score));
  };
  
  const alignmentScore = calculateAlignmentScore();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('statistics.title')}
      </Typography>
      
      {!currentDocument ? (
        // No document loaded
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('document.noDocuments')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Document statistics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('document.documentInfo')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        {mockStatistics.textFrames}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.textFrames')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        {mockStatistics.paragraphs}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.paragraphs')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        {mockStatistics.characters}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.characters')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        {mockStatistics.words}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.words')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        {mockStatistics.lines}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.lines')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Alignment score */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('statistics.alignmentScore')}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={alignmentScore} 
                    color={
                      alignmentScore > 80 ? 'success' : 
                      alignmentScore > 50 ? 'warning' : 
                      'error'
                    }
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {`${Math.round(alignmentScore)}%`}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center" color="error">
                        {mockStatistics.baselineDeviations}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.baselineDeviations')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center" color="warning.main">
                        {mockStatistics.trackingIssues}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.trackingIssues')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center" color="info.main">
                        {mockStatistics.wordSpacingIssues}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {t('statistics.wordSpacingIssues')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ChartIcon />}
                  onClick={() => {}}
                >
                  {t('statistics.generateReport')}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<PdfIcon />}
                  onClick={() => {}}
                >
                  {t('statistics.exportReport')}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Alignment issues */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {t('statistics.alignmentIssues')}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={selectAllIssues}
                  >
                    {t('alignment.selectAll')}
                  </Button>
                  
                  <Button
                    size="small"
                    onClick={clearSelection}
                  >
                    {t('alignment.selectNone')}
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="small"
                    disabled={selectedIssues.length === 0}
                    startIcon={<CheckIcon />}
                  >
                    {t('statistics.fixSelected')}
                  </Button>
                </Box>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>{t('statistics.issueType')}</TableCell>
                      <TableCell>{t('statistics.severity')}</TableCell>
                      <TableCell>{t('statistics.location')}</TableCell>
                      <TableCell>{t('statistics.description')}</TableCell>
                      <TableCell align="right">{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockIssues.map((issue) => (
                      <TableRow 
                        key={issue.id}
                        selected={selectedIssues.includes(issue.id)}
                        onClick={() => toggleIssueSelection(issue.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Chip
                            icon={<WarningIcon />}
                            size="small"
                            color={getSeverityColor(issue.severity)}
                            sx={{ width: 20, height: 20, '& .MuiChip-label': { display: 'none' } }}
                          />
                        </TableCell>
                        <TableCell>{getIssueTypeLabel(issue.type)}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`statistics.severity.${issue.severity}`)}
                            size="small"
                            color={getSeverityColor(issue.severity)}
                          />
                        </TableCell>
                        <TableCell>{`${issue.textFrameId}, ${issue.position.start}-${issue.position.end}`}</TableCell>
                        <TableCell>{issue.description}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle fix action
                            }}
                          >
                            {t('statistics.fix')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StatisticsPage;
