import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import beefImg from "../assets/beef.jpg"
import ramImg from "../assets/ram.jpg"
import chickenImg from "../assets/chicken.jpg"
import mincedImg from "../assets/minced.jpg"
import speciaImg from "../assets/specia.jpg"
import sausageImg from "../assets/sausages.jpg"
import anotherImg from "../assets/another.jpg"

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/catalog?category=${category.id}`);
  };

  const categoryImages = {
    beef: beefImg,
    pork: ramImg,
    chicken: chickenImg,
    lamb: ramImg,
    minced: mincedImg,
    sausages: sausageImg,
    steaks: speciaImg,
    offal: anotherImg,
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