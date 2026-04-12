// Frontend/src/pages/AdminPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import './AdminPanel.css';
import editIcon from "../assets/comment.svg"
import deleteIcon from "../assets/trash.svg"

const CATEGORY_OPTIONS = [
  { value: 'beef', label: 'Говядина' },
  { value: 'lamb', label: 'Баранина' },
  { value: 'chicken', label: 'Курица' },
  { value: 'minced', label: 'Полуфабрикаты' },
  { value: 'sausages', label: 'Колбасы' },
  { value: 'steaks', label: 'Стейки' },
  { value: 'offal', label: 'Субпродукты' },
  { value: 'pork', label: 'Свинина' },
];

const API_BASE = ' http://localhost:5000/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    price: '',
    category: 'beef',
    image: '',
    imagePreview: null,
    description: '',
    nutrition: {},
    ingredients: '',
    in_stock: true,
  });

  const [nutritionText, setNutritionText] = useState('{}');
  const [cutsText, setCutsText] = useState('');

  const formHeadingRef = useRef(null);
  const nameInputRef = useRef(null);

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
    setUploading(true);

    let nutritionObj = {};
    try {
      nutritionObj = JSON.parse(nutritionText);
    } catch {
      setError('Поле "Пищевая ценность" должно быть в формате JSON');
      setUploading(false);
      return;
    }

    if (cutsText.trim()) {
      nutritionObj.cuts = cutsText.split(',').map(s => s.trim()).filter(s => s);
    } else {
      delete nutritionObj.cuts;
    }

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', parseFloat(productForm.price));
    formData.append('category', productForm.category);
    formData.append('description', productForm.description);
    formData.append('ingredients', productForm.ingredients);
    formData.append('in_stock', productForm.in_stock);
    formData.append('nutrition', JSON.stringify(nutritionObj));

    if (productForm.image instanceof File) {
      formData.append('image', productForm.image);
    } else if (typeof productForm.image === 'string' && productForm.image) {
      formData.append('existing_image', productForm.image);
    }

    try {
      const url = productForm.id
        ? `${API_BASE}/products/${productForm.id}`
        : `${API_BASE}/products`;
      const method = productForm.id ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Ошибка сохранения');
      }
      fetchProducts();
      resetProductForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
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
      imagePreview: product.image || null,
      description: product.description || '',
      nutrition: product.nutrition || {},
      ingredients: product.ingredients || '',
      in_stock: product.in_stock,
    });
    setNutritionText(JSON.stringify(product.nutrition || {}, null, 2));
    const cuts = product.nutrition?.cuts;
    setCutsText(Array.isArray(cuts) ? cuts.join(', ') : '');
    setTimeout(() => {
      formHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nameInputRef.current?.focus();
    }, 100);
  };

  const resetProductForm = () => {
    if (productForm.imagePreview && typeof productForm.imagePreview === 'string' && productForm.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(productForm.imagePreview);
    }
    setProductForm({
      id: null,
      name: '',
      price: '',
      category: 'beef',
      image: '',
      imagePreview: null,
      description: '',
      nutrition: {},
      ingredients: '',
      in_stock: true,
    });
    setNutritionText('{}');
    setCutsText('');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Можно загружать только изображения (JPEG, PNG, WEBP, GIF)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5MB');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setProductForm({ ...productForm, image: file, imagePreview: previewUrl });
    }
  };

  const formatDate = (isoString) => new Date(isoString).toLocaleString('ru-RU');

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer_phone?.includes(orderSearch) ||
    o.id?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const getOrderItemsSummary = (order) => {
    if (!order.items || order.items.length === 0) return '—';
    return order.items.map(item => `${item.product_name} x${item.quantity}`).join(', ');
  };

  const getOrderItemsComments = (order) => {
    if (!order.items || order.items.length === 0) return '—';
    const comments = order.items
      .map(item => item.comment)
      .filter(comment => comment && comment.trim());
    return comments.length ? comments.join('; ') : '—';
  };

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>

      <div className="tabs">
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Товары</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Заказы</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Загрузка...</div>}

      {/* Вкладка Товары */}
      {activeTab === 'products' && (
        <div className="products-section">
          <div className="section-header">
            <h2>Список товаров</h2>
            <input
              type="text"
              placeholder=" Поиск по названию..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-wrapper">
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
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.price} ₽</td>
                    <td>{CATEGORY_OPTIONS.find(c => c.value === p.category)?.label || p.category}</td>
                    <td>{p.in_stock ? '✅' : '❌'}</td>
                    <td>
                      <button onClick={() => handleEditProduct(p)}> <img style={{width:24, height:24}} src={editIcon} alt="" /> </button>
                      <button onClick={() => handleDeleteProduct(p.id)}> <img style={{width:24, height:24}} src={deleteIcon} alt="" /> </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 ref={formHeadingRef}>
              {productForm.id ? 'Редактирование товара' : 'Добавление товара'}
            </h2>
            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-group">
                <label>Название *</label>
                <input
                  type="text"
                  ref={nameInputRef}
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
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Фото товара</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {productForm.imagePreview && (
                  <div className="image-preview">
                    <img 
                      src={productForm.imagePreview} 
                      alt="Предпросмотр"
                      style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
                    />
                    {productForm.image instanceof File && (
                      <p className="file-info">
                        Файл: {productForm.image.name} ({(productForm.image.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                )}
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
                <label>Способы нарезки (через запятую)</label>
                <input
                  type="text"
                  value={cutsText}
                  onChange={(e) => setCutsText(e.target.value)}
                  placeholder="нарезка, удалить жир, отдельно, на кости, мелкий фарш, для шашлыка"
                />
                <small style={{ color: '#666' }}>Будут отображаться в корзине как быстрые опции</small>
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
                <button type="submit" disabled={uploading}>
                  {uploading ? 'Сохранение...' : (productForm.id ? 'Сохранить' : 'Добавить')}
                </button>
                {productForm.id && (
                  <button type="button" onClick={resetProductForm}>
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Вкладка Заказы */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          <div className="section-header">
            <h2>Список заказов</h2>
            <input
              type="text"
              placeholder="Поиск по имени, телефону или ID..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-wrapper">
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
                  <th>Состав</th>
                  <th>Комментарии к позициям</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td title={o.id}>{o.id.slice(0, 8)}…</td>
                    <td>{formatDate(o.order_date)}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.customer_phone}</td>
                    <td>{o.customer_address}</td>
                    <td>{o.total_amount} ₽</td>
                    <td>{o.status}</td>
                    <td className="order-items-summary">{getOrderItemsSummary(o)}</td>
                    <td className="order-items-comments">{getOrderItemsComments(o)}</td>
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
                        onClick={() => openOrderDetails(o)}
                        style={{ marginLeft: '5px' }}
                        title="Показать детали заказа"
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Модальное окно с деталями заказа */}
      {isOrderModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Заказ №{selectedOrder.id.slice(0, 8)}</h3>
              <button className="modal-close" onClick={closeOrderModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Клиент:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Телефон:</strong> {selectedOrder.customer_phone}</p>
              <p><strong>Адрес доставки:</strong> {selectedOrder.customer_address}</p>
              <p><strong>Дата:</strong> {formatDate(selectedOrder.order_date)}</p>
              <p><strong>Сумма:</strong> {selectedOrder.total_amount} ₽</p>
              <p><strong>Статус:</strong> {selectedOrder.status}</p>
              <p><strong>Общий комментарий к заказу:</strong> {selectedOrder.comment || '—'}</p>
              
              <h4>Состав заказа:</h4>
              <table className="modal-items-table">
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Цена</th>
                    <th>Кол-во</th>
                    <th>Сумма</th>
                    <th>Комментарий к позиции</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product_name}</td>
                      <td>{item.price} ₽</td>
                      <td>{item.quantity}</td>
                      <td>{item.price * item.quantity} ₽</td>
                      <td>{item.comment || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;