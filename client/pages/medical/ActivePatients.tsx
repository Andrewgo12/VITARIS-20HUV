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
  Microscope,
  Scissors,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowLeft,
  Filter,
  Download,
  Printer,
  Search,
  User,
  Bed,
  Stethoscope,
  Shield,
  Phone,
  MapPin,
  AlertCircle,
  Timer,
  Target,
  Building,
  UserCheck,
  ClipboardList,
  Bell,
  Zap,
  LineChart,
  BarChart3,
  PieChart,
  Thermometer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PrescribeMedicationModal,
  ScheduleProcedureModal,
  VitalSignsModal,
  OrderLabsModal,
  DischargePatientModal,
  TransferPatientModal,
} from "@/components/medical/MedicalModals";

interface ActivePatient {
  id: string;
  fullName: string;
  identificationNumber: string;
  age: number;
  sex: string;
  bedNumber: string;
  sector: string;
  admissionDate: string;
  daysHospitalized: number;
  diagnosis: string;
  priority: "CRITICO" | "SEVERO" | "MODERADO" | "LEVE";
  status: "STABLE" | "CRITICAL" | "IMPROVING" | "DETERIORATING";
  assignedDoctor: string;
  assignedNurse: string;
  eps: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory: MedicalHistoryEntry[];
  currentVitals: VitalSigns;
  medications: MedicationRecord[];
  procedures: ProcedureRecord[];
  labResults: LabResultRecord[];
  alerts: PatientAlert[];
  timeline: TimelineEvent[];
}

interface MedicalHistoryEntry {
  id: string;
  date: string;
  type:
    | "SURGERY"
    | "HOSPITALIZATION"
    | "CHRONIC_CONDITION"
    | "ALLERGY"
    | "FAMILY_HISTORY";
  description: string;
  details: string;
  relatedTo?: string;
}

interface VitalSigns {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  painLevel: number;
  lastUpdated: string;
  trend: "IMPROVING" | "STABLE" | "WORSENING";
}

interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: "ACTIVE" | "COMPLETED" | "SUSPENDED";
  prescribedBy: string;
  lastAdministered?: string;
  nextDue?: string;
  adherence: number; // percentage
}

interface ProcedureRecord {
  id: string;
  name: string;
  type: string;
  date: string;
  performedBy: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  results?: string;
  complications?: string;
}

interface LabResultRecord {
  id: string;
  testName: string;
  category: string;
  value: string;
  normalRange: string;
  status: "NORMAL" | "ABNORMAL" | "CRITICAL";
  date: string;
  orderedBy: string;
}

interface PatientAlert {
  id: string;
  type: "VITAL_SIGNS" | "MEDICATION" | "LAB_RESULT" | "GENERAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type:
    | "ADMISSION"
    | "MEDICATION"
    | "PROCEDURE"
    | "LAB_ORDER"
    | "VITAL_SIGNS"
    | "TRANSFER"
    | "NOTE";
  title: string;
  description: string;
  performer: string;
  category:
    | "MEDICAL"
    | "NURSING"
    | "PHARMACY"
    | "LABORATORY"
    | "ADMINISTRATIVE";
}

