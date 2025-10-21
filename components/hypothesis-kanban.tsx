"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Clock, TrendingUp, AlertCircle, CheckCircle2, Sparkles, Plus } from "lucide-react"
import Link from "next/link"
import { HypothesisWizardDialog } from "./hypothesis-wizard-dialog"

type Priority = "Критический" | "Высокий" | "Средний" | "Низкий"
type Stage = "Идея" | "Скопинг" | "Оценка" | "Эксперимент" | "Продакшен" | "Архив"

interface Hypothesis {
  id: string
  title: string
  description: string
  priority: Priority
  stage: Stage
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  metrics: {
    experiments: number
    successRate?: number
    daysInStage: number
  }
  tags: string[]
}

const initialHypotheses: Hypothesis[] = [
  {
    id: "HYP-042",
    title: "LLM для автоматизации поддержки клиентов",
    description: "Внедрение чат-бота на базе GPT-4 для обработки запросов первого уровня",
    priority: "Критический",
    stage: "Оценка",
    assignee: { name: "Сара Чен", avatar: "", initials: "СЧ" },
    metrics: { experiments: 3, successRate: 72, daysInStage: 5 },
    tags: ["NLP", "Поддержка клиентов"],
  },
  {
    id: "HYP-038",
    title: "ML система обнаружения мошенничества",
    description:
      "Создание системы обнаружения мошенничества в реальном времени с использованием алгоритмов обнаружения аномалий",
    priority: "Высокий",
    stage: "Скопинг",
    assignee: { name: "Маркус Джонсон", avatar: "", initials: "МД" },
    metrics: { experiments: 0, daysInStage: 12 },
    tags: ["Безопасность", "ML"],
  },
  {
    id: "HYP-051",
    title: "База знаний на основе RAG",
    description: "Создание внутренней системы поиска знаний с использованием архитектуры RAG",
    priority: "Средний",
    stage: "Идея",
    assignee: { name: "Эмили Родригес", avatar: "", initials: "ЭР" },
    metrics: { experiments: 0, daysInStage: 3 },
    tags: ["RAG", "Внутренние инструменты"],
  },
  {
    id: "HYP-029",
    title: "Дашборд прогнозной аналитики",
    description: "ML-прогнозирование бизнес-метрик",
    priority: "Высокий",
    stage: "Эксперимент",
    assignee: { name: "Дэвид Ким", avatar: "", initials: "ДК" },
    metrics: { experiments: 8, successRate: 65, daysInStage: 18 },
    tags: ["Аналитика", "Прогнозирование"],
  },
  {
    id: "HYP-015",
    title: "Конвейер анализа тональности",
    description: "Автоматическое отслеживание тональности отзывов клиентов",
    priority: "Средний",
    stage: "Продакшен",
    assignee: { name: "Лиза Ванг", avatar: "", initials: "ЛВ" },
    metrics: { experiments: 12, successRate: 89, daysInStage: 45 },
    tags: ["NLP", "Аналитика"],
  },
  {
    id: "HYP-033",
    title: "Модель классификации изображений",
    description: "Компьютерное зрение для категоризации продуктов",
    priority: "Низкий",
    stage: "Оценка",
    assignee: { name: "Алекс Тернер", avatar: "", initials: "АТ" },
    metrics: { experiments: 2, successRate: 58, daysInStage: 8 },
    tags: ["Компьютерное зрение"],
  },
  {
    id: "HYP-047",
    title: "Рекомендательная система v2",
    description: "Коллаборативная фильтрация для персонализированных рекомендаций",
    priority: "Высокий",
    stage: "Скопинг",
    assignee: { name: "Сара Чен", avatar: "", initials: "СЧ" },
    metrics: { experiments: 0, daysInStage: 6 },
    tags: ["Рекомендации", "ML"],
  },
  {
    id: "HYP-019",
    title: "Интеграция голосового ассистента",
    description: "Распознавание речи и NLU для голосовых команд",
    priority: "Средний",
    stage: "Идея",
    assignee: { name: "Маркус Джонсон", avatar: "", initials: "МД" },
    metrics: { experiments: 0, daysInStage: 2 },
    tags: ["Голос", "NLP"],
  },
]

const stages: Stage[] = ["Идея", "Скопинг", "Оценка", "Эксперимент", "Продакшен", "Архив"]

const stageConfig = {
  Идея: { color: "text-chart-5", icon: Sparkles },
  Скопинг: { color: "text-chart-4", icon: AlertCircle },
  Оценка: { color: "text-chart-2", icon: TrendingUp },
  Эксперимент: { color: "text-chart-1", icon: Clock },
  Продакшен: { color: "text-chart-3", icon: CheckCircle2 },
  Архив: { color: "text-muted-foreground", icon: Clock },
}

const priorityVariant = {
  Критический: "destructive" as const,
  Высокий: "default" as const,
  Средний: "secondary" as const,
  Низкий: "outline" as const,
}

export function HypothesisKanban() {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>(initialHypotheses)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null)

  const handleDragStart = (e: React.DragEvent, hypothesisId: string) => {
    setDraggedItem(hypothesisId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault()
    if (!draggedItem) return

    setHypotheses((prev) =>
      prev.map((hyp) =>
        hyp.id === draggedItem ? { ...hyp, stage: targetStage, metrics: { ...hyp.metrics, daysInStage: 0 } } : hyp,
      ),
    )
    setDraggedItem(null)
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
              className="flex-shrink-0 w-[340px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="glass glass-highlight rounded-xl p-4 space-y-4 min-h-[600px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StageIcon className={`h-5 w-5 ${stageConfig[stage].color}`} />
                    <h3 className="font-semibold text-foreground">{stage}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {stageHypotheses.length}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {stageHypotheses.map((hypothesis) => (
                    <Link key={hypothesis.id} href={`/hypotheses/${hypothesis.id}`}>
                      <Card
                        draggable
                        onDragStart={(e) => handleDragStart(e, hypothesis.id)}
                        className={`glass glass-highlight p-4 space-y-3 cursor-move transition-all hover:scale-[1.02] hover:shadow-lg border-border/50 ${
                          draggedItem === hypothesis.id ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">{hypothesis.id}</span>
                              <Badge variant={priorityVariant[hypothesis.priority]} className="text-xs">
                                {hypothesis.priority}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-sm text-foreground leading-tight">{hypothesis.title}</h4>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Просмотр деталей</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleEdit(hypothesis, e as any)}>
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem>Дублировать</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Архивировать</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">{hypothesis.description}</p>

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
                              <span>{hypothesis.metrics.daysInStage}д</span>
                            </div>
                            {hypothesis.metrics.experiments > 0 && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{hypothesis.metrics.experiments} эксп</span>
                              </div>
                            )}
                            {hypothesis.metrics.successRate && (
                              <div className="flex items-center gap-1 text-chart-3">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>{hypothesis.metrics.successRate}%</span>
                              </div>
                            )}
                          </div>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={hypothesis.assignee.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{hypothesis.assignee.initials}</AvatarFallback>
                          </Avatar>
                        </div>
                      </Card>
                    </Link>
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
