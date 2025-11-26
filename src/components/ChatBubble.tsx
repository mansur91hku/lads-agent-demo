
import React, { useState } from 'react';
import { Box, Fab, Popover, TextField, Button, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ChatBubble = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [question, setQuestion] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Fab color="primary" aria-label="chat" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleClick}>
        <ChatIcon />
      </Fab>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h6">Ask a question</Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={() => alert(`Question asked: ${question}`)}>
            Ask
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default ChatBubble;
