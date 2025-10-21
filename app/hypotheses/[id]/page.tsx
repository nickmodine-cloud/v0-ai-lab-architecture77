import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { HypothesisDetail } from "@/components/hypothesis-detail"

export default function HypothesisDetailPage({ params }: { params: { id: string } }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <HypothesisDetail hypothesisId={params.id} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
