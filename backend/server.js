const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = createServer(app);

// WebSocket для real-time обновлений
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('WebSocket message received:', data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Функция для отправки событий всем клиентам
function broadcastEvent(type, payload) {
  const message = JSON.stringify({ type, payload });
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5002",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Сервис работает',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mock data for hypotheses
const mockHypotheses = [
  {
    id: "1",
    title: "Персонализированные рекомендации увеличат конверсию",
    description: "Внедрение ML-модели для персонализации товарных рекомендаций на основе истории покупок и поведения пользователя",
    stage: "ideation",
    priority: "high",
    impact: "Увеличение конверсии на 15-20%",
    effort: "6-8 недель",
    dataAvailability: 9,
    businessValue: 8,
    expectedRevenue: "500K ₽/мес",
    dataQuality: "Высокое",
    technicalComplexity: "Средняя",
    owner: "Анна Иванова",
    tags: ["Рекомендации", "ML", "Конверсия"],
    createdAt: "2025-10-21T16:50:39.241Z",
    updatedAt: "2025-10-21T16:50:39.241Z",
    createdBy: "ea96456f-8659-4589-bbbd-98428f47305e",
    creator: {
      id: "ea96456f-8659-4589-bbbd-98428f47305e",
      name: "Анна Иванова",
      email: "anna@ailab.com",
      role: "admin",
      status: "active",
      experiments: 8
    }
  },
  {
    id: "2",
    title: "Прогнозирование оттока клиентов",
    description: "Разработка модели для предсказания вероятности оттока клиентов на основе поведенческих паттернов",
    stage: "scoping",
    priority: "high",
    impact: "Снижение оттока на 10%",
    effort: "4-6 недель",
    dataAvailability: 8,
    businessValue: 9,
    expectedRevenue: "300K ₽/мес",
    dataQuality: "Высокое",
    technicalComplexity: "Низкая",
    owner: "Дмитрий Петров",
    tags: ["Churn", "Предсказание", "Retention"],
    createdAt: "2025-10-21T16:50:39.241Z",
    updatedAt: "2025-10-21T16:50:39.241Z",
    createdBy: "977ffd9b-18dd-48d7-84d7-d14c310ff8cc",
    creator: {
      id: "977ffd9b-18dd-48d7-84d7-d14c310ff8cc",
      name: "Дмитрий Петров",
      email: "dmitry@ailab.com",
      role: "researcher",
      status: "active",
      experiments: 12
    }
  }
];

// API Routes
app.get('/api/hypotheses', (req, res) => {
  const { page = 1, limit = 10, search, stage, priority } = req.query;
  
  let filteredHypotheses = [...mockHypotheses];
  
  // Фильтрация по поиску
  if (search) {
    filteredHypotheses = filteredHypotheses.filter(h => 
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Фильтрация по стадии
  if (stage) {
    filteredHypotheses = filteredHypotheses.filter(h => h.stage === stage);
  }
  
  // Фильтрация по приоритету
  if (priority) {
    filteredHypotheses = filteredHypotheses.filter(h => h.priority === priority);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedHypotheses = filteredHypotheses.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedHypotheses,
    total: filteredHypotheses.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredHypotheses.length / limit)
  });
});

app.get('/api/hypotheses/stats', (req, res) => {
  const stats = {
    total: mockHypotheses.length,
    byStage: {
      ideation: mockHypotheses.filter(h => h.stage === 'ideation').length,
      scoping: mockHypotheses.filter(h => h.stage === 'scoping').length,
      experimentation: mockHypotheses.filter(h => h.stage === 'experimentation').length,
      evaluation: mockHypotheses.filter(h => h.stage === 'evaluation').length,
      production: mockHypotheses.filter(h => h.stage === 'production').length,
      archived: mockHypotheses.filter(h => h.stage === 'archived').length
    }
  };
  res.json(stats);
});

app.get('/api/hypotheses/kanban', (req, res) => {
  const grouped = {};
  mockHypotheses.forEach(hyp => {
    if (!grouped[hyp.stage]) {
      grouped[hyp.stage] = [];
    }
    grouped[hyp.stage].push(hyp);
  });
  res.json(grouped);
});

app.post('/api/hypotheses', (req, res) => {
  const { 
    title, 
    description, 
    stage = 'ideation', 
    priority = 'medium',
    impact,
    effort,
    dataAvailability = 5,
    businessValue = 5,
    expectedRevenue,
    dataQuality = 'Среднее',
    technicalComplexity = 'Средняя',
    tags = []
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Название и описание обязательны' });
  }

  // Проверяем, что стадия активна (управление через админку)
  const stageConfig = hypothesisStages.find(s => s.code === stage);
  if (!stageConfig) {
    return res.status(400).json({ error: 'Неизвестная стадия' });
  }
  
  if (!stageConfig.isActive) {
    return res.status(400).json({ error: `Стадия "${stageConfig.name}" деактивирована администратором` });
  }

  const newHypothesis = {
    id: (mockHypotheses.length + 1).toString(),
    title,
    description,
    stage,
    priority,
    impact: impact || '',
    effort: effort || '',
    dataAvailability,
    businessValue,
    expectedRevenue: expectedRevenue || '',
    dataQuality,
    technicalComplexity,
    owner: 'Текущий пользователь',
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'ea96456f-8659-4589-bbbd-98428f47305e',
    creator: {
      id: 'ea96456f-8659-4589-bbbd-98428f47305e',
      name: 'Текущий пользователь',
      email: 'user@ailab.com',
      role: 'researcher',
      status: 'active',
      experiments: 0
    }
  };

  mockHypotheses.push(newHypothesis);

  // Отправляем событие всем клиентам
  broadcastEvent('hypothesisCreated', newHypothesis);

  res.status(201).json(newHypothesis);
});

app.post('/api/hypotheses/move', (req, res) => {
  const { hypothesisId, newStage, comment } = req.body;

  if (!hypothesisId || !newStage) {
    return res.status(400).json({ error: 'ID гипотезы и новая стадия обязательны' });
  }

  const hypothesis = mockHypotheses.find(h => h.id === hypothesisId);
  if (!hypothesis) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }

  // Проверяем, что новая стадия активна (управление через админку)
  const stageConfig = hypothesisStages.find(s => s.code === newStage);
  if (!stageConfig) {
    return res.status(400).json({ error: 'Неизвестная стадия' });
  }
  
  if (!stageConfig.isActive) {
    return res.status(400).json({ error: `Стадия "${stageConfig.name}" деактивирована администратором` });
  }

  hypothesis.stage = newStage;
  hypothesis.updatedAt = new Date().toISOString();

  // Отправляем событие всем клиентам
  broadcastEvent('hypothesisUpdated', hypothesis);

  res.json(hypothesis);
});

// Mock experiments data
const mockExperiments = [
  {
    id: "1",
    hypothesisId: "1",
    hypothesis: {
      id: "1",
      title: "Персонализированные рекомендации увеличат конверсию",
      stage: "backlog"
    },
    name: "Тестирование LLM для поддержки клиентов",
    variant: "Эксперимент по внедрению языковой модели для автоматизации ответов клиентам",
    status: "running",
    modelApproach: "GPT-3.5",
    parameters: {"temperature": 0.7, "max_tokens": 150},
    metrics: {"accuracy": 0.85, "f1_score": 0.82},
    startedAt: "2025-01-21T10:00:00Z",
    completedAt: null,
    durationSeconds: 16200, // 4.5 часа
    gpuHoursUsed: 2.5,
    cost: 15.50,
    currency: "USD",
    artifactsUrl: "https://storage.example.com/artifacts/exp1",
    notebookUrl: "https://jupyter.example.com/notebooks/exp1",
    gitCommitHash: "abc123def456",
    createdBy: {
      id: "ea96456f-8659-4589-bbbd-98428f47305e",
      name: "Иван Петров",
      email: "ivan.petrov@k2.tech"
    },
    createdAt: "2025-01-21T10:00:00Z",
    updatedAt: "2025-01-21T14:30:00Z"
  }
];

app.get('/api/experiments', (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let filteredExperiments = [...mockExperiments];

  if (status) {
    filteredExperiments = filteredExperiments.filter(e => e.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedExperiments = filteredExperiments.slice(startIndex, endIndex);

  res.json({
    data: paginatedExperiments,
    total: filteredExperiments.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredExperiments.length / limit)
  });
});

// API для настроек
let systemSettings = {
  notifications: {
    email: true,
    push: false,
    slack: true
  },
  security: {
    twoFactor: false,
    sessionTimeout: true,
    sessionTimeoutHours: 8
  },
  system: {
    theme: 'dark',
    language: 'ru',
    timezone: 'Europe/Moscow'
  }
};

// API для админки - управление стадиями
let hypothesisStages = [
  { id: 1, order: 1, name: "Бэклог", code: "backlog", description: "Сбор первичных идей", requiresApproval: false, defaultDuration: 0, isActive: true },
  { id: 2, order: 2, name: "Идея", code: "ideation", description: "Формулировка гипотезы", requiresApproval: false, defaultDuration: 7, isActive: true },
  { id: 3, order: 3, name: "Скопинг", code: "scoping", description: "Техническая осуществимость", requiresApproval: true, defaultDuration: 14, isActive: true },
  { id: 4, order: 4, name: "Экспериментирование", code: "experimentation", description: "Проведение экспериментов", requiresApproval: false, defaultDuration: 30, isActive: true },
  { id: 5, order: 5, name: "Оценка", code: "evaluation", description: "Бизнес-кейс и анализ ROI", requiresApproval: true, defaultDuration: 21, isActive: true },
  { id: 6, order: 6, name: "Продакшен", code: "production", description: "Развертывание в продакшен", requiresApproval: true, defaultDuration: 0, isActive: true },
  { id: 7, order: 7, name: "Архив", code: "archived", description: "Завершено или отменено", requiresApproval: false, defaultDuration: 0, isActive: true },
];

app.get('/api/admin/stages', (req, res) => {
  res.json(hypothesisStages);
});

// API для получения только активных стадий (для фронтенда)
app.get('/api/stages/active', (req, res) => {
  const activeStages = hypothesisStages
    .filter(stage => stage.isActive)
    .sort((a, b) => a.order - b.order);
  res.json(activeStages);
});

// CEO Dashboard API
app.get('/api/ceo/metrics', (req, res) => {
  const totalHypotheses = mockHypotheses.length;
  const inExperimentation = mockHypotheses.filter(h => h.stage === 'experimentation').length;
  const inProduction = mockHypotheses.filter(h => h.stage === 'production').length;
  
  // Реальный расчет success rate
  const completedHypotheses = mockHypotheses.filter(h => 
    h.stage === 'production' || h.stage === 'archived'
  );
  const successfulHypotheses = mockHypotheses.filter(h => h.stage === 'production');
  const successRate = completedHypotheses.length > 0 
    ? Math.round((successfulHypotheses.length / completedHypotheses.length) * 100)
    : 0;

  // Реальный расчет среднего времени до продакшена
  const productionHypotheses = mockHypotheses.filter(h => h.stage === 'production');
  const avgTimeToProduction = productionHypotheses.length > 0
    ? productionHypotheses.reduce((sum, h) => {
        const created = new Date(h.createdAt);
        const launched = new Date(h.actualLaunchDate || new Date());
        const weeks = (launched - created) / (1000 * 60 * 60 * 24 * 7);
        return sum + weeks;
      }, 0) / productionHypotheses.length
    : 0;

  // Реальный расчет инвестиций
  const totalInvestment = mockHypotheses.reduce((sum, h) => {
    return sum + (parseFloat(h.estimatedCost) || 0);
  }, 0);

  // Реальный расчет ROI
  const realizedROI = mockHypotheses
    .filter(h => h.stage === 'production')
    .reduce((sum, h) => {
      const investment = parseFloat(h.estimatedCost) || 0;
      const roi = parseFloat(h.expectedROI) || 0;
      return sum + (investment * roi / 100);
    }, 0);

  // Реальные критические риски
  const criticalRisks = mockHypotheses.filter(h => 
    h.priority === 'critical' && h.stage !== 'production'
  ).length;

  res.json({
    totalHypotheses,
    inExperimentation,
    inProduction,
    successRate,
    avgTimeToProduction: Math.round(avgTimeToProduction * 10) / 10,
    totalInvestment: Math.round(totalInvestment),
    realizedROI: Math.round(realizedROI),
    criticalRisks
  });
});

app.get('/api/ceo/pipeline', (req, res) => {
  const pipeline = {
    backlog: mockHypotheses.filter(h => h.stage === 'backlog').length,
    ideation: mockHypotheses.filter(h => h.stage === 'ideation').length,
    scoping: mockHypotheses.filter(h => h.stage === 'scoping').length,
    prioritization: mockHypotheses.filter(h => h.stage === 'prioritization').length,
    experimentation: mockHypotheses.filter(h => h.stage === 'experimentation').length,
    evaluation: mockHypotheses.filter(h => h.stage === 'evaluation').length,
    scaling: mockHypotheses.filter(h => h.stage === 'scaling').length,
    production: mockHypotheses.filter(h => h.stage === 'production').length,
    archived: mockHypotheses.filter(h => h.stage === 'archived').length
  };
  res.json(pipeline);
});

app.get('/api/ceo/awaiting-approval', (req, res) => {
  const awaitingApproval = mockHypotheses.filter(h => {
    // Логика определения гипотез, ожидающих одобрения CEO
    return (h.priority === 'critical' && h.stage === 'evaluation') ||
           (h.priority === 'high' && h.stage === 'scaling') ||
           (parseFloat(h.estimatedCost) > 100000 && h.stage === 'scoping');
  }).map(h => ({
    id: h.id,
    title: h.title,
    stage: h.stage,
    priority: h.priority,
    owner: h.owner,
    awaitingAction: getAwaitingAction(h),
    dueDate: getDueDate(h),
    estimatedCost: h.estimatedCost
  }));
  
  res.json(awaitingApproval);
});

function getAwaitingAction(hypothesis) {
  if (hypothesis.priority === 'critical' && hypothesis.stage === 'evaluation') {
    return 'Approval to Scale';
  } else if (parseFloat(hypothesis.estimatedCost) > 100000) {
    return 'Budget approval';
  } else if (hypothesis.stage === 'scaling') {
    return 'Strategic alignment review';
  }
  return 'Review required';
}

function getDueDate(hypothesis) {
  const created = new Date(hypothesis.createdAt);
  const dueDate = new Date(created.getTime() + (14 * 24 * 60 * 60 * 1000)); // +14 дней
  return dueDate.toISOString();
}

// Детальные страницы гипотез API
app.get('/api/hypotheses/:id', (req, res) => {
  const hypothesis = mockHypotheses.find(h => h.id === req.params.id);
  if (!hypothesis) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }

  // Получаем связанные данные
  const experiments = mockExperiments.filter(e => e.hypothesisId === hypothesis.id);
  const comments = mockComments.filter(c => c.hypothesisId === hypothesis.id);
  const files = mockFiles.filter(f => f.hypothesisId === hypothesis.id);
  
  // Рассчитываем метрики
  const metrics = calculateHypothesisMetrics(hypothesis, experiments);
  const risks = getHypothesisRisks(hypothesis);
  const timeline = getHypothesisTimeline(hypothesis);

  res.json({
    ...hypothesis,
    experiments,
    comments,
    files,
    metrics,
    risks,
    timeline
  });
});

function calculateHypothesisMetrics(hypothesis, experiments) {
  const completedExperiments = experiments.filter(e => e.status === 'completed');
  const bestExperiment = completedExperiments.reduce((best, current) => {
    const currentAccuracy = parseFloat(current.metrics?.accuracy || 0);
    const bestAccuracy = parseFloat(best.metrics?.accuracy || 0);
    return currentAccuracy > bestAccuracy ? current : best;
  }, completedExperiments[0]);

  return {
    totalExperiments: experiments.length,
    completedExperiments: completedExperiments.length,
    bestAccuracy: bestExperiment ? parseFloat(bestExperiment.metrics?.accuracy || 0) : 0,
    totalCost: experiments.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0),
    totalGPUHours: experiments.reduce((sum, e) => sum + (parseFloat(e.gpuHoursUsed) || 0), 0),
    avgExperimentDuration: completedExperiments.length > 0 
      ? completedExperiments.reduce((sum, e) => sum + (e.durationSeconds || 0), 0) / completedExperiments.length
      : 0
  };
}

