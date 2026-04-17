from flask import Flask, send_file, send_from_directory
from app.config import Config
from app.models.models import db
from app.routes import register_routes
from flasgger import Swagger
from flask_cors import CORS
import time
import os

def create_app():
    app = Flask(__name__,static_folder='uploads',  # папка со статикой
                static_url_path='/static'   )
    app.config.from_object(Config)

    CORS(app, 
        origins=[
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:3000",
            "http://localhost:8080",
            "https://yourdomain.com"
        ],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
        max_age=3600)

    db.init_app(app)
    app.secret_key = Config.SECRET_KEY

    # Регистрация маршрутов API
    register_routes(app)

    # ============================================
    # МАРШРУТ ДЛЯ СТАТИЧЕСКИХ ФАЙЛОВ (ФОТО)
    # ============================================

    @app.route('/uploads/products/<path:filename>')
    def uploaded_file(filename):
        # Абсолютный путь
        base_dir = r'C:\vs code\Amar_beef\Amar\Backend'
        full_path = os.path.join(base_dir, 'uploads/products', filename)
        
        print(f"Проверяем: {full_path}")
        
        if os.path.exists(full_path):
            print("Файл найден!")
            return send_file(full_path, mimetype='image/jpeg')
        else:
            print("Файл НЕ найден!")
            return "Not found", 404

    # Конфигурация Swagger
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/",
        "swagger_ui_bundle_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js",
        "swagger_ui_standalone_preset_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js",
        "swagger_ui_css": "//unpkg.com/swagger-ui-dist@3/swagger-ui.css",
    }

    Swagger(app, config=swagger_config)

    # Создание таблиц
    with app.app_context():
        retries = 5
        while retries > 0:
            try:
                db.create_all()
                print("✅ Database connected and tables created")
                break
            except Exception as e:
                print(f"⚠️ Database connection failed: {e}")
                retries -= 1
                time.sleep(3)
        else:
            print("❌ Could not connect to database")

    # Выводим все маршруты для проверки
    print("\n📋 Зарегистрированные маршруты:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule}")

    return app