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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Pill,
  Search,
  Plus,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
  Share,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Stethoscope,
  Shield,
  Target,
  Activity,
  Heart,
  Brain,
  Zap,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Save,
  X,
  Check,
  ChevronsUpDown,
  Loader2,
  QrCode,
  Smartphone,
  FileText,
  Beaker,
  AlertCircle,
  Info,
  Star,
  Flag,
  Calculator,
  Timer,
  Gauge,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

interface Medication {
  id: string;
  name: string;
  genericName: string;
  concentration: string;
  form: "tablet" | "capsule" | "liquid" | "injection" | "cream" | "inhaler";
  category: string;
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  maxDailyDose: number;
  unit: string;
  requiresMonitoring: boolean;
  controlledSubstance: boolean;
  cost: number;
  availability: "available" | "low_stock" | "out_of_stock";
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientWeight: number;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  medications: PrescribedMedication[];
  diagnosis: string[];
  status:
    | "draft"
    | "pending"
    | "approved"
    | "dispensed"
    | "completed"
    | "cancelled";
  priority: "normal" | "urgent" | "stat";
  notes: string;
  allergies: string[];
  interactions: MedicationInteraction[];
  totalCost: number;
  validUntil: string;
  refillsRemaining: number;
  electronicSignature: boolean;
  qrCode?: string;
}

interface PrescribedMedication {
  medicationId: string;
  medication: Medication;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  startDate: string;
  endDate: string;
  refills: number;
  asNeeded: boolean;
  withFood: boolean;
  timeOfDay: string[];
  route: "oral" | "iv" | "im" | "topical" | "inhalation";
  warnings: string[];
}

interface MedicationInteraction {
  type: "drug-drug" | "drug-allergy" | "drug-condition";
  severity: "minor" | "moderate" | "major" | "contraindicated";
  description: string;
  recommendation: string;
}

