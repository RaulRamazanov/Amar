import React, { useState } from 'react';
import { fetchOrdersByPhone } from '../services/api';
import phoneIcon from "../assets/phone.svg"
import pinIcon from "../assets/pin.svg"
import calendarIcon from "../assets/calendar.svg"
import numbersIcon from "../assets/numbers.svg"
import moneyIcon from "../assets/money.svg"
import commentIcon from "../assets/comment.svg"
import cartIcon from "../assets/cart.svg"
import '../App.css';

const OrdersModal = ({ onClose }) => {
  const [step, setStep] = useState('phone'); // 'phone' или 'orders'
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Введите номер телефона');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userOrders = await fetchOrdersByPhone(phone);
      setOrders(userOrders);
      setStep('orders');
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

const formatDate = (dateString) => {
  if (!dateString) return 'Дата не указана';

  const date = new Date(dateString);

  // Проверка на валидность даты
  if (isNaN(date.getTime())) return 'Неверная дата';

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

  const getStatusText = (status) => {
    const statusMap = {
      'pending': '⏳ В обработке',
      'confirmed': '✅ Подтвержден',
      'delivered': '🚚 Доставлен',
      'cancelled': '❌ Отменен'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return classMap[status] || 'status-pending';
  };

  return (
    <div className="orders-overlay" onClick={onClose}>
      <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
        <button className="orders-close" onClick={onClose}>×</button>

        <div className="orders-header">
          <h2>Мои заявки</h2>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="phone-form">
            <p className="phone-hint">
              Введите номер телефона, который вы указывали при оформлении заказа
            </p>
            <div className="form-group">
              <label>Номер телефона</label>
              <input
                type="tel"
                placeholder="+7 999 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={error ? 'error' : ''}
              />
              {error && <span className="error-text">{error}</span>}
            </div>
            <button type="submit" className="submit-phone-btn" disabled={loading}>
              {loading ? 'Загрузка...' : 'Показать мои заказы'}
            </button>
          </form>
        ) : (
          <div className="orders-list">
            {loading ? (
              <div className="loading-orders">Загрузка заказов...</div>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>У вас пока нет заказов</p>
                <button onClick={() => setStep('phone')} className="back-to-phone">
                  ← Ввести другой номер
                </button>
              </div>
            ) : (
              <>
                <div className="orders-count">
                  Найдено заказов: {orders.length}
                </div>
                <div className="orders-cards">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <span className="order-number">Заказ №{order.id}</span>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="order-date">
                        <img className='tab-icon-svg-small' src={calendarIcon} alt="" /> {formatDate(order.order_date)}
                      </div>

                      <div className="order-delivery">
                        <div className="delivery-address">
                          <img className='tab-icon-svg-small' src={pinIcon} alt="" /> {order.customer_address}
                        </div>
                        <div className="delivery-phone">
                          <img className='tab-icon-svg-small' src={phoneIcon} alt="" /> {order.customer_phone}
                        </div>
                      </div>

                        {order.items && order.items.length > 0 && (
                        <div className="order-items">
                            <div className="items-title">
                            <span><img className='tab-icon-svg-small' src={cartIcon} alt="" /> Состав заказа</span>
                            <span className="items-count">{order.items.length} товара(ов)</span>
                            </div>
                            <div className="order-items-list">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item">
                                <div className="item-main">
                                    <div className="item-info">
                                    <span className="item-name">{item.product_name || item.name}</span>
                                    {item.comment && (
                                        <div className="item-comment-badge">
                                        <span className="comment-icon"><img className="tab-icon-svg-small" src={commentIcon} alt="" /></span>
                                        <span className="comment-text">{item.comment}</span>
                                        </div>
                                    )}
                                    </div>
                                    <div className="item-pricing">
                                    <div className="item-price-breakdown">
                                        <span className="item-unit-price"> <img className='tab-icon-svg-small' src={moneyIcon} alt="" /> {item.price} ₽</span>
                                        <span className="item-price-separator">×</span>
                                        <span className="item-quantity"> <img className='tab-icon-svg-small' src={numbersIcon} alt="" /> {item.quantity} шт</span>
                                    </div>
                                    <div className="item-total-price">
                                        {item.price * item.quantity} ₽
                                    </div>
                                    </div>
                                </div>
                                <div className="item-progress">
                                    <div
                                    className="item-progress-bar"
                                    style={{ width: '100%' }}
                                    ></div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}

                      <div className="order-comment">
                        {order.items[0].comment && (
                          <div className="delivery-comment">
                            <img className='tab-icon-svg-small' src={commentIcon} alt="" /> {order.items[0].comment}
                          </div>
                        )}
                      </div>

                      <div className="order-total">
                        <span>Итого:</span>
                        <span>{order.total_amount} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep('phone')} className="another-phone-btn">
                  Проверить другой номер
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersModal;