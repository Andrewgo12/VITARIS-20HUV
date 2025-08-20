import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ArrowLeft,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Key,
  Activity,
  MoreVertical,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiService } from "@/services/api";
import { useNotifications } from "@/components/ui/notification-system";

// Import unique modals for this view
import UserCreationEditModal from "@/components/modals/user-management/UserCreationEditModal";
import PasswordResetModal from "@/components/modals/user-management/PasswordResetModal";
import RoleAssignmentModal from "@/components/modals/user-management/RoleAssignmentModal";
import UserActivityModal from "@/components/modals/user-management/UserActivityModal";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'medical_evaluator' | 'vital_red_admin';
  specialty?: string;
  licenseNumber?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  casesAssigned: number;
  casesCompleted: number;
  avgResponseTime: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUserCreationEdit, setShowUserCreationEdit] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
  const [showUserActivity, setShowUserActivity] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Real API call to get users
      const response = await apiService.getUsers();

      if (response.success && response.data) {
        // Convert API response to User format expected by frontend
        const users: User[] = response.data.map((userData: any) => ({
          id: userData.id.toString(),
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email,
          role: userData.role,
          specialty: userData.specialty || "General",
          licenseNumber: userData.licenseNumber || `VR-${userData.role.toUpperCase()}-${userData.id.toString().padStart(3, '0')}`,
          isActive: userData.isActive,
          lastLogin: userData.lastLogin,
          createdAt: userData.createdAt,
          casesAssigned: userData.casesAssigned || 0,
          casesCompleted: userData.casesCompleted || 0,
          avgResponseTime: userData.avgResponseTime || "0h 0m"
        }));

        setUsers(users);
      } else {
        throw new Error(response.error || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      addNotification({
        type: 'warning',
        title: 'Error cargando usuarios',
        message: 'No se pudieron cargar los usuarios. Intente nuevamente.',
        priority: 'medium'
      });

      // Fallback to empty array
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => 
        statusFilter === "active" ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setEditMode(false);
    setShowUserCreationEdit(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditMode(true);
    setShowUserCreationEdit(true);
  };

  const handlePasswordReset = (user: User) => {
    setSelectedUser(user);
    setShowPasswordReset(true);
  };

  const handleRoleAssignment = (user: User) => {
    setSelectedUser(user);
    setShowRoleAssignment(true);
  };

  const handleUserActivity = (user: User) => {
    setSelectedUser(user);
    setShowUserActivity(true);
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      // Simulate API call
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${user.firstName} ${user.lastName}?`)) {
      try {
        // Simulate API call
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'medical_evaluator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vital_red_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'medical_evaluator': return 'Médico Evaluador';
      case 'vital_red_admin': return 'Administrador';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (completed: number, assigned: number) => {
    const rate = assigned > 0 ? (completed / assigned) * 100 : 0;
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/vital-red/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">
                    VITAL <span className="text-red-500 font-light">RED</span>
                  </h1>
                  <p className="text-xs text-gray-500">Gestión de Usuarios</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => loadUsers()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={handleCreateUser}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o especialidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todos los roles</option>
                  <option value="medical_evaluator">Médicos Evaluadores</option>
                  <option value="vital_red_admin">Administradores</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                <p className="text-gray-600 mb-4">No se encontraron usuarios que coincidan con los filtros aplicados.</p>
                <Button onClick={handleCreateUser}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer usuario
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {user.firstName} {user.lastName}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span>{user.email}</span>
                                {user.specialty && <span>• {user.specialty}</span>}
                                {user.licenseNumber && <span>• {user.licenseNumber}</span>}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={getRoleColor(user.role)}>
                                {getRoleLabel(user.role)}
                              </Badge>
                              <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? "Activo" : "Inactivo"}
                              </Badge>
                            </div>
                          </div>

                          {user.role === 'medical_evaluator' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Casos asignados</p>
                                <p className="text-lg font-semibold text-gray-900">{user.casesAssigned}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Casos completados</p>
                                <p className={`text-lg font-semibold ${getPerformanceColor(user.casesCompleted, user.casesAssigned)}`}>
                                  {user.casesCompleted}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Tasa de completitud</p>
                                <p className={`text-lg font-semibold ${getPerformanceColor(user.casesCompleted, user.casesAssigned)}`}>
                                  {user.casesAssigned > 0 ? Math.round((user.casesCompleted / user.casesAssigned) * 100) : 0}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Tiempo promedio</p>
                                <p className="text-lg font-semibold text-gray-900">{user.avgResponseTime}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Último acceso: {formatDate(user.lastLogin)}</span>
                              <span>Creado: {formatDate(user.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserActivity(user)}
                              >
                                <Activity className="w-4 h-4 mr-2" />
                                Actividad
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePasswordReset(user)}
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Contraseña
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRoleAssignment(user)}
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Permisos
                              </Button>
                              <Button
                                variant={user.isActive ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm text-gray-600">Total usuarios</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
              <p className="text-sm text-gray-600">Usuarios activos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'medical_evaluator').length}</p>
              <p className="text-sm text-gray-600">Médicos evaluadores</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{users.filter(u => u.role === 'vital_red_admin').length}</p>
              <p className="text-sm text-gray-600">Administradores</p>
            </div>
          </div>
        </div>
      </main>

      {/* Unique Modals for this view */}
      <UserCreationEditModal
        isOpen={showUserCreationEdit}
        onClose={() => setShowUserCreationEdit(false)}
        user={selectedUser}
        isEditMode={editMode}
        onSave={(userData) => {
          console.log('User saved:', userData);
          setShowUserCreationEdit(false);
          loadUsers(); // Reload users
        }}
      />

      <PasswordResetModal
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
        user={selectedUser}
        onReset={(resetData) => {
          console.log('Password reset:', resetData);
          setShowPasswordReset(false);
        }}
      />

      <RoleAssignmentModal
        isOpen={showRoleAssignment}
        onClose={() => setShowRoleAssignment(false)}
        user={selectedUser}
        onAssign={(roleData) => {
          console.log('Role assigned:', roleData);
          setShowRoleAssignment(false);
          loadUsers(); // Reload users
        }}
      />

      <UserActivityModal
        isOpen={showUserActivity}
        onClose={() => setShowUserActivity(false)}
        user={selectedUser}
      />
    </div>
  );
}
