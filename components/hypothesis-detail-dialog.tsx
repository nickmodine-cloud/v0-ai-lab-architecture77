"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { HypothesisEditDialog } from "./hypothesis-edit-dialog"
import { ExperimentCreateDialog } from "./experiment-create-dialog"
import { PresentationCreateDialog } from "./presentation-create-dialog"
import { CommentAddDialog } from "./comment-add-dialog"

interface HypothesisDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hypothesisId: string
}

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

export function HypothesisDetailDialog({ open, onOpenChange, hypothesisId }: HypothesisDetailDialogProps) {
  const [hypothesis, setHypothesis] = useState<HypothesisDetail | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Диалоги
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [experimentDialogOpen, setExperimentDialogOpen] = useState(false)
  const [presentationDialogOpen, setPresentationDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)

  useEffect(() => {
    if (open && hypothesisId) {
      loadHypothesis()
    }
  }, [open, hypothesisId])

  const loadHypothesis = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.hypotheses.getById(hypothesisId)
      setHypothesis(data)
    } catch (err) {
      console.error('Ошибка загрузки гипотезы:', err)
      setError('Ошибка загрузки гипотезы')
    } finally {
      setLoading(false)
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
    loadHypothesis()
  }

  const handleSavePresentation = async (presentation: any) => {
    toast.success('Презентация создается...')
    loadHypothesis()
  }

  const handleSaveComment = async (comment: any) => {
    toast.success('Комментарий добавлен')
    loadHypothesis()
  }

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить эту гипотезу?')) {
      try {
        await api.hypotheses.deleteHypothesis(hypothesis.id)
        toast.success('Гипотеза удалена')
        onOpenChange(false)
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] overflow-hidden">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Загрузка гипотезы...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !hypothesis) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] overflow-hidden">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Гипотеза не найдена'}</p>
              <Button onClick={loadHypothesis}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Попробовать снова
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">{hypothesis.title}</DialogTitle>
                <DialogDescription>HYP-{hypothesis.id}</DialogDescription>
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
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto flex-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                        <span className="font-medium">{hypothesis.experiments?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Завершено</span>
                        <span className="font-medium">{hypothesis.experiments?.filter((e: any) => e.status === 'completed').length || 0}</span>
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалоги */}
      <HypothesisEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        hypothesis={hypothesis}
        onSave={handleSaveEdit}
      />

      <ExperimentCreateDialog
        open={experimentDialogOpen}
        onOpenChange={setExperimentDialogOpen}
        hypothesisId={hypothesis?.id || ''}
        onSave={handleSaveExperiment}
      />

      <PresentationCreateDialog
        open={presentationDialogOpen}
        onOpenChange={setPresentationDialogOpen}
        hypothesisId={hypothesis?.id || ''}
        hypothesis={hypothesis}
        onSave={handleSavePresentation}
      />

      <CommentAddDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        hypothesisId={hypothesis?.id || ''}
        onSave={handleSaveComment}
      />
    </>
  )
}
