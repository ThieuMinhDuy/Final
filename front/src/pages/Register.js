import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import '../styles/Auth.css';
import api from '../config/axiosConfig';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
    setError('');

    try {
      // Kiểm tra mật khẩu khớp nhau
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }

      // Loại bỏ confirmPassword khỏi dữ liệu gửi đi
      const { confirmPassword, ...registerData } = formData;
      
      console.log('Sending register request:', registerData);
      
      const response = await api.post('/auth/register', registerData);
      console.log('Register response:', response.data);
      
      if (response.data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Register error:', error);
      setError(
        error.response?.data?.message || 
        'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
      );
    }
  };

  return (
    <div className="auth-container">
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className="auth-paper">
          <Box className="auth-box">
            <Typography component="h1" variant="h5" className="auth-title">
              Đăng ký tài khoản
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
                id="fullName"
                label="Họ và tên"
                name="fullName"
                autoComplete="name"
                autoFocus
                value={formData.fullName}
                onChange={handleChange}
                className="auth-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Số điện thoại"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="auth-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-submit"
              >
                Đăng ký
              </Button>
              <Box className="auth-links">
                <Typography variant="body2">
                  Đã có tài khoản?{' '}
                  <span 
                    onClick={() => navigate('/login')}
                    className="auth-link"
                  >
                    Đăng nhập ngay
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

export default Register; 