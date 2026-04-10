import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')

    # Поддержка разных URL для Docker и локальной разработки
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        # Локальная разработка без Docker
        database_url = 'postgresql://user:password@localhost:5432/meat_shop'

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False