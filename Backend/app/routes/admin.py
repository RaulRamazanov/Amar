from flask import Blueprint, request, jsonify, session
from app.models.models import db, Product, Order
from app.config import Config

admin_bp = Blueprint('admin', __name__)

# Берем пароль из .env
ADMIN_PASSWORD = Config.ADMIN_PASSWORD


# ========== АВТОРИЗАЦИЯ АДМИНА ==========

@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """
    Вход в админ-панель
    ---
    tags:
      - Admin
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - password
          properties:
            password:
              type: string
    responses:
      200:
        description: Успешный вход
      401:
        description: Неверный пароль
    """
    data = request.json
    password = data.get('password')

    if password == ADMIN_PASSWORD:
        session['is_admin'] = True
        session.permanent = True
        return jsonify({'message': 'Вход выполнен', 'admin': True}), 200
    else:
        return jsonify({'error': 'Неверный пароль'}), 401


@admin_bp.route('/admin/check', methods=['GET'])
def admin_check():
    """
    Проверка статуса админа
    ---
    tags:
      - Admin
    responses:
      200:
        description: Статус админа
    """
    return jsonify({'admin': session.get('is_admin', False)}), 200


@admin_bp.route('/admin/logout', methods=['POST'])
def admin_logout():
    """
    Выход из админ-панели
    ---
    tags:
      - Admin
    responses:
      200:
        description: Выход выполнен
    """
    session.pop('is_admin', None)
    return jsonify({'message': 'Выход выполнен'}), 200


# ========== УПРАВЛЕНИЕ ТОВАРАМИ ==========

@admin_bp.route('/products', methods=['POST'])
def create_product():
    """
    Создать новый товар (админка)
    ---
    tags:
      - Admin
    """
    if not session.get('is_admin'):
        return jsonify({'error': 'Доступ запрещен. Требуется авторизация.'}), 401

    data = request.json

    required_fields = ['name', 'price', 'category']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Поле {field} обязательно'}), 400

    product = Product(
        name=data['name'],
        price=float(data['price']),
        category=data['category'],
        image=data.get('image', ''),
        description=data.get('description', ''),
        nutrition=data.get('nutrition', {}),
        ingredients=data.get('ingredients', ''),
        in_stock=data.get('in_stock', True)
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        'message': 'Товар успешно создан',
        'product': product.to_dict()
    }), 201


@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """
    Обновить товар (админка)
    ---
    tags:
      - Admin
    """
    if not session.get('is_admin'):
        return jsonify({'error': 'Доступ запрещен. Требуется авторизация.'}), 401

    product = Product.query.get_or_404(product_id)
    data = request.json

    if 'name' in data:
        product.name = data['name']
    if 'price' in data:
        product.price = float(data['price'])
    if 'category' in data:
        product.category = data['category']
    if 'image' in data:
        product.image = data['image']
    if 'description' in data:
        product.description = data['description']
    if 'nutrition' in data:
        product.nutrition = data['nutrition']
    if 'ingredients' in data:
        product.ingredients = data['ingredients']
    if 'in_stock' in data:
        product.in_stock = data['in_stock']

    db.session.commit()

    return jsonify({
        'message': 'Товар успешно обновлен',
        'product': product.to_dict()
    })


@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """
    Удалить товар из каталога (админка)
    ---
    tags:
      - Admin
    """
    if not session.get('is_admin'):
        return jsonify({'error': 'Доступ запрещен. Требуется авторизация.'}), 401

    product = Product.query.get_or_404(product_id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Товар успешно удален из каталога'})


# ========== УПРАВЛЕНИЕ ЗАКАЗАМИ ==========

@admin_bp.route('/orders', methods=['GET'])
def get_orders():
    """
    Получить все заказы (админка)
    ---
    tags:
      - Admin
    """
    if not session.get('is_admin'):
        return jsonify({'error': 'Доступ запрещен. Требуется авторизация.'}), 401

    orders = Order.query.order_by(Order.order_date.desc()).all()
    return jsonify([order.to_dict() for order in orders])


@admin_bp.route('/orders/<string:order_id>', methods=['PUT'])
def update_order(order_id):
    """
    Обновить заказ (админка)
    ---
    tags:
      - Admin
    """
    if not session.get('is_admin'):
        return jsonify({'error': 'Доступ запрещен. Требуется авторизация.'}), 401

    order = Order.query.get_or_404(order_id)
    data = request.json

    if 'customer_name' in data:
        order.customer_name = data['customer_name']
    if 'customer_phone' in data:
        order.customer_phone = data['customer_phone']
    if 'customer_address' in data:
        order.customer_address = data['customer_address']
    if 'comment' in data:
        order.comment = data['comment']
    if 'status' in data:
        valid_statuses = ['pending', 'confirmed', 'delivered', 'cancelled']
        if data['status'] not in valid_statuses:
            return jsonify({'error': 'Неверный статус'}), 400
        order.status = data['status']

    db.session.commit()

    return jsonify({
        'message': 'Заказ успешно обновлен',
        'order': order.to_dict()
    })


@admin_bp.route('/init-db', methods=['POST'])
def init_database():
    """
    Инициализация БД тестовыми данными (админка)
    ---
    tags:
      - Admin
    """
    if not session.get('is_admin'):
        return jsonify({'error': 'Доступ запрещен. Требуется авторизация.'}), 401

    if Product.query.first():
        return jsonify({'message': 'База данных уже инициализирована'}), 200

    products_data = [
        {
            "name": "Говядина мраморная",
            "price": 850,
            "category": "beef",
            "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop",
            "description": "Нежнейшая мраморная говядина высшего сорта.",
            "nutrition": {"calories": 250, "protein": 26, "fat": 17, "carbs": 0},
            "ingredients": "Говядина 100%",
            "in_stock": True
        },
        {
            "name": "Печень говяжья",
            "price": 320,
            "category": "offal",
            "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop",
            "description": "Свежая говяжья печень. Богата железом и витаминами.",
            "nutrition": {"calories": 135, "protein": 20, "fat": 5, "carbs": 4},
            "ingredients": "Печень говяжья охлажденная",
            "in_stock": True
        },
        {
            "name": "Свинина корейка",
            "price": 450,
            "category": "pork",
            "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop",
            "description": "Сочная свиная корейка на кости.",
            "nutrition": {"calories": 280, "protein": 24, "fat": 20, "carbs": 0},
            "ingredients": "Свинина охлажденная",
            "in_stock": True
        },
        {
            "name": "Куриное филе",
            "price": 280,
            "category": "chicken",
            "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop",
            "description": "Нежное куриное филе. Диетическое мясо.",
            "nutrition": {"calories": 165, "protein": 31, "fat": 3.6, "carbs": 0},
            "ingredients": "Куриное филе охлажденное",
            "in_stock": True
        }
    ]

    for product_data in products_data:
        product = Product(**product_data)
        db.session.add(product)

    db.session.commit()

    return jsonify({
        'message': 'База данных инициализирована',
        'products_added': len(products_data)
    }), 201