import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Если кликнули не по кнопке, переходим на страницу товара
    if (!e.target.classList.contains('add-to-cart-btn')) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Предотвращаем переход на страницу товара
    addToCart(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price">{product.price} ₽</div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;