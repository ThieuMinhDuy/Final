import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
          <p>Điện thoại: (028) 1234 5678</p>
          <p>Email: info@pato.com.vn</p>
        </div>
        <div className="footer-section">
          <h3>Giờ mở cửa</h3>
          <p>Thứ 2 - Chủ nhật</p>
          <p>10:00 - 22:00</p>
        </div>
        <div className="footer-section">
          <h3>Theo dõi chúng tôi</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/zuyyyyy">Facebook</a>
            <a href="https://www.instagram.com/18.th.4/">Instagram</a>
            
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Pato Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 