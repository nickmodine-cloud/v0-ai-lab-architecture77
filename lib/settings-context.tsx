"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Settings {
  theme: 'dark' | 'light'
  language: 'ru' | 'en'
  timezone: string
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    language: 'ru',
    timezone: 'Europe/Moscow'
  })
  const [loading, setLoading] = useState(false)

  // Загружаем настройки из localStorage при инициализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark'
      const savedLanguage = localStorage.getItem('language') as 'ru' | 'en' || 'ru'
      const savedTimezone = localStorage.getItem('timezone') || 'Europe/Moscow'
      
      setSettings({
        theme: savedTheme,
        language: savedLanguage,
        timezone: savedTimezone
      })
      
      // Применяем тему сразу
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (theme: 'dark' | 'light') => {
    if (typeof window === 'undefined') return
    
    const html = document.documentElement
    const body = document.body
    
    // Убираем старые классы
    html.classList.remove('dark', 'light')
    body.classList.remove('dark', 'light')
    
    // Добавляем новый класс
    html.classList.add(theme)
    body.classList.add(theme)
    
    console.log('Theme applied:', theme)
  }

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    
    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      if (newSettings.theme) {
        localStorage.setItem('theme', newSettings.theme)
        applyTheme(newSettings.theme)
      }
      if (newSettings.language) {
        localStorage.setItem('language', newSettings.language)
        document.documentElement.lang = newSettings.language
      }
      if (newSettings.timezone) {
        localStorage.setItem('timezone', newSettings.timezone)
      }
    }
    
    console.log('Settings updated:', updatedSettings)
  }

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      loading 
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
