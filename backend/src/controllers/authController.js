const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    console.log('Thông tin đăng ký:', { 
      fullName, 
      email, 
      phone,
      passwordLength: password ? password.length : 0
    });

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password với salt rounds = 10
    const hashedPassword = await bcrypt.hash(String(password), 10);
    console.log('Password đã hash:', {
      originalLength: password.length,
      hashedLength: hashedPassword.length,
      hashPreview: hashedPassword.substring(0, 20) + '...'
    });

    // Tạo user mới
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: 'user',
      status: 'active'
    });

    console.log('Đã tạo user:', {
      id: user.id,
      email: user.email,
      passwordHashLength: user.password.length
    });

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

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    const user = await User.findOne({ 
      where: { email },
      raw: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const isValidPassword = await bcrypt.compare(String(password), user.password);
    console.log('Password comparison:', {
      input: String(password),
      stored: user.password,
      isValid: isValidPassword
    });

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}; 