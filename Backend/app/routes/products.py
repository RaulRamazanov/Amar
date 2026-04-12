from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models.models import db, Product, OrderItem
import uuid
import os

products_bp = Blueprint('products', __name__)

UPLOAD_FOLDER = 'uploads/products'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """
    Получить список всех товаров
    ---
    tags:
      - Products
    responses:
      200:
        description: Список товаров
    """
    category = request.args.get('category')
    query = Product.query

    if category:
        query = query.filter_by(category=category)

    products = query.all()
    return jsonify([p.to_dict() for p in products])

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """
    Получить товар по ID
    ---
    tags:
      - Products
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Товар найден
      404:
        description: Товар не найден
    """
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

def allowed_file(filename):
    """Проверка разрешенного расширения файла"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file):
    """Сохранить изображение и вернуть путь"""
    if file and allowed_file(file.filename):
        # Безопасное имя файла
        original_filename = secure_filename(file.filename)
        # Генерируем уникальное имя
        ext = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        # Полный путь для сохранения
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        # Сохраняем файл
        file.save(filepath)
        # Возвращаем URL для доступа
        return f"/{UPLOAD_FOLDER}/{unique_filename}"
    return None

@products_bp.route('/products', methods=['POST'])
def create_product():
    """
    Создать новый товар (с загрузкой фото)
    ---
    tags:
      - Admin
    consumes:
      - multipart/form-data
    parameters:
      - name: name
        in: formData
        type: string
        required: true
      - name: price
        in: formData
        type: number
        required: true
      - name: category
        in: formData
        type: string
        required: true
      - name: image
        in: formData
        type: file
        required: false
      - name: description
        in: formData
        type: string
      - name: ingredients
        in: formData
        type: string
      - name: nutrition
        in: formData
        type: string
        description: JSON строка
      - name: in_stock
        in: formData
        type: boolean
    responses:
      201:
        description: Товар создан
    """
    # Проверяем обязательные поля (из form data)
    required_fields = ['name', 'price', 'category']
    for field in required_fields:
        if not request.form.get(field):
            return jsonify({'error': f'Поле {field} обязательно'}), 400
    
    # Обработка фото
    image_url = ''
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '':
            saved_path = save_image(file)
            if saved_path:
                image_url = saved_path
            else:
                return jsonify({'error': 'Неподдерживаемый формат файла. Используйте: PNG, JPG, JPEG, WEBP, GIF'}), 400
    
    # Парсим nutrition (приходит как JSON строка)
    nutrition_data = {}
    if request.form.get('nutrition'):
        try:
            import json
            nutrition_data = json.loads(request.form.get('nutrition'))
        except json.JSONDecodeError:
            return jsonify({'error': 'Поле nutrition должно быть валидным JSON'}), 400
    
    # Создаем товар
    product = Product(
        name=request.form['name'],
        price=float(request.form['price']),
        category=request.form['category'],
        image=image_url,  # Сохраняем путь к файлу
        description=request.form.get('description', ''),
        nutrition=nutrition_data,
        ingredients=request.form.get('ingredients', ''),
        in_stock=request.form.get('in_stock', 'true').lower() == 'true'  # Преобразуем строку в bool
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'message': 'Товар успешно создан',
        'product': product.to_dict()
    }), 201

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """
    Обновить товар (с возможностью обновить фото)
    ---
    tags:
      - Admin
    consumes:
      - multipart/form-data
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
      - name: name
        in: formData
        type: string
      - name: price
        in: formData
        type: number
      - name: category
        in: formData
        type: string
      - name: image
        in: formData
        type: file
      - name: existing_image
        in: formData
        type: string
        description: Существующий URL фото (если не меняли)
      - name: description
        in: formData
        type: string
      - name: ingredients
        in: formData
        type: string
      - name: nutrition
        in: formData
        type: string
      - name: in_stock
        in: formData
        type: boolean
    responses:
      200:
        description: Товар обновлен
    """
    product = Product.query.get_or_404(product_id)
    
    # Обновляем текстовые поля
    if 'name' in request.form:
        product.name = request.form['name']
    if 'price' in request.form:
        product.price = float(request.form['price'])
    if 'category' in request.form:
        product.category = request.form['category']
    if 'description' in request.form:
        product.description = request.form['description']
    if 'ingredients' in request.form:
        product.ingredients = request.form['ingredients']
    if 'in_stock' in request.form:
        product.in_stock = request.form['in_stock'].lower() == 'true'
    
    # Обработка nutrition
    if 'nutrition' in request.form and request.form['nutrition']:
        try:
            import json
            product.nutrition = json.loads(request.form['nutrition'])
        except json.JSONDecodeError:
            return jsonify({'error': 'Поле nutrition должно быть валидным JSON'}), 400
    
    # Обработка фото
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '':
            # Удаляем старое фото, если оно есть
            if product.image and product.image != '/uploads/products/default.jpg':
                old_file_path = product.image.lstrip('/')
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            
            # Сохраняем новое
            saved_path = save_image(file)
            if saved_path:
                product.image = saved_path
            else:
                return jsonify({'error': 'Неподдерживаемый формат файла'}), 400
    elif 'existing_image' in request.form:
        # Оставляем существующее фото
        product.image = request.form['existing_image']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Товар успешно обновлен',
        'product': product.to_dict()
    })

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """
    Удалить товар
    ---
    tags:
      - Admin
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Товар удален
      400:
        description: Нельзя удалить товар, который есть в заказах
      404:
        description: Товар не найден
    """
    product = Product.query.get_or_404(product_id)
    
    # ПРАВИЛЬНАЯ проверка: есть ли товар в заказах
    # Используем OrderItem, а не product.order_items (это отношение)
    order_items_count = OrderItem.query.filter_by(product_id=product.id).count()
    
    if order_items_count > 0:
        return jsonify({
            'error': f'Нельзя удалить товар "{product.name}", так как он присутствует в {order_items_count} заказах'
        }), 400
    
    # Удаляем файл фото, если он существует
    if product.image:
        # Убираем ведущий слеш если есть
        image_path = product.image.lstrip('/')
        
        # Полный путь к файлу
        file_path = os.path.join('', image_path)
        
        # Проверяем существование файла и удаляем
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"✅ Файл фото удален: {file_path}")
            except Exception as e:
                print(f"⚠️ Ошибка при удалении файла: {e}")
                return
        else:
            print(f"⚠️ Файл не найден: {file_path}")
    
    # Удаляем товар из БД
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({
        'message': f'Товар "{product.name}" успешно удален',
        'deleted_image': bool(product.image)
    }), 200

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Получить все категории
    ---
    tags:
      - Products
    responses:
      200:
        description: Список категорий
    """
    categories = db.session.query(Product.category).distinct().all()
    return jsonify([c[0] for c in categories])