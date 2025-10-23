"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { eventBus } from "@/lib/event-bus"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  ArrowLeft, 
  MoreVertical, 
  Calendar, 
  User, 
  DollarSign, 
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  BarChart3,
  Presentation,
  Loader2,
  RefreshCw,
  Edit,
  Trash2,
  Copy,
  Share,
  Archive,
  Play,
  Pause,
  Settings
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { HypothesisEditDialog } from "@/components/hypothesis-edit-dialog"
import { ExperimentCreateDialog } from "@/components/experiment-create-dialog"
import { PresentationCreateDialog } from "@/components/presentation-create-dialog"
import { CommentAddDialog } from "@/components/comment-add-dialog"

interface HypothesisDetail {
  id: string
  title: string
  description: string
  stage: string
  priority: string
  owner: string
  createdAt: string
  updatedAt: string
  estimatedCost: number
  expectedROI: number
  experiments: any[]
  comments: any[]
  files: any[]
  metrics: any
  risks: any[]
  timeline: any[]
}

export default function HypothesisDetailPage() {
  const params = useParams()
  const [hypothesis, setHypothesis] = useState<HypothesisDetail | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [experimentDialogOpen, setExperimentDialogOpen] = useState(false)
  const [presentationDialogOpen, setPresentationDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadHypothesis()
    }
    
    // Подписываемся на обновления
    eventBus.on('hypothesisUpdated', handleHypothesisUpdated)
    
    return () => {
      eventBus.off('hypothesisUpdated', handleHypothesisUpdated)
    }
  }, [params.id])

  const loadHypothesis = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.hypotheses.getById(params.id as string)
      setHypothesis(data)
    } catch (err) {
      console.error('Ошибка загрузки гипотезы:', err)
      setError('Ошибка загрузки гипотезы')
    } finally {
      setLoading(false)
    }
  }

  const handleHypothesisUpdated = (updatedHypothesis: any) => {
    if (updatedHypothesis.id === params.id) {
      setHypothesis(updatedHypothesis)
    }
  }

  const handleStageChange = async (newStage: string) => {
    try {
      await api.hypotheses.moveHypothesis(params.id as string, newStage)
      toast.success('Стадия изменена')
      loadHypothesis()
    } catch (error) {
      console.error('Ошибка изменения стадии:', error)
      toast.error('Ошибка изменения стадии')
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

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async (updatedHypothesis: any) => {
    try {
      await api.hypotheses.updateHypothesis(hypothesis.id, updatedHypothesis)
      toast.success('Гипотеза обновлена')
      loadHypothesis()
    } catch (error) {
      console.error('Ошибка обновления гипотезы:', error)
      toast.error('Ошибка обновления гипотезы')
    }
  }

  const handleSaveExperiment = async (experiment: any) => {
    toast.success('Эксперимент создан')
    loadHypothesis() // Перезагружаем данные гипотезы
  }

  const handleSavePresentation = async (presentation: any) => {
    toast.success('Презентация создается...')
    loadHypothesis() // Перезагружаем данные гипотезы
  }

  const handleSaveComment = async (comment: any) => {
    toast.success('Комментарий добавлен')
    loadHypothesis() // Перезагружаем данные гипотезы
  }

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить эту гипотезу?')) {
      try {
        await api.hypotheses.deleteHypothesis(hypothesis.id)
        toast.success('Гипотеза удалена')
        // Перенаправляем на список гипотез
        window.location.href = '/hypotheses'
      } catch (error) {
        console.error('Ошибка удаления гипотезы:', error)
        toast.error('Ошибка удаления гипотезы')
      }
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Ссылка скопирована в буфер обмена')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hypothesis.title,
        text: hypothesis.description,
        url: window.location.href
      })
    } else {
      handleCopy()
    }
  }

  const handleArchive = async () => {
    try {
      await api.hypotheses.updateHypothesis(hypothesis.id, { stage: 'archived' })
      toast.success('Гипотеза архивирована')
      loadHypothesis()
    } catch (error) {
      console.error('Ошибка архивирования гипотезы:', error)
      toast.error('Ошибка архивирования гипотезы')
    }
  }

  const handleMoveStage = async (newStage: string) => {
    try {
      await api.hypotheses.moveHypothesis(hypothesis.id, newStage)
      toast.success(`Гипотеза перемещена в стадию: ${newStage}`)
      loadHypothesis()
    } catch (error) {
      console.error('Ошибка перемещения гипотезы:', error)
      toast.error('Ошибка перемещения гипотезы')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка гипотезы...</span>
        </div>
      </div>
    )
  }

  if (error || !hypothesis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Гипотеза не найдена'}</p>
          <Button onClick={loadHypothesis}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/hypotheses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{hypothesis.title}</h1>
            <p className="text-muted-foreground">HYP-{hypothesis.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityColor(hypothesis.priority) as any}>
            {hypothesis.priority}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStageColor(hypothesis.stage)}`} />
            {hypothesis.stage}
          </Badge>
          
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Копировать ссылку
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Поделиться
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleMoveStage('ideation')}>
                <Play className="h-4 w-4 mr-2" />
                Переместить в Идея
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMoveStage('scoping')}>
                <Settings className="h-4 w-4 mr-2" />
                Переместить в Скопинг
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMoveStage('experimentation')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Переместить в Экспериментирование
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMoveStage('evaluation')}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Переместить в Оценку
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMoveStage('production')}>
                <Target className="h-4 w-4 mr-2" />
                Переместить в Продакшен
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Архивировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={handleEdit} variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Редактировать
        </Button>
        <Button onClick={() => setExperimentDialogOpen(true)} variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Начать эксперимент
        </Button>
        <Button onClick={() => handleMoveStage('evaluation')} variant="outline" size="sm">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Оценить
        </Button>
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Поделиться
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Инвестиции</span>
            </div>
            <p className="text-2xl font-bold">${hypothesis.estimatedCost?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ожидаемый ROI</span>
            </div>
            <p className="text-2xl font-bold">{hypothesis.expectedROI || 0}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Эксперименты</span>
            </div>
            <p className="text-2xl font-bold">{hypothesis.experiments?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Риски</span>
            </div>
            <p className="text-2xl font-bold">{hypothesis.risks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="experiments">Эксперименты</TabsTrigger>
          <TabsTrigger value="evaluation">Оценка</TabsTrigger>
          <TabsTrigger value="presentation">Презентация</TabsTrigger>
          <TabsTrigger value="discussion">Обсуждение</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Описание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{hypothesis.description}</p>
              </CardContent>
            </Card>

            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Метрики</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Всего экспериментов</span>
                  <span className="font-medium">{hypothesis.metrics?.totalExperiments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Завершено</span>
                  <span className="font-medium">{hypothesis.metrics?.completedExperiments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Лучшая точность</span>
                  <span className="font-medium">{hypothesis.metrics?.bestAccuracy || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Общая стоимость</span>
                  <span className="font-medium">${hypothesis.metrics?.totalCost || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Risks */}
            {hypothesis.risks && hypothesis.risks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Риски
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hypothesis.risks?.map((risk) => (
                      <div key={risk.id} className="p-3 border rounded-lg">
                        <p className="text-sm">{risk.description}</p>
                        <Badge variant="outline" className="mt-1">
                          {risk.severity} • {risk.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>История изменений</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hypothesis.timeline?.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.user} • {new Date(event.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experiments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Эксперименты</CardTitle>
                  <CardDescription>Все эксперименты для этой гипотезы</CardDescription>
                </div>
                <Button onClick={() => setExperimentDialogOpen(true)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Создать эксперимент
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!hypothesis.experiments || hypothesis.experiments.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Эксперименты не найдены</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hypothesis.experiments?.map((experiment) => (
                    <div key={experiment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{experiment.title}</h4>
                        <Badge variant={experiment.status === 'completed' ? 'default' : 'secondary'}>
                          {experiment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{experiment.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Стоимость: ${experiment.cost}</span>
                        <span>Точность: {experiment.metrics?.accuracy || 0}%</span>
                        <span>Длительность: {experiment.durationSeconds || 0}с</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <CardTitle>Оценка</CardTitle>
              <CardDescription>Анализ результатов и рекомендации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Статус оценки</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>В процессе оценки</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Рекомендации</h4>
                  <div className="space-y-2">
                    <p className="text-sm">• Продолжить экспериментирование для улучшения точности</p>
                    <p className="text-sm">• Рассмотреть альтернативные подходы к решению</p>
                    <p className="text-sm">• Подготовить план масштабирования</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presentation">
          <Card>
            <CardHeader>
              <CardTitle>Презентация</CardTitle>
              <CardDescription>Генерация презентации для стейкхолдеров</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Presentation className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Презентация еще не создана</p>
                <Button onClick={() => setPresentationDialogOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Создать презентацию
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussion">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Обсуждение</CardTitle>
                  <CardDescription>Комментарии и обсуждения</CardDescription>
                </div>
                <Button onClick={() => setCommentDialogOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Добавить комментарий
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!hypothesis.comments || hypothesis.comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Комментариев пока нет</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hypothesis.comments?.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                        {comment.isInternal && (
                          <Badge variant="outline" className="text-xs">Внутренний</Badge>
                        )}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Диалог редактирования гипотезы */}
      <HypothesisEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        hypothesis={hypothesis}
        onSave={handleSaveEdit}
      />

      {/* Диалог создания эксперимента */}
      <ExperimentCreateDialog
        open={experimentDialogOpen}
        onOpenChange={setExperimentDialogOpen}
        hypothesisId={hypothesis?.id || ''}
        onSave={handleSaveExperiment}
      />

      {/* Диалог создания презентации */}
      <PresentationCreateDialog
        open={presentationDialogOpen}
        onOpenChange={setPresentationDialogOpen}
        hypothesisId={hypothesis?.id || ''}
        hypothesis={hypothesis}
        onSave={handleSavePresentation}
      />

      {/* Диалог добавления комментария */}
      <CommentAddDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        hypothesisId={hypothesis?.id || ''}
        onSave={handleSaveComment}
      />
    </div>
  )
}