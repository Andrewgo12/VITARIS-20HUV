import React, { createContext, useContext, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Switch } from "./switch";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Shield,
  User,
  Users,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Crown,
  UserCheck,
  UserX,
  Key,
} from "lucide-react";

// Tipos para el sistema de permisos
export type Permission =
  | "read_patients"
  | "write_patients"
  | "delete_patients"
  | "read_medical_records"
  | "write_medical_records"
  | "read_appointments"
  | "write_appointments"
  | "cancel_appointments"
  | "read_medications"
  | "write_medications"
  | "prescribe_medications"
  | "read_reports"
  | "write_reports"
  | "admin_users"
  | "admin_system"
  | "emergency_access"
  | "financial_data"
  | "audit_logs";

export type Role =
  | "super_admin"
  | "admin"
  | "doctor"
  | "nurse"
  | "pharmacist"
  | "receptionist"
  | "technician"
  | "auditor"
  | "guest";

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  color: string;
  priority: number;
  isSystem: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  department?: string;
}

// Definición de roles del sistema
const systemRoles: Record<Role, UserRole> = {
  super_admin: {
    id: "super_admin",
    name: "Super Administrador",
    description: "Acceso completo al sistema",
    permissions: [
      "read_patients",
      "write_patients",
      "delete_patients",
      "read_medical_records",
      "write_medical_records",
      "read_appointments",
      "write_appointments",
      "cancel_appointments",
      "read_medications",
      "write_medications",
      "prescribe_medications",
      "read_reports",
      "write_reports",
      "admin_users",
      "admin_system",
      "emergency_access",
      "financial_data",
      "audit_logs",
    ],
    color: "red",
    priority: 1,
    isSystem: true,
  },
  admin: {
    id: "admin",
    name: "Administrador",
    description: "Administración del sistema y usuarios",
    permissions: [
      "read_patients",
      "write_patients",
      "read_medical_records",
      "write_medical_records",
      "read_appointments",
      "write_appointments",
      "cancel_appointments",
      "read_medications",
      "write_medications",
      "read_reports",
      "write_reports",
      "admin_users",
      "financial_data",
      "audit_logs",
    ],
    color: "orange",
    priority: 2,
    isSystem: true,
  },
  doctor: {
    id: "doctor",
    name: "Médico",
    description: "Acceso completo a información médica",
    permissions: [
      "read_patients",
      "write_patients",
      "read_medical_records",
      "write_medical_records",
      "read_appointments",
      "write_appointments",
      "read_medications",
      "write_medications",
      "prescribe_medications",
      "read_reports",
      "write_reports",
      "emergency_access",
    ],
    color: "blue",
    priority: 3,
    isSystem: true,
  },
  nurse: {
    id: "nurse",
    name: "Enfermero/a",
    description: "Cuidado de pacientes y administración de medicamentos",
    permissions: [
      "read_patients",
      "write_patients",
      "read_medical_records",
      "write_medical_records",
      "read_appointments",
      "read_medications",
      "write_medications",
      "read_reports",
    ],
    color: "green",
    priority: 4,
    isSystem: true,
  },
  pharmacist: {
    id: "pharmacist",
    name: "Farmacéutico",
    description: "Gestión de medicamentos y farmacia",
    permissions: [
      "read_patients",
      "read_medical_records",
      "read_medications",
      "write_medications",
      "read_reports",
    ],
    color: "purple",
    priority: 5,
    isSystem: true,
  },
  receptionist: {
    id: "receptionist",
    name: "Recepcionista",
    description: "Gestión de citas y información básica",
    permissions: [
      "read_patients",
      "write_patients",
      "read_appointments",
      "write_appointments",
    ],
    color: "cyan",
    priority: 6,
    isSystem: true,
  },
  technician: {
    id: "technician",
    name: "Técnico",
    description: "Soporte técnico y mantenimiento",
    permissions: ["read_patients", "read_appointments", "read_reports"],
    color: "gray",
    priority: 7,
    isSystem: true,
  },
  auditor: {
    id: "auditor",
    name: "Auditor",
    description: "Revisión y auditoría del sistema",
    permissions: [
      "read_patients",
      "read_medical_records",
      "read_appointments",
      "read_medications",
      "read_reports",
      "audit_logs",
    ],
    color: "yellow",
    priority: 8,
    isSystem: true,
  },
  guest: {
    id: "guest",
    name: "Invitado",
    description: "Acceso limitado de solo lectura",
    permissions: ["read_patients", "read_appointments"],
    color: "slate",
    priority: 9,
    isSystem: true,
  },
};

