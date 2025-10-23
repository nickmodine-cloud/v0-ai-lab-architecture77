import { apiClient } from './client'

export interface CEOMetrics {
  totalHypotheses: number
  inExperimentation: number
  inProduction: number
  successRate: number
  avgTimeToProduction: number
  totalInvestment: number
  realizedROI: number
  criticalRisks: number
}

export interface CEOPipeline {
  backlog: number
  ideation: number
  scoping: number
  prioritization: number
  experimentation: number
  evaluation: number
  scaling: number
  production: number
  archived: number
}

export interface AwaitingApproval {
  id: string
  title: string
  stage: string
  priority: string
  owner: string
  awaitingAction: string
  dueDate: string
  estimatedCost: number
}

export class CEOAPI {
  async getMetrics(): Promise<CEOMetrics> {
    return apiClient.get<CEOMetrics>('/ceo/metrics')
  }

  async getPipeline(): Promise<CEOPipeline> {
    return apiClient.get<CEOPipeline>('/ceo/pipeline')
  }

  async getAwaitingApproval(): Promise<AwaitingApproval[]> {
    return apiClient.get<AwaitingApproval[]>('/ceo/awaiting-approval')
  }

  async approveHypothesis(hypothesisId: string, action: string): Promise<void> {
    return apiClient.post(`/ceo/approve/${hypothesisId}`, { action })
  }
}

export const ceoAPI = new CEOAPI()


