const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function updatePassword(email, newPassword) {
  try {
    // Hash password mới
    const hashedPassword = await bcrypt.hash(String(newPassword), 10);
    console.log('Password mới đã hash:', hashedPassword);

    // Cập nhật password trong database
    const result = await User.update(
      { password: hashedPassword },
      { where: { email } }
    );

    if (result[0] === 0) {
      console.log('Không tìm thấy user với email:', email);
      return;
    }

    // Kiểm tra lại
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email', 'password']
    });
    
    console.log('Đã cập nhật password cho user:', {
      email: user.email,
      newHashedPassword: user.password
    });

  } catch (error) {
    console.error('Lỗi cập nhật password:', error);
  } finally {
    process.exit();
  }
}

// Chạy script với email và password mới
updatePassword('minhduy7c@gmail.com', '123456'); 