const { Booking, User } = require('../models');
const getTablePrice = require('../utils/tablePrice');

exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    console.log('Received booking data:', JSON.stringify(bookingData, null, 2));

    // Validate required fields
    const requiredFields = [
      'date', 'time', 'guests', 'tableType', 
      'tablePrice', 'itemsTotal', 'subtotal', 
      'total', 'deposit', 'paymentMethod'
    ];

    const missingFields = requiredFields.filter(field => 
      bookingData[field] === undefined || bookingData[field] === null
    );

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Convert numeric fields
    const numericFields = ['tablePrice', 'itemsTotal', 'subtotal', 'total', 'deposit'];
    numericFields.forEach(field => {
      bookingData[field] = Number(bookingData[field]);
    });

    // Tạo booking
    const booking = await Booking.create({
      userId: req.user.id,
      ...bookingData
    });

    console.log('Created booking:', booking.toJSON());

    // Tạo booking items
    if (bookingData.items?.length > 0) {
      const bookingItems = await BookingItem.bulkCreate(
        bookingData.items.map(item => ({
          bookingId: booking.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: Number(item.price),
          name: item.name
        }))
      );
      console.log('Created booking items:', bookingItems);
    }

    res.status(201).json({
      message: 'Đặt bàn thành công, vui lòng chờ admin xác nhận',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      message: 'Lỗi khi tạo đơn đặt bàn',
      error: error.message
    });
  }
};

// Lấy danh sách đặt bàn của user
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{
        model: BookingItem,
        as: 'bookingItems'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật trạng thái đặt bàn
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findOne({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Cập nhật thành công',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Hủy đặt bàn
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Hủy đặt bàn thành công',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 