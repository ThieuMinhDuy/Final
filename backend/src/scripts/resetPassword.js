const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function resetPassword() {
  try {
    await sequelize.authenticate();
    console.log('1. Kết nối database thành công');

    const email = 'minhduy7c@gmail.com';
    const newPassword = '123456';

    // Hash password mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('2. Password mới đã hash:', {
      originalPassword: newPassword,
      salt: salt,
      hashedPassword: hashedPassword
    });

    // Cập nhật trong database
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
      raw: true
    });

    // Test password mới
    const isValid = await bcrypt.compare(newPassword, user.password);
    console.log('3. Kiểm tra password sau khi cập nhật:', {
      email: user.email,
      storedHash: user.password,
      testPassword: newPassword,
      isValid: isValid
    });

    console.log('4. Thông tin đăng nhập mới:');
    console.log('Email:', email);
    console.log('Password:', newPassword);

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    process.exit();
  }
}

resetPassword(); 