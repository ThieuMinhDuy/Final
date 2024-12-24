const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Booking, User, BookingItem, Menu } = require('../models');

// Lấy lịch sử đặt bàn của khách hàng
router.get('/history', auth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: BookingItem,
          as: 'bookingItems',
          attributes: ['id', 'menuItemId', 'quantity', 'price', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        ...booking.toJSON(),
        date: booking.date,
        time: booking.time,
        status: booking.status,
        total: Number(booking.total),
        deposit: Number(booking.deposit),
        bookingItems: booking.bookingItems.map(item => ({
          ...item.toJSON(),
          price: Number(item.price)
        }))
      }))
    });
  } catch (error) {
    console.error('Error getting booking history:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
});

// Tạo đặt bàn mới
router.post('/create', auth, async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    console.log('User from token:', req.user);

    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    const booking = await Booking.create({
      userId: userId,
      date: req.body.date,
      time: req.body.time,
      guests: req.body.guests,
      tableType: req.body.tableType,
      total: req.body.total,
      deposit: req.body.deposit,
      paymentMethod: req.body.paymentMethod,
      note: req.body.note,
      status: 'pending'
    });

    // Tạo booking items nếu có
    if (req.body.items && req.body.items.length > 0) {
      await BookingItem.bulkCreate(
        req.body.items.map(item => ({
          bookingId: booking.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        }))
      );
    }

    // Lấy thông tin booking vừa tạo kèm theo items
    const bookingWithItems = await Booking.findOne({
      where: { id: booking.id },
      include: [{
        model: BookingItem,
        as: 'bookingItems'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Đặt bàn thành công, vui lòng chờ admin xác nhận',
      booking: bookingWithItems
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt bàn',
      error: error.message
    });
  }
});

// Route cho admin xem tất cả bookings
router.get('/admin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Không có quyền truy cập' 
      });
    }

    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ['fullName', 'email', 'phone']
        },
        {
          model: BookingItem,
          as: 'bookingItems',
          attributes: ['id', 'menuItemId', 'quantity', 'price', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('Bookings found:', bookings.length);

    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        ...booking.toJSON(),
        date: booking.date,
        time: booking.time,
        status: booking.status,
        total: Number(booking.total),
        deposit: Number(booking.deposit),
        bookingItems: booking.bookingItems.map(item => ({
          ...item.toJSON(),
          price: Number(item.price)
        }))
      }))
    });
  } catch (error) {
    console.error('Error getting admin bookings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
});

// Admin xác nhận/từ chối booking
router.put('/admin/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking' });
    }

    booking.status = status;
    await booking.save();

    res.json({ 
      message: 'Cập nhật trạng thái thành công', 
      booking 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route để lấy giá bàn
router.get('/table-price', (req, res) => {
  const { tableType, guestsNum } = req.query;
  
  if (!tableType || !guestsNum) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  const price = getTablePrice(tableType, parseInt(guestsNum));
  res.json({ price });
});

module.exports = router; 