// Descripciones de permisos
const permissionDescriptions: Record<Permission, string> = {
  read_patients: "Ver información de pacientes",
  write_patients: "Crear y editar pacientes",
  delete_patients: "Eliminar pacientes",
  read_medical_records: "Ver historias clínicas",
  write_medical_records: "Crear y editar historias clínicas",
  read_appointments: "Ver citas médicas",
  write_appointments: "Crear y editar citas",
  cancel_appointments: "Cancelar citas médicas",
  read_medications: "Ver medicamentos",
  write_medications: "Gestionar inventario de medicamentos",
  prescribe_medications: "Prescribir medicamentos",
  read_reports: "Ver reportes",
  write_reports: "Crear y editar reportes",
  admin_users: "Administrar usuarios",
  admin_system: "Administrar sistema",
  emergency_access: "Acceso de emergencia",
  financial_data: "Ver datos financieros",
  audit_logs: "Ver logs de auditoría",
};

// Context para permisos
interface PermissionsContextType {
  currentUser: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  canAccess: (requiredPermissions: Permission[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

// Provider de permisos
export const PermissionsProvider: React.FC<{
  children: React.ReactNode;
  currentUser?: User;
}> = ({ children, currentUser = null }) => {
  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  const hasRole = (role: Role): boolean => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  const canAccess = (requiredPermissions: Permission[]): boolean => {
    if (!currentUser) return false;
    return requiredPermissions.every((permission) => hasPermission(permission));
  };

  return (
    <PermissionsContext.Provider
      value={{
        currentUser,
        hasPermission,
        hasRole,
        canAccess,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

// Componente para proteger rutas/componentes
export const ProtectedComponent: React.FC<{
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRole?: Role;
  fallback?: React.ReactNode;
}> = ({
  children,
  requiredPermissions = [],
  requiredRole,
  fallback = (
    <div className="text-center p-4 text-muted-foreground">
      No tienes permisos para ver este contenido
    </div>
  ),
}) => {
  const { hasRole, canAccess } = usePermissions();

  const hasAccess = () => {
    if (requiredRole && !hasRole(requiredRole)) return false;
    if (requiredPermissions.length > 0 && !canAccess(requiredPermissions))
      return false;
    return true;
  };

  return hasAccess() ? <>{children}</> : <>{fallback}</>;
};

// Componente de gestión de roles
export const RoleManager: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>("doctor");
  const [isEditing, setIsEditing] = useState(false);

  const role = systemRoles[selectedRole];

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "super_admin":
        return <Crown className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "doctor":
        return <UserCheck className="w-4 h-4" />;
      case "nurse":
        return <User className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getPermissionIcon = (permission: Permission) => {
    if (permission.includes("read")) return <Eye className="w-3 h-3" />;
    if (permission.includes("write")) return <Edit className="w-3 h-3" />;
    if (permission.includes("delete")) return <Trash2 className="w-3 h-3" />;
    if (permission.includes("admin")) return <Settings className="w-3 h-3" />;
    return <Key className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Roles</h3>
          <p className="text-sm text-muted-foreground">
            Administra roles y permisos del sistema
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Rol
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lista de roles */}
        <Card>
          <CardHeader>
            <CardTitle>Roles del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {Object.values(systemRoles).map((roleData) => (
                  <div
                    key={roleData.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRole === roleData.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedRole(roleData.id as Role)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(roleData.id as Role)}
                        <div>
                          <div className="font-medium">{roleData.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {roleData.permissions.length} permisos
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`bg-${roleData.color}-100`}
                      >
                        {roleData.isSystem ? "Sistema" : "Personalizado"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detalles del rol seleccionado */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getRoleIcon(selectedRole)}
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  Permisos ({role.permissions.length})
                </h4>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center justify-between p-2 rounded border"
                      >
                        <div className="flex items-center gap-2">
                          {getPermissionIcon(permission)}
                          <span className="text-sm">
                            {permissionDescriptions[permission]}
                          </span>
                        </div>
                        <Switch checked disabled />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span>Prioridad:</span>
                <Badge variant="outline">{role.priority}</Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Tipo:</span>
                <Badge variant={role.isSystem ? "default" : "secondary"}>
                  {role.isSystem ? "Sistema" : "Personalizado"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleManager;
