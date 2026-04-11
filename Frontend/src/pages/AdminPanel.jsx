import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

// Базовый префикс для API (проксируется Vite на http://localhost:5001)
const API_BASE = '/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    nutrition: {},
    ingredients: '',
    in_stock: true,
  });

  const [nutritionText, setNutritionText] = useState('{}');

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Ошибка загрузки товаров');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('Ошибка загрузки заказов');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let nutritionObj = {};
    try {
      nutritionObj = JSON.parse(nutritionText);
    } catch {
      setError('Поле "Пищевая ценность" должно быть в формате JSON');
      return;
    }

    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
      image: productForm.image,
      description: productForm.description,
      nutrition: nutritionObj,
      ingredients: productForm.ingredients,
      in_stock: productForm.in_stock,
    };

    try {
      const url = productForm.id
        ? `${API_BASE}/products/${productForm.id}`
        : `${API_BASE}/products`;
      const method = productForm.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Ошибка сохранения');
      }
      fetchProducts();
      resetProductForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Ошибка удаления');
      }
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || '',
      description: product.description || '',
      nutrition: product.nutrition || {},
      ingredients: product.ingredients || '',
      in_stock: product.in_stock,
    });
    setNutritionText(JSON.stringify(product.nutrition || {}, null, 2));
  };

  const resetProductForm = () => {
    setProductForm({
      id: null,
      name: '',
      price: '',
      category: '',
      image: '',
      description: '',
      nutrition: {},
      ingredients: '',
      in_stock: true,
    });
    setNutritionText('{}');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Ошибка обновления статуса');
      }
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('ru-RU');
  };

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>

      <div className="tabs">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Товары
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Заказы
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Загрузка...</div>}

      {/* Вкладка Товары */}
      {activeTab === 'products' && (
        <div className="products-section">
          <h2>Список товаров</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Категория</th>
                <th>В наличии</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price} ₽</td>
                  <td>{p.category}</td>
                  <td>{p.in_stock ? '✅' : '❌'}</td>
                  <td>
                    <button onClick={() => handleEditProduct(p)}>✏️</button>
                    <button onClick={() => handleDeleteProduct(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>{productForm.id ? 'Редактирование товара' : 'Добавление товара'}</h2>
          <form onSubmit={handleProductSubmit} className="product-form">
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Категория *</label>
              <input
                type="text"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                required
                placeholder="beef, chicken, sausages"
              />
            </div>
            <div className="form-group">
              <label>URL изображения</label>
              <input
                type="text"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Описание</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Ингредиенты</label>
              <input
                type="text"
                value={productForm.ingredients}
                onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Пищевая ценность (JSON)</label>
              <textarea
                rows="3"
                value={nutritionText}
                onChange={(e) => setNutritionText(e.target.value)}
                placeholder='{"calories": 250, "protein": 26, "fat": 17}'
              />
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="in_stock"
                checked={productForm.in_stock}
                onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })}
              />
              <label htmlFor="in_stock">В наличии</label>
            </div>
            <div className="form-buttons">
              <button type="submit">{productForm.id ? 'Сохранить' : 'Добавить'}</button>
              {productForm.id && (
                <button type="button" onClick={resetProductForm}>
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Вкладка Заказы */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>Список заказов</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Адрес</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td title={o.id}>{o.id.slice(0, 8)}…</td>
                  <td>{formatDate(o.order_date)}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.customer_phone}</td>
                  <td>{o.customer_address}</td>
                  <td>{o.total_amount} ₽</td>
                  <td>{o.status}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      <option value="pending">Новый</option>
                      <option value="confirmed">Подтверждён</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменён</option>
                    </select>
                    <button
                      onClick={() => alert(JSON.stringify(o.items, null, 2))}
                      style={{ marginLeft: '5px' }}
                    >
                      📋
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;