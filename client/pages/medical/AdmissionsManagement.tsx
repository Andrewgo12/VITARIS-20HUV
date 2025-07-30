import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  Bed,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  FileText,
  Phone,
  Mail,
  User,
  Activity,
  Stethoscope,
  Building,
  Car,
  CreditCard,
  Plus,
} from "lucide-react";
import NewAdmissionModal from "@/components/modals/NewAdmissionModal";
import PatientDischargeModal from "@/components/modals/PatientDischargeModal";
import { useToast } from "@/hooks/use-toast";

// Mock data para admisiones
const mockAdmissions = [
  {
    id: "ADM-2024-001",
    patient: {
      id: "P001",
      name: "María Elena Rodríguez",
      age: 67,
      gender: "Femenino",
      document: "CC 12345678",
      bloodType: "O+",
      phone: "+57 301 234 5678",
      emergencyContact: "José Rodríguez - +57 320 987 6543",
    },
    admission: {
      date: "2024-01-15",
      time: "08:30",
      type: "URGENTE",
      department: "Cardiología",
      doctor: "Dr. Carlos Mendoza",
      diagnosis: "Síndrome coronario agudo",
      room: "UCI-101",
      bed: "Cama 1",
      status: "ACTIVA",
      expectedStay: "3-5 días",
      insurance: "Nueva EPS",
      authorization: "AUT-2024-001567",
    },
    vitals: {
      current: {
        bp: "180/95",
        hr: "120",
        temp: "38.5",
        spo2: "89",
        rr: "28",
      },
      stable: false,
    },
    treatment: {
      plan: "Manejo de síndrome coronario agudo con monitoreo continuo",
      medications: ["Aspirina 100mg", "Atorvastatina 40mg", "Metoprolol 50mg"],
      procedures: ["ECG seriados", "Monitoreo cardiaco", "Laboratorios c/6h"],
    },
    costs: {
      roomCost: 150000,
      treatmentCost: 250000,
      totalEstimated: 850000,
      insurance: "Cubierto 80%",
    },
  },
  {
    id: "ADM-2024-002",
    patient: {
      id: "P002",
      name: "Carlos Alberto Vásquez",
      age: 34,
      gender: "Masculino",
      document: "CC 23456789",
      bloodType: "A+",
      phone: "+57 312 456 7890",
      emergencyContact: "Laura Vásquez - +57 315 678 9012",
    },
    admission: {
      date: "2024-01-15",
      time: "10:15",
      type: "PROGRAMADA",
      department: "Traumatología",
      doctor: "Dra. Ana Martínez",
      diagnosis: "Fractura expuesta tibia y peroné",
      room: "TRAUMA-205",
      bed: "Cama 3",
      status: "PRE-QUIRURGICA",
      expectedStay: "5-7 días",
      insurance: "Sanitas EPS",
      authorization: "AUT-2024-001568",
    },
    vitals: {
      current: {
        bp: "140/85",
        hr: "95",
        temp: "37.2",
        spo2: "96",
        rr: "22",
      },
      stable: true,
    },
    treatment: {
      plan: "Reducción abierta con fijación interna de fractura",
      medications: ["Morfina 10mg PRN", "Clindamicina 600mg"],
      procedures: [
        "Cirugía programada",
        "Rx control",
        "Profilaxis antibiótica",
      ],
    },
    costs: {
      roomCost: 120000,
      treatmentCost: 450000,
      totalEstimated: 1200000,
      insurance: "Cubierto 100%",
    },
  },
  {
    id: "ADM-2024-003",
    patient: {
      id: "P003",
      name: "Ana Sofía Herrera",
      age: 28,
      gender: "Femenino",
      document: "CC 34567890",
      bloodType: "B+",
      phone: "+57 304 123 4567",
      emergencyContact: "Miguel Herrera - +57 318 234 5678",
    },
    admission: {
      date: "2024-01-14",
      time: "22:30",
      type: "URGENTE",
      department: "Cirugía General",
      doctor: "Dr. Luis González",
      diagnosis: "Apendicitis aguda",
      room: "CIR-308",
      bed: "Cama 2",
      status: "POST-QUIRURGICA",
      expectedStay: "2-3 días",
      insurance: "Compensar EPS",
      authorization: "AUT-2024-001569",
    },
    vitals: {
      current: {
        bp: "125/80",
        hr: "88",
        temp: "37.0",
        spo2: "98",
        rr: "18",
      },
      stable: true,
    },
    treatment: {
      plan: "Post-operatorio de apendicectomía laparoscópica",
      medications: ["Metamizol 500mg", "Omeprazol 40mg"],
      procedures: [
        "Vigilancia post-quirúrgica",
        "Dieta progresiva",
        "Deambulación temprana",
      ],
    },
    costs: {
      roomCost: 100000,
      treatmentCost: 350000,
      totalEstimated: 650000,
      insurance: "Cubierto 90%",
    },
  },
];

