import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchDropdown from './SearchDropdown';
import { products } from '../data/products';
import cartIcon from '../assets/cart.svg'; // импортируем SVG иконку корзины
import '../App.css';

export const Header = ({ searchQuery, setSearchQuery, cartCount, onCartOpen }) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery || localSearchQuery;
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      setSearchQuery(query);
      setLocalSearchQuery(query);
      setIsSearchFocused(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    setSearchQuery(value);
  };

  const handleInputFocus = () => {
    setIsSearchFocused(true);
  };

  const handleCloseDropdown = () => {
    setIsSearchFocused(false);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    setIsSearchFocused(false);
    
    const url = new URL(window.location.href);
    if (url.searchParams.has('search')) {
      url.searchParams.delete('search');
      window.history.pushState({}, '', url.toString());
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🥩</span>
          <span className="logo-text">MeatMarket</span>
        </Link>

        <div className="search-wrapper">
          <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Поиск мяса, стейков..."
                value={searchQuery || localSearchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="search-input"
              />
              {(searchQuery || localSearchQuery) && (
                <button 
                  type="button" 
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                >
                  ✕
                </button>
              )}
          </form>
          
          <SearchDropdown 
            searchQuery={searchQuery || localSearchQuery}
            setSearchQuery={(value) => {
              setLocalSearchQuery(value);
              setSearchQuery(value);
            }}
            products={products}
            isInputFocused={isSearchFocused}
            onClose={handleCloseDropdown}
          />
        </div>

        <div className="header-actions">
          {/* Иконка корзины с SVG */}
          <div className="cart-icon" onClick={onCartOpen}>
            <img src={cartIcon} alt="Корзина" className="cart-icon-svg" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};
