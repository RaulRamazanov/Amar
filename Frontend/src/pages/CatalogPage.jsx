import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import '../App.css';

const CatalogPage = ({ searchQuery = '', addToCart, onSearchClear }) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);

  // Получаем параметры из URL при загрузке и при изменении URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');

    // Устанавливаем категорию из URL
    if (categoryParam && categories.some(c => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all');
    }

    // Устанавливаем поисковый запрос из URL
    if (searchParam) {
      setCurrentSearchQuery(searchParam);
    } else if (!searchQuery) {
      setCurrentSearchQuery('');
    }
  }, [location.search, searchQuery]);

  // Синхронизация с searchQuery из пропсов
  useEffect(() => {
    if (searchQuery !== currentSearchQuery) {
      setCurrentSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Фильтрация товаров при изменении категории или поискового запроса
  useEffect(() => {
    let filtered = [...products];

    // Фильтр по категории
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Фильтр по поиску
    if (currentSearchQuery && currentSearchQuery.trim()) {
      const query = currentSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [activeCategory, currentSearchQuery]);

  // Обработчик изменения категории
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    // Обновляем URL без перезагрузки страницы
    const params = new URLSearchParams(location.search);
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  // Обработчик очистки поиска
  const handleClearSearch = () => {
    setCurrentSearchQuery('');
    if (onSearchClear) {
      onSearchClear();
    }
    const params = new URLSearchParams(location.search);
    params.delete('search');
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  // Обработчик изменения поиска на странице каталога
  const handleCatalogSearchChange = (e) => {
    const value = e.target.value;
    setCurrentSearchQuery(value);
    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="catalog-page">
      <h1 className="catalog-title">Каталог товаров</h1>

      {/* Поиск на странице каталога */}
      <div className="catalog-search-section">
        <div className="catalog-search-wrapper">
          <input
            type="text"
            placeholder="Поиск по каталогу..."
            value={currentSearchQuery}
            onChange={handleCatalogSearchChange}
            className="catalog-search-input"
          />
          {currentSearchQuery && (
            <button className="clear-catalog-search-btn" onClick={handleClearSearch}>
              ✕
            </button>
          )}
          {/* <button className="catalog-search-btn">🔍</button> */}
        </div>
      </div>

      {/* Табы категорий */}
      <div className="category-tabs">
        <button
          className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          Все товары
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Информация о количестве товаров */}
      <div className="products-info">
        <div className="products-count">
          Найдено товаров: {filteredProducts.length}
        </div>
        {currentSearchQuery && (
          <div className="active-search">
            Поиск: "{currentSearchQuery}"
            <button onClick={handleClearSearch} className="clear-search-tag">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Сетка товаров */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>😕 Товары не найдены</p>
          <p>Попробуйте изменить параметры поиска или выберите другую категорию</p>
          <button
            onClick={() => {
              handleCategoryChange('all');
              handleClearSearch();
            }}
            className="reset-filters-btn"
          >
            Сбросить все фильтры
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;