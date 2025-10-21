import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ExperimentsGrid } from "@/components/experiments-grid"

export default function ExperimentsPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <ExperimentsGrid />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
