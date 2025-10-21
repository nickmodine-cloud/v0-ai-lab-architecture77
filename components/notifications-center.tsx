"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  TrendingUp,
  Clock,
  Mail,
  Smartphone,
  Slack,
  Settings,
  Check,
  Trash2,
} from "lucide-react"
import Link from "next/link"

const notifications = [
  {
    id: "NOTIF-001",
    type: "approval",
    title: "Гипотеза HYP-042 ожидает вашего одобрения",
    description: "LLM для автоматизации поддержки клиентов готова к оценке",
    timestamp: "2025-01-21T18:30:00",
    read: false,
    priority: "высокий",
    actor: { name: "Сара Чен", initials: "СЧ" },
    link: "/hypotheses/HYP-042",
  },
  {
    id: "NOTIF-002",
    type: "status",
    title: "Гипотеза HYP-038 перемещена в Оценку",
    description: "ML система обнаружения мошенничества перешла на следующий этап",
    timestamp: "2025-01-21T17:45:00",
    read: false,
    priority: "средний",
    actor: { name: "Маркус Джонсон", initials: "МД" },
    link: "/hypotheses/HYP-038",
  },
  {
    id: "NOTIF-003",
    type: "comment",
    title: "Новый комментарий к HYP-042",
    description: "Сара Чен упомянула вас в комментарии",
    timestamp: "2025-01-21T16:20:00",
    read: true,
    priority: "низкий",
    actor: { name: "Сара Чен", initials: "СЧ" },
    link: "/hypotheses/HYP-042",
  },
  {
    id: "NOTIF-004",
    type: "experiment",
    title: "Эксперимент EXP-003 завершен",
    description: "RAG с базой знаний завершен с точностью 85%",
    timestamp: "2025-01-21T15:10:00",
    read: true,
    priority: "средний",
    actor: null,
    link: "/experiments/EXP-003",
  },
  {
    id: "NOTIF-005",
    type: "assignment",
    title: "Вы назначены на HYP-051",
    description: "Гипотеза базы знаний RAG требует вашей экспертизы",
    timestamp: "2025-01-21T14:30:00",
    read: true,
    priority: "высокий",
    actor: { name: "Эмили Родригес", initials: "ЭР" },
    link: "/hypotheses/HYP-051",
  },
  {
    id: "NOTIF-006",
    type: "deadline",
    title: "Приближается срок HYP-029",
    description: "Дашборд предиктивной аналитики должен быть готов через 3 дня",
    timestamp: "2025-01-21T10:00:00",
    read: true,
    priority: "высокий",
    actor: null,
    link: "/hypotheses/HYP-029",
  },
]

const notificationPreferences = [
  {
    category: "События гипотез",
    settings: [
      { key: "hypothesis_created", label: "Гипотеза создана", inApp: true, email: false, slack: false, push: false },
      {
        key: "hypothesis_assigned",
        label: "Назначена гипотеза",
        inApp: true,
        email: true,
        slack: true,
        push: false,
      },
      { key: "hypothesis_approved", label: "Гипотеза одобрена", inApp: true, email: true, slack: false, push: false },
      {
        key: "hypothesis_mentioned",
        label: "Упоминание в комментарии",
        inApp: true,
        email: true,
        slack: true,
        push: true,
      },
      {
        key: "hypothesis_deadline",
        label: "Приближается срок",
        inApp: true,
        email: true,
        slack: false,
        push: true,
      },
    ],
  },
  {
    category: "События экспериментов",
    settings: [
      {
        key: "experiment_completed",
        label: "Эксперимент завершен",
        inApp: true,
        email: true,
        slack: false,
        push: false,
      },
      { key: "experiment_failed", label: "Эксперимент провален", inApp: true, email: true, slack: true, push: true },
      {
        key: "experiment_milestone",
        label: "Достигнута веха",
        inApp: true,
        email: false,
        slack: false,
        push: false,
      },
    ],
  },
  {
    category: "Системные события",
    settings: [
      { key: "system_maintenance", label: "Обслуживание системы", inApp: true, email: true, slack: true, push: false },
      { key: "security_alert", label: "Оповещения безопасности", inApp: true, email: true, slack: true, push: true },
      { key: "weekly_digest", label: "Еженедельная сводка", inApp: false, email: true, slack: false, push: false },
    ],
  },
]

