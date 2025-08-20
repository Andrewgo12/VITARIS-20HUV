import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  X,
  Clock,
  User,
  FileText,
  LogIn,
  LogOut,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  Filter,
  BarChart3,
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
}

interface UserActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserActivityModal({
  isOpen,
  onClose,
  user,
}: UserActivityModalProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  useEffect(() => {
    if (user && isOpen) {
      loadUserActivity();
    }
  }, [user, isOpen]);

  useEffect(() => {
    applyFilters();
  }, [activities, filterType, dateRange]);

  if (!user) return null;

  const loadUserActivity = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockActivities: ActivityLog[] = [
        {
          id: "1",
          timestamp: "2024-01-21T18:00:00Z",
          action: "logout",
          description: "Cierre de sesión",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: true
        },
        {
          id: "2",
          timestamp: "2024-01-21T17:45:00Z",
          action: "case_decision",
          description: "Decisión tomada en caso médico #12345",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: true,
          details: {
            caseId: "12345",
            decision: "accepted",
            priority: "alta"
          }
        },
        {
          id: "3",
          timestamp: "2024-01-21T16:30:00Z",
          action: "case_view",
          description: "Visualización de caso médico #12345",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: true,
          details: {
            caseId: "12345"
          }
        },
        {
          id: "4",
          timestamp: "2024-01-21T15:20:00Z",
          action: "observation_add",
          description: "Observación añadida a caso médico #12344",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: true,
          details: {
            caseId: "12344",
            observationType: "clinical"
          }
        },
        {
          id: "5",
          timestamp: "2024-01-21T14:15:00Z",
          action: "info_request",
          description: "Solicitud de información adicional para caso #12343",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: true,
          details: {
            caseId: "12343",
            urgency: "urgent"
          }
        },
        {
          id: "6",
          timestamp: "2024-01-21T10:30:00Z",
          action: "login",
          description: "Inicio de sesión exitoso",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: true
        },
        {
          id: "7",
          timestamp: "2024-01-20T18:45:00Z",
          action: "logout",
          description: "Cierre de sesión",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: true
        },
        {
          id: "8",
          timestamp: "2024-01-20T17:30:00Z",
          action: "login_failed",
          description: "Intento de inicio de sesión fallido",
          ipAddress: "192.168.1.105",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: false
        }
      ];

      setActivities(mockActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error loading user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = activities;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.action === filterType);
    }

    // Filter by date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    filtered = filtered.filter(activity => 
      new Date(activity.timestamp) >= startDate
    );

    setFilteredActivities(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn className="w-4 h-4 text-green-600" />;
      case 'logout': return <LogOut className="w-4 h-4 text-gray-600" />;
      case 'login_failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'case_view': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'case_decision': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'observation_add': return <FileText className="w-4 h-4 text-purple-600" />;
      case 'info_request': return <FileText className="w-4 h-4 text-orange-600" />;
      case 'profile_edit': return <Edit className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string, success: boolean) => {
    if (!success) return 'border-red-200 bg-red-50';
    
    switch (action) {
      case 'login': return 'border-green-200 bg-green-50';
      case 'logout': return 'border-gray-200 bg-gray-50';
      case 'case_decision': return 'border-green-200 bg-green-50';
      case 'case_view': return 'border-blue-200 bg-blue-50';
      case 'observation_add': return 'border-purple-200 bg-purple-50';
      case 'info_request': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'login': return 'Inicio de sesión';
      case 'logout': return 'Cierre de sesión';
      case 'login_failed': return 'Login fallido';
      case 'case_view': return 'Ver caso';
      case 'case_decision': return 'Decisión médica';
      case 'observation_add': return 'Añadir observación';
      case 'info_request': return 'Solicitar información';
      case 'profile_edit': return 'Editar perfil';
      default: return action;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getActivityStats = () => {
    const totalActivities = activities.length;
    const successfulActivities = activities.filter(a => a.success).length;
    const failedActivities = totalActivities - successfulActivities;
    const loginAttempts = activities.filter(a => a.action === 'login' || a.action === 'login_failed').length;
    const casesViewed = activities.filter(a => a.action === 'case_view').length;
    const decisionsMode = activities.filter(a => a.action === 'case_decision').length;

    return {
      totalActivities,
      successfulActivities,
      failedActivities,
      loginAttempts,
      casesViewed,
      decisionsMode
    };
  };

  const handleExport = () => {
    const exportData = filteredActivities.map(activity => ({
      Fecha: formatTimestamp(activity.timestamp).date,
      Hora: formatTimestamp(activity.timestamp).time,
      Acción: getActionLabel(activity.action),
      Descripción: activity.description,
      IP: activity.ipAddress,
      Éxito: activity.success ? 'Sí' : 'No'
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `actividad_${user.firstName}_${user.lastName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = getActivityStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Actividad del Usuario
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
          {/* User Info and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <p className="text-sm text-blue-700">{user.role === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.successfulActivities}</p>
                <p className="text-sm text-gray-600">Acciones exitosas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.failedActivities}</p>
                <p className="text-sm text-gray-600">Acciones fallidas</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estadísticas de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-blue-600">{stats.totalActivities}</p>
                  <p className="text-sm text-gray-600">Total actividades</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-purple-600">{stats.loginAttempts}</p>
                  <p className="text-sm text-gray-600">Intentos de login</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-orange-600">{stats.casesViewed}</p>
                  <p className="text-sm text-gray-600">Casos visualizados</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-600">{stats.decisionsMode}</p>
                  <p className="text-sm text-gray-600">Decisiones tomadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todas las acciones</option>
                  <option value="login">Inicios de sesión</option>
                  <option value="logout">Cierres de sesión</option>
                  <option value="case_view">Visualización de casos</option>
                  <option value="case_decision">Decisiones médicas</option>
                  <option value="observation_add">Observaciones</option>
                  <option value="info_request">Solicitudes de información</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="24h">Últimas 24 horas</option>
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="90d">Últimos 90 días</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Badge variant="outline">
                {filteredActivities.length} actividades
              </Badge>
            </div>
          </div>

          {/* Activity Timeline */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando actividad del usuario...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividad</h3>
                <p className="text-gray-600">No se encontró actividad que coincida con los filtros aplicados.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => {
                const { date, time } = formatTimestamp(activity.timestamp);
                
                return (
                  <Card key={activity.id} className={`${getActionColor(activity.action, activity.success)} border-l-4`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getActionIcon(activity.action)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {activity.description}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {getActionLabel(activity.action)}
                              </Badge>
                              {!activity.success && (
                                <Badge variant="destructive" className="text-xs">
                                  Fallido
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{date} {time}</span>
                              <span>IP: {activity.ipAddress}</span>
                            </div>
                            {activity.details && (
                              <div className="mt-2 text-xs text-gray-500">
                                {Object.entries(activity.details).map(([key, value]) => (
                                  <span key={key} className="mr-3">
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>Navegador:</p>
                          <p className="max-w-xs truncate">
                            {activity.userAgent.split(' ')[0]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
