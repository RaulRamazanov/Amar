from flask import Blueprint, request, jsonify
from app.models.models import db, Product

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """
    Получить список всех товаров
    ---
    tags:
      - Products
    responses:
      200:
        description: Список товаров
    """
    category = request.args.get('category')
    query = Product.query

    if category:
        query = query.filter_by(category=category)

    products = query.all()
    return jsonify([p.to_dict() for p in products])

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """
    Получить товар по ID
    ---
    tags:
      - Products
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Товар найден
      404:
        description: Товар не найден
    """
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@products_bp.route('/products', methods=['POST'])
def create_product():
    """
    Создать новый товар
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
            - name
            - price
            - category
          properties:
            name:
              type: string
            price:
              type: number
            category:
              type: string
            image:
              type: string
            description:
              type: string
            ingredients:
              type: string
            nutrition:
              type: object
            in_stock:
              type: boolean
    responses:
      201:
        description: Товар создан
    """
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

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """
    Обновить товар
    ---
    tags:
      - Admin
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            price:
              type: number
            category:
              type: string
            image:
              type: string
            description:
              type: string
            ingredients:
              type: string
            nutrition:
              type: object
            in_stock:
              type: boolean
    responses:
      200:
        description: Товар обновлен
    """
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

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """
    Удалить товар
    ---
    tags:
      - Admin
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Товар удален
    """
    product = Product.query.get_or_404(product_id)

    if product.order_items:
        return jsonify({'error': 'Нельзя удалить товар, который есть в заказах'}), 400

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Товар успешно удален'})

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Получить все категории
    ---
    tags:
      - Products
    responses:
      200:
        description: Список категорий
    """
    categories = db.session.query(Product.category).distinct().all()
    return jsonify([c[0] for c in categories])