const typeIcons = {
  approval: CheckCircle2,
  status: TrendingUp,
  comment: MessageSquare,
  experiment: TrendingUp,
  assignment: UserPlus,
  deadline: Clock,
}

const typeColors = {
  approval: "text-accent",
  status: "text-chart-2",
  comment: "text-primary",
  experiment: "text-chart-3",
  assignment: "text-secondary",
  deadline: "text-destructive",
}

export function NotificationsCenter() {
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Уведомления</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {unreadCount} новых
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">Будьте в курсе ваших гипотез и экспериментов</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          Настройки
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="preferences">Настройки</TabsTrigger>
        </TabsList>

        {/* Notifications List */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="glass glass-highlight p-6 border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={filter === "outline" ? "bg-transparent" : ""}
                  >
                    Все
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("unread")}
                    className={filter === "outline" ? "bg-transparent" : ""}
                  >
                    Непрочитанные ({unreadCount})
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Check className="h-4 w-4" />
                    Отметить все
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                    Очистить все
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">Нет уведомлений</p>
                    <p className="text-sm text-muted-foreground">Вы всё просмотрели!</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const Icon = typeIcons[notification.type as keyof typeof typeIcons]
                    const iconColor = typeColors[notification.type as keyof typeof typeColors]

                    return (
                      <Link key={notification.id} href={notification.link}>
                        <Card
                          className={`glass glass-highlight p-4 border-border/50 hover:border-primary/50 transition-all cursor-pointer ${
                            !notification.read ? "border-l-4 border-l-primary" : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`rounded-full bg-muted/30 p-2 ${!notification.read ? "bg-primary/20" : ""}`}
                            >
                              <Icon className={`h-5 w-5 ${iconColor}`} />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-sm text-foreground">{notification.title}</h3>
                                    {!notification.read && (
                                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                                </div>
                                <Badge
                                  variant={
                                    notification.priority === "высокий"
                                      ? "destructive"
                                      : notification.priority === "средний"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {notification.priority}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {notification.actor && (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                      <AvatarFallback className="text-xs">{notification.actor.initials}</AvatarFallback>
                                    </Avatar>
                                    <span>{notification.actor.name}</span>
                                  </div>
                                )}
                                <span>•</span>
                                <span>{new Date(notification.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          {notificationPreferences.map((category) => (
            <Card key={category.category} className="glass glass-highlight p-6 border-border/50">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{category.category}</h2>

                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-muted/30 px-4 py-3 grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-1">Событие</div>
                    <div className="flex items-center justify-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>В приложении</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Slack className="h-4 w-4" />
                      <span>Slack</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Push</span>
                    </div>
                  </div>

                  {category.settings.map((setting, idx) => (
                    <div
                      key={setting.key}
                      className={`px-4 py-4 grid grid-cols-5 gap-4 items-center ${
                        idx !== category.settings.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <Label htmlFor={setting.key} className="text-sm font-medium text-foreground">
                        {setting.label}
                      </Label>
                      <div className="flex justify-center">
                        <Switch id={`${setting.key}-inapp`} checked={setting.inApp} />
                      </div>
                      <div className="flex justify-center">
                        <Switch id={`${setting.key}-email`} checked={setting.email} />
                      </div>
                      <div className="flex justify-center">
                        <Switch id={`${setting.key}-slack`} checked={setting.slack} />
                      </div>
                      <div className="flex justify-center">
                        <Switch id={`${setting.key}-push`} checked={setting.push} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button size="lg">Сохранить настройки</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
