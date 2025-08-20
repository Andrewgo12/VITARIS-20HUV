import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  Bell,
  Settings,
  LogOut,
  Eye,
  BarChart3,
  Calendar,
  Shield,
  User,
  Database,
  Mail,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "@/components/ui/notification-system";
import { apiService } from "@/services/api";

// Import modals
import AlertDetailsModal from "@/components/modals/vital-red/AlertDetailsModal";
import ChartDrillDownModal from "@/components/modals/vital-red/ChartDrillDownModal";

interface DashboardStats {
  newRequests: number;
  underReview: number;
  accepted: number;
  rejected: number;
  totalRequests: number;
  avgResponseTime: string;
  alertsCount: number;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export default function VitalRedDashboard() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    newRequests: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0,
    totalRequests: 0,
    avgResponseTime: "0h",
    alertsCount: 0,
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('vitaris_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Real API call for dashboard statistics
      const statsResponse = await apiService.getStatistics();

      if (statsResponse.success && statsResponse.data) {
        const data = statsResponse.data;

        // Calculate dashboard stats from real data
        const totalRequests = data.total_referrals || 0;
        const newRequests = data.pending_referrals || 0;
        const accepted = data.approved_referrals || 0;
        const underReview = totalRequests - newRequests - accepted;
        const rejected = 0; // TODO: Add rejected count to API

        setStats({
          newRequests,
          underReview: Math.max(0, underReview),
          accepted,
          rejected,
          totalRequests,
          avgResponseTime: "2.5h", // TODO: Calculate from real data
          alertsCount: data.total_emails > 50 ? 1 : 0, // Generate alert if many emails
        });

        // Generate real system alerts based on data
        const systemAlerts = [];

        if (data.pending_emails > 10) {
          systemAlerts.push({
            id: "email-backlog",
            type: "warning",
            title: "Acumulación de emails",
            message: `Hay ${data.pending_emails} emails pendientes de procesamiento`,
            timestamp: new Date().toISOString(),
            priority: "medium",
          });
        }

        if (data.pending_referrals > 20) {
          systemAlerts.push({
            id: "referral-backlog",
            type: "error",
            title: "Alto volumen de referencias",
            message: `${data.pending_referrals} referencias médicas requieren atención urgente`,
            timestamp: new Date().toISOString(),
            priority: "high",
          });
        }

        if (data.total_patients === 0) {
          systemAlerts.push({
            id: "no-patients",
            type: "info",
            title: "Sistema inicializado",
            message: "Sistema listo para recibir referencias médicas",
            timestamp: new Date().toISOString(),
            priority: "low",
          });
        }

        setAlerts(systemAlerts);

      } else {
        throw new Error(statsResponse.error || 'Failed to load statistics');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addNotification({
        type: 'warning',
        title: 'Error de conexión',
        message: 'Error cargando datos del dashboard. Usando datos de respaldo.',
        priority: 'medium'
      });

      // Fallback to basic stats
      setStats({
        newRequests: 0,
        underReview: 0,
        accepted: 0,
        rejected: 0,
        totalRequests: 0,
        avgResponseTime: "0h",
        alertsCount: 1,
      });

      setAlerts([{
        id: "connection-error",
        type: "error",
        title: "Error de conexión",
        message: "No se pudo conectar con el servidor. Verifique la conexión.",
        timestamp: new Date().toISOString(),
        priority: "high",
      }]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vitaris_user');
    localStorage.removeItem('vitaris_token');
    navigate('/login');
  };

  const handleAlertClick = (alert: SystemAlert) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType);
    setShowChartModal(true);
  };

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'new': return <FileText className="w-6 h-6" />;
      case 'review': return <Clock className="w-6 h-6" />;
      case 'accepted': return <CheckCircle className="w-6 h-6" />;
      case 'rejected': return <XCircle className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const statCards = [
    {
      title: "Nuevas Solicitudes",
      value: stats.newRequests,
      type: "new",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
    },
    {
      title: "En Revisión",
      value: stats.underReview,
      type: "review",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "+5%",
    },
    {
      title: "Aceptadas",
      value: stats.accepted,
      type: "accepted",
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+18%",
    },
    {
      title: "Rechazadas",
      value: stats.rejected,
      type: "rejected",
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-3%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">
                  VITAL <span className="text-red-500 font-light">RED</span>
                </h1>
                <p className="text-xs text-gray-500">Sistema Médico</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                {user?.role === 'doctor' ? 'Médico Evaluador' : 'Administrador'}
              </Badge>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-600">{user?.role === 'doctor' ? 'Médico Evaluador' : 'Administrador'}</div>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.firstName}
          </h2>
          <p className="text-gray-600">
            Panel de control del sistema VITAL RED - {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleChartClick(card.type)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                      <p className="text-sm text-green-600 mt-1">{card.change} vs mes anterior</p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <div className={card.color}>
                        {getStatIcon(card.type)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Alertas del Sistema
                {alerts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {alerts.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay alertas activas</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleAlertClick(alert)}
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600 truncate">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString('es-ES')}
                        </p>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Métricas de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo promedio de respuesta</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.avgResponseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de solicitudes</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa de aceptación</span>
                  <span className="text-lg font-semibold text-green-600">
                    {Math.round((stats.accepted / stats.totalRequests) * 100)}%
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => handleChartClick('performance')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver métricas detalladas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.role === 'doctor' ? (
            // Medical Evaluator Navigation
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/medical-cases')}>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Casos Médicos</h3>
                  <p className="text-gray-600 text-sm">Revisar y evaluar solicitudes médicas</p>
                  <Badge className="mt-3">{stats.newRequests} nuevos</Badge>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/request-history')}>
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Historial</h3>
                  <p className="text-gray-600 text-sm">Revisar decisiones anteriores</p>
                </CardContent>
              </Card>
            </>
          ) : (
            // Administrator Navigation
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/user-management')}>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Gestión de Usuarios</h3>
                  <p className="text-gray-600 text-sm">Administrar médicos evaluadores</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/supervision')}>
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Panel de Supervisión</h3>
                  <p className="text-gray-600 text-sm">Monitorear decisiones médicas</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/system-config')}>
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Configuración</h3>
                  <p className="text-gray-600 text-sm">Configurar sistema y plantillas</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/backup-management')}>
                <CardContent className="p-6 text-center">
                  <Database className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Gestión de Respaldos</h3>
                  <p className="text-gray-600 text-sm">Administrar respaldos del sistema</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/email-monitor')}>
                <CardContent className="p-6 text-center">
                  <Mail className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Monitor de Correos</h3>
                  <p className="text-gray-600 text-sm">Supervisar correos entrantes</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/email-config')}>
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Configuración Gmail</h3>
                  <p className="text-gray-600 text-sm">Configurar capturador de correos</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vital-red/gmail-extractor')}>
                <CardContent className="p-6 text-center">
                  <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Extractor Gmail</h3>
                  <p className="text-gray-600 text-sm">Extracción masiva avanzada</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <AlertDetailsModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        alert={selectedAlert}
      />
      
      <ChartDrillDownModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        chartType={selectedChart}
        data={stats}
      />
    </div>
  );
}
