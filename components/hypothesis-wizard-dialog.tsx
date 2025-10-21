"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Sparkles, Target, Users, DollarSign, CheckCircle2 } from "lucide-react"

interface HypothesisWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "create" | "edit"
  initialData?: any
}

export function HypothesisWizardDialog({
  open,
  onOpenChange,
  mode = "create",
  initialData,
}: HypothesisWizardDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "Средний",
    stage: initialData?.stage || "Идея",
    businessGoal: initialData?.businessGoal || "",
    successMetrics: initialData?.successMetrics || "",
    targetAudience: initialData?.targetAudience || "",
    budget: initialData?.budget || "",
    timeline: initialData?.timeline || "",
    assignee: initialData?.assignee?.name || "",
    tags: initialData?.tags || [],
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const steps = [
    { number: 1, title: "Основная информация", icon: Sparkles },
    { number: 2, title: "Бизнес-контекст", icon: Target },
    { number: 3, title: "Команда и ресурсы", icon: Users },
    { number: 4, title: "Бюджет и сроки", icon: DollarSign },
  ]

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log("[v0] Submitting hypothesis:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass glass-highlight max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "create" ? "Создание новой гипотезы" : "Редактирование гипотезы"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Шаг {step} из {totalSteps}
            </span>
            <span>{Math.round(progress)}% завершено</span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between py-4">
          {steps.map((s) => {
            const StepIcon = s.icon
            const isActive = step === s.number
            const isCompleted = step > s.number
            return (
              <div key={s.number} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`rounded-full p-3 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                </div>
                <span
                  className={`text-xs text-center ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                >
                  {s.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="space-y-6 py-4">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название гипотезы *</Label>
                <Input
                  id="title"
                  placeholder="Например: LLM для автоматизации поддержки клиентов"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  placeholder="Подробное описание гипотезы и ожидаемых результатов..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Приоритет</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Критический">Критический</SelectItem>
                      <SelectItem value="Высокий">Высокий</SelectItem>
                      <SelectItem value="Средний">Средний</SelectItem>
                      <SelectItem value="Низкий">Низкий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Этап</Label>
                  <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Идея">Идея</SelectItem>
                      <SelectItem value="Скопинг">Скопинг</SelectItem>
                      <SelectItem value="Оценка">Оценка</SelectItem>
                      <SelectItem value="Эксперимент">Эксперимент</SelectItem>
                      <SelectItem value="Продакшен">Продакшен</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Context */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessGoal">Бизнес-цель</Label>
                <Textarea
                  id="businessGoal"
                  placeholder="Какую бизнес-проблему решает эта гипотеза?"
                  value={formData.businessGoal}
                  onChange={(e) => setFormData({ ...formData, businessGoal: e.target.value })}
                  className="glass min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="successMetrics">Метрики успеха</Label>
                <Textarea
                  id="successMetrics"
                  placeholder="Как будем измерять успех? (KPI, метрики, целевые значения)"
                  value={formData.successMetrics}
                  onChange={(e) => setFormData({ ...formData, successMetrics: e.target.value })}
                  className="glass min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Целевая аудитория</Label>
                <Input
                  id="targetAudience"
                  placeholder="Кто будет использовать результаты?"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="glass"
                />
              </div>
            </div>
          )}

          {/* Step 3: Team & Resources */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Ответственный</Label>
                <Select
                  value={formData.assignee}
                  onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                >
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Выберите ответственного" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Сара Чен">Сара Чен</SelectItem>
                    <SelectItem value="Маркус Джонсон">Маркус Джонсон</SelectItem>
                    <SelectItem value="Эмили Родригес">Эмили Родригес</SelectItem>
                    <SelectItem value="Дэвид Ким">Дэвид Ким</SelectItem>
                    <SelectItem value="Лиза Ванг">Лиза Ванг</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Теги</Label>
                <div className="flex flex-wrap gap-2 p-3 glass rounded-lg min-h-[60px]">
                  {formData.tags.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer">
                      {tag}
                      <button
                        onClick={() =>
                          setFormData({ ...formData, tags: formData.tags.filter((_: any, i: number) => i !== idx) })
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Добавить тег..."
                    className="glass"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        setFormData({ ...formData, tags: [...formData.tags, e.currentTarget.value] })
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">
                    Добавить
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Timeline */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Бюджет (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="10000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Временные рамки</Label>
                <Input
                  id="timeline"
                  placeholder="Например: 2-3 месяца"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="glass"
                />
              </div>

              <div className="glass glass-highlight p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">Сводка гипотезы</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Название:</span> {formData.title || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Приоритет:</span> {formData.priority}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Этап:</span> {formData.stage}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Ответственный:</span> {formData.assignee || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Бюджет:</span>{" "}
                    {formData.budget ? `$${formData.budget}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1} className="gap-2 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext} className="gap-2">
                Далее
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {mode === "create" ? "Создать гипотезу" : "Сохранить изменения"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
