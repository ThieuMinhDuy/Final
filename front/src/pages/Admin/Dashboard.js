import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển Admin
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Thống kê đặt bàn
            </Typography>
            {/* Thêm nội dung thống kê đặt bàn ở đây */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Thống kê doanh thu
            </Typography>
            {/* Thêm nội dung thống kê doanh thu ở đây */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Thống kê người dùng
            </Typography>
            {/* Thêm nội dung thống kê người dùng ở đây */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 