import React from 'react';
import '../App.css';

const Cart = ({ cartItems, updateQuantity, removeFromCart, onClose }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 Корзина</h2>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>🛍️</p>
              <p>Корзина пуста</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>Добавьте товары из каталога</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <div className="cart-item-price">{item.price} ₽</div>
                  <div className="cart-item-actions">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Итого:</span>
              <span>{calculateTotal()} ₽</span>
            </div>
            <button className="checkout-btn" onClick={() => alert('Оформление заказа')}>
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;