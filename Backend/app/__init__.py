from flask import Flask, send_file, send_from_directory
from app.config import Config
from app.models.models import db
from app.routes import register_routes
from flasgger import Swagger
from flask_cors import CORS
import time
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Настройки для загрузки файлов
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    # CORS настройки
    CORS(app,
         resources={r"/*": {"origins": "*"}},
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         supports_credentials=True,
         max_age=3600)

    db.init_app(app)
    app.secret_key = Config.SECRET_KEY

    # Регистрация маршрутов API
    register_routes(app)

    # ============================================
    # МАРШРУТ ДЛЯ СТАТИЧЕСКИХ ФАЙЛОВ (ФОТО) - ИСПРАВЛЕННЫЙ ПУТЬ
    # ============================================

    @app.route('/uploads/products/<path:filename>')
    def uploaded_file(filename):
        # ПРАВИЛЬНЫЙ путь для Docker: /app/uploads/products/
        # current_dir = /app/app - ЭТО ПРОБЛЕМА!
        # Нужно подняться на уровень выше
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        upload_dir = os.path.join(base_dir, 'uploads', 'products')
        file_path = os.path.join(upload_dir, filename)

        print(f"[DEBUG] Base dir: {base_dir}")
        print(f"[DEBUG] Looking for file: {filename}")
        print(f"[DEBUG] Upload directory: {upload_dir}")
        print(f"[DEBUG] Full path: {file_path}")
        print(f"[DEBUG] File exists: {os.path.exists(file_path)}")

        if os.path.exists(file_path):
            print(f"[DEBUG] File found! Sending: {file_path}")
            ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
            mime_types = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp'
            }
            mimetype = mime_types.get(ext, 'image/jpeg')
            return send_file(file_path, mimetype=mimetype)
        else:
            print(f"[ERROR] File NOT found: {file_path}")
            return {"error": "File not found"}, 404

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