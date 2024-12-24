const { User } = require('../models');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

async function checkPasswordHandling() {
  try {
    await sequelize.authenticate();
    console.log('1. Kết nối database thành công\n');

    // Lấy thông tin user cụ thể
    const email = 'minhduy7c@gmail.com';
    const user = await User.findOne({
      where: { email },
      raw: true
    });

    if (!user) {
      console.log('Không tìm thấy user với email:', email);
      return;
    }

    console.log('2. Thông tin user:');
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    console.log('- Password hash trong DB:', user.password);
    console.log('- Độ dài password hash:', user.password.length);

    // Test các trường hợp password khác nhau
    const testCases = [
      { input: '123456', desc: 'Password đúng' },
      { input: 123456, desc: 'Password dạng số' },
      { input: ' 123456', desc: 'Password có space đầu' },
      { input: '123456 ', desc: 'Password có space cuối' },
      { input: '', desc: 'Password rỗng' },
      { input: null, desc: 'Password null' },
      { input: undefined, desc: 'Password undefined' }
    ];

    console.log('\n3. Test các trường hợp password:');
    for (const test of testCases) {
      try {
        const inputAsString = String(test.input || '');
        const isValid = await bcrypt.compare(inputAsString, user.password);
        
        console.log(`\nTest case: ${test.desc}`);
        console.log('- Input gốc:', test.input);
        console.log('- Input sau khi convert:', inputAsString);
        console.log('- Độ dài input:', inputAsString.length);
        console.log('- Kết quả:', isValid ? 'ĐÚNG ✓' : 'SAI ✗');
      } catch (err) {
        console.log(`\nTest case: ${test.desc}`);
        console.log('- Lỗi:', err.message);
      }
    }

    // Tạo hash mới để so sánh
    console.log('\n4. So sánh hash:');
    const correctPassword = '123456';
    const newHash = await bcrypt.hash(correctPassword, 10);
    console.log('- Password gốc:', correctPassword);
    console.log('- Hash trong DB:', user.password);
    console.log('- Hash mới tạo:', newHash);
    console.log('- Độ dài hash trong DB:', user.password.length);
    console.log('- Độ dài hash mới:', newHash.length);

    // Kiểm tra hash mới
    const isValidWithNewHash = await bcrypt.compare(correctPassword, newHash);
    console.log('\n5. Kiểm tra hash mới:');
    console.log('- Kết quả:', isValidWithNewHash ? 'ĐÚNG ✓' : 'SAI ✗');

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    process.exit();
  }
}

checkPasswordHandling(); 