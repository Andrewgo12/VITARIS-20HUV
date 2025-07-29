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
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  LogOut,
  Heart,
  Activity,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Stethoscope,
  Pill,
  FileImage,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Edit3,
  Save,
  AlertCircle,
  UserCheck,
  ClipboardList,
  Thermometer,
  Users,
  Bed,
  Building,
  TrendingUp,
  MonitorSpeaker,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FormData } from "@/context/FormContext";
import { loadFormFromStorage } from "@/lib/persistence";

interface PatientWithMedicalData {
  id: string;
  submissionDate: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "TRANSFERRED";
  priority: "CRITICO" | "SEVERO" | "MODERADO" | "LEVE";
  assignedDoctor?: string;
  transferDate?: string;
  medicalNotes?: string;
  reviewNotes?: string;
  formData: FormData;
}

// Datos de prueba expandidos con información del formulario EPS
const mockPatientsWithFormData: PatientWithMedicalData[] = [
  {
    id: "1",
    submissionDate: "2024-01-20T10:30:00",
    status: "PENDING",
    priority: "CRITICO",
    assignedDoctor: "",
    transferDate: "",
    medicalNotes: "",
    reviewNotes: "",
    formData: {
      currentStep: 5,
      isComplete: true,
      patient: {
        identificationType: "CC",
        identificationNumber: "12345678",
        fullName: "Juan Carlos Pérez González",
        birthDate: "1978-05-15",
        age: 45,
        sex: "Masculino",
        eps: "NUEVA_EPS",
        affiliationRegime: "Contributivo",
        affiliateType: "Cotizante",
        affiliationNumber: "NEP123456789",
        affiliationStatus: "Activo",
        sisbenLevel: "N/A",
        phone: "3001234567",
        address: "Cra 15 # 45-67, Cali, Valle del Cauca",
        email: "juan.perez@email.com",
        emergencyContactName: "María Elena Pérez",
        emergencyContactPhone: "3009876543",
        emergencyContactRelation: "Esposa",
        occupation: "Ingeniero",
        educationLevel: "Profesional",
        maritalStatus: "Casado",
        pregnancyStatus: "N/A",
        pregnancyWeeks: "",
        insuranceAuthorization: "AUT2024001",
        previousHospitalizations: "Apendicectomía 2015",
        chronicConditions: "Hipertensión arterial, Diabetes tipo 2",
        currentSymptoms:
          "Dolor torácico agudo, dificultad respiratoria, sudoración profusa",
        symptomsOnset: "Hace 2 horas",
        symptomsIntensity: "Severo (8/10)",
        painScale: "8",
        attachments1: [],
      },
      referral: {
        consultationDate: "2024-01-20",
        referralService: "Cardiología",
        referralReason: "Sospecha de síndrome coronario agudo",
        primaryDiagnosis: "R06.0 - Disnea",
        secondaryDiagnosis1:
          "Z87.891 - Historia personal de enfermedad del sistema circulatorio",
        secondaryDiagnosis2: "",
        medicalSpecialty: "Cardiología",
        personalHistory: ["Hipertensión", "Diabetes", "Dislipidemia"],
        familyHistory: "Padre con infarto miocárdico a los 55 años",
        allergies: "Penicilina",
        currentMedications:
          "Metformina 850mg c/12h, Enalapril 10mg c/12h, Atorvastatina 20mg/día",
        clinicalEvolution:
          "Paciente con deterioro clínico progresivo en las últimas 2 horas",
        treatmentProvided:
          "Oxígeno suplementario, AAS 300mg, Clopidogrel 300mg",
        treatmentResponse: "Mejoría parcial del dolor torácico",
        laboratoriesRequested: "Troponinas, CPK-MB, BUN, Creatinina, Hemograma",
        imagingRequested: "EKG, Rx de tórax, Ecocardiograma",
        consultingPhysician: "Dr. Alberto Ramírez",
        physicianLicense: "12345",
        urgencyLevel: "CRITICO",
        transportType: "Ambulancia medicalizada",
        specialPrecautions: "Monitoreo cardíaco continuo",
      },
      vitals: {
        heartRate: "120",
        respiratoryRate: "24",
        temperature: "37.2",
        systolicBP: "160",
        diastolicBP: "95",
        oxygenSaturation: "92",
        glasgowScale: "15",
        glucometry: "180",
        weight: "85",
        height: "175",
        bmi: 27.8,
        attachments3: [],
      },
      documents: {
        additionalObservations:
          "Paciente requiere evaluación cardiológica urgente por sospecha de SCA",
        professionalName: "Dr. Alberto Ramírez Herrera",
        professionalPosition: "Médico General - Urgencias",
        professionalPhone: "3201234567",
        attachments4: [],
      },
    },
  },
  {
    id: "2",
    submissionDate: "2024-01-20T14:15:00",
    status: "UNDER_REVIEW",
    priority: "SEVERO",
    assignedDoctor: "Dra. Carmen López",
    transferDate: "",
    medicalNotes:
      "Paciente en evaluación, se solicitan estudios complementarios",
    reviewNotes: "",
    formData: {
      currentStep: 5,
      isComplete: true,
      patient: {
        identificationType: "CC",
        identificationNumber: "87654321",
        fullName: "María Elena Rodríguez Vargas",
        birthDate: "1992-03-20",
        age: 32,
        sex: "Femenino",
        eps: "SANITAS",
        affiliationRegime: "Contributivo",
        affiliateType: "Beneficiaria",
        affiliationNumber: "SAN987654321",
        affiliationStatus: "Activo",
        sisbenLevel: "N/A",
        phone: "3109876543",
        address: "Clle 25 # 30-45, Cali, Valle del Cauca",
        email: "maria.rodriguez@email.com",
        emergencyContactName: "Carlos Rodríguez",
        emergencyContactPhone: "3158765432",
        emergencyContactRelation: "Esposo",
        occupation: "Profesora",
        educationLevel: "Profesional",
        maritalStatus: "Casada",
        pregnancyStatus: "Embarazada",
        pregnancyWeeks: "28",
        insuranceAuthorization: "SAN2024002",
        previousHospitalizations: "Ninguna",
        chronicConditions: "Ninguna conocida",
        currentSymptoms: "Dolor abdominal severo, náuseas, vómito persistente",
        symptomsOnset: "Hace 6 horas",
        symptomsIntensity: "Severo (7/10)",
        painScale: "7",
        attachments1: [],
      },
      referral: {
        consultationDate: "2024-01-20",
        referralService: "Ginecología",
        referralReason:
          "Dolor abdominal en embarazada, descartar complicaciones obstétricas",
        primaryDiagnosis:
          "O26.8 - Otras condiciones especificadas relacionadas con el embarazo",
        secondaryDiagnosis1: "K59.1 - Diarrea funcional",
        secondaryDiagnosis2: "",
        medicalSpecialty: "Ginecología y Obstetricia",
        personalHistory: [],
        familyHistory: "Sin antecedentes patológicos relevantes",
        allergies: "Ninguna conocida",
        currentMedications: "Ácido fólico 5mg/día, Sulfato ferroso 300mg/día",
        clinicalEvolution:
          "Dolor abdominal progresivo con signos de irritación peritoneal",
        treatmentProvided: "Analgesia, hidratación IV, antiemético",
        treatmentResponse: "Persistencia del dolor abdominal",
        laboratoriesRequested: "Hemograma, PCR, parcial de orina, β-HCG",
        imagingRequested: "Ecografía obstétrica, ecografía abdominal",
        consultingPhysician: "Dra. Patricia Morales",
        physicianLicense: "67890",
        urgencyLevel: "SEVERO",
        transportType: "Ambulancia básica",
        specialPrecautions: "Monitoreo materno-fetal continuo",
      },
      vitals: {
        heartRate: "95",
        respiratoryRate: "20",
        temperature: "37.8",
        systolicBP: "120",
        diastolicBP: "75",
        oxygenSaturation: "98",
        glasgowScale: "15",
        glucometry: "95",
        weight: "68",
        height: "162",
        bmi: 25.9,
        attachments3: [],
      },
      documents: {
        additionalObservations:
          "Embarazo de 28 semanas, requiere evaluación obstétrica urgente",
        professionalName: "Dra. Patricia Morales Sánchez",
        professionalPosition: "Médica General - Consulta Externa",
        professionalPhone: "3187654321",
        attachments4: [],
      },
    },
  },
];

