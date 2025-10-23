import { apiClient } from './client'
import { 
  Hypothesis, 
  CreateHypothesisRequest, 
  UpdateHypothesisRequest, 
  MoveHypothesisRequest,
  PaginatedResponse 
} from './types'

export class HypothesesAPI {
  // Получить все гипотезы (для совместимости с backend)
  async getAll(params: {
    page?: number
    limit?: number
    stage?: string
    priority?: string
    aiType?: string
    department?: string
    ownerId?: string
    search?: string
  } = {}): Promise<{ data: Hypothesis[], total: number, page: number, limit: number, totalPages: number }> {
    return apiClient.get<{ data: Hypothesis[], total: number, page: number, limit: number, totalPages: number }>('/hypotheses', params)
  }

  // Получить все гипотезы с пагинацией и фильтрами
  async getHypotheses(params: {
    page?: number
    limit?: number
    stage?: string
    priority?: string
    aiType?: string
    department?: string
    ownerId?: string
    search?: string
  } = {}): Promise<PaginatedResponse<Hypothesis>> {
    return apiClient.getPaginated<Hypothesis>('/hypotheses', params)
  }

  // Получить гипотезу по ID (для совместимости с backend)
  async getById(id: string): Promise<Hypothesis> {
    return apiClient.get<Hypothesis>(`/hypotheses/${id}`)
  }

  // Получить гипотезу по ID
  async getHypothesis(id: string): Promise<Hypothesis> {
    return apiClient.get<Hypothesis>(`/hypotheses/${id}`)
  }

  // Создать новую гипотезу
  async createHypothesis(data: CreateHypothesisRequest): Promise<Hypothesis> {
    return apiClient.post<Hypothesis>('/hypotheses', data)
  }

  // Обновить гипотезу
  async updateHypothesis(id: string, data: UpdateHypothesisRequest): Promise<Hypothesis> {
    return apiClient.put<Hypothesis>(`/hypotheses/${id}`, data)
  }

  // Удалить гипотезу
  async deleteHypothesis(id: string): Promise<void> {
    return apiClient.delete<void>(`/hypotheses/${id}`)
  }

  // Переместить гипотезу в другую стадию (для совместимости с backend)
  async moveHypothesis(hypothesisId: string, newStage: string): Promise<Hypothesis> {
    return apiClient.post<Hypothesis>('/hypotheses/move', { hypothesisId, newStage })
  }

  // Переместить гипотезу в другую стадию
  async moveHypothesisWithData(data: MoveHypothesisRequest): Promise<Hypothesis> {
    return apiClient.post<Hypothesis>('/hypotheses/move', data)
  }

  // Получить гипотезы для Kanban доски (для совместимости с backend)
  async getKanban(): Promise<{ data: Hypothesis[] }> {
    return apiClient.get<{ data: Hypothesis[] }>('/hypotheses/kanban')
  }

  // Получить гипотезы для Kanban доски
  async getHypothesesForKanban(): Promise<Record<string, Hypothesis[]>> {
    return apiClient.get<Record<string, Hypothesis[]>>('/hypotheses/kanban')
  }

  // Получить статистику гипотез (для совместимости с backend)
  async getStats(): Promise<{
    total: number
    byStage: Record<string, number>
    byPriority: Record<string, number>
    byAIType: Record<string, number>
    avgTimeToProduction: number
    successRate: number
  }> {
    return apiClient.get('/hypotheses/stats')
  }

  // Получить статистику гипотез
  async getHypothesesStats(): Promise<{
    total: number
    byStage: Record<string, number>
    byPriority: Record<string, number>
    byAIType: Record<string, number>
    avgTimeToProduction: number
    successRate: number
  }> {
    return apiClient.get('/hypotheses/stats')
  }

  // Получить гипотезы, требующие одобрения
  async getHypothesesAwaitingApproval(): Promise<Hypothesis[]> {
    return apiClient.get<Hypothesis[]>('/hypotheses/awaiting-approval')
  }

  // Одобрить переход гипотезы
  async approveHypothesisMove(hypothesisId: string, comment?: string): Promise<void> {
    return apiClient.post(`/hypotheses/${hypothesisId}/approve`, { comment })
  }

  // Отклонить переход гипотезы
  async rejectHypothesisMove(hypothesisId: string, reason: string): Promise<void> {
    return apiClient.post(`/hypotheses/${hypothesisId}/reject`, { reason })
  }

  // Получить связанные гипотезы
  async getLinkedHypotheses(hypothesisId: string): Promise<Hypothesis[]> {
    return apiClient.get<Hypothesis[]>(`/hypotheses/${hypothesisId}/linked`)
  }

  // Добавить связь между гипотезами
  async linkHypotheses(hypothesisId: string, linkedHypothesisId: string): Promise<void> {
    return apiClient.post(`/hypotheses/${hypothesisId}/link`, { linkedHypothesisId })
  }

  // Удалить связь между гипотезами
  async unlinkHypotheses(hypothesisId: string, linkedHypothesisId: string): Promise<void> {
    return apiClient.delete(`/hypotheses/${hypothesisId}/link/${linkedHypothesisId}`)
  }

  // Получить историю изменений гипотезы
  async getHypothesisHistory(hypothesisId: string): Promise<{
    id: string
    timestamp: string
    user: string
    action: string
    details: string
    oldValue?: any
    newValue?: any
  }[]> {
    return apiClient.get(`/hypotheses/${hypothesisId}/history`)
  }

  // Экспорт гипотез
  async exportHypotheses(format: 'csv' | 'xlsx' | 'pdf', filters?: any): Promise<Blob> {
    const response = await apiClient.client.get('/hypotheses/export', {
      params: { format, ...filters },
      responseType: 'blob'
    })
    return response.data
  }

  // Импорт гипотез
  async importHypotheses(file: File): Promise<{
    imported: number
    errors: string[]
  }> {
    return apiClient.uploadFile('/hypotheses/import', file)
  }

  // Генерация презентации для гипотезы
  async generatePresentation(hypothesisId: string, presentationData: any): Promise<any> {
    return apiClient.post<any>(`/hypotheses/${hypothesisId}/presentation`, presentationData)
  }

  // Добавить комментарий к гипотезе
  async addComment(hypothesisId: string, commentData: any): Promise<any> {
    return apiClient.post<any>(`/hypotheses/${hypothesisId}/comments`, commentData)
  }
}

export const hypothesesAPI = new HypothesesAPI()

