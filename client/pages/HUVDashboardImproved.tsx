import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Heart,
  Search,
  Filter,
  FileText,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Users,
  Hospital,
  Shield,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

// Mock patient data
const mockPatients = [
  {
    id: 1,
    identificationType: "CC",
    identificationNumber: "12345678",
    fullName: "Juan Carlos Pérez González",
    eps: "NUEVA_EPS",
    age: 45,
    symptoms: "Dolor torácico agudo, dificultad respiratoria",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 14:30",
    status: "PENDING",
    priority: "ALTA",
    vitals: { heartRate: "120", temperature: "38.5", bloodPressure: "160/95" },
  },
  {
    id: 2,
    identificationType: "CC",
    identificationNumber: "87654321",
    fullName: "María Elena Rodríguez Vargas",
    eps: "SANITAS",
    age: 32,
    symptoms: "Dolor abdominal severo, náuseas y vómito",
    urgencyLevel: "SEVERO",
    arrivalTime: "2024-01-15 15:15",
    status: "PENDING",
    priority: "MEDIA",
    vitals: { heartRate: "95", temperature: "37.8", bloodPressure: "140/85" },
  },
  {
    id: 3,
    identificationType: "CC",
    identificationNumber: "11223344",
    fullName: "Carlos Alberto Mendoza Silva",
    eps: "FAMISANAR",
    age: 58,
    symptoms: "Accidente de tránsito, posible fractura de fémur",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 16:00",
    status: "PENDING",
    priority: "ALTA",
    vitals: { heartRate: "110", temperature: "36.8", bloodPressure: "150/90" },
  },
  {
    id: 4,
    identificationType: "CC",
    identificationNumber: "55667788",
    fullName: "Ana Sofia Gutierrez López",
    eps: "SURA",
    age: 28,
    symptoms: "Control prenatal, embarazo de alto riesgo",
    urgencyLevel: "MODERADO",
    arrivalTime: "2024-01-15 16:30",
    status: "AUTHORIZED",
    priority: "MEDIA",
    vitals: { heartRate: "88", temperature: "36.5", bloodPressure: "130/80" },
  },
];

