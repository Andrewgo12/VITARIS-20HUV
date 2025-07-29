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
  Bed,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  Activity,
  Heart,
  Thermometer,
  Eye,
  Edit3,
  Plus,
  ArrowLeft,
  Building,
  MapPin,
  UserCheck,
  Stethoscope,
  AlertCircle,
  ClipboardList,
  Timer,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Bed {
  id: string;
  number: string;
  sector: string;
  floor: number;
  status: "OCCUPIED" | "AVAILABLE" | "MAINTENANCE" | "CLEANING";
  patient?: PatientInBed;
  lastCleaning: string;
  equipment: string[];
  notes: string;
}

interface PatientInBed {
  id: string;
  fullName: string;
  identificationNumber: string;
  age: number;
  sex: string;
  admissionDate: string;
  diagnosis: string;
  priority: "CRITICO" | "SEVERO" | "MODERADO" | "LEVE";
  doctor: string;
  vitalSigns: {
    heartRate: string;
    bloodPressure: string;
    temperature: string;
    oxygenSaturation: string;
  };
  medications: string[];
  lastUpdate: string;
}

interface Sector {
  id: string;
  name: string;
  floor: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
  description: string;
  headNurse: string;
  phone: string;
}

// Datos de prueba
const mockSectors: Sector[] = [
  {
    id: "UCI",
    name: "Unidad de Cuidados Intensivos",
    floor: 3,
    totalBeds: 20,
    occupiedBeds: 18,
    availableBeds: 1,
    maintenanceBeds: 1,
    description: "Cuidados intensivos para pacientes críticos",
    headNurse: "Enf. Carmen López",
    phone: "3201234567",
  },
  {
    id: "URGENCIAS",
    name: "Urgencias",
    floor: 1,
    totalBeds: 30,
    occupiedBeds: 25,
    availableBeds: 4,
    maintenanceBeds: 1,
    description: "Atención de emergencias médicas",
    headNurse: "Enf. Roberto Díaz",
    phone: "3209876543",
  },
  {
    id: "CARDIOLOGIA",
    name: "Cardiología",
    floor: 2,
    totalBeds: 25,
    occupiedBeds: 20,
    availableBeds: 3,
    maintenanceBeds: 2,
    description: "Especialidad en enfermedades cardiovasculares",
    headNurse: "Enf. María Rodríguez",
    phone: "3205555666",
  },
  {
    id: "GINECOLOGIA",
    name: "Ginecología y Obstetricia",
    floor: 4,
    totalBeds: 22,
    occupiedBeds: 15,
    availableBeds: 5,
    maintenanceBeds: 2,
    description: "Atención ginecológica y obstétrica",
    headNurse: "Enf. Ana Herrera",
    phone: "3207778888",
  },
  {
    id: "PEDIATRIA",
    name: "Pediatría",
    floor: 2,
    totalBeds: 18,
    occupiedBeds: 12,
    availableBeds: 5,
    maintenanceBeds: 1,
    description: "Atención especializada para niños",
    headNurse: "Enf. Luis Morales",
    phone: "3203334444",
  },
  {
    id: "CIRUGIA",
    name: "Cirugía General",
    floor: 3,
    totalBeds: 28,
    occupiedBeds: 22,
    availableBeds: 4,
    maintenanceBeds: 2,
    description: "Pre y post quirúrgico general",
    headNurse: "Enf. Patricia Silva",
    phone: "3201112222",
  },
];

