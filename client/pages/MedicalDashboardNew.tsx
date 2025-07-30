import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  TrendingUp,
  Heart,
  Phone,
  UserCheck,
  LogOut,
  Search,
  Filter,
  BarChart3,
  Clock,
  Shield,
  Building,
  BookOpen,
  Settings,
  Bell,
  MoreVertical,
  ChevronRight,
  Eye,
  Edit,
  FileText,
  UserPlus,
  Pill,
  TestTube,
  Ambulance,
  MonitorSpeaker,
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

export default function MedicalDashboardNew() {
  const { t, language } = useLanguage();
  const {
    patients,
    activePatients,
    getStatistics,
    getActiveEmergencies,
    getTodaysAppointments,
    getPendingLabTests,
    getAvailableBeds,
  } = useMedicalData();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    emergencies: 0,
    availableBeds: 0,
    todaysAppointments: 0,
    pendingLabTests: 0,
  });

  useEffect(() => {
    const statistics = getStatistics();
    setStats({
      ...statistics,
      emergencies: getActiveEmergencies().length,
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
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
      case "alto":
      case "severo":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
      case "medio":
      case "moderado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
      case "bajo":
      case "leve":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "activo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "emergency":
      case "emergencia":
        return "bg-red-100 text-red-800 border-red-200";
      case "discharged":
      case "alta":
        return "bg-green-100 text-green-800 border-green-200";
      case "transferred":
      case "transferido":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
    trend,
  }: {
    icon: any;
    title: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "stable";
  }) => (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-sm flex items-center gap-1 mt-1",
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-gray-600",
                )}
              >
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {trend === "down" && (
                  <TrendingUp className="w-3 h-3 rotate-180" />
                )}
                {change}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
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
      className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              color === "blue" && "bg-blue-100 text-blue-600",
              color === "green" && "bg-green-100 text-green-600",
              color === "orange" && "bg-orange-100 text-orange-600",
              color === "purple" && "bg-purple-100 text-purple-600",
              color === "red" && "bg-red-100 text-red-600",
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  const PatientCard = ({ patient }: { patient: any }) => (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              {patient.personalInfo.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">
                  {patient.personalInfo.fullName}
                </h3>
                <Badge
                  className={getPriorityColor(patient.currentStatus.priority)}
                >
                  {patient.currentStatus.priority}
                </Badge>
                <Badge className={getStatusColor(patient.currentStatus.status)}>
                  {t(`status.${patient.currentStatus.status}`)}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  {patient.personalInfo.identificationType}:{" "}
                  {patient.personalInfo.identificationNumber}
                </p>
                <p>
                  {t("field.age")}: {patient.personalInfo.age} {t("field.sex")}:{" "}
                  {patient.personalInfo.sex}
                </p>
                <p>
                  {t("field.eps")}: {patient.epsInfo.eps}
                </p>
                <p>
                  {t("patients.assignedDoctor")}:{" "}
                  {patient.currentStatus.assignedDoctor || t("msg.noData")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              {t("btn.view")}
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t("dashboard.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("dashboard.welcome")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                {t("dashboard.notifications")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("nav.logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            icon={Users}
            title={t("dashboard.activePatients")}
            value={stats.activePatients}
            change="+12%"
            trend="up"
          />
          <StatCard
            icon={AlertTriangle}
            title={t("dashboard.emergencies")}
            value={stats.emergencies}
            change={stats.emergencies > 0 ? "ACTIVA" : "NORMAL"}
            trend={stats.emergencies > 0 ? "down" : "stable"}
          />
          <StatCard
            icon={Calendar}
            title={t("dashboard.appointments")}
            value={stats.todaysAppointments}
            change="Hoy"
            trend="stable"
          />
          <StatCard
            icon={Bed}
            title={t("beds.available")}
            value={stats.availableBeds}
            change="85% ocupación"
            trend="down"
          />
          <StatCard
            icon={TestTube}
            title={t("lab.pending")}
            value={stats.pendingLabTests}
            change="2h promedio"
            trend="stable"
          />
          <StatCard
            icon={Heart}
            title={t("patients.list")}
            value={stats.totalPatients}
            change="+5 nuevos"
            trend="up"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={selectedView}
          onValueChange={setSelectedView}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-7">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {t("dashboard.statistics")}
            </TabsTrigger>
            <TabsTrigger value="patients" className="gap-2">
              <Users className="w-4 h-4" />
              {t("patients.title")}
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t("emergency.title")}
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="w-4 h-4" />
              {t("appointments.title")}
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              {t("reports.title")}
            </TabsTrigger>
            <TabsTrigger value="beds" className="gap-2 hidden lg:flex">
              <Bed className="w-4 h-4" />
              {t("beds.title")}
            </TabsTrigger>
            <TabsTrigger value="labs" className="gap-2 hidden lg:flex">
              <TestTube className="w-4 h-4" />
              {t("lab.title")}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {t("dashboard.statistics")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {stats.activePatients}
                        </p>
                        <p className="text-sm text-blue-600">
                          {t("dashboard.activePatients")}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {stats.availableBeds}
                        </p>
                        <p className="text-sm text-green-600">
                          {t("beds.available")}
                        </p>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold text-gray-700">
                        {language === "es"
                          ? "Ocupación Hospitalaria"
                          : "Hospital Occupancy"}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round(
                          ((stats.totalPatients - stats.availableBeds) /
                            stats.totalPatients) *
                            100,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    {language === "es" ? "Acciones Rápidas" : "Quick Actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <QuickActionCard
                    icon={UserPlus}
                    title={t("patients.add")}
                    description={
                      language === "es"
                        ? "Registrar nuevo paciente"
                        : "Register new patient"
                    }
                    onClick={() => navigate("/medical/active-patients")}
                    color="blue"
                  />
                  <QuickActionCard
                    icon={Ambulance}
                    title={t("emergency.activate")}
                    description={
                      language === "es"
                        ? "Activar código de emergencia"
                        : "Activate emergency code"
                    }
                    onClick={() => navigate("/medical/emergency-protocols")}
                    color="red"
                  />
                  <QuickActionCard
                    icon={Calendar}
                    title={t("appointments.schedule")}
                    description={
                      language === "es"
                        ? "Programar nueva cita"
                        : "Schedule new appointment"
                    }
                    onClick={() => navigate("/medical/appointments")}
                    color="green"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("patients.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {t("patients.filter")}
                </Button>
              </div>
              <Button
                className="gap-2"
                onClick={() => navigate("/medical/active-patients")}
              >
                <UserPlus className="w-4 h-4" />
                {t("patients.add")}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPatients.slice(0, 10).map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("msg.noData")}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "es"
                      ? "No se encontraron pacientes con los criterios de búsqueda"
                      : "No patients found with search criteria"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    {t("emergency.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      size="lg"
                    >
                      <Ambulance className="w-5 h-5 mr-2" />
                      {t("emergency.activate")}
                    </Button>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">
                        {stats.emergencies}
                      </p>
                      <p className="text-sm text-red-600">
                        {language === "es"
                          ? "Emergencias Activas"
                          : "Active Emergencies"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>
                    {language === "es"
                      ? "Protocolos de Emergencia"
                      : "Emergency Protocols"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickActionCard
                      icon={Heart}
                      title={language === "es" ? "Código Azul" : "Code Blue"}
                      description={
                        language === "es"
                          ? "Paro cardiorrespiratorio"
                          : "Cardiac arrest"
                      }
                      onClick={() => {}}
                      color="blue"
                    />
                    <QuickActionCard
                      icon={AlertTriangle}
                      title={language === "es" ? "Código Rojo" : "Code Red"}
                      description={
                        language === "es"
                          ? "Incendio/Evacuación"
                          : "Fire/Evacuation"
                      }
                      onClick={() => {}}
                      color="red"
                    />
                    <QuickActionCard
                      icon={Shield}
                      title={language === "es" ? "Código Gris" : "Code Gray"}
                      description={
                        language === "es"
                          ? "Seguridad/Combativo"
                          : "Security/Combative"
                      }
                      onClick={() => {}}
                      color="orange"
                    />
                    <QuickActionCard
                      icon={Building}
                      title={language === "es" ? "Código Verde" : "Code Green"}
                      description={
                        language === "es"
                          ? "Emergencia externa"
                          : "External emergency"
                      }
                      onClick={() => {}}
                      color="green"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs can be implemented similarly */}
          <TabsContent value="appointments">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("appointments.title")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "es"
                    ? "Gestión completa de citas médicas"
                    : "Complete medical appointment management"}
                </p>
                <Button onClick={() => navigate("/medical/appointments")}>
                  {language === "es" ? "Ir a Citas" : "Go to Appointments"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("reports.title")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "es"
                    ? "Reportes y análisis médicos"
                    : "Medical reports and analytics"}
                </p>
                <Button onClick={() => navigate("/medical/reports")}>
                  {language === "es" ? "Ver Reportes" : "View Reports"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beds">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Bed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("beds.title")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "es"
                    ? "Control de camas y hospitalización"
                    : "Bed control and hospitalization"}
                </p>
                <Button onClick={() => navigate("/medical/beds-management")}>
                  {language === "es" ? "Gestionar Camas" : "Manage Beds"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <TestTube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("lab.title")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "es"
                    ? "Laboratorio e imágenes diagnósticas"
                    : "Laboratory and diagnostic imaging"}
                </p>
                <Button onClick={() => navigate("/medical/labs-imaging")}>
                  {language === "es" ? "Ver Laboratorio" : "View Laboratory"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
