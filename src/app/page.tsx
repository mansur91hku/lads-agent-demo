'use client';
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CourseGrade from '@/components/CourseGrade';
import WeeklyOnlineActivity from '@/components/WeeklyOnlineActivity';
import Students from '@/components/Students';
import Discussions from '@/components/Discussions';
import ChatBubble from '@/components/ChatBubble';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Home() {
  const [value, setValue] = useState(0);
  const [summary, setSummary] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSummary('');
  };

  const handleGenerateSummary = () => {
    let summaryText = '';
    if (value === 0) {
      summaryText = "The course grade distribution shows a majority of students achieving 'B' grades, with a smaller number receiving 'A's and 'C's. Few students are in the 'D' and 'F' categories, suggesting most are performing satisfactorily.";
    } else if (value === 1) {
      summaryText = "Weekly online activity indicates consistent engagement in the first few weeks, with a notable spike in participation in week 5. Page views have remained relatively stable, with a slight dip in the most recent week.";
    } else if (value === 2) {
      summaryText = "The student list highlights several high-performing individuals. It's worth noting the last activity dates to identify any students who may be falling behind in engagement.";
    } else if (value === 3) {
      summaryText = "The discussion forums show active participation in the 'Week 3 Readings' thread. The network diagram reveals key influencers and communication patterns within the group.";
    }
    setSummary(summaryText);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Header onGenerateSummary={handleGenerateSummary} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="course analytics tabs">
            <Tab label="Course Grade" />
            <Tab label="Weekly Online Activity" />
            <Tab label="Students" />
            <Tab label="Discussions" />
          </Tabs>
        </Box>
        {summary && (
          <Paper elevation={3} sx={{ p: 2, m: 2, bgcolor: 'action.hover' }}>
            <Typography variant="h6">Summary</Typography>
            <Typography>{summary}</Typography>
          </Paper>
        )}
        <TabPanel value={value} index={0}>
          <CourseGrade />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WeeklyOnlineActivity />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Students />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Discussions />
        </TabPanel>
      </Box>
      <ChatBubble />
    </Box>
  );
}

