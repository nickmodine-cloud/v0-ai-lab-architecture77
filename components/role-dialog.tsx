"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield } from "lucide-react"

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "create" | "edit"
  initialData?: any
}

const availablePermissions = [
  { id: "hypothesis.create", label: "Создание гипотез" },
  { id: "hypothesis.read", label: "Чтение гипотез" },
  { id: "hypothesis.update", label: "Обновление гипотез" },
  { id: "hypothesis.delete", label: "Удаление гипотез" },
  { id: "hypothesis.approve", label: "Одобрение гипотез" },
  { id: "experiment.create", label: "Создание экспериментов" },
  { id: "experiment.run", label: "Запуск экспериментов" },
  { id: "user.manage", label: "Управление пользователями" },
  { id: "role.manage", label: "Управление ролями" },
  { id: "system.admin", label: "Администрирование системы" },
]

export function RoleDialog({ open, onOpenChange, mode = "create", initialData }: RoleDialogProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    description: initialData?.description || "",
    permissions: initialData?.permissions || [],
  })

  const handlePermissionToggle = (permissionId: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permissionId)
        ? formData.permissions.filter((p: string) => p !== permissionId)
        : [...formData.permissions, permissionId],
    })
  }

  const handleSubmit = () => {
    console.log("[v0] Submitting role:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass glass-highlight max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            {mode === "create" ? "Создание роли" : "Редактирование роли"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-name">Название роли *</Label>
            <Input
              id="role-name"
              placeholder="Например: ML Инженер"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-code">Код роли *</Label>
            <Input
              id="role-code"
              placeholder="ML_ENGINEER"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="glass font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">Описание</Label>
            <Textarea
              id="role-description"
              placeholder="Краткое описание роли и её назначения..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass"
            />
          </div>

          <div className="space-y-3">
            <Label>Права доступа</Label>
            <div className="glass glass-highlight p-4 rounded-lg space-y-3 max-h-[300px] overflow-y-auto">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <label
                    htmlFor={permission.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Выбрано прав: {formData.permissions.length} из {availablePermissions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>{mode === "create" ? "Создать роль" : "Сохранить изменения"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
