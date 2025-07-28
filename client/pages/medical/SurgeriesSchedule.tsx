import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Scissors,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  Filter,
  FileText,
  Users,
  Activity,
  Timer,
  Stethoscope,
  Building,
  Phone,
  Mail,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RefreshCw
} from "lucide-react";

// Mock data para cirugías
const mockSurgeries = [
  {
    id: "CIR-2024-001",
    patient: {
      id: "P002",
      name: "Carlos Alberto Vásquez",
      age: 34,
      gender: "Masculino",
      document: "CC 23456789",
      bloodType: "A+",
      weight: "85kg",
      allergies: ["Ninguna conocida"]
    },
    surgery: {
      type: "Reducción abierta y fijación interna",
      procedure: "RAFI tibia y peroné",
      diagnosis: "Fractura expuesta de tibia y peroné derecha",
      urgency: "PROGRAMADA",
      complexity: "MEDIA",
      estimatedDuration: "2.5 horas",
      anesthesiaType: "General + bloqueo regional"
    },
    schedule: {
      date: "2024-01-16",
      time: "08:00",
      endTime: "10:30",
      room: "Quirófano 3",
      status: "PROGRAMADA",
      preOpTime: "07:00",
      postOpRoom: "Recuperación A"
    },
    team: {
      surgeon: "Dra. Ana Martínez",
      assistant: "Dr. Pedro Ruiz",
      anesthesiologist: "Dr. Miguel Sánchez",
      nurse: "Enf. Carmen López",
      technician: "Téc. Luis Rivera"
    },
    preOp: {
      labs: ["Hemograma", "Química sanguínea", "Coagulación"],
      imaging: ["RX tórax", "RX extremidad"],
      consent: true,
      fasting: true,
      vitals: {
        bp: "140/85",
        hr: "95",
        temp: "37.2",
        spo2: "96"
      },
      cleared: true
    },
    progress: {
      stage: "PROGRAMADA",
      percentage: 0,
      startTime: null,
      currentStep: "Pre-operatorio",
      complications: [],
      notes: []
    },
    postOp: {
      recovery: null,
      pain: null,
      complications: null,
      discharge: null
    }
  },
  {
    id: "CIR-2024-002",
    patient: {
      id: "P003",
      name: "Ana Sofía Herrera",
      age: 28,
      gender: "Femenino",
      document: "CC 34567890",
      bloodType: "B+",
      weight: "58kg",
      allergies: ["Sulfonamidas"]
    },
    surgery: {
      type: "Apendicectomía laparoscópica",
      procedure: "Apendicectomía vía laparoscópica",
      diagnosis: "Apendicitis aguda",
      urgency: "URGENTE",
      complexity: "BAJA",
      estimatedDuration: "1 hora",
      anesthesiaType: "General"
    },
    schedule: {
      date: "2024-01-15",
      time: "23:30",
      endTime: "00:30",
      room: "Quirófano 1",
      status: "COMPLETADA",
      preOpTime: "23:00",
      postOpRoom: "Recuperación B"
    },
    team: {
      surgeon: "Dr. Luis González",
      assistant: "Dra. María Fernández",
      anesthesiologist: "Dr. Carlos Vega",
      nurse: "Enf. Ana García",
      technician: "Téc. Roberto Díaz"
    },
    preOp: {
      labs: ["Hemograma", "Química sanguínea"],
      imaging: ["TAC abdomen"],
      consent: true,
      fasting: true,
      vitals: {
        bp: "125/80",
        hr: "88",
        temp: "38.8",
        spo2: "98"
      },
      cleared: true
    },
    progress: {
      stage: "COMPLETADA",
      percentage: 100,
      startTime: "23:35",
      endTime: "00:25",
      currentStep: "Post-operatorio",
      complications: [],
      notes: ["Procedimiento sin complicaciones", "Excelente visualización laparoscópica"]
    },
    postOp: {
      recovery: "Excelente",
      pain: "2/10",
      complications: "Ninguna",
      discharge: "Programado para mañana"
    }
  },
  {
    id: "CIR-2024-003",
    patient: {
      id: "P004",
      name: "Roberto Jiménez",
      age: 52,
      gender: "Masculino",
      document: "CC 45678901",
      bloodType: "AB+",
      weight: "78kg",
      allergies: ["AINES"]
    },
    surgery: {
      type: "Colecistectomía laparoscópica",
      procedure: "Colecistectomía vía laparoscópica",
      diagnosis: "Colelitiasis sintomática",
      urgency: "ELECTIVA",
      complexity: "MEDIA",
      estimatedDuration: "1.5 horas",
      anesthesiaType: "General"
    },
    schedule: {
      date: "2024-01-16",
      time: "14:00",
      endTime: "15:30",
      room: "Quirófano 2",
      status: "EN_CURSO",
      preOpTime: "13:00",
      postOpRoom: "Recuperación A"
    },
    team: {
      surgeon: "Dr. Fernando López",
      assistant: "Dra. Claudia Morales",
      anesthesiologist: "Dr. Andrés Herrera",
      nurse: "Enf. Patricia Silva",
      technician: "Téc. Jorge Martín"
    },
    preOp: {
      labs: ["Hemograma", "Química sanguínea", "Coagulación", "Función hepática"],
      imaging: ["Ecografía hepatobiliar", "RX tórax"],
      consent: true,
      fasting: true,
      vitals: {
        bp: "130/80",
        hr: "75",
        temp: "36.8",
        spo2: "97"
      },
      cleared: true
    },
    progress: {
      stage: "EN_CURSO",
      percentage: 65,
      startTime: "14:05",
      currentStep: "Disección del triángulo de Calot",
      complications: [],
      notes: ["Adhesiones leves", "Vesícula muy inflamada", "Disección cuidadosa"]
    },
    postOp: {
      recovery: null,
      pain: null,
      complications: null,
      discharge: null
    }
  }
];

