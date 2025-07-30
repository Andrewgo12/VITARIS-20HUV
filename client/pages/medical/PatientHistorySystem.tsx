import { useState, useEffect } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  FileText,
  Calendar,
  Heart,
  Activity,
  Pill,
  TestTube,
  Stethoscope,
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Edit,
  Download,
  Upload,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Paperclip,
  Image,
  FileImage,
  FileVideo,
  Mic,
  Camera,
  Brain,
  Bone,
  Zap,
  Droplets,
  Target,
  TrendingUp,
  BarChart3,
  LineChart,
  Save,
  Lock,
  Unlock,
  History,
  Share,
  Printer,
  Star,
  Flag,
  MessageSquare,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  type: "consultation" | "emergency" | "surgery" | "lab" | "imaging" | "prescription";
  doctor: string;
  specialty: string;
  chiefComplaint: string;
  diagnosis: string[];
  treatment: string;
  medications: Medication[];
  status: "active" | "resolved" | "chronic";
  priority: "low" | "medium" | "high" | "critical";
  attachments: Attachment[];
  vitalSigns?: VitalSigns;
  notes: string;
  followUp?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedDate: string;
  status: "active" | "completed" | "discontinued";
}

interface VitalSigns {
  temperature: number;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
}

interface Attachment {
  id: string;
  name: string;
  type: "image" | "document" | "audio" | "video";
  url: string;
  uploadDate: string;
  size: string;
}

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
}

