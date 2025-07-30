import React, { createContext, useContext, useState, useEffect } from "react";

// Comprehensive medical data types
export interface Patient {
  id: string;
  personalInfo: {
    identificationType: string;
    identificationNumber: string;
    fullName: string;
    birthDate: string;
    age: number;
    sex: string;
    bloodType?: string;
    allergies?: string[];
  };
  epsInfo: {
    eps: string;
    affiliationRegime: string;
    affiliateType: string;
    affiliationNumber: string;
    affiliationStatus: string;
    sisbenLevel?: string;
  };
  contactInfo: {
    address: string;
    phone: string;
    email?: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
  };
  sociodemographic: {
    occupation: string;
    educationLevel: string;
    maritalStatus: string;
    pregnancyStatus?: string;
    pregnancyWeeks?: number;
  };
  medicalInfo: {
    currentSymptoms: string;
    symptomsOnset: string;
    symptomsIntensity: string;
    painScale: number;
    chronicConditions: string;
    previousHospitalizations: string;
    insuranceAuthorization: string;
  };
  currentStatus: {
    status: "active" | "discharged" | "transferred" | "emergency";
    admissionDate: string;
    assignedDoctor: string;
    room?: string;
    bed?: string;
    priority: "critical" | "high" | "medium" | "low";
  };
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
  }>;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  timestamp: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recordedBy: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sideEffects?: string;
  prescribedBy: string;
  prescribedDate: string;
  status: "active" | "completed" | "discontinued";
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

export interface Surgery {
  id: string;
  patientId: string;
  surgeonId: string;
  surgeonName: string;
  type: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  operatingRoom: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  equipment?: string[];
}

export interface LabTest {
  id: string;
  patientId: string;
  type: string;
  orderedBy: string;
  orderedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  status: "ordered" | "scheduled" | "in-progress" | "completed" | "cancelled";
  results?: string;
  notes?: string;
}

export interface Emergency {
  id: string;
  patientId?: string;
  code: string;
  level: "critical" | "high" | "medium" | "low";
  description: string;
  location: string;
  activatedBy: string;
  activatedAt: string;
  status: "active" | "resolved" | "escalated";
  responseTeam?: string[];
}

export interface Bed {
  id: string;
  number: string;
  ward: string;
  type: "icu" | "emergency" | "general" | "private";
  status: "available" | "occupied" | "maintenance" | "reserved";
  patientId?: string;
  assignedDate?: string;
  equipment?: string[];
}

export interface MedicalReport {
  id: string;
  title: string;
  type: "patient" | "department" | "statistics" | "general";
  generatedBy: string;
  generatedDate: string;
  period: {
    start: string;
    end: string;
  };
  data: any;
  format: "pdf" | "excel" | "csv";
  status: "generating" | "ready" | "downloaded";
}

export interface TeamMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string;
  recipientName?: string;
  message: string;
  type: "urgent" | "normal" | "broadcast" | "shift-handover";
  timestamp: string;
  read: boolean;
}

export interface DischargeInfo {
  dischargeDate: string;
  dischargeType: "medical" | "voluntary" | "transfer" | "death";
  destination?: string;
  finalDiagnosis: string;
  medications: string;
  followUpInstructions: string;
  dischargedBy: string;
  notes?: string;
}

export interface TelemedicineSession {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  sessionType: "consultation" | "follow-up" | "emergency" | "therapy";
  scheduledDate: string;
  duration: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  platform: "zoom" | "teams" | "custom";
  sessionUrl?: string;
  notes?: string;
  recordingUrl?: string;
  prescriptions?: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "medication" | "equipment" | "supplies" | "surgical";
  currentStock: number;
  minimumStock: number;
  unit: string;
  cost: number;
  supplier: string;
  expirationDate?: string;
  location: string;
  lastUpdated: string;
}

export interface AdmissionRequest {
  id: string;
  patientId: string;
  requestedBy: string;
  requestDate: string;
  expectedAdmissionDate: string;
  department: string;
  reason: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "approved" | "rejected" | "admitted";
  approvedBy?: string;
  notes?: string;
}

export interface EducationModule {
  id: string;
  title: string;
  category: "clinical" | "safety" | "procedures" | "technology";
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
  attachments: string[];
  completedBy: string[];
  certificationRequired: boolean;
  createdBy: string;
  createdDate: string;
}

