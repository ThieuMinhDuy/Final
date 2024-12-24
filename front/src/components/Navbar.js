import React from 'react';
import { Link } from 'react-router-dom';
import AuthStatus from './AuthStatus';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-logo">
          Pato Restaurant
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Trang chủ</Link>
        <Link to="/about" className="nav-link">Giới thiệu</Link>
        <Link to="/menu" className="nav-link">Thực đơn</Link>
        <Link to="/booking" className="nav-link">Đặt bàn</Link>
        <AuthStatus />
      </div>
    </nav>
  );
};

export default Navbar; 


