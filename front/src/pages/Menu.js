import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import axios from 'axios';

// Import ảnh cho slider
import menuSlide1 from '../assets/images/menu-slide-1.jpg';
import menuSlide2 from '../assets/images/menu-slide-2.jpg';
import menuSlide3 from '../assets/images/menu-slide-3.jpg';

const menuSlides = [
  {
    image: menuSlide1,
    title: 'Ẩm Thực Đẳng Cấp',
    description: 'Khám phá hương vị tinh tế'    
  },
  {
    image: menuSlide2,
    title: 'Nghệ Thuật Ẩm Thực',
    description: 'Trải nghiệm độc đáo'
  },
  {
    image: menuSlide3,
    title: 'Hương Vị Tuyệt Hảo',
    description: 'Từ những nguyên liệu tươi ngon nhất'
  }
];

const Menu = () => {
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    console.log('MenuData changed:', menuData);
  }, [menuData]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/menu/public');
      console.log('Menu data:', res.data);
      setMenuData(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1000}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          className="menu-slider"
        >
          {menuSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div 
                className="menu-slide" 
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})` }}
              >
                <div className="slide-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="menu-content">
        {Object.keys(menuData).length === 0 ? (
          <div>Không có món ăn nào</div>
        ) : (
          Object.entries(menuData).map(([categoryName, items]) => {
            console.log(`Rendering category ${categoryName}:`, items);
            return (
              Array.isArray(items) && items.length > 0 && (
                <div key={categoryName} className="menu-section">
                  <h2 className="section-title">{categoryName}</h2>
                  <div className="menu-items-grid">
                    {items.map((item, index) => {
                      console.log(`Rendering item in ${categoryName}:`, item);
                      return (
                        <div key={index} className="menu-item">
                          <div className="menu-item-header">
                            <h3 className="item-name">{item.name}</h3>
                            <span className="item-price">
                              {Number(item.price).toLocaleString()}đ
                            </span>
                          </div>
                          <p className="item-description">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            );
          })
        )}
      </div>
    </div>
  );
};

export default Menu; 