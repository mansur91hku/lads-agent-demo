
import React, { useState, useEffect, useRef } from 'react';
import { Box, Fab, Popover, TextField, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ChatBubbleProps {
  currentTab: string;
}

const ChatBubble = ({ currentTab }: ChatBubbleProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRestart = () => {
    setMessages([]);
  };

  const handleAsk = () => {
    if (!question.trim()) return;

    const newMessages = [...messages, { text: question, sender: 'user' as const }];
    setMessages(newMessages);
    setQuestion('');

    // Mock response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: `I see you are asking about "${question}" while looking at the ${currentTab}. How can I help you more with ${currentTab}?`,
          sender: 'bot',
        },
      ]);
    }, 500);
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
        <Box sx={{ p: 2, width: 350, height: 450, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              Assistant ({currentTab})
            </Typography>
            <IconButton onClick={handleRestart} size="small" title="Restart Chat">
              <RefreshIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, border: '1px solid #eee', borderRadius: 1, p: 1, bgcolor: '#f9f9f9' }}>
            <List dense>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Box
                    sx={{
                      bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                      color: msg.sender === 'user' ? 'white' : 'black',
                      borderRadius: 2,
                      p: 1,
                      maxWidth: '80%',
                    }}
                  >
                    <ListItemText primary={msg.text} />
                  </Box>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            />
            <Button variant="contained" onClick={handleAsk} size="small">
              Send
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default ChatBubble;
