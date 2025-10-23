# ИИ-лаборатория K2.tech

Полнофункциональная платформа для управления ИИ-гипотезами и экспериментами с real-time обновлениями, системой уведомлений и интеграцией с MLOps инструментами.

## 🚀 Возможности

- **Управление гипотезами** - Kanban-доска с drag-and-drop, детальные карточки, история изменений
- **Экспериментирование** - Запуск, мониторинг и сравнение ML экспериментов
- **Real-time обновления** - WebSocket для мгновенных уведомлений и синхронизации
- **Система ролей** - Гибкая авторизация с RBAC и лабораторными правами
- **Аналитика** - Дашборды для CEO, аналитиков и исследователей
- **Интеграции** - MLflow, Weights & Biases, Slack, Email уведомления
- **Масштабируемость** - Микросервисная архитектура с Docker и Kubernetes

## 🏗️ Архитектура

### Frontend
- **Next.js 14** с App Router
- **TypeScript** для типобезопасности
- **Tailwind CSS** + **shadcn/ui** для UI
- **React Query** для кэширования данных
- **Zustand** для управления состоянием
- **WebSocket** для real-time обновлений

### Backend
- **Node.js** + **Express** API сервер
- **PostgreSQL** основная база данных
- **Redis** для кэширования и сессий
- **WebSocket** для real-time коммуникации
- **JWT** аутентификация
- **Winston** логирование

### DevOps
- **Docker** контейнеризация
- **Nginx** reverse proxy
- **Kubernetes** оркестрация (опционально)
- **Prometheus** + **Grafana** мониторинг

## 🚀 Быстрый старт

### Автоматическая настройка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd v0-ai-lab-architecture77

# Запустите автоматическую настройку
npm run setup
```

### Ручная настройка

1. **Установите зависимости**
```bash
npm install
cd backend && npm install && cd ..
```

2. **Настройте базу данных**
```bash
# PostgreSQL
createdb k2tech_ai_lab

# Redis
redis-server
```

3. **Настройте переменные окружения**
```bash
cp .env.example .env.local
# Отредактируйте .env.local
```

4. **Примените миграции**
```bash
npm run db:migrate
npm run db:seed
```

5. **Запустите приложение**
```bash
# Терминал 1 - Backend
npm run backend:dev

# Терминал 2 - Frontend
npm run dev
```

### Docker

```bash
# Запуск всех сервисов
npm run docker:up

# Просмотр логов
npm run docker:logs

# Остановка
npm run docker:down
```

## 📱 Использование

### Создание гипотезы
1. Перейдите в раздел "Гипотезы"
2. Нажмите "Создать гипотезу"
3. Заполните форму с деталями гипотезы
4. Назначьте участников и метрики успеха

### Управление экспериментами
1. Выберите гипотезу
2. Создайте эксперимент с параметрами
3. Запустите и мониторьте выполнение
4. Анализируйте результаты

### Real-time уведомления
- Получайте мгновенные уведомления о изменениях
- Подписывайтесь на события гипотез и экспериментов
- Настраивайте каналы уведомлений (Email, Slack, In-App)

## 🔧 API Документация

### Аутентификация
```bash
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
```

### Гипотезы
```bash
GET /api/hypotheses          # Список гипотез
POST /api/hypotheses         # Создание гипотезы
GET /api/hypotheses/:id      # Детали гипотезы
PUT /api/hypotheses/:id      # Обновление гипотезы
POST /api/hypotheses/move    # Перемещение между стадиями
```

### Эксперименты
```bash
GET /api/experiments         # Список экспериментов
POST /api/experiments        # Создание эксперимента
POST /api/experiments/:id/run # Запуск эксперимента
GET /api/experiments/:id/metrics # Метрики в реальном времени
```

## 🔌 WebSocket Events

```javascript
// Подписка на события
const { subscribe } = useWebSocket()

// Гипотезы
subscribe('hypotheses')
// События: hypothesis_created, hypothesis_updated, hypothesis_deleted

// Эксперименты  
subscribe('experiments')
// События: experiment_created, experiment_updated, experiment_completed

// Уведомления
subscribe('notifications')
// События: notification
```

## 🎨 Компоненты

### Основные
- `HypothesisKanban` - Kanban-доска гипотез
- `ExperimentGrid` - Сетка экспериментов
- `CEODashboard` - Дашборд для руководства
- `AdminPanel` - Панель администратора
- `NotificationsCenter` - Центр уведомлений

### UI Компоненты
- Полный набор shadcn/ui компонентов
- Кастомные компоненты для специфичных задач
- Адаптивный дизайн для всех устройств

## 🔐 Безопасность

- JWT токены с refresh механизмом
- RBAC система ролей и разрешений
- Rate limiting для API
- Валидация всех входных данных
- Аудит всех действий пользователей

## 📊 Мониторинг

- Логирование всех операций
- Метрики производительности
- Health checks для всех сервисов
- Алерты при критических ошибках

## 🚀 Деплой

### Production
```bash
# Сборка
npm run build
npm run backend:build

# Запуск
npm start
npm run backend:start
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

## 🤝 Разработка

### Структура проекта
```
├── app/                 # Next.js App Router
├── components/          # React компоненты
├── lib/                # Утилиты и API клиенты
├── hooks/              # React хуки
├── backend/            # Backend API сервер
├── database/           # Схема БД и миграции
└── scripts/            # Скрипты автоматизации
```

### Добавление новых функций
1. Создайте API endpoint в `backend/src/routes/`
2. Добавьте методы в API клиент `lib/api/`
3. Создайте React компонент
4. Добавьте типы в `lib/api/types.ts`
5. Обновите документацию

## 📝 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🆘 Поддержка

- 📧 Email: support@k2tech.com
- 📖 Документация: [docs.k2tech.com](https://docs.k2tech.com)
- 🐛 Issues: [GitHub Issues](https://github.com/k2tech/ai-lab/issues)

---

**Создано командой K2.tech** 🚀