function getHypothesisRisks(hypothesis) {
  const risks = [];
  
  if (hypothesis.priority === 'critical' && hypothesis.stage === 'experimentation') {
    risks.push({
      id: 'risk-1',
      description: 'Критическая гипотеза застряла в экспериментировании',
      severity: 'high',
      category: 'timeline'
    });
  }
  
  if (parseFloat(hypothesis.estimatedCost) > 100000) {
    risks.push({
      id: 'risk-2',
      description: 'Высокие инвестиции требуют дополнительного одобрения',
      severity: 'medium',
      category: 'financial'
    });
  }
  
  return risks;
}

function getHypothesisTimeline(hypothesis) {
  const timeline = [
    {
      id: 'timeline-1',
      event: 'Гипотеза создана',
      date: hypothesis.createdAt,
      user: hypothesis.creator?.name || 'Неизвестно',
      type: 'created'
    }
  ];
  
  if (hypothesis.stage !== 'ideation') {
    timeline.push({
      id: 'timeline-2',
      event: `Переход в стадию ${hypothesis.stage}`,
      date: hypothesis.updatedAt,
      user: hypothesis.creator?.name || 'Неизвестно',
      type: 'stage_change'
    });
  }
  
  return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Mock data для детальных страниц
const mockComments = [
  {
    id: 'COMMENT-001',
    hypothesisId: 'HYP-001',
    author: 'Иван Иванов',
    authorEmail: 'ivan@k2tech.com',
    content: 'Отличная идея! Нужно проработать техническую реализацию.',
    createdAt: '2025-01-20T10:30:00Z',
    isInternal: false
  },
  {
    id: 'COMMENT-002',
    hypothesisId: 'HYP-001',
    author: 'Анна Петрова',
    authorEmail: 'anna@k2tech.com',
    content: 'Согласна с оценкой ROI. Стоит рассмотреть альтернативные подходы.',
    createdAt: '2025-01-21T14:20:00Z',
    isInternal: true
  }
];

const mockFiles = [
  {
    id: 'FILE-001',
    hypothesisId: 'HYP-001',
    name: 'technical_specification.pdf',
    size: 1024000,
    type: 'application/pdf',
    uploadedBy: 'Иван Иванов',
    uploadedAt: '2025-01-20T09:15:00Z',
    url: '/files/technical_specification.pdf'
  },
  {
    id: 'FILE-002',
    hypothesisId: 'HYP-001',
    name: 'market_research.xlsx',
    size: 512000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedBy: 'Анна Петрова',
    uploadedAt: '2025-01-21T11:30:00Z',
    url: '/files/market_research.xlsx'
  }
];

// IAM System API


app.get('/api/iam/users', (req, res) => {
  const { page = 1, limit = 10, search, department, role, status } = req.query;
  
  let filteredUsers = [...mockUsers];
  
  if (search) {
    filteredUsers = filteredUsers.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (department) {
    filteredUsers = filteredUsers.filter(u => u.department === department);
  }
  
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.roles.includes(role));
  }
  
  if (status) {
    filteredUsers = filteredUsers.filter(u => u.status === status);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedUsers,
    total: filteredUsers.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredUsers.length / limit)
  });
});

