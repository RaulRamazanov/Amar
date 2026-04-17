import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { fetchProductById, fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../App.css';



const API_BASE_URL = 'http://localhost:5000'; // Ваш бекенд URL

const ProductPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const data = await fetchProductById(id);
    console.log(data);

    if (data) {
      setProduct(data);
      // Загружаем похожие товары из той же категории
      const similar = await fetchProducts(data.category);
      const filteredSimilar = similar.filter(p => p.id !== data.id).slice(0, 4);
      setSimilarProducts(filteredSimilar);
    } else {
      navigate('/catalog');
    }
    setLoading(false);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const productWithComment = {
      ...product,
      quantity: quantity,
      comment: comment.trim() || ''
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(productWithComment);
    }

    alert(`✅ Добавлено ${quantity} шт. товара "${product.name}" в корзину!\n${comment ? `\n📝 Комментарий: ${comment}` : ''}`);
    setComment('');
    setQuantity(1);
  };
    if (loading) {
    return <div className="loading-spinner">Загрузка...</div>;
  }

  // Функция для добавления комментария из примера
  const addExampleComment = (exampleText) => {
    setComment(prev => {
      // Если поле пустое, просто добавляем текст
      if (!prev.trim()) {
        return exampleText;
      }
      // Если уже есть текст, добавляем через запятую
      return `${prev}, ${exampleText}`;
    });
  };

  // Функция для очистки комментария
  const clearComment = () => {
    setComment('');
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
              {console.log('Полный URL:', `${API_BASE_URL}${product.image}`)}
              <img src={`${API_BASE_URL}${product.image}`} alt={product.name} />
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
                  className="quantity-btn-page"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn-page"
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

            {/* Поле для комментария к товару */}
            <div className="product-comment-section">
              <div className="comment-header">
                <label className="comment-label">
                  📝 Комментарий к заказу
                  <span className="comment-hint">(необязательно)</span>
                </label>
                {comment && (
                  <button
                    type="button"
                    className="clear-comment-btn"
                    onClick={clearComment}
                  >
                    ✕ Очистить
                  </button>
                )}
              </div>
              <textarea
                className="product-comment-input"
                placeholder="Например: нарежьте стейки толщиной 2 см, уберите лишний жир, заверните отдельно..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
              />
              <div className="comment-examples">
                <span className="example-title">📌 Быстрые подсказки:</span>
                <div className="examples-grid">
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("нарезка стейками 2см")}
                  >
                    🥩 нарезка стейками 2см
                  </button>
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("удалить лишний жир")}
                  >
                    🥓 удалить жир
                  </button>
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("отдельная упаковка")}
                  >
                    📦 отдельная упаковка
                  </button>
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("порубить на кости")}
                  >
                    🦴 порубить на кости
                  </button>
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("мелкий фарш")}
                  >
                    🥩 мелкий фарш
                  </button>
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("крупный фарш")}
                  >
                    🥩 крупный фарш
                  </button>
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("для шашлыка")}
                  >
                    🍖 для шашлыка
                  </button>
                  <button
                    type="button"
                    className="example-tag"
                    onClick={() => addExampleComment("на кости")}
                  >
                    🍖 на кости
                  </button>
                </div>
              </div>
              {comment && (
                <div className="comment-preview">
                  <span className="preview-label">Ваш комментарий:</span>
                  <span className="preview-text">{comment}</span>
                </div>
              )}
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