import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  Users,
  AlertTriangle,
  Stethoscope,
  Bed,
  Calendar,
  Heart,
  Search,
  Filter,
  Plus,
  Eye,
  MoreHorizontal,
  Bell,
  Settings,
  LogOut,
  ArrowUpRight,
  TrendingUp,
  Clock,
  UserCheck,
  TestTube,
  Pill,
  FileText,
  Ambulance,
  MonitorSpeaker,
  Shield,
  Brain,
  Zap,
  Target,
  Timer,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Video,
  MessageSquare,
  BarChart3,
  LineChart,
  PieChart,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useMedicalData } from "@/context/MedicalDataContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

interface RealTimeMetrics {
  timestamp: string;
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
}

interface CriticalAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: "cardiac" | "respiratory" | "neurological" | "medication" | "lab";
  severity: "critical" | "high" | "medium";
  message: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

interface OperatingRoom {
  id: string;
  name: string;
  status: "available" | "occupied" | "cleaning" | "maintenance";
  currentProcedure?: string;
  surgeon?: string;
  estimatedCompletion?: string;
  patient?: string;
}

export default function MedicalDashboardAdvanced() {
  const { t, language } = useLanguage();
  const { patients, activePatients, getStatistics, getActiveEmergencies } =
    useMedicalData();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("overview");
  const [realTimeData, setRealTimeData] = useState<RealTimeMetrics[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>([]);
  const [operatingRooms, setOperatingRooms] = useState<OperatingRoom[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    connectivity: true,
    servers: 98.5,
    databases: 99.2,
    monitoring: true,
    backup: true,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate vital signs monitoring
      const newMetric: RealTimeMetrics = {
        timestamp: new Date().toISOString(),
        heartRate: 70 + Math.random() * 30,
        bloodPressure: {
          systolic: 110 + Math.random() * 30,
          diastolic: 70 + Math.random() * 20,
        },
        temperature: 36.5 + Math.random() * 1.5,
        oxygenSaturation: 95 + Math.random() * 5,
        respiratoryRate: 16 + Math.random() * 8,
      };

      setRealTimeData((prev) => [...prev.slice(-29), newMetric]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initialize mock data
    setCriticalAlerts([
      {
        id: "alert-1",
        patientId: "12345",
        patientName: "María González",
        type: "cardiac",
        severity: "critical",
        message: "Arritmia detectada - FC irregular",
        timestamp: new Date().toISOString(),
        status: "active",
      },
      {
        id: "alert-2",
        patientId: "67890",
        patientName: "Carlos Méndez",
        type: "respiratory",
        severity: "high",
        message: "Saturación de O2 por debajo de 90%",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: "acknowledged",
      },
    ]);

    setOperatingRooms([
      {
        id: "or-1",
        name: "Quirófano 1",
        status: "occupied",
        currentProcedure: "Cirugía Cardíaca",
        surgeon: "Dr. López",
        estimatedCompletion: "14:30",
        patient: "Juan Pérez",
      },
      {
        id: "or-2",
        name: "Quirófano 2",
        status: "available",
      },
      {
        id: "or-3",
        name: "Quirófano 3",
        status: "cleaning",
      },
    ]);
  }, []);

  const stats = {
    totalPatients: activePatients.length,
    criticalPatients: activePatients.filter(
      (p) => p.currentStatus.priority === "crítico",
    ).length,
    emergencies: getActiveEmergencies().length,
    availableBeds: 45,
    todaysAppointments: 28,
    pendingLabs: 12,
    activeSurgeries: operatingRooms.filter((room) => room.status === "occupied")
      .length,
    icuOccupancy: 85,
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-500";
      case "high":
        return "bg-slate-100 text-slate-800 border-slate-500";
      default:
        return "bg-slate-50 text-slate-700 border-slate-300";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "cardiac":
        return Heart;
      case "respiratory":
        return Wind;
      case "neurological":
        return Brain;
      case "medication":
        return Pill;
      case "lab":
        return TestTube;
      default:
        return AlertTriangle;
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-500";
      case "occupied":
        return "bg-red-100 text-red-800 border-red-500";
      case "cleaning":
        return "bg-slate-100 text-slate-800 border-slate-500";
      case "maintenance":
        return "bg-gray-100 text-gray-800 border-gray-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-500";
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    onClick,
    color = "blue",
    isRealTime = false,
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: "up" | "down" | "stable";
    onClick?: () => void;
    color?: string;
    isRealTime?: boolean;
  }) => (
    <Card
      className={cn(
        "rounded-xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:border-slate-300 group relative",
        onClick && "hover:border-primary/50",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                className={cn(
                  "w-5 h-5",
                  color === "red" && "text-red-500",
                  color === "green" && "text-emerald-500",
                  color === "blue" && "text-blue-500",
                  color === "slate" && "text-slate-500",
                  color === "purple" && "text-purple-500",
                  color === "primary" && "text-primary",
                )}
              />
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {isRealTime && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <p className="text-lg font-bold text-foreground mb-1">{value}</p>
            {subtitle && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  trend === "up"
                    ? "text-emerald-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-slate-600",
                )}
              >
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {trend === "down" && (
                  <TrendingUp className="w-3 h-3 rotate-180" />
                )}
                <span>{subtitle}</span>
              </div>
            )}
          </div>
          {onClick && (
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CriticalAlertCard = ({ alert }: { alert: CriticalAlert }) => {
    const Icon = getAlertIcon(alert.type);

    return (
      <Card
        className={cn(
          "border-l-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md",
          getAlertColor(alert.severity),
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 mt-0.5 text-red-600" />
              <div>
                <h4 className="font-semibold text-foreground">
                  {alert.patientName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  ID: {alert.patientId}
                </p>
                <p className="text-sm text-foreground mt-1">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm">
                <CheckCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const OperatingRoomCard = ({ room }: { room: OperatingRoom }) => (
    <Card
      className={cn(
        "border-l-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md",
        getRoomStatusColor(room.status),
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-foreground">{room.name}</h4>
          <Badge className={getRoomStatusColor(room.status)}>
            {room.status === "available"
              ? "Disponible"
              : room.status === "occupied"
                ? "Ocupado"
                : room.status === "cleaning"
                  ? "Limpieza"
                  : "Mantenimiento"}
          </Badge>
        </div>

        {room.status === "occupied" && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Procedimiento:</strong> {room.currentProcedure}
            </p>
            <p>
              <strong>Cirujano:</strong> {room.surgeon}
            </p>
            <p>
              <strong>Paciente:</strong> {room.patient}
            </p>
            <p>
              <strong>Finalización estimada:</strong> {room.estimatedCompletion}
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            Ver
          </Button>
          {room.status === "available" && (
            <Button size="sm" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Programar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const VitalSignsWidget = () => (
    <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          Monitoreo en Tiempo Real
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-red-50 rounded-lg border border-red-100 transition-all duration-200 hover:bg-red-100">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-red-600">
              {realTimeData.length > 0
                ? Math.round(realTimeData[realTimeData.length - 1].heartRate)
                : "--"}
            </p>
            <p className="text-sm text-red-600">BPM</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100 transition-all duration-200 hover:bg-blue-100">
            <Thermometer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-blue-600">
              {realTimeData.length > 0
                ? realTimeData[realTimeData.length - 1].temperature.toFixed(1)
                : "--"}
            </p>
            <p className="text-sm text-blue-600">°C</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100 transition-all duration-200 hover:bg-green-100">
            <Droplets className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-600">
              {realTimeData.length > 0
                ? Math.round(
                    realTimeData[realTimeData.length - 1].oxygenSaturation,
                  )
                : "--"}
            </p>
            <p className="text-sm text-green-600">SpO2 %</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg border border-purple-100 transition-all duration-200 hover:bg-purple-100">
            <Wind className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-purple-600">
              {realTimeData.length > 0
                ? Math.round(
                    realTimeData[realTimeData.length - 1].respiratoryRate,
                  )
                : "--"}
            </p>
            <p className="text-sm text-purple-600">RPM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SystemStatusWidget = () => (
    <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Radio className="w-5 h-5 text-green-500" />
          Estado del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {systemStatus.connectivity ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">Conectividad</span>
          </div>
          <Badge
            variant={systemStatus.connectivity ? "default" : "destructive"}
          >
            {systemStatus.connectivity ? "Activo" : "Desconectado"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Servidores</span>
            <span>{systemStatus.servers}%</span>
          </div>
          <Progress value={systemStatus.servers} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base de Datos</span>
            <span>{systemStatus.databases}%</span>
          </div>
          <Progress value={systemStatus.databases} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MonitorSpeaker className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Monitoreo</span>
          </div>
          <Badge variant={systemStatus.monitoring ? "default" : "destructive"}>
            {systemStatus.monitoring ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <NavigationImproved
            userName="Dr. Especialista"
            userRole="Médico Jefe"
            notifications={
              criticalAlerts.filter((a) => a.status === "active").length
            }
          />
        </div>
      </header>

      <div className="container mx-auto px-3 py-2">
        {/* Critical Alerts Banner */}
        {criticalAlerts.filter((a) => a.status === "active").length > 0 && (
          <div className="mb-2">
            <Card className="border-red-500 bg-red-50 rounded-lg shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      {
                        criticalAlerts.filter((a) => a.status === "active")
                          .length
                      }{" "}
                      Alertas Críticas Activas
                    </h3>
                    <p className="text-sm text-red-700">
                      Requieren atención inmediata del equipo médico
                    </p>
                  </div>
                  <Button size="sm" className="ml-auto">
                    Ver Todas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Stats Grid - Ultra Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 mb-2">
          <StatCard
            icon={Users}
            title="Pacientes Activos"
            value={stats.totalPatients}
            subtitle="+3 hoy"
            trend="up"
            color="blue"
            onClick={() => navigate("/medical/active-patients")}
          />
          <StatCard
            icon={AlertTriangle}
            title="Estado Crítico"
            value={stats.criticalPatients}
            subtitle="Atención inmediata"
            color="red"
            onClick={() => navigate("/medical/emergency-protocols")}
          />
          <StatCard
            icon={Calendar}
            title="Citas Hoy"
            value={stats.todaysAppointments}
            subtitle="85% ocupación"
            trend="up"
            color="green"
            onClick={() => navigate("/medical/appointments")}
          />
          <StatCard
            icon={Bed}
            title="Camas UCI"
            value={`${stats.icuOccupancy}%`}
            subtitle="12/14 ocupadas"
            trend="stable"
            color="slate"
            onClick={() => navigate("/medical/icu-monitoring")}
          />
          <StatCard
            icon={Activity}
            title="Cirugías Activas"
            value={stats.activeSurgeries}
            subtitle="2 programadas"
            color="purple"
            onClick={() => navigate("/medical/surgeries")}
          />
          <StatCard
            icon={TestTube}
            title="Labs Pendientes"
            value={stats.pendingLabs}
            subtitle="2h promedio"
            trend="down"
            color="blue"
            onClick={() => navigate("/medical/labs-imaging")}
          />
          <StatCard
            icon={Ambulance}
            title="Emergencias"
            value={stats.emergencies}
            subtitle={stats.emergencies > 0 ? "ACTIVA" : "NORMAL"}
            trend={stats.emergencies > 0 ? "up" : "stable"}
            color="red"
            onClick={() => navigate("/medical/emergency-protocols")}
          />
          <StatCard
            icon={Heart}
            title="Monitoreo"
            value="24/7"
            subtitle="Tiempo real"
            color="primary"
            isRealTime={true}
          />
        </div>

        {/* Main Dashboard Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2 mb-2">
          {/* Left Column - Monitoring */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-2">
            <VitalSignsWidget />
            <SystemStatusWidget />
          </div>

          {/* Center Column - Alerts */}
          <div className="lg:col-span-1 xl:col-span-2 space-y-2">
            <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Alertas Críticas
                  <Badge variant="destructive" className="ml-auto">
                    {criticalAlerts.filter((a) => a.status === "active").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {criticalAlerts.slice(0, 3).map((alert) => (
                  <CriticalAlertCard key={alert.id} alert={alert} />
                ))}
                {criticalAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No hay alertas críticas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Rooms */}
          <div className="lg:col-span-2 xl:col-span-1 space-y-2">
            <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Quirófanos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {operatingRooms.map((room) => (
                  <OperatingRoomCard key={room.id} room={room} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Acceso Rápido - Funcionalidades Médicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Button
                variant="outline"
                className="h-16 flex-col gap-1 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 hover:shadow-md rounded-lg"
                onClick={() => navigate("/medical/patient-history")}
              >
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium">Historia Clínica</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-1 hover:bg-green-50 hover:border-green-200 transition-all duration-200 hover:shadow-md rounded-lg"
                onClick={() => navigate("/medical/prescriptions")}
              >
                <Pill className="w-5 h-5 text-green-600" />
                <span className="text-xs font-medium">Prescripciones</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-1 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 hover:shadow-md rounded-lg"
                onClick={() => navigate("/medical/labs-imaging")}
              >
                <TestTube className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-medium">Labs & Imágenes</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-1 hover:bg-red-50 hover:border-red-200 transition-all duration-200 hover:shadow-md rounded-lg"
                onClick={() => navigate("/medical/icu-monitoring")}
              >
                <MonitorSpeaker className="w-5 h-5 text-red-600" />
                <span className="text-xs font-medium">UCI</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-1 hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 hover:shadow-md rounded-lg"
                onClick={() => navigate("/medical/team-communication")}
              >
                <MessageSquare className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-medium">Comunicación</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-1 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 hover:shadow-md rounded-lg"
                onClick={() => navigate("/medical/telemedicine")}
              >
                <Video className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-medium">Telemedicina</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
