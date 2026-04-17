import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import mainImg from "../assets/main.jpg"
import '../App.css';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroImage = mainImg;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

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

        {loading ? (
          <div className="loading-spinner">Загрузка категорий...</div>
        ) : (
          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;