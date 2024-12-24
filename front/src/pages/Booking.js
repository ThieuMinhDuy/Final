import React from 'react';
import './Booking.css';
import BookingForm from '../components/BookingForm';

const Booking = () => {
  return (
    <div className="booking-page">
      <div className="booking-hero">
        <h1>Đặt Bàn</h1>
        <p>Hãy để chúng tôi chuẩn bị một bữa ăn tuyệt vời cho bạn</p>
      </div>
      
      
     
        
        <BookingForm />
      </div>
    
  );
};

export default Booking; 