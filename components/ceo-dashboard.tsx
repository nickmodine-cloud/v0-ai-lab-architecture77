"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
  ArrowRight,
  MoreVertical,
  ThumbsDown,
  FileText,
  Calendar,
  Award,
  Zap,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import Link from "next/link"

const executiveMetrics = [
  {
    title: "Всего гипотез",
    value: "47",
    change: "+8%",
    trend: "up",
    icon: Sparkles,
    color: "text-primary",
  },
  {
    title: "Успешность",
    value: "68%",
    change: "+5%",
    trend: "up",
    icon: Target,
    color: "text-chart-3",
  },
  {
    title: "Прогноз ROI",
    value: "$2.4M",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
    color: "text-accent",
  },
  {
    title: "Среднее время до прода",
    value: "8.2н",
    change: "-1.3н",
    trend: "up",
    icon: Clock,
    color: "text-chart-2",
  },
]

const pipelineData = [
  { stage: "Идея", count: 15, color: "hsl(var(--chart-5))" },
  { stage: "Скопинг", count: 12, color: "hsl(var(--chart-4))" },
  { stage: "Оценка", count: 8, color: "hsl(var(--chart-2))" },
  { stage: "Эксперимент", count: 7, color: "hsl(var(--chart-1))" },
  { stage: "Продакшен", count: 5, color: "hsl(var(--chart-3))" },
]

const awaitingApproval = [
  {
    id: "HYP-042",
    title: "LLM для автоматизации поддержки клиентов",
    owner: { name: "Сара Чен", initials: "СЧ" },
    priority: "Критический",
    estimatedROI: 250000,
    confidence: 85,
    stage: "Оценка → Эксперимент",
    daysWaiting: 2,
  },
  {
    id: "HYP-038",
    title: "ML система обнаружения мошенничества",
    owner: { name: "Маркус Джонсон", initials: "МД" },
    priority: "Высокий",
    estimatedROI: 180000,
    confidence: 78,
    stage: "Скопинг → Оценка",
    daysWaiting: 1,
  },
  {
    id: "HYP-029",
    title: "Дашборд предиктивной аналитики",
    owner: { name: "Дэвид Ким", initials: "ДК" },
    priority: "Высокий",
    estimatedROI: 320000,
    confidence: 92,
    stage: "Эксперимент → Продакшен",
    daysWaiting: 3,
  },
]

const topPerformers = [
  {
    name: "Сара Чен",
    initials: "СЧ",
    role: "Руководитель ML",
    hypotheses: 8,
    successRate: 87,
    totalROI: 680000,
  },
  {
    name: "Маркус Джонсон",
    initials: "МД",
    role: "Старший инженер",
    hypotheses: 6,
    successRate: 83,
    totalROI: 520000,
  },
  {
    name: "Эмили Родригес",
    initials: "ЭР",
    role: "Продакт-менеджер",
    hypotheses: 5,
    successRate: 80,
    totalROI: 450000,
  },
]

const recentMilestones = [
  {
    id: "HYP-015",
    title: "Пайплайн анализа тональности",
    event: "Перемещена в Продакшен",
    date: "2025-01-20",
    impact: "Высокий",
    roi: 180000,
  },
  {
    id: "HYP-033",
    title: "Модель классификации изображений",
    event: "Завершена фаза оценки",
    date: "2025-01-19",
    impact: "Средний",
    roi: 95000,
  },
  {
    id: "HYP-047",
    title: "Рекомендательный движок v2",
    event: "Начато экспериментирование",
    date: "2025-01-18",
    impact: "Высокий",
    roi: 220000,
  },
]

const strategicInsights = [
  {
    type: "opportunity",
    title: "Высокоценные гипотезы в конвейере",
    description: "3 критические гипотезы с совокупным ROI $750K+ ожидают одобрения",
    action: "Проверить одобрения",
    priority: "high",
  },
  {
    type: "risk",
    title: "Узкое место на этапе Оценки",
    description: "8 гипотез застряли в оценке в среднем на 10+ дней",
    action: "Выделить ресурсы",
    priority: "medium",
  },
  {
    type: "success",
    title: "Успешность Q1 превышает цель",
    description: "Текущая успешность 68% на 8% выше квартальной цели",
    action: "Поделиться лучшими практиками",
    priority: "low",
  },
]

const priorityVariant = {
  Критический: "destructive" as const,
  Высокий: "default" as const,
  Средний: "secondary" as const,
  Низкий: "outline" as const,
}

