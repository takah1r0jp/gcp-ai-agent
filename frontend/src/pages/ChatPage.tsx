import { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, sendChatMessage } from '../services/api';

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'こんにちは！Google Cloud Vertex AIを活用したAIアシスタントです。どのようにお手伝いできますか？' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージが追加されたときに自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // ユーザーメッセージを追加
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // APIにメッセージを送信
      const allMessages = [...messages, userMessage];
      const response = await sendChatMessage(allMessages);
      
      // アシスタントの応答を追加
      if (response && response.message) {
        setMessages(prev => [...prev, response.message]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'すみません、エラーが発生しました。もう一度お試しください。' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        AI チャット
      </Typography>
      
      <Paper elevation={3} sx={{ height: 'calc(100vh - 250px)', display: 'flex', flexDirection: 'column' }}>
        {/* メッセージ表示エリア */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.role === 'user' ? 'primary.main' : 'grey.100',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        
        {/* 入力フォーム */}
        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="メッセージを入力..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              sx={{ mr: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !input.trim()}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              送信
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;