app.post('/api/iam/users', (req, res) => {
  const { name, email, department, roles, assignedLabs } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Имя и email обязательны' });
  }
  
  // Проверяем уникальность email
  if (mockUsers.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
  }
  
  const newUser = {
    id: `USR-${Date.now()}`,
    name,
    email,
    department: department || 'IT',
    roles: roles || ['Business User'],
    status: 'Active',
    lastLogin: null,
    createdAt: new Date().toISOString(),
    assignedLabs: assignedLabs || []
  };
  
  mockUsers.push(newUser);
  
  // Отправляем уведомление
  broadcastEvent('userCreated', newUser);
  
  res.status(201).json(newUser);
});

app.put('/api/iam/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  
  // Отправляем уведомление
  broadcastEvent('userUpdated', mockUsers[userIndex]);
  
  res.json(mockUsers[userIndex]);
});


function generateAuditLogs() {
  const logs = [];
  
  // Логи создания гипотез
  mockHypotheses.forEach(h => {
    logs.push({
      id: `LOG-${Date.now()}-${Math.random()}`,
      timestamp: h.createdAt,
      user: h.creator?.email || 'unknown@k2tech.com',
      action: 'Created',
      resource: 'Hypothesis',
      resourceId: h.id,
      ipAddress: '192.168.1.10',
      details: `Created hypothesis "${h.title}"`,
      status: 'Success'
    });
  });
  
  // Логи обновления пользователей
  mockUsers.forEach(u => {
    logs.push({
      id: `LOG-${Date.now()}-${Math.random()}`,
      timestamp: u.createdAt,
      user: 'admin@k2tech.com',
      action: 'Created',
      resource: 'User',
      resourceId: u.id,
      ipAddress: '192.168.1.1',
      details: `Created user "${u.name}"`,
      status: 'Success'
    });
  });
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Notifications System API
const mockNotifications = [
  {
    id: 'NOTIF-001',
    title: 'Новая гипотеза создана',
    message: 'Гипотеза "LLM для поддержки клиентов" была создана',
    type: 'hypothesis',
    priority: 'medium',
    isRead: false,
    isStarred: false,
    isArchived: false,
    createdAt: '2025-01-21T18:00:00Z',
    userId: 'USR-001',
    relatedObjectType: 'hypothesis',
    relatedObjectId: 'HYP-001',
    triggeredByUserId: 'USR-002'
  },
  {
    id: 'NOTIF-002',
    title: 'Эксперимент завершен',
    message: 'Эксперимент "Baseline GPT-4" успешно завершен',
    type: 'experiment',
    priority: 'high',
    isRead: false,
    isStarred: false,
    isArchived: false,
    createdAt: '2025-01-21T17:30:00Z',
    userId: 'USR-001',
    relatedObjectType: 'experiment',
    relatedObjectId: 'EXP-001',
    triggeredByUserId: 'USR-003'
  },
  {
    id: 'NOTIF-003',
    title: 'Требуется одобрение',
    message: 'Гипотеза "Персонализированные рекомендации" ожидает вашего одобрения',
    type: 'approval',
    priority: 'high',
    isRead: true,
    isStarred: true,
    isArchived: false,
    createdAt: '2025-01-21T16:45:00Z',
    userId: 'USR-001',
    relatedObjectType: 'hypothesis',
    relatedObjectId: 'HYP-001',
    triggeredByUserId: 'USR-002'
  }
];

app.get('/api/notifications', (req, res) => {
  const { page = 1, limit = 10, filter = 'all', category } = req.query;
  
  let filteredNotifications = [...mockNotifications];
  
  // Фильтрация по типу
  if (filter === 'unread') {
    filteredNotifications = filteredNotifications.filter(n => !n.isRead);
  } else if (filter === 'read') {
    filteredNotifications = filteredNotifications.filter(n => n.isRead);
  } else if (filter === 'starred') {
    filteredNotifications = filteredNotifications.filter(n => n.isStarred);
  } else if (filter === 'archived') {
    filteredNotifications = filteredNotifications.filter(n => n.isArchived);
  }
  
  // Фильтрация по категории
  if (category) {
    filteredNotifications = filteredNotifications.filter(n => n.type === category);
  }
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedNotifications,
    unreadCount,
    total: filteredNotifications.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredNotifications.length / limit)
  });
});

