FROM python:3.11-slim

WORKDIR /app

# Устанавливаем системные зависимости для PostgreSQL
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем зависимости Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код
COPY . .

# Создаем директорию для логов (опционально)
RUN mkdir -p /app/logs

# Проверяем что скопировалось
RUN ls -la /app/

# Открываем порт
EXPOSE 5000

# Команда запуска
CMD ["python", "run.py"]