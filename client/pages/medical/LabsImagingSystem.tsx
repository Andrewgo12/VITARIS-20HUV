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
import { Progress } from "@/components/ui/progress";
import {
  TestTube,
  Camera,
  Search,
  Plus,
  ArrowLeft,
  Eye,
  Edit,
  Download,
  Printer,
  Share,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Microscope,
  FileImage,
  FileText,
  Zap,
  Brain,
  Heart,
  Bone,
  Droplets,
  Activity,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Save,
  X,
  Check,
  Loader2,
  Star,
  Flag,
  Timer,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Gauge,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff,
  Upload,
  Image,
  Video,
  FileVideo,
  Maximize,
  Minimize,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Ruler,
  Palette,
  Settings,
  Info,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

interface LabTest {
  id: string;
  name: string;
  category:
    | "hematology"
    | "chemistry"
    | "microbiology"
    | "immunology"
    | "pathology";
  code: string;
  normalRange: string;
  unit: string;
  preparationRequired: boolean;
  fastingRequired: boolean;
  turnaroundTime: string;
  cost: number;
  priority: "routine" | "urgent" | "stat";
}

interface ImagingStudy {
  id: string;
  name: string;
  modality: "xray" | "ct" | "mri" | "ultrasound" | "nuclear" | "pet";
  bodyPart: string;
  contrast: boolean;
  preparationRequired: boolean;
  duration: string;
  cost: number;
  radiationExposure?: string;
}

interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  orderDate: string;
  scheduledDate?: string;
  tests: LabTest[];
  priority: "routine" | "urgent" | "stat";
  status:
    | "ordered"
    | "collected"
    | "processing"
    | "completed"
    | "reported"
    | "cancelled";
  clinicalInfo: string;
  diagnosis: string[];
  fasting: boolean;
  results?: LabResult[];
  notes: string;
  totalCost: number;
}

interface ImagingOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  orderDate: string;
  scheduledDate?: string;
  study: ImagingStudy;
  priority: "routine" | "urgent" | "stat";
  status:
    | "ordered"
    | "scheduled"
    | "in_progress"
    | "completed"
    | "reported"
    | "cancelled";
  clinicalInfo: string;
  indication: string;
  contrast: boolean;
  images?: ImageFile[];
  report?: ImagingReport;
  notes: string;
  totalCost: number;
}

interface LabResult {
  testId: string;
  testName: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "abnormal" | "critical";
  flag: "low" | "high" | "critical_low" | "critical_high" | "normal";
  comments?: string;
}

interface ImageFile {
  id: string;
  filename: string;
  thumbnail: string;
  fullSize: string;
  series: string;
  sliceNumber?: number;
  annotations?: Annotation[];
}

interface Annotation {
  id: string;
  type: "measurement" | "arrow" | "text" | "circle" | "rectangle";
  coordinates: { x: number; y: number; width?: number; height?: number };
  text?: string;
  measurement?: { value: number; unit: string };
}

interface ImagingReport {
  id: string;
  findings: string;
  impression: string;
  recommendations: string;
  radiologist: string;
  reportDate: string;
  status: "draft" | "preliminary" | "final";
}

