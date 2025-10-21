"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExperimentDialog } from "./experiment-dialog"
import {
  FlaskConical,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  PauseCircle,
} from "lucide-react"

type ExperimentStatus = "running" | "completed" | "failed" | "paused"

interface Experiment {
  id: string
  name: string
  hypothesisId: string
  hypothesisTitle: string
  status: ExperimentStatus
  progress: number
  accuracy?: number
  startDate: string
  duration: string
  owner: string
  gpuHours: number
  cost: number
}

const mockExperiments: Experiment[] = [
  {
    id: "EXP-001",
    name: "Базовая модель GPT-4",
    hypothesisId: "HYP-042",
    hypothesisTitle: "LLM для поддержки клиентов",
    status: "running",
    progress: 87,
    accuracy: 94.2,
    startDate: "2025-01-15",
    duration: "2ч 15м",
    owner: "Иван Петров",
    gpuHours: 2.25,
    cost: 45.5,
  },
  {
    id: "EXP-002",
    name: "Fine-tuned LLaMA 3.1",
    hypothesisId: "HYP-042",
    hypothesisTitle: "LLM для поддержки клиентов",
    status: "completed",
    progress: 100,
    accuracy: 96.8,
    startDate: "2025-01-14",
    duration: "4ч 32м",
    owner: "Иван Петров",
    gpuHours: 4.53,
    cost: 90.6,
  },
  {
    id: "EXP-003",
    name: "RAG с векторными эмбеддингами",
    hypothesisId: "HYP-051",
    hypothesisTitle: "База знаний RAG",
    status: "running",
    progress: 45,
    accuracy: 89.1,
    startDate: "2025-01-16",
    duration: "1ч 8м",
    owner: "Мария Сидорова",
    gpuHours: 1.13,
    cost: 22.6,
  },
  {
    id: "EXP-004",
    name: "Модель обнаружения аномалий v1",
    hypothesisId: "HYP-038",
    hypothesisTitle: "ML обнаружение мошенничества",
    status: "completed",
    progress: 100,
    accuracy: 92.5,
    startDate: "2025-01-13",
    duration: "3ч 45м",
    owner: "Алексей Смирнов",
    gpuHours: 3.75,
    cost: 75.0,
  },
  {
    id: "EXP-005",
    name: "Модель обнаружения аномалий v2",
    hypothesisId: "HYP-038",
    hypothesisTitle: "ML обнаружение мошенничества",
    status: "failed",
    progress: 68,
    startDate: "2025-01-15",
    duration: "1ч 52м",
    owner: "Алексей Смирнов",
    gpuHours: 1.87,
    cost: 37.4,
  },
  {
    id: "EXP-006",
    name: "Ансамбль моделей",
    hypothesisId: "HYP-038",
    hypothesisTitle: "ML обнаружение мошенничества",
    status: "paused",
    progress: 32,
    accuracy: 88.3,
    startDate: "2025-01-16",
    duration: "0ч 45м",
    owner: "Алексей Смирнов",
    gpuHours: 0.75,
    cost: 15.0,
  },
]

const statusConfig = {
  running: {
    label: "Выполняется",
    icon: PlayCircle,
    variant: "default" as const,
    color: "text-primary",
  },
  completed: {
    label: "Завершен",
    icon: CheckCircle2,
    variant: "default" as const,
    color: "text-accent",
  },
  failed: {
    label: "Ошибка",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-destructive",
  },
  paused: {
    label: "Приостановлен",
    icon: PauseCircle,
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
}

export function ExperimentsGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const filteredExperiments = mockExperiments.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.hypothesisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || exp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockExperiments.length,
    running: mockExperiments.filter((e) => e.status === "running").length,
    completed: mockExperiments.filter((e) => e.status === "completed").length,
    failed: mockExperiments.filter((e) => e.status === "failed").length,
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass glass-highlight rounded-2xl p-6 border border-border/50">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Эксперименты</h1>
              <p className="text-muted-foreground">Отслеживайте и управляйте всеми экспериментами по гипотезам</p>
            </div>
            <Button size="lg" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
              <FlaskConical className="h-4 w-4" />
              Новый эксперимент
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Всего экспериментов</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </Card>
          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Выполняется</p>
              <p className="text-2xl font-bold text-primary">{stats.running}</p>
            </div>
          </Card>
          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Завершено</p>
              <p className="text-2xl font-bold text-accent">{stats.completed}</p>
            </div>
          </Card>
          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ошибок</p>
              <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass glass-highlight p-4 border-border/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, ID или гипотезе..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 glass"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] glass">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="running">Выполняется</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
                <SelectItem value="failed">Ошибка</SelectItem>
                <SelectItem value="paused">Приостановлен</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Experiments Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExperiments.map((exp) => {
            const StatusIcon = statusConfig[exp.status].icon
            return (
              <Card
                key={exp.id}
                className="glass glass-highlight p-5 border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{exp.id}</span>
                        <Badge variant={statusConfig[exp.status].variant} className="text-xs gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[exp.status].label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Hypothesis Link */}
                  <div className="text-xs text-muted-foreground">
                    <span className="font-mono">{exp.hypothesisId}</span> • {exp.hypothesisTitle}
                  </div>

                  {/* Progress */}
                  {exp.status !== "failed" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="text-foreground font-medium">{exp.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all" style={{ width: `${exp.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                    {exp.accuracy && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Точность</p>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold text-foreground">{exp.accuracy}%</p>
                          {exp.accuracy > 90 ? (
                            <TrendingUp className="h-3 w-3 text-accent" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Длительность</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm font-semibold text-foreground">{exp.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground">{exp.owner}</span>
                    <span className="text-muted-foreground">${exp.cost.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredExperiments.length === 0 && (
          <Card className="glass glass-highlight p-12 border-border/50">
            <div className="text-center space-y-2">
              <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">Эксперименты не найдены</h3>
              <p className="text-sm text-muted-foreground">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          </Card>
        )}
      </div>

      {/* Dialog */}
      <ExperimentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} mode="create" />
    </>
  )
}
