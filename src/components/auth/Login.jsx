import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import { School as SchoolIcon, Info as InfoIcon } from '@mui/icons-material';
import { loginUser, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showDebug, setShowDebug] = useState(false);
  const [localStorageStatus, setLocalStorageStatus] = useState('checking');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
      toast.success(`Welcome back, ${currentUser.name}!`);
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    // Check localStorage availability
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      setLocalStorageStatus('available');
    } catch (e) {
      setLocalStorageStatus('unavailable');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    console.log('Attempting login with:', { email: formData.email, password: formData.password ? '[HIDDEN]' : '[EMPTY]' });
    dispatch(loginUser(formData));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Student Manager
          </Typography>
          <Typography component="h2" variant="h6" color="textSecondary" gutterBottom>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
            
            {/* Debug Section */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <IconButton
                size="small"
                onClick={() => setShowDebug(!showDebug)}
                sx={{ color: 'text.secondary' }}
              >
                <InfoIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Debug Info
              </Typography>
            </Box>
            
            <Collapse in={showDebug}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>localStorage Status:</strong> {localStorageStatus}
                </Typography>
                <Typography variant="body2">
                  <strong>Test User:</strong> admin@test.com / password123
                </Typography>
                <Typography variant="body2">
                  <strong>Current State:</strong> {loading ? 'Loading' : 'Ready'}
                </Typography>
                {error && (
                  <Typography variant="body2" color="error">
                    <strong>Error:</strong> {error}
                  </Typography>
                )}
              </Alert>
            </Collapse>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
