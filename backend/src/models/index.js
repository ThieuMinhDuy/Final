const { sequelize } = require('../config/database');
const Menu = require('./Menu');
const Category = require('./Category');
const User = require('./User');
const Booking = require('./Booking');
const BookingItem = require('./BookingItem');

// Định nghĩa các mối quan hệ
Menu.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Category.hasMany(Menu, {
  foreignKey: 'categoryId',
  as: 'menuItems'
});

// User - Booking
User.hasMany(Booking, {
  foreignKey: 'userId'
});

Booking.belongsTo(User, {
  foreignKey: 'userId'
});

// Booking - BookingItem
Booking.hasMany(BookingItem, {
  foreignKey: 'bookingId',
  as: 'bookingItems'
});

BookingItem.belongsTo(Booking, {
  foreignKey: 'bookingId'
});

// BookingItem - Menu
BookingItem.belongsTo(Menu, { 
  foreignKey: 'menuItemId',
  as: 'menuItem' 
});

Menu.hasMany(BookingItem, { 
  foreignKey: 'menuItemId',
  as: 'bookingItems' 
});

module.exports = {
  sequelize,
  Menu,
  Category,
  User,
  Booking,
  BookingItem
}; 