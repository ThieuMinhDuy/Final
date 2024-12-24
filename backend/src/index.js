const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const checkEnv = require('./config/checkEnv');

// Kiểm tra biến môi trường trước khi khởi động server
checkEnv();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Log để debug
console.log('Environment check:', {
  port: process.env.PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  jwtSecret: process.env.JWT_SECRET ? 'Loaded' : 'Not loaded',
  envPath: path.join(__dirname, '../.env')
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Có lỗi xảy ra!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Kiểm tra xem JWT_SECRET đã được load chưa
console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

// Khởi động server sau khi kết nối database thành công
sequelize.authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Không thể kết nối database:', err);
    process.exit(1);
  }); 