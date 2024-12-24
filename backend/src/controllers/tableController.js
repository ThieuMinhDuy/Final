exports.getAvailableTables = async (req, res) => {
  try {
    const { date, time, guests } = req.query;
    
    // Logic kiểm tra bàn trống dựa trên date, time và số lượng khách
    const tables = await Table.findAll({
      where: {
        capacity: {
          [Op.gte]: guests // Lấy các bàn có sức chứa >= số khách
        },
        // Thêm logic kiểm tra bàn đã được đặt chưa
      }
    });

    res.json(tables);
  } catch (error) {
    console.error('Error getting available tables:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 