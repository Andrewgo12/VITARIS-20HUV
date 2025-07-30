import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Pill,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scissors,
  Microscope,
  Syringe,
  Heart,
  Activity,
  Thermometer,
  Shield,
  FileText,
  Upload,
  Download,
  Phone,
  Mail,
  Printer,
  Save,
  Edit3,
  Target,
  Timer,
  Bell,
  Stethoscope,
  UserCheck,
  Building,
  Bed,
  TrendingUp,
  BarChart3,
  Eye,
  Zap,
  Bandage,
} from "lucide-react";
import { motion } from "framer-motion";

// Interfaces para los modales
interface MedicationData {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
}

interface ProcedureData {
  name: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  performedBy: string;
  assistants: string[];
  materials: string[];
  anesthesia: string;
  instructions: string;
  risks: string[];
}

interface VitalSignsData {
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  oxygenSaturation: string;
  respiratoryRate: string;
  painLevel: string;
  consciousness: string;
  notes: string;
  recordedBy: string;
}

interface LabOrderData {
  tests: string[];
  priority: "ROUTINE" | "URGENT" | "STAT";
  category: string;
  instructions: string;
  orderedBy: string;
  expectedDate: string;
  notes: string;
}

interface DischargeData {
  dischargeDate: string;
  dischargeTime: string;
  condition: string;
  instructions: string;
  medications: string[];
  followUp: string;
  warnings: string;
  transportArrangement: string;
  responsiblePerson: string;
  contactInfo: string;
}

interface TransferData {
  fromSector: string;
  toSector: string;
  fromBed: string;
  toBed: string;
  reason: string;
  transferDate: string;
  transferTime: string;
  responsibleDoctor: string;
  transportType: string;
  specialRequirements: string;
  vitalSigns: boolean;
  medicalEquipment: string[];
}

