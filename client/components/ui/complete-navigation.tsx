import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Users,
  Heart,
  Activity,
  Calendar,
  FileText,
  Package,
  DollarSign,
  Video,
  Shield,
  Settings,
  TrendingUp,
  MonitorSpeaker,
  Stethoscope,
  Pill,
  Building2,
  Clock,
  AlertTriangle,
  BarChart3,
  Database,
  Bell,
  Eye,
  Lock,
  Smartphone,
  Globe,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  hoverColor: string;
  route: string;
  category: 'medical' | 'admin' | 'system';
  isNew?: boolean;
  isPopular?: boolean;
}

const CompleteNavigation: React.FC = () => {
  const navigate = useNavigate();

  const modules: NavigationModule[] = [
    // Medical Modules
    {
      id: 'patients',
      title: 'Gestión de Pacientes',
      description: 'Registro y seguimiento completo de pacientes',
      icon: User,
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50',
      route: '/patient-detail/new',
      category: 'medical',
      isPopular: true
    },
    {
      id: 'admissions',
      title: 'Admisiones',
      description: 'Control de ingresos hospitalarios',
      icon: Building2,
      color: 'text-green-600',
      hoverColor: 'hover:bg-green-50',
      route: '/medical/admissions',
      category: 'medical'
    },
    {
      id: 'icu',
      title: 'Monitoreo UCI',
      description: 'Unidad de cuidados intensivos',
      icon: MonitorSpeaker,
      color: 'text-red-600',
      hoverColor: 'hover:bg-red-50',
      route: '/medical/icu-monitoring',
      category: 'medical'
    },
    {
      id: 'surgeries',
      title: 'Cirugías',
      description: 'Programación y seguimiento quirúrgico',
      icon: Activity,
      color: 'text-purple-600',
      hoverColor: 'hover:bg-purple-50',
      route: '/medical/surgeries',
      category: 'medical'
    },
    {
      id: 'labs',
      title: 'Laboratorios',
      description: 'Resultados y análisis clínicos',
      icon: FileText,
      color: 'text-orange-600',
      hoverColor: 'hover:bg-orange-50',
      route: '/medical/labs-imaging',
      category: 'medical'
    },
    {
      id: 'pharmacy',
      title: 'Farmacia',
      description: 'Gestión de medicamentos',
      icon: Pill,
      color: 'text-cyan-600',
      hoverColor: 'hover:bg-cyan-50',
      route: '/medical/pharmacy',
      category: 'medical'
    },
    {
      id: 'inventory',
      title: 'Inventario Médico',
      description: 'Control de suministros hospitalarios',
      icon: Package,
      color: 'text-teal-600',
      hoverColor: 'hover:bg-teal-50',
      route: '/medical/inventory',
      category: 'medical',
      isNew: true
    },
    {
      id: 'billing',
      title: 'Facturación',
      description: 'Sistema de facturación y pagos',
      icon: DollarSign,
      color: 'text-emerald-600',
      hoverColor: 'hover:bg-emerald-50',
      route: '/medical/billing',
      category: 'medical',
      isNew: true
    },
    {
      id: 'telemedicine',
      title: 'Telemedicina',
      description: 'Consultas médicas virtuales',
      icon: Video,
      color: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-50',
      route: '/medical/telemedicine-console',
      category: 'medical',
      isNew: true
    },
    {
      id: 'appointments',
      title: 'Citas Médicas',
      description: 'Programación de citas',
      icon: Calendar,
      color: 'text-pink-600',
      hoverColor: 'hover:bg-pink-50',
      route: '/medical/appointments',
      category: 'medical'
    },
    {
      id: 'consultations',
      title: 'Consultas',
      description: 'Hub de consultas médicas',
      icon: Stethoscope,
      color: 'text-violet-600',
      hoverColor: 'hover:bg-violet-50',
      route: '/medical/consultations',
      category: 'medical'
    },
    {
      id: 'emergency',
      title: 'Protocolos de Emergencia',
      description: 'Gestión de emergencias médicas',
      icon: AlertTriangle,
      color: 'text-red-500',
      hoverColor: 'hover:bg-red-50',
      route: '/medical/emergency-protocols',
      category: 'medical'
    },

    // Administrative Modules
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'Administración de personal',
      icon: Users,
      color: 'text-gray-600',
      hoverColor: 'hover:bg-gray-50',
      route: '/admin/users',
      category: 'admin'
    },
    {
      id: 'audit',
      title: 'Logs de Auditoría',
      description: 'Seguimiento y trazabilidad',
      icon: Eye,
      color: 'text-slate-600',
      hoverColor: 'hover:bg-slate-50',
      route: '/admin/audit-logs',
      category: 'admin',
      isNew: true
    },
    {
      id: 'quality',
      title: 'Métricas de Calidad',
      description: 'Indicadores de calidad hospitalaria',
      icon: TrendingUp,
      color: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-50',
      route: '/admin/quality-metrics',
      category: 'admin',
      isNew: true
    },
    {
      id: 'reports',
      title: 'Reportes Médicos',
      description: 'Informes y estadísticas',
      icon: BarChart3,
      color: 'text-blue-500',
      hoverColor: 'hover:bg-blue-50',
      route: '/medical/reports',
      category: 'admin'
    },

    // System Modules
    {
      id: 'system-config',
      title: 'Configuración del Sistema',
      description: 'Administración del sistema',
      icon: Settings,
      color: 'text-gray-500',
      hoverColor: 'hover:bg-gray-50',
      route: '/admin/system-config',
      category: 'system',
      isNew: true
    },
    {
      id: 'metrics',
      title: 'Métricas en Tiempo Real',
      description: 'Dashboard de métricas',
      icon: Activity,
      color: 'text-green-500',
      hoverColor: 'hover:bg-green-50',
      route: '/real-time-metrics',
      category: 'system',
      isPopular: true
    },
    {
      id: 'notifications',
      title: 'Sistema de Notificaciones',
      description: 'Centro de notificaciones',
      icon: Bell,
      color: 'text-orange-500',
      hoverColor: 'hover:bg-orange-50',
      route: '/notifications',
      category: 'system'
    },
    {
      id: 'backup',
      title: 'Backup y Recuperación',
      description: 'Respaldo del sistema',
      icon: Database,
      color: 'text-purple-500',
      hoverColor: 'hover:bg-purple-50',
      route: '/admin/backup',
      category: 'system'
    }
  ];

  const medicalModules = modules.filter(m => m.category === 'medical');
  const adminModules = modules.filter(m => m.category === 'admin');
  const systemModules = modules.filter(m => m.category === 'system');

  const ModuleCard: React.FC<{ module: NavigationModule }> = ({ module }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="outline"
        className={`h-24 w-full flex flex-col items-center justify-center gap-2 relative ${module.hoverColor} border-2`}
        onClick={() => navigate(module.route)}
      >
        {module.isNew && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1">
            Nuevo
          </Badge>
        )}
        {module.isPopular && (
          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
            Popular
          </Badge>
        )}
        <module.icon className={`w-6 h-6 ${module.color}`} />
        <span className="text-sm font-medium text-center leading-tight">
          {module.title}
        </span>
      </Button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Medical Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Módulos Médicos
            <Badge variant="outline" className="ml-2">
              {medicalModules.length} módulos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {medicalModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Administrative Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Módulos Administrativos
            <Badge variant="outline" className="ml-2">
              {adminModules.length} módulos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {adminModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Módulos del Sistema
            <Badge variant="outline" className="ml-2">
              {systemModules.length} módulos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {systemModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Estadísticas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{modules.length}</div>
              <div className="text-sm text-gray-600">Módulos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{medicalModules.length}</div>
              <div className="text-sm text-gray-600">Módulos Médicos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{adminModules.length}</div>
              <div className="text-sm text-gray-600">Módulos Admin</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{systemModules.length}</div>
              <div className="text-sm text-gray-600">Módulos Sistema</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteNavigation;
