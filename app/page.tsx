"use client"

import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, FlaskConical, TrendingUp, Clock, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import Link from "next/link"
import { HypothesisDetailDialog } from "@/components/hypothesis-detail-dialog"

interface DashboardStats {
  total: number
  byStage: Record<string, number>
  byPriority: Record<string, number>
  byAIType: Record<string, number>
  avgTimeToProduction: number
  successRate: number
}

interface RecentHypothesis {
  id: string
  title: string
  stage: string
  priority: string
  createdAt: string
}

interface RecentExperiment {
  id: string
  title: string
  status: string
  progress?: number
  hypothesisId?: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentHypotheses, setRecentHypotheses] = useState<RecentHypothesis[]>([])
  const [recentExperiments, setRecentExperiments] = useState<RecentExperiment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null)

  useEffect(() => {
    // Загружаем данные только на клиенте
    if (typeof window !== 'undefined') {
      loadDashboardData()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Загружаем статистику гипотез
      const [statsData, hypothesesData, experimentsData] = await Promise.all([
        api.hypotheses.getStats(),
        api.hypotheses.getAll({ page: 1, limit: 3 }),
        api.experiments.getExperiments({ page: 1, limit: 3 })
      ])

      setStats(statsData)
      setRecentHypotheses(hypothesesData.data || [])
      setRecentExperiments(experimentsData.data || [])
    } catch (err) {
      console.error('Ошибка загрузки данных дашборда:', err)
      setError('Ошибка загрузки данных')
      // Устанавливаем пустые данные при ошибке
      setStats({
        total: 0,
        byStage: {},
        byPriority: {},
        byAIType: {},
        avgTimeToProduction: 0,
        successRate: 0
      })
      setRecentHypotheses([])
      setRecentExperiments([])
    } finally {
      setLoading(false)
    }
  }

  const getStageName = (stage: string) => {
    const stageNames: Record<string, string> = {
      backlog: 'Бэклог',
      ideation: 'Идея',
      scoping: 'Скопинг',
      prioritization: 'Приоритизация',
      experimentation: 'Экспериментирование',
      evaluation: 'Оценка',
      scaling: 'Масштабирование',
      production: 'Продакшен',
      archived: 'Архив'
    }
    return stageNames[stage] || stage
  }

  const getPriorityName = (priority: string) => {
    const priorityNames: Record<string, string> = {
      critical: 'Критический',
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий'
    }
    return priorityNames[priority] || priority
  }

  const handleHypothesisClick = (hypothesisId: string) => {
    setSelectedHypothesisId(hypothesisId)
    setDetailDialogOpen(true)
  }

  const getStatusName = (status: string) => {
    const statusNames: Record<string, string> = {
      queued: 'В очереди',
      running: 'Выполняется',
      completed: 'Завершен',
      failed: 'Ошибка',
      stopped: 'Остановлен'
    }
    return statusNames[status] || status
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Загрузка данных...</span>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={loadDashboardData}>Попробовать снова</Button>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            {/* Hero Section */}
            <div className="glass glass-highlight rounded-2xl p-8 border border-border/50">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Добро пожаловать в ИИ-лабораторию K2.tech
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Управляйте ИИ-гипотезами, запускайте эксперименты и отслеживайте инновационный конвейер
                  </p>
                </div>
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/hypotheses">
                    <Sparkles className="h-4 w-4" />
                    Новая гипотеза
                  </Link>
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Активные гипотезы</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.total || 0}</p>
                    <p className="text-xs text-accent flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% за месяц
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/20 p-3">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">В экспериментах</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.byStage?.experimentation || 0}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">Без изменений</p>
                  </div>
                  <div className="rounded-full bg-secondary/20 p-3">
                    <FlaskConical className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Успешность</p>
                    <p className="text-3xl font-bold text-foreground">{Math.round(stats?.successRate || 0)}%</p>
                    <p className="text-xs text-accent flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +5% за квартал
                    </p>
                  </div>
                  <div className="rounded-full bg-accent/20 p-3">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Среднее время до прода</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.avgTimeToProduction?.toFixed(1) || 0}н</p>
                    <p className="text-xs text-accent flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      -1.3 недели
                    </p>
                  </div>
                  <div className="rounded-full bg-chart-3/20 p-3">
                    <Clock className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Последние гипотезы</h3>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <Link href="/hypotheses">
                        Все
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {recentHypotheses.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Нет гипотез
                      </p>
                    ) : (
                      recentHypotheses.map((hyp) => (
                        <div
                          key={hyp.id}
                          onClick={() => handleHypothesisClick(hyp.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3 transition-colors hover:bg-background/50">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground">{hyp.id}</span>
                                <Badge
                                  variant={
                                    hyp.priority === "critical"
                                      ? "destructive"
                                      : hyp.priority === "high"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {getPriorityName(hyp.priority)}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-foreground">{hyp.title}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {getStageName(hyp.stage)}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Выполняемые эксперименты</h3>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <Link href="/experiments">
                        Все
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {recentExperiments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Нет экспериментов
                      </p>
                    ) : (
                      recentExperiments.map((exp) => (
                        <Link
                          key={exp.id}
                          href={`/experiments/${exp.id}`}
                          className="block"
                        >
                          <div className="space-y-2 rounded-lg border border-border/50 bg-background/30 p-3 hover:bg-background/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs font-mono text-muted-foreground">{exp.id}</span>
                                <p className="text-sm font-medium text-foreground">{exp.title}</p>
                              </div>
                              <Badge 
                                variant={
                                  exp.status === "completed" 
                                    ? "default" 
                                    : exp.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                                } 
                                className="text-xs"
                              >
                                {getStatusName(exp.status)}
                              </Badge>
                            </div>
                            {exp.progress !== undefined && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Прогресс</span>
                                  <span className="text-foreground font-medium">{exp.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                  <div className="h-full bg-primary transition-all" style={{ width: `${exp.progress}%` }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Диалог детального просмотра гипотезы */}
      <HypothesisDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        hypothesisId={selectedHypothesisId || ''}
      />
    </SidebarProvider>
  )
}
