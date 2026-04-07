import React, { useState } from 'react';
import '../App.css';

const CheckoutModal = ({ onClose, cartItems, totalPrice }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^[\d+\s\(\)-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Логика оформления заказа
    const order = {
      customer: formData,
      items: cartItems,
      total: totalPrice,
      date: new Date().toISOString()
    };
    
    console.log('Заказ:', order);
    
    // Здесь будет запрос к бэкенду
    alert(`✅ Заказ оформлен!\n\nСпасибо, ${formData.name}!\n📦 Доставка по адресу: ${formData.address}\n📞 Наш менеджер свяжется с вами в ближайшее время.`);
    
    onClose(true); // true означает успешное оформление
  };

  return (
    <div className="checkout-overlay" onClick={() => onClose(false)}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close" onClick={() => onClose(false)}>×</button>
        
        <div className="checkout-header">
          {/* <div className="checkout-icon">📦</div> */}
          <h2>Оформление заказа</h2>
          <p className="checkout-subtitle">Заполните форму для оформления заказа</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Имя *</label>
            <input
              type="text"
              name="name"
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              name="phone"
              placeholder="+7 (999) 123-45-67"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Адрес доставки *</label>
            <input
              type="text"
              name="address"
              placeholder="Город, улица, дом, квартира"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Комментарий к заказу</label>
            <textarea
              name="comment"
              placeholder="Пожелания по доставке, особые предпочтения..."
              value={formData.comment}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="order-summary">
            <div className="summary-title">Ваш заказ</div>
            <div className="summary-items">
              {cartItems.slice(0, 3).map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price * item.quantity} ₽</span>
                </div>
              ))}
              {cartItems.length > 3 && (
                <div className="summary-more">
                  и еще {cartItems.length - 3} товаров
                </div>
              )}
            </div>
            <div className="summary-total">
              <span>Итого к оплате:</span>
              <span>{totalPrice} ₽</span>
            </div>
          </div>

          <button type="submit" className="checkout-submit">
            Подтвердить заказ
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;