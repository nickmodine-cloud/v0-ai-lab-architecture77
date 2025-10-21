"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { UserDialog } from "./user-dialog"
import { RoleDialog } from "./role-dialog"
import {
  Users,
  Shield,
  Key,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Search,
  UserPlus,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react"

const users = [
  {
    id: "USR-001",
    name: "Сара Чен",
    email: "sarah.chen@k2.tech",
    role: "Администратор",
    status: "Активен",
    lastLogin: "2025-01-21 18:30",
    hypotheses: 8,
    avatar: "",
    initials: "СЧ",
  },
  {
    id: "USR-002",
    name: "Маркус Джонсон",
    email: "marcus.j@k2.tech",
    role: "ML Инженер",
    status: "Активен",
    lastLogin: "2025-01-21 17:45",
    hypotheses: 6,
    avatar: "",
    initials: "МД",
  },
  {
    id: "USR-003",
    name: "Эмили Родригес",
    email: "emily.r@k2.tech",
    role: "Data Scientist",
    status: "Активен",
    lastLogin: "2025-01-21 16:20",
    hypotheses: 5,
    avatar: "",
    initials: "ЭР",
  },
  {
    id: "USR-004",
    name: "Дэвид Ким",
    email: "david.k@k2.tech",
    role: "CEO",
    status: "Активен",
    lastLogin: "2025-01-21 19:00",
    hypotheses: 0,
    avatar: "",
    initials: "ДК",
  },
  {
    id: "USR-005",
    name: "Лиза Ванг",
    email: "lisa.w@k2.tech",
    role: "Бизнес-пользователь",
    status: "Неактивен",
    lastLogin: "2025-01-15 10:30",
    hypotheses: 3,
    avatar: "",
    initials: "ЛВ",
  },
]

const roles = [
  {
    id: "ROLE-001",
    name: "Администратор",
    code: "ADMIN",
    description: "Полный доступ к системе",
    userCount: 3,
    permissions: ["Все права"],
  },
  {
    id: "ROLE-002",
    name: "ML Инженер",
    code: "ML_ENGINEER",
    description: "Создание и управление экспериментами",
    userCount: 8,
    permissions: ["Создание гипотез", "Запуск экспериментов", "Просмотр данных"],
  },
  {
    id: "ROLE-003",
    name: "Data Scientist",
    code: "DATA_SCIENTIST",
    description: "Создание и запуск экспериментов",
    userCount: 12,
    permissions: ["Создание гипотез", "Запуск экспериментов", "Чтение данных"],
  },
  {
    id: "ROLE-004",
    name: "CEO",
    code: "CEO",
    description: "Дашборд руководителя и одобрения",
    userCount: 1,
    permissions: ["Просмотр всего", "Одобрение переходов", "Генерация отчетов"],
  },
  {
    id: "ROLE-005",
    name: "Бизнес-пользователь",
    code: "BUSINESS_USER",
    description: "Просмотр и создание гипотез",
    userCount: 25,
    permissions: ["Создание гипотез", "Комментарии", "Просмотр экспериментов"],
  },
]

const permissions = [
  {
    id: "PERM-001",
    code: "hypothesis.create",
    resource: "Гипотезы",
    action: "Создание",
    description: "Может создавать новые гипотезы",
  },
  {
    id: "PERM-002",
    code: "hypothesis.read",
    resource: "Гипотезы",
    action: "Чтение",
    description: "Может просматривать гипотезы",
  },
  {
    id: "PERM-003",
    code: "hypothesis.update",
    resource: "Гипотезы",
    action: "Обновление",
    description: "Может редактировать гипотезы",
  },
  {
    id: "PERM-004",
    code: "hypothesis.delete",
    resource: "Гипотезы",
    action: "Удаление",
    description: "Может удалять гипотезы",
  },
  {
    id: "PERM-005",
    code: "hypothesis.approve",
    resource: "Гипотезы",
    action: "Одобрение",
    description: "Может одобрять переходы между этапами",
  },
  {
    id: "PERM-006",
    code: "experiment.create",
    resource: "Эксперименты",
    action: "Создание",
    description: "Может создавать эксперименты",
  },
  {
    id: "PERM-007",
    code: "experiment.run",
    resource: "Эксперименты",
    action: "Запуск",
    description: "Может выполнять эксперименты",
  },
  {
    id: "PERM-008",
    code: "user.manage",
    resource: "Пользователи",
    action: "Управление",
    description: "Может управлять учетными записями",
  },
  {
    id: "PERM-009",
    code: "role.manage",
    resource: "Роли",
    action: "Управление",
    description: "Может управлять ролями и правами",
  },
  {
    id: "PERM-010",
    code: "system.admin",
    resource: "Система",
    action: "Администрирование",
    description: "Полный административный доступ",
  },
]

export function IAMModule() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)

  return (
    <>
      <div className="space-y-6 max-w-[1600px]">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Управление доступом</h1>
          <p className="text-lg text-muted-foreground">Управление пользователями, ролями и правами</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/20 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-xs text-muted-foreground">Всего пользователей</p>
              </div>
            </div>
          </Card>

          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-chart-3/20 p-2">
                <CheckCircle2 className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter((u) => u.status === "Активен").length}
                </p>
                <p className="text-xs text-muted-foreground">Активных</p>
              </div>
            </div>
          </Card>

          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary/20 p-2">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{roles.length}</p>
                <p className="text-xs text-muted-foreground">Ролей</p>
              </div>
            </div>
          </Card>

          <Card className="glass glass-highlight p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent/20 p-2">
                <Key className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{permissions.length}</p>
                <p className="text-xs text-muted-foreground">Прав</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="roles">Роли</TabsTrigger>
            <TabsTrigger value="permissions">Права</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6 mt-6">
            <Card className="glass glass-highlight p-6 border-border/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-foreground">Управление пользователями</h2>
                    <p className="text-sm text-muted-foreground">Управление учетными записями и доступом</p>
                  </div>
                  <Button className="gap-2" onClick={() => setUserDialogOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                    Добавить пользователя
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>

                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Последний вход</TableHead>
                        <TableHead>Гипотезы</TableHead>
                        <TableHead className="w-24">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Активен" ? "default" : "secondary"} className="text-xs">
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono">{user.lastLogin}</TableCell>
                          <TableCell className="text-center">{user.hypotheses}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Отправить email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Просмотр активности
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Удалить
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Roles Management */}
          <TabsContent value="roles" className="space-y-6 mt-6">
            <Card className="glass glass-highlight p-6 border-border/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-foreground">Управление ролями</h2>
                    <p className="text-sm text-muted-foreground">Определение ролей и их прав</p>
                  </div>
                  <Button className="gap-2" onClick={() => setRoleDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Добавить роль
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {roles.map((role) => (
                    <Card
                      key={role.id}
                      className={`glass glass-highlight p-5 border-border/50 cursor-pointer transition-all hover:border-primary/50 ${
                        selectedRole === role.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold text-foreground">{role.name}</h3>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground">{role.code}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                Просмотр пользователей
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-sm text-muted-foreground">{role.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{role.userCount} польз.</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {role.permissions.length} прав
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Основные права:</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((perm, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Permissions Management */}
          <TabsContent value="permissions" className="space-y-6 mt-6">
            <Card className="glass glass-highlight p-6 border-border/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-foreground">Управление правами</h2>
                    <p className="text-sm text-muted-foreground">Определение детального контроля доступа</p>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Добавить право
                  </Button>
                </div>

                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead>ID права</TableHead>
                        <TableHead>Код</TableHead>
                        <TableHead>Ресурс</TableHead>
                        <TableHead>Действие</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead className="w-24">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission) => (
                        <TableRow key={permission.id} className="hover:bg-muted/20">
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-mono text-xs">{permission.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {permission.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{permission.resource}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {permission.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{permission.description}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Просмотр ролей
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Удалить
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <UserDialog open={userDialogOpen} onOpenChange={setUserDialogOpen} mode="create" />
      <RoleDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen} mode="create" />
    </>
  )
}
