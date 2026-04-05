from flask import Flask, send_from_directory
from app.config import Config
from app.models.models import db
from app.routes import register_routes
from flasgger import Swagger
import time
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Конфигурация Swagger - используем локальные файлы
    app.config['SWAGGER'] = {
        'title': 'Мясная лавка API',
        'description': 'API для интернет-магазина мясной продукции',
        'version': '1.0.0',
        'uiversion': 3,
        'specs_route': '/apidocs/',
        'static_url_path': '/flasgger_static',
        # Используем локальные статические файлы вместо CDN
        'swagger_ui_bundle_js': '//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js',
        'swagger_ui_standalone_preset_js': '//unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js',
        'swagger_ui_css': '//unpkg.com/swagger-ui-dist@3/swagger-ui.css',
    }

    # Инициализация Swagger
    swagger = Swagger(app, template={
        "swagger": "2.0",
        "info": {
            "title": "Мясная лавка API",
            "description": "API для интернет-магазина мясной продукции",
            "version": "1.0.0",
        },
        "basePath": "/api",
        "schemes": ["http"],
        "consumes": ["application/json"],
        "produces": ["application/json"],
    })

    db.init_app(app)
    app.secret_key = Config.SECRET_KEY

    # Регистрация API маршрутов
    register_routes(app)

    # Маршрут для корня
    @app.route('/')
    def index():
        return send_from_directory('templates', 'index.html')

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