"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff
} from "lucide-react"

// Интерфейсы для настроек
interface SystemSettings {
  general: {
    platform_name: string
    support_email: string
    default_language: string
    default_timezone: string
    default_currency: string
    date_format: string
    time_format: string
  }
  notifications: {
    email_notifications: boolean
    push_notifications: boolean
    slack_integration: boolean
    notification_sound: boolean
    quiet_hours_start: string
    quiet_hours_end: string
    digest_frequency: string
  }
  security: {
    password_policy: {
      min_length: number
      require_uppercase: boolean
      require_numbers: boolean
      require_special: boolean
      expiration_days: number
    }
    session_settings: {
      timeout_minutes: number
      max_concurrent_sessions: number
    }
    two_factor_auth: {
      enforce_2fa: boolean
      allowed_methods: string[]
    }
    ip_whitelist: string[]
  }
  data: {
    data_retention_days: number
    auto_backup_enabled: boolean
    backup_frequency: string
    backup_retention_days: number
    data_encryption: boolean
    gdpr_compliance: boolean
  }
  appearance: {
    theme: string
    primary_color: string
    secondary_color: string
    accent_color: string
    logo_light: string
    logo_dark: string
    custom_css: string
  }
  integrations: {
    ldap_enabled: boolean
    ldap_server: string
    oauth_providers: string[]
    webhook_urls: string[]
    api_rate_limit: number
  }
}

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      platform_name: "K2.tech AI Lab",
      support_email: "support@k2tech.com",
      default_language: "ru",
      default_timezone: "Europe/Moscow",
      default_currency: "RUB",
      date_format: "DD.MM.YYYY",
      time_format: "24h"
    },
    notifications: {
      email_notifications: true,
      push_notifications: true,
      slack_integration: false,
      notification_sound: true,
      quiet_hours_start: "22:00",
      quiet_hours_end: "08:00",
      digest_frequency: "daily"
    },
    security: {
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_numbers: true,
        require_special: true,
        expiration_days: 90
      },
      session_settings: {
        timeout_minutes: 480,
        max_concurrent_sessions: 3
      },
      two_factor_auth: {
        enforce_2fa: false,
        allowed_methods: ["authenticator", "sms", "email"]
      },
      ip_whitelist: []
    },
    data: {
      data_retention_days: 365,
      auto_backup_enabled: true,
      backup_frequency: "daily",
      backup_retention_days: 30,
      data_encryption: true,
      gdpr_compliance: true
    },
    appearance: {
      theme: "system",
      primary_color: "#3B82F6",
      secondary_color: "#10B981",
      accent_color: "#F59E0B",
      logo_light: "",
      logo_dark: "",
      custom_css: ""
    },
    integrations: {
      ldap_enabled: false,
      ldap_server: "",
      oauth_providers: [],
      webhook_urls: [],
      api_rate_limit: 1000
    }
  })

  // Загружаем настройки
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/settings/system')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
      toast.error('Ошибка загрузки настроек')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('http://localhost:5001/api/settings/system', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        toast.success('Настройки сохранены')
      } else {
        throw new Error('Ошибка сохранения')
      }
    } catch (error) {
      toast.error('Ошибка сохранения настроек')
    } finally {
      setSaving(false)
    }
  }

  const exportSettings = async () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'system-settings.json'
      link.click()
      URL.revokeObjectURL(url)
      toast.success('Настройки экспортированы')
    } catch (error) {
      toast.error('Ошибка экспорта настроек')
    }
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          toast.success('Настройки импортированы')
        } catch (error) {
          toast.error('Ошибка импорта настроек')
        }
      }
      reader.readAsText(file)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Загрузка настроек...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Настройки системы</h1>
          <p className="text-muted-foreground">Управление системными параметрами и конфигурацией</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadSettings} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
          <Button onClick={exportSettings} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
          <label>
            <Button asChild variant="outline">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Импорт
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Сохранить
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="data">Данные</TabsTrigger>
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Основные параметры системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform_name">Название платформы</Label>
                  <Input
                    id="platform_name"
                    value={settings.general.platform_name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, platform_name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="support_email">Email поддержки</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={settings.general.support_email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, support_email: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="default_language">Язык по умолчанию</Label>
                  <Select
                    value={settings.general.default_language}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, default_language: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="default_timezone">Часовой пояс</Label>
                  <Select
                    value={settings.general.default_timezone}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, default_timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Europe/London">Лондон (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">Нью-Йорк (UTC-5)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Токио (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="default_currency">Валюта по умолчанию</Label>
                  <Select
                    value={settings.general.default_currency}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, default_currency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUB">₽ RUB</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="CNY">¥ CNY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date_format">Формат даты</Label>
                  <Select
                    value={settings.general.date_format}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, date_format: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Управление уведомлениями и каналами связи</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Каналы уведомлений</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_notifications">Email уведомления</Label>
                      <p className="text-sm text-muted-foreground">Отправка уведомлений на email</p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={settings.notifications.email_notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email_notifications: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push_notifications">Push уведомления</Label>
                      <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={settings.notifications.push_notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push_notifications: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="slack_integration">Slack интеграция</Label>
                      <p className="text-sm text-muted-foreground">Отправка в Slack каналы</p>
                    </div>
                    <Switch
                      id="slack_integration"
                      checked={settings.notifications.slack_integration}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, slack_integration: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notification_sound">Звук уведомлений</Label>
                      <p className="text-sm text-muted-foreground">Звуковое сопровождение</p>
                    </div>
                    <Switch
                      id="notification_sound"
                      checked={settings.notifications.notification_sound}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, notification_sound: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Время тишины</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet_start">Начало</Label>
                    <Input
                      id="quiet_start"
                      type="time"
                      value={settings.notifications.quiet_hours_start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, quiet_hours_start: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiet_end">Конец</Label>
                    <Input
                      id="quiet_end"
                      type="time"
                      value={settings.notifications.quiet_hours_end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, quiet_hours_end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Дайджест</h4>
                <div>
                  <Label htmlFor="digest_frequency">Частота дайджеста</Label>
                  <Select
                    value={settings.notifications.digest_frequency}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, digest_frequency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Отключен</SelectItem>
                      <SelectItem value="hourly">Каждый час</SelectItem>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>Настройки безопасности и аутентификации</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Политика паролей</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_length">Минимальная длина</Label>
                    <Input
                      id="min_length"
                      type="number"
                      value={settings.security.password_policy.min_length}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          password_policy: {
                            ...prev.security.password_policy,
                            min_length: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiration_days">Срок действия (дни)</Label>
                    <Input
                      id="expiration_days"
                      type="number"
                      value={settings.security.password_policy.expiration_days}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          password_policy: {
                            ...prev.security.password_policy,
                            expiration_days: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_uppercase"
                      checked={settings.security.password_policy.require_uppercase}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          password_policy: {
                            ...prev.security.password_policy,
                            require_uppercase: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="require_uppercase">Требовать заглавные буквы</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_numbers"
                      checked={settings.security.password_policy.require_numbers}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          password_policy: {
                            ...prev.security.password_policy,
                            require_numbers: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="require_numbers">Требовать цифры</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require_special"
                      checked={settings.security.password_policy.require_special}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          password_policy: {
                            ...prev.security.password_policy,
                            require_special: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="require_special">Требовать спецсимволы</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Настройки сессий</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeout_minutes">Таймаут сессии (минуты)</Label>
                    <Input
                      id="timeout_minutes"
                      type="number"
                      value={settings.security.session_settings.timeout_minutes}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          session_settings: {
                            ...prev.security.session_settings,
                            timeout_minutes: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_sessions">Макс. сессий на пользователя</Label>
                    <Input
                      id="max_sessions"
                      type="number"
                      value={settings.security.session_settings.max_concurrent_sessions}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          session_settings: {
                            ...prev.security.session_settings,
                            max_concurrent_sessions: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Двухфакторная аутентификация</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enforce_2fa"
                      checked={settings.security.two_factor_auth.enforce_2fa}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          two_factor_auth: {
                            ...prev.security.two_factor_auth,
                            enforce_2fa: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="enforce_2fa">Обязательная 2FA</Label>
                  </div>
                  <div>
                    <Label>Разрешенные методы</Label>
                    <div className="space-y-2 mt-2">
                      {['authenticator', 'sms', 'email'].map(method => (
                        <div key={method} className="flex items-center space-x-2">
                          <Switch
                            checked={settings.security.two_factor_auth.allowed_methods.includes(method)}
                            onCheckedChange={(checked) => {
                              const newMethods = checked
                                ? [...settings.security.two_factor_auth.allowed_methods, method]
                                : settings.security.two_factor_auth.allowed_methods.filter(m => m !== method)
                              setSettings(prev => ({
                                ...prev,
                                security: {
                                  ...prev.security,
                                  two_factor_auth: {
                                    ...prev.security.two_factor_auth,
                                    allowed_methods: newMethods
                                  }
                                }
                              }))
                            }}
                          />
                          <Label className="capitalize">{method}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Управление данными</CardTitle>
              <CardDescription>Настройки хранения и обработки данных</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_retention">Хранение данных (дни)</Label>
                  <Input
                    id="data_retention"
                    type="number"
                    value={settings.data.data_retention_days}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, data_retention_days: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="backup_retention">Хранение бэкапов (дни)</Label>
                  <Input
                    id="backup_retention"
                    type="number"
                    value={settings.data.backup_retention_days}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, backup_retention_days: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_backup">Автоматические бэкапы</Label>
                    <p className="text-sm text-muted-foreground">Регулярное создание резервных копий</p>
                  </div>
                  <Switch
                    id="auto_backup"
                    checked={settings.data.auto_backup_enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, auto_backup_enabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data_encryption">Шифрование данных</Label>
                    <p className="text-sm text-muted-foreground">Шифрование чувствительных данных</p>
                  </div>
                  <Switch
                    id="data_encryption"
                    checked={settings.data.data_encryption}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, data_encryption: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gdpr_compliance">GDPR соответствие</Label>
                    <p className="text-sm text-muted-foreground">Соответствие европейскому регламенту</p>
                  </div>
                  <Switch
                    id="gdpr_compliance"
                    checked={settings.data.gdpr_compliance}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      data: { ...prev.data, gdpr_compliance: checked }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="backup_frequency">Частота бэкапов</Label>
                <Select
                  value={settings.data.backup_frequency}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    data: { ...prev.data, backup_frequency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Каждый час</SelectItem>
                    <SelectItem value="daily">Ежедневно</SelectItem>
                    <SelectItem value="weekly">Еженедельно</SelectItem>
                    <SelectItem value="monthly">Ежемесячно</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Внешний вид</CardTitle>
              <CardDescription>Настройки интерфейса и брендинга</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">Тема</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Светлая</SelectItem>
                    <SelectItem value="dark">Темная</SelectItem>
                    <SelectItem value="system">Системная</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color">Основной цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      value={settings.appearance.primary_color}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, primary_color: e.target.value }
                      }))}
                    />
                    <div 
                      className="w-10 h-10 border rounded"
                      style={{ backgroundColor: settings.appearance.primary_color }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary_color">Вторичный цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      value={settings.appearance.secondary_color}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, secondary_color: e.target.value }
                      }))}
                    />
                    <div 
                      className="w-10 h-10 border rounded"
                      style={{ backgroundColor: settings.appearance.secondary_color }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accent_color">Акцентный цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent_color"
                      value={settings.appearance.accent_color}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, accent_color: e.target.value }
                      }))}
                    />
                    <div 
                      className="w-10 h-10 border rounded"
                      style={{ backgroundColor: settings.appearance.accent_color }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_light">Логотип (светлая тема)</Label>
                  <Input
                    id="logo_light"
                    value={settings.appearance.logo_light}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, logo_light: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="logo_dark">Логотип (темная тема)</Label>
                  <Input
                    id="logo_dark"
                    value={settings.appearance.logo_dark}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, logo_dark: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="custom_css">Пользовательский CSS</Label>
                <Textarea
                  id="custom_css"
                  value={settings.appearance.custom_css}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, custom_css: e.target.value }
                  }))}
                  rows={6}
                  placeholder="/* Ваши CSS стили */"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Интеграции</CardTitle>
              <CardDescription>Настройка внешних сервисов и API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ldap_enabled">LDAP/AD интеграция</Label>
                    <p className="text-sm text-muted-foreground">Аутентификация через Active Directory</p>
                  </div>
                  <Switch
                    id="ldap_enabled"
                    checked={settings.integrations.ldap_enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, ldap_enabled: checked }
                    }))}
                  />
                </div>

                {settings.integrations.ldap_enabled && (
                  <div>
                    <Label htmlFor="ldap_server">LDAP сервер</Label>
                    <Input
                      id="ldap_server"
                      value={settings.integrations.ldap_server}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        integrations: { ...prev.integrations, ldap_server: e.target.value }
                      }))}
                      placeholder="ldap://company.com:389"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="api_rate_limit">API Rate Limit (запросов/час)</Label>
                <Input
                  id="api_rate_limit"
                  type="number"
                  value={settings.integrations.api_rate_limit}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    integrations: { ...prev.integrations, api_rate_limit: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div>
                <Label>Webhook URLs</Label>
                <Textarea
                  value={settings.integrations.webhook_urls.join('\n')}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    integrations: { 
                      ...prev.integrations, 
                      webhook_urls: e.target.value.split('\n').filter(url => url.trim()) 
                    }
                  }))}
                  rows={3}
                  placeholder="https://webhook1.com/endpoint&#10;https://webhook2.com/endpoint"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  По одному URL на строку
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