const mockBeds: Bed[] = [
  {
    id: "UCI-001",
    number: "UCI-001",
    sector: "UCI",
    floor: 3,
    status: "OCCUPIED",
    patient: {
      id: "P001",
      fullName: "Juan Carlos Pérez González",
      identificationNumber: "12345678",
      age: 45,
      sex: "Masculino",
      admissionDate: "2024-01-20T10:30:00",
      diagnosis: "Infarto agudo de miocardio",
      priority: "CRITICO",
      doctor: "Dr. Alberto Ramírez",
      vitalSigns: {
        heartRate: "85",
        bloodPressure: "130/80",
        temperature: "36.8",
        oxygenSaturation: "95",
      },
      medications: ["Aspirina 100mg", "Clopidogrel 75mg", "Atorvastatina 40mg"],
      lastUpdate: "2024-01-20T14:30:00",
    },
    lastCleaning: "2024-01-20T08:00:00",
    equipment: ["Monitor cardíaco", "Ventilador", "Bomba de infusión"],
    notes: "Paciente estable, continuar monitoreo",
  },
  {
    id: "UCI-002",
    number: "UCI-002",
    sector: "UCI",
    floor: 3,
    status: "OCCUPIED",
    patient: {
      id: "P002",
      fullName: "María Elena Rodríguez Vargas",
      identificationNumber: "87654321",
      age: 32,
      sex: "Femenino",
      admissionDate: "2024-01-20T14:15:00",
      diagnosis: "Preeclampsia severa",
      priority: "SEVERO",
      doctor: "Dra. Carmen López",
      vitalSigns: {
        heartRate: "92",
        bloodPressure: "160/110",
        temperature: "37.2",
        oxygenSaturation: "98",
      },
      medications: ["Sulfato de magnesio", "Nifedipina", "Metildopa"],
      lastUpdate: "2024-01-20T16:00:00",
    },
    lastCleaning: "2024-01-20T09:00:00",
    equipment: ["Monitor fetal", "Monitor cardíaco", "Bomba de infusión"],
    notes: "Embarazo 32 semanas, monitoreo materno-fetal continuo",
  },
  {
    id: "UCI-003",
    number: "UCI-003",
    sector: "UCI",
    floor: 3,
    status: "AVAILABLE",
    lastCleaning: "2024-01-20T10:00:00",
    equipment: ["Monitor cardíaco", "Ventilador"],
    notes: "Cama lista para nuevo paciente",
  },
  {
    id: "URG-001",
    number: "URG-001",
    sector: "URGENCIAS",
    floor: 1,
    status: "OCCUPIED",
    patient: {
      id: "P003",
      fullName: "Carlos Alberto Mendoza Silva",
      identificationNumber: "11223344",
      age: 58,
      sex: "Masculino",
      admissionDate: "2024-01-20T16:00:00",
      diagnosis: "Politraumatismo por accidente de tránsito",
      priority: "CRITICO",
      doctor: "Dr. Fernando Castillo",
      vitalSigns: {
        heartRate: "110",
        bloodPressure: "90/60",
        temperature: "36.5",
        oxygenSaturation: "92",
      },
      medications: ["Morfina", "Omeprazol", "Ceftriaxona"],
      lastUpdate: "2024-01-20T17:30:00",
    },
    lastCleaning: "2024-01-20T15:00:00",
    equipment: ["Monitor cardíaco", "Oxímetro"],
    notes: "Paciente en observación, preparar para cirugía",
  },
];

