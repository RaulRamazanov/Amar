import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/products';
import CategoryCard from '../components/CategoryCard';
import '../App.css';

const HomePage = () => {
  // Замените URL на свое фото
  const heroImage = 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=1400&h=500&fit=crop';

  return (
    <div className="home-page">
      <section className="hero">
        <img src={heroImage} alt="Fresh meat" className="hero-image" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Свежее мясо от проверенных фермеров</h1>
          <p>Натуральные продукты высшего качества с доставкой на дом</p>
          <Link to="/catalog" className="hero-btn">В каталог →</Link>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-header">
          <h2>Наши категории</h2>
          <Link to="/catalog" className="view-all-link">Весь каталог →</Link>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;