export function CEODashboard() {
  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Дашборд CEO</h1>
        <p className="text-lg text-muted-foreground">Обзор конвейера ИИ-инноваций для руководства</p>
      </div>

      {/* Executive Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {executiveMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="glass glass-highlight p-6 border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-chart-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs ${metric.trend === "up" ? "text-chart-3" : "text-destructive"}`}>
                      {metric.change} за прошлый квартал
                    </span>
                  </div>
                </div>
                <div className={`rounded-full bg-primary/20 p-3`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Strategic Insights */}
      <Card className="glass glass-highlight p-6 border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Стратегические инсайты</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              Все
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {strategicInsights.map((insight, idx) => (
              <Card
                key={idx}
                className={`glass glass-highlight p-4 border-border/50 ${
                  insight.priority === "high"
                    ? "border-l-4 border-l-destructive"
                    : insight.priority === "medium"
                      ? "border-l-4 border-l-accent"
                      : "border-l-4 border-l-chart-3"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge
                      variant={
                        insight.type === "opportunity"
                          ? "default"
                          : insight.type === "risk"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {insight.type === "opportunity" ? "возможность" : insight.type === "risk" ? "риск" : "успех"}
                    </Badge>
                    {insight.type === "opportunity" && <Zap className="h-4 w-4 text-accent" />}
                    {insight.type === "risk" && <AlertCircle className="h-4 w-4 text-destructive" />}
                    {insight.type === "success" && <Award className="h-4 w-4 text-chart-3" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-foreground">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                    {insight.action}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hypothesis Pipeline Funnel */}
        <Card className="glass glass-highlight p-6 border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Конвейер гипотез</h2>
              <Button variant="ghost" size="sm" className="gap-1">
                Детали
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Всего в конвейере</span>
              <span className="text-foreground font-semibold">47 гипотез</span>
            </div>
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="glass glass-highlight p-6 border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Лучшие исполнители</h2>
              <Button variant="ghost" size="sm" className="gap-1">
                Все
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {topPerformers.map((performer, idx) => (
                <Card key={idx} className="glass glass-highlight p-4 border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{performer.initials}</AvatarFallback>
                        </Avatar>
                        {idx === 0 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                            <Award className="h-3 w-3 text-accent-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{performer.name}</p>
                        <p className="text-xs text-muted-foreground">{performer.role}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {performer.hypotheses} гип
                        </Badge>
                        <Badge variant="default" className="text-xs">
                          {performer.successRate}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">${(performer.totalROI / 1000).toFixed(0)}K ROI</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Awaiting Approval */}
      <Card className="glass glass-highlight p-6 border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Ожидают вашего одобрения</h2>
              <Badge variant="destructive" className="text-xs">
                {awaitingApproval.length}
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              Все
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {awaitingApproval.map((item) => (
              <Card
                key={item.id}
                className="glass glass-highlight p-5 border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-muted-foreground">{item.id}</span>
                        <Badge
                          variant={priorityVariant[item.priority as keyof typeof priorityVariant]}
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.stage}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{item.owner.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{item.owner.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Ожидает {item.daysWaiting}д</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Ожид. ROI</p>
                        <p className="text-2xl font-bold text-accent">${(item.estimatedROI / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Уверенность</p>
                        <div className="flex items-center gap-2">
                          <Progress value={item.confidence} className="h-1.5 w-16" />
                          <span className="text-xs font-medium text-foreground">{item.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Button size="sm" className="gap-2 flex-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Одобрить
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 flex-1 bg-transparent">
                      <FileText className="h-4 w-4" />
                      Детали
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="px-2 bg-transparent">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Запросить изменения
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          Назначить ревьюера
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Запланировать ревью
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Milestones */}
      <Card className="glass glass-highlight p-6 border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Недавние вехи</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              Все
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentMilestones.map((milestone) => (
              <Link key={milestone.id} href={`/hypotheses/${milestone.id}`}>
                <Card className="glass glass-highlight p-4 border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-chart-3" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-muted-foreground">{milestone.id}</span>
                          <Badge
                            variant={
                              milestone.impact === "Высокий"
                                ? "default"
                                : milestone.impact === "Средний"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {milestone.impact} влияние
                          </Badge>
                        </div>
                        <p className="font-semibold text-sm text-foreground">{milestone.title}</p>
                        <p className="text-xs text-muted-foreground">{milestone.event}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-foreground">${(milestone.roi / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">{milestone.date}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" size="lg" className="h-auto p-6 flex-col gap-3 bg-transparent" asChild>
          <Link href="/hypotheses">
            <Sparkles className="h-8 w-8 text-primary" />
            <div className="space-y-1 text-center">
              <p className="font-semibold">Все гипотезы</p>
              <p className="text-xs text-muted-foreground">Просмотр полного конвейера</p>
            </div>
          </Link>
        </Button>

        <Button variant="outline" size="lg" className="h-auto p-6 flex-col gap-3 bg-transparent">
          <FileText className="h-8 w-8 text-accent" />
          <div className="space-y-1 text-center">
            <p className="font-semibold">Сгенерировать отчет</p>
            <p className="text-xs text-muted-foreground">Резюме для руководства</p>
          </div>
        </Button>

        <Button variant="outline" size="lg" className="h-auto p-6 flex-col gap-3 bg-transparent" asChild>
          <Link href="/admin">
            <Users className="h-8 w-8 text-secondary" />
            <div className="space-y-1 text-center">
              <p className="font-semibold">Управление командой</p>
              <p className="text-xs text-muted-foreground">Производительность команды</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}
