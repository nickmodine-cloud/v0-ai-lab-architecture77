#!/bin/bash

# Скрипт настройки ИИ-лаборатории K2.tech

set -e

echo "🚀 Настройка ИИ-лаборатории K2.tech..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js 18+ и попробуйте снова."
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js 18+. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) найден"

# Проверяем наличие PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL не найден. Установите PostgreSQL 13+ и попробуйте снова."
    exit 1
fi

echo "✅ PostgreSQL найден"

# Проверяем наличие Redis
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis не найден. Установите Redis 6+ и попробуйте снова."
    exit 1
fi

echo "✅ Redis найден"

# Создаем .env.local если не существует
if [ ! -f .env.local ]; then
    echo "📝 Создаем файл .env.local..."
    cat > .env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws

# Backend Environment Variables
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=k2tech_ai_lab
DB_SSL=false

REDIS_HOST=localhost
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
else
    echo "✅ Файл .env.local уже существует"
fi

# Устанавливаем зависимости frontend
echo "📦 Устанавливаем зависимости frontend..."
npm install

# Устанавливаем зависимости backend
echo "📦 Устанавливаем зависимости backend..."
cd backend
npm install
cd ..

# Создаем базу данных
echo "🗄️ Создаем базу данных..."
createdb k2tech_ai_lab 2>/dev/null || echo "База данных уже существует"

# Применяем миграции
echo "🔄 Применяем миграции базы данных..."
cd backend
npm run db:migrate
cd ..

# Заполняем тестовыми данными
echo "🌱 Заполняем тестовыми данными..."
cd backend
npm run db:seed
cd ..

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "Для запуска приложения выполните:"
echo "  npm run dev"
echo ""
echo "Или используйте Docker:"
echo "  docker-compose up -d"
echo ""
echo "Приложение будет доступно по адресу: http://localhost:3000"
echo "API будет доступен по адресу: http://localhost:3001/api"


