import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import CompleteNavigation from '@/components/ui/complete-navigation';
import { useNotifications } from '@/components/ui/notification-system';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  TrendingUp,
  Users,
  Activity,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Lock,
  Bell,
  Settings,
  Eye,
  Package,
  DollarSign,
  Video,
  Calendar,
  FileText,
  Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemStats {
  totalModules: number;
  activeUsers: number;
  patientsToday: number;
  systemUptime: string;
  lastUpdate: string;
  version: string;
}

interface RecentActivity {
  id: string;
  type: 'patient' | 'user' | 'system' | 'medical';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  icon: React.ComponentType<any>;
  color: string;
}

const CompleteSystemIndex: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setSystemStats({
          totalModules: 18,
          activeUsers: 247,
          patientsToday: 89,
          systemUptime: '15 días, 8 horas',
          lastUpdate: '2024-07-31 16:45:00',
          version: '2.0.0'
        });

        setRecentActivity([
          {
            id: '1',
            type: 'patient',
            title: 'Nuevo paciente registrado',
            description: 'Juan Carlos Pérez - Admisión UCI',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            user: 'Dr. Carlos Martínez',
            icon: Heart,
            color: 'text-red-500'
          },
          {
            id: '2',
            type: 'medical',
            title: 'Cirugía completada',
            description: 'Apendicectomía - Quirófano 3',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            user: 'Dr. Ana López',
            icon: Activity,
            color: 'text-green-500'
          },
          {
            id: '3',
            type: 'system',
            title: 'Backup automático',
            description: 'Backup completo del sistema realizado',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            user: 'Sistema',
            icon: Database,
            color: 'text-blue-500'
          },
          {
            id: '4',
            type: 'user',
            title: 'Nuevo usuario creado',
            description: 'Enf. Patricia Vega - Departamento UCI',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            user: 'Super Admin',
            icon: Users,
            color: 'text-purple-500'
          },
          {
            id: '5',
            type: 'medical',
            title: 'Consulta de telemedicina',
            description: 'Consulta virtual completada',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            user: 'Dr. Roberto Silva',
            icon: Video,
            color: 'text-indigo-500'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching system data:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los datos del sistema',
        priority: 'high'
      });
      setLoading(false);
    }
  };

  const getActivityIcon = (activity: RecentActivity) => {
    return <activity.icon className={`w-4 h-4 ${activity.color}`} />;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    
    const days = Math.floor(hours / 24);
    return `Hace ${days} días`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando sistema completo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            VITARIS <span className="text-red-500">Sistema Completo</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Acceso completo a todos los módulos del sistema hospitalario
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Sistema Operativo
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            v{systemStats?.version}
          </Badge>
        </div>
      </motion.div>

      {/* System Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {systemStats?.totalModules}
                </div>
                <div className="text-sm text-gray-600">Módulos Totales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {systemStats?.activeUsers}
                </div>
                <div className="text-sm text-gray-600">Usuarios Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {systemStats?.patientsToday}
                </div>
                <div className="text-sm text-gray-600">Pacientes Hoy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {systemStats?.systemUptime}
                </div>
                <div className="text-sm text-gray-600">Tiempo Activo</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-teal-600">
                  {systemStats?.lastUpdate.split(' ')[1]}
                </div>
                <div className="text-sm text-gray-600">Última Actualización</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">100%</div>
                <div className="text-sm text-gray-600">Disponibilidad</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar módulos, funcionalidades o páginas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="medical">Módulos Médicos</option>
                  <option value="admin">Módulos Administrativos</option>
                  <option value="system">Módulos del Sistema</option>
                </select>
                
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CompleteNavigation />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              Actividad Reciente
              <Badge variant="outline" className="ml-2">
                {recentActivity.length} eventos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{activity.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      activity.type === 'patient' ? 'border-red-200 text-red-700' :
                      activity.type === 'medical' ? 'border-green-200 text-green-700' :
                      activity.type === 'system' ? 'border-blue-200 text-blue-700' :
                      'border-purple-200 text-purple-700'
                    }`}
                  >
                    {activity.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Estado de Salud del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-medium text-green-900">Servidor</div>
                  <div className="text-sm text-green-700">Operativo</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-medium text-green-900">Base de Datos</div>
                  <div className="text-sm text-green-700">Conectada</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-medium text-green-900">API</div>
                  <div className="text-sm text-green-700">Respondiendo</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompleteSystemIndex;
