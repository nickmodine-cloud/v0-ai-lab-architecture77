import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { HypothesisKanban } from "@/components/hypothesis-kanban"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Download } from "lucide-react"

export default function HypothesesPage() {
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
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Фильтр
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Экспорт
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Новая гипотеза
                </Button>
              </div>
            </div>

            {/* Kanban Board */}
            <HypothesisKanban />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
