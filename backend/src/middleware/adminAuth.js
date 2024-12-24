const adminAuth = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Không có quyền truy cập' });
  }
};

module.exports = adminAuth; 