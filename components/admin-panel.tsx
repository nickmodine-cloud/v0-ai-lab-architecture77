"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { eventBus } from "@/lib/event-bus"
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
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

interface HypothesisStage {
  id: number
  order: number
  name: string
  code: string
  description: string
  requiresApproval: boolean
  defaultDuration: number
  isActive: boolean
}

interface AuditLog {
  id: number
  timestamp: string
  user: string
  action: string
  resource: string
  resourceId: string
  ipAddress: string
  details: string
  status: string
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("stages")
  const [stages, setStages] = useState<HypothesisStage[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [updating, setUpdating] = useState<number | null>(null)
  const [createStageDialogOpen, setCreateStageDialogOpen] = useState(false)
  const [newStage, setNewStage] = useState({
    name: "",
    code: "",
    description: "",
    requiresApproval: false,
    defaultDuration: 7
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Загружаем стадии из API
      const stagesData = await api.admin.getStages()
      setStages(stagesData)
      
      // Мокируем аудит логи (в реальном приложении будет API)
      const mockAuditLogs: AuditLog[] = [
        {
          id: 1,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          user: "admin@k2tech.com",
          action: "Обновлено",
          resource: "Стадия",
          resourceId: "STAGE-001",
          ipAddress: "192.168.1.10",
          details: "Стадия 'Идея' активирована",
          status: "Успешно",
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substring(0, 19),
          user: "user@k2tech.com",
          action: "Изменен порядок",
          resource: "Стадия",
          resourceId: "STAGE-002",
          ipAddress: "192.168.1.25",
          details: "Стадия 'Скопинг' перемещена вверх",
          status: "Успешно",
        },
      ]
      
      setAuditLogs(mockAuditLogs)
    } catch (err) {
      console.error('Ошибка загрузки данных админки:', err)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleStageToggle = async (stageId: number, isActive: boolean) => {
    try {
      setUpdating(stageId)
      await api.admin.toggleStage(stageId, isActive)
      
      // Обновляем локальное состояние
      setStages(prev => prev.map(stage => 
        stage.id === stageId ? { ...stage, isActive } : stage
      ))
      
      toast.success(`Стадия ${isActive ? 'активирована' : 'деактивирована'}`)
      
      // Уведомляем другие компоненты об изменении
      eventBus.emitStageUpdated(stageId, isActive)
    } catch (error) {
      console.error('Ошибка обновления стадии:', error)
      toast.error('Ошибка обновления стадии')
    } finally {
      setUpdating(null)
    }
  }

  const handleStageOrderChange = async (stageId: number, direction: 'up' | 'down') => {
    try {
      setUpdating(stageId)
      const updatedStages = await api.admin.changeStageOrder(stageId, direction)
      setStages(updatedStages)
      toast.success(`Порядок стадии изменен`)
    } catch (error) {
      console.error('Ошибка изменения порядка стадий:', error)
      toast.error('Ошибка изменения порядка стадий')
    } finally {
      setUpdating(null)
    }
  }

  const handleExportAuditLogs = () => {
    const csvData = "ID,Время,Пользователь,Действие,Ресурс,ID ресурса,IP,Детали,Статус\n" + 
      auditLogs.map(log => 
        `${log.id},${log.timestamp},${log.user},${log.action},${log.resource},${log.resourceId},${log.ipAddress},${log.details},${log.status}`
      ).join('\n')
    
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit_logs.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Аудит логи экспортированы')
  }

  const filteredAuditLogs = auditLogs.filter(log =>
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resourceId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка данных админки...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadData}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass glass-highlight rounded-2xl p-6 border border-border/50">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Администрирование</h1>
            <p className="text-muted-foreground">Управление системой, стадиями гипотез и аудит</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass glass-highlight">
          <TabsTrigger value="stages">Стадии гипотез</TabsTrigger>
          <TabsTrigger value="audit">Аудит</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        {/* Stages Tab */}
        <TabsContent value="stages" className="space-y-6">
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Управление стадиями</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить стадию
              </Button>
            </div>

            <div className="space-y-4">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStageOrderChange(stage.id, 'up')}
                        disabled={stage.order === 1 || updating === stage.id}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStageOrderChange(stage.id, 'down')}
                        disabled={stage.order === stages.length || updating === stage.id}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{stage.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {stage.code}
                        </Badge>
                        <Badge variant={stage.isActive ? "default" : "secondary"}>
                          {stage.isActive ? "Активна" : "Неактивна"}
                        </Badge>
                        {stage.requiresApproval && (
                          <Badge variant="destructive" className="text-xs">
                            Требует одобрения
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Порядок: {stage.order}</span>
                        <span>Длительность: {stage.defaultDuration} дней</span>
                        <span>Требует одобрения: {stage.requiresApproval ? "Да" : "Нет"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {updating === stage.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Switch
                        checked={stage.isActive}
                        onCheckedChange={(checked) => handleStageToggle(stage.id, checked)}
                      />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Журнал аудита</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по логам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 glass"
                  />
                </div>
                <Button variant="outline" onClick={handleExportAuditLogs} className="gap-2">
                  <Download className="h-4 w-4" />
                  Экспорт
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Время</TableHead>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Действие</TableHead>
                  <TableHead>Ресурс</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.resource}</div>
                        <div className="text-xs text-muted-foreground">{log.resourceId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "Успешно" ? "default" : "destructive"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass glass-highlight p-6 border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-6">Системные настройки</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Уведомления</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email уведомления</Label>
                      <p className="text-sm text-muted-foreground">Отправка уведомлений по email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push уведомления</Label>
                      <p className="text-sm text-muted-foreground">Браузерные уведомления</p>
                    </div>
                    <Switch id="push-notifications" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Безопасность</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
                      <p className="text-sm text-muted-foreground">Обязательная для всех пользователей</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="session-timeout">Таймаут сессии</Label>
                      <p className="text-sm text-muted-foreground">Автоматический выход через 8 часов</p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Сохранить настройки</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}