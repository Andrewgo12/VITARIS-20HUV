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
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  TestTube,
  Camera,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Filter,
  FileText,
  Download,
  Eye,
  Zap,
  AlertTriangle,
  Calendar,
  MapPin,
  Activity,
  Microscope,
  Scan,
  Heart,
  Brain,
  Bone,
  Stethoscope,
} from "lucide-react";

// Mock data para laboratorios
const mockLabResults = [
  {
    id: "LAB-2024-001",
    patient: {
      id: "P001",
      name: "María Elena Rodríguez",
      age: 67,
      document: "CC 12345678",
      room: "UCI-101",
    },
    order: {
      date: "2024-01-15",
      time: "06:00",
      doctor: "Dr. Carlos Mendoza",
      priority: "URGENTE",
      tests: [
        {
          name: "Troponina I",
          category: "Cardiología",
          result: "15.2",
          unit: "ng/mL",
          reference: "<0.04",
          status: "ANORMAL",
          critical: true,
        },
        {
          name: "CK-MB",
          category: "Cardiología",
          result: "45",
          unit: "ng/mL",
          reference: "0-6.3",
          status: "ELEVADO",
          critical: true,
        },
        {
          name: "Hemoglobina",
          category: "Hematología",
          result: "12.8",
          unit: "g/dL",
          reference: "12.0-15.5",
          status: "NORMAL",
          critical: false,
        },
        {
          name: "Creatinina",
          category: "Química",
          result: "1.1",
          unit: "mg/dL",
          reference: "0.6-1.2",
          status: "NORMAL",
          critical: false,
        },
        {
          name: "Glucosa",
          category: "Química",
          result: "180",
          unit: "mg/dL",
          reference: "70-100",
          status: "ELEVADO",
          critical: false,
        },
      ],
      status: "COMPLETADO",
      collectionTime: "06:15",
      resultTime: "08:45",
      technician: "Téc. Ana López",
    },
    interpretation: {
      summary:
        "Marcadores cardiacos elevados compatibles con infarto agudo de miocardio",
      recommendations:
        "Manejo inmediato de síndrome coronario agudo, seguimiento seriado cada 6 horas",
      alertLevel: "CRITICO",
    },
  },
  {
    id: "LAB-2024-002",
    patient: {
      id: "P002",
      name: "Carlos Alberto Vásquez",
      age: 34,
      document: "CC 23456789",
      room: "TRAUMA-205",
    },
    order: {
      date: "2024-01-15",
      time: "09:30",
      doctor: "Dra. Ana Martínez",
      priority: "RUTINA",
      tests: [
        {
          name: "Hemograma completo",
          category: "Hematología",
          result: "Normal",
          unit: "-",
          reference: "Valores normales",
          status: "NORMAL",
          critical: false,
        },
        {
          name: "Coagulación (PT/PTT)",
          category: "Hematología",
          result: "12.5/28.0",
          unit: "seg",
          reference: "11-13/25-35",
          status: "NORMAL",
          critical: false,
        },
        {
          name: "Química sanguínea",
          category: "Química",
          result: "Normal",
          unit: "-",
          reference: "Valores normales",
          status: "NORMAL",
          critical: false,
        },
      ],
      status: "COMPLETADO",
      collectionTime: "09:45",
      resultTime: "11:30",
      technician: "Téc. Roberto Díaz",
    },
    interpretation: {
      summary: "Laboratorios pre-operatorios dentro de límites normales",
      recommendations: "Paciente apto para procedimiento quirúrgico",
      alertLevel: "NORMAL",
    },
  },
];

