import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchDropdown from './SearchDropdown';
import { products } from '../data/products';
import '../App.css';

const Header = ({ searchQuery, setSearchQuery, cartCount, onCartOpen }) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery || localSearchQuery;
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setLocalSearchQuery('');
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
            <button type="submit" className="search-btn">🔍</button>
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
          <Link to="/catalog" className="icon-btn">📋</Link>
          <div className="cart-icon" onClick={onCartOpen}>
            🛒
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;