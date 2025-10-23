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
  Users, 
  Shield, 
  Database, 
  Palette, 
  Plug, 
  HardDrive,
  Save,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"

// Интерфейсы для данных
interface DictionaryItem {
  id: string
  name: string
  code: string
  description: string
  active: boolean
  order: number
  icon_url?: string
}

interface SystemSettings {
  general: {
    platform_name: string
    support_email: string
    default_language: string
    default_timezone: string
    default_currency: string
    date_format: string
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
  }
  resource_limits: {
    per_user_quotas: {
      max_active_hypotheses: number
      max_gpu_hours_per_month: number
      max_storage_gb: number
    }
    global_limits: {
      max_total_gpu_reservations: number
      max_concurrent_experiments: number
    }
  }
  branding: {
    logo_light: string
    logo_dark: string
    primary_color: string
    secondary_color: string
    accent_color: string
  }
}

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState("dictionaries")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Справочники
  const [dictionaries, setDictionaries] = useState<Record<string, DictionaryItem[]>>({
    industries: [],
    ai_types: [],
    business_categories: [],
    risk_categories: [],
    currencies: [],
    departments: [],
    priorities: [],
    hypothesis_stages: [],
    experiment_statuses: [],
    gpu_types: [],
    tags: []
  })
  
  // Системные настройки
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    general: {
      platform_name: "K2.tech AI Lab",
      support_email: "support@k2tech.com",
      default_language: "ru",
      default_timezone: "Europe/Moscow",
      default_currency: "RUB",
      date_format: "DD.MM.YYYY"
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
      }
    },
    resource_limits: {
      per_user_quotas: {
        max_active_hypotheses: 10,
        max_gpu_hours_per_month: 100,
        max_storage_gb: 50
      },
      global_limits: {
        max_total_gpu_reservations: 50,
        max_concurrent_experiments: 20
      }
    },
    branding: {
      logo_light: "",
      logo_dark: "",
      primary_color: "#3B82F6",
      secondary_color: "#10B981",
      accent_color: "#F59E0B"
    }
  })

  // Загружаем данные
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Загружаем справочники
      const dictResponse = await fetch('http://localhost:5001/api/admin/dictionaries')
      if (dictResponse.ok) {
        const dictData = await dictResponse.json()
        setDictionaries(dictData)
      }
      
      // Загружаем системные настройки
      const settingsResponse = await fetch('http://localhost:5001/api/admin/settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setSystemSettings(settingsData)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const saveDictionary = async (dictName: string, item: DictionaryItem) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/dictionaries/${dictName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      
      if (response.ok) {
        toast.success('Запись сохранена')
        loadData()
      } else {
        throw new Error('Ошибка сохранения')
      }
    } catch (error) {
      toast.error('Ошибка сохранения записи')
    }
  }

  const saveSystemSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('http://localhost:5001/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(systemSettings)
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

  const DictionaryTable = ({ dictName, title, items }: { dictName: string, title: string, items: DictionaryItem[] }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Управление справочником {title.toLowerCase()}</CardDescription>
          </div>
          <Button onClick={() => {/* TODO: Add new item */}}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "Активна" : "Неактивна"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">Код: {item.code}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

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
          <h1 className="text-3xl font-bold">Административная панель</h1>
          <p className="text-muted-foreground">Управление системой и справочниками</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dictionaries">Справочники</TabsTrigger>
          <TabsTrigger value="workflows">Процессы</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
          <TabsTrigger value="branding">Брендинг</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
          <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
        </TabsList>

        <TabsContent value="dictionaries" className="space-y-6">
          <div className="grid gap-6">
            <DictionaryTable dictName="industries" title="Индустрии" items={dictionaries.industries} />
            <DictionaryTable dictName="ai_types" title="Типы ИИ" items={dictionaries.ai_types} />
            <DictionaryTable dictName="business_categories" title="Бизнес-категории" items={dictionaries.business_categories} />
            <DictionaryTable dictName="currencies" title="Валюты" items={dictionaries.currencies} />
            <DictionaryTable dictName="departments" title="Подразделения" items={dictionaries.departments} />
            <DictionaryTable dictName="hypothesis_stages" title="Стадии гипотез" items={dictionaries.hypothesis_stages} />
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Жизненный цикл гипотез</CardTitle>
              <CardDescription>Настройка стадий и переходов между ними</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dictionaries.hypothesis_stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium">{stage.name}</h4>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform_name">Название платформы</Label>
                  <Input
                    id="platform_name"
                    value={systemSettings.general.platform_name}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, platform_name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="support_email">Email поддержки</Label>
                  <Input
                    id="support_email"
                    value={systemSettings.general.support_email}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, support_email: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="default_language">Язык по умолчанию</Label>
                  <Select
                    value={systemSettings.general.default_language}
                    onValueChange={(value) => setSystemSettings(prev => ({
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="default_currency">Валюта по умолчанию</Label>
                  <Select
                    value={systemSettings.general.default_currency}
                    onValueChange={(value) => setSystemSettings(prev => ({
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
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
                      value={systemSettings.security.password_policy.min_length}
                      onChange={(e) => setSystemSettings(prev => ({
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
                      value={systemSettings.security.password_policy.expiration_days}
                      onChange={(e) => setSystemSettings(prev => ({
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
                      checked={systemSettings.security.password_policy.require_uppercase}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({
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
                      checked={systemSettings.security.password_policy.require_numbers}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({
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
                      checked={systemSettings.security.password_policy.require_special}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({
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
                      value={systemSettings.security.session_settings.timeout_minutes}
                      onChange={(e) => setSystemSettings(prev => ({
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
                      value={systemSettings.security.session_settings.max_concurrent_sessions}
                      onChange={(e) => setSystemSettings(prev => ({
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enforce_2fa"
                    checked={systemSettings.security.two_factor_auth.enforce_2fa}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Лимиты ресурсов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Квоты на пользователя</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="max_hypotheses">Макс. активных гипотез</Label>
                    <Input
                      id="max_hypotheses"
                      type="number"
                      value={systemSettings.resource_limits?.per_user_quotas?.max_active_hypotheses || 0}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        resource_limits: {
                          ...prev.resource_limits,
                          per_user_quotas: {
                            ...prev.resource_limits?.per_user_quotas,
                            max_active_hypotheses: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_gpu_hours">Макс. GPU-часов/месяц</Label>
                    <Input
                      id="max_gpu_hours"
                      type="number"
                      value={systemSettings.resource_limits?.per_user_quotas?.max_gpu_hours_per_month || 0}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        resource_limits: {
                          ...prev.resource_limits,
                          per_user_quotas: {
                            ...prev.resource_limits?.per_user_quotas,
                            max_gpu_hours_per_month: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_storage">Макс. хранилище (GB)</Label>
                    <Input
                      id="max_storage"
                      type="number"
                      value={systemSettings.resource_limits?.per_user_quotas?.max_storage_gb || 0}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        resource_limits: {
                          ...prev.resource_limits,
                          per_user_quotas: {
                            ...prev.resource_limits?.per_user_quotas,
                            max_storage_gb: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Глобальные лимиты</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max_gpu_reservations">Макс. GPU резерваций</Label>
                    <Input
                      id="max_gpu_reservations"
                      type="number"
                      value={systemSettings.resource_limits.global_limits.max_total_gpu_reservations}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        resource_limits: {
                          ...prev.resource_limits,
                          global_limits: {
                            ...prev.resource_limits.global_limits,
                            max_total_gpu_reservations: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_experiments">Макс. параллельных экспериментов</Label>
                    <Input
                      id="max_experiments"
                      type="number"
                      value={systemSettings.resource_limits.global_limits.max_concurrent_experiments}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        resource_limits: {
                          ...prev.resource_limits,
                          global_limits: {
                            ...prev.resource_limits.global_limits,
                            max_concurrent_experiments: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSystemSettings} disabled={saving}>
              {saving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Сохранить настройки
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Логотип и цвета</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_light">Логотип (светлая тема)</Label>
                  <Input
                    id="logo_light"
                    value={systemSettings.branding.logo_light}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      branding: { ...prev.branding, logo_light: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="logo_dark">Логотип (темная тема)</Label>
                  <Input
                    id="logo_dark"
                    value={systemSettings.branding.logo_dark}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      branding: { ...prev.branding, logo_dark: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="primary_color">Основной цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      value={systemSettings.branding.primary_color}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primary_color: e.target.value }
                      }))}
                    />
                    <div 
                      className="w-10 h-10 border rounded"
                      style={{ backgroundColor: systemSettings.branding.primary_color }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary_color">Вторичный цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      value={systemSettings.branding.secondary_color}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondary_color: e.target.value }
                      }))}
                    />
                    <div 
                      className="w-10 h-10 border rounded"
                      style={{ backgroundColor: systemSettings.branding.secondary_color }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Интеграции</CardTitle>
              <CardDescription>Настройка внешних сервисов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Интеграции будут добавлены в следующих версиях
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Бэкапы и обслуживание</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Функции обслуживания будут добавлены в следующих версиях
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
