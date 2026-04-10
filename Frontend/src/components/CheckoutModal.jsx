// src/components/CheckoutModal.jsx
import React, { useState } from 'react';
import { createOrder } from '../services/api';
import '../App.css';

const CheckoutModal = ({ onClose, cartItems, totalPrice }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Подготавливаем данные для отправки
    const orderData = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        comment: formData.comment
      },
      items: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        comment: item.comment || ''
      })),
      total: totalPrice
    };
    
    try {
      const result = await createOrder(orderData);
      
      // Показываем сообщение об успехе
      alert(`✅ Заказ №${result.order_id || 'успешно'} оформлен!\n\nСпасибо, ${formData.name}!\nДоставка по адресу: ${formData.address}\nНаш менеджер свяжется с вами в ближайшее время.`);
      
      onClose(true); // Закрываем модальное окно и очищаем корзину
    } catch (error) {
      // Показываем сообщение об ошибке
      alert(`❌ Ошибка при оформлении заказа: ${error.message}\n\nПопробуйте позже или свяжитесь с нами по телефону.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-overlay" onClick={() => onClose(false)}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close" onClick={() => onClose(false)}>×</button>
        
        <div className="checkout-header">
          <div className="checkout-icon">📦</div>
          <h2>Оформление заказа</h2>
          <p className="checkout-subtitle">Заполните форму для оформления заказа</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Имя *</label>
            <input
              type="text"
              name="name"
              placeholder="Иван Петров"
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
              placeholder="+7 999 123-45-67"
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
              placeholder="ул. Ленина, д. 10"
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
              placeholder="Позвонить перед доставкой, домофон 123..."
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

          <button 
            type="submit" 
            className="checkout-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;