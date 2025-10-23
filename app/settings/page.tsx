"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSettings } from "@/components/admin-settings"
import { IAMSettings } from "@/components/iam-settings"
import { SystemSettings } from "@/components/system-settings"
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  Building
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("system")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Настройки системы</h1>
              <p className="text-muted-foreground">
                Управление системой, пользователями и конфигурацией
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Система
                </TabsTrigger>
                <TabsTrigger value="iam" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  IAM
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Админ
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Данные
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Внешний вид
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Интеграции
                </TabsTrigger>
              </TabsList>

              <TabsContent value="system">
                <SystemSettings />
              </TabsContent>

              <TabsContent value="iam">
                <IAMSettings />
              </TabsContent>

              <TabsContent value="admin">
                <AdminSettings />
              </TabsContent>

              <TabsContent value="data">
                <div className="text-center py-8 text-muted-foreground">
                  Управление данными будет добавлено в следующих версиях
                </div>
              </TabsContent>

              <TabsContent value="appearance">
                <div className="text-center py-8 text-muted-foreground">
                  Настройки внешнего вида интегрированы в системные настройки
                </div>
              </TabsContent>

              <TabsContent value="integrations">
                <div className="text-center py-8 text-muted-foreground">
                  Интеграции интегрированы в системные настройки
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}