"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlaskConical } from "lucide-react"

interface ExperimentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hypothesisId?: string
  mode?: "create" | "edit"
  initialData?: any
}

export function ExperimentDialog({
  open,
  onOpenChange,
  hypothesisId,
  mode = "create",
  initialData,
}: ExperimentDialogProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    hypothesisId: hypothesisId || initialData?.hypothesisId || "",
    model: initialData?.model || "",
    parameters: initialData?.parameters || "",
    dataset: initialData?.dataset || "",
    gpuType: initialData?.gpuType || "A100",
    estimatedDuration: initialData?.estimatedDuration || "",
  })

  const handleSubmit = () => {
    console.log("[v0] Submitting experiment:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass glass-highlight max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FlaskConical className="h-6 w-6 text-primary" />
            {mode === "create" ? "Создание эксперимента" : "Редактирование эксперимента"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exp-name">Название эксперимента *</Label>
            <Input
              id="exp-name"
              placeholder="Например: Базовая модель GPT-4"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-description">Описание</Label>
            <Textarea
              id="exp-description"
              placeholder="Опишите цель и методологию эксперимента..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp-model">Модель</Label>
              <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                  <SelectItem value="llama-3.1">LLaMA 3.1</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="custom">Кастомная модель</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-gpu">Тип GPU</Label>
              <Select value={formData.gpuType} onValueChange={(value) => setFormData({ ...formData, gpuType: value })}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A100">NVIDIA A100</SelectItem>
                  <SelectItem value="H100">NVIDIA H100</SelectItem>
                  <SelectItem value="V100">NVIDIA V100</SelectItem>
                  <SelectItem value="T4">NVIDIA T4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-parameters">Параметры модели</Label>
            <Textarea
              id="exp-parameters"
              placeholder='{"learning_rate": 0.001, "batch_size": 32, "epochs": 10}'
              value={formData.parameters}
              onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
              className="glass font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-dataset">Датасет</Label>
            <Input
              id="exp-dataset"
              placeholder="Путь к датасету или название"
              value={formData.dataset}
              onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-duration">Ожидаемая длительность</Label>
            <Input
              id="exp-duration"
              placeholder="Например: 2-3 часа"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              className="glass"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>{mode === "create" ? "Создать эксперимент" : "Сохранить изменения"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
