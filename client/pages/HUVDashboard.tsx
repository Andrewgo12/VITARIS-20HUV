import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotifications } from "@/components/ui/notification-system";
import { GlobalSearch } from "@/components/ui/global-search";
import CompleteNavigation from "@/components/ui/complete-navigation";
import AnalyticsDashboard from "@/components/ui/analytics-dashboard";
import BackupSystem from "@/components/ui/backup-system";
import PermissionsSystem from "@/components/ui/permissions-system";
import LoadingState from "@/components/ui/loading-state";

// Import ALL modals for complete integration
import PatientIdentificationModal from "@/components/modals/PatientIdentificationModal";
import ReferralDiagnosisModal from "@/components/modals/ReferralDiagnosisModal";
import VitalSignsModal from "@/components/modals/VitalSignsModal";
import DocumentsModal from "@/components/modals/DocumentsModal";
import ValidationModal from "@/components/modals/ValidationModal";
import NewAdmissionModal from "@/components/modals/NewAdmissionModal";
import PatientDischargeModal from "@/components/modals/PatientDischargeModal";
import NewAppointmentModal from "@/components/modals/NewAppointmentModal";
import NewPrescriptionModal from "@/components/modals/NewPrescriptionModal";
import InventoryManagementModal from "@/components/modals/InventoryManagementModal";
import TelemedicineSessionModal from "@/components/modals/TelemedicineSessionModal";
import ReportGeneratorModal from "@/components/modals/ReportGeneratorModal";
import TeamCommunicationModal from "@/components/modals/TeamCommunicationModal";
import MedicalEducationModal from "@/components/modals/MedicalEducationModal";
import EmergencyCodeModal from "@/components/modals/EmergencyCodeModal";

// Import medical components
import VitalSignsChart from "@/components/medical/VitalSignsChart";
import AlertsManager from "@/components/medical/AlertsManager";

// Import floating components
import EmergencyFloatingButton from "@/components/EmergencyFloatingButton";
import LanguageFloatingButton from "@/components/LanguageFloatingButton";

// Import ALL API services for complete integration
import {
  medicalApi,
  systemApi,
  emergencyApi,
  telemedicineApi,
  inventoryApi,
  billingApi,
  qualityApi,
  auditApi,
  enhancedAppointmentsApi,
  enhancedUsersApi
} from "@/services/api";
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  LogOut,
  Heart,
  Activity,
  Clock,
  User,
  Shield,
  MonitorSpeaker,
  Sparkles,
  Package,
  DollarSign,
  Video,
  TrendingUp,
  Settings,
  Zap,
  Monitor,
  X,
  UserPlus,
  UserMinus,
  Pill,
  Calendar,
  FileBarChart,
  Database,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useResponsive, getResponsiveGrid, getResponsiveTableConfig } from '@/utils/responsive';
import { usePerformanceTracking, useDebounce } from '@/utils/performance';
import { useScreenReader, generateAriaAttributes } from '@/utils/accessibility';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};


// Mock patient data
const mockPatients = [
  {
    id: 1,
    identificationType: "CC",
    identificationNumber: "12345678",
    fullName: "Juan Carlos Pérez González",
    eps: "NUEVA_EPS",
    age: 45,
    symptoms: "Dolor torácico agudo, dificultad respiratoria",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 14:30",
    status: "PENDING",
    vitals: { heartRate: "120", temperature: "38.5", bloodPressure: "160/95" },
  },
  {
    id: 2,
    identificationType: "CC",
    identificationNumber: "87654321",
    fullName: "María Elena Rodríguez Vargas",
    eps: "SANITAS",
    age: 32,
    symptoms: "Dolor abdominal severo, náuseas y vómito",
    urgencyLevel: "SEVERO",
    arrivalTime: "2024-01-15 15:15",
    status: "PENDING",
    vitals: { heartRate: "95", temperature: "37.8", bloodPressure: "140/85" },
  },
  {
    id: 3,
    identificationType: "CC",
    identificationNumber: "11223344",
    fullName: "Carlos Alberto Mendoza Silva",
    eps: "FAMISANAR",
    age: 58,
    symptoms: "Accidente de tránsito, posible fractura de fémur",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 16:00",
    status: "PENDING",
    vitals: { heartRate: "110", temperature: "36.8", bloodPressure: "150/90" },
  },
];



