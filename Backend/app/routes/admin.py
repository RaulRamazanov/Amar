from flask import Blueprint, jsonify
from app.models.models import db, Product

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/init-db', methods=['POST'])
def init_database():
    """
    Заполнить базу тестовыми данными
    ---
    tags:
      - Администрирование
    responses:
      200:
        description: База данных инициализирована
    """
    products_data = [
        {
            "id": 1,
            "name": "Говядина мраморная",
            "price": 850,
            "category": "beef",
            "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop",
            "description": "Нежнейшая мраморная говядина высшего сорта. Идеально для стейков.",
            "nutrition": {"calories": 250, "protein": 26, "fat": 17, "carbs": 0},
            "ingredients": "Говядина 100%",
            "in_stock": True
        },
        {
            "id": 15,
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
            "id": 2,
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
            "id": 3,
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
        product = Product.query.get(product_data['id'])
        if not product:
            product = Product(**product_data)
            db.session.add(product)

    db.session.commit()
    return jsonify({'message': 'База данных инициализирована', 'products_added': len(products_data)})

@admin_bp.route('/health', methods=['GET'])
def health_check():
    """Проверка здоровья сервера"""
    return jsonify({
        'status': 'healthy',
        'message': 'Сервер работает'
    })