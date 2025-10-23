"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

interface HypothesisEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hypothesis: any
  onSave: (updatedHypothesis: any) => void
}

export function HypothesisEditDialog({ open, onOpenChange, hypothesis, onSave }: HypothesisEditDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    stage: 'backlog',
    estimatedCost: 0,
    expectedROI: 0,
    estimatedDuration: '',
    tags: [] as string[],
    newTag: ''
  })

  useEffect(() => {
    if (hypothesis) {
      setFormData({
        title: hypothesis.title || '',
        description: hypothesis.description || '',
        priority: hypothesis.priority || 'medium',
        stage: hypothesis.stage || 'backlog',
        estimatedCost: hypothesis.estimatedCost || 0,
        expectedROI: hypothesis.expectedROI || 0,
        estimatedDuration: hypothesis.estimatedDuration || '',
        tags: hypothesis.tags || [],
        newTag: ''
      })
    }
  }, [hypothesis])

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Название гипотезы обязательно')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Описание гипотезы обязательно')
      return
    }

    onSave({
      ...hypothesis,
      ...formData,
      estimatedCost: Number(formData.estimatedCost),
      expectedROI: Number(formData.expectedROI)
    })
    onOpenChange(false)
  }

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать гипотезу</DialogTitle>
          <DialogDescription>
            Измените параметры гипотезы и сохраните изменения
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Название гипотезы *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Например: Персонализированные рекомендации увеличат конверсию"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Опишите гипотезу, её обоснование и ожидаемые результаты..."
                rows={4}
              />
            </div>
          </div>

          {/* Параметры */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Приоритет</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
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

            <div>
              <Label htmlFor="stage">Стадия</Label>
              <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Бэклог</SelectItem>
                  <SelectItem value="ideation">Идея</SelectItem>
                  <SelectItem value="scoping">Скопинг</SelectItem>
                  <SelectItem value="experimentation">Экспериментирование</SelectItem>
                  <SelectItem value="evaluation">Оценка</SelectItem>
                  <SelectItem value="production">Продакшен</SelectItem>
                  <SelectItem value="archived">Архив</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Финансовые параметры */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedCost">Ожидаемые инвестиции (₽)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
                placeholder="Например: 500000"
              />
            </div>

            <div>
              <Label htmlFor="expectedROI">Ожидаемый ROI (%)</Label>
              <Input
                id="expectedROI"
                type="number"
                value={formData.expectedROI}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedROI: Number(e.target.value) }))}
                placeholder="Например: 150"
              />
            </div>
          </div>

          {/* Временные параметры */}
          <div>
            <Label htmlFor="estimatedDuration">Ожидаемая длительность</Label>
            <Input
              id="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
              placeholder="Например: 6-8 недель"
            />
          </div>

          {/* Теги */}
          <div>
            <Label>Теги</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={formData.newTag}
                onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                placeholder="Добавить тег"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            Сохранить изменения
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

