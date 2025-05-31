import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container, Button, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// テーマの設定
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4', // Google Blue
    },
    secondary: {
      main: '#34A853', // Google Green
    },
    error: {
      main: '#EA4335', // Google Red
    },
    warning: {
      main: '#FBBC05', // Google Yellow
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", sans-serif',
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                GCP AI Agent
              </Link>
            </Typography>
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/profile">
                  プロフィール
                </Button>
                <Button
                  color="inherit"
                  onClick={() => auth.signOut()}
                >
                  ログアウト
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                ログイン
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={user ? <ChatPage /> : <LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </ThemeProvider>
  )
}

export default App