app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notification = mockNotifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Уведомление не найдено' });
  }
  
  notification.isRead = true;
  notification.readAt = new Date().toISOString();
  
  // Отправляем событие
  broadcastEvent('notificationRead', { id, userId: notification.userId });
  
  res.json({ success: true });
});

app.post('/api/notifications/:id/star', (req, res) => {
  const { id } = req.params;
  const notification = mockNotifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Уведомление не найдено' });
  }
  
  notification.isStarred = !notification.isStarred;
  
  res.json({ success: true, isStarred: notification.isStarred });
});

app.post('/api/notifications/:id/archive', (req, res) => {
  const { id } = req.params;
  const notification = mockNotifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Уведомление не найдено' });
  }
  
  notification.isArchived = true;
  
  res.json({ success: true });
});

app.post('/api/notifications/read-all', (req, res) => {
  mockNotifications.forEach(n => {
    n.isRead = true;
    n.readAt = new Date().toISOString();
  });
  
  // Отправляем событие
  broadcastEvent('allNotificationsRead', { count: mockNotifications.length });
  
  res.json({ success: true, count: mockNotifications.length });
});

// Функция для создания уведомлений
function createNotification(title, message, type, priority, userId, relatedObjectType, relatedObjectId, triggeredByUserId) {
  const notification = {
    id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    message,
    type,
    priority,
    isRead: false,
    isStarred: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    userId,
    relatedObjectType,
    relatedObjectId,
    triggeredByUserId
  };
  
  mockNotifications.unshift(notification);
  
  // Отправляем событие
  broadcastEvent('notificationCreated', notification);
  
  return notification;
}

app.put('/api/admin/stages/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const stageIndex = hypothesisStages.findIndex(s => s.id === parseInt(id));
  if (stageIndex === -1) {
    return res.status(404).json({ error: 'Стадия не найдена' });
  }
  
  hypothesisStages[stageIndex] = { ...hypothesisStages[stageIndex], ...updates };
  res.json(hypothesisStages[stageIndex]);
});

