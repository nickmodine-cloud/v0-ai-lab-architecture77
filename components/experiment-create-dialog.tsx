"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, BarChart3, Settings, Target } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface ExperimentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hypothesisId: string
  onSave: (experiment: any) => void
}

export function ExperimentCreateDialog({ open, onOpenChange, hypothesisId, onSave }: ExperimentCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    model: '',
    parameters: '{}',
    dataset: '',
    expectedDuration: '',
    cost: 0,
    tags: [] as string[],
    newTag: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Название эксперимента обязательно')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Описание эксперимента обязательно')
      return
    }

    if (!formData.model.trim()) {
      toast.error('Модель обязательна')
      return
    }

    try {
      setLoading(true)
      
      // Парсим параметры
      let parsedParameters = {}
      try {
        parsedParameters = JSON.parse(formData.parameters)
      } catch (e) {
        toast.error('Неверный формат JSON для параметров')
        return
      }

      const experimentData = {
        title: formData.title,
        description: formData.description,
        hypothesisId: hypothesisId,
        model: formData.model,
        parameters: parsedParameters,
        dataset: formData.dataset,
        expectedDuration: formData.expectedDuration,
        cost: Number(formData.cost),
        tags: formData.tags,
        status: 'planned'
      }

      const newExperiment = await api.experiments.createExperiment(experimentData)
      toast.success('Эксперимент создан')
      onSave(newExperiment)
      onOpenChange(false)
      
      // Сбрасываем форму
      setFormData({
        title: '',
        description: '',
        model: '',
        parameters: '{}',
        dataset: '',
        expectedDuration: '',
        cost: 0,
        tags: [],
        newTag: ''
      })
    } catch (error) {
      console.error('Ошибка создания эксперимента:', error)
      toast.error('Ошибка создания эксперимента')
    } finally {
      setLoading(false)
    }
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Создать эксперимент
          </DialogTitle>
          <DialogDescription>
            Создайте новый эксперимент для проверки гипотезы
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Название эксперимента *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Например: Тестирование GPT-4 для персонализации"
                />
              </div>

              <div>
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Опишите цель и методологию эксперимента..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Технические параметры */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Технические параметры
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="model">Модель ИИ *</Label>
                <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите модель" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    <SelectItem value="custom">Собственная модель</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="parameters">Параметры модели (JSON)</Label>
                <Textarea
                  id="parameters"
                  value={formData.parameters}
                  onChange={(e) => setFormData(prev => ({ ...prev, parameters: e.target.value }))}
                  placeholder='{"learning_rate": 0.001, "batch_size": 32, "epochs": 10}'
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="dataset">Датасет</Label>
                <Input
                  id="dataset"
                  value={formData.dataset}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataset: e.target.value }))}
                  placeholder="Путь к датасету или название"
                />
              </div>
            </CardContent>
          </Card>

          {/* Временные и финансовые параметры */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Планирование
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedDuration">Ожидаемая длительность</Label>
                  <Input
                    id="expectedDuration"
                    value={formData.expectedDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedDuration: e.target.value }))}
                    placeholder="Например: 2-3 часа"
                  />
                </div>

                <div>
                  <Label htmlFor="cost">Стоимость (₽)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                    placeholder="Например: 5000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Теги */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Теги</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Создание...' : 'Создать эксперимент'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

