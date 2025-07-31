import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/components/ui/notification-system';
import { auditApi } from '@/services/api';
import {
  Shield,
  Eye,
  User,
  Calendar,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Monitor,
  FileText,
  Database,
  Settings,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security';
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDetail, setShowLogDetail] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchAuditLogs();
  }, [dateRange, actionFilter, userFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await auditApi.getLogs({
        page: 1,
        limit: 100,
        action: actionFilter !== 'all' ? actionFilter : undefined,
        userId: userFilter !== 'all' ? userFilter : undefined,
      });
      
      if (response.success) {
        // Add mock data for demonstration
        const mockLogs: AuditLog[] = [
          {
            id: 'audit_001',
            timestamp: new Date(),
            userId: '507f1f77bcf86cd799439011',
            userName: 'Super Admin',
            action: 'patient_access',
            resource: 'patient_12345678',
            details: 'Accessed patient medical record',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            success: true,
            severity: 'medium',
            category: 'data_access'
          },
          {
            id: 'audit_002',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            userId: '507f1f77bcf86cd799439012',
            userName: 'Dr. Carlos Martínez',
            action: 'prescription_create',
            resource: 'prescription_001',
            details: 'Created new prescription for patient Juan Carlos Pérez',
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            success: true,
            severity: 'high',
            category: 'data_modification'
          },
          {
            id: 'audit_003',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            userId: '507f1f77bcf86cd799439013',
            userName: 'Enf. Ana López',
            action: 'vital_signs_update',
            resource: 'patient_87654321',
            details: 'Updated vital signs for patient María Elena Rodríguez',
            ipAddress: '192.168.1.102',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            success: true,
            severity: 'medium',
            category: 'data_modification'
          },
          {
            id: 'audit_004',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            userId: '507f1f77bcf86cd799439014',
            userName: 'Unknown User',
            action: 'login_failed',
            resource: 'authentication_system',
            details: 'Failed login attempt with email: hacker@example.com',
            ipAddress: '203.0.113.1',
            userAgent: 'curl/7.68.0',
            success: false,
            severity: 'critical',
            category: 'security'
          },
          {
            id: 'audit_005',
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            userId: '507f1f77bcf86cd799439011',
            userName: 'Super Admin',
            action: 'user_create',
            resource: 'user_507f1f77bcf86cd799439015',
            details: 'Created new user account for Dr. Patricia Vega',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            success: true,
            severity: 'high',
            category: 'data_modification'
          }
        ];
        
        setLogs([...mockLogs, ...response.data.logs]);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los logs de auditoría',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': case 'login_success': return <UserCheck className="w-4 h-4" />;
      case 'login_failed': case 'logout': return <UserX className="w-4 h-4" />;
      case 'patient_access': case 'data_access': return <Eye className="w-4 h-4" />;
      case 'patient_create': case 'user_create': return <Plus className="w-4 h-4" />;
      case 'patient_update': case 'user_update': return <Edit className="w-4 h-4" />;
      case 'patient_delete': case 'user_delete': return <Trash2 className="w-4 h-4" />;
      case 'prescription_create': case 'vital_signs_update': return <FileText className="w-4 h-4" />;
      case 'system_config': return <Settings className="w-4 h-4" />;
      case 'backup_create': case 'backup_restore': return <Database className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'bg-blue-100 text-blue-800';
      case 'authorization': return 'bg-purple-100 text-purple-800';
      case 'data_access': return 'bg-green-100 text-green-800';
      case 'data_modification': return 'bg-orange-100 text-orange-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs
    .filter(log => 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const logStats = {
    totalLogs: logs.length,
    successfulActions: logs.filter(log => log.success).length,
    failedActions: logs.filter(log => !log.success).length,
    criticalEvents: logs.filter(log => log.severity === 'critical').length,
    securityEvents: logs.filter(log => log.category === 'security').length,
    recentActivity: logs.filter(log => 
      new Date() - new Date(log.timestamp) < 24 * 60 * 60 * 1000
    ).length,
  };

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setShowLogDetail(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando logs de auditoría...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs de Auditoría</h1>
          <p className="text-gray-600">Monitoreo y seguimiento de actividades del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchAuditLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold">{logStats.totalLogs}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exitosos</p>
                <p className="text-2xl font-bold text-green-600">
                  {logStats.successfulActions}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fallidos</p>
                <p className="text-2xl font-bold text-red-600">
                  {logStats.failedActions}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Críticos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {logStats.criticalEvents}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Seguridad</p>
                <p className="text-2xl font-bold text-purple-600">
                  {logStats.securityEvents}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Últimas 24h</p>
                <p className="text-2xl font-bold text-blue-600">
                  {logStats.recentActivity}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por usuario, acción o detalles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las acciones</option>
              <option value="login">Login</option>
              <option value="patient_access">Acceso a Pacientes</option>
              <option value="data_modification">Modificación de Datos</option>
              <option value="system_config">Configuración</option>
              <option value="security">Eventos de Seguridad</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="all">Todo el tiempo</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoría ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Timestamp</th>
                  <th className="text-left p-3">Usuario</th>
                  <th className="text-left p-3">Acción</th>
                  <th className="text-left p-3">Recurso</th>
                  <th className="text-left p-3">Detalles</th>
                  <th className="text-left p-3">IP</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Severidad</th>
                  <th className="text-left p-3">Categoría</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{log.userName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <span className="ml-2">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-gray-600">{log.resource}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {log.details}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm">{log.ipAddress}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {log.success ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Éxito
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Fallo
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getSeverityColor(log.severity || 'low')}>
                        {log.severity || 'low'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getCategoryColor(log.category || 'system')}>
                        {log.category || 'system'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewLog(log)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      {showLogDetail && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Detalle del Log de Auditoría</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowLogDetail(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID del Log</p>
                  <p className="font-medium">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timestamp</p>
                  <p className="font-medium">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Usuario</p>
                  <p className="font-medium">{selectedLog.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID de Usuario</p>
                  <p className="font-medium">{selectedLog.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Acción</p>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recurso</p>
                  <p className="font-medium">{selectedLog.resource}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dirección IP</p>
                  <p className="font-medium">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <Badge className={selectedLog.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedLog.success ? 'Éxito' : 'Fallo'}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Detalles</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p>{selectedLog.details}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">User Agent</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm break-all">{selectedLog.userAgent}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-600">Severidad</p>
                  <Badge className={getSeverityColor(selectedLog.severity || 'low')}>
                    {selectedLog.severity || 'low'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categoría</p>
                  <Badge className={getCategoryColor(selectedLog.category || 'system')}>
                    {selectedLog.category || 'system'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
