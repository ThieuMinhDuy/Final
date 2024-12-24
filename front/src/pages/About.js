import React from 'react';
import RestaurantIntro from '../components/RestaurantIntro';
import Values from '../components/Values';
import '../styles/About.css';

const About = () => {
  return (
    <main className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <h1>Về Chúng Tôi</h1>
          <p>Khám phá câu chuyện và giá trị của Pato Restaurant</p>
        </div>
      </div>
      <RestaurantIntro />
      <Values />
    </main>
  );
};

export default About; 