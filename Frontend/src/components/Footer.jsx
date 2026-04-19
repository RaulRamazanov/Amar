// src/components/Footer.js
import React from 'react';
import '../App.css';
import phoneIcon from "../assets/phone.svg"
import mailIcon from "../assets/mail.svg"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Мясо у Адама</h4>
          <p>Свежее мясо высшего качества</p>
        </div>
        <div className="footer-section">
          <h4>Контакты</h4>
          <p> <img style={{filter: "brightness(0) invert(1)"}} className='tab-icon-svg' src={phoneIcon} alt="" /> +7 (925) 057-43-13</p>
          <p><img style={{filter: "brightness(0) invert(1)"}} className='tab-icon-svg' src={mailIcon} alt="" /> belxoroev777@mail.ru</p>
        </div>
        <div className="footer-section">
          <h4>Режим работы</h4>
          <p>Ежедневно: 9:00 - 21:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 MeatMarket. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;