import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import '../App.css';

const ProductPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(1);
      
      // Находим похожие товары (из той же категории, но не текущий)
      const similar = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setSimilarProducts(similar);
    } else {
      navigate('/catalog');
    }
  }, [id, navigate]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`Добавлено ${quantity} шт. товара "${product.name}" в корзину!`);
  };

  if (!product) {
    return (
      <div className="product-page">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="product-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Назад
      </button>
      
      <div className="product-container">
        <div className="product-main">
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
          </div>
          
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price-section">
              <div className="current-price">{product.price} ₽ / шт</div>
            </div>
            
            <div className="quantity-section">
              <span className="quantity-label">Количество:</span>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>
              <div className="total-price">
                Итого: <span>{totalPrice} ₽</span>
              </div>
            </div>
            
            <button 
              className="add-to-cart-btn-page"
              onClick={handleAddToCart}
            >
              🛒 Добавить в корзину ({quantity} шт.)
            </button>
          </div>
        </div>
        
        <div className="product-description">
          <h3>Описание</h3>
          <p className="description-text">{product.description}</p>
        </div>
        
        <div className="product-nutrition">
          <h3>Пищевая ценность (на 100г)</h3>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <span className="nutrition-label">Калории</span>
              <span className="nutrition-value">{product.nutrition.calories}</span>
              <span className="nutrition-unit">ккал</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-label">Белки</span>
              <span className="nutrition-value">{product.nutrition.protein}</span>
              <span className="nutrition-unit">г</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-label">Жиры</span>
              <span className="nutrition-value">{product.nutrition.fat}</span>
              <span className="nutrition-unit">г</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-label">Углеводы</span>
              <span className="nutrition-value">{product.nutrition.carbs}</span>
              <span className="nutrition-unit">г</span>
            </div>
          </div>
        </div>
        
        <div className="product-ingredients">
          <h3>Состав</h3>
          <div className="ingredients-list">
            {product.ingredients}
          </div>
        </div>
      </div>
      
      {similarProducts.length > 0 && (
        <div className="similar-products">
          <h3>Похожие товары</h3>
          <div className="similar-products-grid">
            {similarProducts.map(similarProduct => (
              <ProductCard 
                key={similarProduct.id} 
                product={similarProduct} 
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;