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