export default function HUVDashboardImproved() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [priorityRating, setPriorityRating] = useState("");
  const [authorizationNotes, setAuthorizationNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleAuthorize = (patientId: number, authorized: boolean) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: authorized ? "AUTHORIZED" : "REJECTED" }
          : p,
      ),
    );
  };

  const handleSetPriority = (patientId: number, priority: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, urgencyLevel: priority } : p,
      ),
    );
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "critico":
        return "bg-red-100 text-red-800 border-red-200";
      case "severo":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "moderado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AUTHORIZED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesStatus = filterStatus === "ALL" || patient.status === filterStatus;
    const matchesSearch = 
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.identificationNumber.includes(searchTerm) ||
      patient.eps.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending: patients.filter(p => p.status === "PENDING").length,
    authorized: patients.filter(p => p.status === "AUTHORIZED").length,
    rejected: patients.filter(p => p.status === "REJECTED").length,
    critical: patients.filter(p => p.urgencyLevel === "CRITICO").length,
  };

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    color, 
    trend,
    onClick 
  }: {
    icon: any;
    title: string;
    value: number;
    color: string;
    trend?: string;
    onClick?: () => void;
  }) => (
    <Card 
      className={cn(
        "card-modern cursor-pointer transition-all duration-300 hover:shadow-medium",
        onClick && "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn("w-5 h-5", color)} />
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className="text-sm text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          {onClick && (
            <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const PatientCard = ({ patient }: { patient: any }) => (
    <Card className={cn(
      "card-modern transition-all duration-300",
      patient.urgencyLevel === "CRITICO" && "priority-critical",
      patient.urgencyLevel === "SEVERO" && "priority-high",
      patient.urgencyLevel === "MODERADO" && "priority-medium"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {patient.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{patient.fullName}</h3>
                <Badge className={getPriorityColor(patient.urgencyLevel)}>
                  {patient.urgencyLevel}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>{patient.identificationType}: {patient.identificationNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{patient.arrivalTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  <span>{patient.eps}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(patient.status)}>
            {patient.status === "PENDING" ? "Pendiente" :
             patient.status === "AUTHORIZED" ? "Autorizado" : "Rechazado"}
          </Badge>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-foreground">{patient.symptoms}</p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPatient(patient)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Evaluar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Evaluación de Remisión Médica</DialogTitle>
              </DialogHeader>
              {selectedPatient && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Paciente</Label>
                      <p>{selectedPatient.fullName}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Identificación</Label>
                      <p>{selectedPatient.identificationType}: {selectedPatient.identificationNumber}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">EPS</Label>
                      <p>{selectedPatient.eps}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Edad</Label>
                      <p>{selectedPatient.age} años</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="font-semibold">Síntomas Reportados</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedPatient.symptoms}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="font-semibold">Frecuencia Cardíaca</Label>
                      <p>{selectedPatient.vitals.heartRate} bpm</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Temperatura</Label>
                      <p>{selectedPatient.vitals.temperature}°C</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Presión Arterial</Label>
                      <p>{selectedPatient.vitals.bloodPressure} mmHg</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="font-semibold">Prioridad Hospitalaria</Label>
                    <Select value={priorityRating} onValueChange={setPriorityRating}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Seleccionar prioridad de atención" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICO">Crítico - Atención Inmediata</SelectItem>
                        <SelectItem value="SEVERO">Severo - Atención Urgente</SelectItem>
                        <SelectItem value="MODERADO">Moderado - Atención Programada</SelectItem>
                        <SelectItem value="LEVE">Leve - Consulta Externa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="font-semibold">Observaciones Médicas</Label>
                    <Textarea
                      id="notes"
                      value={authorizationNotes}
                      onChange={(e) => setAuthorizationNotes(e.target.value)}
                      placeholder="Ingrese observaciones, recomendaciones o justificación de la decisión..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleAuthorize(selectedPatient.id, false);
                        setSelectedPatient(null);
                        setPriorityRating("");
                        setAuthorizationNotes("");
                      }}
                      className="gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar Remisión
                    </Button>
                    <Button
                      onClick={() => {
                        handleAuthorize(selectedPatient.id, true);
                        if (priorityRating) {
                          handleSetPriority(selectedPatient.id, priorityRating);
                        }
                        setSelectedPatient(null);
                        setPriorityRating("");
                        setAuthorizationNotes("");
                      }}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Autorizar Admisión
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
            userName="Dr. Hospital HUV"
            userRole="Evaluador de Remisiones"
            notifications={stats.pending}
          />
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard HUV - Remisiones
              </h1>
              <p className="text-muted-foreground">
                Sistema de evaluación y autorización de remisiones médicas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Clock}
            title="Pendientes de Evaluación"
            value={stats.pending}
            color="text-blue-600"
            trend="Requieren atención"
            onClick={() => setFilterStatus("PENDING")}
          />
          <StatCard
            icon={CheckCircle}
            title="Autorizadas"
            value={stats.authorized}
            color="text-emerald-600"
            trend="Procesadas hoy"
            onClick={() => setFilterStatus("AUTHORIZED")}
          />
          <StatCard
            icon={XCircle}
            title="Rechazadas"
            value={stats.rejected}
            color="text-red-600"
            trend="Requieren seguimiento"
            onClick={() => setFilterStatus("REJECTED")}
          />
          <StatCard
            icon={AlertTriangle}
            title="Casos Críticos"
            value={stats.critical}
            color="text-orange-600"
            trend="Atención inmediata"
          />
        </div>

        {/* Filters and Search */}
        <Card className="card-modern mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, documento o EPS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros Avanzados
                </Button>
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los Estados</SelectItem>
                  <SelectItem value="PENDING">Pendientes</SelectItem>
                  <SelectItem value="AUTHORIZED">Autorizados</SelectItem>
                  <SelectItem value="REJECTED">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <Card className="card-modern">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron remisiones
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "ALL" 
                  ? "Intente ajustar los filtros de búsqueda"
                  : "No hay remisiones pendientes en este momento"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
