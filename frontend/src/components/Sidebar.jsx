import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { Dashboard as DashIcon, Receipt, DataObject } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashIcon />, path: '/' },
    { text: 'Billing', icon: <Receipt />, path: '/billing' },
    { text: 'Master Data', icon: <DataObject />, path: '/master' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1E293B',
          color: 'white',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary.light">
          LogiEdge
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: 2,
                backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  cursor: 'pointer'
                }
              }}
            >
              <ListItemIcon sx={{ color: active ? 'primary.light' : 'grey.400' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: active ? 600 : 400,
                  color: active ? 'white' : 'grey.300'
                }} 
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
