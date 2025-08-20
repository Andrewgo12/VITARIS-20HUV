import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Save,
  X,
  CheckCircle,
  User,
  Stethoscope,
  Settings,
  Eye,
  Edit,
  Trash2,
  FileText,
  Users,
  Activity,
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'medical_evaluator' | 'vital_red_admin';
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAssign: (roleData: {
    role: 'medical_evaluator' | 'vital_red_admin';
    customPermissions: string[];
  }) => void;
}

export default function RoleAssignmentModal({
  isOpen,
  onClose,
  user,
  onAssign,
}: RoleAssignmentModalProps) {
  const [selectedRole, setSelectedRole] = useState<'medical_evaluator' | 'vital_red_admin'>('medical_evaluator');
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      // Load current custom permissions (simulated)
      setCustomPermissions([]);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onAssign({
        role: selectedRole,
        customPermissions,
      });
    } catch (error) {
      console.error('Error assigning role:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setCustomPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'medical_evaluator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vital_red_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'medical_evaluator': return <Stethoscope className="w-5 h-5" />;
      case 'vital_red_admin': return <Shield className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getRolePermissions = (role: string): Permission[] => {
    if (role === 'medical_evaluator') {
      return [
        { id: 'read_cases', name: 'Ver casos médicos', description: 'Acceso a la bandeja de casos médicos', category: 'Casos' },
        { id: 'evaluate_cases', name: 'Evaluar casos', description: 'Tomar decisiones sobre traslados médicos', category: 'Casos' },
        { id: 'add_observations', name: 'Añadir observaciones', description: 'Agregar comentarios y observaciones a casos', category: 'Casos' },
        { id: 'request_info', name: 'Solicitar información', description: 'Pedir información adicional a médicos remitentes', category: 'Casos' },
        { id: 'view_history', name: 'Ver historial', description: 'Acceso al historial de casos y decisiones', category: 'Casos' },
        { id: 'view_files', name: 'Ver archivos', description: 'Acceso a archivos adjuntos de casos', category: 'Archivos' },
        { id: 'download_files', name: 'Descargar archivos', description: 'Descargar documentos médicos', category: 'Archivos' },
      ];
    } else {
      return [
        { id: 'manage_users', name: 'Gestionar usuarios', description: 'Crear, editar y eliminar usuarios del sistema', category: 'Usuarios' },
        { id: 'reset_passwords', name: 'Restablecer contraseñas', description: 'Cambiar contraseñas de otros usuarios', category: 'Usuarios' },
        { id: 'assign_roles', name: 'Asignar roles', description: 'Modificar roles y permisos de usuarios', category: 'Usuarios' },
        { id: 'view_user_activity', name: 'Ver actividad de usuarios', description: 'Monitorear actividad y logs de usuarios', category: 'Usuarios' },
        { id: 'supervise_decisions', name: 'Supervisar decisiones', description: 'Monitorear decisiones médicas tomadas', category: 'Supervisión' },
        { id: 'view_statistics', name: 'Ver estadísticas', description: 'Acceso a métricas y reportes del sistema', category: 'Supervisión' },
        { id: 'export_reports', name: 'Exportar reportes', description: 'Generar y descargar reportes del sistema', category: 'Supervisión' },
        { id: 'system_config', name: 'Configurar sistema', description: 'Modificar configuraciones generales', category: 'Sistema' },
        { id: 'manage_templates', name: 'Gestionar plantillas', description: 'Crear y editar plantillas de respuesta', category: 'Sistema' },
        { id: 'ai_config', name: 'Configurar IA', description: 'Ajustar parámetros del módulo de IA', category: 'Sistema' },
        { id: 'backup_management', name: 'Gestionar respaldos', description: 'Crear y restaurar respaldos del sistema', category: 'Sistema' },
        { id: 'view_logs', name: 'Ver logs del sistema', description: 'Acceso a logs y auditoría del sistema', category: 'Sistema' },
      ];
    }
  };

  const getPermissionsByCategory = (permissions: Permission[]) => {
    const categories = [...new Set(permissions.map(p => p.category))];
    return categories.map(category => ({
      category,
      permissions: permissions.filter(p => p.category === category)
    }));
  };

  const rolePermissions = getRolePermissions(selectedRole);
  const permissionsByCategory = getPermissionsByCategory(rolePermissions);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Casos': return <FileText className="w-4 h-4" />;
      case 'Archivos': return <FileText className="w-4 h-4" />;
      case 'Usuarios': return <Users className="w-4 h-4" />;
      case 'Supervisión': return <Activity className="w-4 h-4" />;
      case 'Sistema': return <Settings className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-600" />
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Asignación de Rol y Permisos
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {user.firstName} {user.lastName} - {user.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current User Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-blue-700">
                    <span>{user.email}</span>
                    <Badge className={getRoleColor(user.role)}>
                      Rol actual: {user.role === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar rol</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['medical_evaluator', 'vital_red_admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === role
                      ? getRoleColor(role) + ' border-current'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRoleIcon(role)}
                    <div className="text-left">
                      <h4 className="font-medium">
                        {role === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador del Sistema'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {role === 'medical_evaluator' 
                          ? 'Evaluación y decisión sobre casos médicos'
                          : 'Gestión completa del sistema VITAL RED'
                        }
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Permisos del rol: {selectedRole === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}
            </h3>
            <div className="space-y-4">
              {permissionsByCategory.map(({ category, permissions }) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {getCategoryIcon(category)}
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50"
                        >
                          <div className="mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm">
                              {permission.name}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Permissions (Advanced) */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-yellow-900">
                <Settings className="w-5 h-5" />
                Permisos Personalizados (Avanzado)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800 mb-4">
                Los permisos personalizados permiten ajustar el acceso específico más allá del rol base. 
                Use con precaución ya que puede afectar la funcionalidad del sistema.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'emergency_override', name: 'Anulación de emergencia', description: 'Capacidad de anular decisiones en emergencias' },
                  { id: 'bulk_operations', name: 'Operaciones masivas', description: 'Realizar acciones en lote sobre múltiples casos' },
                  { id: 'advanced_reports', name: 'Reportes avanzados', description: 'Acceso a reportes detallados y análisis' },
                  { id: 'api_access', name: 'Acceso API', description: 'Usar la API del sistema para integraciones' },
                ].map((permission) => (
                  <div
                    key={permission.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      customPermissions.includes(permission.id)
                        ? 'border-yellow-400 bg-yellow-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => togglePermission(permission.id)}
                  >
                    <input
                      type="checkbox"
                      checked={customPermissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 text-sm">
                        {permission.name}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Resumen de cambios</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Usuario:</span>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Rol actual:</span>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Nuevo rol:</span>
                  <Badge className={getRoleColor(selectedRole)}>
                    {selectedRole === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}
                  </Badge>
                  {selectedRole !== user.role && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Cambio detectado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Permisos base:</span>
                  <span>{rolePermissions.length} permisos incluidos</span>
                </div>
                {customPermissions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Permisos personalizados:</span>
                    <span>{customPermissions.length} permisos adicionales</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
