"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Clock, TrendingUp, AlertCircle, CheckCircle2, Sparkles, Plus, Loader2 } from "lucide-react"
import { HypothesisWizardDialog } from "./hypothesis-wizard-dialog"
import { api } from "@/lib/api"
import { eventBus } from "@/lib/event-bus"

type Priority = "critical" | "high" | "medium" | "low"
type Stage = "backlog" | "ideation" | "scoping" | "prioritization" | "experimentation" | "evaluation" | "scaling" | "production" | "archived"

interface Hypothesis {
  id: string
  title: string
  description: string
  priority: Priority
  stage: Stage
  owner: string
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  creator?: {
    id: string
    name: string
    email: string
    role: string
    status: string
    experiments: number
  }
}

// Убираем статичные стадии - будем загружать из админки

const priorityVariant = {
  critical: "destructive" as const,
  high: "default" as const,
  medium: "secondary" as const,
  low: "outline" as const,
}

const priorityNames = {
  critical: "Критический",
  high: "Высокий", 
  medium: "Средний",
  low: "Низкий"
}

interface HypothesisKanbanProps {
  onRefresh?: () => void
  onHypothesisClick?: (hypothesisId: string) => void
}

export function HypothesisKanban({ onRefresh, onHypothesisClick }: HypothesisKanbanProps) {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [stageConfig, setStageConfig] = useState<Record<string, any>>({})
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    
    // Слушаем изменения стадий из админки
    const handleStagesUpdate = (data) => {
      if (data.type === 'stageUpdated') {
        loadStages()
      }
    }
    
    eventBus.on('stageUpdated', handleStagesUpdate)
    eventBus.on('kanbanUpdate', handleStagesUpdate)
    
    return () => {
      eventBus.off('stageUpdated', handleStagesUpdate)
      eventBus.off('kanbanUpdate', handleStagesUpdate)
    }
  }, [])

  const loadData = async () => {
    await Promise.all([loadHypotheses(), loadStages()])
  }

  // Перезагружаем данные при изменении стадий
  useEffect(() => {
    if (stages.length > 0) {
      loadHypotheses()
    }
  }, [stages])

  const loadStages = async () => {
    try {
      // Используем API клиент
      const activeStages = await api.admin.getStages()
      
      setStages(activeStages.map((stage: any) => stage.code as Stage))
      
      // Создаем конфигурацию стадий
      const config: Record<string, any> = {}
      activeStages.forEach((stage: any) => {
        config[stage.code] = {
          color: getStageColor(stage.code),
          icon: getStageIcon(stage.code),
          name: stage.name
        }
      })
      setStageConfig(config)
    } catch (err) {
      console.error('Ошибка загрузки стадий:', err)
      // Fallback к статичным стадиям
      const fallbackStages: Stage[] = ["backlog", "ideation", "scoping", "experimentation", "evaluation", "production", "archived"]
      setStages(fallbackStages)
      setStageConfig({
        backlog: { color: "text-muted-foreground", icon: Clock, name: "Бэклог" },
        ideation: { color: "text-chart-5", icon: Sparkles, name: "Идея" },
        scoping: { color: "text-chart-4", icon: AlertCircle, name: "Скопинг" },
        experimentation: { color: "text-chart-1", icon: Clock, name: "Экспериментирование" },
        evaluation: { color: "text-chart-2", icon: TrendingUp, name: "Оценка" },
        production: { color: "text-chart-3", icon: CheckCircle2, name: "Продакшен" },
        archived: { color: "text-muted-foreground", icon: Clock, name: "Архив" },
      })
    }
  }

  const getStageColor = (code: string) => {
    const colors: Record<string, string> = {
      backlog: "text-muted-foreground",
      ideation: "text-chart-5",
      scoping: "text-chart-4",
      experimentation: "text-chart-1",
      evaluation: "text-chart-2",
      production: "text-chart-3",
      archived: "text-muted-foreground",
    }
    return colors[code] || "text-muted-foreground"
  }

  const getStageIcon = (code: string) => {
    const icons: Record<string, any> = {
      backlog: Clock,
      ideation: Sparkles,
      scoping: AlertCircle,
      experimentation: Clock,
      evaluation: TrendingUp,
      production: CheckCircle2,
      archived: Clock,
    }
    return icons[code] || Clock
  }

  const loadHypotheses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.hypotheses.getAll()
      
      // Преобразуем данные из API в нужный формат
      const allHypotheses: Hypothesis[] = response.data.map((hyp: any) => ({
        id: hyp.id,
        title: hyp.title,
        description: hyp.description,
        priority: hyp.priority,
        stage: hyp.stage,
        owner: hyp.owner || 'Неизвестно',
        tags: hyp.tags || [],
        createdAt: hyp.createdAt,
        updatedAt: hyp.updatedAt,
        createdBy: hyp.createdBy,
        creator: hyp.creator
      }))
      
      setHypotheses(allHypotheses)
    } catch (err) {
      console.error('Ошибка загрузки гипотез:', err)
      setError('Ошибка загрузки гипотез')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, hypothesisId: string) => {
    setDraggedItem(hypothesisId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault()
    if (!draggedItem) return

    try {
      // Обновляем гипотезу через API
      await api.hypotheses.moveHypothesis(draggedItem, targetStage)

      // Обновляем локальное состояние
      setHypotheses((prev) =>
        prev.map((hyp) =>
          hyp.id === draggedItem ? { ...hyp, stage: targetStage } : hyp,
        ),
      )
      setDraggedItem(null)
    } catch (err) {
      console.error('Ошибка перемещения гипотезы:', err)
      setError('Ошибка перемещения гипотезы')
    }
  }

  const getHypothesesByStage = (stage: Stage) => {
    return hypotheses.filter((hyp) => hyp.stage === stage)
  }

  const handleEdit = (hypothesis: Hypothesis, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedHypothesis(hypothesis)
    setEditDialogOpen(true)
  }

  const handleDelete = async (hypothesisId: string) => {
    try {
      await api.hypotheses.deleteHypothesis(hypothesisId)
      setHypotheses((prev) => prev.filter((hyp) => hyp.id !== hypothesisId))
    } catch (err) {
      console.error('Ошибка удаления гипотезы:', err)
      setError('Ошибка удаления гипотезы')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка гипотез...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadHypotheses}>Попробовать снова</Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Канбан-доска гипотез</h2>
          <p className="text-sm text-muted-foreground">Перетаскивайте карточки между этапами</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Создать гипотезу
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageHypotheses = getHypothesesByStage(stage)
          const StageIcon = stageConfig[stage].icon

          return (
            <div
              key={stage}
              className="flex-shrink-0 w-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="glass glass-highlight rounded-xl p-4 space-y-4 min-h-[600px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StageIcon className={`h-5 w-5 ${stageConfig[stage].color}`} />
                    <h3 className="font-semibold text-foreground">{stageConfig[stage].name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {stageHypotheses.length}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {stageHypotheses.map((hypothesis) => (
                    <div key={hypothesis.id}>
                      <Card
                        draggable
                        onDragStart={(e) => handleDragStart(e, hypothesis.id)}
                        onClick={() => onHypothesisClick?.(hypothesis.id)}
                        className={`glass glass-highlight p-6 space-y-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg border-border/50 ${
                          draggedItem === hypothesis.id ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">{hypothesis.id}</span>
                            <Badge variant={priorityVariant[hypothesis.priority]} className="text-xs">
                              {priorityNames[hypothesis.priority]}
                            </Badge>
                            </div>
                            <h4 className="font-semibold text-lg text-foreground leading-tight">{hypothesis.title}</h4>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onHypothesisClick?.(hypothesis.id)}>Просмотр деталей</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleEdit(hypothesis, e as any)}>
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem>Дублировать</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Архивировать</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-base text-muted-foreground line-clamp-4">{hypothesis.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {hypothesis.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{Math.floor((Date.now() - new Date(hypothesis.updatedAt).getTime()) / (1000 * 60 * 60 * 24))}д</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {hypothesis.owner}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <HypothesisWizardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} mode="create" />
      <HypothesisWizardDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        initialData={selectedHypothesis}
      />
    </>
  )
}
