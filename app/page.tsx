import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, FlaskConical, TrendingUp, Clock, ArrowRight, Sparkles } from "lucide-react"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6 space-y-6">
            {/* Hero Section */}
            <div className="glass glass-highlight rounded-2xl p-8 border border-border/50">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Добро пожаловать в ИИ-лабораторию K2.tech
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Управляйте ИИ-гипотезами, запускайте эксперименты и отслеживайте инновационный конвейер
                  </p>
                </div>
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Новая гипотеза
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Активные гипотезы</p>
                    <p className="text-3xl font-bold text-foreground">47</p>
                    <p className="text-xs text-accent flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% за месяц
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/20 p-3">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">В экспериментах</p>
                    <p className="text-3xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">Без изменений</p>
                  </div>
                  <div className="rounded-full bg-secondary/20 p-3">
                    <FlaskConical className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Успешность</p>
                    <p className="text-3xl font-bold text-foreground">68%</p>
                    <p className="text-xs text-accent flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +5% за квартал
                    </p>
                  </div>
                  <div className="rounded-full bg-accent/20 p-3">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Среднее время до прода</p>
                    <p className="text-3xl font-bold text-foreground">8.2н</p>
                    <p className="text-xs text-accent flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      -1.3 недели
                    </p>
                  </div>
                  <div className="rounded-full bg-chart-3/20 p-3">
                    <Clock className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Последние гипотезы</h3>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Все
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        id: "HYP-042",
                        title: "LLM для поддержки клиентов",
                        stage: "Оценка",
                        priority: "Критический",
                      },
                      {
                        id: "HYP-038",
                        title: "ML обнаружение мошенничества",
                        stage: "Скопинг",
                        priority: "Высокий",
                      },
                      {
                        id: "HYP-051",
                        title: "База знаний RAG",
                        stage: "Идея",
                        priority: "Средний",
                      },
                    ].map((hyp) => (
                      <div
                        key={hyp.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3 transition-colors hover:bg-background/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{hyp.id}</span>
                            <Badge
                              variant={
                                hyp.priority === "Критический"
                                  ? "destructive"
                                  : hyp.priority === "Высокий"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {hyp.priority}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{hyp.title}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {hyp.stage}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="glass glass-highlight p-6 border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Выполняемые эксперименты</h3>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Все
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        id: "EXP-001",
                        name: "Базовая модель GPT-4",
                        progress: 87,
                        status: "Выполняется",
                      },
                      {
                        id: "EXP-002",
                        name: "Fine-tuned LLaMA",
                        progress: 100,
                        status: "Завершен",
                      },
                      {
                        id: "EXP-003",
                        name: "RAG с эмбеддингами",
                        progress: 45,
                        status: "Выполняется",
                      },
                    ].map((exp) => (
                      <div key={exp.id} className="space-y-2 rounded-lg border border-border/50 bg-background/30 p-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-xs font-mono text-muted-foreground">{exp.id}</span>
                            <p className="text-sm font-medium text-foreground">{exp.name}</p>
                          </div>
                          <Badge variant={exp.status === "Завершен" ? "default" : "secondary"} className="text-xs">
                            {exp.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="text-foreground font-medium">{exp.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary transition-all" style={{ width: `${exp.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
