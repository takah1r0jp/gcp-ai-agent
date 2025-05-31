import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 5, mt: 5, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          404 - ページが見つかりません
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          お探しのページは存在しないか、移動した可能性があります。
        </Typography>
        
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          ホームに戻る
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;