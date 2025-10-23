"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { 
  Users, 
  Shield, 
  Key, 
  Building, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload
} from "lucide-react"

// Интерфейсы для данных
interface User {
  id: string
  name: string
  email: string
  department: string
  roles: string[]
  assigned_labs: string[]
  status: 'Active' | 'Inactive' | 'Suspended'
  last_login: string
  created_at: string
}

interface Role {
  id: string
  name: string
  description: string
  users_count: number
  permissions: string[]
}

interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
}

interface Laboratory {
  id: string
  name: string
  department: string
  owner: string
  members: number
  visibility: 'Private' | 'Internal' | 'Public'
}

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource_type: string
  resource_id: string
  ip_address: string
  details: string
  status: 'Success' | 'Failure'
}

export function IAMSettings() {
  const [activeTab, setActiveTab] = useState("users")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Данные
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [laboratories, setLaboratories] = useState<Laboratory[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  
  // Фильтры и поиск
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  
  // Формы
  const [showUserForm, setShowUserForm] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    department: '',
    roles: [],
    assigned_labs: [],
    status: 'Active'
  })
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    id: '',
    description: '',
    permissions: []
  })

  // Загружаем данные
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Загружаем пользователей
      const usersResponse = await fetch('http://localhost:5001/api/iam/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.data || [])
      }
      
      // Загружаем роли
      const rolesResponse = await fetch('http://localhost:5001/api/iam/roles')
      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json()
        setRoles(Array.isArray(rolesData) ? rolesData : [])
      }
      
      // Загружаем разрешения
      const permissionsResponse = await fetch('http://localhost:5001/api/iam/permissions')
      if (permissionsResponse.ok) {
        const permissionsData = await permissionsResponse.json()
        setPermissions(Array.isArray(permissionsData) ? permissionsData : [])
      }
      
      // Загружаем лаборатории
      const labsResponse = await fetch('http://localhost:5001/api/iam/laboratories')
      if (labsResponse.ok) {
        const labsData = await labsResponse.json()
        setLaboratories(Array.isArray(labsData) ? labsData : [])
      }
      
      // Загружаем аудит логи
      const auditResponse = await fetch('http://localhost:5001/api/iam/audit-logs')
      if (auditResponse.ok) {
        const auditData = await auditResponse.json()
        setAuditLogs(Array.isArray(auditData) ? auditData : [])
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const saveUser = async (user: User) => {
    try {
      const response = await fetch(`http://localhost:5001/api/iam/users${user.id ? `/${user.id}` : ''}`, {
        method: user.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      
      if (response.ok) {
        toast.success('Пользователь сохранен')
        setShowUserForm(false)
        setEditingUser(null)
        loadData()
      } else {
        throw new Error('Ошибка сохранения')
      }
    } catch (error) {
      toast.error('Ошибка сохранения пользователя')
    }
  }

  const createUser = async (userData: Partial<User>) => {
    const user = {
      name: userData.name || '',
      email: userData.email || '',
      department: userData.department || '',
      roles: userData.roles || [],
      assigned_labs: userData.assigned_labs || [],
      status: userData.status || 'Active'
    }
    
    try {
      const response = await fetch('http://localhost:5001/api/iam/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      
      if (response.ok) {
        toast.success('Пользователь создан')
        setShowUserForm(false)
        setNewUser({
          name: '',
          email: '',
          department: '',
          roles: [],
          assigned_labs: [],
          status: 'Active'
        })
        loadData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка создания')
      }
    } catch (error) {
      console.error('Ошибка создания пользователя:', error)
      toast.error('Ошибка создания пользователя')
    }
  }

  const saveRole = async (role: Role) => {
    try {
      console.log('Saving role:', role)
      
      const response = await fetch(`http://localhost:5001/api/iam/roles${role.id ? `/${role.id}` : ''}`, {
        method: role.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role)
      })
      
      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)
      
      if (response.ok) {
        toast.success('Роль сохранена')
        setShowRoleForm(false)
        setEditingRole(null)
        loadData()
      } else {
        throw new Error(`Ошибка сохранения: ${responseData.error || response.statusText}`)
      }
    } catch (error) {
      console.error('Error saving role:', error)
      toast.error(`Ошибка сохранения роли: ${error.message}`)
    }
  }

  const createRole = async (roleData: Partial<Role>) => {
    // Валидация
    if (!roleData.name || !roleData.name.trim()) {
      toast.error('Название роли обязательно')
      return
    }
    
    if (!roleData.id || !roleData.id.trim()) {
      toast.error('ID роли обязателен')
      return
    }
    
    const role: Role = {
      id: roleData.id.trim(),
      name: roleData.name.trim(),
      description: roleData.description || '',
      permissions: roleData.permissions || [],
      users_count: 0
    }
    
    console.log('Creating role:', role)
    await saveRole(role)
    setNewRole({
      name: '',
      id: '',
      description: '',
      permissions: []
    })
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/iam/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Пользователь удален')
        loadData()
      } else {
        throw new Error('Ошибка удаления')
      }
    } catch (error) {
      toast.error('Ошибка удаления пользователя')
    }
  }

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter)
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesRole && matchesDepartment
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Загрузка данных IAM...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IAM - Управление доступом</h1>
          <p className="text-muted-foreground">Управление пользователями, ролями и разрешениями</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="roles">Роли</TabsTrigger>
          <TabsTrigger value="permissions">Разрешения</TabsTrigger>
          <TabsTrigger value="laboratories">Лаборатории</TabsTrigger>
          <TabsTrigger value="audit">Аудит</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Пользователи</CardTitle>
                  <CardDescription>Управление пользователями системы</CardDescription>
                </div>
                <Button onClick={() => {
                  setNewUser({
                    name: '',
                    email: '',
                    department: '',
                    roles: [],
                    assigned_labs: [],
                    status: 'Active'
                  })
                  setEditingUser(null)
                  setShowUserForm(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить пользователя
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Фильтры */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Поиск по имени или email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="inactive">Неактивные</SelectItem>
                    <SelectItem value="suspended">Заблокированные</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все роли</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Таблица пользователей */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Подразделение</TableHead>
                    <TableHead>Роли</TableHead>
                    <TableHead>Лаборатории</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.assigned_labs?.length || 0} лабораторий
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'Active' ? 'default' : 'secondary'}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.last_login || 'Никогда'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingUser(user)
                              setShowUserForm(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Роли</CardTitle>
                  <CardDescription>Управление ролями и их разрешениями</CardDescription>
                </div>
                <Button onClick={() => {
                  setNewRole({
                    name: '',
                    id: '',
                    description: '',
                    permissions: []
                  })
                  setEditingRole(null)
                  setShowRoleForm(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить роль
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{role.name}</h4>
                        <Badge variant="outline">{role.users_count} пользователей</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.slice(0, 3).map(permission => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 3} еще
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingRole(role)
                          setShowRoleForm(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Разрешения</CardTitle>
              <CardDescription>Список всех разрешений в системе</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Разрешение</TableHead>
                    <TableHead>Ресурс</TableHead>
                    <TableHead>Действие</TableHead>
                    <TableHead>Описание</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell>{permission.resource}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{permission.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {permission.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laboratories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Доступ к лабораториям</CardTitle>
              <CardDescription>Управление доступом пользователей к лабораториям</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {laboratories.map((lab) => (
                  <div key={lab.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{lab.name}</h4>
                        <Badge variant="outline">{lab.members} участников</Badge>
                        <Badge variant="secondary">{lab.visibility}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lab.department} • Владелец: {lab.owner}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        Управление доступом
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Аудит логи</CardTitle>
              <CardDescription>Лог всех критических действий в системе</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Время</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Действие</TableHead>
                    <TableHead>Ресурс</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.action}</div>
                          <div className="text-xs text-muted-foreground">{log.details}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{log.resource_type}</div>
                          <div className="text-xs text-muted-foreground">{log.resource_id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono">{log.ip_address}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.status === 'Success' ? 'default' : 'destructive'}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Форма пользователя */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user_name">Имя</Label>
                  <Input
                    id="user_name"
                    value={editingUser?.name || newUser.name || ''}
                    onChange={(e) => {
                      if (editingUser) {
                        setEditingUser(prev => prev ? {...prev, name: e.target.value} : null)
                      } else {
                        setNewUser(prev => ({...prev, name: e.target.value}))
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="user_email">Email</Label>
                  <Input
                    id="user_email"
                    type="email"
                    value={editingUser?.email || newUser.email || ''}
                    onChange={(e) => {
                      if (editingUser) {
                        setEditingUser(prev => prev ? {...prev, email: e.target.value} : null)
                      } else {
                        setNewUser(prev => ({...prev, email: e.target.value}))
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="user_department">Подразделение</Label>
                  <Select
                    value={editingUser?.department || newUser.department || ''}
                    onValueChange={(value) => {
                      if (editingUser) {
                        setEditingUser(prev => prev ? {...prev, department: value} : null)
                      } else {
                        setNewUser(prev => ({...prev, department: value}))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите подразделение" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Marketing">Маркетинг</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Финансы</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="user_status">Статус</Label>
                  <Select
                    value={editingUser?.status || newUser.status || 'Active'}
                    onValueChange={(value) => {
                      if (editingUser) {
                        setEditingUser(prev => prev ? {...prev, status: value as any} : null)
                      } else {
                        setNewUser(prev => ({...prev, status: value as any}))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Активный</SelectItem>
                      <SelectItem value="Inactive">Неактивный</SelectItem>
                      <SelectItem value="Suspended">Заблокированный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Роли</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {roles.map(role => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role_${role.id}`}
                        checked={editingUser?.roles.includes(role.name) || newUser.roles?.includes(role.name) || false}
                        onCheckedChange={(checked) => {
                          if (editingUser) {
                            const newRoles = checked 
                              ? [...editingUser.roles, role.name]
                              : editingUser.roles.filter(r => r !== role.name)
                            setEditingUser({...editingUser, roles: newRoles})
                          } else {
                            const currentRoles = newUser.roles || []
                            const newRoles = checked 
                              ? [...currentRoles, role.name]
                              : currentRoles.filter(r => r !== role.name)
                            setNewUser({...newUser, roles: newRoles})
                          }
                        }}
                      />
                      <Label htmlFor={`role_${role.id}`} className="text-sm">
                        {role.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Назначенные лаборатории</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {laboratories.map(lab => (
                    <div key={lab.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lab_${lab.id}`}
                        checked={editingUser?.assigned_labs?.includes(lab.name) || newUser.assigned_labs?.includes(lab.name) || false}
                        onCheckedChange={(checked) => {
                          if (editingUser) {
                            const currentLabs = editingUser.assigned_labs || []
                            const newLabs = checked 
                              ? [...currentLabs, lab.name]
                              : currentLabs.filter(l => l !== lab.name)
                            setEditingUser({...editingUser, assigned_labs: newLabs})
                          } else {
                            const currentLabs = newUser.assigned_labs || []
                            const newLabs = checked 
                              ? [...currentLabs, lab.name]
                              : currentLabs.filter(l => l !== lab.name)
                            setNewUser({...newUser, assigned_labs: newLabs})
                          }
                        }}
                      />
                      <Label htmlFor={`lab_${lab.id}`} className="text-sm">
                        {lab.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowUserForm(false)
                    setEditingUser(null)
                    setNewUser({
                      name: '',
                      email: '',
                      department: '',
                      roles: [],
                      assigned_labs: [],
                      status: 'Active'
                    })
                  }}
                >
                  Отмена
                </Button>
                <Button 
                  onClick={() => {
                    if (editingUser) {
                      saveUser(editingUser)
                    } else {
                      createUser(newUser)
                    }
                  }}
                  disabled={editingUser ? (!editingUser?.name || !editingUser?.email) : (!newUser.name || !newUser.email)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingUser ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Форма роли */}
      {showRoleForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingRole ? 'Редактировать роль' : 'Добавить роль'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role_name">Название роли</Label>
                  <Input
                    id="role_name"
                    value={editingRole?.name || newRole.name || ''}
                    onChange={(e) => {
                      if (editingRole) {
                        setEditingRole(prev => prev ? {...prev, name: e.target.value} : null)
                      } else {
                        setNewRole(prev => ({...prev, name: e.target.value}))
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="role_id">ID роли</Label>
                  <Input
                    id="role_id"
                    value={editingRole?.id || newRole.id || ''}
                    onChange={(e) => {
                      if (editingRole) {
                        setEditingRole(prev => prev ? {...prev, id: e.target.value} : null)
                      } else {
                        setNewRole(prev => ({...prev, id: e.target.value}))
                      }
                    }}
                    disabled={!!editingRole}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="role_description">Описание</Label>
                <Textarea
                  id="role_description"
                  value={editingRole?.description || newRole.description || ''}
                  onChange={(e) => {
                    if (editingRole) {
                      setEditingRole(prev => prev ? {...prev, description: e.target.value} : null)
                    } else {
                      setNewRole(prev => ({...prev, description: e.target.value}))
                    }
                  }}
                />
              </div>

              <div>
                <Label>Разрешения</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {permissions.map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`perm_${permission.id}`}
                        checked={editingRole?.permissions.includes(permission.name) || newRole.permissions?.includes(permission.name) || false}
                        onCheckedChange={(checked) => {
                          if (editingRole) {
                            const newPermissions = checked 
                              ? [...editingRole.permissions, permission.name]
                              : editingRole.permissions.filter(p => p !== permission.name)
                            setEditingRole({...editingRole, permissions: newPermissions})
                          } else {
                            const currentPermissions = newRole.permissions || []
                            const newPermissions = checked 
                              ? [...currentPermissions, permission.name]
                              : currentPermissions.filter(p => p !== permission.name)
                            setNewRole({...newRole, permissions: newPermissions})
                          }
                        }}
                      />
                      <Label htmlFor={`perm_${permission.id}`} className="text-sm">
                        {permission.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowRoleForm(false)
                    setEditingRole(null)
                    setNewRole({
                      name: '',
                      id: '',
                      description: '',
                      permissions: []
                    })
                  }}
                >
                  Отмена
                </Button>
                <Button 
                  onClick={() => {
                    if (editingRole) {
                      saveRole(editingRole)
                    } else {
                      createRole(newRole)
                    }
                  }}
                  disabled={editingRole ? (!editingRole?.name || !editingRole?.id) : (!newRole.name?.trim() || !newRole.id?.trim())}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingRole ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
