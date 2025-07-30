import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useMedicalData } from "@/context/MedicalDataContext";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  emergencies: number;
  availableBeds: number;
  todaysAppointments: number;
  pendingLabTests: number;
}

export default function MedicalDashboardImproved() {
  const { t, language } = useLanguage();
  const {
    patients,
    activePatients,
    getStatistics,
    getActiveEmergencies,
  } = useMedicalData();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    emergencies: 0,
    availableBeds: 48,
    todaysAppointments: 12,
    pendingLabTests: 8,
  });

  useEffect(() => {
    const statistics = getStatistics();
    setStats({
      ...statistics,
      emergencies: getActiveEmergencies().length,
      availableBeds: 48,
      todaysAppointments: 12,
      pendingLabTests: 8,
    });
  }, [patients]);

  const filteredPatients = activePatients.filter(
    (patient) =>
      patient.personalInfo.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.personalInfo.identificationNumber.includes(searchTerm),
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
      case "crítico":
        return "destructive";
      case "high":
      case "alto":
      case "severo":
        return "warning";
      case "medium":
      case "medio":
      case "moderado":
        return "secondary";
      default:
        return "outline";
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
    trend,
    onClick,
    color = "blue",
  }: {
    icon: any;
    title: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "stable";
    onClick?: () => void;
    color?: string;
  }) => (
    <Card 
      className={cn(
        "card-modern cursor-pointer transition-all duration-300 hover:shadow-medium group",
        onClick && "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn(
                "w-5 h-5",
                color === "red" && "text-red-500",
                color === "green" && "text-emerald-500",
                color === "blue" && "text-blue-500",
                color === "amber" && "text-amber-500",
                color === "purple" && "text-purple-500",
                color === "primary" && "text-primary"
              )} />
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend === "up" ? "text-emerald-600" : 
                trend === "down" ? "text-red-600" : "text-slate-600"
              )}>
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {trend === "down" && <TrendingUp className="w-3 h-3 rotate-180" />}
                <span>{change}</span>
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

  const PatientCard = ({ patient }: { patient: any }) => (
    <Card className="card-modern group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {patient.personalInfo.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {patient.personalInfo.fullName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {patient.personalInfo.identificationType}: {patient.personalInfo.identificationNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(patient.currentStatus.priority)} className="text-xs">
              {patient.currentStatus.priority}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center justify-between">
            <span>EPS:</span>
            <span className="font-medium text-foreground">{patient.epsInfo.eps}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Edad:</span>
            <span className="font-medium text-foreground">{patient.personalInfo.age} años</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Doctor:</span>
            <span className="font-medium text-foreground">{patient.currentStatus.assignedDoctor || "Sin asignar"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/patient/${patient.id}`)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    onClick,
    color = "blue",
  }: {
    icon: any;
    title: string;
    description: string;
    onClick: () => void;
    color?: string;
  }) => (
    <Card
      className="card-modern cursor-pointer group hover:shadow-medium transition-all duration-300"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            color === "blue" && "bg-blue-100 text-blue-600",
            color === "green" && "bg-emerald-100 text-emerald-600",
            color === "red" && "bg-red-100 text-red-600",
            color === "amber" && "bg-amber-100 text-amber-600",
            color === "purple" && "bg-purple-100 text-purple-600"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Dashboard Médico
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sistema Vital Red
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Grid - Improved Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={Users}
            title="Pacientes Activos"
            value={stats.activePatients}
            change="+12%"
            trend="up"
            color="blue"
            onClick={() => navigate("/medical/active-patients")}
          />
          <StatCard
            icon={AlertTriangle}
            title="Emergencias"
            value={stats.emergencies}
            change={stats.emergencies > 0 ? "ACTIVA" : "NORMAL"}
            trend={stats.emergencies > 0 ? "down" : "stable"}
            color="red"
            onClick={() => navigate("/medical/emergency-protocols")}
          />
          <StatCard
            icon={Calendar}
            title="Citas Hoy"
            value={stats.todaysAppointments}
            change="75% ocupación"
            trend="up"
            color="green"
            onClick={() => navigate("/medical/appointments")}
          />
          <StatCard
            icon={Bed}
            title="Camas Disponibles"
            value={stats.availableBeds}
            change="85% ocupación"
            trend="down"
            color="amber"
            onClick={() => navigate("/medical/beds-management")}
          />
          <StatCard
            icon={TestTube}
            title="Labs Pendientes"
            value={stats.pendingLabTests}
            change="2h promedio"
            trend="stable"
            color="purple"
            onClick={() => navigate("/medical/labs-imaging")}
          />
          <StatCard
            icon={Heart}
            title="Total Pacientes"
            value={stats.totalPatients}
            change="+5 nuevos"
            trend="up"
            color="primary"
            onClick={() => navigate("/medical/active-patients")}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="space-y-6">
            <Card className="card-modern">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionCard
                  icon={Users}
                  title="Nuevo Paciente"
                  description="Registrar ingreso"
                  onClick={() => navigate("/medical/active-patients")}
                  color="blue"
                />
                <QuickActionCard
                  icon={Calendar}
                  title="Agendar Cita"
                  description="Programar consulta"
                  onClick={() => navigate("/medical/appointments")}
                  color="green"
                />
                <QuickActionCard
                  icon={Ambulance}
                  title="Código Emergencia"
                  description="Activar protocolo"
                  onClick={() => navigate("/medical/emergency-protocols")}
                  color="red"
                />
                <QuickActionCard
                  icon={TestTube}
                  title="Solicitar Lab"
                  description="Exámenes médicos"
                  onClick={() => navigate("/medical/labs-imaging")}
                  color="purple"
                />
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="card-modern">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MonitorSpeaker className="w-5 h-5 text-emerald-500" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium">Servicios</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    Activo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Base de Datos</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    99.9%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium">Notificaciones</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                    3 pendientes
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Recent Patients */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="card-modern">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Pacientes Recientes
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredPatients.slice(0, 6).map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
                </div>
                
                {filteredPatients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No se encontraron pacientes
                    </h3>
                    <p className="text-muted-foreground">
                      Intente ajustar los filtros de búsqueda
                    </p>
                  </div>
                )}

                {filteredPatients.length > 0 && (
                  <div className="text-center pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/medical/active-patients")}
                    >
                      Ver todos los pacientes
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Navigation Grid */}
        <div className="mt-8">
          <Card className="card-modern">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Módulos del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/medical/admissions")}
                >
                  <Bed className="w-6 h-6" />
                  <span className="text-sm">Admisiones</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/medical/surgeries")}
                >
                  <Activity className="w-6 h-6" />
                  <span className="text-sm">Cirugías</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/medical/pharmacy")}
                >
                  <Pill className="w-6 h-6" />
                  <span className="text-sm">Farmacia</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/medical/icu-monitoring")}
                >
                  <MonitorSpeaker className="w-6 h-6" />
                  <span className="text-sm">UCI</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/medical/reports")}
                >
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Reportes</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/medical/telemedicine")}
                >
                  <Shield className="w-6 h-6" />
                  <span className="text-sm">Telemedicina</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
