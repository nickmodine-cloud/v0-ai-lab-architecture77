"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface PasswordChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (passwordData: any) => void
}

export function PasswordChangeDialog({ open, onOpenChange, onSave }: PasswordChangeDialogProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!formData.currentPassword.trim()) {
      toast.error('Текущий пароль обязателен')
      return
    }

    if (!formData.newPassword.trim()) {
      toast.error('Новый пароль обязателен')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('Новый пароль должен содержать минимум 8 символов')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('Новый пароль должен отличаться от текущего')
      return
    }

    try {
      setLoading(true)
      
      // В реальном приложении здесь будет API для смены пароля
      await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация API вызова
      
      toast.success('Пароль успешно изменен')
      onSave(formData)
      onOpenChange(false)
      
      // Сбрасываем форму
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Ошибка смены пароля:', error)
      toast.error('Ошибка смены пароля')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, text: 'Слабый', color: 'text-red-500' }
    if (strength <= 3) return { strength, text: 'Средний', color: 'text-yellow-500' }
    return { strength, text: 'Сильный', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Смена пароля
          </DialogTitle>
          <DialogDescription>
            Измените пароль для вашей учетной записи
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Текущий пароль */}
          <div>
            <Label htmlFor="currentPassword">Текущий пароль *</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Введите текущий пароль"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Новый пароль */}
          <div>
            <Label htmlFor="newPassword">Новый пароль *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Введите новый пароль"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Индикатор силы пароля */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.strength <= 2 ? 'bg-red-500' :
                        passwordStrength.strength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Подтверждение пароля */}
          <div>
            <Label htmlFor="confirmPassword">Подтвердите новый пароль *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Подтвердите новый пароль"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Индикатор совпадения паролей */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center gap-2">
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">Пароли совпадают</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">Пароли не совпадают</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Требования к паролю */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Требования к паролю</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>• Минимум 8 символов</p>
              <p>• Содержит заглавные и строчные буквы</p>
              <p>• Содержит цифры</p>
              <p>• Содержит специальные символы</p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Смена пароля...' : 'Изменить пароль'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

