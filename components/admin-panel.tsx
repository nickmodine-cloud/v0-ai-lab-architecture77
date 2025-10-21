"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Database,
  Activity,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Filter,
} from "lucide-react"

const hypothesisStages = [
  {
    id: 1,
    order: 1,
    name: "Бэклог",
    code: "BACKLOG",
    description: "Сбор первичных идей",
    requiresApproval: false,
    defaultDuration: 0,
    isActive: true,
  },
  {
    id: 2,
    order: 2,
    name: "Идея",
    code: "IDEATION",
    description: "Формулировка гипотезы",
    requiresApproval: false,
    defaultDuration: 7,
    isActive: true,
  },
  {
    id: 3,
    order: 3,
    name: "Скопинг",
    code: "SCOPING",
    description: "Техническая осуществимость и планирование ресурсов",
    requiresApproval: true,
    defaultDuration: 14,
    isActive: true,
  },
  {
    id: 4,
    order: 4,
    name: "Оценка",
    code: "EVALUATION",
    description: "Бизнес-кейс и анализ ROI",
    requiresApproval: true,
    defaultDuration: 21,
    isActive: true,
  },
  {
    id: 5,
    order: 5,
    name: "Эксперимент",
    code: "EXPERIMENTATION",
    description: "Проведение экспериментов и сбор данных",
    requiresApproval: false,
    defaultDuration: 30,
    isActive: true,
  },
  {
    id: 6,
    order: 6,
    name: "Продакшен",
    code: "PRODUCTION",
    description: "Развертывание в продакшен",
    requiresApproval: true,
    defaultDuration: 0,
    isActive: true,
  },
  {
    id: 7,
    order: 7,
    name: "Архив",
    code: "ARCHIVED",
    description: "Завершено или отменено",
    requiresApproval: false,
    defaultDuration: 0,
    isActive: true,
  },
]

const auditLogs = [
  {
    id: 1,
    timestamp: "2025-01-21 18:45:23",
    user: "ivan@k2tech.com",
    action: "Создано",
    resource: "Гипотеза",
    resourceId: "HYP-042",
    ipAddress: "192.168.1.10",
    details: "Создана новая гипотеза LLM",
    status: "Успешно",
  },
  {
    id: 2,
    timestamp: "2025-01-21 17:30:15",
    user: "anna@k2tech.com",
    action: "Одобрено",
    resource: "Гипотеза",
    resourceId: "HYP-038",
    ipAddress: "192.168.1.25",
    details: "Одобрен переход в Масштабирование",
    status: "Успешно",
  },
  {
    id: 3,
    timestamp: "2025-01-21 16:20:45",
    user: "system@k2tech.com",
    action: "Обновлено",
    resource: "Эксперимент",
    resourceId: "EXP-003",
    ipAddress: "10.0.0.1",
    details: "Эксперимент завершен автоматически",
    status: "Успешно",
  },
  {
    id: 4,
    timestamp: "2025-01-21 15:10:30",
    user: "sarah@k2tech.com",
    action: "Удалено",
    resource: "Пользователь",
    resourceId: "USR-099",
    ipAddress: "192.168.1.15",
    details: "Удален неактивный аккаунт",
    status: "Успешно",
  },
  {
    id: 5,
    timestamp: "2025-01-21 14:05:12",
    user: "marcus@k2tech.com",
    action: "Ошибка входа",
    resource: "Аутентификация",
    resourceId: "N/A",
    ipAddress: "203.0.113.42",
    details: "Неверные учетные данные",
    status: "Ошибка",
  },
]

const systemSettings = [
  {
    category: "Общие",
    settings: [
      { key: "system_name", label: "Название системы", value: "K2.tech AI Laboratory", type: "text" },
      { key: "default_timezone", label: "Часовой пояс по умолчанию", value: "UTC", type: "text" },
      { key: "date_format", label: "Формат даты", value: "YYYY-MM-DD", type: "text" },
    ],
  },
  {
    category: "Уведомления",
    settings: [
      { key: "email_notifications", label: "Email уведомления", value: true, type: "boolean" },
      { key: "slack_integration", label: "Интеграция Slack", value: true, type: "boolean" },
      { key: "notification_digest", label: "Ежедневная сводка", value: false, type: "boolean" },
    ],
  },
  {
    category: "Безопасность",
    settings: [
      { key: "require_2fa", label: "Требовать 2FA", value: true, type: "boolean" },
      { key: "session_timeout", label: "Таймаут сессии (минуты)", value: "60", type: "text" },
      { key: "password_expiry", label: "Срок действия пароля (дни)", value: "90", type: "text" },
    ],
  },
]

