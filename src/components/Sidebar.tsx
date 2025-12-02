
'use client';
import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Divider, ListItemButton, Collapse, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Tooltip } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const Sidebar = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [course, setCourse] = useState('react');

  const handleSettingsClick = () => {
    setOpenSettings(!openSettings);
  };

  const handleCourseChange = (event: SelectChangeEvent) => {
    setCourse(event.target.value as string);
  };

  return (
    <Box sx={{ width: 250, bgcolor: 'background.paper', height: '100vh', borderRight: '1px solid #ddd' }}>
      <List>
        <ListItem>
          <Tooltip title="Learning Analytics Data Storytelling Agent">
            <ListItemText 
              primary="LADS Agent" 
              primaryTypographyProps={{ 
                variant: 'h5', 
                fontWeight: 'bold', 
                fontStyle: 'italic',
                align: 'center'
              }} 
            />
          </Tooltip>
        </ListItem>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={handleSettingsClick}>
          <ListItemText primary="Settings" />
          {openSettings ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSettings} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4, pr: 2, pb: 2 }}>
               <FormControl fullWidth size="small">
                <InputLabel id="course-select-label">Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  id="course-select"
                  value={course}
                  label="Course"
                  onChange={handleCourseChange}
                >
                  <MenuItem value="react">CS101: Introduction to React</MenuItem>
                  <MenuItem value="js">CS201: Advanced JavaScript</MenuItem>
                  <MenuItem value="web">CS301: Web Development Bootcamp</MenuItem>
                  <MenuItem value="dsa">CS401: Data Structures & Algorithms</MenuItem>
                  <MenuItem value="uiux">DES101: UI/UX Design Fundamentals</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;