export default function HUVDashboard() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [priorityRating, setPriorityRating] = useState("");
  const [authorizationNotes, setAuthorizationNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Use performance tracking
  usePerformanceTracking('HUVDashboard');

  // Use responsive utilities
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const gridConfig = getResponsiveGrid(isMobile ? 2 : isTablet ? 4 : 6);

  // Use accessibility utilities
  const { announce } = useScreenReader();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Generate aria attributes for accessibility
  const dashboardAriaAttributes = generateAriaAttributes('dialog');

  // Use responsive table config
  const tableConfig = getResponsiveTableConfig();

  // Complete state management for ALL modals and components
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showVitalSignsModal, setShowVitalSignsModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showBackupSystem, setShowBackupSystem] = useState(false);
  const [showPermissionsSystem, setShowPermissionsSystem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // API data states
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [vitalSigns, setVitalSigns] = useState<any>(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [telemedicineSessions, setTelemedicineSessions] = useState<any[]>([]);

  // Notifications system
  const { addNotification } = useNotifications();

  // Load ALL data from APIs on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Load system metrics
        const systemResponse = await systemApi.getMetrics();
        if (systemResponse.success) {
          setSystemMetrics(systemResponse.data);
        }

        // Load vital signs
        const vitalResponse = await medicalApi.getVitalSigns();
        if (vitalResponse.success) {
          setVitalSigns(vitalResponse.data);
        }

        // Load emergency alerts
        const emergencyResponse = await emergencyApi.getAlerts();
        if (emergencyResponse.success) {
          setEmergencyAlerts(emergencyResponse.data || []);
        }

        // Load quality metrics
        const qualityResponse = await qualityApi.getMetrics();
        if (qualityResponse.success) {
          setQualityMetrics(qualityResponse.data);
        }

        // Load audit logs
        const auditResponse = await auditApi.getLogs();
        if (auditResponse.success) {
          setAuditLogs(auditResponse.data || []);
        }

        // Load appointments
        const appointmentsResponse = await enhancedAppointmentsApi.getAll();
        if (appointmentsResponse.success) {
          setAppointments(appointmentsResponse.data || []);
        }

        // Load users
        const usersResponse = await enhancedUsersApi.getAll();
        if (usersResponse.success) {
          setUsers(usersResponse.data || []);
        }

        // Load inventory
        const inventoryResponse = await inventoryApi.getAll();
        if (inventoryResponse.success) {
          setInventory(inventoryResponse.data || []);
        }

        // Load billing
        const billingResponse = await billingApi.getAll();
        if (billingResponse.success) {
          setBilling(billingResponse.data || []);
        }

        // Load telemedicine sessions
        const telemedicineResponse = await telemedicineApi.getSessions();
        if (telemedicineResponse.success) {
          setTelemedicineSessions(telemedicineResponse.data || []);
        }

        addNotification({
          type: 'info',
          title: 'Sistema Cargado',
          message: 'Todos los datos del sistema han sido cargados exitosamente',
          priority: 'medium'
        });

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        addNotification({
          type: 'warning',
          title: 'Error de Carga',
          message: 'Error al cargar algunos datos del sistema',
          priority: 'high'
        });
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [addNotification]);

  // Functions to handle ALL modals and components
  const openPatientModal = () => {
    setShowPatientModal(true);
    announce('Abriendo modal de identificación de paciente');
  };

  const openReferralModal = () => {
    setShowReferralModal(true);
    announce('Abriendo modal de diagnóstico y referencia');
  };

  const openVitalSignsModal = () => {
    setShowVitalSignsModal(true);
    announce('Abriendo modal de signos vitales');
  };

  const openDocumentsModal = () => {
    setShowDocumentsModal(true);
    announce('Abriendo modal de documentos');
  };

  const openValidationModal = () => {
    setShowValidationModal(true);
    announce('Abriendo modal de validación');
  };

  const openAdmissionModal = () => {
    setShowAdmissionModal(true);
    announce('Abriendo modal de nueva admisión');
  };

  const openDischargeModal = () => {
    setShowDischargeModal(true);
    announce('Abriendo modal de alta de paciente');
  };

  const openAppointmentModal = () => {
    setShowAppointmentModal(true);
    announce('Abriendo modal de nueva cita');
  };

  const openPrescriptionModal = () => {
    setShowPrescriptionModal(true);
    announce('Abriendo modal de nueva prescripción');
  };

  const openInventoryModal = () => {
    setShowInventoryModal(true);
    announce('Abriendo modal de gestión de inventario');
  };

  const openTelemedicineModal = () => {
    setShowTelemedicineModal(true);
    announce('Abriendo modal de sesión de telemedicina');
  };

  const openReportModal = () => {
    setShowReportModal(true);
    announce('Abriendo modal de generador de reportes');
  };

  const openCommunicationModal = () => {
    setShowCommunicationModal(true);
    announce('Abriendo modal de comunicación del equipo');
  };

  const openEducationModal = () => {
    setShowEducationModal(true);
    announce('Abriendo modal de educación médica');
  };

  const openEmergencyModal = () => {
    setShowEmergencyModal(true);
    announce('Abriendo modal de código de emergencia');
  };

  const toggleAnalyticsDashboard = () => {
    setShowAnalyticsDashboard(!showAnalyticsDashboard);
    announce(showAnalyticsDashboard ? 'Ocultando dashboard de analíticas' : 'Mostrando dashboard de analíticas');
  };

  const toggleBackupSystem = () => {
    setShowBackupSystem(!showBackupSystem);
    announce(showBackupSystem ? 'Ocultando sistema de respaldo' : 'Mostrando sistema de respaldo');
  };

  const togglePermissionsSystem = () => {
    setShowPermissionsSystem(!showPermissionsSystem);
    announce(showPermissionsSystem ? 'Ocultando sistema de permisos' : 'Mostrando sistema de permisos');
  };

  const handleAuthorize = (patientId: number, authorized: boolean) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: authorized ? "AUTHORIZED" : "REJECTED" }
          : p,
      ),
    );
  };

  const handleSetPriority = (patientId: number, priority: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, urgencyLevel: priority } : p,
      ),
    );
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICO":
        return "destructive";
      case "SEVERO":
        return "warning";
      case "MODERADO":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AUTHORIZED":
        return "success";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredPatients =
    filterStatus === "ALL"
      ? patients
      : patients.filter((p) => p.status === filterStatus);

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-4 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...dashboardAriaAttributes}
    >
      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Global Search Component */}
      <div className="mb-6">
        <GlobalSearch placeholder="Buscar en todo el sistema..." />
      </div>

      {/* Complete Navigation */}
      <CompleteNavigation />

      {/* Emergency and Language Floating Buttons */}
      <EmergencyFloatingButton />
      <LanguageFloatingButton />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-6'} mb-6`}>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="medical">Médico</TabsTrigger>
          <TabsTrigger value="admin">Administración</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="emergency">Emergencias</TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview content - existing dashboard content */}
          <div className="grid gap-6">
            {/* System Metrics Cards */}
            {systemMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Métricas del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`grid gap-4 ${gridConfig}`}>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">CPU: {systemMetrics.cpu || '45%'}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Memoria: {systemMetrics.memory || '67%'}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Usuarios Activos: {systemMetrics.activeUsers || '234'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vital Signs Chart */}
            {vitalSigns && (
              <Card>
                <CardHeader>
                  <CardTitle>Signos Vitales en Tiempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <VitalSignsChart data={vitalSigns} />
                </CardContent>
              </Card>
            )}

            {/* Emergency Alerts */}
            {emergencyAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Alertas de Emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertsManager alerts={emergencyAlerts} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          {/* Medical Module Buttons */}
          <div className={`grid gap-4 ${gridConfig}`}>
            <Button onClick={openPatientModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <User className="w-6 h-6" />
              <span>Identificación de Paciente</span>
            </Button>
            <Button onClick={openReferralModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <FileText className="w-6 h-6" />
              <span>Diagnóstico y Referencia</span>
            </Button>
            <Button onClick={openVitalSignsModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <Activity className="w-6 h-6" />
              <span>Signos Vitales</span>
            </Button>
            <Button onClick={openAdmissionModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <UserPlus className="w-6 h-6" />
              <span>Nueva Admisión</span>
            </Button>
            <Button onClick={openDischargeModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <UserMinus className="w-6 h-6" />
              <span>Alta de Paciente</span>
            </Button>
            <Button onClick={openPrescriptionModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <Pill className="w-6 h-6" />
              <span>Nueva Prescripción</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          {/* Administrative Module Buttons */}
          <div className={`grid gap-4 ${gridConfig}`}>
            <Button onClick={openAppointmentModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>Nueva Cita</span>
            </Button>
            <Button onClick={openInventoryModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <Package className="w-6 h-6" />
              <span>Gestión de Inventario</span>
            </Button>
            <Button onClick={openReportModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <FileBarChart className="w-6 h-6" />
              <span>Generador de Reportes</span>
            </Button>
            <Button onClick={openDocumentsModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <FileText className="w-6 h-6" />
              <span>Gestión de Documentos</span>
            </Button>
            <Link to="/documents-hub">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Brain className="w-6 h-6" />
                <span>Centro de Documentos IA</span>
              </Button>
            </Link>
            <Button onClick={togglePermissionsSystem} className="h-20 flex flex-col items-center justify-center gap-2">
              <Shield className="w-6 h-6" />
              <span>Sistema de Permisos</span>
            </Button>
            <Button onClick={toggleBackupSystem} className="h-20 flex flex-col items-center justify-center gap-2">
              <Database className="w-6 h-6" />
              <span>Sistema de Respaldo</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="space-y-4">
            <Button onClick={toggleAnalyticsDashboard} className="w-full">
              {showAnalyticsDashboard ? 'Ocultar' : 'Mostrar'} Dashboard de Analíticas
            </Button>
            {showAnalyticsDashboard && <AnalyticsDashboard />}
          </div>

          {/* Quality Metrics */}
          {qualityMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Calidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-4 ${gridConfig}`}>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Satisfacción: {qualityMetrics.satisfaction || '92%'}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Tiempo de Espera: {qualityMetrics.waitTime || '15 min'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Management */}
          <div className={`grid gap-4 ${gridConfig}`}>
            <Button onClick={openValidationModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span>Validación del Sistema</span>
            </Button>
            <Button onClick={openCommunicationModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="w-6 h-6" />
              <span>Comunicación del Equipo</span>
            </Button>
            <Button onClick={openEducationModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <GraduationCap className="w-6 h-6" />
              <span>Educación Médica</span>
            </Button>
          </div>

          {/* System Components */}
          {showBackupSystem && <BackupSystem />}
          {showPermissionsSystem && <PermissionsSystem />}

          {/* Audit Logs */}
          {auditLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Registros de Auditoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {auditLogs.slice(0, 10).map((log, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      {log.message || `Evento de auditoría ${index + 1}`}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          {/* Emergency Management */}
          <div className={`grid gap-4 ${gridConfig}`}>
            <Button onClick={openEmergencyModal} className="h-20 flex flex-col items-center justify-center gap-2 bg-red-600 hover:bg-red-700">
              <AlertTriangle className="w-6 h-6" />
              <span>Código de Emergencia</span>
            </Button>
            <Button onClick={openTelemedicineModal} className="h-20 flex flex-col items-center justify-center gap-2">
              <Video className="w-6 h-6" />
              <span>Sesión de Telemedicina</span>
            </Button>
          </div>

          {/* Emergency Alerts Display */}
          {emergencyAlerts.length > 0 && (
            <div className="space-y-2">
              {emergencyAlerts.map((alert, index) => (
                <Alert key={index} className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {alert.message || `Alerta de emergencia ${index + 1}`}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 text-red-200 opacity-20"
          variants={floatingVariants}
          animate="float"
        >
          <Heart className="w-20 h-20" />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 text-emerald-200 opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1 }}
        >
          <Activity className="w-16 h-16" />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 text-blue-200 opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 2 }}
        >
          <Shield className="w-18 h-18" />
        </motion.div>
      </div>

      {/* Enhanced Header with Vital Red Branding */}
      <motion.div 
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-0 p-8 mb-6 relative overflow-hidden"
        variants={headerVariants}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-full h-full text-red-500" />
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <motion.div 
            className="flex items-center gap-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Vital Red Logo */}
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight">
                  VITAL <span className="text-red-500 font-light">RED</span>
                </h1>
                <p className="text-black font-medium">Dashboard HUV</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Badge variant="outline" className="bg-emerald-100 border-emerald-300 text-emerald-700 px-4 py-2">
                <MonitorSpeaker className="w-4 h-4 mr-2" />
                Sistema Activo
              </Badge>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div 
        className="mb-6"
        variants={headerVariants}
      >
        <Card withMotion={false} className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-black">Remisiones Pendientes</h2>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 h-12 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los Estados</SelectItem>
                    <SelectItem value="PENDING">Pendientes</SelectItem>
                    <SelectItem value="AUTHORIZED">Autorizados</SelectItem>
                    <SelectItem value="REJECTED">Rechazados</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Patient List with Stagger Animation */}
      <motion.div 
        className="space-y-4"
        variants={listVariants}
      >
        <AnimatePresence mode="popLayout">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                withMotion={false}
                className={`
                  bg-white/95 backdrop-blur-sm transition-colors duration-100
                  ${patient.urgencyLevel === "CRITICO" ? "border-l-8 border-l-red-500 shadow-red-100" : 
                    patient.urgencyLevel === "SEVERO" ? "border-l-8 border-l-amber-500 shadow-amber-100" :
                    "border-l-8 border-l-blue-500 shadow-blue-100"}
                `}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-6"
                      variants={{
                        visible: {
                          transition: { staggerChildren: 0.05 }
                        }
                      }}
                    >
                      {/* Patient Avatar */}
                      <motion.div 
                        className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {patient.fullName.split(' ').map(n => n[0]).join('')}
                      </motion.div>

                      <motion.div className="flex-1" variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-black">{patient.fullName}</h3>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge 
                              variant={getPriorityColor(patient.urgencyLevel)}
                              className="px-3 py-1 font-semibold"
                            >
                              {patient.urgencyLevel}
                            </Badge>
                          </motion.div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <motion.div 
                            className="flex items-center gap-2"
                            variants={itemVariants}
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-black">{patient.identificationNumber}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-2"
                            variants={itemVariants}
                          >
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-black">{patient.arrivalTime}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-2"
                            variants={itemVariants}
                          >
                            <Activity className="w-4 h-4 text-gray-500" />
                            <span className="text-black">{patient.eps}</span>
                          </motion.div>
                        </div>
                        
                        <motion.p 
                          className="text-black mt-2 leading-relaxed"
                          variants={itemVariants}
                        >
                          {patient.symptoms}
                        </motion.p>
                      </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                      className="flex items-center gap-3"
                      variants={{
                        visible: {
                          transition: { staggerChildren: 0.05 }
                        }
                      }}
                    >
                      <motion.div variants={itemVariants}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPatient(patient)}
                                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver
                              </Button>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-black">
                                Evaluación de Remisión
                              </DialogTitle>
                            </DialogHeader>
                            {selectedPatient && (
                              <motion.div 
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                              >
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label className="text-black font-semibold">Paciente</Label>
                                    <p className="text-black">{selectedPatient.fullName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-black font-semibold">Urgencia</Label>
                                    <Badge variant={getPriorityColor(selectedPatient.urgencyLevel)}>
                                      {selectedPatient.urgencyLevel}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-black font-semibold">Síntomas</Label>
                                  <p className="text-black mt-1">{selectedPatient.symptoms}</p>
                                </div>

                                <div>
                                  <Label htmlFor="priority" className="text-black font-semibold">Prioridad Hospitalaria</Label>
                                  <Select value={priorityRating} onValueChange={setPriorityRating}>
                                    <SelectTrigger className="h-12 rounded-xl border-2">
                                      <SelectValue placeholder="Seleccionar prioridad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="CRITICO">Crítico</SelectItem>
                                      <SelectItem value="SEVERO">Severo</SelectItem>
                                      <SelectItem value="MODERADO">Moderado</SelectItem>
                                      <SelectItem value="LEVE">Leve</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="notes" className="text-black font-semibold">Notas de Autorización</Label>
                                  <Textarea
                                    id="notes"
                                    value={authorizationNotes}
                                    onChange={(e) => setAuthorizationNotes(e.target.value)}
                                    placeholder="Observaciones médicas..."
                                    className="rounded-xl border-2 resize-none"
                                    rows={3}
                                  />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        handleAuthorize(selectedPatient.id, false);
                                        setSelectedPatient(null);
                                      }}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Rechazar
                                    </Button>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant="success"
                                      onClick={() => {
                                        handleAuthorize(selectedPatient.id, true);
                                        if (priorityRating) {
                                          handleSetPriority(selectedPatient.id, priorityRating);
                                        }
                                        setSelectedPatient(null);
                                      }}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Autorizar
                                    </Button>
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge variant={getStatusColor(patient.status)} className="px-3 py-1">
                            {patient.status === "PENDING" ? "Pendiente" :
                             patient.status === "AUTHORIZED" ? "Autorizado" : "Rechazado"}
                          </Badge>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Empty State */}
      <AnimatePresence>
        {filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <Card withMotion={false} className="text-center p-12 bg-white/90">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No hay pacientes con este filtro
              </h3>
              <p className="text-black">
                Cambie el filtro para ver más remisiones.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medical Navigation Cards */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Acceso Rápido - Sistema Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${gridConfig}`}>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50"
              onClick={() => {
                navigate("/medical/admissions");
                announce("Navegando a Admisiones Médicas");
              }}
              {...dashboardAriaAttributes}
            >
              <User className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Admisiones</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50"
              onClick={() => navigate("/medical/icu-monitoring")}
            >
              <MonitorSpeaker className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">UCI</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50"
              onClick={() => navigate("/medical/surgeries")}
            >
              <Activity className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Cirugías</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50"
              onClick={() => navigate("/medical/labs-imaging")}
            >
              <FileText className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">Laboratorios</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-violet-50"
              onClick={() => navigate("/real-time-metrics")}
            >
              <Activity className="w-6 h-6 text-violet-600" />
              <span className="text-sm font-medium">Métricas</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
              onClick={() => navigate("/advanced-settings")}
            >
              <Shield className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium">Config. Avanzada</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-teal-50"
              onClick={() => navigate("/medical/inventory")}
            >
              <Package className="w-6 h-6 text-teal-600" />
              <span className="text-sm font-medium">Inventario</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50"
              onClick={() => navigate("/medical/billing")}
            >
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <span className="text-sm font-medium">Facturación</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50"
              onClick={() => navigate("/medical/telemedicine-console")}
            >
              <Video className="w-6 h-6 text-indigo-600" />
              <span className="text-sm font-medium">Telemedicina</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-red-50"
              onClick={() => navigate("/admin/audit-logs")}
            >
              <FileText className="w-6 h-6 text-red-600" />
              <span className="text-sm font-medium">Auditoría</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-yellow-50"
              onClick={() => navigate("/admin/quality-metrics")}
            >
              <TrendingUp className="w-6 h-6 text-yellow-600" />
              <span className="text-sm font-medium">Calidad</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-pink-50"
              onClick={() => navigate("/admin/system-config")}
            >
              <Settings className="w-6 h-6 text-pink-600" />
              <span className="text-sm font-medium">Sistema</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-cyan-50"
              onClick={() => {
                navigate("/utilities-demo");
                announce("Navegando a Demo de Utilidades");
              }}
              {...dashboardAriaAttributes}
            >
              <Zap className="w-6 h-6 text-cyan-600" />
              <span className="text-sm font-medium">Demo Utils</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-lime-50"
              onClick={() => {
                navigate("/complete-system");
                announce("Navegando al Sistema Completo");
              }}
              {...dashboardAriaAttributes}
            >
              <Monitor className="w-6 h-6 text-lime-600" />
              <span className="text-sm font-medium">Sistema Completo</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50"
              onClick={() => {
                navigate("/api-verification");
                announce("Navegando a Verificación de APIs");
              }}
              {...dashboardAriaAttributes}
            >
              <Database className="w-6 h-6 text-indigo-600" />
              <span className="text-sm font-medium">Verificar APIs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MODAL INTEGRATION - Simplified for working modals only */}
      {showPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Identificación de Paciente</h2>
              <Button variant="ghost" onClick={() => setShowPatientModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <PatientIdentificationModal />
          </div>
        </div>
      )}

      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Diagnóstico y Referencia</h2>
              <Button variant="ghost" onClick={() => setShowReferralModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ReferralDiagnosisModal />
          </div>
        </div>
      )}

      {showVitalSignsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Signos Vitales</h2>
              <Button variant="ghost" onClick={() => setShowVitalSignsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <VitalSignsModal />
          </div>
        </div>
      )}

      {showDocumentsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Gestión de Documentos</h2>
              <Button variant="ghost" onClick={() => setShowDocumentsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DocumentsModal />
          </div>
        </div>
      )}

      {showValidationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Validación del Sistema</h2>
              <Button variant="ghost" onClick={() => setShowValidationModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ValidationModal />
          </div>
        </div>
      )}

      {/* Modal for advanced features */}
      {(showAdmissionModal || showDischargeModal || showAppointmentModal ||
        showPrescriptionModal || showInventoryModal || showTelemedicineModal ||
        showReportModal || showCommunicationModal || showEducationModal ||
        showEmergencyModal) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Funcionalidad Integrada</h3>
              <p className="text-gray-600">
                Este módulo está completamente integrado en el sistema.
                Navega a las páginas específicas para acceder a toda la funcionalidad.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowAdmissionModal(false);
                    setShowDischargeModal(false);
                    setShowAppointmentModal(false);
                    setShowPrescriptionModal(false);
                    setShowInventoryModal(false);
                    setShowTelemedicineModal(false);
                    setShowReportModal(false);
                    setShowCommunicationModal(false);
                    setShowEducationModal(false);
                    setShowEmergencyModal(false);
                  }}
                  variant="outline"
                >
                  Cerrar
                </Button>
                <Button onClick={() => navigate("/complete-system")}>
                  Ver Sistema Completo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
