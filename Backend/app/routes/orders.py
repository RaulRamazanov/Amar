from flask import Blueprint, request, jsonify, session
from app.models.models import db, Order, OrderItem, Product
import uuid

orders_bp = Blueprint('orders', __name__)

def get_session_id():
    """Получить или создать session_id (UUID)"""
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    return session['session_id']

@orders_bp.route('/orders', methods=['POST'])
def create_order():
    """
    Оформить заказ
    ---
    tags:
      - Orders
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
            - items
          properties:
            customer_name:
              type: string
            customer_phone:
              type: string
            customer_address:
              type: string
            comment:
              type: string
            items:
              type: array
              items:
                type: object
                properties:
                  product_id:
                    type: integer
                  quantity:
                    type: number
                  comment:
                    type: string
    responses:
      201:
        description: Заказ оформлен
    """
    data = request.json

    required_fields = ['customer_name', 'customer_phone', 'customer_address', 'items']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Поле {field} обязательно'}), 400

    if not data['items'] or len(data['items']) == 0:
        return jsonify({'error': 'Корзина пуста'}), 400

    total = 0
    order_items = []

    for item in data['items']:
        product = Product.query.get(item['product_id'])
        if not product:
            return jsonify({'error': f'Товар с ID {item["product_id"]} не найден'}), 400

        if not product.in_stock:
            return jsonify({'error': f'Товар "{product.name}" временно недоступен'}), 400

        quantity = float(item['quantity'])
        if quantity <= 0:
            return jsonify({'error': 'Количество должно быть больше 0'}), 400

        item_total = product.price * quantity
        total += item_total

        order_items.append({
            'product_id': product.id,
            'product_name': product.name,
            'quantity': quantity,
            'price_at_time': product.price,
            'comment': item.get('comment', '')
        })

    session_id = get_session_id()
    order = Order(
        id=str(uuid.uuid4()),
        customer_name=data['customer_name'],
        customer_phone=data['customer_phone'],
        customer_address=data['customer_address'],
        comment=data.get('comment', ''),
        total_amount=total,
        session_id=session_id
    )
    db.session.add(order)
    db.session.flush()

    for item_data in order_items:
        order_item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order.id,
            **item_data
        )
        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        'message': 'Заказ успешно оформлен',
        'order_id': order.id,
        'total': total
    }), 201

@orders_bp.route('/orders/<string:order_id>', methods=['GET'])
def get_order(order_id):
    """
    Получить заказ по UUID (только свои)
    ---
    tags:
      - Orders
    parameters:
      - name: order_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: Заказ найден
      403:
        description: Доступ запрещен
    """
    order = Order.query.get_or_404(order_id)

    session_id = get_session_id()
    if order.session_id != session_id:
        return jsonify({'error': 'Доступ запрещен'}), 403

    return jsonify(order.to_dict())

@orders_bp.route('/orders/<string:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """
    Удалить свой заказ
    ---
    tags:
      - Orders
    parameters:
      - name: order_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: Заказ удален
    """
    order = Order.query.get_or_404(order_id)

    session_id = get_session_id()
    if order.session_id != session_id:
        return jsonify({'error': 'Доступ запрещен'}), 403

    db.session.delete(order)
    db.session.commit()

    return jsonify({'message': 'Заказ успешно удален'})

@orders_bp.route('/orders/lookup', methods=['POST'])
def lookup_orders():
    """
    Найти заказы по номеру телефона
    ---
    tags:
      - Orders
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - customer_phone
          properties:
            customer_phone:
              type: string
    responses:
      200:
        description: Список заказов
    """
    data = request.json
    phone = data.get('customer_phone')

    if not phone:
        return jsonify({'error': 'Телефон обязателен'}), 400

    orders = Order.query.filter_by(customer_phone=phone).order_by(Order.order_date.desc()).limit(10).all()

    return jsonify([{
        'id': order.id,
        'order_date': order.order_date.isoformat(),
        'total_amount': order.total_amount,
        'status': order.status
    } for order in orders])