app.put('/api/admin/stages/:id/order', (req, res) => {
  const { id } = req.params;
  const { direction } = req.body; // 'up' or 'down'
  
  const stageIndex = hypothesisStages.findIndex(s => s.id === parseInt(id));
  if (stageIndex === -1) {
    return res.status(404).json({ error: 'Стадия не найдена' });
  }
  
  const targetIndex = direction === 'up' ? stageIndex - 1 : stageIndex + 1;
  
  if (targetIndex >= 0 && targetIndex < hypothesisStages.length) {
    // Меняем местами
    [hypothesisStages[stageIndex], hypothesisStages[targetIndex]] = [hypothesisStages[targetIndex], hypothesisStages[stageIndex]];
    
    // Обновляем порядок
    hypothesisStages.forEach((stage, index) => {
      stage.order = index + 1;
    });
  }
  
  res.json(hypothesisStages);
});

app.get('/api/settings', (req, res) => {
  res.json(systemSettings);
});

app.put('/api/settings', (req, res) => {
  const { notifications, security, system } = req.body;
  
  if (notifications) {
    systemSettings.notifications = { ...systemSettings.notifications, ...notifications };
  }
  
  if (security) {
    systemSettings.security = { ...systemSettings.security, ...security };
  }
  
  if (system) {
    systemSettings.system = { ...systemSettings.system, ...system };
  }
  
  res.json(systemSettings);
});

app.post('/api/settings/reset', (req, res) => {
  systemSettings = {
    notifications: {
      email: true,
      push: false,
      slack: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: true,
      sessionTimeoutHours: 8
    },
    system: {
      theme: 'dark',
      language: 'ru',
      timezone: 'Europe/Moscow'
    }
  };
  
  res.json(systemSettings);
});

app.post('/api/experiments', (req, res) => {
  const { title, description, model, gpuType, parameters, dataset, expectedDuration, hypothesisId } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Название и описание обязательны' });
  }

  if (!hypothesisId) {
    return res.status(400).json({ error: 'ID гипотезы обязателен для создания эксперимента' });
  }

  // Проверяем, что гипотеза существует
  const hypothesis = mockHypotheses.find(h => h.id === hypothesisId);
  if (!hypothesis) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }
  
  const newExperiment = {
    id: (mockExperiments.length + 1).toString(),
    hypothesisId: hypothesisId,
    hypothesis: {
      id: hypothesis.id,
      title: hypothesis.title,
      stage: hypothesis.stage
    },
    name: title || "Новый эксперимент",
    variant: description || "Описание эксперимента",
    status: "queued",
    modelApproach: model || "GPT-3.5",
    parameters: typeof parameters === 'string' ? JSON.parse(parameters) : (parameters || {}),
    metrics: {},
    startedAt: null,
    completedAt: null,
    durationSeconds: null,
    gpuHoursUsed: 0,
    cost: 0,
    currency: "USD",
    artifactsUrl: null,
    notebookUrl: null,
    gitCommitHash: null,
    createdBy: {
      id: "ea96456f-8659-4589-bbbd-98428f47305e",
      name: "Иван Петров",
      email: "ivan.petrov@k2.tech"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockExperiments.push(newExperiment);
  
  // Отправляем событие всем клиентам
  broadcastEvent('experimentCreated', newExperiment);
  
  res.status(201).json(newExperiment);
});

// Mock notifications data (old)
const oldMockNotifications = [
  {
    id: "1",
    title: "Новая гипотеза требует одобрения",
    description: "Гипотеза 'Персонализированные рекомендации' ожидает вашего одобрения",
    type: "approval",
    priority: "high",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
    userId: "ea96456f-8659-4589-bbbd-98428f47305e",
    relatedId: "1",
    relatedType: "hypothesis"
  },
  {
    id: "2", 
    title: "Эксперимент завершен",
    description: "Эксперимент 'Тестирование LLM' успешно завершен с точностью 87%",
    type: "completion",
    priority: "medium",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 минут назад
    userId: "ea96456f-8659-4589-bbbd-98428f47305e",
    relatedId: "1",
    relatedType: "experiment"
  },
  {
    id: "3",
    title: "Новый комментарий",
    description: "Дмитрий Петров оставил комментарий к гипотезе 'Прогнозирование оттока'",
    type: "comment",
    priority: "low",
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 часа назад
    userId: "ea96456f-8659-4589-bbbd-98428f47305e",
    relatedId: "2",
    relatedType: "hypothesis"
  }
];

// Old notifications endpoints removed - using new ones above

// Добавляем недостающие API методы для экспериментов
app.get('/api/experiments/:id', (req, res) => {
  const experiment = mockExperiments.find(e => e.id === req.params.id);
  if (!experiment) {
    return res.status(404).json({ error: 'Эксперимент не найден' });
  }
  res.json(experiment);
});

app.put('/api/experiments/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const experimentIndex = mockExperiments.findIndex(e => e.id === id);
  if (experimentIndex === -1) {
    return res.status(404).json({ error: 'Эксперимент не найден' });
  }
  mockExperiments[experimentIndex] = { ...mockExperiments[experimentIndex], ...updates };
  broadcastEvent('experimentUpdated', mockExperiments[experimentIndex]);
  res.json(mockExperiments[experimentIndex]);
});

app.delete('/api/experiments/:id', (req, res) => {
  const { id } = req.params;
  const experimentIndex = mockExperiments.findIndex(e => e.id === id);
  if (experimentIndex === -1) {
    return res.status(404).json({ error: 'Эксперимент не найден' });
  }
  mockExperiments.splice(experimentIndex, 1);
  broadcastEvent('experimentDeleted', { id });
  res.json({ success: true });
});

// Добавляем метод CEO approval
app.post('/api/ceo/approve/:hypothesisId', (req, res) => {
  const { hypothesisId } = req.params;
  const { action } = req.body;
  const hypothesis = mockHypotheses.find(h => h.id === hypothesisId);
  if (!hypothesis) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }
  
  if (action === 'approved') {
    hypothesis.stage = 'scaling';
  } else if (action === 'rejected') {
    hypothesis.stage = 'archived';
  }
  
  hypothesis.updatedAt = new Date().toISOString();
  broadcastEvent('hypothesisUpdated', hypothesis);
  res.json({ success: true, hypothesis });
});

// Добавляем метод удаления пользователя
app.delete('/api/iam/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  const deletedUser = mockUsers.splice(userIndex, 1)[0];
  broadcastEvent('userDeleted', { id });
  res.json({ success: true });
});

// Добавляем недостающие методы для гипотез
app.put('/api/hypotheses/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const hypothesisIndex = mockHypotheses.findIndex(h => h.id === id);
  if (hypothesisIndex === -1) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }
  mockHypotheses[hypothesisIndex] = { ...mockHypotheses[hypothesisIndex], ...updates };
  broadcastEvent('hypothesisUpdated', mockHypotheses[hypothesisIndex]);
  res.json(mockHypotheses[hypothesisIndex]);
});

