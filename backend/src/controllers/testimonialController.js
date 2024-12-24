const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

// Tạo đánh giá mới
exports.createTestimonial = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const testimonial = await Testimonial.create({
      userId: req.user.id,
      rating,
      comment,
      isApproved: false // Mặc định chưa được duyệt
    });

    res.status(201).json({
      message: 'Cảm ơn bạn đã đánh giá',
      testimonial
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách đánh giá đã được duyệt
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isApproved: true },
      include: [{
        model: User,
        attributes: ['fullName'] // Chỉ lấy tên người đánh giá
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Admin: Duyệt đánh giá
exports.approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }

    testimonial.isApproved = true;
    await testimonial.save();

    res.json({
      message: 'Đã duyệt đánh giá',
      testimonial
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Admin: Lấy tất cả đánh giá (cả chưa duyệt)
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      include: [{
        model: User,
        attributes: ['fullName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa đánh giá
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }

    await testimonial.destroy();

    res.json({ message: 'Đã xóa đánh giá' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 