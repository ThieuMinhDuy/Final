const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Họ tên không được để trống'
      },
      len: {
        args: [2, 50],
        msg: 'Họ tên phải từ 2-50 ký tự'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email đã được sử dụng'
    },
    validate: {
      notEmpty: {
        msg: 'Email không được để trống'
      },
      isEmail: {
        msg: 'Email không hợp lệ'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Mật khẩu không được để trống'
      },
      len: {
        args: [6, 100],
        msg: 'Mật khẩu phải từ 6-100 ký tự'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^[0-9]{10,11}$/i,
        msg: 'Số điện thoại không hợp lệ'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    validate: {
      isIn: {
        args: [['user', 'admin']],
        msg: 'Vai trò không hợp lệ'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['active', 'inactive']],
        msg: 'Trạng thái không hợp lệ'
      }
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.email) {
        user.email = user.email.toLowerCase().trim();
      }
      if (user.fullName) {
        user.fullName = user.fullName.trim();
      }
      if (user.phone) {
        user.phone = user.phone.trim();
      }
    }
  }
});

module.exports = User; 