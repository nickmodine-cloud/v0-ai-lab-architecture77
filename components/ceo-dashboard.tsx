"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { eventBus } from "@/lib/event-bus"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Lightbulb, 
  FlaskConical, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Clock,
  Users,
  Loader2,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface CEOMetrics {
  totalHypotheses: number
  inExperimentation: number
  inProduction: number
  successRate: number
  avgTimeToProduction: number
  totalInvestment: number
  realizedROI: number
  criticalRisks: number
}

interface CEOPipeline {
  backlog: number
  ideation: number
  scoping: number
  prioritization: number
  experimentation: number
  evaluation: number
  scaling: number
  production: number
  archived: number
}

interface AwaitingApproval {
  id: string
  title: string
  stage: string
  priority: string
  owner: string
  awaitingAction: string
  dueDate: string
  estimatedCost: number
}

export function CEODashboard() {
  const [metrics, setMetrics] = useState<CEOMetrics | null>(null)
  const [pipeline, setPipeline] = useState<CEOPipeline | null>(null)
  const [awaitingApproval, setAwaitingApproval] = useState<AwaitingApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCEOData()
    
    // Подписываемся на события
    eventBus.on('hypothesisCreated', handleHypothesisCreated)
    eventBus.on('hypothesisUpdated', handleHypothesisUpdated)
    eventBus.on('experimentCompleted', handleExperimentCompleted)
    eventBus.on('ceoDashboardUpdate', handleCEOUpdate)
    
    return () => {
      eventBus.off('hypothesisCreated', handleHypothesisCreated)
      eventBus.off('hypothesisUpdated', handleHypothesisUpdated)
      eventBus.off('experimentCompleted', handleExperimentCompleted)
      eventBus.off('ceoDashboardUpdate', handleCEOUpdate)
    }
  }, [])

  const loadCEOData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [metricsData, pipelineData, approvalData] = await Promise.all([
        api.ceo.getMetrics(),
        api.ceo.getPipeline(),
        api.ceo.getAwaitingApproval()
      ])
      
      setMetrics(metricsData)
      setPipeline(pipelineData)
      setAwaitingApproval(approvalData)
    } catch (err) {
      console.error('Ошибка загрузки CEO данных:', err)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleHypothesisCreated = (hypothesis: any) => {
    // Обновляем метрики в реальном времени
    loadCEOData()
  }

  const handleHypothesisUpdated = (hypothesis: any) => {
    // Обновляем метрики в реальном времени
    loadCEOData()
  }

  const handleExperimentCompleted = (experiment: any) => {
    // Обновляем метрики в реальном времени
    loadCEOData()
  }

  const handleCEOUpdate = (data: any) => {
    // Обновляем метрики в реальном времени
    loadCEOData()
  }

  const handleApprove = async (hypothesisId: string, action: string) => {
    try {
      await api.ceo.approveHypothesis(hypothesisId, action)
      toast.success('Решение принято')
      loadCEOData()
    } catch (error) {
      console.error('Ошибка одобрения:', error)
      toast.error('Ошибка одобрения')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'production': return 'bg-green-500'
      case 'scaling': return 'bg-blue-500'
      case 'evaluation': return 'bg-yellow-500'
      case 'experimentation': return 'bg-purple-500'
      case 'prioritization': return 'bg-orange-500'
      case 'scoping': return 'bg-cyan-500'
      case 'ideation': return 'bg-pink-500'
      case 'backlog': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка CEO Dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadCEOData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего гипотез</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalHypotheses || 0}</div>
            <p className="text-xs text-muted-foreground">
              +8% с прошлого месяца
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В экспериментировании</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.inExperimentation || 0}</div>
            <p className="text-xs text-muted-foreground">
              Активные эксперименты
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В продакшене</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.inProduction || 0}</div>
            <p className="text-xs text-muted-foreground">
              Успешно запущенные
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.successRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +5% с прошлого месяца
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Воронка гипотез</CardTitle>
          <CardDescription>Распределение гипотез по стадиям</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipeline && Object.entries(pipeline).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStageColor(stage)}`} />
                  <span className="capitalize">{stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{count}</span>
                  <div className="w-20">
                    <Progress value={(count / (metrics?.totalHypotheses || 1)) * 100} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Awaiting Approval */}
      <Card>
        <CardHeader>
          <CardTitle>Требуют внимания CEO</CardTitle>
          <CardDescription>Гипотезы, ожидающие вашего решения</CardDescription>
        </CardHeader>
        <CardContent>
          {awaitingApproval.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground">Нет гипотез, требующих внимания</p>
            </div>
          ) : (
            <div className="space-y-4">
              {awaitingApproval.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge variant={getPriorityColor(item.priority) as any}>
                        {item.priority}
                      </Badge>
                      <Badge variant="outline">{item.stage}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.awaitingAction} • {item.owner}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Стоимость: ${item.estimatedCost?.toLocaleString() || 0} • 
                      Срок: {new Date(item.dueDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(item.id, 'approved')}
                    >
                      Одобрить
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleApprove(item.id, 'rejected')}
                    >
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общие инвестиции</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics?.totalInvestment?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              В активных гипотезах
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Реализованный ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${metrics?.realizedROI?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              От продакшен гипотез
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Критические риски</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics?.criticalRisks || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Требуют внимания
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Average Time to Production */}
      <Card>
        <CardHeader>
          <CardTitle>Среднее время до продакшена</CardTitle>
          <CardDescription>Время от создания до запуска в продакшен</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
            <div>
              <div className="text-3xl font-bold">
                {metrics?.avgTimeToProduction || 0} недель
              </div>
              <p className="text-sm text-muted-foreground">
                Среднее время от идеи до продакшена
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}