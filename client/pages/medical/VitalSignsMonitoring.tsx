import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Bell,
  BellOff,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Share,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  User,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  LineChart as LineChartIcon,
  Radio,
  Monitor,
  Eye,
  EyeOff,
  Plus,
  Minus,
  MoreHorizontal,
  RefreshCw,
  Power,
  Calendar,
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

interface VitalSign {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  timestamp: Date;
  status: "normal" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

interface PatientMonitor {
  id: string;
  patientName: string;
  room: string;
  bed: string;
  age: number;
  diagnosis: string;
  isMonitoring: boolean;
  lastUpdate: Date;
  batteryLevel: number;
  connectionStatus: "connected" | "disconnected" | "weak";
  alertsCount: number;
  vitalSigns: {
    heartRate: VitalSign;
    bloodPressure: { systolic: VitalSign; diastolic: VitalSign };
    temperature: VitalSign;
    oxygenSaturation: VitalSign;
    respiratoryRate: VitalSign;
    bloodGlucose?: VitalSign;
    intracranialPressure?: VitalSign;
  };
}

interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  parameter: string;
  value: number;
  threshold: number;
  severity: "critical" | "high" | "medium";
  timestamp: Date;
  status: "active" | "acknowledged" | "resolved";
  message: string;
}

export default function VitalSignsMonitoring() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState<PatientMonitor[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientMonitor | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isMonitoringAll, setIsMonitoringAll] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "detailed">("grid");
  const [timeRange, setTimeRange] = useState("1h");
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate real-time data
  useEffect(() => {
    // Initialize mock patients
    const mockPatients: PatientMonitor[] = [
      {
        id: "patient-001",
        patientName: "María González",
        room: "UCI-201",
        bed: "A",
        age: 45,
        diagnosis: "Post-operatorio cirugía cardíaca",
        isMonitoring: true,
        lastUpdate: new Date(),
        batteryLevel: 85,
        connectionStatus: "connected",
        alertsCount: 2,
        vitalSigns: {
          heartRate: {
            id: "hr-001",
            parameter: "Heart Rate",
            value: 88,
            unit: "bpm",
            timestamp: new Date(),
            status: "normal",
            trend: "stable"
          },
          bloodPressure: {
            systolic: {
              id: "bp-sys-001",
              parameter: "Systolic BP",
              value: 145,
              unit: "mmHg",
              timestamp: new Date(),
              status: "warning",
              trend: "up"
            },
            diastolic: {
              id: "bp-dia-001",
              parameter: "Diastolic BP",
              value: 90,
              unit: "mmHg",
              timestamp: new Date(),
              status: "warning",
              trend: "stable"
            }
          },
          temperature: {
            id: "temp-001",
            parameter: "Temperature",
            value: 37.2,
            unit: "°C",
            timestamp: new Date(),
            status: "normal",
            trend: "stable"
          },
          oxygenSaturation: {
            id: "spo2-001",
            parameter: "SpO2",
            value: 96,
            unit: "%",
            timestamp: new Date(),
            status: "normal",
            trend: "stable"
          },
          respiratoryRate: {
            id: "rr-001",
            parameter: "Respiratory Rate",
            value: 18,
            unit: "rpm",
            timestamp: new Date(),
            status: "normal",
            trend: "stable"
          }
        }
      },
      {
        id: "patient-002",
        patientName: "Carlos Méndez",
        room: "UCI-202",
        bed: "B",
        age: 62,
        diagnosis: "Infarto agudo de miocardio",
        isMonitoring: true,
        lastUpdate: new Date(),
        batteryLevel: 45,
        connectionStatus: "connected",
        alertsCount: 0,
        vitalSigns: {
          heartRate: {
            id: "hr-002",
            parameter: "Heart Rate",
            value: 105,
            unit: "bpm",
            timestamp: new Date(),
            status: "warning",
            trend: "up"
          },
          bloodPressure: {
            systolic: {
              id: "bp-sys-002",
              parameter: "Systolic BP",
              value: 160,
              unit: "mmHg",
              timestamp: new Date(),
              status: "critical",
              trend: "up"
            },
            diastolic: {
              id: "bp-dia-002",
              parameter: "Diastolic BP",
              value: 95,
              unit: "mmHg",
              timestamp: new Date(),
              status: "warning",
              trend: "up"
            }
          },
          temperature: {
            id: "temp-002",
            parameter: "Temperature",
            value: 36.8,
            unit: "°C",
            timestamp: new Date(),
            status: "normal",
            trend: "stable"
          },
          oxygenSaturation: {
            id: "spo2-002",
            parameter: "SpO2",
            value: 94,
            unit: "%",
            timestamp: new Date(),
            status: "warning",
            trend: "down"
          },
          respiratoryRate: {
            id: "rr-002",
            parameter: "Respiratory Rate",
            value: 22,
            unit: "rpm",
            timestamp: new Date(),
            status: "warning",
            trend: "up"
          }
        }
      }
    ];

    setPatients(mockPatients);
    setSelectedPatient(mockPatients[0]);

    // Generate historical data
    const generateHistoricalData = () => {
      const data = [];
      const now = new Date();
      for (let i = 60; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
        data.push({
          time: time.toLocaleTimeString(),
          heartRate: 80 + Math.random() * 20,
          systolic: 120 + Math.random() * 30,
          diastolic: 80 + Math.random() * 15,
          temperature: 36.5 + Math.random() * 1.5,
          oxygenSaturation: 95 + Math.random() * 5,
          respiratoryRate: 16 + Math.random() * 8,
        });
      }
      setHistoricalData(data);
    };

    generateHistoricalData();

    // Simulate alerts
    const mockAlerts: Alert[] = [
      {
        id: "alert-001",
        patientId: "patient-001",
        patientName: "María González",
        parameter: "Presión Arterial",
        value: 145,
        threshold: 140,
        severity: "high",
        timestamp: new Date(),
        status: "active",
        message: "Presión arterial elevada - Sistólica 145 mmHg"
      },
      {
        id: "alert-002",
        patientId: "patient-002",
        patientName: "Carlos Méndez",
        parameter: "Frecuencia Cardíaca",
        value: 105,
        threshold: 100,
        severity: "medium",
        timestamp: new Date(Date.now() - 300000),
        status: "acknowledged",
        message: "Taquicardia leve - FC 105 bpm"
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!isMonitoringAll) return;

    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => ({
          ...patient,
          lastUpdate: new Date(),
          vitalSigns: {
            ...patient.vitalSigns,
            heartRate: {
              ...patient.vitalSigns.heartRate,
              value: Math.max(60, Math.min(120, patient.vitalSigns.heartRate.value + (Math.random() - 0.5) * 5)),
              timestamp: new Date()
            },
            oxygenSaturation: {
              ...patient.vitalSigns.oxygenSaturation,
              value: Math.max(90, Math.min(100, patient.vitalSigns.oxygenSaturation.value + (Math.random() - 0.5) * 2)),
              timestamp: new Date()
            }
          }
        }))
      );

      // Update historical data
      setHistoricalData(prevData => {
        const newEntry = {
          time: new Date().toLocaleTimeString(),
          heartRate: 80 + Math.random() * 20,
          systolic: 120 + Math.random() * 30,
          diastolic: 80 + Math.random() * 15,
          temperature: 36.5 + Math.random() * 1.5,
          oxygenSaturation: 95 + Math.random() * 5,
          respiratoryRate: 16 + Math.random() * 8,
        };
        return [...prevData.slice(-59), newEntry];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoringAll]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getConnectionColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "weak":
        return "text-yellow-600";
      case "disconnected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const VitalSignCard = ({ 
    icon: Icon, 
    title, 
    value, 
    unit, 
    status, 
    trend 
  }: {
    icon: any;
    title: string;
    value: number;
    unit: string;
    status: string;
    trend: string;
  }) => (
    <Card className={cn("card-modern", getStatusColor(status))}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8" />
            <div>
              <p className="text-sm font-medium opacity-80">{title}</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{value}</span>
                <span className="text-lg opacity-80">{unit}</span>
                {trend === "up" && <TrendingUp className="w-4 h-4 text-red-500" />}
                {trend === "down" && <TrendingDown className="w-4 h-4 text-blue-500" />}
                {trend === "stable" && <Target className="w-4 h-4 text-green-500" />}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={status === "critical" ? "destructive" : status === "warning" ? "secondary" : "default"}>
              {status === "normal" ? "Normal" : status === "warning" ? "Alerta" : "Crítico"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PatientMonitorCard = ({ patient }: { patient: PatientMonitor }) => (
    <Card 
      className={cn(
        "card-modern cursor-pointer transition-all duration-300 hover:shadow-medium",
        selectedPatient?.id === patient.id && "ring-2 ring-primary"
      )}
      onClick={() => setSelectedPatient(patient)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
              {patient.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{patient.patientName}</h3>
              <p className="text-sm text-muted-foreground">{patient.room} - Cama {patient.bed}</p>
              <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {patient.connectionStatus === "connected" ? 
                <Wifi className={cn("w-4 h-4", getConnectionColor(patient.connectionStatus))} /> :
                <WifiOff className={cn("w-4 h-4", getConnectionColor(patient.connectionStatus))} />
              }
              <Battery className={cn(
                "w-4 h-4",
                patient.batteryLevel < 30 ? "text-red-500" : 
                patient.batteryLevel < 60 ? "text-yellow-500" : "text-green-500"
              )} />
              <span className="text-xs">{patient.batteryLevel}%</span>
            </div>
            {patient.alertsCount > 0 && (
              <Badge variant="destructive">
                {patient.alertsCount} Alertas
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-600">{patient.vitalSigns.heartRate.value}</p>
            <p className="text-xs text-red-600">BPM</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <Activity className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-600">
              {patient.vitalSigns.bloodPressure.systolic.value}/
              {patient.vitalSigns.bloodPressure.diastolic.value}
            </p>
            <p className="text-xs text-blue-600">mmHg</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <Droplets className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-600">{patient.vitalSigns.oxygenSaturation.value}</p>
            <p className="text-xs text-green-600">SpO2%</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <Thermometer className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-purple-600">{patient.vitalSigns.temperature.value}</p>
            <p className="text-xs text-purple-600">°C</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button 
            variant={patient.isMonitoring ? "destructive" : "default"} 
            size="sm" 
            className="flex-1"
          >
            {patient.isMonitoring ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {patient.isMonitoring ? "Pausar" : "Iniciar"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <Card className={cn(
      "border-l-4",
      alert.severity === "critical" ? "border-l-red-500 bg-red-50" :
      alert.severity === "high" ? "border-l-orange-500 bg-orange-50" :
      "border-l-yellow-500 bg-yellow-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className={cn(
              "w-5 h-5 mt-0.5",
              alert.severity === "critical" ? "text-red-600" :
              alert.severity === "high" ? "text-orange-600" :
              "text-yellow-600"
            )} />
            <div>
              <h4 className="font-semibold">{alert.patientName}</h4>
              <p className="text-sm text-muted-foreground">{alert.parameter}</p>
              <p className="text-sm">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {alert.timestamp.toLocaleTimeString()}
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <NavigationImproved 
            userName="Dr. Especialista"
            userRole="Médico UCI"
            notifications={alerts.filter(a => a.status === "active").length}
          />
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/medical-dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard Médico
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Monitoreo de Signos Vitales
              </h1>
              <p className="text-muted-foreground">
                Seguimiento en tiempo real de pacientes críticos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={isMonitoringAll ? "destructive" : "default"}
              onClick={() => setIsMonitoringAll(!isMonitoringAll)}
              className="gap-2"
            >
              {isMonitoringAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isMonitoringAll ? "Pausar Todo" : "Iniciar Todo"}
            </Button>
            <Button 
              variant={alertsEnabled ? "default" : "outline"}
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className="gap-2"
            >
              {alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              Alertas
            </Button>
            <Button 
              variant={soundEnabled ? "default" : "outline"}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="gap-2"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Sonido
            </Button>
          </div>
        </div>

        {/* System Status */}
        <Card className="card-modern mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Sistema Activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{patients.filter(p => p.isMonitoring).length} Pacientes Monitoreando</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">{alerts.filter(a => a.status === "active").length} Alertas Activas</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Patient List - Left Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="card-modern">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Pacientes Monitoreados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="space-y-3">
                  {patients.map((patient) => (
                    <PatientMonitorCard key={patient.id} patient={patient} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Monitoring Area */}
          <div className="xl:col-span-3 space-y-6">
            {selectedPatient && (
              <>
                {/* Patient Header */}
                <Card className="card-modern">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {selectedPatient.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">{selectedPatient.patientName}</h2>
                          <p className="text-muted-foreground">{selectedPatient.room} - Cama {selectedPatient.bed}</p>
                          <p className="text-sm text-muted-foreground">{selectedPatient.diagnosis}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="gap-2">
                          <Clock className="w-3 h-3" />
                          Última actualización: {selectedPatient.lastUpdate.toLocaleTimeString()}
                        </Badge>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Vital Signs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <VitalSignCard
                    icon={Heart}
                    title="Frecuencia Cardíaca"
                    value={selectedPatient.vitalSigns.heartRate.value}
                    unit="bpm"
                    status={selectedPatient.vitalSigns.heartRate.status}
                    trend={selectedPatient.vitalSigns.heartRate.trend}
                  />
                  <VitalSignCard
                    icon={Activity}
                    title="Presión Arterial"
                    value={selectedPatient.vitalSigns.bloodPressure.systolic.value}
                    unit={`/${selectedPatient.vitalSigns.bloodPressure.diastolic.value} mmHg`}
                    status={selectedPatient.vitalSigns.bloodPressure.systolic.status}
                    trend={selectedPatient.vitalSigns.bloodPressure.systolic.trend}
                  />
                  <VitalSignCard
                    icon={Thermometer}
                    title="Temperatura"
                    value={selectedPatient.vitalSigns.temperature.value}
                    unit="°C"
                    status={selectedPatient.vitalSigns.temperature.status}
                    trend={selectedPatient.vitalSigns.temperature.trend}
                  />
                  <VitalSignCard
                    icon={Droplets}
                    title="Saturación O2"
                    value={selectedPatient.vitalSigns.oxygenSaturation.value}
                    unit="%"
                    status={selectedPatient.vitalSigns.oxygenSaturation.status}
                    trend={selectedPatient.vitalSigns.oxygenSaturation.trend}
                  />
                  <VitalSignCard
                    icon={Wind}
                    title="Frecuencia Respiratoria"
                    value={selectedPatient.vitalSigns.respiratoryRate.value}
                    unit="rpm"
                    status={selectedPatient.vitalSigns.respiratoryRate.status}
                    trend={selectedPatient.vitalSigns.respiratoryRate.trend}
                  />
                  <Card className="card-modern flex items-center justify-center">
                    <CardContent className="p-6 text-center">
                      <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Agregar Parámetro</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <Tabs defaultValue="trends" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="trends">Tendencias</TabsTrigger>
                    <TabsTrigger value="compare">Comparación</TabsTrigger>
                    <TabsTrigger value="events">Eventos</TabsTrigger>
                    <TabsTrigger value="reports">Reportes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trends" className="space-y-6">
                    <Card className="card-modern">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Tendencias de Signos Vitales</CardTitle>
                          <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1h">1 Hora</SelectItem>
                              <SelectItem value="6h">6 Horas</SelectItem>
                              <SelectItem value="24h">24 Horas</SelectItem>
                              <SelectItem value="7d">7 Días</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="heartRate" 
                                stroke="#ef4444" 
                                strokeWidth={2}
                                name="FC (bpm)"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="systolic" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                name="PAS (mmHg)"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="oxygenSaturation" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                name="SpO2 (%)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="compare">
                    <Card className="card-modern">
                      <CardHeader>
                        <CardTitle className="text-lg">Comparación de Parámetros</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData.slice(-10)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="heartRate" fill="#ef4444" name="FC (bpm)" />
                              <Bar dataKey="oxygenSaturation" fill="#10b981" name="SpO2 (%)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="events">
                    <Card className="card-modern">
                      <CardHeader>
                        <CardTitle className="text-lg">Eventos y Alertas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {alerts.map((alert) => (
                          <AlertCard key={alert.id} alert={alert} />
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reports">
                    <Card className="card-modern">
                      <CardContent className="p-12 text-center">
                        <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Reportes Médicos
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Genere reportes detallados de los signos vitales del paciente
                        </p>
                        <Button>
                          <Download className="w-4 h-4 mr-2" />
                          Generar Reporte
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
