import React from 'react';
import '../styles/RestaurantIntro.css';
import chefImage from '../assets/images/chef.jpg';
import interiorImage from '../assets/images/interior.jpg';

const RestaurantIntro = () => {
  return (
    <section className="restaurant-intro">
      <div className="container">
        <div className="intro-header">
          <span className="subtitle">Di Sản & Đẳng Cấp</span>
          <h2>Hành Trình 15 Năm Phát Triển</h2>
        </div>

        <div className="story-section">
          <div className="story-content">
            <div className="story-text">
              <h3>Khởi Nguồn</h3>
              <p>
                Từ một nhà hàng nhỏ vào năm 2010, Pato đã phát triển thành một thương hiệu ẩm thực 
                danh tiếng với 5 chi nhánh trên toàn quốc. Chúng tôi tự hào là nơi hội tụ của những 
                đầu bếp tài năng từ khắp nơi trên thế giới, mang đến trải nghiệm ẩm thực độc đáo 
                kết hợp giữa hương vị Á - Âu.
              </p>
            </div>
            <div className="story-image">
              <img src={interiorImage} alt="Không gian nhà hàng" />
            </div>
          </div>
        </div>

        <div className="achievement-section">
          <div className="achievement-grid">
            <div className="achievement-item">
              <span className="number">5</span>
              <p>Chi Nhánh Trên Toàn Quốc</p>
            </div>
            <div className="achievement-item">
              <span className="number">200+</span>
              <p>Nhân Viên Chuyên Nghiệp</p>
            </div>
            <div className="achievement-item">
              <span className="number">50+</span>
              <p>Giải Thưởng Ẩm Thực</p>
            </div>
            <div className="achievement-item">
              <span className="number">1M+</span>
              <p>Thực Khách Hài Lòng</p>
            </div>
          </div>
        </div>

        <div className="chef-section">
          <div className="chef-content">
            <div className="chef-image">
              <img src={chefImage} alt="Bếp trưởng" />
            </div>
            <div className="chef-text">
              <h3>Đội Ngũ Bếp Trưởng Quốc Tế</h3>
              <p>
                Mỗi chi nhánh của Pato được dẫn dắt bởi một bếp trưởng quốc tế với kinh nghiệm 
                từ các nhà hàng đạt sao Michelin. Họ không chỉ là những người đầu bếp tài năng 
                mà còn là những nghệ nhân ẩm thực, không ngừng sáng tạo để mang đến những trải 
                nghiệm ẩm thực độc đáo cho thực khách.
              </p>
            </div>
          </div>
        </div>

        <div className="milestone-section">
          <h3>Dấu Ấn Phát Triển</h3>
          <div className="milestone-grid">
            <div className="milestone-item">
              <span className="year">2010</span>
              <h4>Thành Lập</h4>
              <p>Chi nhánh đầu tiên tại Quận 1, TP.HCM</p>
            </div>
            <div className="milestone-item">
              <span className="year">2015</span>
              <h4>Mở Rộng</h4>
              <p>3 chi nhánh mới tại Hà Nội và Đà Nẵng</p>
            </div>
            <div className="milestone-item">
              <span className="year">2018</span>
              <h4>Giải Thưởng</h4>
              <p>Top 10 nhà hàng fine-dining tốt nhất Việt Nam</p>
            </div>
            <div className="milestone-item">
              <span className="year">2023</span>
              <h4>Phát Triển</h4>
              <p>Ra mắt thương hiệu ẩm thực cao cấp mới</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantIntro; 