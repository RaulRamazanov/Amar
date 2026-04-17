import os
from dotenv import load_dotenv

# Загружаем .env файл
load_dotenv()

class Config:
    # Все переменные из .env, значения по умолчанию только если нет в .env
    SECRET_KEY = os.getenv('SECRET_KEY')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
    DATABASE_URL = os.getenv('DATABASE_URL')

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False