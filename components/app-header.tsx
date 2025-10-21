"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export function AppHeader() {
  const unreadCount = 2

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4 bg-background/50 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Link>
        </Button>
      </div>
    </header>
  )
}
