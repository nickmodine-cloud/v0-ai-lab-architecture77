#!/bin/bash

echo "🚀 Запуск ИИ-лаборатории K2.tech..."

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не найден. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверяем Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не найден. Установите Docker Compose и попробуйте снова."
    exit 1
fi

echo "✅ Docker найден"

# Создаем .env.local если не существует
if [ ! -f .env.local ]; then
    echo "📝 Создаем файл .env.local..."
    cat > .env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws

# Backend Environment Variables
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=k2tech_ai_lab
DB_SSL=false

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

SMTP_HOST=localhost
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@k2tech.com

FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
NODE_ENV=development
EOF
    echo "✅ Файл .env.local создан"
fi

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Запускаем только базу данных и Redis через Docker
echo "🐳 Запускаем PostgreSQL и Redis..."
docker-compose up -d postgres redis

# Ждем пока база данных запустится
echo "⏳ Ждем запуска базы данных..."
sleep 10

# Применяем миграции
echo "🔄 Применяем миграции..."
cd backend
npm install
npm run db:migrate
npm run db:seed
cd ..

# Запускаем backend
echo "🔧 Запускаем backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Ждем пока backend запустится
echo "⏳ Ждем запуска backend..."
sleep 5

# Запускаем frontend
echo "🎨 Запускаем frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Приложение запущено!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001/api"
echo "🗄️ PostgreSQL: localhost:5432"
echo "📦 Redis: localhost:6379"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Функция для корректного завершения
cleanup() {
    echo ""
    echo "🛑 Останавливаем приложение..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose down
    exit 0
}

# Перехватываем сигналы для корректного завершения
trap cleanup SIGINT SIGTERM

# Ждем завершения
wait