// Mock data para imágenes
const mockImagingResults = [
  {
    id: "IMG-2024-001",
    patient: {
      id: "P001",
      name: "María Elena Rodríguez",
      age: 67,
      document: "CC 12345678",
      room: "UCI-101",
    },
    study: {
      type: "ECG",
      category: "Cardiología",
      date: "2024-01-15",
      time: "08:30",
      priority: "URGENTE",
      doctor: "Dr. Carlos Mendoza",
      technician: "Téc. Cardiovascular María García",
      equipment: "ECG-12 derivaciones",
      status: "COMPLETADO",
    },
    findings: {
      impression:
        "STEMI anterior extenso con elevación del segmento ST en V2-V5",
      description:
        "Electrocardiograma que muestra cambios agudos compatibles con infarto del miocardio anterior extenso",
      recommendations:
        "Tratamiento de reperfusión urgente, considerar angioplastia primaria",
      severity: "CRITICO",
    },
    images: [
      { id: "1", name: "ECG_12_derivaciones.pdf", type: "PDF", size: "2.1 MB" },
      { id: "2", name: "ECG_ritmo_largo.pdf", type: "PDF", size: "1.8 MB" },
    ],
  },
  {
    id: "IMG-2024-002",
    patient: {
      id: "P002",
      name: "Carlos Alberto Vásquez",
      age: 34,
      document: "CC 23456789",
      room: "TRAUMA-205",
    },
    study: {
      type: "Rayos X",
      category: "Radiología",
      date: "2024-01-15",
      time: "10:00",
      priority: "URGENTE",
      doctor: "Dra. Ana Martínez",
      technician: "Téc. Radiología Juan Pérez",
      equipment: "Siemens Ysio Max",
      status: "COMPLETADO",
    },
    findings: {
      impression:
        "Fractura expuesta de tercio medio de tibia y peroné derechos",
      description:
        "Fractura conminuta de tibia con fragmentos óseos múltiples. Fractura asociada de peroné. Tejidos blandos aumentados de volumen",
      recommendations: "Reducción abierta con fijación interna urgente",
      severity: "ALTO",
    },
    images: [
      { id: "3", name: "RX_tibia_AP.dcm", type: "DICOM", size: "12.5 MB" },
      { id: "4", name: "RX_tibia_lateral.dcm", type: "DICOM", size: "11.8 MB" },
    ],
  },
  {
    id: "IMG-2024-003",
    patient: {
      id: "P003",
      name: "Ana Sofía Herrera",
      age: 28,
      document: "CC 34567890",
      room: "CIR-308",
    },
    study: {
      type: "TAC Abdomen",
      category: "Tomografía",
      date: "2024-01-14",
      time: "22:45",
      priority: "URGENTE",
      doctor: "Dr. Luis González",
      technician: "Téc. TAC Claudia Morales",
      equipment: "Philips Brilliance CT",
      status: "COMPLETADO",
    },
    findings: {
      impression: "Apendicitis aguda con signos de perforación",
      description:
        "Apéndice engrosado con realce periférico, líquido libre en pelvis, cambios inflamatorios en grasa pericecal",
      recommendations:
        "Apendicectomía urgente, considerar abordaje abierto por signos de perforación",
      severity: "ALTO",
    },
    images: [
      {
        id: "5",
        name: "TAC_abdomen_axial.dcm",
        type: "DICOM",
        size: "45.2 MB",
      },
      {
        id: "6",
        name: "TAC_abdomen_coronal.dcm",
        type: "DICOM",
        size: "42.1 MB",
      },
      {
        id: "7",
        name: "TAC_abdomen_sagital.dcm",
        type: "DICOM",
        size: "38.9 MB",
      },
    ],
  },
];

// Equipos disponibles
const mockEquipment = [
  {
    id: "LAB-001",
    name: "Analizador Hematología",
    type: "Laboratorio",
    status: "OPERATIVO",
    location: "Lab Central",
    queue: 5,
  },
  {
    id: "LAB-002",
    name: "Analizador Química",
    type: "Laboratorio",
    status: "OPERATIVO",
    location: "Lab Central",
    queue: 8,
  },
  {
    id: "LAB-003",
    name: "Analizador Gasometría",
    type: "Laboratorio",
    status: "MANTENIMIENTO",
    location: "UCI",
    queue: 0,
  },
  {
    id: "IMG-001",
    name: "Rayos X Portátil",
    type: "Radiología",
    status: "OPERATIVO",
    location: "UCI",
    queue: 2,
  },
  {
    id: "IMG-002",
    name: "TAC Philips",
    type: "Tomografía",
    status: "OPERATIVO",
    location: "Radiología",
    queue: 4,
  },
  {
    id: "IMG-003",
    name: "Resonancia 1.5T",
    type: "RM",
    status: "OPERATIVO",
    location: "Radiología",
    queue: 12,
  },
  {
    id: "IMG-004",
    name: "Ecógrafo",
    type: "Ultrasonido",
    status: "OPERATIVO",
    location: "Consultorio 3",
    queue: 3,
  },
];