// Datos de prueba expandidos
const mockActivePatients: ActivePatient[] = [
  {
    id: "AP001",
    fullName: "Juan Carlos Pérez González",
    identificationNumber: "12345678",
    age: 45,
    sex: "Masculino",
    bedNumber: "UCI-001",
    sector: "UCI",
    admissionDate: "2024-01-18T10:30:00",
    daysHospitalized: 3,
    diagnosis: "Infarto agudo de miocardio con elevación del ST",
    priority: "CRITICO",
    status: "IMPROVING",
    assignedDoctor: "Dr. Alberto Ramírez",
    assignedNurse: "Enf. Carmen López",
    eps: "NUEVA_EPS",
    emergencyContact: {
      name: "María Elena Pérez",
      phone: "3009876543",
      relation: "Esposa",
    },
    medicalHistory: [
      {
        id: "MH001",
        date: "2020-03-15",
        type: "CHRONIC_CONDITION",
        description: "Diabetes Mellitus Tipo 2",
        details: "Diagnosticada hace 4 años, en tratamiento con metformina",
      },
      {
        id: "MH002",
        date: "2018-07-20",
        type: "CHRONIC_CONDITION",
        description: "Hipertensión Arterial",
        details: "Controlada con enalapril",
      },
      {
        id: "MH003",
        date: "2015-12-10",
        type: "SURGERY",
        description: "Apendicectomía",
        details: "Procedimiento sin complicaciones",
      },
      {
        id: "MH004",
        date: "2024-01-18",
        type: "ALLERGY",
        description: "Penicilina",
        details: "Reacción alérgica cutánea",
      },
    ],
    currentVitals: {
      heartRate: 78,
      bloodPressure: "125/80",
      temperature: 36.8,
      oxygenSaturation: 96,
      respiratoryRate: 16,
      painLevel: 2,
      lastUpdated: "2024-01-21T14:30:00",
      trend: "IMPROVING",
    },
    medications: [
      {
        id: "MED001",
        name: "Aspirina",
        dosage: "100mg",
        frequency: "Cada 24 horas",
        startDate: "2024-01-18T11:00:00",
        status: "ACTIVE",
        prescribedBy: "Dr. Alberto Ramírez",
        lastAdministered: "2024-01-21T11:00:00",
        nextDue: "2024-01-22T11:00:00",
        adherence: 100,
      },
      {
        id: "MED002",
        name: "Clopidogrel",
        dosage: "75mg",
        frequency: "Cada 24 horas",
        startDate: "2024-01-18T11:00:00",
        status: "ACTIVE",
        prescribedBy: "Dr. Alberto Ramírez",
        lastAdministered: "2024-01-21T11:00:00",
        nextDue: "2024-01-22T11:00:00",
        adherence: 100,
      },
      {
        id: "MED003",
        name: "Atorvastatina",
        dosage: "40mg",
        frequency: "Cada 24 horas",
        startDate: "2024-01-18T20:00:00",
        status: "ACTIVE",
        prescribedBy: "Dr. Alberto Ramírez",
        lastAdministered: "2024-01-21T20:00:00",
        nextDue: "2024-01-22T20:00:00",
        adherence: 100,
      },
    ],
    procedures: [
      {
        id: "PROC001",
        name: "Cateterismo cardíaco",
        type: "Diagnóstico/Terapéutico",
        date: "2024-01-18T15:00:00",
        performedBy: "Dr. Patricia Morales",
        status: "COMPLETED",
        results: "Angioplastia exitosa con stent en descendente anterior",
        complications: "Ninguna",
      },
      {
        id: "PROC002",
        name: "Ecocardiograma de control",
        type: "Diagnóstico",
        date: "2024-01-22T09:00:00",
        performedBy: "Dr. Alberto Ramírez",
        status: "SCHEDULED",
      },
    ],
    labResults: [
      {
        id: "LAB001",
        testName: "Troponinas I",
        category: "Cardiología",
        value: "2.1 ng/mL",
        normalRange: "<0.04 ng/mL",
        status: "CRITICAL",
        date: "2024-01-18T12:00:00",
        orderedBy: "Dr. Alberto Ramírez",
      },
      {
        id: "LAB002",
        testName: "CPK-MB",
        category: "Cardiología",
        value: "45 ng/mL",
        normalRange: "<3.6 ng/mL",
        status: "ABNORMAL",
        date: "2024-01-18T12:00:00",
        orderedBy: "Dr. Alberto Ramírez",
      },
      {
        id: "LAB003",
        testName: "Hemograma",
        category: "Hematología",
        value: "Normal",
        normalRange: "Valores normales",
        status: "NORMAL",
        date: "2024-01-20T08:00:00",
        orderedBy: "Dr. Alberto Ramírez",
      },
    ],
    alerts: [
      {
        id: "ALERT001",
        type: "VITAL_SIGNS",
        priority: "MEDIUM",
        message: "Mejoría en signos vitales - tendencia estable",
        timestamp: "2024-01-21T14:30:00",
        acknowledged: false,
      },
    ],
    timeline: [
      {
        id: "TL001",
        timestamp: "2024-01-18T10:30:00",
        type: "ADMISSION",
        title: "Ingreso a UCI",
        description: "Paciente ingresa por dolor torácico agudo",
        performer: "Dr. Fernando Castillo",
        category: "MEDICAL",
      },
      {
        id: "TL002",
        timestamp: "2024-01-18T11:00:00",
        type: "MEDICATION",
        title: "Inicio de tratamiento antiagregante",
        description: "Aspirina 100mg + Clopidogrel 75mg",
        performer: "Dr. Alberto Ramírez",
        category: "PHARMACY",
      },
      {
        id: "TL003",
        timestamp: "2024-01-18T15:00:00",
        type: "PROCEDURE",
        title: "Cateterismo cardíaco",
        description: "Angioplastia exitosa con stent",
        performer: "Dr. Patricia Morales",
        category: "MEDICAL",
      },
      {
        id: "TL004",
        timestamp: "2024-01-21T14:30:00",
        type: "VITAL_SIGNS",
        title: "Signos vitales estables",
        description: "Mejoría significativa en parámetros",
        performer: "Enf. Carmen López",
        category: "NURSING",
      },
    ],
  },
  {
    id: "AP002",
    fullName: "María Elena Rodríguez Vargas",
    identificationNumber: "87654321",
    age: 32,
    sex: "Femenino",
    bedNumber: "GINE-012",
    sector: "GINECOLOGIA",
    admissionDate: "2024-01-20T14:15:00",
    daysHospitalized: 1,
    diagnosis: "Preeclampsia severa - Embarazo 32 semanas",
    priority: "SEVERO",
    status: "STABLE",
    assignedDoctor: "Dra. Carmen López",
    assignedNurse: "Enf. Ana Herrera",
    eps: "SANITAS",
    emergencyContact: {
      name: "Carlos Rodríguez",
      phone: "3158765432",
      relation: "Esposo",
    },
    medicalHistory: [
      {
        id: "MH005",
        date: "2022-08-15",
        type: "HOSPITALIZATION",
        description: "Parto anterior sin complicaciones",
        details: "Parto vaginal, bebé sano",
      },
    ],
    currentVitals: {
      heartRate: 88,
      bloodPressure: "150/95",
      temperature: 37.1,
      oxygenSaturation: 98,
      respiratoryRate: 18,
      painLevel: 3,
      lastUpdated: "2024-01-21T15:00:00",
      trend: "STABLE",
    },
    medications: [
      {
        id: "MED004",
        name: "Sulfato de magnesio",
        dosage: "2g/h",
        frequency: "Infusión continua",
        startDate: "2024-01-20T14:30:00",
        status: "ACTIVE",
        prescribedBy: "Dra. Carmen López",
        adherence: 100,
      },
    ],
    procedures: [
      {
        id: "PROC003",
        name: "Monitoreo fetal continuo",
        type: "Monitoreo",
        date: "2024-01-20T14:15:00",
        performedBy: "Enf. Ana Herrera",
        status: "COMPLETED",
      },
    ],
    labResults: [
      {
        id: "LAB004",
        testName: "Proteinuria 24h",
        category: "Nefrología",
        value: "3.2 g/24h",
        normalRange: "<0.3 g/24h",
        status: "CRITICAL",
        date: "2024-01-20T14:15:00",
        orderedBy: "Dra. Carmen López",
      },
    ],
    alerts: [
      {
        id: "ALERT002",
        type: "VITAL_SIGNS",
        priority: "HIGH",
        message: "Presión arterial elevada persistente",
        timestamp: "2024-01-21T15:00:00",
        acknowledged: false,
      },
    ],
    timeline: [
      {
        id: "TL005",
        timestamp: "2024-01-20T14:15:00",
        type: "ADMISSION",
        title: "Ingreso por preeclampsia",
        description: "Embarazo 32 semanas con preeclampsia severa",
        performer: "Dra. Carmen López",
        category: "MEDICAL",
      },
    ],
  },
];

