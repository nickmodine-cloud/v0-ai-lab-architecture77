"use client"

import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { HypothesisKanban } from "@/components/hypothesis-kanban"
import { HypothesisWizardDialog } from "@/components/hypothesis-wizard-dialog"
import { HypothesisDetailDialog } from "@/components/hypothesis-detail-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Download, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"

export default function HypothesesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.hypotheses.getHypothesesStats()
      setStats(data)
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    loadStats() // Перезагружаем статистику после создания
  }

  const handleHypothesisClick = (hypothesisId: string) => {
    setSelectedHypothesisId(hypothesisId)
    setDetailDialogOpen(true)
  }

  const handleExport = () => {
    // Экспорт в CSV
    const csvData = "ID,Название,Стадия,Приоритет,Создано\n" + 
      "1,Персонализированные рекомендации,ideation,high,2025-01-21\n" +
      "2,Прогнозирование оттока,scoping,high,2025-01-21\n" +
      "3,Тестовая гипотеза,ideation,high,2025-01-21"
    
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hypotheses.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Загрузка гипотез...</span>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 p-6 space-y-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={loadStats}>Попробовать снова</Button>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Гипотезы</h1>
                <p className="text-muted-foreground">
                  Управляйте и отслеживайте ИИ-гипотезы на всех этапах жизненного цикла
                  {stats && (
                    <span className="ml-2 text-sm">
                      • Всего: {stats.total} • В работе: {stats.byStage?.experimentation || 0}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => setFilterOpen(!filterOpen)}>
                  <Filter className="h-4 w-4" />
                  Фильтр
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Экспорт
                </Button>
                <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Новая гипотеза
                </Button>
              </div>
            </div>

            {/* Kanban Board */}
            <HypothesisKanban onRefresh={handleCreateSuccess} onHypothesisClick={handleHypothesisClick} />
          </main>
        </SidebarInset>
      </div>

      {/* Dialogs */}
      <HypothesisWizardDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSuccess={handleCreateSuccess}
      />
      
      <HypothesisDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        hypothesisId={selectedHypothesisId || ''}
      />
    </SidebarProvider>
  )
}
