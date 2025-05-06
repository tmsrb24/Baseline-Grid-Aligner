import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box
} from '@mui/material';
import {
  Description as DocumentIcon,
  FormatAlignCenter as AlignmentIcon,
  GridOn as GridIcon,
  BarChart as StatisticsIcon,
  Bookmark as PresetsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

// Sidebar width
const drawerWidth = 240;

interface AppSidebarProps {
  open: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ open }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items
  const navItems = [
    { 
      id: 'document', 
      label: t('sidebar.document'), 
      icon: <DocumentIcon />, 
      path: '/' 
    },
    { 
      id: 'alignment', 
      label: t('sidebar.alignment'), 
      icon: <AlignmentIcon />, 
      path: '/alignment' 
    },
    { 
      id: 'grid', 
      label: t('sidebar.grid'), 
      icon: <GridIcon />, 
      path: '/grid' 
    },
    { 
      id: 'statistics', 
      label: t('sidebar.statistics'), 
      icon: <StatisticsIcon />, 
      path: '/statistics' 
    },
    { 
      id: 'presets', 
      label: t('sidebar.presets'), 
      icon: <PresetsIcon />, 
      path: '/presets' 
    }
  ];
  
  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };
  
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar /> {/* Spacer to push content below app bar */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/settings')}
              onClick={() => handleNavigation('/settings')}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('settings.title')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AppSidebar;