export default function BedsManagement() {
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientInBed | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [bedStatusFilter, setBedStatusFilter] = useState("ALL");
  const [newPatientData, setNewPatientData] = useState({
    fullName: "",
    identificationNumber: "",
    diagnosis: "",
    doctor: "",
    priority: "MODERADO" as PatientInBed["priority"],
  });
  const navigate = useNavigate();

  const filteredBeds = mockBeds.filter((bed) => {
    const matchesSector =
      selectedSector === "ALL" || bed.sector === selectedSector;
    const matchesStatus =
      bedStatusFilter === "ALL" || bed.status === bedStatusFilter;
    const matchesSearch =
      searchTerm === "" ||
      bed.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.patient?.identificationNumber.includes(searchTerm);

    return matchesSector && matchesStatus && matchesSearch;
  });

  const getSectorData = (sectorId: string) => {
    return mockSectors.find((s) => s.id === sectorId);
  };

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case "OCCUPIED":
        return "destructive";
      case "AVAILABLE":
        return "success";
      case "MAINTENANCE":
        return "warning";
      case "CLEANING":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getBedStatusText = (status: string) => {
    switch (status) {
      case "OCCUPIED":
        return "Ocupada";
      case "AVAILABLE":
        return "Disponible";
      case "MAINTENANCE":
        return "Mantenimiento";
      case "CLEANING":
        return "Limpieza";
      default:
        return status;
    }
  };

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

  const assignPatientToBed = (bedId: string) => {
    // Lógica para asignar paciente a cama
    console.log("Asignando paciente a cama:", bedId, newPatientData);
  };

  const dischargePatient = (bedId: string) => {
    // Lógica para dar de alta
    console.log("Dando de alta paciente de cama:", bedId);
  };

  const transferPatient = (fromBedId: string, toBedId: string) => {
    // Lógica para transferir paciente
    console.log("Transfiriendo paciente de", fromBedId, "a", toBedId);
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
            <Building className="w-full h-full text-blue-500" />
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
                className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Bed className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight">
                  GESTIÓN DE{" "}
                  <span className="text-blue-500 font-light">CAMAS</span>
                </h1>
                <p className="text-black font-medium">
                  Sistema de Control de Hospitalización
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
              Sistema Activo
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Estadísticas por Sectores */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {mockSectors.map((sector, index) => (
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedSector === sector.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "bg-white/90"
              }`}
              onClick={() => setSelectedSector(sector.id)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-black mb-1">
                    {sector.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Piso {sector.floor}
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Ocupadas:</span>
                      <Badge
                        variant="destructive"
                        className="text-xs px-2 py-0"
                      >
                        {sector.occupiedBeds}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Disponibles:</span>
                      <Badge variant="success" className="text-xs px-2 py-0">
                        {sector.availableBeds}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold">{sector.totalBeds}</span>
                    </div>
                  </div>

                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(sector.occupiedBeds / sector.totalBeds) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.round((sector.occupiedBeds / sector.totalBeds) * 100)}
                    % Ocupación
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filtros */}
      <motion.div
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Buscar Cama/Paciente
                </Label>
                <Input
                  placeholder="Número de cama, nombre o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 rounded-xl border-2"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Sector
                </Label>
                <Select
                  value={selectedSector}
                  onValueChange={setSelectedSector}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los Sectores</SelectItem>
                    {mockSectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Estado de Cama
                </Label>
                <Select
                  value={bedStatusFilter}
                  onValueChange={setBedStatusFilter}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los Estados</SelectItem>
                    <SelectItem value="OCCUPIED">Ocupadas</SelectItem>
                    <SelectItem value="AVAILABLE">Disponibles</SelectItem>
                    <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                    <SelectItem value="CLEANING">Limpieza</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="text-center w-full">
                  <p className="text-sm text-gray-600">Total Camas</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredBeds.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Camas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredBeds.map((bed, index) => (
            <motion.div
              key={bed.id}
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
                    bed.status === "OCCUPIED"
                      ? "border-l-8 border-l-red-500"
                      : bed.status === "AVAILABLE"
                        ? "border-l-8 border-l-green-500"
                        : bed.status === "MAINTENANCE"
                          ? "border-l-8 border-l-yellow-500"
                          : "border-l-8 border-l-gray-500"
                  }
                `}
                onClick={() => setSelectedBed(bed)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          bed.status === "OCCUPIED"
                            ? "bg-red-500"
                            : bed.status === "AVAILABLE"
                              ? "bg-green-500"
                              : bed.status === "MAINTENANCE"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Bed className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg text-black">
                          {bed.number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getSectorData(bed.sector)?.name}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={getBedStatusColor(bed.status)}
                      className="px-3 py-1"
                    >
                      {getBedStatusText(bed.status)}
                    </Badge>
                  </div>

                  {bed.patient ? (
                    <div className="space-y-3">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-800">
                            {bed.patient.fullName}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">ID:</span>
                            <span className="ml-1 text-black">
                              {bed.patient.identificationNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Edad:</span>
                            <span className="ml-1 text-black">
                              {bed.patient.age} años
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">Diagnóstico:</p>
                          <p className="text-sm text-black font-medium">
                            {bed.patient.diagnosis}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={getPriorityColor(bed.patient.priority)}
                            className="text-xs"
                          >
                            {bed.patient.priority}
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {bed.patient.doctor}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded border border-blue-200">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            <span>{bed.patient.vitalSigns.heartRate} bpm</span>
                          </div>
                        </div>
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-green-500" />
                            <span>
                              {bed.patient.vitalSigns.oxygenSaturation}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-800 font-semibold">
                          Cama Disponible
                        </p>
                        <p className="text-green-600 text-sm">
                          Lista para nuevo paciente
                        </p>
                      </div>

                      <div className="text-xs text-gray-600">
                        <p>
                          <strong>Última limpieza:</strong>{" "}
                          {new Date(bed.lastCleaning).toLocaleString("es-CO")}
                        </p>
                        <p>
                          <strong>Equipos:</strong> {bed.equipment.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                            <Bed className="w-6 h-6 text-blue-500" />
                            Gestión de Cama - {selectedBed?.number}
                          </DialogTitle>
                        </DialogHeader>

                        {selectedBed && (
                          <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Tabs
                              defaultValue="patient-info"
                              className="w-full"
                            >
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger
                                  value="patient-info"
                                  className="flex items-center gap-2"
                                >
                                  <User className="w-4 h-4" />
                                  Paciente
                                </TabsTrigger>
                                <TabsTrigger
                                  value="vitals"
                                  className="flex items-center gap-2"
                                >
                                  <Thermometer className="w-4 h-4" />
                                  Signos Vitales
                                </TabsTrigger>
                                <TabsTrigger
                                  value="bed-management"
                                  className="flex items-center gap-2"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Gestión
                                </TabsTrigger>
                                <TabsTrigger
                                  value="history"
                                  className="flex items-center gap-2"
                                >
                                  <Clock className="w-4 h-4" />
                                  Historial
                                </TabsTrigger>
                              </TabsList>

                              {/* Tab: Información del Paciente */}
                              <TabsContent
                                value="patient-info"
                                className="space-y-4"
                              >
                                {selectedBed.patient ? (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-500" />
                                        Información del Paciente
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Nombre Completo
                                          </Label>
                                          <p className="text-black">
                                            {selectedBed.patient.fullName}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Identificación
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedBed.patient
                                                .identificationNumber
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Edad
                                          </Label>
                                          <p className="text-black">
                                            {selectedBed.patient.age} años
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Sexo
                                          </Label>
                                          <p className="text-black">
                                            {selectedBed.patient.sex}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Fecha de Ingreso
                                          </Label>
                                          <p className="text-black">
                                            {new Date(
                                              selectedBed.patient.admissionDate,
                                            ).toLocaleString("es-CO")}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Médico Responsable
                                          </Label>
                                          <p className="text-black">
                                            {selectedBed.patient.doctor}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="mt-4">
                                        <Label className="font-semibold text-gray-700">
                                          Diagnóstico
                                        </Label>
                                        <p className="text-black p-3 bg-blue-50 rounded-lg border border-blue-200">
                                          {selectedBed.patient.diagnosis}
                                        </p>
                                      </div>
                                      <div className="mt-4">
                                        <Label className="font-semibold text-gray-700">
                                          Medicamentos
                                        </Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {selectedBed.patient.medications.map(
                                            (med, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="outline"
                                                className="px-3 py-1"
                                              >
                                                {med}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <Card>
                                    <CardContent className="p-8 text-center">
                                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                      <h3 className="text-xl font-semibold text-black mb-2">
                                        Cama Disponible
                                      </h3>
                                      <p className="text-gray-600">
                                        Esta cama está lista para recibir un
                                        nuevo paciente
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}
                              </TabsContent>

                              {/* Tab: Signos Vitales */}
                              <TabsContent value="vitals" className="space-y-4">
                                {selectedBed.patient ? (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-red-500" />
                                        Signos Vitales Actuales
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                          <p className="text-sm text-gray-600">
                                            Frecuencia Cardíaca
                                          </p>
                                          <p className="text-2xl font-bold text-red-600">
                                            {
                                              selectedBed.patient.vitalSigns
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
                                              selectedBed.patient.vitalSigns
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
                                              selectedBed.patient.vitalSigns
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
                                              selectedBed.patient.vitalSigns
                                                .oxygenSaturation
                                            }
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            %
                                          </p>
                                        </div>
                                      </div>
                                      <div className="mt-4 text-xs text-gray-600">
                                        <p>
                                          <strong>Última actualización:</strong>{" "}
                                          {new Date(
                                            selectedBed.patient.lastUpdate,
                                          ).toLocaleString("es-CO")}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <Card>
                                    <CardContent className="p-8 text-center">
                                      <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                      <h3 className="text-xl font-semibold text-black mb-2">
                                        Sin Paciente
                                      </h3>
                                      <p className="text-gray-600">
                                        No hay signos vitales que mostrar
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}
                              </TabsContent>

                              {/* Tab: Gestión de Cama */}
                              <TabsContent
                                value="bed-management"
                                className="space-y-4"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Edit3 className="w-5 h-5 text-orange-500" />
                                      Gestión de Cama
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="font-semibold text-gray-700">
                                          Estado de la Cama
                                        </Label>
                                        <Select
                                          defaultValue={selectedBed.status}
                                        >
                                          <SelectTrigger className="h-11 rounded-xl border-2">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="OCCUPIED">
                                              Ocupada
                                            </SelectItem>
                                            <SelectItem value="AVAILABLE">
                                              Disponible
                                            </SelectItem>
                                            <SelectItem value="MAINTENANCE">
                                              Mantenimiento
                                            </SelectItem>
                                            <SelectItem value="CLEANING">
                                              Limpieza
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label className="font-semibold text-gray-700">
                                          Equipos Disponibles
                                        </Label>
                                        <Input
                                          value={selectedBed.equipment.join(
                                            ", ",
                                          )}
                                          placeholder="Lista de equipos..."
                                          className="h-11 rounded-xl border-2"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <Label className="font-semibold text-gray-700">
                                        Notas de la Cama
                                      </Label>
                                      <Textarea
                                        value={selectedBed.notes}
                                        placeholder="Observaciones sobre la cama..."
                                        className="rounded-xl border-2 resize-none"
                                        rows={3}
                                      />
                                    </div>

                                    {selectedBed.patient ? (
                                      <div className="flex gap-3 pt-4">
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            setSelectedPatient(
                                              selectedBed.patient,
                                            )
                                          }
                                        >
                                          <UserCheck className="w-4 h-4 mr-2" />
                                          Ver Paciente Completo
                                        </Button>
                                        <Button
                                          variant="secondary"
                                          onClick={() =>
                                            console.log("Transferir paciente")
                                          }
                                        >
                                          <TrendingUp className="w-4 h-4 mr-2" />
                                          Transferir
                                        </Button>
                                        <Button
                                          variant="success"
                                          onClick={() =>
                                            dischargePatient(selectedBed.id)
                                          }
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Dar de Alta
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex gap-3 pt-4">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="success"
                                              className="flex-1"
                                            >
                                              <Plus className="w-4 h-4 mr-2" />
                                              Asignar Paciente
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Asignar Paciente a Cama{" "}
                                                {selectedBed.number}
                                              </DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div>
                                                <Label>
                                                  Nombre del Paciente
                                                </Label>
                                                <Input
                                                  value={
                                                    newPatientData.fullName
                                                  }
                                                  onChange={(e) =>
                                                    setNewPatientData(
                                                      (prev) => ({
                                                        ...prev,
                                                        fullName:
                                                          e.target.value,
                                                      }),
                                                    )
                                                  }
                                                  placeholder="Nombre completo"
                                                />
                                              </div>
                                              <div>
                                                <Label>Identificación</Label>
                                                <Input
                                                  value={
                                                    newPatientData.identificationNumber
                                                  }
                                                  onChange={(e) =>
                                                    setNewPatientData(
                                                      (prev) => ({
                                                        ...prev,
                                                        identificationNumber:
                                                          e.target.value,
                                                      }),
                                                    )
                                                  }
                                                  placeholder="Número de identificación"
                                                />
                                              </div>
                                              <div>
                                                <Label>Diagnóstico</Label>
                                                <Input
                                                  value={
                                                    newPatientData.diagnosis
                                                  }
                                                  onChange={(e) =>
                                                    setNewPatientData(
                                                      (prev) => ({
                                                        ...prev,
                                                        diagnosis:
                                                          e.target.value,
                                                      }),
                                                    )
                                                  }
                                                  placeholder="Diagnóstico principal"
                                                />
                                              </div>
                                              <div>
                                                <Label>
                                                  Médico Responsable
                                                </Label>
                                                <Input
                                                  value={newPatientData.doctor}
                                                  onChange={(e) =>
                                                    setNewPatientData(
                                                      (prev) => ({
                                                        ...prev,
                                                        doctor: e.target.value,
                                                      }),
                                                    )
                                                  }
                                                  placeholder="Nombre del médico"
                                                />
                                              </div>
                                              <div>
                                                <Label>Prioridad</Label>
                                                <Select
                                                  value={
                                                    newPatientData.priority
                                                  }
                                                  onValueChange={(value) =>
                                                    setNewPatientData(
                                                      (prev) => ({
                                                        ...prev,
                                                        priority:
                                                          value as PatientInBed["priority"],
                                                      }),
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="CRITICO">
                                                      Crítico
                                                    </SelectItem>
                                                    <SelectItem value="SEVERO">
                                                      Severo
                                                    </SelectItem>
                                                    <SelectItem value="MODERADO">
                                                      Moderado
                                                    </SelectItem>
                                                    <SelectItem value="LEVE">
                                                      Leve
                                                    </SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <Button
                                                onClick={() =>
                                                  assignPatientToBed(
                                                    selectedBed.id,
                                                  )
                                                }
                                                className="w-full"
                                              >
                                                Asignar Paciente
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {/* Tab: Historial */}
                              <TabsContent
                                value="history"
                                className="space-y-4"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Clock className="w-5 h-5 text-gray-500" />
                                      Historial de la Cama
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <div>
                                          <p className="text-sm text-gray-600">
                                            {new Date(
                                              selectedBed.lastCleaning,
                                            ).toLocaleString("es-CO")}
                                          </p>
                                          <p className="text-black font-semibold">
                                            Última limpieza realizada
                                          </p>
                                          <p className="text-gray-600 text-sm">
                                            Cama preparada para uso
                                          </p>
                                        </div>
                                      </div>

                                      {selectedBed.patient && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                          <div>
                                            <p className="text-sm text-gray-600">
                                              {new Date(
                                                selectedBed.patient.admissionDate,
                                              ).toLocaleString("es-CO")}
                                            </p>
                                            <p className="text-black font-semibold">
                                              Paciente ingresado
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                              {selectedBed.patient.fullName}
                                            </p>
                                          </div>
                                        </div>
                                      )}
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
        {filteredBeds.length === 0 && (
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
                No se encontraron camas
              </h3>
              <p className="text-black">
                Ajuste los filtros para ver más camas disponibles.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
