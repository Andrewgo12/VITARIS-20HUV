"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Key,
  UserCheck,
  UserX,
  Shield,
  Eye,
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  User,
  Activity,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedStat, setSelectedStat] = useState<any>(null)
  const [newComment, setNewComment] = useState("")

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    role: "medico",
    specialty: "",
    phone: "",
  })

  const users = [
    {
      id: 1,
      name: "Dr. Carlos Rodríguez",
      email: "carlos.rodriguez@hospital.com",
      username: "crodriguez",
      role: "medico",
      specialty: "Cardiología",
      status: "Activo",
      lastLogin: "2024-01-15 14:30",
      casesEvaluated: 156,
      phone: "+57 300 123 4567",
      createdAt: "2023-06-15",
      avgResponseTime: "2.3 horas",
      successRate: "94%",
      comments: [
        { id: 1, text: "Excelente médico, muy dedicado", author: "Admin", date: "2024-01-10" },
        { id: 2, text: "Responde rápidamente a los casos", author: "Dr. González", date: "2024-01-05" },
      ],
      performance: {
        casesThisMonth: 23,
        avgRating: 4.8,
        completionRate: 98,
        urgentCases: 12,
      },
    },
    {
      id: 2,
      name: "Dra. María González",
      email: "maria.gonzalez@hospital.com",
      username: "mgonzalez",
      role: "medico",
      specialty: "Neurología",
      status: "Activo",
      lastLogin: "2024-01-15 13:45",
      casesEvaluated: 203,
      phone: "+57 301 987 6543",
      createdAt: "2023-05-20",
      avgResponseTime: "1.8 horas",
      successRate: "96%",
      comments: [{ id: 1, text: "Especialista muy competente", author: "Admin", date: "2024-01-12" }],
      performance: {
        casesThisMonth: 31,
        avgRating: 4.9,
        completionRate: 99,
        urgentCases: 8,
      },
    },
    {
      id: 3,
      name: "Dr. Luis Martínez",
      email: "luis.martinez@hospital.com",
      username: "lmartinez",
      role: "medico",
      specialty: "Ginecología",
      status: "Inactivo",
      lastLogin: "2024-01-10 09:20",
      casesEvaluated: 89,
      phone: "+57 302 456 7890",
      createdAt: "2023-08-10",
      avgResponseTime: "3.1 horas",
      successRate: "89%",
      comments: [],
      performance: {
        casesThisMonth: 0,
        avgRating: 4.2,
        completionRate: 85,
        urgentCases: 0,
      },
    },
    {
      id: 4,
      name: "Admin Sistema",
      email: "admin@hospital.com",
      username: "admin",
      role: "admin",
      specialty: "N/A",
      status: "Activo",
      lastLogin: "2024-01-15 16:00",
      casesEvaluated: 0,
      phone: "+57 310 111 2222",
      createdAt: "2023-01-01",
      avgResponseTime: "N/A",
      successRate: "N/A",
      comments: [],
      performance: {
        casesThisMonth: 0,
        avgRating: 5.0,
        completionRate: 100,
        urgentCases: 0,
      },
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300"
      case "medico":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
      case "Inactivo":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    console.log("Creating user:", newUser)
    setIsCreateDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      username: "",
      role: "medico",
      specialty: "",
      phone: "",
    })
  }

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleCommentUser = (user: any) => {
    setSelectedUser(user)
    setIsCommentDialogOpen(true)
  }

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleStatsClick = (statType: string, value: any) => {
    setSelectedStat({
      type: statType,
      value,
      users: users.filter((u) => {
        switch (statType) {
          case "total":
            return true
          case "active":
            return u.role === "medico" && u.status === "Activo"
          case "inactive":
            return u.status === "Inactivo"
          case "admin":
            return u.role === "admin"
          default:
            return true
        }
      }),
    })
    setIsStatsDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting user:", selectedUser?.id)
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const addComment = () => {
    if (newComment.trim()) {
      console.log("Adding comment:", newComment, "to user:", selectedUser?.id)
      setNewComment("")
      setIsCommentDialogOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestión de Usuarios" userRole="admin" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-blue-200"
                onClick={() => handleStatsClick("total", users.length)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Usuarios</p>
                      <p className="text-2xl font-bold text-blue-700">{users.length}</p>
                      <p className="text-xs text-blue-600 mt-1">Click para detalles</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-green-50 border-green-200"
                onClick={() =>
                  handleStatsClick("active", users.filter((u) => u.role === "medico" && u.status === "Activo").length)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Médicos Activos</p>
                      <p className="text-2xl font-bold text-green-700">
                        {users.filter((u) => u.role === "medico" && u.status === "Activo").length}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Click para detalles</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <UserCheck className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-red-50 border-red-200"
                onClick={() => handleStatsClick("inactive", users.filter((u) => u.status === "Inactivo").length)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Usuarios Inactivos</p>
                      <p className="text-2xl font-bold text-red-700">
                        {users.filter((u) => u.status === "Inactivo").length}
                      </p>
                      <p className="text-xs text-red-600 mt-1">Click para detalles</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <UserX className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-purple-50 border-purple-200"
                onClick={() => handleStatsClick("admin", users.filter((u) => u.role === "admin").length)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Administradores</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {users.filter((u) => u.role === "admin").length}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">Click para detalles</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-white to-slate-50 border-slate-200 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Search className="h-5 w-5 text-emerald-600" />
                      Filtros de Búsqueda
                    </CardTitle>
                    <CardDescription>Busque y filtre usuarios del sistema</CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                        <DialogDescription>Complete la información del nuevo usuario del sistema</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Usuario
                          </Label>
                          <Input
                            id="username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right">
                            Rol
                          </Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medico">Médico Evaluador</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newUser.role === "medico" && (
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="specialty" className="text-right">
                              Especialidad
                            </Label>
                            <Input
                              id="specialty"
                              value={newUser.specialty}
                              onChange={(e) => setNewUser({ ...newUser, specialty: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">
                            Teléfono
                          </Label>
                          <Input
                            id="phone"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleCreateUser}>
                          Crear Usuario
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Búsqueda</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Nombre, email, usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los roles</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="medico">Médico Evaluador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setRoleFilter("all")
                        setStatusFilter("all")
                      }}
                      className="w-full bg-transparent hover:bg-slate-100"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-white to-slate-50 border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Usuarios del Sistema ({filteredUsers.length} de {users.length})
                </CardTitle>
                <CardDescription>Gestione usuarios, roles y permisos del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200">
                        <TableHead className="font-semibold text-slate-700">Usuario</TableHead>
                        <TableHead className="font-semibold text-slate-700">Rol</TableHead>
                        <TableHead className="font-semibold text-slate-700">Especialidad</TableHead>
                        <TableHead className="font-semibold text-slate-700">Estado</TableHead>
                        <TableHead className="font-semibold text-slate-700">Casos Evaluados</TableHead>
                        <TableHead className="font-semibold text-slate-700">Último Acceso</TableHead>
                        <TableHead className="font-semibold text-slate-700">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-all duration-300"
                          onClick={() => handleViewUser(user)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{user.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />@{user.username}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getRoleColor(user.role)} border transition-all duration-300 hover:scale-105`}
                            >
                              {user.role === "admin" ? "Administrador" : "Médico Evaluador"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-slate-700">{user.specialty}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(user.status)} border transition-all duration-300 hover:scale-105`}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-medium text-slate-800">{user.casesEvaluated}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-slate-700">{user.lastLogin}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUser(user)}
                                className="hover:bg-blue-100 hover:border-blue-300 transition-all duration-300"
                                title="Ver detalles"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                                className="hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300"
                                title="Editar usuario"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCommentUser(user)}
                                className="hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-300"
                                title="Agregar comentario"
                              >
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => console.log("Reset password:", user.id)}
                                className="hover:bg-purple-100 hover:border-purple-300 transition-all duration-300"
                                title="Resetear contraseña"
                              >
                                <Key className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => console.log("Toggle status:", user.id)}
                                className={`transition-all duration-300 ${user.status === "Activo" ? "hover:bg-red-100 hover:border-red-300 text-red-600" : "hover:bg-green-100 hover:border-green-300 text-green-600"}`}
                                title={user.status === "Activo" ? "Desactivar" : "Activar"}
                              >
                                {user.status === "Activo" ? (
                                  <UserX className="h-3 w-3" />
                                ) : (
                                  <UserCheck className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-300"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Detail Modal */}
          <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Detalles de Estadística
                </DialogTitle>
                <DialogDescription>
                  Información detallada sobre{" "}
                  {selectedStat?.type === "total"
                    ? "todos los usuarios"
                    : selectedStat?.type === "active"
                      ? "médicos activos"
                      : selectedStat?.type === "inactive"
                        ? "usuarios inactivos"
                        : "administradores"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-sm text-blue-600">Total de usuarios</p>
                    <p className="text-2xl font-bold text-blue-800">{selectedStat?.users?.length || 0}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                    <p className="text-sm text-emerald-600">Casos evaluados</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      {selectedStat?.users?.reduce((sum: number, user: any) => sum + user.casesEvaluated, 0) || 0}
                    </p>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Casos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStat?.users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role === "admin" ? "Admin" : "Médico"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.casesEvaluated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* User Detail View Modal */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Detalles del Usuario
                </DialogTitle>
                <DialogDescription>Información completa del usuario seleccionado</DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-6">
                  {/* User Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {selectedUser.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-800">{selectedUser.name}</h3>
                          <p className="text-sm text-blue-600">@{selectedUser.username}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm text-emerald-800">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm text-emerald-800">{selectedUser.phone}</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Role and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <p className="text-sm text-purple-600">Rol</p>
                      <Badge className={getRoleColor(selectedUser.role)}>
                        {selectedUser.role === "admin" ? "Administrador" : "Médico Evaluador"}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                      <p className="text-sm text-yellow-600">Especialidad</p>
                      <p className="font-semibold text-yellow-800">{selectedUser.specialty}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <p className="text-sm text-green-600">Estado</p>
                      <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      Métricas de Rendimiento
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                        <p className="text-2xl font-bold text-blue-800">{selectedUser.casesEvaluated}</p>
                        <p className="text-xs text-blue-600">Casos Totales</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                        <p className="text-2xl font-bold text-emerald-800">{selectedUser.performance.casesThisMonth}</p>
                        <p className="text-xs text-emerald-600">Este Mes</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-800">{selectedUser.avgResponseTime}</p>
                        <p className="text-xs text-yellow-600">Tiempo Promedio</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                        <p className="text-2xl font-bold text-purple-800">{selectedUser.successRate}</p>
                        <p className="text-xs text-purple-600">Tasa de Éxito</p>
                      </div>
                    </div>
                  </Card>

                  {/* Comments Section */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      Comentarios ({selectedUser.comments.length})
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {selectedUser.comments.length > 0 ? (
                        selectedUser.comments.map((comment: any) => (
                          <div key={comment.id} className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                            <p className="text-sm text-slate-800">{comment.text}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-slate-600">Por: {comment.author}</span>
                              <span className="text-xs text-slate-500">{comment.date}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No hay comentarios disponibles</p>
                      )}
                    </div>
                  </Card>

                  {/* Activity Timeline */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      Información de Actividad
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded">
                        <span className="text-sm text-emerald-800">Último acceso:</span>
                        <span className="text-sm font-medium text-emerald-900">{selectedUser.lastLogin}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded">
                        <span className="text-sm text-blue-800">Fecha de creación:</span>
                        <span className="text-sm font-medium text-blue-900">{selectedUser.createdAt}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Comment Modal */}
          <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-yellow-600" />
                  Agregar Comentario
                </DialogTitle>
                <DialogDescription>Agregar un comentario sobre {selectedUser?.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="comment">Comentario</Label>
                  <Textarea
                    id="comment"
                    placeholder="Escriba su comentario aquí..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                {selectedUser?.comments && selectedUser.comments.length > 0 && (
                  <div>
                    <Label>Comentarios Existentes</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                      {selectedUser.comments.map((comment: any) => (
                        <div key={comment.id} className="p-2 bg-slate-50 rounded text-sm">
                          <p>{comment.text}</p>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{comment.author}</span>
                            <span>{comment.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addComment} disabled={!newComment.trim()}>
                  Agregar Comentario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  ¿Confirmar eliminación?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{" "}
                  <span className="font-semibold">{selectedUser?.name}</span> y todos sus datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  Eliminar Usuario
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  )
}