export default function PrescriptionSystemAdvanced() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);

  // New prescription form state
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>(
    {
      medications: [],
      status: "draft",
      priority: "normal",
      allergies: [],
      interactions: [],
      electronicSignature: false,
    },
  );
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [medicationSearch, setMedicationSearch] = useState("");
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  // Mock data initialization
  useEffect(() => {
    const mockMedications: Medication[] = [
      {
        id: "med-001",
        name: "Amoxicilina",
        genericName: "Amoxicillin",
        concentration: "500mg",
        form: "capsule",
        category: "Antibiótico",
        contraindications: ["Alergia a penicilinas"],
        sideEffects: ["Náuseas", "Diarrea", "Erupciones cutáneas"],
        interactions: ["Warfarina", "Metotrexato"],
        maxDailyDose: 3000,
        unit: "mg",
        requiresMonitoring: false,
        controlledSubstance: false,
        cost: 15000,
        availability: "available",
      },
      {
        id: "med-002",
        name: "Metformina",
        genericName: "Metformin",
        concentration: "850mg",
        form: "tablet",
        category: "Antidiabético",
        contraindications: ["Insuficiencia renal", "Acidosis metabólica"],
        sideEffects: ["Diarrea", "Náuseas", "Dolor abdominal"],
        interactions: ["Alcohol", "Contrastes yodados"],
        maxDailyDose: 2550,
        unit: "mg",
        requiresMonitoring: true,
        controlledSubstance: false,
        cost: 8500,
        availability: "available",
      },
      {
        id: "med-003",
        name: "Atorvastatina",
        genericName: "Atorvastatin",
        concentration: "40mg",
        form: "tablet",
        category: "Hipolipemiante",
        contraindications: ["Enfermedad hepática activa"],
        sideEffects: ["Mialgia", "Cefalea", "Trastornos digestivos"],
        interactions: ["Warfarina", "Digoxina", "Ciclosporina"],
        maxDailyDose: 80,
        unit: "mg",
        requiresMonitoring: true,
        controlledSubstance: false,
        cost: 22000,
        availability: "low_stock",
      },
    ];

    const mockPrescriptions: Prescription[] = [
      {
        id: "presc-001",
        patientId: "pat-001",
        patientName: "María González",
        patientAge: 45,
        patientWeight: 68,
        doctorId: "doc-001",
        doctorName: "Dr. Ana López",
        specialty: "Medicina Interna",
        date: "2024-01-15",
        medications: [
          {
            medicationId: "med-001",
            medication: mockMedications[0],
            dosage: "500mg",
            frequency: "Cada 8 horas",
            duration: "7 días",
            quantity: 21,
            instructions: "Tomar con alimentos",
            startDate: "2024-01-15",
            endDate: "2024-01-22",
            refills: 0,
            asNeeded: false,
            withFood: true,
            timeOfDay: ["08:00", "16:00", "00:00"],
            route: "oral",
            warnings: ["Completar el tratamiento"],
          },
        ],
        diagnosis: ["Infección respiratoria alta"],
        status: "approved",
        priority: "normal",
        notes: "Tratamiento para infección bacteriana confirmada",
        allergies: ["Sulfonamidas"],
        interactions: [],
        totalCost: 15000,
        validUntil: "2024-02-15",
        refillsRemaining: 0,
        electronicSignature: true,
        qrCode: "QR123456789",
      },
    ];

    setMedications(mockMedications);
    setPrescriptions(mockPrescriptions);
  }, []);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.doctorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.medications.some((med) =>
        med.medication.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "ALL" || prescription.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || prescription.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "dispensed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "stat":
        return "bg-red-100 text-red-800 border-red-500";
      case "urgent":
        return "bg-red-100 text-red-800 border-red-500";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "text-green-600";
      case "low_stock":
        return "text-slate-600";
      case "out_of_stock":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const calculateDosage = (medication: Medication, patientWeight: number) => {
    // Simple dosage calculation based on weight (this would be more complex in reality)
    const dosePerKg = medication.maxDailyDose / 70; // Assuming 70kg average adult
    return Math.round(dosePerKg * patientWeight);
  };

  const checkInteractions = (
    medications: PrescribedMedication[],
    allergies: string[],
  ) => {
    const interactions: MedicationInteraction[] = [];

    // Check drug-allergy interactions
    medications.forEach((med) => {
      allergies.forEach((allergy) => {
        if (
          med.medication.contraindications.some((ci) =>
            ci.toLowerCase().includes(allergy.toLowerCase()),
          )
        ) {
          interactions.push({
            type: "drug-allergy",
            severity: "contraindicated",
            description: `${med.medication.name} está contraindicado en pacientes alérgicos a ${allergy}`,
            recommendation: "Considerar medicamento alternativo",
          });
        }
      });
    });

    // Check drug-drug interactions
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];

        if (med1.medication.interactions.includes(med2.medication.name)) {
          interactions.push({
            type: "drug-drug",
            severity: "moderate",
            description: `Posible interacción entre ${med1.medication.name} y ${med2.medication.name}`,
            recommendation:
              "Monitorear efectos adversos y ajustar dosis si es necesario",
          });
        }
      }
    }

    return interactions;
  };

  const PrescriptionCard = ({
    prescription,
  }: {
    prescription: Prescription;
  }) => (
    <Card
      className="card-modern hover:shadow-medium transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedPrescription(prescription)}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground truncate">
                  {prescription.patientName}
                </h3>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(prescription.status)}>
                    {prescription.status}
                  </Badge>
                  <Badge className={getPriorityColor(prescription.priority)}>
                    {prescription.priority}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {prescription.doctorName}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(prescription.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Pill className="w-3 h-3" />
                  <span>{prescription.medications.length} medicamento(s)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span className="truncate">
                    {prescription.diagnosis.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end gap-2">
            {prescription.interactions.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {prescription.interactions.length} Interacciones
              </Badge>
            )}
            <span className="text-lg font-bold text-foreground">
              ${prescription.totalCost.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <QrCode className="w-4 h-4 mr-2" />
            QR
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const MedicationSearchCard = ({ medication }: { medication: Medication }) => (
    <Card
      className={cn(
        "card-modern cursor-pointer transition-all duration-300",
        selectedMedication?.id === medication.id && "ring-2 ring-primary",
      )}
      onClick={() => setSelectedMedication(medication)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground truncate">
                {medication.name}
              </h4>
              <Badge variant="outline" className="text-xs">
                {medication.concentration}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {medication.genericName}
            </p>
            <p className="text-xs text-muted-foreground">
              {medication.category}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {medication.form}
              </Badge>
              {medication.controlledSubstance && (
                <Badge variant="destructive" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Controlado
                </Badge>
              )}
              {medication.requiresMonitoring && (
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Monitoreo
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold">
              ${medication.cost.toLocaleString()}
            </p>
            <p
              className={cn(
                "text-xs",
                getAvailabilityColor(medication.availability),
              )}
            >
              {medication.availability === "available"
                ? "Disponible"
                : medication.availability === "low_stock"
                  ? "Stock Bajo"
                  : "Agotado"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatsCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "blue",
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <Card className="card-modern">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5",
                  color === "red" && "text-red-500",
                  color === "green" && "text-emerald-500",
                  color === "blue" && "text-blue-500",
                  color === "slate" && "text-slate-500",
                  color === "purple" && "text-purple-500",
                )}
              />
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>
            <p className="text-xl sm:text-3xl font-bold text-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <NavigationImproved
            userName="Dr. Especialista"
            userRole="Médico Prescriptor"
            notifications={
              prescriptions.filter((p) => p.status === "pending").length
            }
          />
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/medical-dashboard")}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard Médico</span>
              <span className="sm:hidden">Volver</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                Sistema de Prescripciones
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Gestión avanzada de medicamentos y recetas
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" className="gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
            <Button
              className="gap-2 text-sm"
              onClick={() => setShowNewPrescription(true)}
            >
              <Plus className="w-4 h-4" />
              Nueva Prescripción
            </Button>
          </div>
        </div>

        {/* Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            icon={Pill}
            title="Total Prescripciones"
            value={prescriptions.length}
            subtitle="Este mes"
            color="blue"
          />
          <StatsCard
            icon={Clock}
            title="Pendientes"
            value={prescriptions.filter((p) => p.status === "pending").length}
            subtitle="Por aprobar"
            color="slate"
          />
          <StatsCard
            icon={CheckCircle}
            title="Aprobadas"
            value={prescriptions.filter((p) => p.status === "approved").length}
            subtitle="Listas"
            color="green"
          />
          <StatsCard
            icon={AlertTriangle}
            title="Interacciones"
            value={prescriptions.reduce(
              (acc, p) => acc + p.interactions.length,
              0,
            )}
            subtitle="Detectadas"
            color="red"
          />
          <StatsCard
            icon={Calculator}
            title="Costo Promedio"
            value={`$${Math.round(prescriptions.reduce((acc, p) => acc + p.totalCost, 0) / prescriptions.length || 0).toLocaleString()}`}
            subtitle="Por prescripción"
            color="purple"
          />
          <StatsCard
            icon={Beaker}
            title="Medicamentos"
            value={medications.length}
            subtitle="Disponibles"
            color="blue"
          />
        </div>

        {/* Filters - Responsive Layout */}
        <Card className="card-modern mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full lg:w-auto">
                <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar prescripciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4" />
                  <span className="sm:hidden">Filtros</span>
                  <span className="hidden sm:inline">Filtros Avanzados</span>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="dispensed">Dispensada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions Grid - Responsive */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPrescriptions.length === 0 && (
          <Card className="card-modern">
            <CardContent className="p-8 sm:p-12 text-center">
              <Pill className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                No se encontraron prescripciones
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm ||
                statusFilter !== "ALL" ||
                priorityFilter !== "ALL"
                  ? "Intente ajustar los filtros de búsqueda"
                  : "No hay prescripciones registradas"}
              </p>
              <Button
                className="gap-2"
                onClick={() => setShowNewPrescription(true)}
              >
                <Plus className="w-4 h-4" />
                Crear Primera Prescripción
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Prescription Detail Modal - Responsive */}
        {selectedPrescription && (
          <Dialog
            open={!!selectedPrescription}
            onOpenChange={() => setSelectedPrescription(null)}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              <div className="p-4 sm:p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Prescripción - {selectedPrescription.patientName}
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        className={getStatusColor(selectedPrescription.status)}
                      >
                        {selectedPrescription.status}
                      </Badge>
                      <Badge
                        className={getPriorityColor(
                          selectedPrescription.priority,
                        )}
                      >
                        {selectedPrescription.priority}
                      </Badge>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="medications" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4">
                    <TabsTrigger
                      value="medications"
                      className="text-xs sm:text-sm"
                    >
                      Medicamentos
                    </TabsTrigger>
                    <TabsTrigger
                      value="interactions"
                      className="text-xs sm:text-sm"
                    >
                      Interacciones
                    </TabsTrigger>
                    <TabsTrigger value="details" className="text-xs sm:text-sm">
                      Detalles
                    </TabsTrigger>
                    <TabsTrigger
                      value="qr"
                      className="text-xs sm:text-sm hidden sm:inline-flex"
                    >
                      QR
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="medications" className="space-y-4 mt-6">
                    {selectedPrescription.medications.map((med, index) => (
                      <Card key={index} className="card-modern">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                <h4 className="font-semibold text-foreground">
                                  {med.medication.name}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="self-start sm:self-auto"
                                >
                                  {med.medication.concentration}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <Label className="text-muted-foreground">
                                    Dosis
                                  </Label>
                                  <p className="font-medium">{med.dosage}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Frecuencia
                                  </Label>
                                  <p className="font-medium">{med.frequency}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Duración
                                  </Label>
                                  <p className="font-medium">{med.duration}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">
                                    Cantidad
                                  </Label>
                                  <p className="font-medium">
                                    {med.quantity} unidades
                                  </p>
                                </div>
                              </div>

                              {med.instructions && (
                                <div className="mt-3">
                                  <Label className="text-muted-foreground">
                                    Instrucciones
                                  </Label>
                                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                                    {med.instructions}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex-shrink-0 text-right">
                              <p className="text-lg font-bold">
                                ${med.medication.cost.toLocaleString()}
                              </p>
                              <p
                                className={cn(
                                  "text-sm",
                                  getAvailabilityColor(
                                    med.medication.availability,
                                  ),
                                )}
                              >
                                {med.medication.availability === "available"
                                  ? "Disponible"
                                  : med.medication.availability === "low_stock"
                                    ? "Stock Bajo"
                                    : "Agotado"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="interactions" className="space-y-4 mt-6">
                    {selectedPrescription.interactions.length > 0 ? (
                      selectedPrescription.interactions.map(
                        (interaction, index) => (
                          <Card
                            key={index}
                            className={cn(
                              "border-l-4",
                              interaction.severity === "contraindicated"
                                ? "border-l-red-500 bg-red-50"
                                : interaction.severity === "major"
                                  ? "border-l-red-500 bg-red-50"
                                  : interaction.severity === "moderate"
                                    ? "border-l-slate-500 bg-slate-50"
                                    : "border-l-blue-500 bg-blue-50",
                            )}
                          >
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle
                                      className={cn(
                                        "w-5 h-5",
                                        interaction.severity ===
                                          "contraindicated"
                                          ? "text-red-600"
                                          : interaction.severity === "major"
                                            ? "text-red-600"
                                            : interaction.severity ===
                                                "moderate"
                                              ? "text-slate-600"
                                              : "text-blue-600",
                                      )}
                                    />
                                    <Badge
                                      variant={
                                        interaction.severity ===
                                        "contraindicated"
                                          ? "destructive"
                                          : interaction.severity === "major"
                                            ? "secondary"
                                            : "outline"
                                      }
                                    >
                                      {interaction.severity}
                                    </Badge>
                                  </div>
                                  <h4 className="font-semibold mb-2">
                                    {interaction.description}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {interaction.recommendation}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ),
                      )
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No hay interacciones detectadas
                        </h3>
                        <p className="text-muted-foreground">
                          Los medicamentos prescritos son seguros para usar
                          juntos
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Paciente</Label>
                        <p className="font-medium">
                          {selectedPrescription.patientName}
                        </p>
                      </div>
                      <div>
                        <Label>Edad</Label>
                        <p className="font-medium">
                          {selectedPrescription.patientAge} años
                        </p>
                      </div>
                      <div>
                        <Label>Médico</Label>
                        <p className="font-medium">
                          {selectedPrescription.doctorName}
                        </p>
                      </div>
                      <div>
                        <Label>Especialidad</Label>
                        <p className="font-medium">
                          {selectedPrescription.specialty}
                        </p>
                      </div>
                      <div>
                        <Label>Fecha</Label>
                        <p className="font-medium">
                          {new Date(
                            selectedPrescription.date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label>Válida hasta</Label>
                        <p className="font-medium">
                          {new Date(
                            selectedPrescription.validUntil,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>Diagnóstico</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedPrescription.diagnosis.map((diag, index) => (
                          <Badge key={index} variant="secondary">
                            {diag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedPrescription.allergies.length > 0 && (
                      <div>
                        <Label>Alergias</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedPrescription.allergies.map(
                            (allergy, index) => (
                              <Badge key={index} variant="destructive">
                                {allergy}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {selectedPrescription.notes && (
                      <div>
                        <Label>Notas</Label>
                        <p className="mt-1 p-3 bg-muted rounded-lg">
                          {selectedPrescription.notes}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="qr" className="space-y-4 mt-6">
                    <div className="text-center py-8">
                      <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Código QR</h3>
                      <p className="text-muted-foreground mb-4">
                        Escanear para verificar autenticidad
                      </p>
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {selectedPrescription.qrCode}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </Button>
                  <Button className="gap-2">
                    <Download className="w-4 h-4" />
                    Descargar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
