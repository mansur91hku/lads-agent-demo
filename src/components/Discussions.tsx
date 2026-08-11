'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Paper } from '@mui/material';
import type { DiscussionRecord } from '@/types/analytics';

const DiscussionNetwork = dynamic(() => import('./DiscussionNetwork'), {
  ssr: false,
  loading: () => <p>Loading network...</p>
});

interface DiscussionsProps {
  discussions: DiscussionRecord[];
}

const Discussions = ({ discussions }: DiscussionsProps) => {
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionRecord | null>(
    discussions.length ? discussions[0] : null
  );

  if (!discussions.length) {
    return <Typography sx={{ p: 3 }}>No discussion topics found for this course.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: 300, borderRight: '1px solid #ddd' }}>
        <List>
          {discussions.map((discussion) => (
            <ListItem key={discussion.id} disablePadding>
              <ListItemButton
                onClick={() => setSelectedDiscussion(discussion)}
                selected={selectedDiscussion?.id === discussion.id}
              >
                <ListItemText
                  primary={discussion.title}
                  secondary={`${discussion.participants} participants`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {selectedDiscussion && (
          <>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6">Summary</Typography>
              <Typography>{selectedDiscussion.summary}</Typography>
            </Paper>
            <Box sx={{ height: 500, border: '1px solid #ddd', borderRadius: 1, overflow: 'auto', position: 'relative' }}>
              <DiscussionNetwork data={selectedDiscussion.graphData} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Discussions;
