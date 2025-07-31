import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsDashboard } from '@/components/ui/analytics-dashboard';
import { useNotifications } from '@/components/ui/notification-system';
import { useResponsive, getResponsiveGrid, getResponsiveTableConfig } from '@/utils/responsive';
import { usePerformanceTracking, useDebounce } from '@/utils/performance';
import { useScreenReader, generateAriaAttributes, getMedicalAriaLabel } from '@/utils/accessibility';
import { medicalApi } from '@/services/api';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  Heart,
  Users,
  Bed,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Shield,
  Monitor,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Calendar,
  FileText,
  Phone,
  MessageSquare,
} from 'lucide-react';

// Datos en tiempo real simulados
const generateRealTimeData = () => ({
  vitalSigns: {
    heartRate: 72 + Math.random() * 20,
    bloodPressure: {
      systolic: 120 + Math.random() * 20,
      diastolic: 80 + Math.random() * 10,
    },
    temperature: 36.5 + Math.random() * 1.5,
    oxygenSaturation: 95 + Math.random() * 5,
    respiratoryRate: 16 + Math.random() * 8,
  },
  hospitalMetrics: {
    totalPatients: 1247 + Math.floor(Math.random() * 20),
    activeCases: 324 + Math.floor(Math.random() * 10),
    bedOccupancy: 85 + Math.random() * 10,
    emergencyCases: 12 + Math.floor(Math.random() * 5),
    surgeries: 8 + Math.floor(Math.random() * 3),
    discharges: 15 + Math.floor(Math.random() * 5),
  },
  systemHealth: {
    cpuUsage: 45 + Math.random() * 30,
    memoryUsage: 60 + Math.random() * 25,
    diskUsage: 70 + Math.random() * 15,
    networkLatency: 50 + Math.random() * 100,
    activeConnections: 150 + Math.floor(Math.random() * 50),
    uptime: 99.8 + Math.random() * 0.2,
  },
  alerts: [
    {
      id: 'alert_1',
      type: 'warning' as const,
      title: 'Ocupación de UCI alta',
      message: 'La UCI está al 95% de capacidad',
      timestamp: new Date(),
      priority: 'high' as const,
    },
    {
      id: 'alert_2',
      type: 'info' as const,
      title: 'Mantenimiento programado',
      message: 'Sistema de respaldo programado para las 2:00 AM',
      timestamp: new Date(),
      priority: 'medium' as const,
    },
  ],
});

// Función para generar alertas basadas en métricas
const generateAlerts = (metrics: any) => {
  const alerts = [];

  if (metrics.hospital?.bedOccupancy > 95) {
    alerts.push({
      id: 'alert_occupancy',
      type: 'warning' as const,
      title: 'Ocupación Crítica',
      message: `Ocupación de camas: ${metrics.hospital.bedOccupancy.toFixed(1)}%`,
      timestamp: new Date(),
      priority: 'critical' as const,
    });
  }

  if (metrics.hospital?.emergencyCases > 15) {
    alerts.push({
      id: 'alert_emergency',
      type: 'emergency' as const,
      title: 'Alto Volumen de Emergencias',
      message: `${metrics.hospital.emergencyCases} casos de emergencia activos`,
      timestamp: new Date(),
      priority: 'high' as const,
    });
  }

  if (metrics.systemHealth?.cpuUsage > 80) {
    alerts.push({
      id: 'alert_cpu',
      type: 'warning' as const,
      title: 'Uso Alto de CPU',
      message: `CPU al ${metrics.systemHealth.cpuUsage.toFixed(1)}%`,
      timestamp: new Date(),
      priority: 'medium' as const,
    });
  }

  return alerts;
};