app.delete('/api/hypotheses/:id', (req, res) => {
  const { id } = req.params;
  const hypothesisIndex = mockHypotheses.findIndex(h => h.id === id);
  if (hypothesisIndex === -1) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }
  mockHypotheses.splice(hypothesisIndex, 1);
  broadcastEvent('hypothesisDeleted', { id });
  res.json({ success: true });
});

// POST /api/hypotheses/:id/comments - добавить комментарий к гипотезе
app.post('/api/hypotheses/:id/comments', (req, res) => {
  const { id } = req.params;
  const commentData = req.body;
  
  const hypothesis = mockHypotheses.find(h => h.id === id);
  
  if (!hypothesis) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }
  
  const newComment = {
    id: `comment-${Date.now()}`,
    ...commentData,
    createdAt: new Date().toISOString()
  };
  
  if (!hypothesis.comments) {
    hypothesis.comments = [];
  }
  hypothesis.comments.push(newComment);
  
  // Отправляем событие о новом комментарии
  broadcastEvent('commentAdded', { hypothesisId: id, comment: newComment });
  
  res.json(newComment);
});

// POST /api/hypotheses/:id/presentation - создать презентацию для гипотезы
app.post('/api/hypotheses/:id/presentation', (req, res) => {
  const { id } = req.params;
  const presentationData = req.body;
  
  const hypothesis = mockHypotheses.find(h => h.id === id);
  
  if (!hypothesis) {
    return res.status(404).json({ error: 'Гипотеза не найдена' });
  }
  
  const newPresentation = {
    id: `presentation-${Date.now()}`,
    hypothesisId: id,
    title: presentationData.title || `Презентация: ${hypothesis.title}`,
    description: presentationData.description || '',
    audience: presentationData.audience || 'stakeholders',
    language: presentationData.language || 'ru',
    format: presentationData.format || 'pptx',
    status: 'generating',
    createdAt: new Date().toISOString(),
    ...presentationData
  };
  
  // Отправляем событие о создании презентации
  broadcastEvent('presentationCreated', { hypothesisId: id, presentation: newPresentation });
  
  res.json(newPresentation);
});

// ==================== НАСТРОЙКИ СИСТЕМЫ ====================

// Mock данные для настроек
const mockSettings = {
  general: {
    platform_name: "K2.tech AI Lab",
    support_email: "support@k2tech.com",
    default_language: "ru",
    default_timezone: "Europe/Moscow",
    default_currency: "RUB",
    date_format: "DD.MM.YYYY",
    time_format: "24h"
  },
  notifications: {
    email_notifications: true,
    push_notifications: true,
    slack_integration: false,
    notification_sound: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
    digest_frequency: "daily"
  },
  security: {
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_numbers: true,
      require_special: true,
      expiration_days: 90
    },
    session_settings: {
      timeout_minutes: 480,
      max_concurrent_sessions: 3
    },
    two_factor_auth: {
      enforce_2fa: false,
      allowed_methods: ["authenticator", "sms", "email"]
    },
    ip_whitelist: []
  },
  data: {
    data_retention_days: 365,
    auto_backup_enabled: true,
    backup_frequency: "daily",
    backup_retention_days: 30,
    data_encryption: true,
    gdpr_compliance: true
  },
  appearance: {
    theme: "system",
    primary_color: "#3B82F6",
    secondary_color: "#10B981",
    accent_color: "#F59E0B",
    logo_light: "",
    logo_dark: "",
    custom_css: ""
  },
  integrations: {
    ldap_enabled: false,
    ldap_server: "",
    oauth_providers: [],
    webhook_urls: [],
    api_rate_limit: 1000
  }
};

// Mock данные для справочников
const mockDictionaries = {
  industries: [
    { id: "1", name: "Fintech", code: "FINTECH", description: "Финансовые технологии", active: true, order: 1 },
    { id: "2", name: "Retail", code: "RETAIL", description: "Розничная торговля", active: true, order: 2 },
    { id: "3", name: "Healthcare", code: "HEALTHCARE", description: "Здравоохранение", active: true, order: 3 },
    { id: "4", name: "Manufacturing", code: "MANUF", description: "Производство", active: true, order: 4 },
    { id: "5", name: "Media", code: "MEDIA", description: "Медиа и развлечения", active: true, order: 5 }
  ],
  ai_types: [
    { id: "1", name: "LLM", code: "LLM", description: "Large Language Models", active: true, order: 1 },
    { id: "2", name: "ML", code: "ML", description: "Machine Learning", active: true, order: 2 },
    { id: "3", name: "CV", code: "CV", description: "Computer Vision", active: true, order: 3 },
    { id: "4", name: "NLP", code: "NLP", description: "Natural Language Processing", active: true, order: 4 }
  ],
  business_categories: [
    { id: "1", name: "Cost Optimization", code: "COST_OPT", description: "Оптимизация затрат", active: true, order: 1 },
    { id: "2", name: "Revenue Generation", code: "REVENUE", description: "Генерация дохода", active: true, order: 2 },
    { id: "3", name: "Risk Mitigation", code: "RISK", description: "Снижение рисков", active: true, order: 3 },
    { id: "4", name: "Customer Experience", code: "CX", description: "Опыт клиентов", active: true, order: 4 }
  ],
  currencies: [
    { id: "1", name: "RUB", code: "RUB", symbol: "₽", exchange_rate: 1.0, active: true, order: 1 },
    { id: "2", name: "USD", code: "USD", symbol: "$", exchange_rate: 0.011, active: true, order: 2 },
    { id: "3", name: "EUR", code: "EUR", symbol: "€", exchange_rate: 0.010, active: true, order: 3 }
  ],
  departments: [
    { id: "1", name: "IT", code: "IT", description: "Информационные технологии", active: true, order: 1 },
    { id: "2", name: "Marketing", code: "MARKETING", description: "Маркетинг", active: true, order: 2 },
    { id: "3", name: "HR", code: "HR", description: "Человеческие ресурсы", active: true, order: 3 },
    { id: "4", name: "Finance", code: "FINANCE", description: "Финансы", active: true, order: 4 }
  ],
  hypothesis_stages: [
    { id: "1", name: "Backlog", code: "BACKLOG", description: "Бэклог", active: true, order: 1 },
    { id: "2", name: "Ideation", code: "IDEATION", description: "Идея", active: true, order: 2 },
    { id: "3", name: "Scoping", code: "SCOPING", description: "Скоупинг", active: true, order: 3 },
    { id: "4", name: "Prioritization", code: "PRIORITIZATION", description: "Приоритизация", active: true, order: 4 },
    { id: "5", name: "Experimentation", code: "EXPERIMENTATION", description: "Экспериментирование", active: true, order: 5 },
    { id: "6", name: "Evaluation", code: "EVALUATION", description: "Оценка", active: true, order: 6 },
    { id: "7", name: "Scaling", code: "SCALING", description: "Масштабирование", active: true, order: 7 },
    { id: "8", name: "Production", code: "PRODUCTION", description: "Продакшн", active: true, order: 8 },
    { id: "9", name: "Archived", code: "ARCHIVED", description: "Архив", active: true, order: 9 }
  ]
};

