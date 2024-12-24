exports.getBookingMenu = async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      include: [{
        model: Category,
        attributes: ['name']
      }],
      where: {
        isAvailable: true
      },
      order: [
        ['categoryId', 'ASC'],
        ['name', 'ASC']
      ]
    });

    const formattedMenu = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.Category.name
    }));

    res.json(formattedMenu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Lỗi khi tải menu' });
  }
}; 