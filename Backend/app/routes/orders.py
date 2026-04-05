from flask import Blueprint, request, jsonify, session
from app.models.models import db, Order, OrderItem, Cart, CartItem
from app.utils.helpers import get_or_create_cart_id

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['POST'])
def create_order():
    """
    Оформить заказ
    ---
    tags:
      - Заказы
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - customer_name
            - customer_phone
            - customer_address
          properties:
            customer_name:
              type: string
            customer_phone:
              type: string
            customer_address:
              type: string
            comment:
              type: string
    responses:
      201:
        description: Заказ создан
      400:
        description: Ошибка валидации или корзина пуста
    """
    data = request.json

    # Валидация
    required_fields = ['customer_name', 'customer_phone', 'customer_address']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Поле {field} обязательно'}), 400

    cart_id = get_or_create_cart_id()
    cart = Cart.query.filter_by(session_id=cart_id).first()

    if not cart or not cart.items:
        return jsonify({'error': 'Корзина пуста'}), 400

    # Проверяем наличие всех товаров
    total = 0
    order_items = []

    for cart_item in cart.items:
        product = cart_item.product
        if not product.in_stock:
            return jsonify({'error': f'Товар "{product.name}" временно недоступен'}), 400

        item_total = product.price * cart_item.quantity
        total += item_total

        order_items.append({
            'product_id': product.id,
            'product_name': product.name,
            'quantity': cart_item.quantity,
            'price_at_time': product.price
        })

    # Создаём заказ
    order = Order(
        customer_name=data['customer_name'],
        customer_phone=data['customer_phone'],
        customer_address=data['customer_address'],
        total_amount=total
    )
    db.session.add(order)
    db.session.flush()

    # Добавляем позиции заказа
    for item_data in order_items:
        order_item = OrderItem(order_id=order.id, **item_data)
        db.session.add(order_item)

    # Очищаем корзину
    CartItem.query.filter_by(cart_id=cart.id).delete()
    db.session.commit()

    # Очищаем сессию
    session.pop('cart_id', None)

    return jsonify({
        'message': 'Заказ успешно оформлен',
        'order_id': order.id,
        'total': total
    }), 201

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """
    Получить информацию о заказе
    ---
    tags:
      - Заказы
    parameters:
      - name: order_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Информация о заказе
      404:
        description: Заказ не найден
    """
    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict())

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    """
    Получить список всех заказов (для админки)
    ---
    tags:
      - Админка
    responses:
      200:
        description: Список заказов
    """
    orders = Order.query.order_by(Order.order_date.desc()).all()
    return jsonify([order.to_dict() for order in orders])

@orders_bp.route('/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    """
    Обновить статус заказа (для админки)
    ---
    tags:
      - Админка
    parameters:
      - name: order_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - status
          properties:
            status:
              type: string
              enum: [pending, confirmed, delivered, cancelled]
    responses:
      200:
        description: Статус обновлён
      404:
        description: Заказ не найден
    """
    order = Order.query.get_or_404(order_id)
    data = request.json

    valid_statuses = ['pending', 'confirmed', 'delivered', 'cancelled']
    if data.get('status') not in valid_statuses:
        return jsonify({'error': 'Неверный статус'}), 400

    order.status = data['status']
    db.session.commit()

    return jsonify({
        'message': 'Статус заказа обновлён',
        'order_id': order.id,
        'status': order.status
    })