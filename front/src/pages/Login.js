import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="auth-container">
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className="auth-paper">
          <Box className="auth-box">
            <Typography component="h1" variant="h5" className="auth-title">
              Đăng nhập
            </Typography>
            {error && (
              <Typography color="error" className="auth-error">
                {error}
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} className="auth-form">
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-submit"
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng nhập
              </Button>
              <Box className="auth-links">
                <Typography variant="body2">
                  Chưa có tài khoản?{' '}
                  <span 
                    onClick={() => navigate('/register')}
                    className="auth-link"
                  >
                    Đăng ký ngay
                  </span>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login; 