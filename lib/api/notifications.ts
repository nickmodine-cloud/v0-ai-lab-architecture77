import { apiClient } from './client'
import { 
  Notification, 
  CreateNotificationRequest, 
  PaginatedResponse 
} from './types'

export class NotificationsAPI {
  // Получить все уведомления пользователя (для совместимости с backend)
  async getNotifications(params: {
    filter?: string
    page?: number
    limit?: number
    category?: string
  } = {}): Promise<{ data: Notification[], unreadCount: number, total: number, page: number, limit: number, totalPages: number }> {
    return apiClient.get<{ data: Notification[], unreadCount: number, total: number, page: number, limit: number, totalPages: number }>('/notifications', params)
  }

  // Получить все уведомления пользователя
  async getNotificationsPaginated(params: {
    page?: number
    limit?: number
    unreadOnly?: boolean
    category?: string
    eventType?: string
    starred?: boolean
    archived?: boolean
  } = {}): Promise<PaginatedResponse<Notification>> {
    return apiClient.getPaginated<Notification>('/notifications', params)
  }

  // Получить уведомление по ID
  async getNotification(id: string): Promise<Notification> {
    return apiClient.get<Notification>(`/notifications/${id}`)
  }

  // Создать уведомление (для совместимости с backend)
  async create(notificationData: Partial<Notification>): Promise<Notification> {
    return apiClient.post<Notification>('/notifications', notificationData)
  }

  // Создать уведомление
  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    return apiClient.post<Notification>('/notifications', data)
  }

  // Отметить уведомление как прочитанное (для совместимости с backend)
  async markAsRead(id: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/notifications/${id}/read`)
  }

  // Отметить все уведомления как прочитанные (для совместимости с backend)
  async markAllAsRead(): Promise<{ success: boolean, count: number }> {
    return apiClient.post<{ success: boolean, count: number }>('/notifications/read-all')
  }

  // Переключить статус избранного (для совместимости с backend)
  async toggleStar(id: string): Promise<{ success: boolean, isStarred: boolean }> {
    return apiClient.post<{ success: boolean, isStarred: boolean }>(`/notifications/${id}/star`)
  }

  // Отметить уведомление как избранное
  async starNotification(id: string): Promise<void> {
    return apiClient.patch(`/notifications/${id}/star`)
  }

  // Убрать уведомление из избранного
  async unstarNotification(id: string): Promise<void> {
    return apiClient.patch(`/notifications/${id}/unstar`)
  }

  // Архивировать уведомление (для совместимости с backend)
  async archive(id: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/notifications/${id}/archive`)
  }

  // Архивировать уведомление
  async archiveNotification(id: string): Promise<void> {
    return apiClient.patch(`/notifications/${id}/archive`)
  }

  // Удалить уведомление
  async deleteNotification(id: string): Promise<void> {
    return apiClient.delete(`/notifications/${id}`)
  }

  // Получить количество непрочитанных уведомлений
  async getUnreadCount(): Promise<{
    total: number
    byCategory: Record<string, number>
  }> {
    return apiClient.get('/notifications/unread-count')
  }

  // Получить настройки уведомлений пользователя
  async getNotificationSettings(): Promise<{
    email: boolean
    slack: boolean
    push: boolean
    inApp: boolean
    digest: boolean
    quietHours: {
      enabled: boolean
      start: string
      end: string
    }
    eventSettings: {
      eventType: string
      channels: string[]
    }[]
  }> {
    return apiClient.get('/notifications/settings')
  }

  // Обновить настройки уведомлений
  async updateNotificationSettings(settings: {
    email?: boolean
    slack?: boolean
    push?: boolean
    inApp?: boolean
    digest?: boolean
    quietHours?: {
      enabled: boolean
      start: string
      end: string
    }
    eventSettings?: {
      eventType: string
      channels: string[]
    }[]
  }): Promise<void> {
    return apiClient.put('/notifications/settings', settings)
  }

  // Получить последние уведомления для header
  async getRecentNotifications(limit: number = 10): Promise<Notification[]> {
    return apiClient.get<Notification[]>(`/notifications/recent?limit=${limit}`)
  }

  // Получить уведомления по типу события
  async getNotificationsByEventType(eventType: string): Promise<Notification[]> {
    return apiClient.get<Notification[]>(`/notifications/event-type/${eventType}`)
  }

  // Получить уведомления по связанному объекту
  async getNotificationsByObject(
    objectType: string, 
    objectId: string
  ): Promise<Notification[]> {
    return apiClient.get<Notification[]>(`/notifications/object/${objectType}/${objectId}`)
  }

  // Создать массовое уведомление
  async createBulkNotification(data: {
    userIds: string[]
    eventType: string
    title: string
    message: string
    relatedObjectType?: string
    relatedObjectId?: string
    channels: string[]
  }): Promise<{
    sent: number
    failed: number
    errors: string[]
  }> {
    return apiClient.post('/notifications/bulk', data)
  }

  // Получить статистику уведомлений
  async getNotificationStats(): Promise<{
    total: number
    unread: number
    byEventType: Record<string, number>
    byChannel: Record<string, number>
    avgResponseTime: number
  }> {
    return apiClient.get('/notifications/stats')
  }

  // Тестировать уведомление
  async testNotification(channel: 'email' | 'slack' | 'push' | 'inApp'): Promise<{
    success: boolean
    message: string
  }> {
    return apiClient.post('/notifications/test', { channel })
  }

  // Получить шаблоны уведомлений
  async getNotificationTemplates(): Promise<{
    id: string
    name: string
    eventType: string
    subject: string
    body: string
    channels: string[]
    variables: string[]
  }[]> {
    return apiClient.get('/notifications/templates')
  }

  // Создать шаблон уведомления
  async createNotificationTemplate(data: {
    name: string
    eventType: string
    subject: string
    body: string
    channels: string[]
  }): Promise<void> {
    return apiClient.post('/notifications/templates', data)
  }

  // Обновить шаблон уведомления
  async updateNotificationTemplate(
    id: string, 
    data: Partial<{
      name: string
      subject: string
      body: string
      channels: string[]
    }>
  ): Promise<void> {
    return apiClient.put(`/notifications/templates/${id}`, data)
  }

  // Удалить шаблон уведомления
  async deleteNotificationTemplate(id: string): Promise<void> {
    return apiClient.delete(`/notifications/templates/${id}`)
  }
}

export const notificationsAPI = new NotificationsAPI()

