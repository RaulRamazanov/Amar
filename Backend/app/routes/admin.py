from flask import Blueprint, jsonify
from app.models.models import db, Product

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/init-db', methods=['POST'])
def init_database():
    """
    Инициализация БД
    ---
    tags:
      - admin
    responses:
      200:
        description: OK
    """
    if Product.query.first():
        return jsonify({'message': 'База данных уже инициализирована'}), 200

    products_data = [
        {
            "name": "Говядина мраморная",
            "price": 850,
            "category": "beef",
            "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop",
            "description": "Нежнейшая мраморная говядина",
            "nutrition": {"calories": 250, "protein": 26, "fat": 17, "carbs": 0},
            "ingredients": "Говядина 100%",
            "in_stock": True
        },
        {
            "name": "Печень говяжья",
            "price": 320,
            "category": "offal",
            "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop",
            "description": "Свежая говяжья печень",
            "nutrition": {"calories": 135, "protein": 20, "fat": 5, "carbs": 4},
            "ingredients": "Печень говяжья охлажденная",
            "in_stock": True
        }
    ]

    for product_data in products_data:
        product = Product(**product_data)
        db.session.add(product)

    db.session.commit()

    return jsonify({'message': 'База данных инициализирована'}), 201