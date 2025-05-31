import { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail, updatePassword, User } from 'firebase/auth';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
    }
  }, [auth]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!user) throw new Error('ユーザーが見つかりません');

      // 表示名の更新
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // メールアドレスの更新
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // パスワードの更新
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('パスワードが一致しません');
        }
        await updatePassword(user, newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }

      // 更新後のユーザー情報を取得
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        setUser(updatedUser);
      }

      setSuccess('プロフィールが更新されました');
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || 'プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            ユーザー情報を読み込み中...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        プロフィール
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%' }} />
            ) : (
              <PersonIcon fontSize="large" />
            )}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.displayName || 'ユーザー'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleUpdateProfile}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本情報
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="表示名"
                fullWidth
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="メールアドレス"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                パスワード変更
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="新しいパスワード"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="パスワード確認"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                error={newPassword !== confirmPassword && confirmPassword !== ''}
                helperText={
                  newPassword !== confirmPassword && confirmPassword !== ''
                    ? 'パスワードが一致しません'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '変更を保存'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;