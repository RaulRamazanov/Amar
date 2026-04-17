// src/components/Footer.js
import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>MeatMarket</h4>
          <p>Свежее мясо высшего качества</p>
        </div>
        <div className="footer-section">
          <h4>Контакты</h4>
          <p>📞 +7 (999) 123-45-67</p>
          <p>✉️ info@meatmarket.ru</p>
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