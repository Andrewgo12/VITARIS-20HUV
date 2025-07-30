import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  AlertTriangle,
  Monitor,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Zap,
  Brain,
  Users,
  Bed,
  Clock,
  Calendar,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Printer,
  Share,
  RefreshCw,
  Timer,
  Target,
  Gauge,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Shield,
  Stethoscope,
  Pill,
  TestTube,
  Camera,
  FileText,
  Ambulance,
  Siren,
  Radio,
  MapPin,
  Navigation,
  Power,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Maximize,
  Minimize,
  Move,
  RotateCcw,
  Save,
  Star,
  Flag,
  Info,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

interface ICUPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bedNumber: string;
  room: string;
  admissionDate: string;
  diagnosis: string[];
  severity: "critical" | "serious" | "stable";
  consciousness: "alert" | "drowsy" | "unconscious" | "sedated";
  ventilator: boolean;
  isolation: boolean;
  allergies: string[];
  vitalSigns: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    glasgowComa?: number;
    centralVenousPressure?: number;
    intracranialPressure?: number;
  };
  medications: string[];
  alerts: Alert[];
  lastUpdated: string;
  assignedNurse: string;
  attendingPhysician: string;
}

interface EmergencyCase {
  id: string;
  patientName: string;
  age: number;
  arrivalTime: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  chiefComplaint: string;
  symptoms: string[];
  vitalSigns: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    painScale: number;
  };
  status:
    | "waiting"
    | "in_treatment"
    | "observation"
    | "discharged"
    | "admitted"
    | "transferred";
  location: string;
  assignedDoctor: string;
  estimatedWaitTime: number;
  treatment: string[];
  notes: string;
}

interface Alert {
  id: string;
  type: "vital_signs" | "medication" | "equipment" | "nursing" | "medical";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolved: boolean;
}

interface EmergencyProtocol {
  id: string;
  code: string;
  name: string;
  description: string;
  steps: string[];
  team: string[];
  equipment: string[];
  medications: string[];
  timeLimit: number;
  active: boolean;
}

