import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Clock,
  Calendar,
  FileText,
  Heart,
  Activity,
  Pill,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowLeft,
  Filter,
  Search,
  User,
  Bed,
  Stethoscope,
  Phone,
  MapPin,
  AlertCircle,
  MoreHorizontal,
  Plus,
  Download,
  ArrowUpRight,
  MonitorSpeaker,
  TestTube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useMedicalData } from "@/context/MedicalDataContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

export default function ActivePatientsImproved() {
  const { t, language } = useLanguage();
  const { activePatients } = useMedicalData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [viewMode, setViewMode] = useState("grid");

  const filteredPatients = activePatients.filter((patient) => {
    const matchesSearch =
      patient.personalInfo.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.personalInfo.identificationNumber.includes(searchTerm);
    const matchesPriority =
      selectedPriority === "ALL" ||
      patient.currentStatus.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === "ALL" ||
      patient.currentStatus.status === selectedStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const stats = {
    total: activePatients.length,
    critical: activePatients.filter(
      (p) => p.currentStatus.priority === "critical",
    ).length,
    high: activePatients.filter((p) => p.currentStatus.priority === "high")
      .length,
    admitted: activePatients.filter((p) => p.currentStatus.status === "active")
      .length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "crítico":
        return "bg-red-100 text-red-800 border-red-200";
      case "alto":
        return "bg-red-100 text-red-800 border-red-200";
      case "medio":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "bajo":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "emergencia":
        return "bg-red-100 text-red-800 border-red-200";
      case "alta":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
    subtitle,
  }: {
    icon: any;
    title: string;
    value: number;
    color: string;
    subtitle?: string;
  }) => (
    <Card className="card-modern">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn("w-5 h-5", color)} />
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PatientCard = ({ patient }: { patient: any }) => (
    <Card
      className={cn(
        "card-modern transition-all duration-300 hover:shadow-medium",
        patient.currentStatus.priority === "crítico" &&
          "border-l-4 border-l-red-500",
        patient.currentStatus.priority === "alto" &&
          "border-l-4 border-l-red-500",
        patient.currentStatus.priority === "medio" &&
          "border-l-4 border-l-slate-500",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-sm">
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
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>
                    {patient.personalInfo.identificationType}:{" "}
                    {patient.personalInfo.identificationNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Edad: {patient.personalInfo.age} años</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  <span>EPS: {patient.epsInfo.eps}</span>
                </div>
                {patient.currentStatus.assignedDoctor && (
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-3 h-3" />
                    <span>Dr. {patient.currentStatus.assignedDoctor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(patient.currentStatus.status)}>
            {patient.currentStatus.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/patient/${patient.id}`)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPatient(patient)}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Información del Paciente</DialogTitle>
              </DialogHeader>
              {selectedPatient && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Nombre Completo</Label>
                      <p>{selectedPatient.personalInfo.fullName}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Identificación</Label>
                      <p>
                        {selectedPatient.personalInfo.identificationType}:{" "}
                        {selectedPatient.personalInfo.identificationNumber}
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold">Edad</Label>
                      <p>{selectedPatient.personalInfo.age} años</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Sexo</Label>
                      <p>{selectedPatient.personalInfo.sex}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">EPS</Label>
                      <p>{selectedPatient.epsInfo.eps}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Estado</Label>
                      <Badge
                        className={getStatusColor(
                          selectedPatient.currentStatus.status,
                        )}
                      >
                        {selectedPatient.currentStatus.status}
                      </Badge>
                    </div>
                  </div>

                  {selectedPatient.medicalInfo && (
                    <div>
                      <Label className="font-semibold">
                        Información Médica
                      </Label>
                      <div className="mt-2 space-y-2 text-sm">
                        <p>
                          <strong>Síntomas:</strong>{" "}
                          {selectedPatient.medicalInfo.symptoms}
                        </p>
                        <p>
                          <strong>Diagnóstico:</strong>{" "}
                          {selectedPatient.medicalInfo.diagnosis}
                        </p>
                        <p>
                          <strong>Medicamentos:</strong>{" "}
                          {selectedPatient.medicalInfo.medications}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                    <Button
                      onClick={() => navigate(`/patient/${selectedPatient.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Completo
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 border-b">
        <div className="container mx-auto px-6 py-4">
          <NavigationImproved
            userName="Dr. Médico"
            userRole="Especialista"
            notifications={stats.critical}
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
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Pacientes Activos
              </h1>
              <p className="text-muted-foreground">
                Gestión y seguimiento de pacientes en el sistema
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Paciente
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Pacientes"
            value={stats.total}
            color="text-blue-600"
            subtitle="En sistema"
          />
          <StatCard
            icon={AlertTriangle}
            title="Estado Crítico"
            value={stats.critical}
            color="text-red-600"
            subtitle="Atención inmediata"
          />
          <StatCard
            icon={Activity}
            title="Prioridad Alta"
            value={stats.high}
            color="text-red-600"
            subtitle="Seguimiento urgente"
          />
          <StatCard
            icon={Bed}
            title="Hospitalizados"
            value={stats.admitted}
            color="text-green-600"
            subtitle="En observación"
          />
        </div>

        {/* Filters */}
        <Card className="card-modern mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>
              </div>

              <div className="flex gap-3">
                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    <SelectItem value="crítico">Crítico</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="bajo">Bajo</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="emergencia">Emergencia</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <Card className="card-modern">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron pacientes
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                selectedPriority !== "ALL" ||
                selectedStatus !== "ALL"
                  ? "Intente ajustar los filtros de búsqueda"
                  : "No hay pacientes activos en el sistema"}
              </p>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar Nuevo Paciente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
