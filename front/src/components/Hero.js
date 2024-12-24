import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>PATO RESTAURANT</h1>
        <p className="subtitle">Fine Dining Experience</p>
        <div className="hero-buttons">
          <Link to="/menu" className="btn-primary">Xem Thực Đơn</Link>
          <Link to="/booking" className="btn-secondary">Đặt Bàn</Link>
        </div>
      </div>
    </div>
  );
};

export default Hero; 


