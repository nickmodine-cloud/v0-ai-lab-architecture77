"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Archive,
  Share2,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  DollarSign,
  Target,
  FileText,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

interface HypothesisDetailProps {
  hypothesisId: string
}

const hypothesisData = {
  id: "HYP-042",
  title: "LLM для автоматизации поддержки клиентов",
  description:
    "Внедрить чат-бот на основе GPT-4 для обработки запросов поддержки первого уровня, сокращая время ответа и повышая удовлетворенность клиентов при снижении операционных затрат.",
  hypothesisStatement:
    "Мы считаем, что внедрение чат-бота на основе ИИ для поддержки клиентов первого уровня сократит среднее время ответа с 4 часов до менее 5 минут, автоматически обработает 70% входящих запросов и снизит затраты на поддержку на 40% в течение 6 месяцев.",
  priority: "Критический",
  stage: "Оценка",
  status: "Активна",
  createdAt: "2025-01-15",
  updatedAt: "2025-01-20",
  dueDate: "2025-03-01",
  owner: {
    name: "Сара Чен",
    email: "sarah.chen@k2.tech",
    avatar: "",
    initials: "СЧ",
    role: "Руководитель ML",
  },
  technicalLead: {
    name: "Маркус Джонсон",
    email: "marcus.j@k2.tech",
    avatar: "",
    initials: "МД",
    role: "Старший инженер",
  },
  stakeholders: [
    { name: "Эмили Родригес", initials: "ЭР", role: "Продакт-менеджер" },
    { name: "Дэвид Ким", initials: "ДК", role: "CTO" },
  ],
  metrics: {
    experiments: 3,
    successRate: 72,
    daysInStage: 5,
    estimatedROI: 250000,
    confidence: 85,
  },
  tags: ["NLP", "Клиентский успех", "Снижение затрат"],
  businessContext: {
    problem:
      "Текущее время ответа службы поддержки слишком медленное, что приводит к неудовлетворенности клиентов и оттоку.",
    solution:
      "Развернуть ИИ-чат-бот для мгновенной обработки распространенных запросов, эскалируя сложные вопросы агентам-людям.",
    expectedOutcome:
      "70% автоматизация запросов, среднее время ответа 5 мин, снижение затрат на 40%, улучшение показателей CSAT.",
    risks: ["Галлюцинации модели", "Сложность интеграции", "Сопротивление пользователей"],
  },
  experiments: [
    {
      id: "EXP-001",
      name: "Базовая оценка GPT-4",
      status: "Завершен",
      progress: 100,
      accuracy: 78,
      startDate: "2025-01-16",
      endDate: "2025-01-18",
      results: "Хорошая базовая производительность, некоторые проблемы с доменными запросами",
    },
    {
      id: "EXP-002",
      name: "Fine-tuned модель с данными поддержки",
      status: "Завершен",
      progress: 100,
      accuracy: 85,
      startDate: "2025-01-19",
      endDate: "2025-01-21",
      results: "Значительное улучшение точности в домене, снижение галлюцинаций",
    },
    {
      id: "EXP-003",
      name: "RAG с базой знаний",
      status: "Выполняется",
      progress: 65,
      accuracy: null,
      startDate: "2025-01-22",
      endDate: null,
      results: null,
    },
  ],
  comments: [
    {
      id: "1",
      author: { name: "Дэвид Ким", initials: "ДК", avatar: "" },
      content: "Выглядит многообещающе. Какой план для обработки граничных случаев?",
      timestamp: "2025-01-20T10:30:00",
      likes: 3,
    },
    {
      id: "2",
      author: { name: "Сара Чен", initials: "СЧ", avatar: "" },
      content:
        "Мы внедряем порог уверенности - запросы с уверенностью ниже 80% автоматически эскалируются агентам-людям.",
      timestamp: "2025-01-20T11:15:00",
      likes: 5,
    },
    {
      id: "3",
      author: { name: "Эмили Родригес", initials: "ЭР", avatar: "" },
      content: "Можем ли мы подготовить демо к следующей встрече со стейкхолдерами?",
      timestamp: "2025-01-20T14:45:00",
      likes: 2,
    },
  ],
  timeline: [
    { date: "2025-01-15", event: "Гипотеза создана", user: "Сара Чен" },
    { date: "2025-01-16", event: "Перемещена в Скопинг", user: "Сара Чен" },
    { date: "2025-01-17", event: "Перемещена в Оценку", user: "Маркус Джонсон" },
    { date: "2025-01-18", event: "Первый эксперимент завершен", user: "Система" },
    { date: "2025-01-21", event: "Второй эксперимент завершен", user: "Система" },
  ],
}

const priorityVariant = {
  Критический: "destructive" as const,
  Высокий: "default" as const,
  Средний: "secondary" as const,
  Низкий: "outline" as const,
}

const stageColors = {
  Идея: "text-chart-5",
  Скопинг: "text-chart-4",
  Оценка: "text-chart-2",
  Эксперимент: "text-chart-1",
  Продакшен: "text-chart-3",
  Архив: "text-muted-foreground",
}

