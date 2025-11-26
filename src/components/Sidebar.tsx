
import React from 'react';
import { Box, List, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';

const Sidebar = () => {
  return (
    <Box sx={{ width: 250, bgcolor: 'background.paper', height: '100vh', borderRight: '1px solid #ddd' }}>
      <List>
        <ListItem>
          <ListItemText primary="Course Analytics" />
        </ListItem>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;
