import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = ({ searchQuery, setSearchQuery, cartCount, onCartOpen }) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/catalog');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🥩</span>
          <span className="logo-text">MeatMarket</span>
        </Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Поиск мяса, стейков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

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