export interface MedicalDataContextType {
  // Patients
  patients: Patient[];
  activePatients: Patient[];
  addPatient: (patient: Omit<Patient, "id">) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  getPatient: (id: string) => Patient | undefined;
  dischargePatient: (id: string, dischargeInfo: DischargeInfo) => void;
  transferPatient: (id: string, transferInfo: any) => void;

  // Vital Signs
  vitalSigns: VitalSigns[];
  addVitalSigns: (vitals: Omit<VitalSigns, "id">) => void;
  getPatientVitalSigns: (patientId: string) => VitalSigns[];

  // Medications
  medications: Medication[];
  addMedication: (medication: Omit<Medication, "id">) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  getPatientMedications: (patientId: string) => Medication[];

  // Appointments
  appointments: Appointment[];
  scheduleAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string, reason: string) => void;
  getTodaysAppointments: () => Appointment[];

  // Surgeries
  surgeries: Surgery[];
  scheduleSurgery: (surgery: Omit<Surgery, "id">) => void;
  updateSurgery: (id: string, updates: Partial<Surgery>) => void;
  getUpcomingSurgeries: () => Surgery[];

  // Lab Tests
  labTests: LabTest[];
  orderLabTest: (test: Omit<LabTest, "id">) => void;
  updateLabTest: (id: string, updates: Partial<LabTest>) => void;
  getPendingLabTests: () => LabTest[];

  // Emergencies
  emergencies: Emergency[];
  activateEmergency: (emergency: Omit<Emergency, "id">) => void;
  resolveEmergency: (id: string, resolution: string) => void;
  getActiveEmergencies: () => Emergency[];

  // Beds
  beds: Bed[];
  assignBed: (bedId: string, patientId: string) => void;
  releaseBed: (bedId: string) => void;
  getAvailableBeds: (type?: string) => Bed[];

  // Reports
  reports: MedicalReport[];
  generateReport: (report: Omit<MedicalReport, "id">) => void;
  getReports: (type?: string) => MedicalReport[];

  // Team Communication
  messages: TeamMessage[];
  sendMessage: (message: Omit<TeamMessage, "id">) => void;
  markMessageAsRead: (id: string) => void;
  getUnreadMessages: () => TeamMessage[];

  // Telemedicine
  telemedicineSessions: TelemedicineSession[];
  scheduleTelemedicine: (session: Omit<TelemedicineSession, "id">) => void;
  updateTelemedicine: (id: string, updates: Partial<TelemedicineSession>) => void;
  getUpcomingSessions: () => TelemedicineSession[];

  // Inventory Management
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  getLowStockItems: () => InventoryItem[];
  getInventoryByCategory: (category: string) => InventoryItem[];

  // Admission Requests
  admissionRequests: AdmissionRequest[];
  createAdmissionRequest: (request: Omit<AdmissionRequest, "id">) => void;
  updateAdmissionRequest: (id: string, updates: Partial<AdmissionRequest>) => void;
  getPendingAdmissions: () => AdmissionRequest[];

  // Medical Education
  educationModules: EducationModule[];
  addEducationModule: (module: Omit<EducationModule, "id">) => void;
  updateEducationModule: (id: string, updates: Partial<EducationModule>) => void;
  markModuleCompleted: (moduleId: string, userId: string) => void;
  getUserProgress: (userId: string) => EducationModule[];

  // Statistics
  getStatistics: () => {
    totalPatients: number;
    activePatients: number;
    availableBeds: number;
    todaysAppointments: number;
    emergencies: number;
    pendingLabTests: number;
    lowStockItems: number;
    pendingAdmissions: number;
    activeSessions: number;
  };

  // Data persistence
  saveToLocal: () => void;
  loadFromLocal: () => void;
  clearAllData: () => void;
}

const MedicalDataContext = createContext<MedicalDataContextType | undefined>(
  undefined,
);

