import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Stethoscope,
  Calculator,
  FileText,
  Bell,
  TrendingUp,
  Calendar,
  UserCheck,
  Thermometer,
  Timer,
  Phone,
  Mail,
  Home,
  ArrowLeft,
} from "lucide-react";

// Datos mock expandidos de pacientes
const mockPatientsAdvanced = [
  {
    id: 1,
    name: "María Elena Rodríguez",
    age: 67,
    gender: "Femenino",
    admissionTime: "2024-01-15T08:30:00",
    symptoms:
      "Dolor torácico agudo, dificultad respiratoria, sudoración profusa",
    diagnosis: "Posible infarto agudo de miocardio",
    urgencyLevel: "CRITICO",
    doctor: "Dr. Carlos Mendoza",
    room: "UCI-101",
    process: "cardiologia",
    vitals: {
      heartRate: "120",
      bloodPressure: "180/95",
      temperature: "38.5",
      oxygenSaturation: "89",
      respiratoryRate: "28",
    },
    lastUpdate: "Hace 2 minutos",
    status: "En observación",
    medications: ["Aspirina 100mg", "Atorvastatina 40mg", "Metoprolol 50mg"],
    allergies: ["Penicilina", "Mariscos"],
    bloodType: "O+",
    weight: "72kg",
    height: "1.65m",
    contactPhone: "+57 301 234 5678",
    emergencyContact: "José Rodríguez (Hijo) - +57 320 987 6543",
  },
  {
    id: 2,
    name: "Carlos Alberto Vásquez",
    age: 34,
    gender: "Masculino",
    admissionTime: "2024-01-15T10:15:00",
    symptoms: "Fractura abierta en tibia derecha, dolor severo",
    diagnosis: "Fractura expuesta de tibia y peroné",
    urgencyLevel: "URGENTE",
    doctor: "Dra. Ana Martínez",
    room: "TRAUMA-205",
    process: "traumatologia",
    vitals: {
      heartRate: "95",
      bloodPressure: "140/85",
      temperature: "37.2",
      oxygenSaturation: "96",
      respiratoryRate: "22",
    },
    lastUpdate: "Hace 15 minutos",
    status: "Pre-quirúrgico",
    medications: ["Morfina 10mg", "Clindamicina 600mg"],
    allergies: ["Ninguna conocida"],
    bloodType: "A+",
    weight: "85kg",
    height: "1.78m",
    contactPhone: "+57 312 456 7890",
    emergencyContact: "Laura Vásquez (Esposa) - +57 315 678 9012",
  },
  {
    id: 3,
    name: "Ana Sofía Herrera",
    age: 28,
    gender: "Femenino",
    admissionTime: "2024-01-15T14:20:00",
    symptoms: "Dolor abdominal intenso, náuseas, vómito",
    diagnosis: "Apendicitis aguda",
    urgencyLevel: "ALTO",
    doctor: "Dr. Luis González",
    room: "CIR-308",
    process: "cirugia",
    vitals: {
      heartRate: "88",
      bloodPressure: "125/80",
      temperature: "38.8",
      oxygenSaturation: "98",
      respiratoryRate: "20",
    },
    lastUpdate: "Hace 5 minutos",
    status: "Preparación quirúrgica",
    medications: ["Metamizol 500mg", "Omeprazol 40mg"],
    allergies: ["Sulfonamidas"],
    bloodType: "B+",
    weight: "58kg",
    height: "1.62m",
    contactPhone: "+57 304 123 4567",
    emergencyContact: "Miguel Herrera (Padre) - +57 318 234 5678",
  },
  {
    id: 4,
    name: "Roberto Jiménez",
    age: 52,
    gender: "Masculino",
    admissionTime: "2024-01-15T16:45:00",
    symptoms: "Mareos, visión borrosa, dolor de cabeza intenso",
    diagnosis: "Crisis hipertensiva",
    urgencyLevel: "MODERADO",
    doctor: "Dra. Patricia Silva",
    room: "MED-412",
    process: "medicina_interna",
    vitals: {
      heartRate: "78",
      bloodPressure: "190/110",
      temperature: "36.8",
      oxygenSaturation: "97",
      respiratoryRate: "18",
    },
    lastUpdate: "Hace 8 minutos",
    status: "Estabilización",
    medications: ["Amlodipino 10mg", "Losartán 100mg"],
    allergies: ["AINES"],
    bloodType: "AB+",
    weight: "78kg",
    height: "1.70m",
    contactPhone: "+57 311 987 6543",
    emergencyContact: "Carmen Jiménez (Esposa) - +57 317 456 7890",
  },
  {
    id: 5,
    name: "Isabella Castro",
    age: 15,
    gender: "Femenino",
    admissionTime: "2024-01-15T18:30:00",
    symptoms: "Fiebre alta, dolor de garganta, dificultad para tragar",
    diagnosis: "Faringitis estreptocócica",
    urgencyLevel: "BAJO",
    doctor: "Dr. Fernando López",
    room: "PED-201",
    process: "pediatria",
    vitals: {
      heartRate: "92",
      bloodPressure: "110/70",
      temperature: "39.1",
      oxygenSaturation: "99",
      respiratoryRate: "16",
    },
    lastUpdate: "Hace 12 minutos",
    status: "Tratamiento ambulatorio",
    medications: ["Amoxicilina 500mg", "Paracetamol 500mg"],
    allergies: ["Ninguna conocida"],
    bloodType: "O-",
    weight: "52kg",
    height: "1.58m",
    contactPhone: "+57 302 345 6789",
    emergencyContact: "María Castro (Madre) - +57 319 678 9012",
  },
];

