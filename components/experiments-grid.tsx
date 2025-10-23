"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExperimentDialog } from "./experiment-dialog"
import { Experiment, ExperimentStatus } from "@/lib/api/types"
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
  HelpCircle,
} from "lucide-react"

// Убираем моки - используем реальные данные из API

const statusConfig: Record<string, {
  label: string
  icon: any
  variant: "default" | "destructive" | "secondary"
  color: string
}> = {
  queued: {
    label: "В очереди",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
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
  stopped: {
    label: "Остановлен",
    icon: PauseCircle,
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
}

export function ExperimentsGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperiments()
  }, [])

  const loadExperiments = async () => {
    try {
      setLoading(true)
      const response = await api.experiments.getExperiments()
      setExperiments(response.data)
    } catch (error) {
      console.error('Ошибка загрузки экспериментов:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.variant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || exp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: experiments.length,
    running: experiments.filter((e) => e.status === "running").length,
    completed: experiments.filter((e) => e.status === "completed").length,
    failed: experiments.filter((e) => e.status === "failed").length,
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
                <SelectItem value="queued">В очереди</SelectItem>
                <SelectItem value="running">Выполняется</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
                <SelectItem value="failed">Ошибка</SelectItem>
                <SelectItem value="stopped">Остановлен</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Experiments Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg font-medium text-foreground">Загрузка экспериментов...</p>
            </div>
          ) : filteredExperiments.map((exp) => {
            const statusInfo = statusConfig[exp.status] || {
              label: "Неизвестно",
              icon: HelpCircle,
              variant: "secondary" as const,
              color: "text-muted-foreground",
            }
            const StatusIcon = statusInfo.icon
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
                        <Badge variant={statusInfo.variant} className="text-xs gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-xs text-muted-foreground">
                    {exp.variant}
                  </div>

                  {/* Progress */}
                  {exp.status !== "failed" && exp.status !== "completed" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="text-foreground font-medium">
                          {exp.status === "running" ? "Выполняется..." : "Ожидание..."}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all animate-pulse" style={{ width: exp.status === "running" ? "60%" : "20%" }} />
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Модель</p>
                      <p className="text-sm font-semibold text-foreground">{exp.modelApproach}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">GPU</p>
                      <p className="text-sm font-semibold text-foreground">{exp.gpuHoursUsed}ч</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground">{exp.createdBy.name}</span>
                    <span className="text-muted-foreground">{exp.cost} {exp.currency}</span>
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
      <ExperimentDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        mode="create" 
        onSuccess={loadExperiments}
      />
    </>
  )
}
