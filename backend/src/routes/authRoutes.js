const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    console.log('1. Nhận request đăng ký');
    const { fullName, email, password, phone } = req.body;
    
    console.log('2. Dữ liệu nhận được:', { 
      fullName, 
      email, 
      phone,
      passwordLength: password ? password.length : 0
    });

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    try {
      console.log('3. Bắt đầu tạo user');
      const hashedPassword = await bcrypt.hash(String(password), 10);
      
      console.log('4. Password đã hash:', {
        originalLength: password.length,
        hashedLength: hashedPassword.length
      });

      const user = await User.create({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: 'user',
        status: 'active'
      });

      console.log('5. User đã tạo thành công:', {
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Kiểm tra JWT_SECRET
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET không được cấu hình');
      }

      // Tạo token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });

    } catch (dbError) {
      console.error('Lỗi khi tạo user:', dbError);
      console.error('Chi tiết lỗi:', {
        name: dbError.name,
        message: dbError.message,
        errors: dbError.errors
      });
      throw new Error('Không thể tạo tài khoản: ' + dbError.message);
    }

  } catch (error) {
    console.error('Lỗi tổng thể:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('1. Request body:', {
      email,
      passwordReceived: !!password,
      passwordLength: password?.length
    });

    // Tìm user theo email
    const user = await User.findOne({ 
      where: { email },
      raw: true 
    });

    console.log('3. Kết quả tìm user:', {
      found: !!user,
      userEmail: user?.email,
      userRole: user?.role,
      hasPassword: !!user?.password
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const passwordToCompare = password.trim();

    console.log('5. Chuẩn bị so sánh password:', {
      rawPassword: password,
      trimmedPassword: passwordToCompare,
      inputLength: passwordToCompare.length,
      hashedLength: user.password.length
    });

    const isValidPassword = await bcrypt.compare(passwordToCompare, user.password);
    const isValidRaw = await bcrypt.compare(password, user.password);

    console.log('6. Kết quả so sánh password:', {
      withTrimmed: isValidPassword,
      withRaw: isValidRaw
    });

    if (!isValidPassword && !isValidRaw) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra JWT_SECRET trước khi sử dụng
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({
        success: false,
        message: 'Lỗi cấu hình server'
      });
    }

    // Tạo token với JWT_SECRET từ biến môi trường
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('7. Đăng nhập thành công:', {
      userId: user.id,
      userRole: user.role
    });

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
});

router.get('/check-users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'fullName', 'role', 'createdAt']
    });
    console.log('All users:', users);
    res.json({ users });
  } catch (error) {
    console.error('Error checking users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route kiểm tra user
router.get('/check-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'fullName', 'role', 'createdAt', 'password']
    });

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy tài khoản'
      });
    }

    // Chỉ hiển thị một phần của password hash để bảo mật
    const maskedUser = {
      ...user.toJSON(),
      password: user.password.substring(0, 20) + '...'
    };

    res.json({
      message: 'Thông tin tài khoản:',
      user: maskedUser
    });
  } catch (error) {
    console.error('Lỗi kiểm tra user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route test
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API đang hoạt động' });
});

module.exports = router; 