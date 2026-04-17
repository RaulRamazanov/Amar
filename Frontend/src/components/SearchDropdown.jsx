import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import '../App.css';

const SearchDropdown = ({ searchQuery, setSearchQuery, isInputFocused, onClose }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Загружаем все товары при фокусе на поиске
  useEffect(() => {
    if (isInputFocused && allProducts.length === 0) {
      loadAllProducts();
    }
  }, [isInputFocused]);

  const loadAllProducts = async () => {
    setLoading(true);
    const products = await fetchProducts();
    setAllProducts(products);
    setLoading(false);
  };

  useEffect(() => {
    // Если инпут в фокусе и поисковый запрос пустой - показываем все товары
    if (isInputFocused && !loading) {
      if (!searchQuery || searchQuery.trim() === '') {
        // Показываем первые 20 товаров
        setFilteredProducts(allProducts.slice(0, 50));
        setIsOpen(true);
      } else if (searchQuery.trim().length > 0) {
        // Фильтруем товары по поисковому запросу
        const filtered = allProducts
          .filter(product => 
            product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 8);
        setFilteredProducts(filtered);
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [searchQuery, isInputFocused, allProducts, loading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleProductClick = (productId) => {
    setSearchQuery('');
    setIsOpen(false);
    if (onClose) onClose();
    navigate(`/product/${productId}`);
  };

  const handleViewAll = () => {
    setSearchQuery('');
    setIsOpen(false);
    if (onClose) onClose();
    if (searchQuery) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/catalog');
    }
  };

  if (!isOpen) return null;

  const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
  const displayTitle = hasSearchQuery ? 'Результаты поиска' : 'Популярные товары';

  if (loading) {
    return (
      <div className="search-dropdown" ref={dropdownRef}>
        <div className="dropdown-header">
          <span>Загрузка...</span>
        </div>
        <div className="loading-products">
          <div className="loader"></div>
          <p>Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <span>{displayTitle}</span>
        <span className="results-count">
          {hasSearchQuery ? `найдено: ${filteredProducts.length}` : `всего: ${filteredProducts.length}`}
        </span>
      </div>
      
      {filteredProducts.length > 0 ? (
        <>
          <div className="dropdown-products">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="search-product-card"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="search-product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="search-product-info">
                  <h4 className="search-product-title">{product.name}</h4>
                  <div className="search-product-price">{product.price} ₽</div>
                  <div className="search-product-category">
                    {product.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="dropdown-footer">
            <button onClick={handleViewAll} className="view-all-results">
              {hasSearchQuery ? `Показать все результаты (${filteredProducts.length})` : 'Перейти в каталог →'}
            </button>
          </div>
        </>
      ) : (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <p>Ничего не найдено</p>
          <p className="no-results-hint">Попробуйте изменить поисковый запрос</p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;