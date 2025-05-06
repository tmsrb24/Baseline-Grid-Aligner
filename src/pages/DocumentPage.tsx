import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { FolderOpen as OpenIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const DocumentPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentDocument, openDocument } = useAppContext();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('document.title')}
      </Typography>
      
      {!currentDocument ? (
        // No document loaded
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {t('document.noDocuments')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<OpenIcon />}
            onClick={openDocument}
            sx={{ mt: 2 }}
          >
            {t('document.open')}
          </Button>
        </Paper>
      ) : (
        // Document loaded
        <Grid container spacing={3}>
          {/* Document info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('document.documentInfo')}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary={t('document.fileName')} 
                      secondary={currentDocument.name} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary={t('document.fileType')} 
                      secondary={currentDocument.type.toUpperCase()} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary={t('document.fileSize')} 
                      secondary={`${currentDocument.size} KB`} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary={t('document.dimensions')} 
                      secondary={`${currentDocument.dimensions.width} × ${currentDocument.dimensions.height}`} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary={t('document.pages')} 
                      secondary={currentDocument.pages} 
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={openDocument}>
                  {t('document.open')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Document preview or additional info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {t('document.preview')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Quick actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('document.quickActions')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => window.location.href = '/alignment'}>
                  {t('sidebar.alignment')}
                </Button>
                <Button variant="outlined" onClick={() => window.location.href = '/grid'}>
                  {t('sidebar.grid')}
                </Button>
                <Button variant="outlined" onClick={() => window.location.href = '/statistics'}>
                  {t('sidebar.statistics')}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DocumentPage;