export default function LabsImaging() {
  const navigate = useNavigate();
  const [labResults, setLabResults] = useState(mockLabResults);
  const [imagingResults, setImagingResults] = useState(mockImagingResults);
  const [equipment, setEquipment] = useState(mockEquipment);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-500 text-black";
      case "EN_PROCESO":
        return "bg-blue-500 text-white";
      case "COMPLETADO":
        return "bg-green-500 text-white";
      case "CANCELADO":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENTE":
        return "text-red-600";
      case "ALTO":
        return "text-orange-600";
      case "RUTINA":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case "ANORMAL":
        return "bg-red-100 text-red-800";
      case "ELEVADO":
        return "bg-orange-100 text-orange-800";
      case "BAJO":
        return "bg-yellow-100 text-yellow-800";
      case "NORMAL":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "CRITICO":
        return "bg-red-500 text-white";
      case "ALTO":
        return "bg-orange-500 text-white";
      case "MODERADO":
        return "bg-yellow-500 text-black";
      case "NORMAL":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const labStats = {
    totalLabs: labResults.length,
    completedLabs: labResults.filter((l) => l.order.status === "COMPLETADO")
      .length,
    criticalResults: labResults.filter(
      (l) => l.interpretation.alertLevel === "CRITICO",
    ).length,
    pendingLabs: labResults.filter((l) => l.order.status === "PENDIENTE")
      .length,
  };

  const imagingStats = {
    totalImaging: imagingResults.length,
    completedImaging: imagingResults.filter(
      (i) => i.study.status === "COMPLETADO",
    ).length,
    criticalFindings: imagingResults.filter(
      (i) => i.findings.severity === "CRITICO",
    ).length,
    pendingImaging: imagingResults.filter((i) => i.study.status === "PENDIENTE")
      .length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Laboratorios e Imágenes
              </h1>
              <p className="text-muted-foreground">
                Sistema integral de diagnósticos -{" "}
                {currentTime.toLocaleDateString("es-CO")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4" />
              Nueva Orden
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Programación
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {labStats.totalLabs + imagingStats.totalImaging}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Estudios
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {labStats.completedLabs + imagingStats.completedImaging}
              </div>
              <div className="text-sm text-muted-foreground">Completados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {labStats.criticalResults + imagingStats.criticalFindings}
              </div>
              <div className="text-sm text-muted-foreground">
                Hallazgos Críticos
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {labStats.pendingLabs + imagingStats.pendingImaging}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="labs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="labs" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Laboratorios
            </TabsTrigger>
            <TabsTrigger value="imaging" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Imágenes
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Equipos
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reportes
            </TabsTrigger>
          </TabsList>

          {/* Laboratorios */}
          <TabsContent value="labs" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros de Laboratorio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Paciente, prueba, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridad</Label>
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las prioridades
                        </SelectItem>
                        <SelectItem value="URGENTE">Urgente</SelectItem>
                        <SelectItem value="ALTO">Alto</SelectItem>
                        <SelectItem value="RUTINA">Rutina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="EN_PROCESO">En proceso</SelectItem>
                        <SelectItem value="COMPLETADO">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultados de Laboratorio */}
            <div className="space-y-4">
              {labResults.map((lab) => (
                <Card
                  key={lab.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Información del Paciente */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">
                            {lab.patient.name}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Documento:</strong> {lab.patient.document}
                          </div>
                          <div>
                            <strong>Edad:</strong> {lab.patient.age} años
                          </div>
                          <div>
                            <strong>Ubicación:</strong> {lab.patient.room}
                          </div>
                          <div>
                            <strong>ID Orden:</strong> {lab.id}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(lab.order.status)}>
                            {lab.order.status}
                          </Badge>
                          <span
                            className={`text-sm font-medium ${getPriorityColor(lab.order.priority)}`}
                          >
                            {lab.order.priority}
                          </span>
                        </div>
                      </div>

                      {/* Información de la Orden */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <TestTube className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">
                            Orden de Laboratorio
                          </h4>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Fecha:</strong> {lab.order.date}
                          </div>
                          <div>
                            <strong>Hora orden:</strong> {lab.order.time}
                          </div>
                          <div>
                            <strong>Médico:</strong> {lab.order.doctor}
                          </div>
                          <div>
                            <strong>Toma muestra:</strong>{" "}
                            {lab.order.collectionTime}
                          </div>
                          <div>
                            <strong>Resultado:</strong> {lab.order.resultTime}
                          </div>
                          <div>
                            <strong>Técnico:</strong> {lab.order.technician}
                          </div>
                        </div>
                      </div>

                      {/* Resultados */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Microscope className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Resultados</h4>
                        </div>
                        <div className="space-y-2">
                          {lab.order.tests.map((test, index) => (
                            <div
                              key={index}
                              className="text-sm border rounded p-2"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{test.name}</span>
                                <Badge
                                  className={getResultStatusColor(test.status)}
                                >
                                  {test.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>
                                  {test.result} {test.unit}
                                </span>
                                <span className="text-muted-foreground">
                                  Ref: {test.reference}
                                </span>
                              </div>
                              {test.critical && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                  <span className="text-xs text-red-600">
                                    Valor crítico
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interpretación */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold">Interpretación</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="text-center">
                            <Badge
                              className={getAlertLevelColor(
                                lab.interpretation.alertLevel,
                              )}
                            >
                              {lab.interpretation.alertLevel}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <strong>Resumen:</strong>
                            <p className="mt-1">{lab.interpretation.summary}</p>
                          </div>
                          <div className="text-sm">
                            <strong>Recomendaciones:</strong>
                            <p className="mt-1">
                              {lab.interpretation.recommendations}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Completo
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Imprimir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Imágenes Diagnósticas */}
          <TabsContent value="imaging" className="space-y-6">
            <div className="space-y-4">
              {imagingResults.map((imaging) => (
                <Card
                  key={imaging.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Información del Paciente */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">
                            {imaging.patient.name}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Documento:</strong>{" "}
                            {imaging.patient.document}
                          </div>
                          <div>
                            <strong>Edad:</strong> {imaging.patient.age} años
                          </div>
                          <div>
                            <strong>Ubicación:</strong> {imaging.patient.room}
                          </div>
                          <div>
                            <strong>ID Estudio:</strong> {imaging.id}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getStatusColor(imaging.study.status)}
                          >
                            {imaging.study.status}
                          </Badge>
                          <span
                            className={`text-sm font-medium ${getPriorityColor(imaging.study.priority)}`}
                          >
                            {imaging.study.priority}
                          </span>
                        </div>
                      </div>

                      {/* Información del Estudio */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Camera className="w-5 h-5 text-teal-600" />
                          <h4 className="font-semibold">Estudio</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Tipo:</strong> {imaging.study.type}
                          </div>
                          <div>
                            <strong>Categoría:</strong> {imaging.study.category}
                          </div>
                          <div>
                            <strong>Fecha:</strong> {imaging.study.date}
                          </div>
                          <div>
                            <strong>Hora:</strong> {imaging.study.time}
                          </div>
                          <div>
                            <strong>Médico:</strong> {imaging.study.doctor}
                          </div>
                          <div>
                            <strong>Técnico:</strong> {imaging.study.technician}
                          </div>
                          <div>
                            <strong>Equipo:</strong> {imaging.study.equipment}
                          </div>
                        </div>
                      </div>

                      {/* Hallazgos */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Scan className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Hallazgos</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="text-center">
                            <Badge
                              className={getAlertLevelColor(
                                imaging.findings.severity,
                              )}
                            >
                              {imaging.findings.severity}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <strong>Impresión diagnóstica:</strong>
                            <p className="mt-1 font-medium text-blue-700">
                              {imaging.findings.impression}
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Descripción:</strong>
                            <p className="mt-1">
                              {imaging.findings.description}
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Recomendaciones:</strong>
                            <p className="mt-1">
                              {imaging.findings.recommendations}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Imágenes y Acciones */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold">Archivos</h4>
                        </div>
                        <div className="space-y-2">
                          {imaging.images.map((image) => (
                            <div
                              key={image.id}
                              className="text-sm border rounded p-2"
                            >
                              <div className="font-medium truncate">
                                {image.name}
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{image.type}</span>
                                <span>{image.size}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Imágenes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar Todo
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Informe PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipos */}
          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Estado de Equipos Diagnósticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipment.map((eq) => (
                    <Card key={eq.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{eq.name}</h4>
                          <Badge
                            className={
                              eq.status === "OPERATIVO"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {eq.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm mb-4">
                          <div>
                            <strong>Tipo:</strong> {eq.type}
                          </div>
                          <div>
                            <strong>Ubicación:</strong> {eq.location}
                          </div>
                          <div>
                            <strong>Cola de espera:</strong> {eq.queue} estudios
                          </div>
                        </div>

                        {eq.queue > 0 && (
                          <div className="mb-3">
                            <div className="text-sm mb-1">
                              Carga de trabajo:
                            </div>
                            <Progress
                              value={(eq.queue / 15) * 100}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          {eq.status === "OPERATIVO" && (
                            <Button size="sm" className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              Programar Estudio
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            Ver Cola
                          </Button>

                          {eq.status === "MANTENIMIENTO" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activar Equipo
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

          {/* Reportes */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Reportes y Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Funcionalidad en desarrollo:</strong> Sistema de
                    reportes estadísticos, análisis de tendencias, indicadores
                    de calidad y tiempos de respuesta.
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
