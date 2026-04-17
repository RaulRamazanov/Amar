import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import { categories as localCategories } from '../data/products'; // Импортируем локальные категории для порядка
import ProductCard from '../components/ProductCard';
import '../App.css';

const CatalogPage = ({ searchQuery = '', addToCart, onSearchClear }) => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(true);

  // Загрузка категорий с сохранением порядка из локального массива
  useEffect(() => {
    loadCategories();
  }, []);

  // Загрузка товаров
  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadCategories = async () => {
    const data = await fetchCategories();
    // Сортируем категории в порядке, указанном в localCategories
    const orderedCategories = localCategories.filter(
      localCat => data.some(cat => cat.id === localCat.id)
    );
    setCategories(orderedCategories);
  };

  const loadProducts = async () => {
    setLoading(true);
    const categoryId = activeCategory !== 'all' ? activeCategory : null;
    const data = await fetchProducts(categoryId);
    setProducts(data);
    setFilteredProducts(data);
    setLoading(false);
  };

  // Получаем параметры из URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');

    if (categoryParam && categories.some(c => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all');
    }

    if (searchParam) {
      setCurrentSearchQuery(searchParam);
    } else if (!searchQuery) {
      setCurrentSearchQuery('');
    }
  }, [location.search, searchQuery, categories]);

  // Фильтрация по поиску
  useEffect(() => {
    if (currentSearchQuery && currentSearchQuery.trim()) {
      const query = currentSearchQuery.toLowerCase().trim();
      const filtered = products.filter(p =>
        p.name && p.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [currentSearchQuery, products]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    const params = new URLSearchParams(location.search);
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setCurrentSearchQuery('');
    if (onSearchClear) onSearchClear();
    const params = new URLSearchParams(location.search);
    params.delete('search');
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setCurrentSearchQuery(value);
    // Обновляем URL
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
            onChange={handleSearchInputChange}
            className="catalog-search-input"
          />
          {currentSearchQuery && (
            <button
              className="clear-catalog-search-btn"
              onClick={handleClearSearch}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="category-tabs">
        <button
          className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          <span className="tab-text">Все товары</span>
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            <img src={cat.icon} alt={cat.name} className="tab-icon-svg" />
            <span className="tab-text">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="products-info">
        <div className="products-count">
          Найдено товаров: {filteredProducts.length}
        </div>
        {currentSearchQuery && (
          <div className="active-search">
            Поиск: "{currentSearchQuery}"
            <button onClick={handleClearSearch} className="clear-search-tag">✕</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner">Загрузка товаров...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>Товары не найдены</p>
          <p>Попробуйте изменить параметры поиска</p>
          <button onClick={() => {
            handleCategoryChange('all');
            handleClearSearch();
          }} className="reset-filters-btn">
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