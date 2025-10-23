"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Presentation, FileText, Download, Share } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface PresentationCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hypothesisId: string
  hypothesis: any
  onSave: (presentation: any) => void
}

export function PresentationCreateDialog({ open, onOpenChange, hypothesisId, hypothesis, onSave }: PresentationCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: 'stakeholders',
    includeMetrics: true,
    includeExperiments: true,
    includeRisks: true,
    includeTimeline: true,
    includeCosts: true,
    language: 'ru',
    format: 'pptx'
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Название презентации обязательно')
      return
    }

    try {
      setLoading(true)
      
      const presentationData = {
        title: formData.title,
        description: formData.description,
        hypothesisId: hypothesisId,
        audience: formData.audience,
        includeMetrics: formData.includeMetrics,
        includeExperiments: formData.includeExperiments,
        includeRisks: formData.includeRisks,
        includeTimeline: formData.includeTimeline,
        includeCosts: formData.includeCosts,
        language: formData.language,
        format: formData.format,
        status: 'generating'
      }

      // Генерируем презентацию
      const presentation = await api.hypotheses.generatePresentation(hypothesisId, presentationData)
      toast.success('Презентация создается...')
      onSave(presentation)
      onOpenChange(false)
    } catch (error) {
      console.error('Ошибка создания презентации:', error)
      toast.error('Ошибка создания презентации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Presentation className="h-5 w-5" />
            Создать презентацию
          </DialogTitle>
          <DialogDescription>
            Создайте презентацию для стейкхолдеров на основе гипотезы
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
                <Label htmlFor="title">Название презентации *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={`Презентация: ${hypothesis?.title || 'Гипотеза'}`}
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Краткое описание презентации..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Настройки аудитории */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Настройки аудитории</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audience">Целевая аудитория</Label>
                <Select value={formData.audience} onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stakeholders">Стейкхолдеры</SelectItem>
                    <SelectItem value="technical">Техническая команда</SelectItem>
                    <SelectItem value="management">Руководство</SelectItem>
                    <SelectItem value="investors">Инвесторы</SelectItem>
                    <SelectItem value="custom">Пользовательская</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Язык</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Формат</Label>
                <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pptx">PowerPoint (.pptx)</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Содержание презентации */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Содержание презентации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeMetrics" 
                    checked={formData.includeMetrics}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeMetrics: !!checked }))}
                  />
                  <Label htmlFor="includeMetrics">Включить метрики и KPI</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeExperiments" 
                    checked={formData.includeExperiments}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeExperiments: !!checked }))}
                  />
                  <Label htmlFor="includeExperiments">Включить эксперименты</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeRisks" 
                    checked={formData.includeRisks}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeRisks: !!checked }))}
                  />
                  <Label htmlFor="includeRisks">Включить риски и митигацию</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeTimeline" 
                    checked={formData.includeTimeline}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeTimeline: !!checked }))}
                  />
                  <Label htmlFor="includeTimeline">Включить временную шкалу</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeCosts" 
                    checked={formData.includeCosts}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeCosts: !!checked }))}
                  />
                  <Label htmlFor="includeCosts">Включить финансовые показатели</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Предварительный просмотр */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Предварительный просмотр</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Гипотеза:</strong> {hypothesis?.title || 'Не выбрана'}</p>
                <p><strong>Аудитория:</strong> {formData.audience}</p>
                <p><strong>Язык:</strong> {formData.language === 'ru' ? 'Русский' : 'English'}</p>
                <p><strong>Формат:</strong> {formData.format.toUpperCase()}</p>
                <p><strong>Слайдов:</strong> ~{8 + (formData.includeMetrics ? 2 : 0) + (formData.includeExperiments ? 3 : 0) + (formData.includeRisks ? 2 : 0) + (formData.includeTimeline ? 1 : 0) + (formData.includeCosts ? 2 : 0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Создание...' : 'Создать презентацию'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

