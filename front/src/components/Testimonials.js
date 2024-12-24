import React from 'react';
import '../styles/Testimonials.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    role: 'Food Blogger',
    comment: 'Một trong những nhà hàng ngon nhất mà tôi từng được trải nghiệm. Món ăn không chỉ ngon mà còn được trình bày rất đẹp mắt.',
    avatar: '/images/avatar-1.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Trần Thị B',
    role: 'Doanh Nhân',
    comment: 'Không gian sang trọng, đồ ăn ngon, nhân viên phục vụ chuyên nghiệp. Đây là nơi hoàn hảo cho các buổi gặp gỡ đối tác.',
    avatar: '/images/avatar-2.jpg',
    rating: 5
  },
  {
    id: 3,
    name: 'Lê Văn C',
    role: 'Khách Hàng Thân Thiết',
    comment: 'Tôi đã là khách hàng thân thiết của Pato trong 5 năm qua. Chất lượng luôn được duy trì ổn định.',
    avatar: '/images/avatar-3.jpg',
    rating: 5
  }
];

const Testimonials = () => {
  const renderStars = (rating) => {
    return [...Array(rating)].map((_, index) => (
      <span key={index} className="star">★</span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <span className="subtitle">Đánh Giá</span>
          <h2>Khách Hàng Nói Gì Về Chúng Tôi</h2>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card">
                <div className="quote-icon">"</div>
                <div className="testimonial-content">
                  <p className="comment">{testimonial.comment}</p>
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <div className="testimonial-author">
                    <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials; 