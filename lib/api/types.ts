// Основные типы данных для API
export interface User {
  id: string
  name: string
  email: string
  department: string
  roles: string[]
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
}

export interface Laboratory {
  id: string
  name: string
  description: string
  department: string
  owner: User
  members: LaboratoryMember[]
  status: 'active' | 'paused' | 'archived'
  visibility: 'private' | 'internal' | 'public'
  createdAt: string
  updatedAt: string
}

export interface LaboratoryMember {
  id: string
  laboratoryId: string
  userId: string
  user: User
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joinedAt: string
}

export type HypothesisStage = 
  | 'backlog' 
  | 'ideation' 
  | 'scoping' 
  | 'prioritization' 
  | 'experimentation' 
  | 'evaluation' 
  | 'scaling' 
  | 'production' 
  | 'archived'

export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type AIType = 'LLM' | 'ML' | 'CV' | 'NLP'
export type BusinessCategory = 'cost_optimization' | 'revenue_generation' | 'risk_mitigation' | 'customer_experience' | 'employee_productivity' | 'compliance'

export interface Hypothesis {
  id: string
  title: string
  hypothesisStatement: string
  description: string
  aiType: AIType
  businessCategory: BusinessCategory
  industry: string
  department: string
  owner: User
  technicalLead: User
  businessSponsor: User
  coAuthors: User[]
  reviewers: User[]
  observers: User[]
  priority: Priority
  expectedImpact: number
  complexity: number
  rank: number
  dataSources: string[]
  dataVolume: string
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor'
  gpuRequirements: string
  estimatedCost: number
  currency: string
  estimatedTimeToProductionWeeks: number
  expectedROIPercent: number
  paybackPeriodMonths: number
  successMetrics: SuccessMetric[]
  currentStage: HypothesisStage
  createdAt: string
  updatedAt: string
  targetLaunchDate?: string
  actualLaunchDate?: string
  tags: string[]
  linkedHypotheses: string[]
  laboratory: Laboratory
}

export interface SuccessMetric {
  name: string
  targetValue: number
  unit: string
  description: string
}

export type ExperimentStatus = 'queued' | 'running' | 'completed' | 'failed' | 'stopped'

export interface Experiment {
  id: string
  hypothesisId: string
  hypothesis: Hypothesis
  name: string
  variant: string
  status: ExperimentStatus
  modelApproach: string
  parameters: Record<string, any>
  metrics: Record<string, number>
  startedAt?: string
  completedAt?: string
  durationSeconds?: number
  gpuHoursUsed: number
  cost: number
  currency: string
  artifactsUrl?: string
  notebookUrl?: string
  gitCommitHash?: string
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  eventType: string
  title: string
  message: string
  relatedObjectType: 'hypothesis' | 'experiment' | 'resource' | 'user'
  relatedObjectId: string
  triggeredByUserId: string
  triggeredBy: User
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  createdAt: string
  channelsSent: string[]
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  user: User
  action: string
  resourceType: string
  resourceId: string
  ipAddress: string
  details: string
  status: 'success' | 'failure'
}

export interface SystemSettings {
  platformName: string
  supportEmail: string
  defaultLanguage: string
  defaultTimezone: string
  defaultCurrency: string
  dateFormat: string
  maxActiveHypotheses: number
  maxGpuHoursPerMonth: number
  maxStorageGB: number
  require2FA: boolean
  sessionTimeoutMinutes: number
  passwordExpiryDays: number
}

export interface Dictionary {
  id: string
  name: string
  code: string
  description: string
  active: boolean
  order: number
  iconUrl?: string
}

// API Request/Response типы
export interface CreateHypothesisRequest {
  title: string
  hypothesisStatement: string
  description: string
  aiType: AIType
  businessCategory: BusinessCategory
  industry: string
  department: string
  technicalLeadId: string
  businessSponsorId: string
  coAuthorIds: string[]
  reviewerIds: string[]
  observerIds: string[]
  priority: Priority
  expectedImpact: number
  complexity: number
  dataSources: string[]
  dataVolume: string
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor'
  gpuRequirements: string
  estimatedCost: number
  currency: string
  estimatedTimeToProductionWeeks: number
  expectedROIPercent: number
  paybackPeriodMonths: number
  successMetrics: SuccessMetric[]
  targetLaunchDate?: string
  tags: string[]
  linkedHypothesisIds: string[]
  laboratoryId: string
}

export interface UpdateHypothesisRequest extends Partial<CreateHypothesisRequest> {
  id: string
}

export interface CreateExperimentRequest {
  hypothesisId: string
  name: string
  variant: string
  modelApproach: string
  parameters: Record<string, any>
  laboratoryId: string
}

export interface MoveHypothesisRequest {
  hypothesisId: string
  newStage: HypothesisStage
  comment?: string
}

export interface CreateNotificationRequest {
  userId: string
  eventType: string
  title: string
  message: string
  relatedObjectType: 'hypothesis' | 'experiment' | 'resource' | 'user'
  relatedObjectId: string
  channels: string[]
}

// WebSocket события
export interface WebSocketEvent {
  type: string
  data: any
  timestamp: string
}

export interface HypothesisUpdatedEvent {
  type: 'hypothesis_updated'
  data: Hypothesis
  timestamp: string
}

export interface ExperimentUpdatedEvent {
  type: 'experiment_updated'
  data: Experiment
  timestamp: string
}

export interface NotificationEvent {
  type: 'notification'
  data: Notification
  timestamp: string
}

// API Response обертки
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
  errors?: string[]
}


