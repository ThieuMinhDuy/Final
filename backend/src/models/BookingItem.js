const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BookingItem = sequelize.define('BookingItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  menuItemId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = BookingItem; 