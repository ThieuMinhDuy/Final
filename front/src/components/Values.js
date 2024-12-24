import React from 'react';
import '../styles/Values.css';
import { FaLeaf, FaAward, FaHeart, FaUsers } from 'react-icons/fa';

const Values = () => {
  return (
    <section className="values-section">
      <div className="container">
        <div className="values-header">
          <span className="subtitle">Giá Trị Cốt Lõi</span>
          <h2>Những Giá Trị Chúng Tôi Mang Lại</h2>
        </div>
        <div className="values-grid">
          <div className="value-item">
            <FaLeaf className="value-icon" />
            <h3>Nguyên Liệu Tươi Sạch</h3>
            <p>Chúng tôi cam kết sử dụng những nguyên liệu tươi ngon nhất, được tuyển chọn kỹ lưỡng từ các nhà cung cấp uy tín.</p>
          </div>
          <div className="value-item">
            <FaAward className="value-icon" />
            <h3>Chất Lượng Đẳng Cấp</h3>
            <p>Mỗi món ăn được chế biến với sự tỉ mỉ và tâm huyết, đảm bảo chất lượng cao nhất cho thực khách.</p>
          </div>
          <div className="value-item">
            <FaHeart className="value-icon" />
            <h3>Dịch Vụ Tận Tâm</h3>
            <p>Đội ngũ nhân viên chuyên nghiệp, tận tâm, luôn sẵn sàng phục vụ quý khách với nụ cười thân thiện.</p>
          </div>
          <div className="value-item">
            <FaUsers className="value-icon" />
            <h3>Trải Nghiệm Độc Đáo</h3>
            <p>Không chỉ là bữa ăn, chúng tôi mang đến trải nghiệm ẩm thực độc đáo và đáng nhớ.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values; 