// GET /api/admin/dictionaries - получить все справочники
app.get('/api/admin/dictionaries', (req, res) => {
  res.json(mockDictionaries);
});

// GET /api/admin/dictionaries/:name - получить конкретный справочник
app.get('/api/admin/dictionaries/:name', (req, res) => {
  const { name } = req.params;
  const dictionary = mockDictionaries[name];
  
  if (!dictionary) {
    return res.status(404).json({ error: 'Справочник не найден' });
  }
  
  res.json(dictionary);
});

// POST /api/admin/dictionaries/:name - добавить запись в справочник
app.post('/api/admin/dictionaries/:name', (req, res) => {
  const { name } = req.params;
  const newItem = req.body;
  
  if (!mockDictionaries[name]) {
    return res.status(404).json({ error: 'Справочник не найден' });
  }
  
  // Генерируем ID
  newItem.id = (mockDictionaries[name].length + 1).toString();
  newItem.active = newItem.active !== false;
  newItem.order = newItem.order || mockDictionaries[name].length + 1;
  
  mockDictionaries[name].push(newItem);
  
  res.json({
    success: true,
    message: 'Запись добавлена в справочник',
    item: newItem
  });
});

// PUT /api/admin/dictionaries/:name/:id - обновить запись в справочнике
app.put('/api/admin/dictionaries/:name/:id', (req, res) => {
  const { name, id } = req.params;
  const updatedItem = req.body;
  
  if (!mockDictionaries[name]) {
    return res.status(404).json({ error: 'Справочник не найден' });
  }
  
  const itemIndex = mockDictionaries[name].findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Запись не найдена' });
  }
  
  mockDictionaries[name][itemIndex] = { ...mockDictionaries[name][itemIndex], ...updatedItem };
  
  res.json({
    success: true,
    message: 'Запись обновлена',
    item: mockDictionaries[name][itemIndex]
  });
});

// DELETE /api/admin/dictionaries/:name/:id - удалить запись из справочника
app.delete('/api/admin/dictionaries/:name/:id', (req, res) => {
  const { name, id } = req.params;
  
  if (!mockDictionaries[name]) {
    return res.status(404).json({ error: 'Справочник не найден' });
  }
  
  const itemIndex = mockDictionaries[name].findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Запись не найдена' });
  }
  
  mockDictionaries[name].splice(itemIndex, 1);
  
  res.json({
    success: true,
    message: 'Запись удалена'
  });
});

// GET /api/admin/settings - получить системные настройки
app.get('/api/admin/settings', (req, res) => {
  res.json(mockSettings);
});

// PUT /api/admin/settings - обновить системные настройки
app.put('/api/admin/settings', (req, res) => {
  const newSettings = req.body;
  
  // Обновляем настройки
  Object.assign(mockSettings, newSettings);
  
  // Отправляем событие об обновлении настроек
  broadcastEvent('adminSettingsUpdated', { settings: newSettings });
  
  res.json({
    success: true,
    message: 'Системные настройки обновлены',
    settings: mockSettings
  });
});

// ==================== IAM API ====================

// Mock данные для IAM
const mockUsers = [
  {
    id: "USR-001",
    name: "Иван Иванов",
    email: "ivan@k2tech.com",
    department: "IT",
    roles: ["Admin", "Data Scientist"],
    assigned_labs: ["All"],
    status: "Active",
    last_login: "21 Oct 2025, 18:30",
    created_at: "01 Jan 2025"
  },
  {
    id: "USR-002",
    name: "Анна Петрова",
    email: "anna@k2tech.com",
    department: "Marketing",
    roles: ["Business User"],
    assigned_labs: ["Marketing Lab"],
    status: "Active",
    last_login: "20 Oct 2025, 14:20",
    created_at: "15 Jan 2025"
  },
  {
    id: "USR-003",
    name: "Пётр Сидоров",
    email: "petr@k2tech.com",
    department: "HR",
    roles: ["ML Engineer", "Viewer"],
    assigned_labs: ["HR Lab", "Marketing Lab"],
    status: "Active",
    last_login: "19 Oct 2025, 09:15",
    created_at: "20 Jan 2025"
  }
];

const mockRoles = [
  {
    id: "ROLE-001",
    name: "Admin",
    description: "Полный доступ к системе",
    users_count: 3,
    permissions: ["All"]
  },
  {
    id: "ROLE-002",
    name: "CEO",
    description: "Исполнительный дашборд, стратегический контроль",
    users_count: 1,
    permissions: ["Read all", "Approve Critical"]
  },
  {
    id: "ROLE-003",
    name: "Data Scientist",
    description: "Создание и запуск экспериментов",
    users_count: 12,
    permissions: ["Create Hypothesis", "Run Experiments", "Read Data"]
  },
  {
    id: "ROLE-004",
    name: "ML Engineer",
    description: "Техническая реализация",
    users_count: 8,
    permissions: ["Run Experiments", "Deploy Models", "Manage Resources"]
  },
  {
    id: "ROLE-005",
    name: "Business User",
    description: "Просмотр и создание гипотез",
    users_count: 25,
    permissions: ["Create Hypothesis", "Comment", "View Experiments"]
  },
  {
    id: "ROLE-006",
    name: "Viewer",
    description: "Только чтение",
    users_count: 45,
    permissions: ["Read all"]
  }
];

const mockPermissions = [
  { id: "PERM-001", name: "hypothesis.create", resource: "Hypotheses", action: "Create", description: "Может создавать гипотезы" },
  { id: "PERM-002", name: "hypothesis.read", resource: "Hypotheses", action: "Read", description: "Может просматривать гипотезы" },
  { id: "PERM-003", name: "hypothesis.update", resource: "Hypotheses", action: "Update", description: "Может редактировать гипотезы" },
  { id: "PERM-004", name: "hypothesis.delete", resource: "Hypotheses", action: "Delete", description: "Может удалять гипотезы" },
  { id: "PERM-005", name: "hypothesis.approve", resource: "Hypotheses", action: "Approve", description: "Может одобрять переходы стадий гипотез" },
  { id: "PERM-006", name: "experiment.run", resource: "Experiments", action: "Execute", description: "Может запускать эксперименты" },
  { id: "PERM-007", name: "resource.reserve", resource: "Resources", action: "Create", description: "Может резервировать GPU/вычислительные ресурсы" },
  { id: "PERM-008", name: "user.manage", resource: "Users", action: "All", description: "Может управлять пользователями (только Admin)" },
  { id: "PERM-009", name: "settings.configure", resource: "Settings", action: "Update", description: "Может настраивать системные настройки (только Admin)" },
  { id: "PERM-010", name: "audit.view", resource: "Audit Logs", action: "Read", description: "Может просматривать аудит логи" }
];

