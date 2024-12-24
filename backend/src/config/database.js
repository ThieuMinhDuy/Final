const { Sequelize } = require('sequelize');
require('dotenv').config();

// Log để debug
console.log('Environment variables:', {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  jwtSecret: process.env.JWT_SECRET ? 'Loaded' : 'Not loaded'
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'pato_restaurant',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '', 
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test kết nối
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { sequelize }; 