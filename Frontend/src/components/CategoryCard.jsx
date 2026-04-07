import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/catalog?category=${category.id}`);
  };

  const categoryImages = {
    beef: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop',
    pork: 'https://images.unsplash.com/photo-1534790566855-4c788f2a3c9b?w=600&h=400&fit=crop',
    chicken: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
    lamb: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop',
    minced: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop',
    sausages: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop',
    steaks: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop',
    offal: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <img src={categoryImages[category.id]} alt={category.name} className="category-bg-image" />
      <div className="category-overlay"></div>
      <div className="category-content">
        <h3 className="category-name">{category.name}</h3>
        <span className="category-arrow">→</span>
      </div>
    </div>
  );
};

export default CategoryCard;