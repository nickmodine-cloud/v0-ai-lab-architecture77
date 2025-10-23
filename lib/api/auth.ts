import { apiClient } from './client'
import { User } from './types'

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  department: string
  roles: string[]
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ConfirmResetPasswordRequest {
  token: string
  newPassword: string
}

export class AuthAPI {
  // Вход в систему
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    
    // Сохраняем токен в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('refresh_token', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  }

  // Регистрация
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    
    // Сохраняем токен в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('refresh_token', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  }

  // Выход из системы
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      // Очищаем localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }
  }

  // Обновление токена
  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', data)
    
    // Обновляем токен в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('refresh_token', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  }

  // Получить текущего пользователя
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me')
  }

  // Обновить профиль пользователя
  async updateProfile(data: Partial<{
    name: string
    email: string
    department: string
    avatar?: File
  }>): Promise<User> {
    return apiClient.put<User>('/auth/profile', data)
  }

  // Изменить пароль
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post('/auth/change-password', data)
  }

  // Запросить сброс пароля
  async requestPasswordReset(data: ResetPasswordRequest): Promise<void> {
    return apiClient.post('/auth/forgot-password', data)
  }

  // Подтвердить сброс пароля
  async confirmPasswordReset(data: ConfirmResetPasswordRequest): Promise<void> {
    return apiClient.post('/auth/reset-password', data)
  }

  // Включить двухфакторную аутентификацию
  async enable2FA(): Promise<{
    qrCode: string
    secret: string
    backupCodes: string[]
  }> {
    return apiClient.post('/auth/2fa/enable')
  }

  // Подтвердить двухфакторную аутентификацию
  async confirm2FA(code: string): Promise<void> {
    return apiClient.post('/auth/2fa/confirm', { code })
  }

  // Отключить двухфакторную аутентификацию
  async disable2FA(password: string): Promise<void> {
    return apiClient.post('/auth/2fa/disable', { password })
  }

  // Получить сессии пользователя
  async getSessions(): Promise<{
    id: string
    device: string
    browser: string
    location: string
    lastActivity: string
    current: boolean
  }[]> {
    return apiClient.get('/auth/sessions')
  }

  // Завершить сессию
  async terminateSession(sessionId: string): Promise<void> {
    return apiClient.delete(`/auth/sessions/${sessionId}`)
  }

  // Завершить все сессии кроме текущей
  async terminateAllOtherSessions(): Promise<void> {
    return apiClient.post('/auth/sessions/terminate-others')
  }

  // Проверить валидность токена
  async validateToken(): Promise<boolean> {
    try {
      await apiClient.get('/auth/validate')
      return true
    } catch {
      return false
    }
  }

  // Получить права доступа пользователя
  async getPermissions(): Promise<{
    permissions: string[]
    roles: string[]
    laboratories: {
      id: string
      name: string
      role: string
    }[]
  }> {
    return apiClient.get('/auth/permissions')
  }

  // Проверить право доступа
  async hasPermission(permission: string): Promise<boolean> {
    try {
      await apiClient.get(`/auth/permissions/${permission}`)
      return true
    } catch {
      return false
    }
  }

  // Получить настройки безопасности
  async getSecuritySettings(): Promise<{
    passwordExpiry: number
    sessionTimeout: number
    require2FA: boolean
    allowedIPs: string[]
    loginAttempts: number
    lastPasswordChange: string
  }> {
    return apiClient.get('/auth/security-settings')
  }

  // Обновить настройки безопасности
  async updateSecuritySettings(settings: {
    allowedIPs?: string[]
    require2FA?: boolean
  }): Promise<void> {
    return apiClient.put('/auth/security-settings', settings)
  }
}

export const authAPI = new AuthAPI()


