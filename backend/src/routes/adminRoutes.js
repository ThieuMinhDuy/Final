const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');
const { Menu, Category } = require('../models');
const Testimonial = require('../models/Testimonial');
const Booking = require('../models/Booking');
const { BookingItem, MenuItem } = require('../models');
const { Op } = require('sequelize');

// Route test kết nối database
router.get('/test-connection', async (req, res) => {
  try {
    // Test kết nối database
    const users = await User.findAll({
      where: { role: 'admin' }
    });
    
    console.log('Found admin users:', users);
    
    res.json({
      message: 'Kết nối database thành công',
      adminUsers: users
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      message: 'Lỗi kết nối database',
      error: error.message
    });
  }
});

// Route đăng nhập admin
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm admin theo email
    const admin = await User.findOne({
      where: { 
        email: email,
        role: 'admin'
      }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false, 
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const token = jwt.sign(
      { 
        userId: admin.id,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Các route cần bảo vệ
router.get('/stats', auth, admin, async (req, res) => {
  try {
    // Đếm tổng số món ăn
    const totalMenuItems = await Menu.count();
    
    // Đếm số đơn đặt bàn mới trong 24h qua
    const newBookings = await Booking.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Đếm số đơn chờ xác nhận
    const pendingBookings = await Booking.count({
      where: { status: 'pending' }
    });

    res.json({
      success: true,
      stats: {
        totalMenuItems,
        newBookings,
        pendingBookings
      }
    });

  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});
router.get('/bookings', auth, admin, adminController.getBookings);
router.put('/bookings/:id/confirm', auth, admin, adminController.confirmBooking);
router.put('/bookings/:id/reject', auth, admin, adminController.rejectBooking);

// Route test API
router.get('/test', (req, res) => {
  res.json({ message: 'Admin API hoạt động bình thường' });
});

// Route test để kiểm tra tài khoản admin
router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({
      where: { role: 'admin' },
      attributes: ['id', 'email', 'fullName', 'role', 'createdAt'] 
    });
    
    if (!admin) {
      return res.status(404).json({
        message: 'Không tìm thấy tài khoản admin'
      });
    }
    
    res.json({
      message: 'Tìm thấy tài khoản admin',
      admin
    });
  } catch (error) {
    console.error('Lỗi kiểm tra admin:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy danh sách testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      include: [{
        model: User,
        attributes: ['fullName']
      }]
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Duyệt testimonial
router.put('/testimonials/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.update(
      { isApproved: true },
      { where: { id } }
    );
    res.json({ message: 'Duyệt thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa testimonial
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.destroy({ where: { id } });
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy danh sách menu
router.get('/menu', async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name']
      }],
      order: [['id', 'DESC']]
    });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy danh sách đặt bàn
router.get('/bookings', auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ['fullName', 'email', 'phone']
        },
        {
          model: BookingItem,
          include: [{
            model: MenuItem,
            attributes: ['name']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking.id,
        customerName: booking.User.fullName,
        customerEmail: booking.User.email,
        customerPhone: booking.User.phone,
        date: booking.date,
        time: booking.time,
        guests: booking.numberOfGuests,
        tableType: booking.tableType,
        status: booking.status,
        total: Number(booking.total),
        deposit: Number(booking.deposit),
        isPaid: booking.isPaid,
        note: booking.note,
        createdAt: booking.createdAt,
        items: booking.BookingItems?.map(item => ({
          name: item.MenuItem.name,
          quantity: item.quantity,
          price: Number(item.price)
        }))
      }))
    });

  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt bàn:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Route cập nhật trạng thái đặt bàn
router.put('/bookings/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt bàn'
      });
    }

    booking.status = status;
    await booking.save();

    return res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công'
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Lấy danh sách users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'phone', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm món mới
router.post('/menu', async (req, res) => {
  try {
    const menuItem = await Menu.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Lỗi khi thêm món' });
  }
});

// Cập nhật món
router.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.update(req.body, { where: { id } });
    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật món' });
  }
});

// Lấy danh sách categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router; 