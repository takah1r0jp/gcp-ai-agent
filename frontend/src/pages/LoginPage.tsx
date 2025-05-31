import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'ログインに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error: any) {
      console.error('Google authentication error:', error);
      setError(error.message || 'Googleログインに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          GCP AI Agent
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Google Cloud Vertex AIを活用したAIアシスタント
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Typography variant="h5" component="h2" gutterBottom>
          {isSignUp ? 'アカウント作成' : 'ログイン'}
        </Typography>

        <Box component="form" onSubmit={handleEmailAuth} sx={{ mt: 2 }}>
          <TextField
            label="メールアドレス"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (isSignUp ? '登録' : 'ログイン')}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>または</Divider>

        <Button
          fullWidth
          variant="outlined"
          color="primary"
          size="large"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          Googleでログイン
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            color="primary"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
          >
            {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : '新規アカウント作成'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;