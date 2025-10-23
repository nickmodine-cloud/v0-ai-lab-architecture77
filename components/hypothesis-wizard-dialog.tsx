"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Lightbulb } from "lucide-react"
import { api } from "@/lib/api"

interface HypothesisWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function HypothesisWizardDialog({
  open,
  onOpenChange,
  onSuccess,
}: HypothesisWizardDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stage: "ideation",
    priority: "medium",
    impact: "",
    effort: "",
    dataAvailability: 5,
    businessValue: 5,
    expectedRevenue: "",
    dataQuality: "Среднее",
    technicalComplexity: "Средняя",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert('Название и описание обязательны')
      return
    }

    try {
      setLoading(true)
      await api.hypotheses.createHypothesis({
        title: formData.title,
        description: formData.description,
        stage: formData.stage,
        priority: formData.priority,
        impact: formData.impact,
        effort: formData.effort,
        dataAvailability: formData.dataAvailability,
        businessValue: formData.businessValue,
        expectedRevenue: formData.expectedRevenue,
        dataQuality: formData.dataQuality,
        technicalComplexity: formData.technicalComplexity,
        tags: formData.tags,
      })
      
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Ошибка создания гипотезы:', error)
      alert('Ошибка создания гипотезы')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass glass-highlight max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="h-6 w-6 text-primary" />
            Создание новой гипотезы
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Основная информация</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Название гипотезы *</Label>
              <Input
                id="title"
                placeholder="Например: Персонализированные рекомендации увеличат конверсию"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="glass"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                placeholder="Опишите гипотезу, её обоснование и ожидаемые результаты..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glass min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Стадия</Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideation">Идея</SelectItem>
                    <SelectItem value="scoping">Скопинг</SelectItem>
                    <SelectItem value="experimentation">Экспериментирование</SelectItem>
                    <SelectItem value="evaluation">Оценка</SelectItem>
                    <SelectItem value="production">Продакшен</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Критический</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Бизнес-метрики */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Бизнес-метрики</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="impact">Ожидаемое влияние</Label>
                <Input
                  id="impact"
                  placeholder="Например: Увеличение конверсии на 15-20%"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="effort">Ожидаемые усилия</Label>
                <Input
                  id="effort"
                  placeholder="Например: 6-8 недель"
                  value={formData.effort}
                  onChange={(e) => setFormData({ ...formData, effort: e.target.value })}
                  className="glass"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedRevenue">Ожидаемый доход</Label>
              <Input
                id="expectedRevenue"
                placeholder="Например: 500K ₽/мес"
                value={formData.expectedRevenue}
                onChange={(e) => setFormData({ ...formData, expectedRevenue: e.target.value })}
                className="glass"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataAvailability">Доступность данных (1-10)</Label>
                <Input
                  id="dataAvailability"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.dataAvailability}
                  onChange={(e) => setFormData({ ...formData, dataAvailability: parseInt(e.target.value) || 5 })}
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessValue">Бизнес-ценность (1-10)</Label>
                <Input
                  id="businessValue"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.businessValue}
                  onChange={(e) => setFormData({ ...formData, businessValue: parseInt(e.target.value) || 5 })}
                  className="glass"
                />
              </div>
            </div>
          </div>

          {/* Технические детали */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Технические детали</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataQuality">Качество данных</Label>
                <Select value={formData.dataQuality} onValueChange={(value) => setFormData({ ...formData, dataQuality: value })}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Высокое">Высокое</SelectItem>
                    <SelectItem value="Среднее">Среднее</SelectItem>
                    <SelectItem value="Низкое">Низкое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicalComplexity">Техническая сложность</Label>
                <Select value={formData.technicalComplexity} onValueChange={(value) => setFormData({ ...formData, technicalComplexity: value })}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Низкая">Низкая</SelectItem>
                    <SelectItem value="Средняя">Средняя</SelectItem>
                    <SelectItem value="Высокая">Высокая</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Теги */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Теги</h3>
            
            <div className="flex gap-2">
              <Input
                placeholder="Добавить тег"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="glass"
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Создание..." : "Создать гипотезу"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}