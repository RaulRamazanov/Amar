from app.routes.products import products_bp
from app.routes.orders import orders_bp
from app.routes.admin import admin_bp

def register_routes(app):
    """Регистрация всех blueprints"""
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')