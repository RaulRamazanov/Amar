from flask import Flask
from app.config import Config
from app.models.models import db
from app.routes import register_routes
from flasgger import Swagger
from flask_cors import CORS
import time

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, 
        origins=[
            "http://localhost:5173",      # React dev
            "http://localhost:5174",      # Vue dev
            "http://127.0.0.1:3000",
            "http://localhost:8080",      # Если используете другой порт
            "https://yourdomain.com"      # Продакшен домен
        ],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,        # Если используете сессии/куки
        max_age=3600)

    db.init_app(app)
    app.secret_key = Config.SECRET_KEY

    # Регистрация маршрутов
    register_routes(app)

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

    swagger = Swagger(app, config=swagger_config)

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

    return app