from flask import Blueprint, request, jsonify, session
from app.models.models import db, Cart, CartItem, Product
from app.utils.helpers import get_or_create_cart_id

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
def get_cart():
    """
    Получить содержимое корзины
    ---
    tags:
      - Корзина
    responses:
      200:
        description: Корзина получена
    """
    cart_id = get_or_create_cart_id()
    cart = Cart.query.filter_by(session_id=cart_id).first()

    cart_data = {
        'items': [],
        'total': 0,
        'total_items': 0
    }

    if cart:
        for item in cart.items:
            product = item.product
            item_total = product.price * item.quantity
            cart_data['items'].append({
                'id': item.id,
                'product_id': product.id,
                'name': product.name,
                'price': product.price,
                'quantity': item.quantity,
                'total': item_total,
                'image': product.image
            })
            cart_data['total'] += item_total
            cart_data['total_items'] += item.quantity

    return jsonify(cart_data)

@cart_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    """
    Добавить товар в корзину
    ---
    tags:
      - Корзина
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - product_id
          properties:
            product_id:
              type: integer
            quantity:
              type: integer
              default: 1
    responses:
      201:
        description: Товар добавлен
      400:
        description: Товар отсутствует
      404:
        description: Товар не найден
    """
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if quantity <= 0:
        return jsonify({'error': 'Количество должно быть больше 0'}), 400

    product = Product.query.get_or_404(product_id)

    if not product.in_stock:
        return jsonify({'error': 'Товар временно отсутствует'}), 400

    cart_id = get_or_create_cart_id()
    cart = Cart.query.filter_by(session_id=cart_id).first()

    # Проверяем, есть ли уже такой товар в корзине
    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()

    if cart_item:
        cart_item.quantity += quantity
        message = 'Количество товара обновлено'
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
        message = 'Товар добавлен в корзину'

    db.session.commit()

    return jsonify({
        'message': message,
        'cart_item': {
            'id': cart_item.id,
            'product_id': product_id,
            'name': product.name,
            'quantity': cart_item.quantity,
            'price': product.price
        }
    }), 201

@cart_bp.route('/cart/remove/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    """
    Удалить товар из корзины
    ---
    tags:
      - Корзина
    parameters:
      - name: item_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Товар удалён
      404:
        description: Позиция не найдена
    """
    cart_item = CartItem.query.get_or_404(item_id)
    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({'message': 'Товар удалён из корзины'})

@cart_bp.route('/cart/clear', methods=['DELETE'])
def clear_cart():
    """
    Очистить всю корзину
    ---
    tags:
      - Корзина
    responses:
      200:
        description: Корзина очищена
    """
    cart_id = get_or_create_cart_id()
    cart = Cart.query.filter_by(session_id=cart_id).first()

    if cart:
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()

    return jsonify({'message': 'Корзина очищена'})