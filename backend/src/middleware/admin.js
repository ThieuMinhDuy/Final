const admin = async (req, res, next) => {
  try {
    // Kiểm tra xem user có role admin không
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Không có quyền truy cập' 
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = admin; 