export function HypothesisDetail({ hypothesisId }: HypothesisDetailProps) {
  const [newComment, setNewComment] = useState("")
  const hypothesis = hypothesisData

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href="/hypotheses">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-sm font-mono text-muted-foreground">{hypothesis.id}</span>
            <Badge variant={priorityVariant[hypothesis.priority as keyof typeof priorityVariant]}>
              {hypothesis.priority}
            </Badge>
            <Badge variant="outline" className={stageColors[hypothesis.stage as keyof typeof stageColors]}>
              {hypothesis.stage}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{hypothesis.title}</h1>
          <p className="text-lg text-muted-foreground">{hypothesis.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Поделиться
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Редактировать
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Дублировать</DropdownMenuItem>
              <DropdownMenuItem>Экспортировать</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Archive className="h-4 w-4 mr-2" />
                Архивировать
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass glass-highlight p-4 border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Дней на этапе</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{hypothesis.metrics.daysInStage}</p>
          </div>
        </Card>

        <Card className="glass glass-highlight p-4 border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Экспериментов</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{hypothesis.metrics.experiments}</p>
          </div>
        </Card>

        <Card className="glass glass-highlight p-4 border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-chart-3">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Успешность</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{hypothesis.metrics.successRate}%</p>
          </div>
        </Card>

        <Card className="glass glass-highlight p-4 border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Ожид. ROI</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              ${(hypothesis.metrics.estimatedROI / 1000).toFixed(0)}K
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="experiments">Эксперименты</TabsTrigger>
              <TabsTrigger value="comments">Комментарии</TabsTrigger>
              <TabsTrigger value="timeline">Хронология</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Hypothesis Statement */}
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Формулировка гипотезы</h3>
                  </div>
                  <p className="text-foreground leading-relaxed">{hypothesis.hypothesisStatement}</p>
                </div>
              </Card>

              {/* Business Context */}
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Бизнес-контекст</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Проблема</h4>
                      <p className="text-foreground">{hypothesis.businessContext.problem}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Предлагаемое решение</h4>
                      <p className="text-foreground">{hypothesis.businessContext.solution}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Ожидаемый результат</h4>
                      <p className="text-foreground">{hypothesis.businessContext.expectedOutcome}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Риски</h4>
                      <ul className="space-y-2">
                        {hypothesis.businessContext.risks.map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-foreground">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tags */}
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Теги</h3>
                  <div className="flex flex-wrap gap-2">
                    {hypothesis.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="experiments" className="space-y-4 mt-6">
              {hypothesis.experiments.map((exp) => (
                <Card key={exp.id} className="glass glass-highlight p-6 border-border/50">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-muted-foreground">{exp.id}</span>
                          <Badge variant={exp.status === "Завершен" ? "default" : "secondary"}>{exp.status}</Badge>
                        </div>
                        <h4 className="text-lg font-semibold text-foreground">{exp.name}</h4>
                      </div>
                      {exp.accuracy && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-chart-3">{exp.accuracy}%</p>
                          <p className="text-xs text-muted-foreground">Точность</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="text-foreground font-medium">{exp.progress}%</span>
                      </div>
                      <Progress value={exp.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Начало: {exp.startDate}</span>
                      </div>
                      {exp.endDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Завершение: {exp.endDate}</span>
                        </div>
                      )}
                    </div>

                    {exp.results && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-sm text-foreground">{exp.results}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 mt-6">
              {/* New Comment */}
              <Card className="glass glass-highlight p-4 border-border/50">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Добавить комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] bg-background/50"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      Отправить
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Comments List */}
              {hypothesis.comments.map((comment) => (
                <Card key={comment.id} className="glass glass-highlight p-4 border-border/50">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-11">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-xs">{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        <span className="text-xs">Ответить</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-6">
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-6">
                  {hypothesis.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {idx < hypothesis.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm font-medium text-foreground">{event.event}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{event.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Команда</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Владелец гипотезы</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={hypothesis.owner.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{hypothesis.owner.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{hypothesis.owner.name}</p>
                      <p className="text-xs text-muted-foreground">{hypothesis.owner.role}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Технический лидер</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={hypothesis.technicalLead.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{hypothesis.technicalLead.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{hypothesis.technicalLead.name}</p>
                      <p className="text-xs text-muted-foreground">{hypothesis.technicalLead.role}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Стейкхолдеры</p>
                  <div className="flex flex-wrap gap-2">
                    {hypothesis.stakeholders.map((stakeholder, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{stakeholder.initials}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Dates */}
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Даты</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Создана</span>
                  <span className="text-sm text-foreground">{hypothesis.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Обновлена</span>
                  <span className="text-sm text-foreground">{hypothesis.updatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Срок</span>
                  <span className="text-sm text-foreground font-medium">{hypothesis.dueDate}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Confidence Score */}
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Уверенность</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-foreground">{hypothesis.metrics.confidence}%</span>
                  <Badge variant="default">Высокая</Badge>
                </div>
                <Progress value={hypothesis.metrics.confidence} className="h-2" />
                <p className="text-xs text-muted-foreground">На основе результатов экспериментов и оценки команды</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Действия</h3>
              <div className="space-y-2">
                <Button className="w-full gap-2" variant="default">
                  <CheckCircle2 className="h-4 w-4" />
                  Одобрить и продвинуть
                </Button>
                <Button className="w-full gap-2 bg-transparent" variant="outline">
                  <ThumbsDown className="h-4 w-4" />
                  Запросить изменения
                </Button>
                <Button className="w-full gap-2 bg-transparent" variant="outline">
                  <FileText className="h-4 w-4" />
                  Сгенерировать отчет
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
