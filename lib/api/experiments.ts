import { apiClient } from './client'
import { 
  Experiment, 
  CreateExperimentRequest, 
  PaginatedResponse 
} from './types'

export class ExperimentsAPI {
  // Получить все эксперименты с пагинацией и фильтрами
  async getExperiments(params: {
    page?: number
    limit?: number
    hypothesisId?: string
    status?: string
    variant?: string
    createdById?: string
    search?: string
  } = {}): Promise<PaginatedResponse<Experiment>> {
    return apiClient.getPaginated<Experiment>('/experiments', params)
  }

  // Получить эксперимент по ID
  async getExperiment(id: string): Promise<Experiment> {
    return apiClient.get<Experiment>(`/experiments/${id}`)
  }

  // Создать новый эксперимент
  async createExperiment(data: CreateExperimentRequest): Promise<Experiment> {
    return apiClient.post<Experiment>('/experiments', data)
  }

  // Обновить эксперимент
  async updateExperiment(id: string, data: Partial<CreateExperimentRequest>): Promise<Experiment> {
    return apiClient.put<Experiment>(`/experiments/${id}`, data)
  }

  // Удалить эксперимент
  async deleteExperiment(id: string): Promise<void> {
    return apiClient.delete<void>(`/experiments/${id}`)
  }

  // Запустить эксперимент
  async runExperiment(id: string): Promise<Experiment> {
    return apiClient.post<Experiment>(`/experiments/${id}/run`)
  }

  // Остановить эксперимент
  async stopExperiment(id: string): Promise<Experiment> {
    return apiClient.post<Experiment>(`/experiments/${id}/stop`)
  }

  // Клонировать эксперимент
  async cloneExperiment(id: string, newName?: string): Promise<Experiment> {
    return apiClient.post<Experiment>(`/experiments/${id}/clone`, { newName })
  }

  // Получить метрики эксперимента в реальном времени
  async getExperimentMetrics(id: string): Promise<{
    metrics: Record<string, number>
    timestamp: string
  }> {
    return apiClient.get(`/experiments/${id}/metrics`)
  }

  // Получить логи эксперимента
  async getExperimentLogs(id: string, lines?: number): Promise<{
    logs: string[]
    timestamp: string
  }> {
    return apiClient.get(`/experiments/${id}/logs`, { params: { lines } })
  }

  // Получить артефакты эксперимента
  async getExperimentArtifacts(id: string): Promise<{
    artifacts: {
      name: string
      type: string
      size: number
      url: string
      createdAt: string
    }[]
  }> {
    return apiClient.get(`/experiments/${id}/artifacts`)
  }

  // Скачать артефакт эксперимента
  async downloadArtifact(experimentId: string, artifactName: string): Promise<void> {
    return apiClient.downloadFile(`/experiments/${experimentId}/artifacts/${artifactName}`, artifactName)
  }

  // Получить сравнение экспериментов
  async compareExperiments(experimentIds: string[]): Promise<{
    experiments: Experiment[]
    comparison: {
      metric: string
      values: Record<string, number>
      best: string
      worst: string
    }[]
    recommendation: string
  }> {
    return apiClient.post('/experiments/compare', { experimentIds })
  }

  // Получить статистику экспериментов
  async getExperimentsStats(hypothesisId?: string): Promise<{
    total: number
    byStatus: Record<string, number>
    byVariant: Record<string, number>
    avgDuration: number
    totalGpuHours: number
    totalCost: number
    successRate: number
  }> {
    return apiClient.get('/experiments/stats', { params: { hypothesisId } })
  }

  // Получить лучшие эксперименты по метрике
  async getBestExperiments(metric: string, limit: number = 10): Promise<Experiment[]> {
    return apiClient.get<Experiment[]>(`/experiments/best/${metric}`, { params: { limit } })
  }

  // Получить эксперименты для A/B тестирования
  async getABTestExperiments(hypothesisId: string): Promise<{
    control: Experiment | null
    variants: Experiment[]
    results: {
      metric: string
      controlValue: number
      variantValues: Record<string, number>
      significance: number
      recommendation: string
    }[]
  }> {
    return apiClient.get(`/experiments/ab-test/${hypothesisId}`)
  }

  // Получить рекомендации по улучшению эксперимента
  async getExperimentRecommendations(id: string): Promise<{
    recommendations: {
      type: 'parameter' | 'model' | 'data' | 'infrastructure'
      description: string
      impact: 'high' | 'medium' | 'low'
      effort: 'high' | 'medium' | 'low'
    }[]
  }> {
    return apiClient.get(`/experiments/${id}/recommendations`)
  }

  // Получить историю изменений эксперимента
  async getExperimentHistory(id: string): Promise<{
    id: string
    timestamp: string
    user: string
    action: string
    details: string
    oldValue?: any
    newValue?: any
  }[]> {
    return apiClient.get(`/experiments/${id}/history`)
  }

  // Экспорт экспериментов
  async exportExperiments(format: 'csv' | 'xlsx' | 'pdf', filters?: any): Promise<Blob> {
    const response = await apiClient.client.get('/experiments/export', {
      params: { format, ...filters },
      responseType: 'blob'
    })
    return response.data
  }

  // Получить доступные модели для экспериментов
  async getAvailableModels(): Promise<{
    id: string
    name: string
    type: string
    description: string
    parameters: string[]
    requirements: {
      gpu: boolean
      memory: number
      storage: number
    }
  }[]> {
    return apiClient.get('/experiments/models')
  }

  // Получить доступные датасеты
  async getAvailableDatasets(): Promise<{
    id: string
    name: string
    description: string
    size: number
    format: string
    features: string[]
    samples: number
  }[]> {
    return apiClient.get('/experiments/datasets')
  }
}

export const experimentsAPI = new ExperimentsAPI()


