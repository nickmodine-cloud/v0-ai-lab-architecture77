"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { eventBus } from "@/lib/event-bus"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  Star, 
  Archive, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Info,
  Check,
  Loader2,
  RefreshCw,
  MoreVertical
} from "lucide-react"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  message: string
  type: 'hypothesis' | 'experiment' | 'approval' | 'system'
  priority: 'low' | 'medium' | 'high' | 'critical'
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  createdAt: string
  userId: string
  relatedObjectType: string
  relatedObjectId: string
  triggeredByUserId: string
}

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNotifications()
    
    // Подписываемся на события
    eventBus.on('notificationCreated', handleNotificationCreated)
    eventBus.on('notificationRead', handleNotificationRead)
    eventBus.on('allNotificationsRead', handleAllNotificationsRead)
    
    return () => {
      eventBus.off('notificationCreated', handleNotificationCreated)
      eventBus.off('notificationRead', handleNotificationRead)
      eventBus.off('allNotificationsRead', handleAllNotificationsRead)
    }
  }, [activeFilter])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.notifications.getNotifications({
        filter: activeFilter,
        page: 1,
        limit: 50
      })
      
      setNotifications(data.data)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error('Ошибка загрузки уведомлений:', err)
      setError('Ошибка загрузки уведомлений')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationCreated = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)
  }

  const handleNotificationRead = (data: { id: string, userId: string }) => {
    setNotifications(prev => prev.map(n => 
      n.id === data.id ? { ...n, isRead: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleAllNotificationsRead = (data: { count: number }) => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const markAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id)
      toast.success('Уведомление отмечено как прочитанное')
    } catch (error) {
      console.error('Ошибка отметки уведомления:', error)
      toast.error('Ошибка отметки уведомления')
    }
  }

  const markAsStarred = async (id: string) => {
    try {
      const result = await api.notifications.toggleStar(id)
      toast.success(result.isStarred ? 'Уведомление добавлено в избранное' : 'Уведомление удалено из избранного')
    } catch (error) {
      console.error('Ошибка изменения статуса уведомления:', error)
      toast.error('Ошибка изменения статуса уведомления')
    }
  }

  const archiveNotification = async (id: string) => {
    try {
      await api.notifications.archive(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success('Уведомление архивировано')
    } catch (error) {
      console.error('Ошибка архивирования уведомления:', error)
      toast.error('Ошибка архивирования уведомления')
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead()
      toast.success('Все уведомления отмечены как прочитанные')
    } catch (error) {
      console.error('Ошибка отметки всех уведомлений:', error)
      toast.error('Ошибка отметки всех уведомлений')
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium': return <Info className="h-4 w-4 text-blue-500" />
      case 'low': return <Info className="h-4 w-4 text-gray-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hypothesis': return <Bell className="h-4 w-4" />
      case 'experiment': return <CheckCircle2 className="h-4 w-4" />
      case 'approval': return <AlertTriangle className="h-4 w-4" />
      case 'system': return <Info className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка уведомлений...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadNotifications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Уведомления</h1>
        <div className="flex items-center gap-2">
          <Badge variant="destructive">{unreadCount} непрочитанных</Badge>
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Отметить все как прочитанные
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList>
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="unread">Непрочитанные</TabsTrigger>
          <TabsTrigger value="starred">Избранные</TabsTrigger>
          <TabsTrigger value="archived">Архив</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter}>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Уведомлений нет</p>
              </div>
            ) : (
              notifications.map(notification => (
                <Card key={notification.id} className={`${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getPriorityIcon(notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(notification.type)}
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                            {notification.priority}
                          </Badge>
                          {notification.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.createdAt).toLocaleString('ru-RU')}
                          </span>
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsStarred(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Star className={`h-4 w-4 ${notification.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => archiveNotification(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}