// Camas disponibles
const mockBeds = [
  {
    id: "UCI-102",
    type: "UCI",
    status: "DISPONIBLE",
    department: "Cardiología",
  },
  {
    id: "UCI-103",
    type: "UCI",
    status: "DISPONIBLE",
    department: "Cardiología",
  },
  {
    id: "MED-401",
    type: "General",
    status: "DISPONIBLE",
    department: "Medicina Interna",
  },
  {
    id: "MED-402",
    type: "General",
    status: "OCUPADA",
    department: "Medicina Interna",
  },
  {
    id: "CIR-309",
    type: "Quirúrgica",
    status: "DISPONIBLE",
    department: "Cirugía",
  },
  {
    id: "TRAUMA-206",
    type: "Trauma",
    status: "MANTENIMIENTO",
    department: "Traumatología",
  },
];

export default function AdmissionsManagement() {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState(mockAdmissions);
  const [beds, setBeds] = useState(mockBeds);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [showNewAdmission, setShowNewAdmission] = useState(false);
  const [showDischarge, setShowDischarge] = useState(false);
  const [dischargeAdmission, setDischargeAdmission] = useState<any>(null);
  const { toast } = useToast();
  const {
    activePatients,
    admissionRequests,
    beds,
    createAdmissionRequest,
    updateAdmissionRequest,
    getPendingAdmissions,
    getAvailableBeds,
    saveToLocal
  } = useMedicalData();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-save data when admissions change
  useEffect(() => {
    // Store admissions data as JSON
    localStorage.setItem('admissions-management-data', JSON.stringify(admissions));
    saveToLocal();
  }, [admissions, saveToLocal]);

  const handleNewAdmissionCreated = (newAdmission: any) => {
    // Add the new admission to the list
    setAdmissions((prev) => [newAdmission, ...prev]);

    // Update beds if a room was assigned
    if (newAdmission.room) {
      setBeds((prev) =>
        prev.map((bed) =>
          bed.id === newAdmission.room ? { ...bed, status: "OCUPADA" } : bed,
        ),
      );
    }

    toast({
      title: "Nueva admisión registrada",
      description: `Se ha registrado exitosamente la admisión de ${newAdmission.patientName}`,
    });
  };

  const handleDischargePatient = (admission: any) => {
    setDischargeAdmission(admission);
    setShowDischarge(true);
  };

  const handleDischargeCompleted = (dischargeRecord: any) => {
    // Update admission status to discharged
    setAdmissions((prev) =>
      prev.map((admission) =>
        admission.id === dischargeRecord.admissionId
          ? {
              ...admission,
              admission: { ...admission.admission, status: "ALTA" },
            }
          : admission,
      ),
    );

    // Free up the bed
    if (dischargeAdmission?.admission?.room) {
      setBeds((prev) =>
        prev.map((bed) =>
          bed.id === dischargeAdmission.admission.room
            ? { ...bed, status: "LIMPIEZA" }
            : bed,
        ),
      );
    }

    setDischargeAdmission(null);
    setShowDischarge(false);

    toast({
      title: "Alta procesada",
      description: `Se ha procesado exitosamente el alta de ${dischargeRecord.patientName}`,
    });
  };

  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      admission.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.admission.diagnosis
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      admission.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || admission.admission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVA":
        return "bg-blue-500 text-white";
      case "PRE-QUIRURGICA":
        return "bg-slate-500 text-white";
      case "POST-QUIRURGICA":
        return "bg-green-500 text-white";
      case "ALTA":
        return "bg-gray-500 text-white";
      case "TRANSFERENCIA":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getAdmissionTypeColor = (type: string) => {
    switch (type) {
      case "URGENTE":
        return "text-red-600";
      case "PROGRAMADA":
        return "text-blue-600";
      case "TRANSFERENCIA":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIBLE":
        return "bg-green-100 text-green-800";
      case "OCUPADA":
        return "bg-red-100 text-red-800";
      case "MANTENIMIENTO":
        return "bg-slate-100 text-slate-800";
      case "LIMPIEZA":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: admissions.length,
    active: admissions.filter((a) => a.admission.status === "ACTIVA").length,
    preOp: admissions.filter((a) => a.admission.status === "PRE-QUIRURGICA")
      .length,
    postOp: admissions.filter((a) => a.admission.status === "POST-QUIRURGICA")
      .length,
    availableBeds: beds.filter((b) => b.status === "DISPONIBLE").length,
    occupiedBeds: beds.filter((b) => b.status === "OCUPADA").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/system")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Sistema
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gestión de Admisiones
              </h1>
              <p className="text-muted-foreground">
                Control completo de admisiones, altas y gestión de camas -{" "}
                {currentTime.toLocaleDateString("es-CO")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowNewAdmission(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="w-4 h-4" />
              Nueva Admisión
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Show list of patients eligible for discharge
                const eligiblePatients = admissions.filter(
                  (a) =>
                    a.admission.status === "ACTIVA" ||
                    a.admission.status === "POST-QUIRURGICA",
                );
                if (eligiblePatients.length > 0) {
                  // For demo, select first eligible patient
                  handleDischargePatient(eligiblePatients[0]);
                } else {
                  toast({
                    title: "No hay pacientes elegibles",
                    description: "No hay pacientes activos para dar de alta",
                    variant: "destructive",
                  });
                }
              }}
              className="flex items-center gap-2"
            >
              <UserMinus className="w-4 h-4" />
              Dar de Alta
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Admisiones
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.active}
              </div>
              <div className="text-sm text-muted-foreground">Activas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-600">
                {stats.preOp}
              </div>
              <div className="text-sm text-muted-foreground">
                Pre-Quirúrgicas
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.postOp}
              </div>
              <div className="text-sm text-muted-foreground">
                Post-Quirúrgicas
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.availableBeds}
              </div>
              <div className="text-sm text-muted-foreground">
                Camas Disponibles
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.occupiedBeds}
              </div>
              <div className="text-sm text-muted-foreground">
                Camas Ocupadas
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="admissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="admissions" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Admisiones Activas
            </TabsTrigger>
            <TabsTrigger value="beds" className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Gestión de Camas
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Transferencias
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Facturación
            </TabsTrigger>
          </TabsList>

          {/* Admisiones Activas */}
          <TabsContent value="admissions" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros de Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Buscar Paciente</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nombre, diagnóstico, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado de Admisión</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="ACTIVA">Activa</SelectItem>
                        <SelectItem value="PRE-QUIRURGICA">
                          Pre-quirúrgica
                        </SelectItem>
                        <SelectItem value="POST-QUIRURGICA">
                          Post-quirúrgica
                        </SelectItem>
                        <SelectItem value="TRANSFERENCIA">
                          Transferencia
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Admisiones */}
            <div className="space-y-4">
              {filteredAdmissions.map((admission) => (
                <Card
                  key={admission.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Información del Paciente */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">
                            {admission.patient.name}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Edad:</strong> {admission.patient.age} años
                          </div>
                          <div>
                            <strong>Documento:</strong>{" "}
                            {admission.patient.document}
                          </div>
                          <div>
                            <strong>Tipo de sangre:</strong>{" "}
                            {admission.patient.bloodType}
                          </div>
                          <div>
                            <strong>Teléfono:</strong> {admission.patient.phone}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <strong>Contacto emergencia:</strong>{" "}
                            {admission.patient.emergencyContact}
                          </div>
                        </div>
                      </div>

                      {/* Información de Admisión */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Admisión</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getStatusColor(
                                admission.admission.status,
                              )}
                            >
                              {admission.admission.status}
                            </Badge>
                            <span
                              className={`font-medium ${getAdmissionTypeColor(admission.admission.type)}`}
                            >
                              {admission.admission.type}
                            </span>
                          </div>
                          <div>
                            <strong>ID:</strong> {admission.id}
                          </div>
                          <div>
                            <strong>Fecha:</strong> {admission.admission.date} -{" "}
                            {admission.admission.time}
                          </div>
                          <div>
                            <strong>Departamento:</strong>{" "}
                            {admission.admission.department}
                          </div>
                          <div>
                            <strong>Médico:</strong>{" "}
                            {admission.admission.doctor}
                          </div>
                          <div>
                            <strong>Diagnóstico:</strong>{" "}
                            {admission.admission.diagnosis}
                          </div>
                        </div>
                      </div>

                      {/* Ubicación y Signos Vitales */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Ubicación & Vitales</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Habitación:</strong>{" "}
                            {admission.admission.room}
                          </div>
                          <div>
                            <strong>Cama:</strong> {admission.admission.bed}
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between">
                              <span>PA:</span>
                              <span className="font-mono">
                                {admission.vitals.current.bp}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>FC:</span>
                              <span className="font-mono">
                                {admission.vitals.current.hr} lpm
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>T°:</span>
                              <span className="font-mono">
                                {admission.vitals.current.temp}°C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>SpO2:</span>
                              <span className="font-mono">
                                {admission.vitals.current.spo2}%
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge
                              variant={
                                admission.vitals.stable
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {admission.vitals.stable
                                ? "Estable"
                                : "Inestable"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-red-600" />
                          <h4 className="font-semibold">Acciones</h4>
                        </div>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              navigate(`/patient/${admission.patient.id}`)
                            }
                          >
                            Ver Historia Clínica
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedAdmission(admission)}
                          >
                            Actualizar Estado
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            Transferir Cama
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleDischargePatient(admission)}
                          >
                            Programar Alta
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>
                            <strong>Estancia esperada:</strong>{" "}
                            {admission.admission.expectedStay}
                          </div>
                          <div>
                            <strong>Seguro:</strong>{" "}
                            {admission.admission.insurance}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gestión de Camas */}
          <TabsContent value="beds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  Estado de Camas por Departamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {beds.map((bed) => (
                    <Card key={bed.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{bed.id}</h4>
                          <Badge className={getBedStatusColor(bed.status)}>
                            {bed.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Tipo:</strong> {bed.type}
                          </div>
                          <div>
                            <strong>Departamento:</strong> {bed.department}
                          </div>
                        </div>
                        {bed.status === "DISPONIBLE" && (
                          <Button size="sm" className="w-full mt-3">
                            Asignar Paciente
                          </Button>
                        )}
                        {bed.status === "OCUPADA" && (
                          <div className="mt-3 space-y-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Ver Paciente
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Programar Limpieza
                            </Button>
                          </div>
                        )}
                        {bed.status === "MANTENIMIENTO" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-3"
                          >
                            Finalizar Mantenimiento
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transferencias */}
          <TabsContent value="transfers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Gestión de Transferencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Solicitudes de Transferencia */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Solicitudes Pendientes</h4>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva
                      </Button>
                    </div>

                    {[
                      {
                        id: "T001",
                        patient: "María González",
                        from: "Urgencias",
                        to: "Hospital San Juan - UCI",
                        reason: "Requiere ventilación mecánica",
                        priority: "URGENT",
                        requestTime: "14:30",
                      },
                      {
                        id: "T002",
                        patient: "Carlos Ruiz",
                        from: "Medicina Interna",
                        to: "Hospital Nacional",
                        reason: "Cateterismo cardíaco",
                        priority: "HIGH",
                        requestTime: "13:15",
                      },
                    ].map((transfer) => (
                      <Card key={transfer.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {transfer.patient}
                              </div>
                              <div className="text-sm text-gray-600">
                                {transfer.from} → {transfer.to}
                              </div>
                            </div>
                            <Badge
                              variant={
                                transfer.priority === "URGENT"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {transfer.priority}
                            </Badge>
                          </div>
                          <div className="text-sm">{transfer.reason}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {transfer.requestTime}
                            </span>
                            <div className="space-x-2">
                              <Button size="sm" variant="outline">
                                Ver
                              </Button>
                              <Button size="sm">Aprobar</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Estado de Ambulancias */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Ambulancias Disponibles</h4>

                    {[
                      {
                        id: "AMB-001",
                        type: "UCI Móvil",
                        status: "AVAILABLE",
                        location: "Hospital Base",
                      },
                      {
                        id: "AMB-002",
                        type: "Básica",
                        status: "IN_TRANSIT",
                        location: "En ruta Hospital Nacional",
                      },
                      {
                        id: "AMB-003",
                        type: "Avanzada",
                        status: "MAINTENANCE",
                        location: "Taller",
                      },
                    ].map((ambulance) => (
                      <Card key={ambulance.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{ambulance.id}</div>
                            <div className="text-sm text-gray-600">
                              {ambulance.type}
                            </div>
                            <div className="text-sm">{ambulance.location}</div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                ambulance.status === "AVAILABLE"
                                  ? "default"
                                  : ambulance.status === "IN_TRANSIT"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {ambulance.status}
                            </Badge>
                            {ambulance.status === "AVAILABLE" && (
                              <Button size="sm" className="mt-2">
                                Asignar
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facturación */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Gestión de Facturación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {admissions.map((admission) => (
                    <Card key={admission.id} className="border">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              {admission.patient.name}
                            </h4>
                            <div className="text-sm space-y-1">
                              <div>
                                <strong>ID:</strong> {admission.id}
                              </div>
                              <div>
                                <strong>Seguro:</strong>{" "}
                                {admission.admission.insurance}
                              </div>
                              <div>
                                <strong>Autorización:</strong>{" "}
                                {admission.admission.authorization}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2">Costos</h5>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Habitación:</span>
                                <span>
                                  ${admission.costs.roomCost.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tratamiento:</span>
                                <span>
                                  $
                                  {admission.costs.treatmentCost.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Total estimado:</span>
                                <span>
                                  $
                                  {admission.costs.totalEstimated.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-xs text-green-600">
                                {admission.costs.insurance}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              Ver Factura
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4 mr-2" />
                              Enviar a Seguro
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <NewAdmissionModal
          isOpen={showNewAdmission}
          onClose={() => setShowNewAdmission(false)}
          onAdmissionCreated={handleNewAdmissionCreated}
        />

        <PatientDischargeModal
          isOpen={showDischarge}
          onClose={() => {
            setShowDischarge(false);
            setDischargeAdmission(null);
          }}
          selectedAdmission={dischargeAdmission}
          onDischargeCompleted={handleDischargeCompleted}
        />
      </div>
    </div>
  );
}