export default function HUVDashboardAdvanced() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(mockPatientsAdvanced);
  const [filteredPatients, setFilteredPatients] =
    useState(mockPatientsAdvanced);
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [processFilter, setProcessFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filtros
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (urgencyFilter !== "all") {
      filtered = filtered.filter(
        (patient) => patient.urgencyLevel === urgencyFilter,
      );
    }

    if (processFilter !== "all") {
      filtered = filtered.filter(
        (patient) => patient.process === processFilter,
      );
    }

    setFilteredPatients(filtered);
  }, [searchTerm, urgencyFilter, processFilter, patients]);

  // Estadísticas
  const stats = {
    total: patients.length,
    criticos: patients.filter((p) => p.urgencyLevel === "CRITICO").length,
    urgentes: patients.filter((p) => p.urgencyLevel === "URGENTE").length,
    nuevosHoy: patients.filter((p) => {
      const today = new Date().toDateString();
      const admissionDate = new Date(p.admissionTime).toDateString();
      return today === admissionDate;
    }).length,
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "CRITICO":
        return "bg-red-500 text-white";
      case "URGENTE":
        return "bg-orange-500 text-white";
      case "ALTO":
        return "bg-yellow-500 text-black";
      case "MODERADO":
        return "bg-blue-500 text-white";
      case "BAJO":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getVitalStatus = (vitals: any) => {
    const hr = parseInt(vitals.heartRate);
    const temp = parseFloat(vitals.temperature);
    const oxygen = parseInt(vitals.oxygenSaturation);

    if (hr > 100 || temp > 38 || oxygen < 95) return "Alerta";
    if (hr > 90 || temp > 37.5 || oxygen < 98) return "Vigilancia";
    return "Normal";
  };

  const criticalAlerts = patients.filter(
    (p) =>
      p.urgencyLevel === "CRITICO" || getVitalStatus(p.vitals) === "Alerta",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
                Dashboard Médico HUV
              </h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString("es-CO")} -{" "}
                {currentTime.toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/medical-tools")}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Herramientas
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 relative"
            >
              <Bell className="w-4 h-4" />
              Alertas
              {criticalAlerts.length > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1 min-w-[20px] h-5 text-xs bg-red-500">
                  {criticalAlerts.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Alertas Críticas */}
        {criticalAlerts.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>
                {criticalAlerts.length} paciente(s) requieren atención
                inmediata:
              </strong>
              {criticalAlerts.slice(0, 2).map((p) => (
                <span key={p.id} className="ml-2">
                  {p.name} ({p.room})
                </span>
              ))}
              {criticalAlerts.length > 2 && (
                <span className="ml-2">
                  y {criticalAlerts.length - 2} más...
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Pacientes
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {stats.total}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estado Crítico
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.criticos}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Urgentes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.urgentes}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nuevos Hoy</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.nuevosHoy}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar Paciente</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nombre, síntomas, diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nivel de Urgencia</label>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los niveles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los niveles</SelectItem>
                    <SelectItem value="CRITICO">Crítico</SelectItem>
                    <SelectItem value="URGENTE">Urgente</SelectItem>
                    <SelectItem value="ALTO">Alto</SelectItem>
                    <SelectItem value="MODERADO">Moderado</SelectItem>
                    <SelectItem value="BAJO">Bajo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Proceso Médico</label>
                <Select value={processFilter} onValueChange={setProcessFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los procesos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los procesos</SelectItem>
                    <SelectItem value="cardiologia">Cardiología</SelectItem>
                    <SelectItem value="traumatologia">Traumatología</SelectItem>
                    <SelectItem value="cirugia">Cirugía</SelectItem>
                    <SelectItem value="medicina_interna">
                      Medicina Interna
                    </SelectItem>
                    <SelectItem value="pediatria">Pediatría</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Pacientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Pacientes Activos ({filteredPatients.length})
              </span>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Paciente</th>
                    <th className="text-left p-3 font-medium">
                      Información Clínica
                    </th>
                    <th className="text-left p-3 font-medium">
                      Signos Vitales
                    </th>
                    <th className="text-left p-3 font-medium">Estado</th>
                    <th className="text-left p-3 font-medium">
                      Médico/Ubicación
                    </th>
                    <th className="text-left p-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {patient.age} años • {patient.gender}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {patient.bloodType} • {patient.weight}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 max-w-xs">
                          <div className="text-sm font-medium text-red-700">
                            {patient.symptoms}
                          </div>
                          <div className="text-sm">
                            <strong>Dx:</strong> {patient.diagnosis}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Ingreso:{" "}
                            {new Date(patient.admissionTime).toLocaleDateString(
                              "es-CO",
                            )}{" "}
                            {new Date(patient.admissionTime).toLocaleTimeString(
                              "es-CO",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            <span>FC: {patient.vitals.heartRate} lpm</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-blue-500" />
                            <span>PA: {patient.vitals.bloodPressure}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-orange-500" />
                            <span>T°: {patient.vitals.temperature}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-blue-600">
                              O2: {patient.vitals.oxygenSaturation}%
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              getVitalStatus(patient.vitals) === "Alerta"
                                ? "border-red-500 text-red-700"
                                : getVitalStatus(patient.vitals) ===
                                    "Vigilancia"
                                  ? "border-yellow-500 text-yellow-700"
                                  : "border-green-500 text-green-700"
                            }`}
                          >
                            {getVitalStatus(patient.vitals)}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-2">
                          <Badge
                            className={`${getUrgencyColor(patient.urgencyLevel)} text-xs`}
                          >
                            {patient.urgencyLevel}
                          </Badge>
                          <div className="text-sm">{patient.status}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            {patient.lastUpdate}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{patient.doctor}</div>
                          <div className="text-muted-foreground">
                            {patient.room}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {patient.process.replace("_", " ")}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/patient/${patient.id}`)}
                            className="text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver Detalle
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Contactar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Herramientas Rápidas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Herramientas Médicas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calculator className="w-6 h-6" />
                <span className="text-sm">Calc. IMC</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Heart className="w-6 h-6" />
                <span className="text-sm">Monitor Vital</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Activity className="w-6 h-6" />
                <span className="text-sm">Dosificación</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span className="text-sm">Protocolos</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
