import { apiClient } from './client'

export interface User {
  id: string
  name: string
  email: string
  department: string
  roles: string[]
  status: 'Active' | 'Inactive' | 'Suspended'
  lastLogin: string | null
  createdAt: string
  assignedLabs: string[]
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  usersCount: number
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  resourceId: string
  ipAddress: string
  details: string
  status: 'Success' | 'Failed'
}

export interface UsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuditLogsResponse {
  data: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class IAMAPI {
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    department?: string
    role?: string
    status?: string
  }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.department) queryParams.append('department', params.department)
    if (params?.role) queryParams.append('role', params.role)
    if (params?.status) queryParams.append('status', params.status)
    
    const query = queryParams.toString()
    return apiClient.get<UsersResponse>(`/iam/users${query ? `?${query}` : ''}`)
  }

  async createUser(userData: {
    name: string
    email: string
    department?: string
    roles?: string[]
    assignedLabs?: string[]
  }): Promise<User> {
    return apiClient.post<User>('/iam/users', userData)
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/iam/users/${userId}`, updates)
  }

  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete(`/iam/users/${userId}`)
  }

  async getRoles(): Promise<Role[]> {
    return apiClient.get<Role[]>('/iam/roles')
  }

  async getPermissions(): Promise<Permission[]> {
    return apiClient.get<Permission[]>('/iam/permissions')
  }

  async getAuditLogs(params?: {
    page?: number
    limit?: number
    user?: string
    action?: string
    resource?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AuditLogsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.user) queryParams.append('user', params.user)
    if (params?.action) queryParams.append('action', params.action)
    if (params?.resource) queryParams.append('resource', params.resource)
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
    
    const query = queryParams.toString()
    return apiClient.get<AuditLogsResponse>(`/iam/audit-logs${query ? `?${query}` : ''}`)
  }
}

export const iamAPI = new IAMAPI()