// Mock data generators
const generateMockPatients = (): Patient[] => [
  {
    id: "1",
    personalInfo: {
      identificationType: "CC",
      identificationNumber: "12345678",
      fullName: "María García López",
      birthDate: "1985-06-15",
      age: 38,
      sex: "F",
      bloodType: "O+",
      allergies: ["Penicilina", "Mariscos"],
    },
    epsInfo: {
      eps: "SURA",
      affiliationRegime: "Contributivo",
      affiliateType: "Cotizante",
      affiliationNumber: "SUR123456789",
      affiliationStatus: "Activo",
      sisbenLevel: "N/A",
    },
    contactInfo: {
      address: "Calle 15 #45-67, Cali",
      phone: "3001234567",
      email: "maria.garcia@email.com",
      emergencyContactName: "Carlos García",
      emergencyContactPhone: "3007654321",
      emergencyContactRelation: "Esposo",
    },
    sociodemographic: {
      occupation: "Enfermera",
      educationLevel: "Universitario",
      maritalStatus: "Casada",
      pregnancyStatus: "No embarazada",
    },
    medicalInfo: {
      currentSymptoms: "Dolor abdominal, náuseas",
      symptomsOnset: "Hace 2 días",
      symptomsIntensity: "Moderada",
      painScale: 6,
      chronicConditions: "Hipertensión",
      previousHospitalizations: "Cesárea 2018",
      insuranceAuthorization: "AUT-2024-001",
    },
    currentStatus: {
      status: "active",
      admissionDate: "2024-01-15T08:30:00Z",
      assignedDoctor: "Dr. Rodríguez",
      room: "204",
      bed: "A",
      priority: "medium",
    },
    attachments: [
      {
        id: "att1",
        name: "cedula.pdf",
        type: "identification",
        url: "/files/cedula.pdf",
        uploadDate: "2024-01-15T08:30:00Z",
      },
    ],
  },
  {
    id: "2",
    personalInfo: {
      identificationType: "CC",
      identificationNumber: "87654321",
      fullName: "Juan Carlos Pérez",
      birthDate: "1972-03-22",
      age: 52,
      sex: "M",
      bloodType: "A-",
      allergies: [],
    },
    epsInfo: {
      eps: "NUEVA EPS",
      affiliationRegime: "Contributivo",
      affiliateType: "Cotizante",
      affiliationNumber: "NEP987654321",
      affiliationStatus: "Activo",
    },
    contactInfo: {
      address: "Carrera 20 #30-40, Cali",
      phone: "3009876543",
      emergencyContactName: "Ana Pérez",
      emergencyContactPhone: "3012345678",
      emergencyContactRelation: "Hija",
    },
    sociodemographic: {
      occupation: "Ingeniero",
      educationLevel: "Universitario",
      maritalStatus: "Divorciado",
    },
    medicalInfo: {
      currentSymptoms: "Dolor de pecho, dificultad respiratoria",
      symptomsOnset: "Esta mañana",
      symptomsIntensity: "Alta",
      painScale: 8,
      chronicConditions: "Diabetes tipo 2",
      previousHospitalizations: "Ninguna",
      insuranceAuthorization: "AUT-2024-002",
    },
    currentStatus: {
      status: "active",
      admissionDate: "2024-01-15T14:20:00Z",
      assignedDoctor: "Dr. Martínez",
      room: "301",
      bed: "B",
      priority: "high",
    },
    attachments: [],
  },
];

const generateMockBeds = (): Bed[] => [
  {
    id: "1",
    number: "101",
    ward: "General",
    type: "general",
    status: "available",
  },
  {
    id: "2",
    number: "102",
    ward: "General",
    type: "general",
    status: "occupied",
    patientId: "1",
    assignedDate: "2024-01-15T08:30:00Z",
  },
  { id: "3", number: "201", ward: "ICU", type: "icu", status: "available" },
  {
    id: "4",
    number: "301",
    ward: "Emergency",
    type: "emergency",
    status: "occupied",
    patientId: "2",
    assignedDate: "2024-01-15T14:20:00Z",
  },
  {
    id: "5",
    number: "302",
    ward: "Emergency",
    type: "emergency",
    status: "maintenance",
  },
];

