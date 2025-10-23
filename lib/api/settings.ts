import { apiClient } from './client'

export interface SystemSettings {
  notifications: {
    email: boolean
    push: boolean
    slack: boolean
  }
  security: {
    twoFactor: boolean
    sessionTimeout: boolean
    sessionTimeoutHours: number
  }
  system: {
    theme: 'dark' | 'light'
    language: string
    timezone: string
  }
}

export class SettingsAPI {
  // Получить настройки системы
  async getSettings(): Promise<SystemSettings> {
    return apiClient.get<SystemSettings>('/settings')
  }

  // Обновить настройки системы
  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    return apiClient.put<SystemSettings>('/settings', settings)
  }

  // Сбросить настройки к значениям по умолчанию
  async resetSettings(): Promise<SystemSettings> {
    return apiClient.post<SystemSettings>('/settings/reset')
  }

  // Обновить настройки уведомлений
  async updateNotifications(notifications: Partial<SystemSettings['notifications']>): Promise<SystemSettings> {
    return apiClient.put<SystemSettings>('/settings', { notifications })
  }

  // Обновить настройки безопасности
  async updateSecurity(security: Partial<SystemSettings['security']>): Promise<SystemSettings> {
    return apiClient.put<SystemSettings>('/settings', { security })
  }

  // Обновить системные настройки
  async updateSystem(system: Partial<SystemSettings['system']>): Promise<SystemSettings> {
    return apiClient.put<SystemSettings>('/settings', { system })
  }
}

export const settingsAPI = new SettingsAPI()