// Modal para Prescribir Medicamentos
function PrescribeMedicationModal({ trigger }: { trigger: React.ReactNode }) {
  const [medicationData, setMedicationData] = useState<MedicationData>({
    name: "",
    dosage: "",
    frequency: "",
    route: "",
    duration: "",
    instructions: "",
    prescribedBy: "",
  });

  const handleSubmit = () => {
    console.log("Prescribiendo medicamento:", medicationData);
    // Aquí se enviaría la prescripción
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-green-500" />
            Prescribir Medicamento
          </DialogTitle>
          <DialogDescription>
            Complete la información del medicamento a prescribir
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre del Medicamento *</Label>
              <Input
                value={medicationData.name}
                onChange={(e) =>
                  setMedicationData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Ej: Paracetamol"
              />
            </div>
            <div>
              <Label>Dosis *</Label>
              <Input
                value={medicationData.dosage}
                onChange={(e) =>
                  setMedicationData((prev) => ({
                    ...prev,
                    dosage: e.target.value,
                  }))
                }
                placeholder="Ej: 500mg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Frecuencia *</Label>
              <Select
                value={medicationData.frequency}
                onValueChange={(value) =>
                  setMedicationData((prev) => ({ ...prev, frequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cada-6h">Cada 6 horas</SelectItem>
                  <SelectItem value="cada-8h">Cada 8 horas</SelectItem>
                  <SelectItem value="cada-12h">Cada 12 horas</SelectItem>
                  <SelectItem value="cada-24h">Cada 24 horas</SelectItem>
                  <SelectItem value="PRN">Según necesidad (PRN)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vía de Administración *</Label>
              <Select
                value={medicationData.route}
                onValueChange={(value) =>
                  setMedicationData((prev) => ({ ...prev, route: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oral">Oral</SelectItem>
                  <SelectItem value="intravenosa">Intravenosa</SelectItem>
                  <SelectItem value="intramuscular">Intramuscular</SelectItem>
                  <SelectItem value="subcutanea">Subcutánea</SelectItem>
                  <SelectItem value="topica">Tópica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Duración del Tratamiento</Label>
            <Input
              value={medicationData.duration}
              onChange={(e) =>
                setMedicationData((prev) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
              placeholder="Ej: 7 días"
            />
          </div>

          <div>
            <Label>Instrucciones Especiales</Label>
            <Textarea
              value={medicationData.instructions}
              onChange={(e) =>
                setMedicationData((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              placeholder="Instrucciones adicionales para el paciente..."
              rows={3}
            />
          </div>

          <div>
            <Label>Médico Prescriptor</Label>
            <Input
              value={medicationData.prescribedBy}
              onChange={(e) =>
                setMedicationData((prev) => ({
                  ...prev,
                  prescribedBy: e.target.value,
                }))
              }
              placeholder="Nombre del médico"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSubmit}>
              <Pill className="w-4 h-4 mr-2" />
              Prescribir Medicamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal para Programar Procedimientos
function ScheduleProcedureModal({ trigger }: { trigger: React.ReactNode }) {
  const [procedureData, setProcedureData] = useState<ProcedureData>({
    name: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    performedBy: "",
    assistants: [],
    materials: [],
    anesthesia: "",
    instructions: "",
    risks: [],
  });

  const handleSubmit = () => {
    console.log("Programando procedimiento:", procedureData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-500" />
            Programar Procedimiento
          </DialogTitle>
          <DialogDescription>
            Complete la información del procedimiento a realizar
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="team">Equipo Médico</TabsTrigger>
            <TabsTrigger value="details">Detalles Adicionales</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre del Procedimiento *</Label>
                <Input
                  value={procedureData.name}
                  onChange={(e) =>
                    setProcedureData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Ej: Cateterismo cardíaco"
                />
              </div>
              <div>
                <Label>Tipo de Procedimiento *</Label>
                <Select
                  value={procedureData.type}
                  onValueChange={(value) =>
                    setProcedureData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                    <SelectItem value="terapeutico">Terapéutico</SelectItem>
                    <SelectItem value="quirurgico">Quirúrgico</SelectItem>
                    <SelectItem value="intervencionista">
                      Intervencionista
                    </SelectItem>
                    <SelectItem value="emergencia">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Fecha *</Label>
                <Input
                  type="date"
                  value={procedureData.date}
                  onChange={(e) =>
                    setProcedureData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Hora *</Label>
                <Input
                  type="time"
                  value={procedureData.time}
                  onChange={(e) =>
                    setProcedureData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Duración Estimada</Label>
                <Input
                  value={procedureData.duration}
                  onChange={(e) =>
                    setProcedureData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="Ej: 45 minutos"
                />
              </div>
            </div>

            <div>
              <Label>Anestesia</Label>
              <Select
                value={procedureData.anesthesia}
                onValueChange={(value) =>
                  setProcedureData((prev) => ({ ...prev, anesthesia: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de anestesia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguna">Sin anestesia</SelectItem>
                  <SelectItem value="local">Anestesia local</SelectItem>
                  <SelectItem value="regional">Anestesia regional</SelectItem>
                  <SelectItem value="general">Anestesia general</SelectItem>
                  <SelectItem value="sedacion">Sedación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div>
              <Label>Médico Principal *</Label>
              <Input
                value={procedureData.performedBy}
                onChange={(e) =>
                  setProcedureData((prev) => ({
                    ...prev,
                    performedBy: e.target.value,
                  }))
                }
                placeholder="Nombre del médico responsable"
              />
            </div>

            <div>
              <Label>Asistentes</Label>
              <Textarea
                value={procedureData.assistants.join(", ")}
                onChange={(e) =>
                  setProcedureData((prev) => ({
                    ...prev,
                    assistants: e.target.value.split(", "),
                  }))
                }
                placeholder="Nombres de los asistentes separados por comas"
                rows={2}
              />
            </div>

            <div>
              <Label>Materiales y Equipos Necesarios</Label>
              <Textarea
                value={procedureData.materials.join(", ")}
                onChange={(e) =>
                  setProcedureData((prev) => ({
                    ...prev,
                    materials: e.target.value.split(", "),
                  }))
                }
                placeholder="Lista de materiales y equipos separados por comas"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div>
              <Label>Instrucciones Pre-procedimiento</Label>
              <Textarea
                value={procedureData.instructions}
                onChange={(e) =>
                  setProcedureData((prev) => ({
                    ...prev,
                    instructions: e.target.value,
                  }))
                }
                placeholder="Instrucciones para preparar al paciente..."
                rows={3}
              />
            </div>

            <div>
              <Label>Riesgos y Complicaciones</Label>
              <Textarea
                value={procedureData.risks.join(", ")}
                onChange={(e) =>
                  setProcedureData((prev) => ({
                    ...prev,
                    risks: e.target.value.split(", "),
                  }))
                }
                placeholder="Riesgos potenciales separados por comas"
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit}>
            <Calendar className="w-4 h-4 mr-2" />
            Programar Procedimiento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal para Registro de Signos Vitales
function VitalSignsModal({ trigger }: { trigger: React.ReactNode }) {
  const [vitalsData, setVitalsData] = useState<VitalSignsData>({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
    painLevel: "",
    consciousness: "",
    notes: "",
    recordedBy: "",
  });

  const handleSubmit = () => {
    console.log("Registrando signos vitales:", vitalsData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Registro de Signos Vitales
          </DialogTitle>
          <DialogDescription>
            Registre los signos vitales actuales del paciente
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <Label className="font-semibold">Frecuencia Cardíaca</Label>
            </div>
            <Input
              type="number"
              value={vitalsData.heartRate}
              onChange={(e) =>
                setVitalsData((prev) => ({
                  ...prev,
                  heartRate: e.target.value,
                }))
              }
              placeholder="bpm"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <Label className="font-semibold">Presión Arterial</Label>
            </div>
            <Input
              value={vitalsData.bloodPressure}
              onChange={(e) =>
                setVitalsData((prev) => ({
                  ...prev,
                  bloodPressure: e.target.value,
                }))
              }
              placeholder="120/80"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-slate-500" />
              <Label className="font-semibold">Temperatura</Label>
            </div>
            <Input
              type="number"
              step="0.1"
              value={vitalsData.temperature}
              onChange={(e) =>
                setVitalsData((prev) => ({
                  ...prev,
                  temperature: e.target.value,
                }))
              }
              placeholder="°C"
            />
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-500" />
              <Label className="font-semibold">Saturación O2</Label>
            </div>
            <Input
              type="number"
              value={vitalsData.oxygenSaturation}
              onChange={(e) =>
                setVitalsData((prev) => ({
                  ...prev,
                  oxygenSaturation: e.target.value,
                }))
              }
              placeholder="%"
            />
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <Label className="font-semibold">Freq. Respiratoria</Label>
            </div>
            <Input
              type="number"
              value={vitalsData.respiratoryRate}
              onChange={(e) =>
                setVitalsData((prev) => ({
                  ...prev,
                  respiratoryRate: e.target.value,
                }))
              }
              placeholder="rpm"
            />
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-red-500" />
              <Label className="font-semibold">Nivel de Dolor</Label>
            </div>
            <Select
              value={vitalsData.painLevel}
              onValueChange={(value) =>
                setVitalsData((prev) => ({ ...prev, painLevel: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="0-10" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(11)].map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i} -{" "}
                    {i === 0
                      ? "Sin dolor"
                      : i <= 3
                        ? "Leve"
                        : i <= 6
                          ? "Moderado"
                          : "Severo"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Estado de Conciencia</Label>
            <Select
              value={vitalsData.consciousness}
              onValueChange={(value) =>
                setVitalsData((prev) => ({ ...prev, consciousness: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alerta">Alerta y orientado</SelectItem>
                <SelectItem value="somnoliento">Somnoliento</SelectItem>
                <SelectItem value="confuso">Confuso</SelectItem>
                <SelectItem value="estuporoso">Estuporoso</SelectItem>
                <SelectItem value="comatoso">Comatoso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Observaciones</Label>
            <Textarea
              value={vitalsData.notes}
              onChange={(e) =>
                setVitalsData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Observaciones adicionales sobre el estado del paciente..."
              rows={3}
            />
          </div>

          <div>
            <Label>Registrado por</Label>
            <Input
              value={vitalsData.recordedBy}
              onChange={(e) =>
                setVitalsData((prev) => ({
                  ...prev,
                  recordedBy: e.target.value,
                }))
              }
              placeholder="Nombre del profesional"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Registrar Signos Vitales
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal para Solicitar Laboratorios
function OrderLabsModal({ trigger }: { trigger: React.ReactNode }) {
  const [labData, setLabData] = useState<LabOrderData>({
    tests: [],
    priority: "ROUTINE",
    category: "",
    instructions: "",
    orderedBy: "",
    expectedDate: "",
    notes: "",
  });

  const availableTests = [
    "Hemograma completo",
    "Química sanguínea",
    "Perfil hepático",
    "Perfil renal",
    "Perfil lipídico",
    "Troponinas",
    "CPK-MB",
    "Gasometría arterial",
    "Coagulación (PT/PTT)",
    "Parcial de orina",
    "Urocultivo",
    "Hemocultivos",
    "PCR",
    "VSG",
    "Electrolitos",
    "TSH",
    "HbA1c",
  ];

  const toggleTest = (test: string) => {
    setLabData((prev) => ({
      ...prev,
      tests: prev.tests.includes(test)
        ? prev.tests.filter((t) => t !== test)
        : [...prev.tests, test],
    }));
  };

  const handleSubmit = () => {
    console.log("Solicitando laboratorios:", labData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-blue-500" />
            Solicitar Exámenes de Laboratorio
          </DialogTitle>
          <DialogDescription>
            Seleccione los exámenes de laboratorio a solicitar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Prioridad *</Label>
              <Select
                value={labData.priority}
                onValueChange={(value) =>
                  setLabData((prev) => ({
                    ...prev,
                    priority: value as LabOrderData["priority"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROUTINE">Rutina</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                  <SelectItem value="STAT">STAT (Inmediato)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoría</Label>
              <Select
                value={labData.category}
                onValueChange={(value) =>
                  setLabData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hematologia">Hematología</SelectItem>
                  <SelectItem value="quimica">Química Clínica</SelectItem>
                  <SelectItem value="microbiologia">Microbiología</SelectItem>
                  <SelectItem value="inmunologia">Inmunología</SelectItem>
                  <SelectItem value="coagulacion">Coagulación</SelectItem>
                  <SelectItem value="gasometria">Gasometría</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha Esperada</Label>
              <Input
                type="date"
                value={labData.expectedDate}
                onChange={(e) =>
                  setLabData((prev) => ({
                    ...prev,
                    expectedDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">
              Exámenes Disponibles
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {availableTests.map((test) => (
                <div key={test} className="flex items-center space-x-2">
                  <Checkbox
                    id={test}
                    checked={labData.tests.includes(test)}
                    onCheckedChange={() => toggleTest(test)}
                  />
                  <Label htmlFor={test} className="text-sm font-normal">
                    {test}
                  </Label>
                </div>
              ))}
            </div>

            {labData.tests.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="font-semibold text-blue-800">
                  Exámenes Seleccionados ({labData.tests.length}):
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {labData.tests.map((test) => (
                    <Badge key={test} variant="secondary" className="text-xs">
                      {test}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label>Instrucciones Especiales</Label>
            <Textarea
              value={labData.instructions}
              onChange={(e) =>
                setLabData((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              placeholder="Instrucciones para la toma de muestras, ayuno requerido, etc..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Médico Solicitante</Label>
              <Input
                value={labData.orderedBy}
                onChange={(e) =>
                  setLabData((prev) => ({ ...prev, orderedBy: e.target.value }))
                }
                placeholder="Nombre del médico"
              />
            </div>
            <div>
              <Label>Notas Adicionales</Label>
              <Input
                value={labData.notes}
                onChange={(e) =>
                  setLabData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Información clínica relevante"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={labData.tests.length === 0}>
            <Microscope className="w-4 h-4 mr-2" />
            Solicitar Laboratorios ({labData.tests.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal para Dar de Alta
function DischargePatientModal({ trigger }: { trigger: React.ReactNode }) {
  const [dischargeData, setDischargeData] = useState<DischargeData>({
    dischargeDate: "",
    dischargeTime: "",
    condition: "",
    instructions: "",
    medications: [],
    followUp: "",
    warnings: "",
    transportArrangement: "",
    responsiblePerson: "",
    contactInfo: "",
  });

  const handleSubmit = () => {
    console.log("Procesando alta:", dischargeData);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Dar de Alta al Paciente
          </AlertDialogTitle>
          <AlertDialogDescription>
            Complete la información necesaria para el alta médica. Esta acción
            no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Alta *</Label>
              <Input
                type="date"
                value={dischargeData.dischargeDate}
                onChange={(e) =>
                  setDischargeData((prev) => ({
                    ...prev,
                    dischargeDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Hora de Alta *</Label>
              <Input
                type="time"
                value={dischargeData.dischargeTime}
                onChange={(e) =>
                  setDischargeData((prev) => ({
                    ...prev,
                    dischargeTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label>Condición al Alta *</Label>
            <Select
              value={dischargeData.condition}
              onValueChange={(value) =>
                setDischargeData((prev) => ({ ...prev, condition: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar condición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mejorado">Mejorado</SelectItem>
                <SelectItem value="curado">Curado</SelectItem>
                <SelectItem value="estable">Estable</SelectItem>
                <SelectItem value="sin-cambios">Sin cambios</SelectItem>
                <SelectItem value="referido">
                  Referido a otra institución
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Instrucciones para el Paciente *</Label>
            <Textarea
              value={dischargeData.instructions}
              onChange={(e) =>
                setDischargeData((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              placeholder="Cuidados en casa, restricciones de actividad, dieta, etc..."
              rows={4}
            />
          </div>

          <div>
            <Label>Medicamentos al Alta</Label>
            <Textarea
              value={dischargeData.medications.join("\n")}
              onChange={(e) =>
                setDischargeData((prev) => ({
                  ...prev,
                  medications: e.target.value.split("\n"),
                }))
              }
              placeholder="Liste los medicamentos que debe continuar tomando (uno por línea)"
              rows={3}
            />
          </div>

          <div>
            <Label>Seguimiento Médico *</Label>
            <Textarea
              value={dischargeData.followUp}
              onChange={(e) =>
                setDischargeData((prev) => ({
                  ...prev,
                  followUp: e.target.value,
                }))
              }
              placeholder="Citas de control, especialistas a visitar, exámenes pendientes..."
              rows={3}
            />
          </div>

          <div>
            <Label>Signos de Alarma</Label>
            <Textarea
              value={dischargeData.warnings}
              onChange={(e) =>
                setDischargeData((prev) => ({
                  ...prev,
                  warnings: e.target.value,
                }))
              }
              placeholder="Síntomas por los cuales debe regresar inmediatamente..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Persona Responsable</Label>
              <Input
                value={dischargeData.responsiblePerson}
                onChange={(e) =>
                  setDischargeData((prev) => ({
                    ...prev,
                    responsiblePerson: e.target.value,
                  }))
                }
                placeholder="Familiar o cuidador responsable"
              />
            </div>
            <div>
              <Label>Información de Contacto</Label>
              <Input
                value={dischargeData.contactInfo}
                onChange={(e) =>
                  setDischargeData((prev) => ({
                    ...prev,
                    contactInfo: e.target.value,
                  }))
                }
                placeholder="Teléfono de contacto"
              />
            </div>
          </div>

          <div>
            <Label>Arreglos de Transporte</Label>
            <Select
              value={dischargeData.transportArrangement}
              onValueChange={(value) =>
                setDischargeData((prev) => ({
                  ...prev,
                  transportArrangement: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Medio de transporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="familiar">Familiar</SelectItem>
                <SelectItem value="ambulancia">Ambulancia</SelectItem>
                <SelectItem value="taxi">Taxi</SelectItem>
                <SelectItem value="transporte-publico">
                  Transporte público
                </SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirmar Alta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Modal para Transferir Paciente
function TransferPatientModal({ trigger }: { trigger: React.ReactNode }) {
  const [transferData, setTransferData] = useState<TransferData>({
    fromSector: "",
    toSector: "",
    fromBed: "",
    toBed: "",
    reason: "",
    transferDate: "",
    transferTime: "",
    responsibleDoctor: "",
    transportType: "",
    specialRequirements: "",
    vitalSigns: false,
    medicalEquipment: [],
  });

  const handleSubmit = () => {
    console.log("Procesando transferencia:", transferData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Transferir Paciente
          </DialogTitle>
          <DialogDescription>
            Complete la información para la transferencia del paciente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Sector de Origen *</Label>
              <Select
                value={transferData.fromSector}
                onValueChange={(value) =>
                  setTransferData((prev) => ({ ...prev, fromSector: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sector actual" />
                </SelectTrigger>
                <SelectContent>
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
              <Label>Sector de Destino *</Label>
              <Select
                value={transferData.toSector}
                onValueChange={(value) =>
                  setTransferData((prev) => ({ ...prev, toSector: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sector destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UCI">UCI</SelectItem>
                  <SelectItem value="URGENCIAS">Urgencias</SelectItem>
                  <SelectItem value="CARDIOLOGIA">Cardiología</SelectItem>
                  <SelectItem value="GINECOLOGIA">Ginecología</SelectItem>
                  <SelectItem value="PEDIATRIA">Pediatría</SelectItem>
                  <SelectItem value="CIRUGIA">Cirugía</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cama Actual</Label>
              <Input
                value={transferData.fromBed}
                onChange={(e) =>
                  setTransferData((prev) => ({
                    ...prev,
                    fromBed: e.target.value,
                  }))
                }
                placeholder="Ej: UCI-001"
              />
            </div>
            <div>
              <Label>Cama Destino *</Label>
              <Input
                value={transferData.toBed}
                onChange={(e) =>
                  setTransferData((prev) => ({
                    ...prev,
                    toBed: e.target.value,
                  }))
                }
                placeholder="Ej: CARD-005"
              />
            </div>
          </div>

          <div>
            <Label>Motivo de la Transferencia *</Label>
            <Textarea
              value={transferData.reason}
              onChange={(e) =>
                setTransferData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Explique el motivo médico para la transferencia..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Transferencia *</Label>
              <Input
                type="date"
                value={transferData.transferDate}
                onChange={(e) =>
                  setTransferData((prev) => ({
                    ...prev,
                    transferDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Hora de Transferencia *</Label>
              <Input
                type="time"
                value={transferData.transferTime}
                onChange={(e) =>
                  setTransferData((prev) => ({
                    ...prev,
                    transferTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label>Médico Responsable *</Label>
            <Input
              value={transferData.responsibleDoctor}
              onChange={(e) =>
                setTransferData((prev) => ({
                  ...prev,
                  responsibleDoctor: e.target.value,
                }))
              }
              placeholder="Médico que autoriza la transferencia"
            />
          </div>

          <div>
            <Label>Tipo de Transporte</Label>
            <Select
              value={transferData.transportType}
              onValueChange={(value) =>
                setTransferData((prev) => ({ ...prev, transportType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar transporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="camilla">Camilla</SelectItem>
                <SelectItem value="silla-ruedas">Silla de ruedas</SelectItem>
                <SelectItem value="caminando">Caminando</SelectItem>
                <SelectItem value="ambulancia-interna">
                  Ambulancia interna
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Equipos Médicos a Transferir</Label>
            <Textarea
              value={transferData.medicalEquipment.join(", ")}
              onChange={(e) =>
                setTransferData((prev) => ({
                  ...prev,
                  medicalEquipment: e.target.value.split(", "),
                }))
              }
              placeholder="Lista de equipos médicos que acompañan al paciente (separados por comas)"
              rows={2}
            />
          </div>

          <div>
            <Label>Requerimientos Especiales</Label>
            <Textarea
              value={transferData.specialRequirements}
              onChange={(e) =>
                setTransferData((prev) => ({
                  ...prev,
                  specialRequirements: e.target.value,
                }))
              }
              placeholder="Cuidados especiales durante la transferencia..."
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="vitals-transfer"
              checked={transferData.vitalSigns}
              onCheckedChange={(checked) =>
                setTransferData((prev) => ({
                  ...prev,
                  vitalSigns: checked as boolean,
                }))
              }
            />
            <Label htmlFor="vitals-transfer">
              Tomar signos vitales antes de la transferencia
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Autorizar Transferencia
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Exportar todos los modales
export {
  PrescribeMedicationModal,
  ScheduleProcedureModal,
  VitalSignsModal,
  OrderLabsModal,
  DischargePatientModal,
  TransferPatientModal,
};
