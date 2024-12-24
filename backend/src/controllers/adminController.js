const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const { Booking } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', { email, password });

    // Log để kiểm tra kết nối database
    try {
      await sequelize.authenticate();
      console.log('Database connection OK');
    } catch (err) {
      console.error('Database connection failed:', err);
    }

    // Log để kiểm tra tìm user
    const user = await User.findOne({ 
      where: { email, role: 'admin' },
      raw: true
    });
    console.log('Found user in database:', user);

    if (!user) {
      console.log('Admin not found:', email);
      return res.status(401).json({ 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Log để kiểm tra password
    console.log('Password comparison:');
    console.log('Input password:', password);
    console.log('Stored hash:', user.password);
    console.log('Types:', {
      password: typeof password,
      hash: typeof user.password
    });
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for admin:', email);
      return res.status(401).json({ 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Admin login successful:', email);
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = {
      newBookings: await Booking.count({ where: { createdAt: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) } } }),
      pendingBookings: await Booking.count({ where: { status: 'pending' } }),
      todayBookings: await Booking.count({ where: { date: new Date() } })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: User, attributes: ['fullName'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    await Booking.update(
      { status: 'confirmed' },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Xác nhận đơn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    await Booking.update(
      { status: 'cancelled' },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Từ chối đơn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 