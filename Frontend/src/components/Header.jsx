import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchDropdown from './SearchDropdown';
import { products } from '../data/products';
import '../App.css';

const Header = ({ searchQuery, setSearchQuery, cartCount, onCartOpen }) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    alert('Вы вышли из аккаунта');
  };

  return (
    <>
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
            {/* Кнопка авторизации вместо каталога */}
            <div className="cart-icon" onClick={onCartOpen}>
              🛒
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Модальное окно авторизации */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
};

export default Header;