// Quirófanos disponibles
const mockOperatingRooms = [
  { id: "Quirófano 1", status: "DISPONIBLE", type: "General", equipment: ["Laparoscopio", "Monitor"], capacity: 6 },
  { id: "Quirófano 2", status: "EN_USO", type: "General", equipment: ["Laparoscopio", "Monitor"], capacity: 6 },
  { id: "Quirófano 3", status: "MANTENIMIENTO", type: "Ortopedia", equipment: ["C-arm", "Mesa ortopédica"], capacity: 8 },
  { id: "Quirófano 4", status: "DISPONIBLE", type: "Cardiovascular", equipment: ["Bypass", "Monitor avanzado"], capacity: 10 },
  { id: "Quirófano 5", status: "LIMPIEZA", type: "Neurocirugía", equipment: ["Microscopio", "Neuronavegador"], capacity: 8 }
];

export default function SurgeriesSchedule() {
  const navigate = useNavigate();
  const [surgeries, setSurgeries] = useState(mockSurgeries);
  const [operatingRooms, setOperatingRooms] = useState(mockOperatingRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSurgery, setSelectedSurgery] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const filteredSurgeries = surgeries.filter(surgery => {
    const matchesSearch = surgery.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surgery.surgery.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surgery.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || surgery.schedule.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === "today") {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = surgery.schedule.date === today;
    } else if (dateFilter === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = surgery.schedule.date === tomorrow.toISOString().split('T')[0];
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROGRAMADA": return "bg-blue-500 text-white";
      case "EN_CURSO": return "bg-orange-500 text-white";
      case "COMPLETADA": return "bg-green-500 text-white";
      case "CANCELADA": return "bg-red-500 text-white";
      case "POSPUESTA": return "bg-yellow-500 text-black";
      default: return "bg-gray-500 text-white";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "URGENTE": return "text-red-600";
      case "PROGRAMADA": return "text-blue-600";
      case "ELECTIVA": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "BAJA": return "bg-green-100 text-green-800";
      case "MEDIA": return "bg-yellow-100 text-yellow-800";
      case "ALTA": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIBLE": return "bg-green-100 text-green-800";
      case "EN_USO": return "bg-red-100 text-red-800";
      case "MANTENIMIENTO": return "bg-yellow-100 text-yellow-800";
      case "LIMPIEZA": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: surgeries.length,
    programadas: surgeries.filter(s => s.schedule.status === "PROGRAMADA").length,
    enCurso: surgeries.filter(s => s.schedule.status === "EN_CURSO").length,
    completadas: surgeries.filter(s => s.schedule.status === "COMPLETADA").length,
    quirofanosDisponibles: operatingRooms.filter(r => r.status === "DISPONIBLE").length,
    quirofanosEnUso: operatingRooms.filter(r => r.status === "EN_USO").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Programación de Cirugías
              </h1>
              <p className="text-muted-foreground">
                Gestión completa de cirugías - {currentTime.toLocaleDateString("es-CO")} {currentTime.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Nueva Cirugía
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Programación
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Cirugías</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.programadas}</div>
              <div className="text-sm text-muted-foreground">Programadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.enCurso}</div>
              <div className="text-sm text-muted-foreground">En Curso</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completadas}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.quirofanosDisponibles}</div>
              <div className="text-sm text-muted-foreground">Quirófanos Libres</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.quirofanosEnUso}</div>
              <div className="text-sm text-muted-foreground">Quirófanos en Uso</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Programación
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              En Vivo
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Quirófanos
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Equipo Médico
            </TabsTrigger>
          </TabsList>

          {/* Programación */}
          <TabsContent value="schedule" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros de Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Buscar Cirugía</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Paciente, procedimiento, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="PROGRAMADA">Programada</SelectItem>
                        <SelectItem value="EN_CURSO">En curso</SelectItem>
                        <SelectItem value="COMPLETADA">Completada</SelectItem>
                        <SelectItem value="CANCELADA">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las fechas</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="tomorrow">Mañana</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Cirugías */}
            <div className="space-y-4">
              {filteredSurgeries.map((surgery) => (
                <Card key={surgery.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {/* Información del Paciente */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">{surgery.patient.name}</h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div><strong>Edad:</strong> {surgery.patient.age} años</div>
                          <div><strong>Documento:</strong> {surgery.patient.document}</div>
                          <div><strong>Tipo sangre:</strong> {surgery.patient.bloodType}</div>
                          <div><strong>Peso:</strong> {surgery.patient.weight}</div>
                          <div className="text-xs text-red-600">
                            <strong>Alergias:</strong> {surgery.patient.allergies.join(", ")}
                          </div>
                        </div>
                      </div>

                      {/* Información de la Cirugía */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Cirugía</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div><strong>ID:</strong> {surgery.id}</div>
                          <div><strong>Procedimiento:</strong> {surgery.surgery.procedure}</div>
                          <div><strong>Diagnóstico:</strong> {surgery.surgery.diagnosis}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`font-medium ${getUrgencyColor(surgery.surgery.urgency)}`}>
                              {surgery.surgery.urgency}
                            </span>
                            <Badge className={getComplexityColor(surgery.surgery.complexity)}>
                              {surgery.surgery.complexity}
                            </Badge>
                          </div>
                          <div><strong>Duración:</strong> {surgery.surgery.estimatedDuration}</div>
                          <div><strong>Anestesia:</strong> {surgery.surgery.anesthesiaType}</div>
                        </div>
                      </div>

                      {/* Programación */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Programación</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(surgery.schedule.status)}>
                              {surgery.schedule.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div><strong>Fecha:</strong> {surgery.schedule.date}</div>
                          <div><strong>Hora:</strong> {surgery.schedule.time} - {surgery.schedule.endTime}</div>
                          <div><strong>Quirófano:</strong> {surgery.schedule.room}</div>
                          <div><strong>Pre-op:</strong> {surgery.schedule.preOpTime}</div>
                          <div><strong>Recuperación:</strong> {surgery.schedule.postOpRoom}</div>
                        </div>
                      </div>

                      {/* Equipo Médico */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold">Equipo</h4>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div><strong>Cirujano:</strong> {surgery.team.surgeon}</div>
                          <div><strong>Asistente:</strong> {surgery.team.assistant}</div>
                          <div><strong>Anestesiólogo:</strong> {surgery.team.anesthesiologist}</div>
                          <div><strong>Enfermería:</strong> {surgery.team.nurse}</div>
                          <div><strong>Técnico:</strong> {surgery.team.technician}</div>
                        </div>
                      </div>

                      {/* Progreso y Acciones */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-semibold">Estado</h4>
                        </div>
                        
                        {surgery.schedule.status === "EN_CURSO" && (
                          <div className="space-y-2">
                            <div className="text-sm">
                              <strong>Progreso:</strong> {surgery.progress.percentage}%
                            </div>
                            <Progress value={surgery.progress.percentage} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {surgery.progress.currentStep}
                            </div>
                            <div className="text-xs">
                              <strong>Inicio:</strong> {surgery.progress.startTime}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(`/patient/${surgery.patient.id}`)}
                          >
                            Ver Paciente
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedSurgery(surgery)}
                          >
                            Ver Detalles
                          </Button>
                          
                          {surgery.schedule.status === "PROGRAMADA" && (
                            <Button size="sm" variant="outline" className="w-full">
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Iniciar
                            </Button>
                          )}
                          
                          {surgery.schedule.status === "EN_CURSO" && (
                            <div className="grid grid-cols-2 gap-1">
                              <Button size="sm" variant="outline">
                                <PauseCircle className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <StopCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Pre-operatorio */}
                        <div className="mt-3 p-2 bg-slate-50 rounded text-xs">
                          <div className="font-semibold mb-1">Pre-operatorio:</div>
                          <div className="flex items-center gap-1">
                            {surgery.preOp.cleared ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                            )}
                            <span>{surgery.preOp.cleared ? "Autorizado" : "Pendiente"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Seguimiento en Vivo */}
          <TabsContent value="live" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Cirugías en Tiempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                {surgeries.filter(s => s.schedule.status === "EN_CURSO").map((surgery) => (
                  <Card key={surgery.id} className="mb-4 border-orange-200">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{surgery.patient.name}</h3>
                          <div className="text-sm space-y-1">
                            <div><strong>Procedimiento:</strong> {surgery.surgery.procedure}</div>
                            <div><strong>Quirófano:</strong> {surgery.schedule.room}</div>
                            <div><strong>Cirujano:</strong> {surgery.team.surgeon}</div>
                            <div><strong>Inicio:</strong> {surgery.progress.startTime}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Progreso de la Cirugía</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progreso:</span>
                              <span>{surgery.progress.percentage}%</span>
                            </div>
                            <Progress value={surgery.progress.percentage} className="h-3" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Etapa actual:</strong> {surgery.progress.currentStep}
                            </div>
                          </div>
                          
                          {surgery.progress.notes.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-semibold text-sm mb-1">Notas del procedimiento:</h5>
                              {surgery.progress.notes.map((note, index) => (
                                <div key={index} className="text-xs bg-blue-50 p-2 rounded mb-1">
                                  {note}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Controles</h4>
                          <div className="space-y-2">
                            <Button size="sm" className="w-full">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Actualizar Estado
                            </Button>
                            <Button size="sm" variant="outline" className="w-full">
                              <FileText className="w-4 h-4 mr-2" />
                              Agregar Nota
                            </Button>
                            <Button size="sm" variant="outline" className="w-full">
                              <Phone className="w-4 h-4 mr-2" />
                              Contactar Equipo
                            </Button>
                          </div>
                          
                          {surgery.progress.complications.length === 0 ? (
                            <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                              Sin complicaciones
                            </div>
                          ) : (
                            <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-800">
                              <AlertTriangle className="w-4 h-4 inline mr-1" />
                              Complicaciones reportadas
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {surgeries.filter(s => s.schedule.status === "EN_CURSO").length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No hay cirugías en curso en este momento.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quirófanos */}
          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Estado de Quirófanos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {operatingRooms.map((room) => (
                    <Card key={room.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{room.id}</h4>
                          <Badge className={getRoomStatusColor(room.status)}>
                            {room.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div><strong>Tipo:</strong> {room.type}</div>
                          <div><strong>Capacidad:</strong> {room.capacity} personas</div>
                          <div><strong>Equipamiento:</strong></div>
                          <ul className="list-disc list-inside text-xs ml-2">
                            {room.equipment.map((eq, index) => (
                              <li key={index}>{eq}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          {room.status === "DISPONIBLE" && (
                            <Button size="sm" className="w-full">
                              <Calendar className="w-4 h-4 mr-2" />
                              Programar Cirugía
                            </Button>
                          )}
                          
                          {room.status === "EN_USO" && (
                            <div className="space-y-1">
                              <Button size="sm" variant="outline" className="w-full">
                                <Activity className="w-4 h-4 mr-2" />
                                Ver Cirugía Activa
                              </Button>
                              <Button size="sm" variant="outline" className="w-full">
                                <Timer className="w-4 h-4 mr-2" />
                                Tiempo Estimado
                              </Button>
                            </div>
                          )}
                          
                          {room.status === "MANTENIMIENTO" && (
                            <Button size="sm" variant="outline" className="w-full">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Finalizar Mantenimiento
                            </Button>
                          )}
                          
                          {room.status === "LIMPIEZA" && (
                            <Button size="sm" variant="outline" className="w-full">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirmar Limpieza
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipo Médico */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Disponibilidad del Equipo Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Funcionalidad en desarrollo:</strong> Sistema de gestión de disponibilidad del equipo médico,
                    incluyendo cirujanos, anestesiólogos, enfermería y técnicos especializados.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
