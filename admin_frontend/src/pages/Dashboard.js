import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    newBookings: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      setError('Không thể tải thống kê');
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#e3f2fd'
            }}
          >
            <RestaurantIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
            <Typography variant="h4" component="div">
              {stats.totalMenuItems}
            </Typography>
            <Typography color="textSecondary">Tổng số món ăn</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#e8f5e9'
            }}
          >
            <BookOnlineIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h4" component="div">
              {stats.newBookings}
            </Typography>
            <Typography color="textSecondary">Đơn đặt bàn mới (24h)</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#fff3e0'
            }}
          >
            <PendingActionsIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 2 }} />
            <Typography variant="h4" component="div">
              {stats.pendingBookings}
            </Typography>
            <Typography color="textSecondary">Đơn chờ xác nhận</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 