import React, { useState } from 'react';
import CheckoutModal from './CheckoutModal';
import '../App.css';
import deleteIcon from "../assets/trash.svg"
import commentIcon from "../assets/comment.svg"
import saveIcon from '../assets/save.svg'
import cartIcon from '../assets/cart.svg';
import noCartIcon from '../assets/nocart.svg'

const Cart = ({ cartItems, updateQuantity, removeFromCart, updateComment, onClose }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [tempComment, setTempComment] = useState('');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCheckoutClose = (success) => {
    setIsCheckoutOpen(false);
    if (success) {
      onClose();
    }
  };

  const handleCommentClick = (item) => {
    setEditingCommentId(item.id);
    setTempComment(item.comment || '');
  };

  const handleCommentSave = (itemId) => {
    updateComment(itemId, tempComment);
    setEditingCommentId(null);
    setTempComment('');
  };

  const handleCommentCancel = () => {
    setEditingCommentId(null);
    setTempComment('');
  };

  // Функция для добавления примера комментария
  const addExampleComment = (exampleText) => {
    setTempComment(prev => {
      // Если поле пустое, просто добавляем текст
      if (!prev.trim()) {
        return exampleText;
      }
      // Если уже есть текст, добавляем через запятую
      return `${prev}, ${exampleText}`;
    });
  };

  const totalPrice = calculateTotal();

  return (
    <>
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2><img src={cartIcon} alt="Корзина" className="cart-icon-svg" style={{filter: "brightness(0) invert(1)"}} /> Корзина</h2>
            <button className="close-cart" onClick={onClose}>×</button>
          </div>
          
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p><img src={noCartIcon} alt="" className='cart-icon-svg' /></p>
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
                    
                    {/* Комментарий к товару */}
                    <div className="cart-item-comment">
                      {editingCommentId === item.id ? (
                        <div className="comment-edit">
                          <textarea
                            className="comment-textarea"
                            value={tempComment}
                            onChange={(e) => setTempComment(e.target.value)}
                            placeholder="Добавьте комментарий к товару..."
                            rows="2"
                            autoFocus
                          />
                          
                          {/* Быстрые подсказки при редактировании */}
                          <div className="comment-quick-examples">
                            <span className="quick-label">⚡ Быстро добавить:</span>
                            <div className="quick-examples-grid">
                              <button 
                                type="button"
                                className="quick-example-tag"
                                onClick={() => addExampleComment("нарезка стейками 2см")}
                              >
                                нарезка
                              </button>
                              <button 
                                type="button"
                                className="quick-example-tag"
                                onClick={() => addExampleComment("удалить лишний жир")}
                              >
                                удалить жир
                              </button>
                              <button 
                                type="button"
                                className="quick-example-tag"
                                onClick={() => addExampleComment("отдельная упаковка")}
                              >
                                отдельно
                              </button>
                              <button 
                                type="button"
                                className="quick-example-tag"
                                onClick={() => addExampleComment("порубить на кости")}
                              >
                                на кости
                              </button>
                              <button 
                                type="button"
                                className="quick-example-tag"
                                onClick={() => addExampleComment("мелкий фарш")}
                              >
                                мелкий фарш
                              </button>
                              <button 
                                type="button"
                                className="quick-example-tag"
                                onClick={() => addExampleComment("для шашлыка")}
                              >
                                для шашлыка
                              </button>
                            </div>
                          </div>
                          
                          <div className="comment-actions">
                            <button 
                              className="comment-save-btn"
                              onClick={() => handleCommentSave(item.id)}
                            >
                              <img src={saveIcon} className='tab-icon-svg' alt="" /> Сохранить
                            </button>
                            <button 
                              className="comment-cancel-btn"
                              onClick={handleCommentCancel}
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="comment-display" onClick={() => handleCommentClick(item)}>
                          <span className="comment-text">
                            {item.comment ? item.comment : 'Добавить комментарий...'}
                          </span>
                          <button className="edit-comment-btn">
                            <img src={commentIcon} className='tab-icon-svg'/>
                          </button>
                        </div>
                      )}
                    </div>
                    
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
                        <img src={deleteIcon} className='tab-icon-svg'/>
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
                <span>{totalPrice} ₽</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Оформить заказ
              </button>
            </div>
          )}
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal 
          onClose={handleCheckoutClose}
          cartItems={cartItems}
          totalPrice={totalPrice}
        />
      )}
    </>
  );
};

export default Cart;