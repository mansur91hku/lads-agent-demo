'use client';
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CourseGrade from '@/components/CourseGrade';
import WeeklyOnlineActivity from '@/components/WeeklyOnlineActivity';
import Students from '@/components/Students';
import Discussions from '@/components/Discussions';
import ChatBubble from '@/components/ChatBubble';
import type { CourseAnalytics } from '@/types/analytics';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index}
      id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}><Box>{children}</Box></Box>}
    </div>
  );
}

function buildSummary(data: CourseAnalytics, tab: number): string {
  if (tab === 0) {
    const [A, B, C, D, F] = data.grades.datasets[0].data;
    const total = A + B + C + D + F;
    const atRisk = D + F;
    return `Grade distribution across ${total} students: A=${A}, B=${B}, C=${C}, D=${D}, F=${F}. ` +
      (atRisk > 0 ? `${atRisk} student(s) are at risk (D or F).` : 'No students are currently failing.');
  }
  if (tab === 1) {
    const labels = data.activity.labels;
    const views = data.activity.datasets.find(d => d.label === 'Page Views')?.data ?? [];
    const parts = data.activity.datasets.find(d => d.label === 'Participations')?.data ?? [];
    if (!labels.length) return 'No weekly activity data available yet.';
    const pvIdx = views.indexOf(Math.max(...(views as number[])));
    const paIdx = parts.indexOf(Math.max(...(parts as number[])));
    return `Activity over ${labels.length} week(s). Highest page views: ${labels[pvIdx]} (${views[pvIdx]}). Highest participations: ${labels[paIdx]} (${parts[paIdx]}).`;
  }
  if (tab === 2) {
    const sorted = [...data.students].sort((a, b) => b.grade - a.grade);
    const top = sorted[0];
    const atRisk = data.students.filter(s => s.grade < 60).length;
    return `${data.students.length} students enrolled. ` +
      (top ? `Top performer: ${top.name} (Grade: ${top.grade}). ` : '') +
      (atRisk > 0 ? `${atRisk} student(s) below 60 — consider outreach.` : 'All students are currently passing.');
  }
  if (tab === 3) {
    if (!data.discussions.length) return 'No discussion topics found.';
    const most = [...data.discussions].sort((a, b) => b.participants - a.participants)[0];
    return `${data.discussions.length} topic(s). Most active: "${most.title}" with ${most.participants} participant(s).`;
  }
  return '';
}

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const [summary, setSummary] = useState('');
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/analytics')
      .then(async res => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<CourseAnalytics>;
      })
      .then(data => { setAnalytics(data); setLoading(false); })
      .catch(err => { setError((err as Error).message ?? 'Unknown error'); setLoading(false); });
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSummary('');
  };

  const handleGenerateSummary = () => {
    if (!analytics) return;
    setSummary(buildSummary(analytics, tabValue));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Header onGenerateSummary={handleGenerateSummary} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="course analytics tabs">
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

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading course analytics…</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            Failed to load analytics: {error}
          </Alert>
        )}

        {analytics && !loading && (
          <>
            <TabPanel value={tabValue} index={0}>
              <CourseGrade grades={analytics.grades} assessments={analytics.assessments} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <WeeklyOnlineActivity activity={analytics.activity} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Students students={analytics.students} />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Discussions discussions={analytics.discussions} />
            </TabPanel>
          </>
        )}
      </Box>
      <ChatBubble />
    </Box>
  );
}