export default function ActivePatients() {
  const [selectedPatient, setSelectedPatient] = useState<ActivePatient | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("admissionDate");
  const navigate = useNavigate();

  const filteredPatients = mockActivePatients.filter((patient) => {
    const matchesSearch =
      searchTerm === "" ||
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.identificationNumber.includes(searchTerm) ||
      patient.bedNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || patient.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || patient.priority === priorityFilter;
    const matchesSector =
      sectorFilter === "ALL" || patient.sector === sectorFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesSector;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case "admissionDate":
        return (
          new Date(b.admissionDate).getTime() -
          new Date(a.admissionDate).getTime()
        );
      case "priority":
        const priorityOrder = { CRITICO: 4, SEVERO: 3, MODERADO: 2, LEVE: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "daysHospitalized":
        return b.daysHospitalized - a.daysHospitalized;
      case "name":
        return a.fullName.localeCompare(b.fullName);
      default:
        return 0;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICO":
        return "destructive";
      case "SEVERO":
        return "warning";
      case "MODERADO":
        return "secondary";
      case "LEVE":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "STABLE":
        return "success";
      case "CRITICAL":
        return "destructive";
      case "IMPROVING":
        return "success";
      case "DETERIORATING":
        return "warning";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "STABLE":
        return "Estable";
      case "CRITICAL":
        return "Crítico";
      case "IMPROVING":
        return "Mejorando";
      case "DETERIORATING":
        return "Deteriorando";
      default:
        return status;
    }
  };

  const getVitalTrend = (trend: string) => {
    switch (trend) {
      case "IMPROVING":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "WORSENING":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "ADMISSION":
        return <UserCheck className="w-4 h-4" />;
      case "MEDICATION":
        return <Pill className="w-4 h-4" />;
      case "PROCEDURE":
        return <Scissors className="w-4 h-4" />;
      case "LAB_ORDER":
        return <Microscope className="w-4 h-4" />;
      case "VITAL_SIGNS":
        return <Heart className="w-4 h-4" />;
      case "TRANSFER":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MEDICAL":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "NURSING":
        return "text-green-600 bg-green-50 border-green-200";
      case "PHARMACY":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "LABORATORY":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "ADMINISTRATIVE":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      {/* Header */}
      <motion.div
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl border-0 p-8 mb-6 relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Users className="w-full h-full text-indigo-500" />
          </motion.div>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <motion.div
            className="flex items-center gap-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={() => navigate("/medical-dashboard")}
              className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <motion.div
                className="w-16 h-16 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <ClipboardList className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight">
                  PACIENTES{" "}
                  <span className="text-indigo-500 font-light">ACTIVOS</span>
                </h1>
                <p className="text-black font-medium">
                  Registro Completo e Historial Médico
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge
              variant="outline"
              className="bg-indigo-100 border-indigo-300 text-indigo-700 px-4 py-2"
            >
              <Activity className="w-4 h-4 mr-2" />
              {filteredPatients.length} Pacientes Activos
            </Badge>
            <Button
              variant="outline"
              onClick={() => console.log("Exportar reporte")}
              className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Filtros Avanzados */}
      <motion.div
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Buscar Paciente
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Nombre, ID o cama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 rounded-xl border-2 pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Estado
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="STABLE">Estable</SelectItem>
                    <SelectItem value="CRITICAL">Crítico</SelectItem>
                    <SelectItem value="IMPROVING">Mejorando</SelectItem>
                    <SelectItem value="DETERIORATING">Deteriorando</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Prioridad
                </Label>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    <SelectItem value="CRITICO">Crítico</SelectItem>
                    <SelectItem value="SEVERO">Severo</SelectItem>
                    <SelectItem value="MODERADO">Moderado</SelectItem>
                    <SelectItem value="LEVE">Leve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Sector
                </Label>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="UCI">UCI</SelectItem>
                    <SelectItem value="URGENCIAS">Urgencias</SelectItem>
                    <SelectItem value="CARDIOLOGIA">Cardiología</SelectItem>
                    <SelectItem value="GINECOLOGIA">Ginecología</SelectItem>
                    <SelectItem value="PEDIATRIA">Pediatría</SelectItem>
                    <SelectItem value="CIRUGIA">Cirugía</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Ordenar por
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admissionDate">
                      Fecha de ingreso
                    </SelectItem>
                    <SelectItem value="priority">Prioridad</SelectItem>
                    <SelectItem value="daysHospitalized">
                      Días hospitalizados
                    </SelectItem>
                    <SelectItem value="name">Nombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="h-11 w-full border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Pacientes */}
      <motion.div
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {sortedPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`
                  bg-white/95 backdrop-blur-sm transition-all duration-200 hover:shadow-lg cursor-pointer
                  ${
                    patient.priority === "CRITICO"
                      ? "border-l-8 border-l-red-500"
                      : patient.priority === "SEVERO"
                        ? "border-l-8 border-l-amber-500"
                        : patient.priority === "MODERADO"
                          ? "border-l-8 border-l-blue-500"
                          : "border-l-8 border-l-green-500"
                  }
                `}
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar del Paciente */}
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {patient.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </motion.div>

                      <div>
                        <h3 className="font-bold text-xl text-black">
                          {patient.fullName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span>{patient.identificationNumber}</span>
                          <span>•</span>
                          <span>{patient.age} años</span>
                          <span>•</span>
                          <span>{patient.sex}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm mt-1">
                          <Badge variant="outline" className="px-2 py-1">
                            <Bed className="w-3 h-3 mr-1" />
                            {patient.bedNumber}
                          </Badge>
                          <Badge variant="outline" className="px-2 py-1">
                            <Building className="w-3 h-3 mr-1" />
                            {patient.sector}
                          </Badge>
                          <Badge variant="outline" className="px-2 py-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {patient.daysHospitalized} días
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getPriorityColor(patient.priority)}>
                          {patient.priority}
                        </Badge>
                        <Badge variant={getStatusColor(patient.status)}>
                          {getStatusText(patient.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getVitalTrend(patient.currentVitals.trend)}
                        <span>
                          {patient.currentVitals.trend === "IMPROVING"
                            ? "Mejorando"
                            : patient.currentVitals.trend === "WORSENING"
                              ? "Empeorando"
                              : "Estable"}
                        </span>
                      </div>
                      {patient.alerts.filter((alert) => !alert.acknowledged)
                        .length > 0 && (
                        <Badge variant="destructive" className="mt-2">
                          <Bell className="w-3 h-3 mr-1" />
                          {
                            patient.alerts.filter(
                              (alert) => !alert.acknowledged,
                            ).length
                          }{" "}
                          alertas
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Información Médica Básica */}
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          Diagnóstico Principal
                        </span>
                      </div>
                      <p className="text-sm text-black">{patient.diagnosis}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center bg-gray-50 p-3 rounded">
                        <User className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Médico</p>
                        <p className="text-sm font-semibold text-black">
                          {patient.assignedDoctor}
                        </p>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded">
                        <Heart className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Enfermera</p>
                        <p className="text-sm font-semibold text-black">
                          {patient.assignedNurse}
                        </p>
                      </div>
                    </div>

                    {/* Signos Vitales Actuales */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center bg-red-50 p-2 rounded border border-red-200">
                        <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                        <p className="text-xs text-red-600 font-semibold">
                          {patient.currentVitals.heartRate}
                        </p>
                        <p className="text-xs text-gray-500">bpm</p>
                      </div>
                      <div className="text-center bg-blue-50 p-2 rounded border border-blue-200">
                        <Activity className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-blue-600 font-semibold">
                          {patient.currentVitals.bloodPressure}
                        </p>
                        <p className="text-xs text-gray-500">mmHg</p>
                      </div>
                      <div className="text-center bg-yellow-50 p-2 rounded border border-yellow-200">
                        <Thermometer className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                        <p className="text-xs text-yellow-600 font-semibold">
                          {patient.currentVitals.temperature}°C
                        </p>
                        <p className="text-xs text-gray-500">temp</p>
                      </div>
                      <div className="text-center bg-green-50 p-2 rounded border border-green-200">
                        <Shield className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-green-600 font-semibold">
                          {patient.currentVitals.oxygenSaturation}%
                        </p>
                        <p className="text-xs text-gray-500">O2</p>
                      </div>
                    </div>

                    {/* Resumen de Medicamentos */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-800">
                            Medicamentos Activos
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {
                            patient.medications.filter(
                              (med) => med.status === "ACTIVE",
                            ).length
                          }
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {patient.medications
                          .filter((med) => med.status === "ACTIVE")
                          .slice(0, 3)
                          .map((med) => (
                            <Badge
                              key={med.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {med.name}
                            </Badge>
                          ))}
                        {patient.medications.filter(
                          (med) => med.status === "ACTIVE",
                        ).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +
                            {patient.medications.filter(
                              (med) => med.status === "ACTIVE",
                            ).length - 3}{" "}
                            más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Completo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                            <ClipboardList className="w-6 h-6 text-indigo-500" />
                            Historial Médico Completo -{" "}
                            {selectedPatient?.fullName}
                          </DialogTitle>
                        </DialogHeader>

                        {selectedPatient && (
                          <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-8">
                                <TabsTrigger value="overview">
                                  Resumen
                                </TabsTrigger>
                                <TabsTrigger value="history">
                                  Historial
                                </TabsTrigger>
                                <TabsTrigger value="vitals">
                                  Signos Vitales
                                </TabsTrigger>
                                <TabsTrigger value="medications">
                                  Medicamentos
                                </TabsTrigger>
                                <TabsTrigger value="procedures">
                                  Procedimientos
                                </TabsTrigger>
                                <TabsTrigger value="labs">
                                  Laboratorios
                                </TabsTrigger>
                                <TabsTrigger value="timeline">
                                  Cronología
                                </TabsTrigger>
                                <TabsTrigger value="actions">
                                  Acciones
                                </TabsTrigger>
                              </TabsList>

                              {/* Tab: Resumen */}
                              <TabsContent
                                value="overview"
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-500" />
                                        Información del Paciente
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              Nombre
                                            </Label>
                                            <p className="text-black">
                                              {selectedPatient.fullName}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              Identificación
                                            </Label>
                                            <p className="text-black">
                                              {
                                                selectedPatient.identificationNumber
                                              }
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              Edad
                                            </Label>
                                            <p className="text-black">
                                              {selectedPatient.age} años
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              Sexo
                                            </Label>
                                            <p className="text-black">
                                              {selectedPatient.sex}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              Cama
                                            </Label>
                                            <p className="text-black">
                                              {selectedPatient.bedNumber}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              Sector
                                            </Label>
                                            <p className="text-black">
                                              {selectedPatient.sector}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              EPS
                                            </Label>
                                            <p className="text-black">
                                              {selectedPatient.eps}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="font-semibold text-gray-700">
                                              Días Hospitalizados
                                            </Label>
                                            <p className="text-black">
                                              {selectedPatient.daysHospitalized}{" "}
                                              días
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Diagnóstico Principal
                                          </Label>
                                          <p className="text-black p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            {selectedPatient.diagnosis}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-green-500" />
                                        Contacto y Equipo Médico
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div>
                                          <Label className="font-semibold text-gray-700 mb-2 block">
                                            Contacto de Emergencia
                                          </Label>
                                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="font-semibold text-black">
                                              {
                                                selectedPatient.emergencyContact
                                                  .name
                                              }
                                            </p>
                                            <p className="text-gray-600">
                                              {
                                                selectedPatient.emergencyContact
                                                  .relation
                                              }
                                            </p>
                                            <p className="text-blue-600">
                                              {
                                                selectedPatient.emergencyContact
                                                  .phone
                                              }
                                            </p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <Stethoscope className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">
                                              Médico Responsable
                                            </p>
                                            <p className="font-bold text-black">
                                              {selectedPatient.assignedDoctor}
                                            </p>
                                          </div>
                                          <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                                            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">
                                              Enfermera Asignada
                                            </p>
                                            <p className="font-bold text-black">
                                              {selectedPatient.assignedNurse}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Signos Vitales Actuales */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Heart className="w-5 h-5 text-red-500" />
                                      Signos Vitales Actuales
                                      <div className="ml-auto flex items-center gap-2">
                                        {getVitalTrend(
                                          selectedPatient.currentVitals.trend,
                                        )}
                                        <span className="text-sm">
                                          {selectedPatient.currentVitals
                                            .trend === "IMPROVING"
                                            ? "Mejorando"
                                            : selectedPatient.currentVitals
                                                  .trend === "WORSENING"
                                              ? "Empeorando"
                                              : "Estable"}
                                        </span>
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                        <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                          Frecuencia Cardíaca
                                        </p>
                                        <p className="text-2xl font-bold text-red-600">
                                          {
                                            selectedPatient.currentVitals
                                              .heartRate
                                          }
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          bpm
                                        </p>
                                      </div>
                                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                          Presión Arterial
                                        </p>
                                        <p className="text-xl font-bold text-blue-600">
                                          {
                                            selectedPatient.currentVitals
                                              .bloodPressure
                                          }
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          mmHg
                                        </p>
                                      </div>
                                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <Thermometer className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                          Temperatura
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                          {
                                            selectedPatient.currentVitals
                                              .temperature
                                          }
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          °C
                                        </p>
                                      </div>
                                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                          Saturación O2
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                          {
                                            selectedPatient.currentVitals
                                              .oxygenSaturation
                                          }
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          %
                                        </p>
                                      </div>
                                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                          Freq. Respiratoria
                                        </p>
                                        <p className="text-2xl font-bold text-purple-600">
                                          {
                                            selectedPatient.currentVitals
                                              .respiratoryRate
                                          }
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          rpm
                                        </p>
                                      </div>
                                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                          Nivel de Dolor
                                        </p>
                                        <p className="text-2xl font-bold text-orange-600">
                                          {
                                            selectedPatient.currentVitals
                                              .painLevel
                                          }
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          /10
                                        </p>
                                      </div>
                                    </div>
                                    <div className="mt-4 text-center text-sm text-gray-600">
                                      <p>
                                        <strong>Última actualización:</strong>{" "}
                                        {new Date(
                                          selectedPatient.currentVitals.lastUpdated,
                                        ).toLocaleString("es-CO")}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Historial Médico */}
                              <TabsContent
                                value="history"
                                className="space-y-4"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <FileText className="w-5 h-5 text-gray-500" />
                                      Historial Médico
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.medicalHistory.map(
                                        (entry, index) => (
                                          <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 rounded-lg border ${
                                              entry.type === "ALLERGY"
                                                ? "bg-red-50 border-red-200"
                                                : entry.type ===
                                                    "CHRONIC_CONDITION"
                                                  ? "bg-yellow-50 border-yellow-200"
                                                  : entry.type === "SURGERY"
                                                    ? "bg-blue-50 border-blue-200"
                                                    : "bg-gray-50 border-gray-200"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <h4 className="font-bold text-black">
                                                {entry.description}
                                              </h4>
                                              <div className="flex items-center gap-2">
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {entry.type.replace("_", " ")}
                                                </Badge>
                                                <span className="text-sm text-gray-600">
                                                  {new Date(
                                                    entry.date,
                                                  ).toLocaleDateString("es-CO")}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                              {entry.details}
                                            </p>
                                          </motion.div>
                                        ),
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Medicamentos */}
                              <TabsContent
                                value="medications"
                                className="space-y-4"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Pill className="w-5 h-5 text-green-500" />
                                      Medicamentos
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.medications.map(
                                        (medication, index) => (
                                          <motion.div
                                            key={medication.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 rounded-lg border ${
                                              medication.status === "ACTIVE"
                                                ? "bg-green-50 border-green-200"
                                                : medication.status ===
                                                    "COMPLETED"
                                                  ? "bg-gray-50 border-gray-200"
                                                  : "bg-yellow-50 border-yellow-200"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-3">
                                              <div>
                                                <h4 className="font-bold text-black">
                                                  {medication.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                  {medication.dosage} -{" "}
                                                  {medication.frequency}
                                                </p>
                                              </div>
                                              <Badge
                                                variant={
                                                  medication.status === "ACTIVE"
                                                    ? "success"
                                                    : "secondary"
                                                }
                                              >
                                                {medication.status}
                                              </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                              <div>
                                                <Label className="text-gray-600">
                                                  Prescrito por:
                                                </Label>
                                                <p className="text-black">
                                                  {medication.prescribedBy}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-gray-600">
                                                  Inicio:
                                                </Label>
                                                <p className="text-black">
                                                  {new Date(
                                                    medication.startDate,
                                                  ).toLocaleDateString("es-CO")}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-gray-600">
                                                  Adherencia:
                                                </Label>
                                                <p className="text-black">
                                                  {medication.adherence}%
                                                </p>
                                              </div>
                                              {medication.nextDue && (
                                                <div>
                                                  <Label className="text-gray-600">
                                                    Próxima dosis:
                                                  </Label>
                                                  <p className="text-black font-semibold">
                                                    {new Date(
                                                      medication.nextDue,
                                                    ).toLocaleString("es-CO")}
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        ),
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Procedimientos */}
                              <TabsContent
                                value="procedures"
                                className="space-y-4"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Scissors className="w-5 h-5 text-purple-500" />
                                      Procedimientos
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.procedures.map(
                                        (procedure, index) => (
                                          <motion.div
                                            key={procedure.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                                          >
                                            <div className="flex items-center justify-between mb-3">
                                              <div>
                                                <h4 className="font-bold text-black">
                                                  {procedure.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                  {procedure.type}
                                                </p>
                                              </div>
                                              <Badge
                                                variant={
                                                  procedure.status ===
                                                  "COMPLETED"
                                                    ? "success"
                                                    : procedure.status ===
                                                        "SCHEDULED"
                                                      ? "secondary"
                                                      : "destructive"
                                                }
                                              >
                                                {procedure.status}
                                              </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                              <div>
                                                <Label className="text-gray-600">
                                                  Fecha:
                                                </Label>
                                                <p className="text-black">
                                                  {new Date(
                                                    procedure.date,
                                                  ).toLocaleString("es-CO")}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-gray-600">
                                                  Realizado por:
                                                </Label>
                                                <p className="text-black">
                                                  {procedure.performedBy}
                                                </p>
                                              </div>
                                            </div>

                                            {procedure.results && (
                                              <div className="mt-3">
                                                <Label className="text-gray-600">
                                                  Resultados:
                                                </Label>
                                                <p className="text-black p-2 bg-white rounded border">
                                                  {procedure.results}
                                                </p>
                                              </div>
                                            )}
                                          </motion.div>
                                        ),
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Laboratorios */}
                              <TabsContent value="labs" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Microscope className="w-5 h-5 text-blue-500" />
                                      Resultados de Laboratorio
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.labResults.map(
                                        (lab, index) => (
                                          <motion.div
                                            key={lab.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 rounded-lg border ${
                                              lab.status === "CRITICAL"
                                                ? "bg-red-50 border-red-200"
                                                : lab.status === "ABNORMAL"
                                                  ? "bg-yellow-50 border-yellow-200"
                                                  : "bg-green-50 border-green-200"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-3">
                                              <div>
                                                <h4 className="font-bold text-black">
                                                  {lab.testName}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                  {lab.category}
                                                </p>
                                              </div>
                                              <Badge
                                                variant={
                                                  lab.status === "CRITICAL"
                                                    ? "destructive"
                                                    : lab.status === "ABNORMAL"
                                                      ? "warning"
                                                      : "success"
                                                }
                                              >
                                                {lab.status}
                                              </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                              <div>
                                                <Label className="text-gray-600">
                                                  Valor:
                                                </Label>
                                                <p className="text-black font-bold">
                                                  {lab.value}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-gray-600">
                                                  Rango Normal:
                                                </Label>
                                                <p className="text-black">
                                                  {lab.normalRange}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-gray-600">
                                                  Fecha:
                                                </Label>
                                                <p className="text-black">
                                                  {new Date(
                                                    lab.date,
                                                  ).toLocaleDateString("es-CO")}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-gray-600">
                                                  Ordenado por:
                                                </Label>
                                                <p className="text-black">
                                                  {lab.orderedBy}
                                                </p>
                                              </div>
                                            </div>
                                          </motion.div>
                                        ),
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Cronología */}
                              <TabsContent
                                value="timeline"
                                className="space-y-4"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Clock className="w-5 h-5 text-gray-500" />
                                      Cronología de Eventos
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.timeline.map(
                                        (event, index) => (
                                          <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4"
                                          >
                                            <div
                                              className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(event.category)}`}
                                            >
                                              {getTimelineIcon(event.type)}
                                            </div>
                                            <div className="flex-1 pb-4 border-b border-gray-200 last:border-b-0">
                                              <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-black">
                                                  {event.title}
                                                </h4>
                                                <span className="text-sm text-gray-500">
                                                  {new Date(
                                                    event.timestamp,
                                                  ).toLocaleString("es-CO")}
                                                </span>
                                              </div>
                                              <p className="text-sm text-gray-700 mb-1">
                                                {event.description}
                                              </p>
                                              <div className="flex items-center gap-2">
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {event.category}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                  {event.performer}
                                                </span>
                                              </div>
                                            </div>
                                          </motion.div>
                                        ),
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Acciones Médicas */}
                              <TabsContent
                                value="actions"
                                className="space-y-4"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Zap className="w-5 h-5 text-orange-500" />
                                      Acciones Médicas Rápidas
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      <VitalSignsModal
                                        trigger={
                                          <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center gap-2 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                                          >
                                            <Heart className="w-6 h-6" />
                                            <span className="text-sm font-semibold">
                                              Signos Vitales
                                            </span>
                                          </Button>
                                        }
                                      />

                                      <PrescribeMedicationModal
                                        trigger={
                                          <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                                          >
                                            <Pill className="w-6 h-6" />
                                            <span className="text-sm font-semibold">
                                              Prescribir
                                            </span>
                                          </Button>
                                        }
                                      />

                                      <OrderLabsModal
                                        trigger={
                                          <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                                          >
                                            <Microscope className="w-6 h-6" />
                                            <span className="text-sm font-semibold">
                                              Laboratorios
                                            </span>
                                          </Button>
                                        }
                                      />

                                      <ScheduleProcedureModal
                                        trigger={
                                          <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center gap-2 border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                                          >
                                            <Scissors className="w-6 h-6" />
                                            <span className="text-sm font-semibold">
                                              Procedimiento
                                            </span>
                                          </Button>
                                        }
                                      />

                                      <TransferPatientModal
                                        trigger={
                                          <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center gap-2 border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                                          >
                                            <TrendingUp className="w-6 h-6" />
                                            <span className="text-sm font-semibold">
                                              Transferir
                                            </span>
                                          </Button>
                                        }
                                      />

                                      <DischargePatientModal
                                        trigger={
                                          <Button
                                            variant="outline"
                                            className="h-20 flex flex-col items-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
                                          >
                                            <CheckCircle className="w-6 h-6" />
                                            <span className="text-sm font-semibold">
                                              Dar de Alta
                                            </span>
                                          </Button>
                                        }
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </motion.div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Botones de Acción Rápida */}
                    <VitalSignsModal
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Vitales
                        </Button>
                      }
                    />

                    <PrescribeMedicationModal
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                        >
                          <Pill className="w-4 h-4 mr-1" />
                          Medicamento
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Estado Vacío */}
      <AnimatePresence>
        {sortedPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="text-center p-12 bg-white/90">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No se encontraron pacientes activos
              </h3>
              <p className="text-black">
                Ajuste los filtros para ver más pacientes.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
