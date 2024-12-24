const express = require('express');
const router = express.Router();

// Route kiểm tra bàn trống
router.get('/available', async (req, res) => {
  try {
    const { date, time, guests } = req.query;
    
    // Logic kiểm tra bàn trống dựa trên date, time và số lượng khách
    const availableTables = [
      { id: 1, type: 'standard', capacity: 4, price: 0 },
      { id: 2, type: 'vip', capacity: 6, price: 200000 },
      { id: 3, type: 'family', capacity: 8, price: 100000 }
    ].filter(table => table.capacity >= parseInt(guests));

    res.json(availableTables);
  } catch (error) {
    console.error('Error checking available tables:', error);
    res.status(500).json({ message: 'Lỗi khi kiểm tra bàn trống' });
  }
});

module.exports = router; 