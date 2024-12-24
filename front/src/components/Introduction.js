import React from 'react';
import '../styles/Introduction.css';
import introImage from '../assets/images/intro-bg.jpg';

const Introduction = () => {
  return (
    <section className="intro-section">
      <div className="container">
        <div className="intro-content">
          <div className="intro-text">
            <span className="subtitle">Chào mừng đến với Pato</span>
            <h2>Nhà Hàng Ẩm Thực Đẳng Cấp</h2>
            <p>
              Pato là điểm đến ẩm thực độc đáo tại trung tâm thành phố, nơi hội tụ của nghệ thuật ẩm thực và không gian sang trọng. 
              Chúng tôi tự hào mang đến cho quý khách những trải nghiệm ẩm thực tinh tế với các món ăn được chế biến từ những nguyên liệu 
              tươi ngon nhất, dưới bàn tay của các đầu bếp đẳng cấp quốc tế.
            </p>
            <div className="intro-stats">
              <div className="stat">
                <span className="number">15+</span>
                <span className="label">Năm Kinh Nghiệm</span>
              </div>
              <div className="stat">
                <span className="number">50+</span>
                <span className="label">Đầu Bếp Chuyên Nghiệp</span>
              </div>
              <div className="stat">
                <span className="number">100+</span>
                <span className="label">Món Ăn Đặc Biệt</span>
              </div>
            </div>
          </div>
          <div className="intro-image">
            <img src={introImage} alt="Pato Restaurant Interior" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction; 