export default function PatientHistorySystem() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { patientId } = useParams();
  
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewRecord, setShowNewRecord] = useState(false);

  // Mock data
  useEffect(() => {
    const mockPatient: PatientData = {
      id: "12345",
      name: "Mar��a González Rodríguez",
      age: 45,
      gender: "Femenino",
      bloodType: "O+",
      allergies: ["Penicilina", "Frutos secos"],
      chronicConditions: ["Hipertensión", "Diabetes Tipo 2"],
      emergencyContact: {
        name: "Carlos González",
        phone: "300-123-4567",
        relationship: "Esposo"
      },
      insurance: {
        provider: "Nueva EPS",
        policyNumber: "NE-12345678",
        groupNumber: "GRP-001"
      }
    };

    const mockRecords: MedicalRecord[] = [
      {
        id: "rec-001",
        patientId: "12345",
        date: "2024-01-15",
        type: "consultation",
        doctor: "Dr. Ana López",
        specialty: "Medicina Interna",
        chiefComplaint: "Dolor torácico y dificultad respiratoria",
        diagnosis: ["Angina estable", "Hipertensión arterial"],
        treatment: "Manejo médico conservador, control de factores de riesgo",
        medications: [
          {
            name: "Atorvastatina",
            dosage: "40mg",
            frequency: "1 vez al día",
            duration: "Indefinido",
            instructions: "Tomar en la noche",
            prescribedDate: "2024-01-15",
            status: "active"
          },
          {
            name: "Metoprolol",
            dosage: "50mg",
            frequency: "2 veces al día",
            duration: "Indefinido",
            instructions: "Tomar con alimentos",
            prescribedDate: "2024-01-15",
            status: "active"
          }
        ],
        status: "active",
        priority: "high",
        attachments: [],
        vitalSigns: {
          temperature: 36.8,
          bloodPressure: { systolic: 145, diastolic: 90 },
          heartRate: 88,
          respiratoryRate: 18,
          oxygenSaturation: 98,
          weight: 68.5,
          height: 165,
          bmi: 25.2
        },
        notes: "Paciente refiere mejoría con el tratamiento actual. Continuar con seguimiento cardiológico.",
        followUp: "Control en 1 mes"
      },
      {
        id: "rec-002",
        patientId: "12345",
        date: "2024-01-10",
        type: "lab",
        doctor: "Dr. Ana López",
        specialty: "Medicina Interna",
        chiefComplaint: "Laboratorios de rutina",
        diagnosis: ["Control metabólico"],
        treatment: "Interpretación de resultados",
        medications: [],
        status: "resolved",
        priority: "medium",
        attachments: [
          {
            id: "att-001",
            name: "Laboratorios_completos.pdf",
            type: "document",
            url: "/files/lab-results.pdf",
            uploadDate: "2024-01-10",
            size: "1.2 MB"
          }
        ],
        notes: "Hemoglobina glucosilada en 7.2%, requiere ajuste de tratamiento diabético.",
        followUp: "Repetir laboratorios en 3 meses"
      }
    ];

    setSelectedPatient(mockPatient);
    setMedicalRecords(mockRecords);
    setFilteredRecords(mockRecords);
  }, []);

  useEffect(() => {
    let filtered = medicalRecords;
    
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== "ALL") {
      filtered = filtered.filter(record => record.type === selectedType);
    }
    
    setFilteredRecords(filtered);
  }, [searchTerm, selectedType, medicalRecords]);

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return Stethoscope;
      case "emergency":
        return AlertTriangle;
      case "surgery":
        return Activity;
      case "lab":
        return TestTube;
      case "imaging":
        return Camera;
      case "prescription":
        return Pill;
      default:
        return FileText;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200";
      case "surgery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "lab":
        return "bg-green-100 text-green-800 border-green-200";
      case "imaging":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "prescription":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-500";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-500";
      case "medium":
        return "bg-slate-100 text-slate-800 border-slate-500";
      case "low":
        return "bg-green-100 text-green-800 border-green-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-500";
    }
  };

  const getRecordTypeLabel = (type: string) => {
    const labels = {
      consultation: "Consulta",
      emergency: "Emergencia",
      surgery: "Cirugía",
      lab: "Laboratorio",
      imaging: "Imágenes",
      prescription: "Receta"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const RecordCard = ({ record }: { record: MedicalRecord }) => {
    const Icon = getRecordTypeIcon(record.type);
    
    return (
      <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedRecord(record)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                getRecordTypeColor(record.type)
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{record.chiefComplaint}</h3>
                  <Badge className={getPriorityColor(record.priority)}>
                    {record.priority}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Médico:</strong> {record.doctor} - {record.specialty}</p>
                  <p><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString()}</p>
                  <p><strong>Diagnóstico:</strong> {record.diagnosis.join(", ")}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getRecordTypeColor(record.type)}>
                {getRecordTypeLabel(record.type)}
              </Badge>
              {record.attachments.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Paperclip className="w-3 h-3" />
                  {record.attachments.length}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Ver Completo
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PatientSummaryCard = () => (
    <Card className="card-modern">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Información del Paciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                <p className="font-semibold">{selectedPatient.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Edad</Label>
                <p className="font-semibold">{selectedPatient.age} años</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Género</Label>
                <p className="font-semibold">{selectedPatient.gender}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tipo de Sangre</Label>
                <p className="font-semibold">{selectedPatient.bloodType}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Alergias</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedPatient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Condiciones Crónicas</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedPatient.chronicConditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-muted-foreground">Contacto de Emergencia</Label>
              <div className="mt-1 text-sm">
                <p><strong>{selectedPatient.emergencyContact.name}</strong></p>
                <p>{selectedPatient.emergencyContact.phone}</p>
                <p>{selectedPatient.emergencyContact.relationship}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <NavigationImproved 
            userName="Dr. Especialista"
            userRole="Médico Tratante"
            notifications={0}
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
              Dashboard Médico
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Historia Clínica Electrónica
              </h1>
              <p className="text-muted-foreground">
                {selectedPatient?.name || "Sistema de registros médicos"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar Historia
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button 
              className="gap-2"
              onClick={() => setShowNewRecord(true)}
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Patient Summary - Left Sidebar */}
          <div className="xl:col-span-1">
            <PatientSummaryCard />
          </div>

          {/* Main Content - Medical Records */}
          <div className="xl:col-span-3 space-y-6">
            {/* Filters */}
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar en registros médicos..."
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
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Tipo de registro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos los tipos</SelectItem>
                      <SelectItem value="consultation">Consultas</SelectItem>
                      <SelectItem value="emergency">Emergencias</SelectItem>
                      <SelectItem value="surgery">Cirugías</SelectItem>
                      <SelectItem value="lab">Laboratorios</SelectItem>
                      <SelectItem value="imaging">Imágenes</SelectItem>
                      <SelectItem value="prescription">Recetas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Medical Records Grid */}
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>

            {/* Empty State */}
            {filteredRecords.length === 0 && (
              <Card className="card-modern">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron registros
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedType !== "ALL"
                      ? "Intente ajustar los filtros de búsqueda"
                      : "No hay registros médicos para este paciente"
                    }
                  </p>
                  <Button 
                    className="gap-2"
                    onClick={() => setShowNewRecord(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Crear Primer Registro
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Record Detail Modal */}
        {selectedRecord && (
          <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = getRecordTypeIcon(selectedRecord.type);
                    return <Icon className="w-5 h-5" />;
                  })()}
                  {selectedRecord.chiefComplaint}
                  <Badge className={getRecordTypeColor(selectedRecord.type)}>
                    {getRecordTypeLabel(selectedRecord.type)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="vitals">Signos Vitales</TabsTrigger>
                  <TabsTrigger value="medications">Medicamentos</TabsTrigger>
                  <TabsTrigger value="attachments">Archivos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Médico</Label>
                      <p className="font-medium">{selectedRecord.doctor}</p>
                    </div>
                    <div>
                      <Label>Especialidad</Label>
                      <p className="font-medium">{selectedRecord.specialty}</p>
                    </div>
                    <div>
                      <Label>Fecha</Label>
                      <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Prioridad</Label>
                      <Badge className={getPriorityColor(selectedRecord.priority)}>
                        {selectedRecord.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Motivo de Consulta</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRecord.chiefComplaint}</p>
                  </div>
                  
                  <div>
                    <Label>Diagnóstico</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedRecord.diagnosis.map((diag, index) => (
                        <Badge key={index} variant="secondary">
                          {diag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Tratamiento</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRecord.treatment}</p>
                  </div>
                  
                  <div>
                    <Label>Notas Médicas</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRecord.notes}</p>
                  </div>
                  
                  {selectedRecord.followUp && (
                    <div>
                      <Label>Seguimiento</Label>
                      <p className="mt-1 p-3 bg-blue-50 rounded-lg text-blue-800">{selectedRecord.followUp}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="vitals" className="space-y-4">
                  {selectedRecord.vitalSigns ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{selectedRecord.vitalSigns.heartRate}</p>
                          <p className="text-sm text-muted-foreground">BPM</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">
                            {selectedRecord.vitalSigns.bloodPressure.systolic}/
                            {selectedRecord.vitalSigns.bloodPressure.diastolic}
                          </p>
                          <p className="text-sm text-muted-foreground">mmHg</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{selectedRecord.vitalSigns.temperature}</p>
                          <p className="text-sm text-muted-foreground">°C</p>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-2" />
                      <p>No se registraron signos vitales</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="medications" className="space-y-4">
                  {selectedRecord.medications.length > 0 ? (
                    <div className="space-y-4">
                      {selectedRecord.medications.map((medication, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold">{medication.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {medication.dosage} - {medication.frequency}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Duración: {medication.duration}
                                </p>
                                <p className="text-sm mt-1">{medication.instructions}</p>
                              </div>
                              <Badge variant={medication.status === "active" ? "default" : "secondary"}>
                                {medication.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="w-12 h-12 mx-auto mb-2" />
                      <p>No se prescribieron medicamentos</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="attachments" className="space-y-4">
                  {selectedRecord.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRecord.attachments.map((attachment) => (
                        <Card key={attachment.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                {attachment.type === "image" && <Image className="w-5 h-5 text-blue-600" />}
                                {attachment.type === "document" && <FileText className="w-5 h-5 text-blue-600" />}
                                {attachment.type === "video" && <FileVideo className="w-5 h-5 text-blue-600" />}
                                {attachment.type === "audio" && <Mic className="w-5 h-5 text-blue-600" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{attachment.name}</h4>
                                <p className="text-sm text-muted-foreground">{attachment.size}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(attachment.uploadDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Paperclip className="w-12 h-12 mx-auto mb-2" />
                      <p>No hay archivos adjuntos</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
