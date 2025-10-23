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
import { MessageSquare, User, Lock, Globe } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface CommentAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hypothesisId: string
  onSave: (comment: any) => void
}

export function CommentAddDialog({ open, onOpenChange, hypothesisId, onSave }: CommentAddDialogProps) {
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    isInternal: false,
    priority: 'normal',
    category: 'general'
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!formData.content.trim()) {
      toast.error('Содержание комментария обязательно')
      return
    }

    if (!formData.author.trim()) {
      toast.error('Автор комментария обязателен')
      return
    }

    try {
      setLoading(true)
      
      const commentData = {
        content: formData.content,
        author: formData.author,
        hypothesisId: hypothesisId,
        isInternal: formData.isInternal,
        priority: formData.priority,
        category: formData.category,
        createdAt: new Date().toISOString()
      }

      // Создаем комментарий через API
      const newComment = await api.hypotheses.addComment(hypothesisId, commentData)
      toast.success('Комментарий добавлен')
      onSave(newComment)
      onOpenChange(false)
      
      // Сбрасываем форму
      setFormData({
        content: '',
        author: '',
        isInternal: false,
        priority: 'normal',
        category: 'general'
      })
    } catch (error) {
      console.error('Ошибка добавления комментария:', error)
      toast.error('Ошибка добавления комментария')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Добавить комментарий
          </DialogTitle>
          <DialogDescription>
            Добавьте комментарий или обсуждение к гипотезе
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Содержание комментария</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="author">Автор *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <Label htmlFor="content">Комментарий *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Введите ваш комментарий..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Настройки комментария */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Настройки комментария</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Приоритет</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="normal">Обычный</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                      <SelectItem value="urgent">Срочный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Общее</SelectItem>
                      <SelectItem value="technical">Техническое</SelectItem>
                      <SelectItem value="business">Бизнес</SelectItem>
                      <SelectItem value="question">Вопрос</SelectItem>
                      <SelectItem value="suggestion">Предложение</SelectItem>
                      <SelectItem value="concern">Обеспокоенность</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isInternal" 
                  checked={formData.isInternal}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isInternal: !!checked }))}
                />
                <Label htmlFor="isInternal" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Внутренний комментарий (только для команды)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Предварительный просмотр */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Предварительный просмотр</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{formData.author || 'Автор'}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('ru-RU')}
                  </span>
                  {formData.isInternal && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Внутренний</span>
                  )}
                </div>
                <p className="text-sm">{formData.content || 'Содержание комментария...'}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    Приоритет: {formData.priority}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Категория: {formData.category}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Добавление...' : 'Добавить комментарий'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