const mockLaboratories = [
  {
    id: "LAB-001",
    name: "Marketing AI Lab",
    department: "Marketing",
    owner: "Анна Петрова",
    members: 12,
    visibility: "Private"
  },
  {
    id: "LAB-002",
    name: "HR Automation Lab",
    department: "HR",
    owner: "Пётр Сидоров",
    members: 8,
    visibility: "Private"
  },
  {
    id: "LAB-003",
    name: "Finance ML Lab",
    department: "Finance",
    owner: "Ольга Смирнова",
    members: 6,
    visibility: "Private"
  },
  {
    id: "LAB-004",
    name: "Corporate AI Sandbox",
    department: "IT",
    owner: "Иван Иванов",
    members: 50,
    visibility: "Public"
  }
];

const mockIAMAuditLogs = [
  {
    id: "AUDIT-001",
    timestamp: "21 Oct 2025, 18:45",
    user: "ivan@k2tech.com",
    action: "Created",
    resource_type: "Hypothesis",
    resource_id: "HYP-042",
    ip_address: "192.168.1.10",
    details: "Created new LLM hypothesis",
    status: "Success"
  },
  {
    id: "AUDIT-002",
    timestamp: "21 Oct 2025, 17:30",
    user: "anna@k2tech.com",
    action: "Approved",
    resource_type: "Hypothesis",
    resource_id: "HYP-038",
    ip_address: "192.168.1.25",
    details: "Approved transition to Scaling",
    status: "Success"
  },
  {
    id: "AUDIT-003",
    timestamp: "21 Oct 2025, 16:20",
    user: "petr@k2tech.com",
    action: "Updated",
    resource_type: "User",
    resource_id: "USR-005",
    ip_address: "192.168.1.30",
    details: "Changed role to Data Scientist",
    status: "Success"
  },
  {
    id: "AUDIT-004",
    timestamp: "21 Oct 2025, 15:10",
    user: "ivan@k2tech.com",
    action: "Failed Login",
    resource_type: "—",
    resource_id: "—",
    ip_address: "203.0.113.45",
    details: "Invalid password (3rd attempt)",
    status: "Failure"
  }
];

// GET /api/iam/users - получить список пользователей
app.get('/api/iam/users', (req, res) => {
  res.json(mockUsers);
});

// POST /api/iam/users - создать пользователя
app.post('/api/iam/users', (req, res) => {
  const newUser = req.body;
  
  // Проверяем, что email уникален
  if (mockUsers.find(user => user.email === newUser.email)) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
  }
  
  // Генерируем ID
  newUser.id = `USR-${String(mockUsers.length + 1).padStart(3, '0')}`;
  newUser.created_at = new Date().toLocaleDateString('en-GB');
  newUser.last_login = null;
  
  mockUsers.push(newUser);
  
  // Отправляем событие
  broadcastEvent('userCreated', { user: newUser });
  
  res.json({
    success: true,
    message: 'Пользователь создан',
    user: newUser
  });
});

// PUT /api/iam/users/:id - обновить пользователя
app.put('/api/iam/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
  
  // Отправляем событие
  broadcastEvent('userUpdated', { user: mockUsers[userIndex] });
  
  res.json({
    success: true,
    message: 'Пользователь обновлен',
    user: mockUsers[userIndex]
  });
});

// DELETE /api/iam/users/:id - удалить пользователя
app.delete('/api/iam/users/:id', (req, res) => {
  const { id } = req.params;
  
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  const deletedUser = mockUsers[userIndex];
  mockUsers.splice(userIndex, 1);
  
  // Отправляем событие
  broadcastEvent('userDeleted', { user: deletedUser });
  
  res.json({
    success: true,
    message: 'Пользователь удален'
  });
});

// GET /api/iam/roles - получить список ролей
app.get('/api/iam/roles', (req, res) => {
  res.json(mockRoles);
});

// POST /api/iam/roles - создать роль
app.post('/api/iam/roles', (req, res) => {
  const newRole = req.body;
  
  // Генерируем ID
  newRole.id = `ROLE-${String(mockRoles.length + 1).padStart(3, '0')}`;
  newRole.users_count = 0;
  
  mockRoles.push(newRole);
  
  res.json({
    success: true,
    message: 'Роль создана',
    role: newRole
  });
});

// PUT /api/iam/roles/:id - обновить роль
app.put('/api/iam/roles/:id', (req, res) => {
  const { id } = req.params;
  const updatedRole = req.body;
  
  const roleIndex = mockRoles.findIndex(role => role.id === id);
  if (roleIndex === -1) {
    return res.status(404).json({ error: 'Роль не найдена' });
  }
  
  mockRoles[roleIndex] = { ...mockRoles[roleIndex], ...updatedRole };
  
  res.json({
    success: true,
    message: 'Роль обновлена',
    role: mockRoles[roleIndex]
  });
});

// GET /api/iam/permissions - получить список разрешений
app.get('/api/iam/permissions', (req, res) => {
  res.json(mockPermissions);
});

// GET /api/iam/laboratories - получить список лабораторий
app.get('/api/iam/laboratories', (req, res) => {
  res.json(mockLaboratories);
});

// GET /api/iam/audit-logs - получить аудит логи
app.get('/api/iam/audit-logs', (req, res) => {
  res.json(mockIAMAuditLogs);
});

// GET /api/settings/system - получить системные настройки
app.get('/api/settings/system', (req, res) => {
  res.json(mockSettings);
});

// PUT /api/settings/system - обновить системные настройки
app.put('/api/settings/system', (req, res) => {
  const newSettings = req.body;
  
  // Обновляем настройки
  Object.assign(mockSettings, newSettings);
  
  // Отправляем событие об обновлении настроек
  broadcastEvent('systemSettingsUpdated', { settings: newSettings });
  
  res.json({
    success: true,
    message: 'Системные настройки обновлены',
    settings: mockSettings
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 Frontend URL: http://localhost:5002`);
});


