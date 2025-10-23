import { apiClient } from './client'

export interface HypothesisStage {
  id: number
  order: number
  name: string
  code: string
  description: string
  requiresApproval: boolean
  defaultDuration: number
  isActive: boolean
}

export class AdminAPI {
  // Получить все стадии гипотез
  async getStages(): Promise<HypothesisStage[]> {
    return apiClient.get<HypothesisStage[]>('/admin/stages')
  }

  // Обновить стадию
  async updateStage(id: number, updates: Partial<HypothesisStage>): Promise<HypothesisStage> {
    return apiClient.put<HypothesisStage>(`/admin/stages/${id}`, updates)
  }

  // Изменить порядок стадии
  async changeStageOrder(id: number, direction: 'up' | 'down'): Promise<HypothesisStage[]> {
    return apiClient.put<HypothesisStage[]>(`/admin/stages/${id}/order`, { direction })
  }

  // Переключить активность стадии
  async toggleStage(id: number, isActive: boolean): Promise<HypothesisStage> {
    return this.updateStage(id, { isActive })
  }
}

export const adminAPI = new AdminAPI()