export default function LabsImagingSystem() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [imagingOrders, setImagingOrders] = useState<ImagingOrder[]>([]);
  const [availableTests, setAvailableTests] = useState<LabTest[]>([]);
  const [availableStudies, setAvailableStudies] = useState<ImagingStudy[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<
    LabOrder | ImagingOrder | null
  >(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockLabTests: LabTest[] = [
      {
        id: "test-001",
        name: "Hemograma Completo",
        category: "hematology",
        code: "CBC",
        normalRange: "Ver rangos específicos",
        unit: "varies",
        preparationRequired: false,
        fastingRequired: false,
        turnaroundTime: "2-4 horas",
        cost: 25000,
        priority: "routine",
      },
      {
        id: "test-002",
        name: "Glucosa en Ayunas",
        category: "chemistry",
        code: "GLU",
        normalRange: "70-100 mg/dL",
        unit: "mg/dL",
        preparationRequired: true,
        fastingRequired: true,
        turnaroundTime: "1-2 horas",
        cost: 15000,
        priority: "routine",
      },
      {
        id: "test-003",
        name: "Troponina T",
        category: "chemistry",
        code: "TROP",
        normalRange: "<0.04 ng/mL",
        unit: "ng/mL",
        preparationRequired: false,
        fastingRequired: false,
        turnaroundTime: "30 minutos",
        cost: 45000,
        priority: "stat",
      },
    ];

    const mockImagingStudies: ImagingStudy[] = [
      {
        id: "study-001",
        name: "Radiografía de Tórax",
        modality: "xray",
        bodyPart: "Tórax",
        contrast: false,
        preparationRequired: false,
        duration: "15 minutos",
        cost: 35000,
        radiationExposure: "0.1 mSv",
      },
      {
        id: "study-002",
        name: "TAC de Abdomen con Contraste",
        modality: "ct",
        bodyPart: "Abdomen",
        contrast: true,
        preparationRequired: true,
        duration: "45 minutos",
        cost: 180000,
        radiationExposure: "7-10 mSv",
      },
      {
        id: "study-003",
        name: "Resonancia Magnética Cerebral",
        modality: "mri",
        bodyPart: "Cerebro",
        contrast: false,
        preparationRequired: true,
        duration: "60 minutos",
        cost: 350000,
      },
    ];

    const mockLabOrders: LabOrder[] = [
      {
        id: "lab-001",
        patientId: "pat-001",
        patientName: "María González",
        patientAge: 45,
        doctorId: "doc-001",
        doctorName: "Dr. Ana López",
        orderDate: "2024-01-15",
        scheduledDate: "2024-01-16",
        tests: [mockLabTests[0], mockLabTests[1]],
        priority: "routine",
        status: "completed",
        clinicalInfo: "Control de diabetes y anemia",
        diagnosis: ["Diabetes Mellitus Tipo 2", "Anemia Ferropénica"],
        fasting: true,
        results: [
          {
            testId: "test-001",
            testName: "Hemoglobina",
            value: "10.2",
            unit: "g/dL",
            normalRange: "12.0-15.5",
            status: "abnormal",
            flag: "low",
            comments: "Anemia leve",
          },
          {
            testId: "test-002",
            testName: "Glucosa",
            value: "145",
            unit: "mg/dL",
            normalRange: "70-100",
            status: "abnormal",
            flag: "high",
            comments: "Hiperglucemia",
          },
        ],
        notes: "Paciente en ayunas de 12 horas",
        totalCost: 40000,
      },
    ];

    const mockImagingOrders: ImagingOrder[] = [
      {
        id: "img-001",
        patientId: "pat-002",
        patientName: "Carlos Méndez",
        patientAge: 62,
        doctorId: "doc-002",
        doctorName: "Dr. Luis Torres",
        orderDate: "2024-01-15",
        scheduledDate: "2024-01-16",
        study: mockImagingStudies[1],
        priority: "urgent",
        status: "completed",
        clinicalInfo: "Dolor abdominal agudo",
        indication: "Descartar apendicitis aguda",
        contrast: true,
        images: [
          {
            id: "img-file-001",
            filename: "TAC_Abdomen_001.dcm",
            thumbnail: "/images/tac-thumb.jpg",
            fullSize: "/images/tac-full.jpg",
            series: "Serie 1",
            sliceNumber: 15,
          },
        ],
        report: {
          id: "report-001",
          findings:
            "Apéndice cecal engrosado con signos inflamatorios periapendiculares",
          impression: "Apendicitis aguda",
          recommendations: "Cirugía urgente. Antibióticos preoperatorios.",
          radiologist: "Dr. Patricia Morales",
          reportDate: "2024-01-16",
          status: "final",
        },
        notes: "Contraste IV administrado sin complicaciones",
        totalCost: 180000,
      },
    ];

    setAvailableTests(mockLabTests);
    setAvailableStudies(mockImagingStudies);
    setLabOrders(mockLabOrders);
    setImagingOrders(mockImagingOrders);
  }, []);

  const allOrders = [...labOrders, ...imagingOrders];

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ("tests" in order
        ? order.tests.some((test) =>
            test.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : order.study.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || order.priority === priorityFilter;
    const matchesType =
      typeFilter === "ALL" ||
      (typeFilter === "lab" && "tests" in order) ||
      (typeFilter === "imaging" && "study" in order);

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "collected":
      case "scheduled":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "processing":
      case "in_progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "reported":
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
        return "bg-orange-100 text-orange-800 border-orange-500";
      case "routine":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getResultColor = (flag: string) => {
    switch (flag) {
      case "critical_high":
      case "critical_low":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
      case "low":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "normal":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case "xray":
        return Bone;
      case "ct":
        return Brain;
      case "mri":
        return Brain;
      case "ultrasound":
        return Heart;
      case "nuclear":
      case "pet":
        return Zap;
      default:
        return Camera;
    }
  };

  const StatsCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "blue",
    onClick,
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    onClick?: () => void;
  }) => (
    <Card
      className={cn(
        "card-modern cursor-pointer transition-all duration-300 hover:shadow-medium",
        onClick && "hover:border-primary/50",
      )}
      onClick={onClick}
    >
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
                  color === "amber" && "text-amber-500",
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

  const OrderCard = ({ order }: { order: LabOrder | ImagingOrder }) => (
    <Card
      className="card-modern hover:shadow-medium transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedOrder(order)}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white">
              {"tests" in order ? (
                <TestTube className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground truncate">
                  {order.patientName}
                </h3>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {order.doctorName}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {"tests" in order ? (
                    <>
                      <TestTube className="w-3 h-3" />
                      <span>{order.tests.length} exámenes</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3 h-3" />
                      <span>{order.study.name}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span className="truncate">{order.clinicalInfo}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end gap-2">
            <span className="text-lg font-bold text-foreground">
              ${order.totalCost.toLocaleString()}
            </span>
            {order.scheduledDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(order.scheduledDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Eye className="w-4 h-4 mr-2" />
            Ver Resultados
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ImageViewer = ({ image }: { image: ImageFile }) => (
    <Dialog open={showImageViewer} onOpenChange={setShowImageViewer}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0">
        <div className="relative w-full h-[80vh] bg-black">
          {/* Image Viewer Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{image.filename}</h3>
                <p className="text-sm text-gray-300">
                  {image.series} - Corte {image.sliceNumber}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Ruler className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowImageViewer(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Image Area */}
          <div className="w-full h-full flex items-center justify-center pt-16">
            <div className="relative">
              <img
                src={image.fullSize}
                alt={image.filename}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              {/* Annotations would be rendered here */}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Move className="w-4 h-4 mr-2" />
                Mover
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Target className="w-4 h-4 mr-2" />
                Medir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <NavigationImproved
            userName="Dr. Especialista"
            userRole="Médico Laboratorista"
            notifications={
              filteredOrders.filter(
                (o) => o.status === "processing" || o.status === "in_progress",
              ).length
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
                Laboratorio e Imágenes
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Sistema integral de diagnóstico
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" className="gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
            <Button className="gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Nueva Orden
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            icon={TestTube}
            title="Labs Pendientes"
            value={labOrders.filter((o) => o.status === "processing").length}
            subtitle="En proceso"
            color="blue"
          />
          <StatsCard
            icon={Camera}
            title="Imágenes Pendientes"
            value={
              imagingOrders.filter((o) => o.status === "in_progress").length
            }
            subtitle="En progreso"
            color="purple"
          />
          <StatsCard
            icon={CheckCircle}
            title="Completados Hoy"
            value={allOrders.filter((o) => o.status === "completed").length}
            subtitle="Listos para reporte"
            color="green"
          />
          <StatsCard
            icon={Clock}
            title="Tiempo Promedio"
            value="2.5h"
            subtitle="Labs rutina"
            color="amber"
          />
          <StatsCard
            icon={AlertTriangle}
            title="Críticos"
            value={
              labOrders.filter((o) =>
                o.results?.some((r) => r.flag.includes("critical")),
              ).length
            }
            subtitle="Requieren atención"
            color="red"
          />
          <StatsCard
            icon={Microscope}
            title="Total Órdenes"
            value={allOrders.length}
            subtitle="Este mes"
            color="blue"
          />
        </div>

        {/* Filters */}
        <Card className="card-modern mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full lg:w-auto">
                <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar órdenes..."
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
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="lab">Laboratorio</SelectItem>
                    <SelectItem value="imaging">Imágenes</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="ordered">Ordenado</SelectItem>
                    <SelectItem value="processing">Procesando</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="reported">Reportado</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    <SelectItem value="routine">Rutina</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Card className="card-modern">
            <CardContent className="p-8 sm:p-12 text-center">
              <TestTube className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                No se encontraron órdenes
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm ||
                statusFilter !== "ALL" ||
                priorityFilter !== "ALL"
                  ? "Intente ajustar los filtros de búsqueda"
                  : "No hay órdenes de laboratorio o imágenes"}
              </p>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Nueva Orden
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <Dialog
            open={!!selectedOrder}
            onOpenChange={() => setSelectedOrder(null)}
          >
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
              <div className="p-4 sm:p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      {"tests" in selectedOrder ? (
                        <TestTube className="w-5 h-5" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                      {selectedOrder.patientName} -{" "}
                      {"tests" in selectedOrder ? "Laboratorio" : "Imagen"}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                      <Badge
                        className={getPriorityColor(selectedOrder.priority)}
                      >
                        {selectedOrder.priority}
                      </Badge>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <Tabs
                  defaultValue={"tests" in selectedOrder ? "results" : "images"}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4">
                    <TabsTrigger
                      value={"tests" in selectedOrder ? "results" : "images"}
                      className="text-xs sm:text-sm"
                    >
                      {"tests" in selectedOrder ? "Resultados" : "Imágenes"}
                    </TabsTrigger>
                    <TabsTrigger value="details" className="text-xs sm:text-sm">
                      Detalles
                    </TabsTrigger>
                    <TabsTrigger value="report" className="text-xs sm:text-sm">
                      Reporte
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="text-xs sm:text-sm hidden sm:inline-flex"
                    >
                      Historial
                    </TabsTrigger>
                  </TabsList>

                  {/* Lab Results Tab */}
                  {"tests" in selectedOrder && (
                    <TabsContent value="results" className="space-y-4 mt-6">
                      {selectedOrder.results ? (
                        selectedOrder.results.map((result, index) => (
                          <Card
                            key={index}
                            className={cn(
                              "border-l-4",
                              getResultColor(result.flag),
                            )}
                          >
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground mb-2">
                                    {result.testName}
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                    <div>
                                      <Label className="text-muted-foreground">
                                        Resultado
                                      </Label>
                                      <p className="font-bold text-lg">
                                        {result.value} {result.unit}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">
                                        Rango Normal
                                      </Label>
                                      <p className="font-medium">
                                        {result.normalRange}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">
                                        Estado
                                      </Label>
                                      <Badge
                                        className={getResultColor(result.flag)}
                                      >
                                        {result.flag}
                                      </Badge>
                                    </div>
                                  </div>
                                  {result.comments && (
                                    <div className="mt-3">
                                      <Label className="text-muted-foreground">
                                        Comentarios
                                      </Label>
                                      <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                                        {result.comments}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <TestTube className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Resultados pendientes
                          </h3>
                          <p className="text-muted-foreground">
                            Los resultados estarán disponibles pronto
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  )}

                  {/* Imaging Tab */}
                  {"study" in selectedOrder && (
                    <TabsContent value="images" className="space-y-4 mt-6">
                      {selectedOrder.images &&
                      selectedOrder.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {selectedOrder.images.map((image) => (
                            <Card
                              key={image.id}
                              className="card-modern cursor-pointer group"
                              onClick={() => {
                                setSelectedImage(image);
                                setShowImageViewer(true);
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                  <img
                                    src={image.thumbnail}
                                    alt={image.filename}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder.svg";
                                    }}
                                  />
                                </div>
                                <h4 className="font-medium text-sm truncate">
                                  {image.series}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Corte {image.sliceNumber}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Imágenes no disponibles
                          </h3>
                          <p className="text-muted-foreground">
                            Las imágenes se cargarán cuando el estudio esté
                            completo
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  )}

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Paciente</Label>
                        <p className="font-medium">
                          {selectedOrder.patientName}
                        </p>
                      </div>
                      <div>
                        <Label>Edad</Label>
                        <p className="font-medium">
                          {selectedOrder.patientAge} años
                        </p>
                      </div>
                      <div>
                        <Label>Médico Solicitante</Label>
                        <p className="font-medium">
                          {selectedOrder.doctorName}
                        </p>
                      </div>
                      <div>
                        <Label>Fecha de Orden</Label>
                        <p className="font-medium">
                          {new Date(
                            selectedOrder.orderDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedOrder.scheduledDate && (
                        <div>
                          <Label>Fecha Programada</Label>
                          <p className="font-medium">
                            {new Date(
                              selectedOrder.scheduledDate,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <Label>Costo Total</Label>
                        <p className="font-medium">
                          ${selectedOrder.totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>Información Clínica</Label>
                      <p className="mt-1 p-3 bg-muted rounded-lg">
                        {selectedOrder.clinicalInfo}
                      </p>
                    </div>

                    {"tests" in selectedOrder ? (
                      <div>
                        <Label>Exámenes Solicitados</Label>
                        <div className="space-y-2 mt-2">
                          {selectedOrder.tests.map((test, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{test.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {test.code}
                                </p>
                              </div>
                              <Badge variant="outline">
                                ${test.cost.toLocaleString()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label>Estudio Solicitado</Label>
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {selectedOrder.study.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedOrder.study.modality.toUpperCase()} -{" "}
                                {selectedOrder.study.bodyPart}
                              </p>
                              {selectedOrder.study.radiationExposure && (
                                <p className="text-xs text-amber-600">
                                  Exposición:{" "}
                                  {selectedOrder.study.radiationExposure}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline">
                              ${selectedOrder.study.cost.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedOrder.notes && (
                      <div>
                        <Label>Notas</Label>
                        <p className="mt-1 p-3 bg-muted rounded-lg">
                          {selectedOrder.notes}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Report Tab */}
                  <TabsContent value="report" className="space-y-4 mt-6">
                    {"report" in selectedOrder && selectedOrder.report ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Radiólogo</Label>
                            <p className="font-medium">
                              {selectedOrder.report.radiologist}
                            </p>
                          </div>
                          <div>
                            <Label>Fecha del Reporte</Label>
                            <p className="font-medium">
                              {new Date(
                                selectedOrder.report.reportDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label>Hallazgos</Label>
                          <p className="mt-1 p-3 bg-muted rounded-lg">
                            {selectedOrder.report.findings}
                          </p>
                        </div>

                        <div>
                          <Label>Impresión Diagnóstica</Label>
                          <p className="mt-1 p-3 bg-blue-50 rounded-lg text-blue-800">
                            {selectedOrder.report.impression}
                          </p>
                        </div>

                        <div>
                          <Label>Recomendaciones</Label>
                          <p className="mt-1 p-3 bg-green-50 rounded-lg text-green-800">
                            {selectedOrder.report.recommendations}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              selectedOrder.report.status === "final"
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-100 text-slate-800"
                            }
                          >
                            {selectedOrder.report.status === "final"
                              ? "Reporte Final"
                              : "Reporte Preliminar"}
                          </Badge>
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">
                            Firmado electrónicamente
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Reporte no disponible
                        </h3>
                        <p className="text-muted-foreground">
                          El reporte será generado cuando el estudio esté
                          completo
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* History Tab */}
                  <TabsContent value="history" className="space-y-4 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Orden creada</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(selectedOrder.orderDate).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {selectedOrder.scheduledDate && (
                        <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Programado</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                selectedOrder.scheduledDate,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedOrder.status === "completed" && (
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Completado</p>
                            <p className="text-sm text-muted-foreground">
                              Resultados disponibles
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" className="gap-2">
                    <Share className="w-4 h-4" />
                    Compartir
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

        {/* Image Viewer */}
        {selectedImage && <ImageViewer image={selectedImage} />}
      </div>
    </div>
  );
}