const RealTimeMetrics: React.FC = () => {
  const [data, setData] = useState(generateRealTimeData());
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  // Use performance tracking
  usePerformanceTracking('RealTimeMetrics');

  // Use responsive utilities
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const gridConfig = getResponsiveGrid(isMobile);
  const tableConfig = getResponsiveTableConfig();

  // Use accessibility utilities
  const { announce } = useScreenReader();
  const metricsAriaAttributes = generateAriaAttributes('region');
  const medicalAriaLabel = getMedicalAriaLabel('metrics', 'Métricas en Tiempo Real');

  // Función para obtener datos reales de la API
  const fetchRealTimeData = async () => {
    try {
      setLoading(true);
      const [metricsResponse, vitalSignsResponse] = await Promise.all([
        medicalApi.getMetrics(),
        medicalApi.getVitalSigns()
      ]);

      if (metricsResponse.success && vitalSignsResponse.success) {
        const combinedData = {
          ...metricsResponse.data.metrics,
          vitalSigns: vitalSignsResponse.data.vitalSigns[0]?.vitalSigns || generateRealTimeData().vitalSigns,
          alerts: generateAlerts(metricsResponse.data.metrics)
        };

        setData(combinedData);
        setLastUpdate(new Date());

        // Agregar a datos históricos
        setHistoricalData(prev => {
          const newEntry = {
            time: new Date().toLocaleTimeString(),
            heartRate: combinedData.vitalSigns.heartRate,
            bloodPressure: combinedData.vitalSigns.bloodPressure?.systolic || 120,
            temperature: combinedData.vitalSigns.temperature,
            patients: combinedData.hospital?.totalPatients || 1247,
            occupancy: combinedData.hospital?.bedOccupancy || 85,
          };
          return [...prev.slice(-19), newEntry];
        });

        // Generar alertas críticas
        if (combinedData.hospital?.bedOccupancy > 95) {
          addNotification({
            type: 'emergency',
            title: 'Capacidad Crítica',
            message: `Ocupación de camas: ${combinedData.hospital.bedOccupancy.toFixed(1)}%`,
            priority: 'critical',
            sound: true,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      // Fallback to mock data
      const newData = generateRealTimeData();
      setData(newData);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  // Actualización en tiempo real
  useEffect(() => {
    if (!isLive) return;

    // Fetch initial data
    fetchRealTimeData();

    const interval = setInterval(() => {
      fetchRealTimeData();

      // Agregar a datos históricos
      setHistoricalData(prev => {
        const newEntry = {
          time: new Date().toLocaleTimeString(),
          heartRate: newData.vitalSigns.heartRate,
          bloodPressure: newData.vitalSigns.bloodPressure.systolic,
          temperature: newData.vitalSigns.temperature,
          patients: newData.hospitalMetrics.totalPatients,
          occupancy: newData.hospitalMetrics.bedOccupancy,
        };
        return [...prev.slice(-19), newEntry]; // Mantener últimos 20 puntos
      });

      // Generar alertas críticas
      if (newData.hospitalMetrics.bedOccupancy > 95) {
        addNotification({
          type: 'emergency',
          title: 'Capacidad Crítica',
          message: `Ocupación de camas: ${newData.hospitalMetrics.bedOccupancy.toFixed(1)}%`,
          priority: 'critical',
          sound: true,
        });
      }
    }, 2000); // Actualizar cada 2 segundos

    return () => clearInterval(interval);
  }, [isLive, addNotification]);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 space-y-6 ${isMobile ? 'px-2' : 'px-4'}`}
      {...metricsAriaAttributes}
      aria-label={medicalAriaLabel}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas en Tiempo Real</h1>
          <p className="text-muted-foreground">
            Monitoreo continuo del sistema hospitalario
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? 'default' : 'secondary'} className="animate-pulse">
            {isLive ? 'EN VIVO' : 'PAUSADO'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLive(!isLive);
              announce(isLive ? 'Métricas pausadas' : 'Métricas en vivo activadas');
            }}
          >
            {isLive ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reanudar
              </>
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <Tabs defaultValue="hospital" className="space-y-4">
        <TabsList className={`grid w-full ${tableConfig.compactMode ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="hospital">
            <Bed className="w-4 h-4 mr-2" />
            Hospital
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Heart className="w-4 h-4 mr-2" />
            Signos Vitales
          </TabsTrigger>
          <TabsTrigger value="system">
            <Monitor className="w-4 h-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Métricas Hospitalarias */}
        <TabsContent value="hospital" className="space-y-4">
          <div className={`grid gap-4 ${gridConfig}`}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.hospitalMetrics.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 5)} desde ayer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.hospitalMetrics.activeCases}</div>
                <p className="text-xs text-muted-foreground">
                  {data.hospitalMetrics.activeCases > 320 ? '+' : '-'}
                  {Math.abs(data.hospitalMetrics.activeCases - 320)} vs promedio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ocupación de Camas</CardTitle>
                <Bed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(data.hospitalMetrics.bedOccupancy, { warning: 85, critical: 95 })}`}>
                  {data.hospitalMetrics.bedOccupancy.toFixed(1)}%
                </div>
                <Progress 
                  value={data.hospitalMetrics.bedOccupancy} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emergencias</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {data.hospitalMetrics.emergencyCases}
                </div>
                <p className="text-xs text-muted-foreground">
                  Casos activos en emergencia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cirugías Hoy</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data.hospitalMetrics.surgeries}
                </div>
                <p className="text-xs text-muted-foreground">
                  Programadas y en curso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Altas Hoy</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data.hospitalMetrics.discharges}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pacientes dados de alta
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de tendencias hospitalarias */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencias en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Pacientes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="occupancy" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Ocupación %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signos Vitales */}
        <TabsContent value="vitals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Frecuencia Cardíaca</CardTitle>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.vitalSigns.heartRate)} bpm
                </div>
                <Progress 
                  value={(data.vitalSigns.heartRate / 120) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Presión Arterial</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.vitalSigns.bloodPressure.systolic)}/
                  {Math.round(data.vitalSigns.bloodPressure.diastolic)}
                </div>
                <p className="text-xs text-muted-foreground">mmHg</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
                <Thermometer className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.vitalSigns.temperature.toFixed(1)}°C
                </div>
                <Progress 
                  value={((data.vitalSigns.temperature - 35) / 5) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saturación O2</CardTitle>
                <Droplets className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(data.vitalSigns.oxygenSaturation, { warning: 95, critical: 90 })}`}>
                  {Math.round(data.vitalSigns.oxygenSaturation)}%
                </div>
                <Progress 
                  value={data.vitalSigns.oxygenSaturation} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Frecuencia Respiratoria</CardTitle>
                <Wind className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.vitalSigns.respiratoryRate)} rpm
                </div>
                <Progress 
                  value={(data.vitalSigns.respiratoryRate / 30) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de signos vitales */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoreo de Signos Vitales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="heartRate" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="Frecuencia Cardíaca"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stackId="2" 
                    stroke="#f97316" 
                    fill="#f97316"
                    fillOpacity={0.3}
                    name="Temperatura"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salud del Sistema */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uso de CPU</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(data.systemHealth.cpuUsage, { warning: 70, critical: 90 })}`}>
                  {Math.round(data.systemHealth.cpuUsage)}%
                </div>
                <Progress 
                  value={data.systemHealth.cpuUsage} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uso de Memoria</CardTitle>
                <Monitor className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(data.systemHealth.memoryUsage, { warning: 80, critical: 95 })}`}>
                  {Math.round(data.systemHealth.memoryUsage)}%
                </div>
                <Progress 
                  value={data.systemHealth.memoryUsage} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data.systemHealth.uptime.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Sistema operativo
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Avanzados */}
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard 
            title="Analytics Hospitalario"
            timeRange="24h"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeMetrics;
