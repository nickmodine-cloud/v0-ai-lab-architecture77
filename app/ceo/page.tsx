import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CEODashboard } from "@/components/ceo-dashboard"

export default function CEOPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <CEODashboard />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
