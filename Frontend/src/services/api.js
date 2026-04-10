// src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Импортируем локальные данные категорий для сопоставления
import { categories as localCategories } from '../data/products';

// Получить список всех категорий с бэкенда
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Ошибка загрузки категорий');
    
    const backendCategories = await response.json();
    // backendCategories приходит в формате: ["beef", "lamb", "chicken", ...]
    
    // Сопоставляем данные с бэкенда с локальными данными
    const mappedCategories = backendCategories
      .map(catId => localCategories.find(localCat => localCat.id === catId))
      .filter(cat => cat !== undefined); // Убираем undefined, если ID не найден
    
    return mappedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // В случае ошибки возвращаем все локальные категории
    return localCategories;
  }
};

// Получить список товаров
export const fetchProducts = async (categoryId = null) => {
  try {
    let url = `${API_BASE_URL}/products`;
    if (categoryId) {
      url += `?category=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Получить товар по ID
export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) throw new Error('Ошибка загрузки товара');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createOrder = async (orderData) => {
  try {
    // Преобразуем данные из формы в нужный формат
    const formattedOrder = {
      customer_name: orderData.customer.name,
      customer_phone: orderData.customer.phone,
      customer_address: orderData.customer.address,
      comment: orderData.customer.comment || '',
      items: orderData.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        comment: item.comment || ''
      }))
    };
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedOrder),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Ошибка оформления заказа');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};