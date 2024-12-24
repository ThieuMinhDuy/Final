const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');
require('dotenv').config();

async function createAdmin() {
  try {
    // 1. Test kết nối
    await sequelize.authenticate();
    console.log('1. Kết nối database thành công');

    // 2. Tạo bảng users nếu chưa có
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        fullName varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        phone varchar(20) NOT NULL,
        role enum('user','admin') NOT NULL DEFAULT 'user',
        status enum('active','inactive') NOT NULL DEFAULT 'active',
        createdAt datetime NOT NULL,
        updatedAt datetime NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('2. Đã tạo/kiểm tra bảng users');

    // 3. Tạo bảng categories
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        description text,
        createdAt datetime NOT NULL,
        updatedAt datetime NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('3. Đã tạo/kiểm tra bảng categories');

    // 3.1 Tạo bảng menus
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        description text,
        price decimal(10,2) NOT NULL,
        categoryId int(11) NOT NULL,
        isAvailable boolean DEFAULT true,
        createdAt datetime NOT NULL,
        updatedAt datetime NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE NO ACTION ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('3.1 Đã tạo/kiểm tra bảng menus');

    // 4. Xóa dữ liệu cũ
    await sequelize.query("DELETE FROM menus");
    await sequelize.query("DELETE FROM categories");
    await sequelize.query("DELETE FROM users WHERE role = 'admin'");
    console.log('4. Đã xóa dữ liệu cũ');

    // 5. Tạo admin mới
    const hashedPassword = await bcrypt.hash('123456', 10);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await sequelize.query(`
      INSERT INTO users (fullName, email, password, phone, role, status, createdAt, updatedAt)
      VALUES (
        'Super Admin',
        'admin@gmail.com',
        '${hashedPassword}',
        '0123456789',
        'admin',
        'active',
        '${now}',
        '${now}'
      )
    `);

    // 6. Thêm các danh mục
    const categories = [
      ['Khai Vị', 'Các món khai vị đặc sắc'],
      ['Món Chính', 'Các món ăn chính đặc trưng'],
      ['Món Phụ', 'Các món ăn kèm'],
      ['Tráng Miệng', 'Các món tráng miệng ngọt ngào'],
      ['Đồ Uống', 'Nước uống các loại']
    ];

    for (const [name, description] of categories) {
      await sequelize.query(`
        INSERT INTO categories (name, description, createdAt, updatedAt)
        VALUES ('${name}', '${description}', '${now}', '${now}')
      `);
    }

    console.log('==========================================');
    console.log('KHỞI TẠO DỮ LIỆU THÀNH CÔNG!');
    console.log('1. Tài khoản admin:');
    console.log('   - Email: admin@gmail.com');
    console.log('   - Password: 123456');
    console.log('2. Các danh mục đã được tạo:');
    console.log('   - Khai Vị');
    console.log('   - Món Chính');
    console.log('   - Món Phụ'); 
    console.log('   - Tráng Miệng');
    console.log('   - Đồ Uống');
    console.log('==========================================');

    // 7. Kiểm tra lại
    const [adminResult] = await sequelize.query(
      "SELECT * FROM users WHERE role = 'admin'",
      { raw: true }
    );
    const [categoryResult] = await sequelize.query(
      "SELECT * FROM categories",
      { raw: true }
    );

    console.log('Thông tin admin:', adminResult[0]);
    console.log('Danh sách categories:', categoryResult);

  } catch (error) {
    console.error('LỖI:', error);
  } finally {
    process.exit();
  }
}

createAdmin(); 