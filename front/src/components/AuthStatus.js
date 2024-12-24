import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthStatus.css';

const AuthStatus = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="auth-status">
      {user ? (
        <div className="user-menu">
          <span className="welcome-text">Xin chào, {user.fullName}</span>
          <div className="dropdown-menu">
            <Link to="/my-bookings" className="menu-item">
              Lịch sử đặt bàn
            </Link>
            <button onClick={handleLogout} className="menu-item logout">
              Đăng xuất
            </button>
          </div>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="auth-btn">Đăng nhập</Link>
          <Link to="/register" className="auth-btn register">Đăng ký</Link>
        </div>
      )}
    </div>
  );
};

export default AuthStatus; 