export default function ICUEmergencySystem() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [icuPatients, setIcuPatients] = useState<ICUPatient[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);
  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<ICUPatient | null>(
    null,
  );
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [activeProtocol, setActiveProtocol] =
    useState<EmergencyProtocol | null>(null);
  const [activeTab, setActiveTab] = useState("icu");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Critical Functions - Funciones críticas faltantes agregadas
  const handlePatientAdmission = (patientData: Partial<ICUPatient>) => {
    const newPatient: ICUPatient = {
      id: `ICU-${Date.now()}`,
      name: patientData.name || "Nuevo Paciente",
      age: patientData.age || 0,
      gender: patientData.gender || "No especificado",
      bedNumber: patientData.bedNumber || "TBD",
      room: patientData.room || "UCI-101",
      admissionDate: new Date().toISOString().split('T')[0],
      diagnosis: patientData.diagnosis || [],
      severity: patientData.severity || "stable",
      consciousness: patientData.consciousness || "alert",
      ventilator: patientData.ventilator || false,
      isolation: patientData.isolation || false,
      allergies: patientData.allergies || [],
      vitalSigns: patientData.vitalSigns || {
        heartRate: 80,
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 36.5,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        glasgowComa: 15,
      },
      medications: patientData.medications || [],
      alerts: patientData.alerts || [],
      lastUpdated: new Date().toISOString(),
      assignedNurse: "Enfermera Asignada",
      attendingPhysician: "Dr. Asignado",
    };
    setIcuPatients(prev => [...prev, newPatient]);
  };

  const handlePatientDischarge = (patientId: string) => {
    setIcuPatients(prev => prev.filter(p => p.id !== patientId));
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(null);
    }
  };

  const handleAlertAcknowledge = (alertId: string, userId: string = "current-user") => {
    setIcuPatients(prev =>
      prev.map(patient => ({
        ...patient,
        alerts: patient.alerts.map(alert =>
          alert.id === alertId
            ? { ...alert, acknowledged: true, acknowledgedBy: userId, acknowledgedAt: new Date().toISOString() }
            : alert
        ),
      }))
    );
  };

  const handleProtocolActivation = (protocolId: string) => {
    setEmergencyProtocols(prev =>
      prev.map(protocol =>
        protocol.id === protocolId
          ? { ...protocol, status: "active", activatedAt: new Date().toISOString() }
          : protocol
      )
    );
  };

  const updateVitalSigns = (patientId: string, newVitalSigns: Partial<ICUPatient['vitalSigns']>) => {
    setIcuPatients(prev =>
      prev.map(patient =>
        patient.id === patientId
          ? { ...patient, vitalSigns: { ...patient.vitalSigns, ...newVitalSigns } }
          : patient
      )
    );
  };

  // Mock data initialization
  useEffect(() => {
    const mockICUPatients: ICUPatient[] = [
      {
        id: "icu-001",
        name: "María González",
        age: 45,
        gender: "Femenino",
        bedNumber: "01",
        room: "UCI-A",
        admissionDate: "2024-01-15",
        diagnosis: ["Infarto Agudo de Miocardio", "Shock Cardiogénico"],
        severity: "critical",
        consciousness: "sedated",
        ventilator: true,
        isolation: false,
        allergies: ["Penicilina"],
        vitalSigns: {
          heartRate: 110,
          bloodPressure: { systolic: 90, diastolic: 60 },
          temperature: 37.8,
          oxygenSaturation: 94,
          respiratoryRate: 24,
          glasgowComa: 6,
          centralVenousPressure: 15,
          intracranialPressure: 12,
        },
        medications: ["Dobutamina", "Noradrenalina", "Heparina"],
        alerts: [
          {
            id: "alert-001",
            type: "vital_signs",
            severity: "high",
            message: "Presión arterial baja persistente",
            timestamp: new Date().toISOString(),
            acknowledged: false,
            resolved: false,
          },
        ],
        lastUpdated: new Date().toISOString(),
        assignedNurse: "Enf. Carmen López",
        attendingPhysician: "Dr. Roberto Silva",
      },
      {
        id: "icu-002",
        name: "Carlos Méndez",
        age: 62,
        gender: "Masculino",
        bedNumber: "03",
        room: "UCI-A",
        admissionDate: "2024-01-14",
        diagnosis: ["Neumonía Severa", "Insuficiencia Respiratoria"],
        severity: "serious",
        consciousness: "drowsy",
        ventilator: true,
        isolation: true,
        allergies: [],
        vitalSigns: {
          heartRate: 95,
          bloodPressure: { systolic: 125, diastolic: 80 },
          temperature: 38.5,
          oxygenSaturation: 92,
          respiratoryRate: 28,
          glasgowComa: 12,
        },
        medications: ["Antibióticos", "Corticoides", "Broncodilatadores"],
        alerts: [],
        lastUpdated: new Date().toISOString(),
        assignedNurse: "Enf. Luis Ramírez",
        attendingPhysician: "Dra. Ana Torres",
      },
    ];

    const mockEmergencyCases: EmergencyCase[] = [
      {
        id: "emr-001",
        patientName: "Juan Pérez",
        age: 35,
        arrivalTime: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        triageLevel: 2,
        chiefComplaint: "Dolor torácico severo",
        symptoms: ["Dolor torácico", "Disnea", "Sudoración", "Náuseas"],
        vitalSigns: {
          heartRate: 120,
          bloodPressure: { systolic: 160, diastolic: 100 },
          temperature: 37.2,
          oxygenSaturation: 96,
          respiratoryRate: 22,
          painScale: 8,
        },
        status: "in_treatment",
        location: "Box 1",
        assignedDoctor: "Dr. Elena Ruiz",
        estimatedWaitTime: 15,
        treatment: ["ECG", "Laboratorios", "Analgesia"],
        notes: "Sospecha de síndrome coronario agudo",
      },
      {
        id: "emr-002",
        patientName: "Laura Jiménez",
        age: 28,
        arrivalTime: new Date(Date.now() - 900000).toISOString(), // 15 min ago
        triageLevel: 3,
        chiefComplaint: "Cefalea intensa",
        symptoms: ["Cefalea", "Fotofobia", "Rigidez nucal"],
        vitalSigns: {
          heartRate: 88,
          bloodPressure: { systolic: 140, diastolic: 85 },
          temperature: 38.0,
          oxygenSaturation: 98,
          respiratoryRate: 18,
          painScale: 7,
        },
        status: "waiting",
        location: "Sala de Espera",
        assignedDoctor: "",
        estimatedWaitTime: 45,
        treatment: [],
        notes: "Evaluación neurológica pendiente",
      },
    ];

    const mockProtocols: EmergencyProtocol[] = [
      {
        id: "protocol-001",
        code: "CÓDIGO AZUL",
        name: "Paro Cardiorrespiratorio",
        description: "Protocolo para manejo de paro cardiorrespiratorio",
        steps: [
          "Verificar inconsciencia y ausencia de pulso",
          "Iniciar RCP de alta calidad",
          "Activar equipo de código azul",
          "Preparar desfibrilador",
          "Administrar medicamentos según protocolo ACLS",
        ],
        team: [
          "Médico líder",
          "Enfermera",
          "Técnico respiratorio",
          "Farmacéutico",
        ],
        equipment: ["Desfibrilador", "Carro de paro", "Ventilador", "Monitor"],
        medications: ["Epinefrina", "Amiodarona", "Atropina", "Bicarbonato"],
        timeLimit: 30,
        active: false,
      },
      {
        id: "protocol-002",
        code: "CÓDIGO ROJO",
        name: "Hemorragia Mayor",
        description: "Protocolo para control de hemorragia mayor",
        steps: [
          "Evaluar vía aérea y respiración",
          "Control inmediato de hemorragia",
          "Acceso vascular de gran calibre",
          "Reposición de volumen",
          "Activar banco de sangre",
        ],
        team: [
          "Cirujano",
          "Anestesiólogo",
          "Enfermera",
          "Técnico de laboratorio",
        ],
        equipment: [
          "Torniquetes",
          "Gasas hemostáticas",
          "Sueros",
          "Hemoderivados",
        ],
        medications: [
          "Ácido tranexámico",
          "Factor VII",
          "Cristaloides",
          "Coloides",
        ],
        timeLimit: 15,
        active: false,
      },
    ];

    setIcuPatients(mockICUPatients);
    setEmergencyCases(mockEmergencyCases);
    setProtocols(mockProtocols);
  }, []);

  // Real-time monitoring simulation
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setIcuPatients((prev) =>
        prev.map((patient) => ({
          ...patient,
          vitalSigns: {
            ...patient.vitalSigns,
            heartRate: Math.max(
              60,
              Math.min(
                180,
                patient.vitalSigns.heartRate + (Math.random() - 0.5) * 10,
              ),
            ),
            oxygenSaturation: Math.max(
              85,
              Math.min(
                100,
                patient.vitalSigns.oxygenSaturation + (Math.random() - 0.5) * 3,
              ),
            ),
            temperature: Math.max(
              35,
              Math.min(
                42,
                patient.vitalSigns.temperature + (Math.random() - 0.5) * 0.5,
              ),
            ),
          },
          lastUpdated: new Date().toISOString(),
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-500";
      case "serious":
        return "bg-red-100 text-red-800 border-red-500";
      case "stable":
        return "bg-green-100 text-green-800 border-green-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-red-100 text-red-800 border-red-500";
      case 2:
        return "bg-red-100 text-red-800 border-red-500";
      case 3:
        return "bg-slate-100 text-slate-800 border-slate-500";
      case 4:
        return "bg-green-100 text-green-800 border-green-500";
      case 5:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTriageLabel = (level: number) => {
    const labels = {
      1: "Resucitación",
      2: "Emergencia",
      3: "Urgencia",
      4: "Menos Urgente",
      5: "No Urgente",
    };
    return labels[level as keyof typeof labels] || "Desconocido";
  };

  const getVitalSignStatus = (value: number, parameter: string) => {
    switch (parameter) {
      case "heartRate":
        if (value < 60 || value > 100) return "abnormal";
        return "normal";
      case "temperature":
        if (value < 36 || value > 37.5) return "abnormal";
        return "normal";
      case "oxygenSaturation":
        if (value < 95) return "critical";
        if (value < 98) return "abnormal";
        return "normal";
      default:
        return "normal";
    }
  };

  const StatsCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "blue",
    onClick,
    isRealTime = false,
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    onClick?: () => void;
    isRealTime?: boolean;
  }) => (
    <Card
      className={cn(
        "card-modern cursor-pointer transition-all duration-300 hover:shadow-medium relative",
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
                  color === "slate" && "text-slate-500",
                  color === "purple" && "text-purple-500",
                )}
              />
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {isRealTime && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
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

  const ICUPatientCard = ({ patient }: { patient: ICUPatient }) => (
    <Card
      className={cn(
        "card-modern hover:shadow-medium transition-all duration-300 cursor-pointer",
        `border-l-4 ${getSeverityColor(patient.severity)}`,
      )}
      onClick={() => setSelectedPatient(patient)}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground truncate">
                  {patient.name}
                </h3>
                <div className="flex gap-2">
                  <Badge className={getSeverityColor(patient.severity)}>
                    {patient.severity}
                  </Badge>
                  {patient.ventilator && (
                    <Badge variant="outline" className="gap-1">
                      <Wind className="w-3 h-3" />
                      VM
                    </Badge>
                  )}
                  {patient.isolation && (
                    <Badge variant="destructive" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Aislamiento
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    {patient.room} - Cama {patient.bedNumber}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(patient.admissionDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  <span className="truncate">
                    {patient.diagnosis.join(", ")}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {patient.attendingPhysician}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    {patient.assignedNurse}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs Mini Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 flex-shrink-0">
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-red-600">
                {patient.vitalSigns.heartRate}
              </p>
              <p className="text-xs text-red-600">BPM</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <Droplets className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-green-600">
                {patient.vitalSigns.oxygenSaturation}%
              </p>
              <p className="text-xs text-green-600">SpO2</p>
            </div>
          </div>
        </div>

        {patient.alerts.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {patient.alerts.length} Alerta(s) Activa(s)
              </span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              {patient.alerts[0].message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Monitor className="w-4 h-4 mr-2" />
            Monitoreo
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <FileText className="w-4 h-4 mr-2" />
            Historia
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Pill className="w-4 h-4 mr-2" />
            Medicamentos
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmergencyCaseCard = ({
    emergencyCase,
  }: {
    emergencyCase: EmergencyCase;
  }) => (
    <Card
      className={cn(
        "card-modern hover:shadow-medium transition-all duration-300 cursor-pointer",
        `border-l-4 ${getTriageColor(emergencyCase.triageLevel)}`,
      )}
      onClick={() => setSelectedCase(emergencyCase)}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {emergencyCase.triageLevel}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground truncate">
                  {emergencyCase.patientName}
                </h3>
                <div className="flex gap-2">
                  <Badge className={getTriageColor(emergencyCase.triageLevel)}>
                    {getTriageLabel(emergencyCase.triageLevel)}
                  </Badge>
                  <Badge variant="outline">{emergencyCase.status}</Badge>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(emergencyCase.arrivalTime).toLocaleTimeString()}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {emergencyCase.location}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span className="truncate">
                    {emergencyCase.chiefComplaint}
                  </span>
                </div>
                {emergencyCase.assignedDoctor && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{emergencyCase.assignedDoctor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {emergencyCase.estimatedWaitTime}m
              </p>
              <p className="text-xs text-muted-foreground">Espera estimada</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-red-600">
                Dolor: {emergencyCase.vitalSigns.painScale}/10
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Eye className="w-4 h-4 mr-2" />
            Evaluar
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Stethoscope className="w-4 h-4 mr-2" />
            Triaje
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <FileText className="w-4 h-4 mr-2" />
            Historia
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProtocolCard = ({ protocol }: { protocol: EmergencyProtocol }) => (
    <Card
      className={cn(
        "card-modern cursor-pointer transition-all duration-300",
        protocol.active ? "border-red-500 bg-red-50" : "hover:shadow-medium",
      )}
      onClick={() => setActiveProtocol(protocol)}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm",
                protocol.active ? "bg-red-600" : "bg-gray-600",
              )}
            >
              <Siren className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">
                {protocol.code}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {protocol.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {protocol.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  <Timer className="w-3 h-3 mr-1" />
                  {protocol.timeLimit} min
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {protocol.team.length} miembros
                </Badge>
              </div>
            </div>
          </div>

          <Button
            variant={protocol.active ? "destructive" : "default"}
            size="sm"
            className="flex-shrink-0"
          >
            {protocol.active ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Desactivar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Activar
              </>
            )}
          </Button>
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
            userName="Dr. Emergenciólogo"
            userRole="Jefe UCI/Emergencias"
            notifications={
              icuPatients.reduce(
                (acc, p) =>
                  acc + p.alerts.filter((a) => !a.acknowledged).length,
                0,
              ) + emergencyCases.filter((c) => c.triageLevel <= 2).length
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
                UCI y Emergencias
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Centro de comando de cuidados críticos
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant={isMonitoring ? "destructive" : "default"}
              onClick={() => setIsMonitoring(!isMonitoring)}
              className="gap-2 text-sm"
            >
              {isMonitoring ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isMonitoring ? "Pausar" : "Iniciar"} Monitoreo
            </Button>
            <Button
              variant={alertsEnabled ? "default" : "outline"}
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className="gap-2 text-sm"
            >
              {alertsEnabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Alertas</span>
            </Button>
          </div>
        </div>

        {/* System Status */}
        <Card className="card-modern mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Sistema Operativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    {icuPatients.length} Pacientes UCI
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-red-500" />
                  <span className="text-sm">
                    {emergencyCases.length} Casos Emergencia
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">
                    {icuPatients.reduce(
                      (acc, p) =>
                        acc + p.alerts.filter((a) => !a.acknowledged).length,
                      0,
                    )}{" "}
                    Alertas Activas
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            icon={Bed}
            title="Camas UCI Ocupadas"
            value={icuPatients.length}
            subtitle="de 20 disponibles"
            color="blue"
            isRealTime={true}
          />
          <StatsCard
            icon={AlertTriangle}
            title="Pacientes Críticos"
            value={icuPatients.filter((p) => p.severity === "critical").length}
            subtitle="Requieren atención"
            color="red"
          />
          <StatsCard
            icon={Ambulance}
            title="Triaje 1-2"
            value={emergencyCases.filter((c) => c.triageLevel <= 2).length}
            subtitle="Alta prioridad"
            color="red"
          />
          <StatsCard
            icon={Clock}
            title="Tiempo Espera Promedio"
            value="35m"
            subtitle="Emergencias"
            color="slate"
          />
          <StatsCard
            icon={Wind}
            title="Ventiladores Activos"
            value={icuPatients.filter((p) => p.ventilator).length}
            subtitle="En uso"
            color="purple"
          />
          <StatsCard
            icon={Shield}
            title="Aislamiento"
            value={icuPatients.filter((p) => p.isolation).length}
            subtitle="Pacientes aislados"
            color="slate"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="icu" className="gap-2 text-xs sm:text-sm">
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">UCI</span>
              <span className="sm:hidden">UCI</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2 text-xs sm:text-sm">
              <Ambulance className="w-4 h-4" />
              <span className="hidden sm:inline">Emergencias</span>
              <span className="sm:hidden">ER</span>
            </TabsTrigger>
            <TabsTrigger value="protocols" className="gap-2 text-xs sm:text-sm">
              <Siren className="w-4 h-4" />
              <span className="hidden sm:inline">Protocolos</span>
              <span className="sm:hidden">Códigos</span>
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="gap-2 text-xs sm:text-sm hidden lg:flex"
            >
              <BarChart3 className="w-4 h-4" />
              Monitoreo
            </TabsTrigger>
          </TabsList>

          {/* UCI Tab */}
          <TabsContent value="icu" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar pacientes UCI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select
                  value={severityFilter}
                  onValueChange={setSeverityFilter}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                    <SelectItem value="serious">Serio</SelectItem>
                    <SelectItem value="stable">Estable</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nuevo Ingreso</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {icuPatients
                .filter(
                  (patient) =>
                    (severityFilter === "ALL" ||
                      patient.severity === severityFilter) &&
                    (searchTerm === "" ||
                      patient.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())),
                )
                .map((patient) => (
                  <ICUPatientCard key={patient.id} patient={patient} />
                ))}
            </div>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar casos emergencia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    <SelectItem value="Box 1">Box 1</SelectItem>
                    <SelectItem value="Box 2">Box 2</SelectItem>
                    <SelectItem value="Sala de Espera">Sala Espera</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nuevo Caso</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {emergencyCases
                .filter(
                  (emergencyCase) =>
                    (locationFilter === "ALL" ||
                      emergencyCase.location === locationFilter) &&
                    (searchTerm === "" ||
                      emergencyCase.patientName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())),
                )
                .sort((a, b) => a.triageLevel - b.triageLevel)
                .map((emergencyCase) => (
                  <EmergencyCaseCard
                    key={emergencyCase.id}
                    emergencyCase={emergencyCase}
                  />
                ))}
            </div>
          </TabsContent>

          {/* Protocols Tab */}
          <TabsContent value="protocols" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {protocols.map((protocol) => (
                <ProtocolCard key={protocol.id} protocol={protocol} />
              ))}
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-lg">Ocupación UCI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Ocupadas</span>
                      <span>{icuPatients.length}/20</span>
                    </div>
                    <Progress
                      value={(icuPatients.length / 20) * 100}
                      className="h-3"
                    />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round((icuPatients.length / 20) * 100)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Ocupación</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-lg">Triaje Emergencias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const count = emergencyCases.filter(
                        (c) => c.triageLevel === level,
                      ).length;
                      return (
                        <div
                          key={level}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Badge className={getTriageColor(level)}>
                              {level}
                            </Badge>
                            <span className="text-sm">
                              {getTriageLabel(level)}
                            </span>
                          </div>
                          <span className="font-bold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