export default function MedicalDashboard() {
  const [patients, setPatients] = useState<PatientWithMedicalData[]>(
    mockPatientsWithFormData,
  );
  const [selectedPatient, setSelectedPatient] =
    useState<PatientWithMedicalData | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [editingPriority, setEditingPriority] = useState("");
  const navigate = useNavigate();

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedFormData = loadFormFromStorage();
    if (savedFormData && savedFormData.isComplete) {
      // Crear nuevo paciente con los datos del formulario guardado
      const newPatient: PatientWithMedicalData = {
        id: Date.now().toString(),
        submissionDate: new Date().toISOString(),
        status: "PENDING",
        priority:
          (savedFormData.referral?.urgencyLevel as
            | "CRITICO"
            | "SEVERO"
            | "MODERADO"
            | "LEVE") || "MODERADO",
        assignedDoctor: "",
        transferDate: "",
        medicalNotes: "",
        reviewNotes: "",
        formData: savedFormData as FormData,
      };

      setPatients((prev) => [newPatient, ...prev]);
    }
  }, []);

  const handleStatusChange = (
    patientId: string,
    newStatus: PatientWithMedicalData["status"],
  ) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p)),
    );
  };

  const handlePriorityChange = (
    patientId: string,
    newPriority: PatientWithMedicalData["priority"],
  ) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, priority: newPriority } : p,
      ),
    );
  };

  const handleUpdatePatient = (
    patientId: string,
    updates: Partial<PatientWithMedicalData>,
  ) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, ...updates } : p)),
    );
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "TRANSFERRED":
        return "success";
      case "REJECTED":
        return "destructive";
      case "UNDER_REVIEW":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "UNDER_REVIEW":
        return "En Revisión";
      case "APPROVED":
        return "Aprobado";
      case "REJECTED":
        return "Rechazado";
      case "TRANSFERRED":
        return "Trasladado";
      default:
        return status;
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesStatus =
      filterStatus === "ALL" || patient.status === filterStatus;
    const matchesPriority =
      filterPriority === "ALL" || patient.priority === filterPriority;
    const matchesSearch =
      searchTerm === "" ||
      patient.formData.patient.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.formData.patient.identificationNumber.includes(searchTerm);

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const openPatientDetails = (patient: PatientWithMedicalData) => {
    setSelectedPatient(patient);
    setAssignedDoctor(patient.assignedDoctor || "");
    setTransferDate(patient.transferDate || "");
    setMedicalNotes(patient.medicalNotes || "");
    setReviewNotes(patient.reviewNotes || "");
    setEditingPriority(patient.priority);
  };

  const savePatientChanges = () => {
    if (selectedPatient) {
      handleUpdatePatient(selectedPatient.id, {
        assignedDoctor,
        transferDate,
        medicalNotes,
        reviewNotes,
        priority: editingPriority as PatientWithMedicalData["priority"],
      });
      setSelectedPatient(null);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl border-0 p-8 m-6 mb-6 relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Stethoscope className="w-full h-full text-blue-500" />
          </motion.div>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <motion.div
            className="flex items-center gap-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <UserCheck className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight">
                  DASHBOARD{" "}
                  <span className="text-blue-500 font-light">MÉDICO</span>
                </h1>
                <p className="text-black font-medium">
                  Sistema de Revisión de Remisiones EPS
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
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Menú de Navegación Médica */}
      <motion.div
        className="mx-6 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorSpeaker className="w-5 h-5 text-blue-500" />
              Sistema de Gestión Médica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white flex flex-col items-center gap-2"
                  onClick={() => navigate("/medical/beds-management")}
                >
                  <Bed className="w-8 h-8" />
                  <span className="font-semibold">Gestión de Camas</span>
                  <span className="text-xs opacity-75">Sectores y Hospitalización</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white flex flex-col items-center gap-2"
                  onClick={() => navigate("/medical/patient-tracking")}
                >
                  <Users className="w-8 h-8" />
                  <span className="font-semibold">Seguimiento de Pacientes</span>
                  <span className="text-xs opacity-75">Monitor Integral</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white flex flex-col items-center gap-2"
                  onClick={() => navigate("/medical/active-patients")}
                >
                  <ClipboardList className="w-8 h-8" />
                  <span className="font-semibold">Pacientes Activos</span>
                  <span className="text-xs opacity-75">Historial Completo</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white flex flex-col items-center gap-2"
                  onClick={() => navigate("/medical/clinical-reports")}
                >
                  <TrendingUp className="w-8 h-8" />
                  <span className="font-semibold">Reportes Clínicos</span>
                  <span className="text-xs opacity-75">Análisis y Métricas</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div
        className="mx-6 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Buscar Paciente
                </Label>
                <Input
                  placeholder="Nombre o identificación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 rounded-xl border-2"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Estado
                </Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los Estados</SelectItem>
                    <SelectItem value="PENDING">Pendientes</SelectItem>
                    <SelectItem value="UNDER_REVIEW">En Revisión</SelectItem>
                    <SelectItem value="APPROVED">Aprobados</SelectItem>
                    <SelectItem value="TRANSFERRED">Trasladados</SelectItem>
                    <SelectItem value="REJECTED">Rechazados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Prioridad
                </Label>
                <Select
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <SelectTrigger className="h-11 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas las Prioridades</SelectItem>
                    <SelectItem value="CRITICO">Crítico</SelectItem>
                    <SelectItem value="SEVERO">Severo</SelectItem>
                    <SelectItem value="MODERADO">Moderado</SelectItem>
                    <SelectItem value="LEVE">Leve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Pacientes</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredPatients.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Pacientes */}
      <motion.div
        className="mx-6 space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`
                  bg-white/95 backdrop-blur-sm transition-all duration-200 hover:shadow-lg
                  ${
                    patient.priority === "CRITICO"
                      ? "border-l-8 border-l-red-500"
                      : patient.priority === "SEVERO"
                        ? "border-l-8 border-l-amber-500"
                        : patient.priority === "MODERADO"
                          ? "border-l-8 border-l-blue-500"
                          : "border-l-8 border-l-green-500"
                  }
                `}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Avatar del Paciente */}
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {patient.formData.patient.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </motion.div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-black">
                            {patient.formData.patient.fullName}
                          </h3>
                          <Badge
                            variant={getPriorityColor(patient.priority)}
                            className="px-3 py-1 font-semibold"
                          >
                            {patient.priority}
                          </Badge>
                          <Badge
                            variant={getStatusColor(patient.status)}
                            className="px-3 py-1"
                          >
                            {getStatusText(patient.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-black">
                              {patient.formData.patient.identificationNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-500" />
                            <span className="text-black">
                              {patient.formData.patient.eps}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-black">
                              {new Date(patient.submissionDate).toLocaleString(
                                "es-CO",
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-gray-500" />
                            <span className="text-black">
                              {patient.formData.referral.medicalSpecialty ||
                                "Sin especificar"}
                            </span>
                          </div>
                        </div>

                        <p className="text-black mt-2 leading-relaxed">
                          <strong>Síntomas:</strong>{" "}
                          {patient.formData.patient.currentSymptoms}
                        </p>

                        {patient.assignedDoctor && (
                          <p className="text-blue-600 mt-1 text-sm">
                            <strong>Médico Asignado:</strong>{" "}
                            {patient.assignedDoctor}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPatientDetails(patient)}
                            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Completo
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                              <FileText className="w-6 h-6 text-blue-500" />
                              Revisión Médica Completa -{" "}
                              {selectedPatient?.formData.patient.fullName}
                            </DialogTitle>
                          </DialogHeader>

                          {selectedPatient && (
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
                                <TabsList className="grid w-full grid-cols-6">
                                  <TabsTrigger
                                    value="patient-info"
                                    className="flex items-center gap-2"
                                  >
                                    <User className="w-4 h-4" />
                                    Paciente
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="referral"
                                    className="flex items-center gap-2"
                                  >
                                    <ClipboardList className="w-4 h-4" />
                                    Remisión
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="vitals"
                                    className="flex items-center gap-2"
                                  >
                                    <Thermometer className="w-4 h-4" />
                                    Signos Vitales
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="documents"
                                    className="flex items-center gap-2"
                                  >
                                    <FileImage className="w-4 h-4" />
                                    Documentos
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="management"
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
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-500" />
                                        Información Personal
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Tipo de Identificación
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .identificationType
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Número de Identificación
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .identificationNumber
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Nombre Completo
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .fullName
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Fecha de Nacimiento
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .birthDate
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Edad
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .age
                                            }{" "}
                                            años
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Sexo
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .sex
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            EPS
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .eps
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Régimen de Afiliación
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .affiliationRegime
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Estado de Afiliación
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .affiliationStatus
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-green-500" />
                                        Información de Contacto
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Teléfono
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .phone
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Email
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .email
                                            }
                                          </p>
                                        </div>
                                        <div className="md:col-span-2">
                                          <Label className="font-semibold text-gray-700">
                                            Dirección
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .address
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Contacto de Emergencia
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .emergencyContactName
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Teléfono de Emergencia
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .emergencyContactPhone
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        Información Clínica
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div>
                                        <Label className="font-semibold text-gray-700">
                                          Síntomas Actuales
                                        </Label>
                                        <p className="text-black p-3 bg-red-50 rounded-lg border border-red-200">
                                          {
                                            selectedPatient.formData.patient
                                              .currentSymptoms
                                          }
                                        </p>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Inicio de Síntomas
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .symptomsOnset
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Escala de Dolor
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.patient
                                                .painScale
                                            }
                                            /10
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="font-semibold text-gray-700">
                                          Condiciones Crónicas
                                        </Label>
                                        <p className="text-black">
                                          {selectedPatient.formData.patient
                                            .chronicConditions ||
                                            "Ninguna reportada"}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                {/* Tab: Información de Remisión */}
                                <TabsContent
                                  value="referral"
                                  className="space-y-4"
                                >
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5 text-purple-500" />
                                        Datos de Remisión
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Fecha de Consulta
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.referral
                                                .consultationDate
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Servicio de Remisión
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.referral
                                                .referralService
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Especialidad Médica
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.referral
                                                .medicalSpecialty
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Nivel de Urgencia
                                          </Label>
                                          <Badge
                                            variant={getPriorityColor(
                                              selectedPatient.formData.referral
                                                .urgencyLevel,
                                            )}
                                          >
                                            {
                                              selectedPatient.formData.referral
                                                .urgencyLevel
                                            }
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="mt-4">
                                        <Label className="font-semibold text-gray-700">
                                          Motivo de Remisión
                                        </Label>
                                        <p className="text-black p-3 bg-blue-50 rounded-lg border border-blue-200">
                                          {
                                            selectedPatient.formData.referral
                                              .referralReason
                                          }
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Pill className="w-5 h-5 text-green-500" />
                                        Información Clínica
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div>
                                        <Label className="font-semibold text-gray-700">
                                          Diagnóstico Principal
                                        </Label>
                                        <p className="text-black p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                          {
                                            selectedPatient.formData.referral
                                              .primaryDiagnosis
                                          }
                                        </p>
                                      </div>
                                      {selectedPatient.formData.referral
                                        .secondaryDiagnosis1 && (
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Diagnóstico Secundario
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.referral
                                                .secondaryDiagnosis1
                                            }
                                          </p>
                                        </div>
                                      )}
                                      <div>
                                        <Label className="font-semibold text-gray-700">
                                          Alergias
                                        </Label>
                                        <p className="text-black">
                                          {selectedPatient.formData.referral
                                            .allergies || "Ninguna reportada"}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="font-semibold text-gray-700">
                                          Medicamentos Actuales
                                        </Label>
                                        <p className="text-black">
                                          {selectedPatient.formData.referral
                                            .currentMedications ||
                                            "Ninguno reportado"}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                {/* Tab: Signos Vitales */}
                                <TabsContent
                                  value="vitals"
                                  className="space-y-4"
                                >
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-red-500" />
                                        Signos Vitales
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
                                              selectedPatient.formData.vitals
                                                .heartRate
                                            }
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            lpm
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                          <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                          <p className="text-sm text-gray-600">
                                            Frecuencia Respiratoria
                                          </p>
                                          <p className="text-2xl font-bold text-blue-600">
                                            {
                                              selectedPatient.formData.vitals
                                                .respiratoryRate
                                            }
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            rpm
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                          <Thermometer className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                          <p className="text-sm text-gray-600">
                                            Temperatura
                                          </p>
                                          <p className="text-2xl font-bold text-yellow-600">
                                            {
                                              selectedPatient.formData.vitals
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
                                              selectedPatient.formData.vitals
                                                .oxygenSaturation
                                            }
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            %
                                          </p>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Presión Arterial
                                          </Label>
                                          <p className="text-black text-lg font-semibold">
                                            {
                                              selectedPatient.formData.vitals
                                                .systolicBP
                                            }
                                            /
                                            {
                                              selectedPatient.formData.vitals
                                                .diastolicBP
                                            }{" "}
                                            mmHg
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Escala de Glasgow
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.vitals
                                                .glasgowScale
                                            }
                                            /15
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Glucometría
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.vitals
                                                .glucometry
                                            }{" "}
                                            mg/dL
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Peso
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.vitals
                                                .weight
                                            }{" "}
                                            kg
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Altura
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.vitals
                                                .height
                                            }{" "}
                                            cm
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            IMC
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.vitals
                                                .bmi
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                {/* Tab: Documentos */}
                                <TabsContent
                                  value="documents"
                                  className="space-y-4"
                                >
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <FileImage className="w-5 h-5 text-indigo-500" />
                                        Información del Profesional
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Nombre del Profesional
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.documents
                                                .professionalName
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Cargo
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.documents
                                                .professionalPosition
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="font-semibold text-gray-700">
                                            Teléfono
                                          </Label>
                                          <p className="text-black">
                                            {
                                              selectedPatient.formData.documents
                                                .professionalPhone
                                            }
                                          </p>
                                        </div>
                                      </div>
                                      <div className="mt-4">
                                        <Label className="font-semibold text-gray-700">
                                          Observaciones Adicionales
                                        </Label>
                                        <p className="text-black p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                          {selectedPatient.formData.documents
                                            .additionalObservations ||
                                            "Sin observaciones adicionales"}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                {/* Tab: Gestión Médica */}
                                <TabsContent
                                  value="management"
                                  className="space-y-4"
                                >
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Edit3 className="w-5 h-5 text-orange-500" />
                                        Gestión y Control HUV
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label
                                            htmlFor="priority"
                                            className="font-semibold text-gray-700"
                                          >
                                            Prioridad Hospitalaria
                                          </Label>
                                          <Select
                                            value={editingPriority}
                                            onValueChange={setEditingPriority}
                                          >
                                            <SelectTrigger className="h-11 rounded-xl border-2">
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

                                        <div>
                                          <Label
                                            htmlFor="assigned-doctor"
                                            className="font-semibold text-gray-700"
                                          >
                                            Médico Asignado
                                          </Label>
                                          <Input
                                            id="assigned-doctor"
                                            value={assignedDoctor}
                                            onChange={(e) =>
                                              setAssignedDoctor(e.target.value)
                                            }
                                            placeholder="Nombre del médico responsable"
                                            className="h-11 rounded-xl border-2"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <Label
                                          htmlFor="transfer-date"
                                          className="font-semibold text-gray-700"
                                        >
                                          Fecha de Traslado
                                        </Label>
                                        <Input
                                          id="transfer-date"
                                          type="datetime-local"
                                          value={transferDate}
                                          onChange={(e) =>
                                            setTransferDate(e.target.value)
                                          }
                                          className="h-11 rounded-xl border-2"
                                        />
                                      </div>

                                      <div>
                                        <Label
                                          htmlFor="medical-notes"
                                          className="font-semibold text-gray-700"
                                        >
                                          Notas Médicas
                                        </Label>
                                        <Textarea
                                          id="medical-notes"
                                          value={medicalNotes}
                                          onChange={(e) =>
                                            setMedicalNotes(e.target.value)
                                          }
                                          placeholder="Observaciones médicas, plan de tratamiento, recomendaciones..."
                                          className="rounded-xl border-2 resize-none"
                                          rows={4}
                                        />
                                      </div>

                                      <div>
                                        <Label
                                          htmlFor="review-notes"
                                          className="font-semibold text-gray-700"
                                        >
                                          Notas de Revisión
                                        </Label>
                                        <Textarea
                                          id="review-notes"
                                          value={reviewNotes}
                                          onChange={(e) =>
                                            setReviewNotes(e.target.value)
                                          }
                                          placeholder="Revisión del caso, decisiones tomadas, seguimiento..."
                                          className="rounded-xl border-2 resize-none"
                                          rows={3}
                                        />
                                      </div>

                                      <div className="flex justify-between pt-4">
                                        <div className="flex gap-3">
                                          <Button
                                            variant="destructive"
                                            onClick={() => {
                                              handleStatusChange(
                                                selectedPatient.id,
                                                "REJECTED",
                                              );
                                              setSelectedPatient(null);
                                            }}
                                          >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Rechazar
                                          </Button>
                                          <Button
                                            variant="secondary"
                                            onClick={() => {
                                              handleStatusChange(
                                                selectedPatient.id,
                                                "UNDER_REVIEW",
                                              );
                                              savePatientChanges();
                                            }}
                                          >
                                            <Clock className="w-4 h-4 mr-2" />
                                            En Revisión
                                          </Button>
                                        </div>
                                        <div className="flex gap-3">
                                          <Button
                                            variant="outline"
                                            onClick={savePatientChanges}
                                          >
                                            <Save className="w-4 h-4 mr-2" />
                                            Guardar Cambios
                                          </Button>
                                          <Button
                                            variant="success"
                                            onClick={() => {
                                              handleStatusChange(
                                                selectedPatient.id,
                                                "APPROVED",
                                              );
                                              savePatientChanges();
                                            }}
                                          >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Aprobar Traslado
                                          </Button>
                                        </div>
                                      </div>
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
                                        Historial del Caso
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                          <div>
                                            <p className="text-sm text-gray-600">
                                              {new Date(
                                                selectedPatient.submissionDate,
                                              ).toLocaleString("es-CO")}
                                            </p>
                                            <p className="text-black font-semibold">
                                              Formulario EPS recibido
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                              Remisión ingresada al sistema
                                            </p>
                                          </div>
                                        </div>

                                        {selectedPatient.status !==
                                          "PENDING" && (
                                          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div>
                                              <p className="text-sm text-gray-600">
                                                {new Date().toLocaleString(
                                                  "es-CO",
                                                )}
                                              </p>
                                              <p className="text-black font-semibold">
                                                Estado actualizado:{" "}
                                                {getStatusText(
                                                  selectedPatient.status,
                                                )}
                                              </p>
                                              <p className="text-gray-600 text-sm">
                                                Revisión médica realizada
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {selectedPatient.transferDate && (
                                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <div>
                                              <p className="text-sm text-gray-600">
                                                {new Date(
                                                  selectedPatient.transferDate,
                                                ).toLocaleString("es-CO")}
                                              </p>
                                              <p className="text-black font-semibold">
                                                Fecha de traslado programada
                                              </p>
                                              <p className="text-gray-600 text-sm">
                                                Traslado autorizado al HUV
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(patient.id, "UNDER_REVIEW")
                        }
                        className="border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Revisar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Estado Vacío */}
      <AnimatePresence>
        {filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="mx-6"
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
                No hay pacientes con estos filtros
              </h3>
              <p className="text-black">
                Ajuste los filtros para ver más remisiones médicas.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