export function MedicalDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // State management for all medical data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [telemedicineSessions, setTelemedicineSessions] = useState<TelemedicineSession[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [admissionRequests, setAdmissionRequests] = useState<AdmissionRequest[]>([]);
  const [educationModules, setEducationModules] = useState<EducationModule[]>([]);

  // Initialize with mock data
  useEffect(() => {
    loadFromLocal();
  }, []);

  // Patient management functions
  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient = { ...patient, id: Date.now().toString() };
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const getPatient = (id: string) => {
    return patients.find((p) => p.id === id);
  };

  const dischargePatient = (id: string, dischargeInfo: any) => {
    updatePatient(id, {
      currentStatus: {
        ...patients.find((p) => p.id === id)?.currentStatus!,
        status: "discharged",
      },
    });
  };

  const transferPatient = (id: string, transferInfo: any) => {
    updatePatient(id, {
      currentStatus: {
        ...patients.find((p) => p.id === id)?.currentStatus!,
        status: "transferred",
        room: transferInfo.toRoom,
        bed: transferInfo.toBed,
      },
    });
  };

  // Vital signs management
  const addVitalSigns = (vitals: Omit<VitalSigns, "id">) => {
    const newVitalSigns = { ...vitals, id: Date.now().toString() };
    setVitalSigns((prev) => [...prev, newVitalSigns]);
  };

  const getPatientVitalSigns = (patientId: string) => {
    return vitalSigns.filter((v) => v.patientId === patientId);
  };

  // Medication management
  const addMedication = (medication: Omit<Medication, "id">) => {
    const newMedication = { ...medication, id: Date.now().toString() };
    setMedications((prev) => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    );
  };

  const getPatientMedications = (patientId: string) => {
    return medications.filter((m) => m.patientId === patientId);
  };

  // Appointment management
  const scheduleAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = { ...appointment, id: Date.now().toString() };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  };

  const cancelAppointment = (id: string, reason: string) => {
    updateAppointment(id, { status: "cancelled", notes: reason });
  };

  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter((a) => a.date === today);
  };

  // Surgery management
  const scheduleSurgery = (surgery: Omit<Surgery, "id">) => {
    const newSurgery = { ...surgery, id: Date.now().toString() };
    setSurgeries((prev) => [...prev, newSurgery]);
  };

  const updateSurgery = (id: string, updates: Partial<Surgery>) => {
    setSurgeries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  };

  const getUpcomingSurgeries = () => {
    const now = new Date();
    return surgeries.filter((s) => new Date(s.scheduledDate) > now);
  };

  // Lab test management
  const orderLabTest = (test: Omit<LabTest, "id">) => {
    const newTest = { ...test, id: Date.now().toString() };
    setLabTests((prev) => [...prev, newTest]);
  };

  const updateLabTest = (id: string, updates: Partial<LabTest>) => {
    setLabTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const getPendingLabTests = () => {
    return labTests.filter(
      (t) => t.status === "ordered" || t.status === "scheduled",
    );
  };

  // Emergency management
  const activateEmergency = (emergency: Omit<Emergency, "id">) => {
    const newEmergency = { ...emergency, id: Date.now().toString() };
    setEmergencies((prev) => [...prev, newEmergency]);
  };

  const resolveEmergency = (id: string, resolution: string) => {
    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "resolved", notes: resolution } : e,
      ),
    );
  };

  const getActiveEmergencies = () => {
    return emergencies.filter((e) => e.status === "active");
  };

  // Bed management
  const assignBed = (bedId: string, patientId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: "occupied",
              patientId,
              assignedDate: new Date().toISOString(),
            }
          : b,
      ),
    );
  };

  const releaseBed = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: "available",
              patientId: undefined,
              assignedDate: undefined,
            }
          : b,
      ),
    );
  };

  const getAvailableBeds = (type?: string) => {
    return beds.filter(
      (b) => b.status === "available" && (!type || b.type === type),
    );
  };

  // Report management
  const generateReport = (report: Omit<MedicalReport, "id">) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      status: "generating" as const,
    };
    setReports((prev) => [...prev, newReport]);
    // Simulate report generation
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === newReport.id ? { ...r, status: "ready" } : r,
        ),
      );
    }, 2000);
  };

  const getReports = (type?: string) => {
    return type ? reports.filter((r) => r.type === type) : reports;
  };

  // Team communication
  const sendMessage = (message: Omit<TeamMessage, "id">) => {
    const newMessage = { ...message, id: Date.now().toString(), read: false };
    setMessages((prev) => [...prev, newMessage]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  };

  const getUnreadMessages = () => {
    return messages.filter((m) => !m.read);
  };

  // Telemedicine management
  const scheduleTelemedicine = (session: Omit<TelemedicineSession, "id">) => {
    const newSession = { ...session, id: Date.now().toString() };
    setTelemedicineSessions((prev) => [...prev, newSession]);
  };

  const updateTelemedicine = (id: string, updates: Partial<TelemedicineSession>) => {
    setTelemedicineSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return telemedicineSessions.filter((s) => new Date(s.scheduledDate) > now);
  };

  // Inventory management
  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem = { ...item, id: Date.now().toString() };
    setInventory((prev) => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates, lastUpdated: new Date().toISOString() } : i))
    );
  };

  const getLowStockItems = () => {
    return inventory.filter((item) => item.currentStock <= item.minimumStock);
  };

  const getInventoryByCategory = (category: string) => {
    return inventory.filter((item) => item.category === category);
  };

  // Admission request management
  const createAdmissionRequest = (request: Omit<AdmissionRequest, "id">) => {
    const newRequest = { ...request, id: Date.now().toString() };
    setAdmissionRequests((prev) => [...prev, newRequest]);
  };

  const updateAdmissionRequest = (id: string, updates: Partial<AdmissionRequest>) => {
    setAdmissionRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const getPendingAdmissions = () => {
    return admissionRequests.filter((req) => req.status === "pending");
  };

  // Medical education management
  const addEducationModule = (module: Omit<EducationModule, "id">) => {
    const newModule = { ...module, id: Date.now().toString() };
    setEducationModules((prev) => [...prev, newModule]);
  };

  const updateEducationModule = (id: string, updates: Partial<EducationModule>) => {
    setEducationModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const markModuleCompleted = (moduleId: string, userId: string) => {
    setEducationModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, completedBy: [...m.completedBy, userId] }
          : m
      )
    );
  };

  const getUserProgress = (userId: string) => {
    return educationModules.filter((module) => module.completedBy.includes(userId));
  };

  // Statistics
  const getStatistics = () => ({
    totalPatients: patients.length,
    activePatients: patients.filter((p) => p.currentStatus.status === "active")
      .length,
    availableBeds: beds.filter((b) => b.status === "available").length,
    todaysAppointments: getTodaysAppointments().length,
    emergencies: getActiveEmergencies().length,
    pendingLabTests: getPendingLabTests().length,
  });

  // Data persistence
  const saveToLocal = () => {
    const data = {
      patients,
      vitalSigns,
      medications,
      appointments,
      surgeries,
      labTests,
      emergencies,
      beds,
      reports,
      messages,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem("vital-red-medical-data", JSON.stringify(data));
  };

  const loadFromLocal = () => {
    const saved = localStorage.getItem("vital-red-medical-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPatients(data.patients || generateMockPatients());
        setVitalSigns(data.vitalSigns || []);
        setMedications(data.medications || []);
        setAppointments(data.appointments || []);
        setSurgeries(data.surgeries || []);
        setLabTests(data.labTests || []);
        setEmergencies(data.emergencies || []);
        setBeds(data.beds || generateMockBeds());
        setReports(data.reports || []);
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error loading medical data:", error);
        // Initialize with mock data on error
        setPatients(generateMockPatients());
        setBeds(generateMockBeds());
      }
    } else {
      // Initialize with mock data
      setPatients(generateMockPatients());
      setBeds(generateMockBeds());
    }
  };

  const clearAllData = () => {
    setPatients([]);
    setVitalSigns([]);
    setMedications([]);
    setAppointments([]);
    setSurgeries([]);
    setLabTests([]);
    setEmergencies([]);
    setBeds([]);
    setReports([]);
    setMessages([]);
    localStorage.removeItem("vital-red-medical-data");
  };

  // Auto-save on data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocal();
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    patients,
    vitalSigns,
    medications,
    appointments,
    surgeries,
    labTests,
    emergencies,
    beds,
    reports,
    messages,
  ]);

  const value: MedicalDataContextType = {
    patients,
    activePatients: patients.filter((p) => p.currentStatus.status === "active"),
    addPatient,
    updatePatient,
    getPatient,
    dischargePatient,
    transferPatient,
    vitalSigns,
    addVitalSigns,
    getPatientVitalSigns,
    medications,
    addMedication,
    updateMedication,
    getPatientMedications,
    appointments,
    scheduleAppointment,
    updateAppointment,
    cancelAppointment,
    getTodaysAppointments,
    surgeries,
    scheduleSurgery,
    updateSurgery,
    getUpcomingSurgeries,
    labTests,
    orderLabTest,
    updateLabTest,
    getPendingLabTests,
    emergencies,
    activateEmergency,
    resolveEmergency,
    getActiveEmergencies,
    beds,
    assignBed,
    releaseBed,
    getAvailableBeds,
    reports,
    generateReport,
    getReports,
    messages,
    sendMessage,
    markMessageAsRead,
    getUnreadMessages,
    getStatistics,
    saveToLocal,
    loadFromLocal,
    clearAllData,
  };

  return (
    <MedicalDataContext.Provider value={value}>
      {children}
    </MedicalDataContext.Provider>
  );
}

export function useMedicalData() {
  const context = useContext(MedicalDataContext);
  if (context === undefined) {
    throw new Error("useMedicalData must be used within a MedicalDataProvider");
  }
  return context;
}
