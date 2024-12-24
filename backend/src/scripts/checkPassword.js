const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function checkAndResetPassword() {
  try {
    await sequelize.authenticate();
    console.log('1. Kết nối database thành công');

    const email = 'minhduy7c@gmail.com';
    const correctPassword = '123456';

    // Lấy thông tin user hiện tại
    const user = await User.findOne({ 
      where: { email },
      raw: true 
    });

    console.log('2. Thông tin user hiện tại:', {
      email: user.email,
      currentHash: user.password
    });

    // Tạo hash mới và cập nhật
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(correctPassword, salt);
    
    // Cập nhật password mới
    await User.update(
      { password: newHash },
      { where: { email } }
    );

    console.log('3. Đã cập nhật password:', {
      email,
      newPassword: correctPassword,
      newHash: newHash
    });

    // Kiểm tra lại
    const updatedUser = await User.findOne({ 
      where: { email },
      raw: true 
    });

    const isValid = await bcrypt.compare(correctPassword, updatedUser.password);
    console.log('4. Kiểm tra password mới:', {
      isValid,
      password: correctPassword,
      hash: updatedUser.password
    });

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    process.exit();
  }
}

checkAndResetPassword(); 