import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import Cart from './components/Cart';
import AdminLogin from './pages/AdminLogin';

// Ленивая загрузка админки — загрузится только при переходе на /admin
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClose = (success) => {
    setIsCartOpen(false);
    if (success) {
      setCartItems([]);
    }
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item =>
        item.id === product.id && item.comment === (product.comment || '')
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.comment === (product.comment || '')
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevItems, {
        ...product,
        quantity: product.quantity || 1,
        comment: product.comment || ''
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateComment = (productId, newComment) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, comment: newComment }
          : item
      )
    );
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  return (
    <Router>
      <div className="App">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cartCount}
          onCartOpen={() => setIsCartOpen(true)}
        />
        <main className="main-content">
          <Suspense fallback={<div className="loading">Загрузка...</div>}>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={
                <CatalogPage
                  searchQuery={searchQuery}
                  addToCart={addToCart}
                  onSearchClear={handleSearchClear}
                />
              } />
              <Route path="/product/:id" element={
                <ProductPage addToCart={addToCart} />
              } />

              {/* Админ-маршруты */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />

        {isCartOpen && (
          <Cart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            updateComment={updateComment}
            onClose={handleCartClose}
          />
        )}
      </div>
    </Router>
  );
}

export default App;