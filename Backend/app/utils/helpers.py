from flask import session
from app.models.models import db, Cart
import uuid

def get_or_create_cart_id():
    """Получить или создать ID корзины для гостя"""
    if 'cart_id' not in session:
        session['cart_id'] = str(uuid.uuid4())
        cart = Cart(session_id=session['cart_id'])
        db.session.add(cart)
        db.session.commit()
    return session['cart_id']