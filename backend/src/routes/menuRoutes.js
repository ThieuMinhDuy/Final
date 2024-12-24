const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const Category = require('../models/Category');

// Route cho trang đặt bàn - đây là route chính cho /api/menu
router.get('/', async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      include: [{
        model: Category,
        as: 'category',  // Phải khớp với alias trong models/index.js
        attributes: ['name']
      }],
      where: {
        isAvailable: true
      },
      attributes: ['id', 'name', 'description', 'price', 'categoryId'],
      order: [['categoryId', 'ASC']]
    });

    const formattedMenu = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category?.name || 'Khác'
    }));

    res.json(formattedMenu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Lỗi khi tải menu' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['id', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Lỗi khi tải danh mục' });
  }
});

// Route cho khách hàng xem menu
router.get('/public', async (req, res) => {
  try {
    // Lấy tất cả categories
    const categories = await Category.findAll({
      order: [['id', 'ASC']]
    });

    // Lấy menu items và group theo category
    const menuItems = await Menu.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name']
      }],
      where: {
        isAvailable: true
      },
      order: [['categoryId', 'ASC']]
    });

    // Format dữ liệu theo category
    const menu = {};
    categories.forEach(category => {
      const items = menuItems.filter(item => 
        item.category && item.category.name === category.name
      ).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price
      }));
      
      if (items.length > 0) {
        menu[category.name] = items;
      }
    });

    console.log('Menu data:', menu);
    res.json(menu);
  } catch (error) {
    console.error('Error getting menu:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thực đơn' });
  }
});

module.exports = router; 