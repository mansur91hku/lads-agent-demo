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
          <Box>{children}</Box>
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
      summaryText = "The overall grade distribution is healthy, with a majority of students (19) earning a 'B'. A strong cohort of 12 students achieved an 'A'. However, attention may be needed for the 7 students who received 'D' (5) or 'F' (2) grades, as they may require additional support to catch up with the course material.";
    } else if (value === 1) {
      summaryText = "Online activity shows consistent engagement, with a significant peak in both page views and participations during Week 5. While this indicates strong interest in that week's topic, there has been a slight decline in the most recent week. It may be beneficial to investigate the cause of this dip to maintain momentum.";
    } else if (value === 2) {
      summaryText = "The student roster provides a detailed view of individual performance and engagement. Top performers like Tyrion Lannister (Grade: 98) and Samwell Tarly (Grade: 93) exhibit high levels of engagement, with 200 and 190 page views respectively, and 25 and 24 participations. This suggests a strong correlation between active participation and academic success. On the other hand, Harvey Roxie's profile is a cause for concern. With a low grade of 65, only 80 page views, and 7 participations, combined with no activity since 2025-11-21, this student appears to be significantly disengaged and at high risk of falling behind. It is recommended to reach out to students with similarly low page views and participation metrics to offer support.";
    } else if (value === 3) {
      summaryText = "The discussion forums are active, particularly the 'Project Brainstorming Session' which has 9 participants and a high number of interactions. The network diagrams reveal that some students, like Tyrion Lannister, act as central hubs in conversations, while others remain on the periphery. Encouraging broader participation could enhance collaborative learning.";
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
      <ChatBubble currentTab={["Course Grade", "Weekly Online Activity", "Students", "Discussions"][value]} />
    </Box>
  );
}