export function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Панель администратора</h1>
        <p className="text-lg text-muted-foreground">Конфигурация и управление системой</p>
      </div>

      <Tabs defaultValue="stages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stages">Этапы гипотез</TabsTrigger>
          <TabsTrigger value="settings">Настройки системы</TabsTrigger>
          <TabsTrigger value="audit">Журнал аудита</TabsTrigger>
          <TabsTrigger value="database">База данных</TabsTrigger>
        </TabsList>

        {/* Hypothesis Stages Management */}
        <TabsContent value="stages" className="space-y-6 mt-6">
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">Этапы жизненного цикла гипотез</h2>
                  <p className="text-sm text-muted-foreground">Настройка этапов, через которые проходят гипотезы</p>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить этап
                </Button>
              </div>

              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-16">Порядок</TableHead>
                      <TableHead>Название этапа</TableHead>
                      <TableHead>Код</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead className="text-center">Одобрение</TableHead>
                      <TableHead className="text-center">Длительность (дни)</TableHead>
                      <TableHead className="text-center">Активен</TableHead>
                      <TableHead className="w-24">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hypothesisStages.map((stage) => (
                      <TableRow key={stage.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-sm">{stage.order}</TableCell>
                        <TableCell className="font-semibold">{stage.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {stage.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{stage.description}</TableCell>
                        <TableCell className="text-center">
                          {stage.requiresApproval ? (
                            <CheckCircle2 className="h-4 w-4 text-chart-3 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">{stage.defaultDuration}</TableCell>
                        <TableCell className="text-center">
                          <Switch checked={stage.isActive} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Удалить
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          {systemSettings.map((section) => (
            <Card key={section.category} className="glass glass-highlight p-6 border-border/50">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{section.category}</h2>
                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                    >
                      <div className="space-y-1">
                        <Label htmlFor={setting.key} className="text-sm font-medium text-foreground">
                          {setting.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">Настроить {setting.label.toLowerCase()}</p>
                      </div>
                      {setting.type === "boolean" ? (
                        <Switch id={setting.key} checked={setting.value as boolean} />
                      ) : (
                        <Input
                          id={setting.key}
                          defaultValue={setting.value as string}
                          className="w-64 bg-background/50"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <Button>Сохранить изменения</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-6 mt-6">
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">Журнал аудита</h2>
                  <p className="text-sm text-muted-foreground">Отслеживание всех действий и изменений в системе</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Фильтр
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Экспорт
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск в журнале..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Время</TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Действие</TableHead>
                      <TableHead>Ресурс</TableHead>
                      <TableHead>ID ресурса</TableHead>
                      <TableHead>IP адрес</TableHead>
                      <TableHead>Детали</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                        <TableCell className="text-sm">{log.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.resource}</TableCell>
                        <TableCell className="font-mono text-xs">{log.resourceId}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === "Успешно" ? "default" : "destructive"} className="text-xs">
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Database Management */}
        <TabsContent value="database" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass glass-highlight p-6 border-border/50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Статус базы данных</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Статус подключения</span>
                    <Badge variant="default" className="text-xs">
                      Подключено
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Размер базы данных</span>
                    <span className="text-sm font-medium text-foreground">2.4 ГБ</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Всего записей</span>
                    <span className="text-sm font-medium text-foreground">15,847</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Последний бэкап</span>
                    <span className="text-sm font-medium text-foreground">2025-01-21 03:00</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass glass-highlight p-6 border-border/50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Действия с БД</h2>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Создать бэкап
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Database className="h-4 w-4" />
                    Оптимизировать БД
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <FileText className="h-4 w-4" />
                    Просмотр схемы
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-destructive bg-transparent">
                    <Trash2 className="h-4 w-4" />
                    Очистить кэш
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Статистика таблиц</h2>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Название таблицы</TableHead>
                      <TableHead className="text-right">Записей</TableHead>
                      <TableHead className="text-right">Размер</TableHead>
                      <TableHead className="text-right">Последнее изменение</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/20">
                      <TableCell className="font-mono text-sm">hypotheses</TableCell>
                      <TableCell className="text-right">47</TableCell>
                      <TableCell className="text-right">1.2 МБ</TableCell>
                      <TableCell className="text-right text-xs">2025-01-21 18:45</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/20">
                      <TableCell className="font-mono text-sm">experiments</TableCell>
                      <TableCell className="text-right">156</TableCell>
                      <TableCell className="text-right">3.8 МБ</TableCell>
                      <TableCell className="text-right text-xs">2025-01-21 17:30</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/20">
                      <TableCell className="font-mono text-sm">users</TableCell>
                      <TableCell className="text-right">28</TableCell>
                      <TableCell className="text-right">0.5 МБ</TableCell>
                      <TableCell className="text-right text-xs">2025-01-20 14:20</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/20">
                      <TableCell className="font-mono text-sm">audit_logs</TableCell>
                      <TableCell className="text-right">15,616</TableCell>
                      <TableCell className="text-right">12.4 МБ</TableCell>
                      <TableCell className="text-right text-xs">2025-01-21 18:45</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
