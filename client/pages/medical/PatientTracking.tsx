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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Activity,
  Heart,
  Thermometer,
  Eye,
  Edit3,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pill,
  FileText,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  ClipboardList,
  Timer,
  Bell,
  Camera,
  Download,
  Upload,
  Phone,
  MapPin,
  AlertCircle,
  Zap,
  Target,
  Microscope,
  Syringe,
  Bandage,
  Scissors,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PatientTracking {
  id: string;
  fullName: string;
  identificationNumber: string;
  age: number;
  sex: string;
  bedNumber: string;
  sector: string;
  admissionDate: string;
  diagnosis: string;
  priority: "CRITICO" | "SEVERO" | "MODERADO" | "LEVE";
  status:
    | "STABLE"
    | "CRITICAL"
    | "IMPROVING"
    | "DETERIORATING"
    | "DISCHARGE_READY";
  assignedDoctor: string;
  assignedNurse: string;
  vitalSigns: VitalSignsHistory[];
  medications: Medication[];
  procedures: Procedure[];
  labResults: LabResult[];
  notes: MedicalNote[];
  alerts: Alert[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance: {
    eps: string;
    plan: string;
    authorization: string;
  };
}

interface VitalSignsHistory {
  id: string;
  timestamp: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  painLevel: number;
  recordedBy: string;
  notes: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  administeredBy?: string;
  status: "ACTIVE" | "COMPLETED" | "SUSPENDED";
  lastAdministered?: string;
  nextDue?: string;
  notes: string;
}

interface Procedure {
  id: string;
  name: string;
  type: string;
  date: string;
  performedBy: string;
  duration: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  results: string;
  complications: string;
  notes: string;
}

interface LabResult {
  id: string;
  testName: string;
  category: string;
  orderDate: string;
  resultDate?: string;
  value: string;
  normalRange: string;
  status: "PENDING" | "COMPLETED" | "ABNORMAL";
  orderedBy: string;
  notes: string;
}

interface MedicalNote {
  id: string;
  timestamp: string;
  type: "MEDICAL" | "NURSING" | "PHARMACY" | "THERAPY";
  author: string;
  content: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

interface Alert {
  id: string;
  type: "VITAL_SIGNS" | "MEDICATION" | "LAB_RESULT" | "PROCEDURE" | "GENERAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

// Datos de prueba
const mockPatients: PatientTracking[] = [
  {
    id: "P001",
    fullName: "Juan Carlos Pérez González",
    identificationNumber: "12345678",
    age: 45,
    sex: "Masculino",
    bedNumber: "UCI-001",
    sector: "UCI",
    admissionDate: "2024-01-20T10:30:00",
    diagnosis: "Infarto agudo de miocardio",
    priority: "CRITICO",
    status: "STABLE",
    assignedDoctor: "Dr. Alberto Ramírez",
    assignedNurse: "Enf. Carmen López",
    emergencyContact: {
      name: "María Elena Pérez",
      phone: "3009876543",
      relation: "Esposa",
    },
    insurance: {
      eps: "NUEVA_EPS",
      plan: "Contributivo",
      authorization: "AUT2024001",
    },
    vitalSigns: [
      {
        id: "VS001",
        timestamp: "2024-01-20T14:00:00",
        heartRate: 85,
        bloodPressure: "130/80",
        temperature: 36.8,
        oxygenSaturation: 95,
        respiratoryRate: 18,
        painLevel: 3,
        recordedBy: "Enf. Carmen López",
        notes: "Paciente estable",
      },
      {
        id: "VS002",
        timestamp: "2024-01-20T10:00:00",
        heartRate: 120,
        bloodPressure: "160/95",
        temperature: 37.2,
        oxygenSaturation: 92,
        respiratoryRate: 24,
        painLevel: 8,
        recordedBy: "Enf. Roberto Díaz",
        notes: "Ingreso de urgencias",
      },
    ],
    medications: [
      {
        id: "MED001",
        name: "Aspirina",
        dosage: "100mg",
        frequency: "Cada 24 horas",
        route: "Oral",
        startDate: "2024-01-20T11:00:00",
        prescribedBy: "Dr. Alberto Ramírez",
        status: "ACTIVE",
        lastAdministered: "2024-01-20T11:00:00",
        nextDue: "2024-01-21T11:00:00",
        notes: "Antiagregante plaquetario",
      },
      {
        id: "MED002",
        name: "Clopidogrel",
        dosage: "75mg",
        frequency: "Cada 24 horas",
        route: "Oral",
        startDate: "2024-01-20T11:00:00",
        prescribedBy: "Dr. Alberto Ramírez",
        status: "ACTIVE",
        lastAdministered: "2024-01-20T11:00:00",
        nextDue: "2024-01-21T11:00:00",
        notes: "Antiagregante plaquetario",
      },
    ],
    procedures: [
      {
        id: "PROC001",
        name: "Cateterismo cardíaco",
        type: "Diagnóstico",
        date: "2024-01-20T15:00:00",
        performedBy: "Dr. Patricia Morales",
        duration: "45 minutos",
        status: "COMPLETED",
        results: "Estenosis del 80% en arteria descendente anterior",
        complications: "Ninguna",
        notes: "Procedimiento exitoso",
      },
    ],
    labResults: [
      {
        id: "LAB001",
        testName: "Troponinas",
        category: "Cardiología",
        orderDate: "2024-01-20T10:30:00",
        resultDate: "2024-01-20T12:00:00",
        value: "15.2 ng/mL",
        normalRange: "<0.04 ng/mL",
        status: "ABNORMAL",
        orderedBy: "Dr. Alberto Ramírez",
        notes: "Elevación significativa",
      },
    ],
    notes: [
      {
        id: "NOTE001",
        timestamp: "2024-01-20T16:00:00",
        type: "MEDICAL",
        author: "Dr. Alberto Ramírez",
        content:
          "Paciente con evolución favorable post-cateterismo. Se indica stent en descendente anterior.",
        priority: "HIGH",
      },
    ],
    alerts: [
      {
        id: "ALERT001",
        type: "LAB_RESULT",
        priority: "HIGH",
        message: "Troponinas elevadas - Confirma infarto",
        timestamp: "2024-01-20T12:00:00",
        acknowledged: true,
        acknowledgedBy: "Dr. Alberto Ramírez",
      },
    ],
  },
  {
    id: "P002",
    fullName: "María Elena Rodríguez Vargas",
    identificationNumber: "87654321",
    age: 32,
    sex: "Femenino",
    bedNumber: "UCI-002",
    sector: "UCI",
    admissionDate: "2024-01-20T14:15:00",
    diagnosis: "Preeclampsia severa",
    priority: "SEVERO",
    status: "STABLE",
    assignedDoctor: "Dra. Carmen López",
    assignedNurse: "Enf. Ana Herrera",
    emergencyContact: {
      name: "Carlos Rodríguez",
      phone: "3158765432",
      relation: "Esposo",
    },
    insurance: {
      eps: "SANITAS",
      plan: "Contributivo",
      authorization: "SAN2024002",
    },
    vitalSigns: [
      {
        id: "VS003",
        timestamp: "2024-01-20T16:00:00",
        heartRate: 92,
        bloodPressure: "160/110",
        temperature: 37.2,
        oxygenSaturation: 98,
        respiratoryRate: 20,
        painLevel: 5,
        recordedBy: "Enf. Ana Herrera",
        notes: "Presión arterial elevada",
      },
    ],
    medications: [
      {
        id: "MED003",
        name: "Sulfato de magnesio",
        dosage: "4g",
        frequency: "Bolo inicial, luego 2g/h",
        route: "Intravenoso",
        startDate: "2024-01-20T14:30:00",
        prescribedBy: "Dra. Carmen López",
        status: "ACTIVE",
        notes: "Prevención de convulsiones",
      },
    ],
    procedures: [],
    labResults: [
      {
        id: "LAB002",
        testName: "Proteinuria 24h",
        category: "Nefrología",
        orderDate: "2024-01-20T14:15:00",
        value: "3.2 g/24h",
        normalRange: "<0.3 g/24h",
        status: "ABNORMAL",
        orderedBy: "Dra. Carmen López",
        notes: "Proteinuria masiva",
      },
    ],
    notes: [
      {
        id: "NOTE002",
        timestamp: "2024-01-20T15:30:00",
        type: "MEDICAL",
        author: "Dra. Carmen López",
        content:
          "Embarazo 32 semanas con preeclampsia severa. Se considera cesárea urgente.",
        priority: "URGENT",
      },
    ],
    alerts: [
      {
        id: "ALERT002",
        type: "VITAL_SIGNS",
        priority: "HIGH",
        message: "Presión arterial persistentemente elevada",
        timestamp: "2024-01-20T16:00:00",
        acknowledged: false,
      },
    ],
  },
];

export default function PatientTracking() {
  const [selectedPatient, setSelectedPatient] =
    useState<PatientTracking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [newVitalSigns, setNewVitalSigns] = useState({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
    painLevel: "",
    notes: "",
  });
  const [newNote, setNewNote] = useState({
    type: "MEDICAL" as MedicalNote["type"],
    content: "",
    priority: "MEDIUM" as MedicalNote["priority"],
  });
  const navigate = useNavigate();

  const filteredPatients = mockPatients.filter((patient) => {
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
      case "DISCHARGE_READY":
        return "secondary";
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
      case "DISCHARGE_READY":
        return "Listo para Alta";
      default:
        return status;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "outline";
      default:
        return "outline";
    }
  };

  const addVitalSigns = () => {
    if (selectedPatient && newVitalSigns.heartRate) {
      console.log("Agregando signos vitales:", newVitalSigns);
      // Aquí se agregarían los nuevos signos vitales
      setNewVitalSigns({
        heartRate: "",
        bloodPressure: "",
        temperature: "",
        oxygenSaturation: "",
        respiratoryRate: "",
        painLevel: "",
        notes: "",
      });
    }
  };

  const addMedicalNote = () => {
    if (selectedPatient && newNote.content) {
      console.log("Agregando nota médica:", newNote);
      // Aquí se agregaría la nueva nota
      setNewNote({
        type: "MEDICAL",
        content: "",
        priority: "MEDIUM",
      });
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    console.log("Reconociendo alerta:", alertId);
    // Aquí se marcaría la alerta como reconocida
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
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
            <Activity className="w-full h-full text-blue-500" />
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
                className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight">
                  SEGUIMIENTO DE{" "}
                  <span className="text-green-500 font-light">PACIENTES</span>
                </h1>
                <p className="text-black font-medium">
                  Monitor Integral de Evolución Clínica
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
              className="bg-green-100 border-green-300 text-green-700 px-4 py-2"
            >
              <Activity className="w-4 h-4 mr-2" />
              Monitor Activo
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Buscar Paciente
                </Label>
                <Input
                  placeholder="Nombre, ID o cama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 rounded-xl border-2"
                />
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
                    <SelectItem value="ALL">Todos los Estados</SelectItem>
                    <SelectItem value="STABLE">Estable</SelectItem>
                    <SelectItem value="CRITICAL">Crítico</SelectItem>
                    <SelectItem value="IMPROVING">Mejorando</SelectItem>
                    <SelectItem value="DETERIORATING">Deteriorando</SelectItem>
                    <SelectItem value="DISCHARGE_READY">
                      Listo para Alta
                    </SelectItem>
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
                    <SelectItem value="ALL">Todas las Prioridades</SelectItem>
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
                    <SelectItem value="ALL">Todos los Sectores</SelectItem>
                    <SelectItem value="UCI">UCI</SelectItem>
                    <SelectItem value="URGENCIAS">Urgencias</SelectItem>
                    <SelectItem value="CARDIOLOGIA">Cardiología</SelectItem>
                    <SelectItem value="GINECOLOGIA">Ginecología</SelectItem>
                    <SelectItem value="PEDIATRIA">Pediatría</SelectItem>
                    <SelectItem value="CIRUGIA">Cirugía</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="text-center w-full">
                  <p className="text-sm text-gray-600">Total Pacientes</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredPatients.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Pacientes */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
              transition={{ delay: index * 0.1 }}
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
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
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
                        <h3 className="font-bold text-lg text-black">
                          {patient.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.identificationNumber} • {patient.age} años
                        </p>
                        <p className="text-sm text-blue-600">
                          {patient.bedNumber} - {patient.sector}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={getPriorityColor(patient.priority)}
                        className="mb-2"
                      >
                        {patient.priority}
                      </Badge>
                      <br />
                      <Badge variant={getStatusColor(patient.status)}>
                        {getStatusText(patient.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          Diagnóstico
                        </span>
                      </div>
                      <p className="text-sm text-black">{patient.diagnosis}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center bg-gray-50 p-2 rounded">
                        <User className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Médico</p>
                        <p className="text-sm font-semibold text-black">
                          {patient.assignedDoctor}
                        </p>
                      </div>
                      <div className="text-center bg-gray-50 p-2 rounded">
                        <Heart className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Enfermera</p>
                        <p className="text-sm font-semibold text-black">
                          {patient.assignedNurse}
                        </p>
                      </div>
                    </div>

                    {/* Signos Vitales Más Recientes */}
                    {patient.vitalSigns.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center bg-red-50 p-2 rounded border border-red-200">
                          <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                          <p className="text-xs text-red-600">
                            {patient.vitalSigns[0].heartRate}
                          </p>
                          <p className="text-xs text-gray-500">bpm</p>
                        </div>
                        <div className="text-center bg-blue-50 p-2 rounded border border-blue-200">
                          <Activity className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                          <p className="text-xs text-blue-600">
                            {patient.vitalSigns[0].bloodPressure}
                          </p>
                          <p className="text-xs text-gray-500">mmHg</p>
                        </div>
                        <div className="text-center bg-yellow-50 p-2 rounded border border-yellow-200">
                          <Thermometer className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                          <p className="text-xs text-yellow-600">
                            {patient.vitalSigns[0].temperature}°C
                          </p>
                          <p className="text-xs text-gray-500">temp</p>
                        </div>
                        <div className="text-center bg-green-50 p-2 rounded border border-green-200">
                          <Shield className="w-4 h-4 text-green-500 mx-auto mb-1" />
                          <p className="text-xs text-green-600">
                            {patient.vitalSigns[0].oxygenSaturation}%
                          </p>
                          <p className="text-xs text-gray-500">O2</p>
                        </div>
                      </div>
                    )}

                    {/* Alertas Activas */}
                    {patient.alerts.filter((alert) => !alert.acknowledged)
                      .length > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Bell className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-800">
                            Alertas Activas
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            {
                              patient.alerts.filter(
                                (alert) => !alert.acknowledged,
                              ).length
                            }
                          </Badge>
                        </div>
                        {patient.alerts
                          .filter((alert) => !alert.acknowledged)
                          .slice(0, 2)
                          .map((alert) => (
                            <p
                              key={alert.id}
                              className="text-sm text-red-700 mb-1"
                            >
                              • {alert.message}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Completo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                            <Users className="w-6 h-6 text-green-500" />
                            Seguimiento Integral - {selectedPatient?.fullName}
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
                              <TabsList className="grid w-full grid-cols-7">
                                <TabsTrigger
                                  value="overview"
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  Resumen
                                </TabsTrigger>
                                <TabsTrigger
                                  value="vitals"
                                  className="flex items-center gap-1"
                                >
                                  <Heart className="w-4 h-4" />
                                  Vitales
                                </TabsTrigger>
                                <TabsTrigger
                                  value="medications"
                                  className="flex items-center gap-1"
                                >
                                  <Pill className="w-4 h-4" />
                                  Medicamentos
                                </TabsTrigger>
                                <TabsTrigger
                                  value="procedures"
                                  className="flex items-center gap-1"
                                >
                                  <Scissors className="w-4 h-4" />
                                  Procedimientos
                                </TabsTrigger>
                                <TabsTrigger
                                  value="labs"
                                  className="flex items-center gap-1"
                                >
                                  <Microscope className="w-4 h-4" />
                                  Laboratorios
                                </TabsTrigger>
                                <TabsTrigger
                                  value="notes"
                                  className="flex items-center gap-1"
                                >
                                  <FileText className="w-4 h-4" />
                                  Notas
                                </TabsTrigger>
                                <TabsTrigger
                                  value="alerts"
                                  className="flex items-center gap-1"
                                >
                                  <Bell className="w-4 h-4" />
                                  Alertas
                                </TabsTrigger>
                              </TabsList>

                              {/* Tab: Resumen */}
                              <TabsContent
                                value="overview"
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Diagnóstico
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
                                        Contacto y Seguro
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3 text-sm">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
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
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Información del Seguro
                                          </Label>
                                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <p className="font-semibold text-black">
                                              {selectedPatient.insurance.eps}
                                            </p>
                                            <p className="text-gray-600">
                                              {selectedPatient.insurance.plan}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                              Auth:{" "}
                                              {
                                                selectedPatient.insurance
                                                  .authorization
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Users className="w-5 h-5 text-purple-500" />
                                      Equipo Médico Asignado
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
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
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Signos Vitales */}
                              <TabsContent value="vitals" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Plus className="w-5 h-5 text-green-500" />
                                      Registrar Nuevos Signos Vitales
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                      <div>
                                        <Label>Frecuencia Cardíaca (bpm)</Label>
                                        <Input
                                          type="number"
                                          value={newVitalSigns.heartRate}
                                          onChange={(e) =>
                                            setNewVitalSigns((prev) => ({
                                              ...prev,
                                              heartRate: e.target.value,
                                            }))
                                          }
                                          placeholder="80"
                                        />
                                      </div>
                                      <div>
                                        <Label>Presión Arterial</Label>
                                        <Input
                                          value={newVitalSigns.bloodPressure}
                                          onChange={(e) =>
                                            setNewVitalSigns((prev) => ({
                                              ...prev,
                                              bloodPressure: e.target.value,
                                            }))
                                          }
                                          placeholder="120/80"
                                        />
                                      </div>
                                      <div>
                                        <Label>Temperatura (°C)</Label>
                                        <Input
                                          type="number"
                                          step="0.1"
                                          value={newVitalSigns.temperature}
                                          onChange={(e) =>
                                            setNewVitalSigns((prev) => ({
                                              ...prev,
                                              temperature: e.target.value,
                                            }))
                                          }
                                          placeholder="36.5"
                                        />
                                      </div>
                                      <div>
                                        <Label>Saturación O2 (%)</Label>
                                        <Input
                                          type="number"
                                          value={newVitalSigns.oxygenSaturation}
                                          onChange={(e) =>
                                            setNewVitalSigns((prev) => ({
                                              ...prev,
                                              oxygenSaturation: e.target.value,
                                            }))
                                          }
                                          placeholder="98"
                                        />
                                      </div>
                                      <div>
                                        <Label>Frecuencia Respiratoria</Label>
                                        <Input
                                          type="number"
                                          value={newVitalSigns.respiratoryRate}
                                          onChange={(e) =>
                                            setNewVitalSigns((prev) => ({
                                              ...prev,
                                              respiratoryRate: e.target.value,
                                            }))
                                          }
                                          placeholder="16"
                                        />
                                      </div>
                                      <div>
                                        <Label>Dolor (0-10)</Label>
                                        <Input
                                          type="number"
                                          min="0"
                                          max="10"
                                          value={newVitalSigns.painLevel}
                                          onChange={(e) =>
                                            setNewVitalSigns((prev) => ({
                                              ...prev,
                                              painLevel: e.target.value,
                                            }))
                                          }
                                          placeholder="0"
                                        />
                                      </div>
                                      <div className="md:col-span-2">
                                        <Label>Notas</Label>
                                        <Input
                                          value={newVitalSigns.notes}
                                          onChange={(e) =>
                                            setNewVitalSigns((prev) => ({
                                              ...prev,
                                              notes: e.target.value,
                                            }))
                                          }
                                          placeholder="Observaciones adicionales..."
                                        />
                                      </div>
                                    </div>
                                    <Button
                                      onClick={addVitalSigns}
                                      className="w-full"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Registrar Signos Vitales
                                    </Button>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <TrendingUp className="w-5 h-5 text-blue-500" />
                                      Historial de Signos Vitales
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.vitalSigns.map(
                                        (vital, index) => (
                                          <div
                                            key={vital.id}
                                            className="p-4 bg-gray-50 rounded-lg border"
                                          >
                                            <div className="flex justify-between items-start mb-3">
                                              <div className="text-sm text-gray-600">
                                                {new Date(
                                                  vital.timestamp,
                                                ).toLocaleString("es-CO")}
                                              </div>
                                              <Badge variant="outline">
                                                {vital.recordedBy}
                                              </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                              <div className="text-center">
                                                <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-red-600">
                                                  {vital.heartRate}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  bpm
                                                </p>
                                              </div>
                                              <div className="text-center">
                                                <Activity className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-blue-600">
                                                  {vital.bloodPressure}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  mmHg
                                                </p>
                                              </div>
                                              <div className="text-center">
                                                <Thermometer className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-yellow-600">
                                                  {vital.temperature}°
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  C
                                                </p>
                                              </div>
                                              <div className="text-center">
                                                <Shield className="w-6 h-6 text-green-500 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-green-600">
                                                  {vital.oxygenSaturation}%
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  O2
                                                </p>
                                              </div>
                                              <div className="text-center">
                                                <Activity className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-purple-600">
                                                  {vital.respiratoryRate}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  rpm
                                                </p>
                                              </div>
                                              <div className="text-center">
                                                <Target className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-orange-600">
                                                  {vital.painLevel}/10
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  dolor
                                                </p>
                                              </div>
                                            </div>
                                            {vital.notes && (
                                              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                                <p className="text-sm text-blue-800">
                                                  {vital.notes}
                                                </p>
                                              </div>
                                            )}
                                          </div>
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
                                      Medicamentos Activos
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.medications
                                        .filter(
                                          (med) => med.status === "ACTIVE",
                                        )
                                        .map((medication) => (
                                          <div
                                            key={medication.id}
                                            className="p-4 bg-green-50 rounded-lg border border-green-200"
                                          >
                                            <div className="flex justify-between items-start mb-3">
                                              <div>
                                                <h4 className="font-bold text-black">
                                                  {medication.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                  {medication.dosage} -{" "}
                                                  {medication.frequency}
                                                </p>
                                                <p className="text-sm text-blue-600">
                                                  Vía: {medication.route}
                                                </p>
                                              </div>
                                              <Badge variant="success">
                                                Activo
                                              </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
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
                                                  Fecha de inicio:
                                                </Label>
                                                <p className="text-black">
                                                  {new Date(
                                                    medication.startDate,
                                                  ).toLocaleDateString("es-CO")}
                                                </p>
                                              </div>
                                              {medication.lastAdministered && (
                                                <div>
                                                  <Label className="text-gray-600">
                                                    Última dosis:
                                                  </Label>
                                                  <p className="text-black">
                                                    {new Date(
                                                      medication.lastAdministered,
                                                    ).toLocaleString("es-CO")}
                                                  </p>
                                                </div>
                                              )}
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
                                            {medication.notes && (
                                              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                                <p className="text-sm text-blue-800">
                                                  {medication.notes}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        ))}
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
                                        (procedure) => (
                                          <div
                                            key={procedure.id}
                                            className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                                          >
                                            <div className="flex justify-between items-start mb-3">
                                              <div>
                                                <h4 className="font-bold text-black">
                                                  {procedure.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                  {procedure.type}
                                                </p>
                                                <p className="text-sm text-blue-600">
                                                  {new Date(
                                                    procedure.date,
                                                  ).toLocaleString("es-CO")}
                                                </p>
                                              </div>
                                              <Badge
                                                variant={
                                                  procedure.status ===
                                                  "COMPLETED"
                                                    ? "success"
                                                    : "secondary"
                                                }
                                              >
                                                {procedure.status}
                                              </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                              <div>
                                                <Label className="text-gray-600">
                                                  Realizado por:
                                                </Label>
                                                <p className="text-black">
                                                  {procedure.performedBy}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-gray-600">
                                                  Duración:
                                                </Label>
                                                <p className="text-black">
                                                  {procedure.duration}
                                                </p>
                                              </div>
                                              {procedure.results && (
                                                <div className="col-span-2">
                                                  <Label className="text-gray-600">
                                                    Resultados:
                                                  </Label>
                                                  <p className="text-black p-2 bg-yellow-50 rounded border border-yellow-200">
                                                    {procedure.results}
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
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
                                      {selectedPatient.labResults.map((lab) => (
                                        <div
                                          key={lab.id}
                                          className={`p-4 rounded-lg border ${
                                            lab.status === "ABNORMAL"
                                              ? "bg-red-50 border-red-200"
                                              : "bg-green-50 border-green-200"
                                          }`}
                                        >
                                          <div className="flex justify-between items-start mb-3">
                                            <div>
                                              <h4 className="font-bold text-black">
                                                {lab.testName}
                                              </h4>
                                              <p className="text-sm text-gray-600">
                                                {lab.category}
                                              </p>
                                              <p className="text-sm text-blue-600">
                                                Ordenado:{" "}
                                                {new Date(
                                                  lab.orderDate,
                                                ).toLocaleDateString("es-CO")}
                                              </p>
                                            </div>
                                            <Badge
                                              variant={
                                                lab.status === "ABNORMAL"
                                                  ? "destructive"
                                                  : "success"
                                              }
                                            >
                                              {lab.status}
                                            </Badge>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                              <Label className="text-gray-600">
                                                Valor:
                                              </Label>
                                              <p className="text-black font-bold text-lg">
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
                                                Ordenado por:
                                              </Label>
                                              <p className="text-black">
                                                {lab.orderedBy}
                                              </p>
                                            </div>
                                            {lab.resultDate && (
                                              <div>
                                                <Label className="text-gray-600">
                                                  Fecha de resultado:
                                                </Label>
                                                <p className="text-black">
                                                  {new Date(
                                                    lab.resultDate,
                                                  ).toLocaleDateString("es-CO")}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                          {lab.notes && (
                                            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                              <p className="text-sm text-blue-800">
                                                {lab.notes}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Notas Médicas */}
                              <TabsContent value="notes" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Plus className="w-5 h-5 text-blue-500" />
                                      Agregar Nueva Nota
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Tipo de Nota</Label>
                                          <Select
                                            value={newNote.type}
                                            onValueChange={(value) =>
                                              setNewNote((prev) => ({
                                                ...prev,
                                                type: value as MedicalNote["type"],
                                              }))
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="MEDICAL">
                                                Médica
                                              </SelectItem>
                                              <SelectItem value="NURSING">
                                                Enfermería
                                              </SelectItem>
                                              <SelectItem value="PHARMACY">
                                                Farmacia
                                              </SelectItem>
                                              <SelectItem value="THERAPY">
                                                Terapia
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label>Prioridad</Label>
                                          <Select
                                            value={newNote.priority}
                                            onValueChange={(value) =>
                                              setNewNote((prev) => ({
                                                ...prev,
                                                priority:
                                                  value as MedicalNote["priority"],
                                              }))
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="LOW">
                                                Baja
                                              </SelectItem>
                                              <SelectItem value="MEDIUM">
                                                Media
                                              </SelectItem>
                                              <SelectItem value="HIGH">
                                                Alta
                                              </SelectItem>
                                              <SelectItem value="URGENT">
                                                Urgente
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Contenido de la Nota</Label>
                                        <Textarea
                                          value={newNote.content}
                                          onChange={(e) =>
                                            setNewNote((prev) => ({
                                              ...prev,
                                              content: e.target.value,
                                            }))
                                          }
                                          placeholder="Escriba su nota médica aquí..."
                                          rows={4}
                                        />
                                      </div>
                                      <Button
                                        onClick={addMedicalNote}
                                        className="w-full"
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar Nota
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <FileText className="w-5 h-5 text-gray-500" />
                                      Historial de Notas
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.notes.map((note) => (
                                        <div
                                          key={note.id}
                                          className="p-4 bg-gray-50 rounded-lg border"
                                        >
                                          <div className="flex justify-between items-start mb-3">
                                            <div>
                                              <div className="flex items-center gap-2">
                                                <Badge variant="outline">
                                                  {note.type}
                                                </Badge>
                                                <Badge
                                                  variant={
                                                    note.priority === "URGENT"
                                                      ? "destructive"
                                                      : note.priority === "HIGH"
                                                        ? "warning"
                                                        : "secondary"
                                                  }
                                                >
                                                  {note.priority}
                                                </Badge>
                                              </div>
                                              <p className="text-sm text-gray-600 mt-1">
                                                {note.author}
                                              </p>
                                              <p className="text-sm text-gray-500">
                                                {new Date(
                                                  note.timestamp,
                                                ).toLocaleString("es-CO")}
                                              </p>
                                            </div>
                                          </div>
                                          <p className="text-black leading-relaxed">
                                            {note.content}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Alertas */}
                              <TabsContent value="alerts" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Bell className="w-5 h-5 text-red-500" />
                                      Alertas Activas
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      {selectedPatient.alerts.map((alert) => (
                                        <div
                                          key={alert.id}
                                          className={`p-4 rounded-lg border ${
                                            alert.acknowledged
                                              ? "bg-gray-50 border-gray-200"
                                              : alert.priority === "CRITICAL"
                                                ? "bg-red-50 border-red-200"
                                                : alert.priority === "HIGH"
                                                  ? "bg-yellow-50 border-yellow-200"
                                                  : "bg-blue-50 border-blue-200"
                                          }`}
                                        >
                                          <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant={getAlertColor(
                                                  alert.priority,
                                                )}
                                              >
                                                {alert.priority}
                                              </Badge>
                                              <Badge variant="outline">
                                                {alert.type}
                                              </Badge>
                                              {alert.acknowledged && (
                                                <Badge variant="success">
                                                  Reconocida
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                              {new Date(
                                                alert.timestamp,
                                              ).toLocaleString("es-CO")}
                                            </p>
                                          </div>
                                          <p className="text-black mb-3">
                                            {alert.message}
                                          </p>
                                          {alert.acknowledged ? (
                                            <p className="text-sm text-green-600">
                                              Reconocida por:{" "}
                                              {alert.acknowledgedBy}
                                            </p>
                                          ) : (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                acknowledgeAlert(alert.id)
                                              }
                                            >
                                              <CheckCircle className="w-4 h-4 mr-2" />
                                              Reconocer Alerta
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </motion.div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Estado Vacío */}
      <AnimatePresence>
        {filteredPatients.length === 0 && (
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
                No se encontraron pacientes
              </h3>
              <p className="text-black">
                Ajuste los filtros para ver más pacientes en seguimiento.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
