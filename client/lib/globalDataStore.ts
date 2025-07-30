/**
 * Global JSON Data Store
 * Centralizes all medical data for fast access across all views
 */

import React from "react";
import {
  Patient,
  VitalSigns,
  Medication,
  Appointment,
  Surgery,
  LabTest,
  Emergency,
  Bed,
  MedicalReport,
  TeamMessage,
  TelemedicineSession,
  InventoryItem,
  AdmissionRequest,
  EducationModule,
} from "@/context/MedicalDataContext";

export interface GlobalMedicalData {
  // Core medical data
  patients: Patient[];
  vitalSigns: VitalSigns[];
  medications: Medication[];
  appointments: Appointment[];
  surgeries: Surgery[];
  labTests: LabTest[];
  emergencies: Emergency[];
  beds: Bed[];
  reports: MedicalReport[];
  messages: TeamMessage[];
  telemedicineSessions: TelemedicineSession[];
  inventory: InventoryItem[];
  admissionRequests: AdmissionRequest[];
  educationModules: EducationModule[];

  // View-specific data
  viewData: {
    activePatients: ViewActivityData[];
    icuMonitoring: ICUMonitoringData[];
    pharmacyManagement: PharmacyData[];
    labsImaging: LabImagingData[];
    emergencyProtocols: EmergencyProtocolData[];
    teamCommunication: TeamCommunicationData[];
    bedsManagement: BedsManagementData[];
    admissionsManagement: AdmissionsData[];
    surgerySchedule: SurgeryScheduleData[];
    appointmentsScheduler: AppointmentSchedulerData[];
    clinicalReports: ClinicalReportsData[];
    telemedicine: TelemedicineData[];
    medicalEducation: MedicalEducationData[];
    patientTracking: PatientTrackingData[];
    vitalSignsMonitoring: VitalSignsMonitoringData[];
  };

  // System metadata
  metadata: {
    lastUpdated: string;
    version: string;
    dataIntegrity: boolean;
    totalRecords: number;
    viewsLastAccessed: Record<string, string>;
  };
}

// View-specific data interfaces
export interface ViewActivityData {
  viewId: string;
  patientId: string;
  lastActivity: string;
  activityType: string;
  data: any;
}

export interface ICUMonitoringData {
  id: string;
  patientId: string;
  bedNumber: string;
  severity: "CRITICO" | "GRAVE" | "MODERADO" | "ESTABLE";
  ventilator: {
    status: "CONECTADO" | "DESCONECTADO";
    mode: string;
    fio2: number;
    peep: number;
  };
  vitals: {
    hr: { value: number; trend: string; alert: boolean };
    bp: { systolic: number; diastolic: number; trend: string; alert: boolean };
    temp: { value: number; trend: string; alert: boolean };
    spo2: { value: number; trend: string; alert: boolean };
    rr: { value: number; trend: string; alert: boolean };
  };
  medications: string[];
  interventions: string[];
  glasgow: number;
  apache: number;
  lastUpdate: string;
}

export interface PharmacyData {
  id: string;
  patientId: string;
  medication: string;
  dose: string;
  frequency: string;
  route: string;
  status: "ACTIVO" | "PAUSADO" | "TERMINADO";
  prescriber: string;
  startDate: string;
  endDate: string;
  stock: number;
  interactions: string[];
  allergies: boolean;
}

export interface LabImagingData {
  id: string;
  patientId: string;
  type: "LAB" | "IMAGING";
  testName: string;
  orderedBy: string;
  orderedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  status: "ORDERED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  results?: string;
  priority: "STAT" | "URGENT" | "ROUTINE";
  notes?: string;
}

export interface EmergencyProtocolData {
  id: string;
  code: string;
  level: "CODIGO_AZUL" | "CODIGO_ROJO" | "CODIGO_NARANJA" | "CODIGO_AMARILLO";
  location: string;
  patientId?: string;
  activatedBy: string;
  activatedAt: string;
  status: "ACTIVO" | "RESUELTO" | "ESCALADO";
  responseTeam: string[];
  timeline: Array<{
    timestamp: string;
    action: string;
    performedBy: string;
  }>;
}

export interface TeamCommunicationData {
  id: string;
  teamId: string;
  senderId: string;
  senderName: string;
  message: string;
  type: "URGENT" | "NORMAL" | "BROADCAST" | "SHIFT_HANDOVER";
  timestamp: string;
  read: boolean;
  attachments?: string[];
  recipients?: string[];
}

export interface BedsManagementData {
  id: string;
  bedNumber: string;
  ward: string;
  type: "ICU" | "EMERGENCY" | "GENERAL" | "PRIVATE";
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
  patientId?: string;
  assignedDate?: string;
  cleaningStatus: "CLEAN" | "NEEDS_CLEANING" | "CLEANING_IN_PROGRESS";
  equipment: string[];
  lastMaintenanceDate: string;
}

export interface AdmissionsData {
  id: string;
  patientId: string;
  admissionType: "EMERGENCY" | "SCHEDULED" | "TRANSFER";
  requestedBy: string;
  requestDate: string;
  expectedAdmissionDate: string;
  department: string;
  reason: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "APPROVED" | "REJECTED" | "ADMITTED";
  approvedBy?: string;
  bedAssigned?: string;
  notes?: string;
}

export interface SurgeryScheduleData {
  id: string;
  patientId: string;
  surgeonId: string;
  surgeonName: string;
  surgeryType: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  operatingRoom: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DELAYED";
  anesthesiologist?: string;
  assistants: string[];
  equipment: string[];
  preOpNotes?: string;
  postOpNotes?: string;
}

export interface AppointmentSchedulerData {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  appointmentType: "CONSULTATION" | "FOLLOW_UP" | "PROCEDURE" | "THERAPY";
  status:
    | "SCHEDULED"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";
  reason: string;
  notes?: string;
  telehealth: boolean;
}

export interface ClinicalReportsData {
  id: string;
  patientId?: string;
  reportType:
    | "PATIENT_SUMMARY"
    | "DEPARTMENT_STATS"
    | "QUALITY_METRICS"
    | "FINANCIAL";
  title: string;
  generatedBy: string;
  generatedDate: string;
  period: {
    start: string;
    end: string;
  };
  data: any;
  format: "PDF" | "EXCEL" | "CSV" | "JSON";
  status: "GENERATING" | "READY" | "DOWNLOADED" | "ARCHIVED";
  downloadCount: number;
}

export interface TelemedicineData {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  sessionType: "CONSULTATION" | "FOLLOW_UP" | "EMERGENCY" | "THERAPY";
  scheduledDate: string;
  duration: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  platform: "ZOOM" | "TEAMS" | "CUSTOM";
  sessionUrl?: string;
  recordingUrl?: string;
  notes?: string;
  prescriptions?: string[];
  quality: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
}

export interface MedicalEducationData {
  id: string;
  courseId: string;
  userId: string;
  courseTitle: string;
  instructor: string;
  category: "CLINICAL" | "SAFETY" | "PROCEDURES" | "TECHNOLOGY";
  progress: number;
  enrollmentDate: string;
  completionDate?: string;
  certificateId?: string;
  score?: number;
  timeSpent: number; // in minutes
  modules: Array<{
    id: string;
    title: string;
    completed: boolean;
    completedDate?: string;
    score?: number;
  }>;
}

export interface PatientTrackingData {
  id: string;
  patientId: string;
  currentLocation: string;
  previousLocation?: string;
  timestamp: string;
  status: "IN_ROOM" | "IN_PROCEDURE" | "IN_TRANSIT" | "DISCHARGED";
  trackingMethod: "RFID" | "MANUAL" | "QR_CODE";
  recordedBy: string;
  notes?: string;
}

export interface VitalSignsMonitoringData {
  id: string;
  patientId: string;
  deviceId?: string;
  monitoringType: "CONTINUOUS" | "PERIODIC" | "MANUAL";
  alertsEnabled: boolean;
  alertThresholds: {
    heartRate: { min: number; max: number };
    bloodPressure: { systolicMax: number; diastolicMax: number };
    temperature: { min: number; max: number };
    oxygenSaturation: { min: number };
  };
  lastReading: string;
  trend: "IMPROVING" | "STABLE" | "DECLINING" | "CRITICAL";
  alerts: Array<{
    timestamp: string;
    type: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    acknowledged: boolean;
    acknowledgedBy?: string;
  }>;
}

// Global data store class
export class GlobalDataStore {
  private static instance: GlobalDataStore;
  private data: GlobalMedicalData;
  private subscribers: Array<(data: GlobalMedicalData) => void> = [];

  private constructor() {
    this.data = this.initializeData();
    this.loadFromStorage();
  }

  public static getInstance(): GlobalDataStore {
    if (!GlobalDataStore.instance) {
      GlobalDataStore.instance = new GlobalDataStore();
    }
    return GlobalDataStore.instance;
  }

  private initializeData(): GlobalMedicalData {
    return {
      patients: [],
      vitalSigns: [],
      medications: [],
      appointments: [],
      surgeries: [],
      labTests: [],
      emergencies: [],
      beds: [],
      reports: [],
      messages: [],
      telemedicineSessions: [],
      inventory: [],
      admissionRequests: [],
      educationModules: [],
      viewData: {
        activePatients: [],
        icuMonitoring: [],
        pharmacyManagement: [],
        labsImaging: [],
        emergencyProtocols: [],
        teamCommunication: [],
        bedsManagement: [],
        admissionsManagement: [],
        surgerySchedule: [],
        appointmentsScheduler: [],
        clinicalReports: [],
        telemedicine: [],
        medicalEducation: [],
        patientTracking: [],
        vitalSignsMonitoring: [],
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: "1.0.0",
        dataIntegrity: true,
        totalRecords: 0,
        viewsLastAccessed: {},
      },
    };
  }

  // Subscribe to data changes
  public subscribe(callback: (data: GlobalMedicalData) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  // Notify all subscribers of data changes
  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.data));
  }

  // Get all data
  public getData(): GlobalMedicalData {
    return { ...this.data };
  }

  // Get data for a specific view
  public getViewData<T>(viewName: keyof GlobalMedicalData["viewData"]): T[] {
    return this.data.viewData[viewName] as T[];
  }

  // Update data for a specific view
  public updateViewData<T>(
    viewName: keyof GlobalMedicalData["viewData"],
    data: T[],
  ): void {
    this.data.viewData[viewName] = data as any;
    this.updateMetadata();
    this.saveToStorage();
    this.notifySubscribers();
  }

  // Add data to a specific view
  public addViewData<T>(
    viewName: keyof GlobalMedicalData["viewData"],
    newData: T,
  ): void {
    const currentData = this.data.viewData[viewName] as T[];
    currentData.push(newData);
    this.updateMetadata();
    this.saveToStorage();
    this.notifySubscribers();
  }

  // Update core medical data
  public updateCoreData<
    K extends keyof Omit<GlobalMedicalData, "viewData" | "metadata">,
  >(dataType: K, data: GlobalMedicalData[K]): void {
    this.data[dataType] = data;
    this.updateMetadata();
    this.saveToStorage();
    this.notifySubscribers();
  }

  // Record view access
  public recordViewAccess(viewName: string): void {
    this.data.metadata.viewsLastAccessed[viewName] = new Date().toISOString();
    this.saveToStorage();
  }

  // Get view access data
  public getViewAccessData(): Record<string, string> {
    return { ...this.data.metadata.viewsLastAccessed };
  }

  // Search across all data
  public search(query: string): {
    patients: Patient[];
    medications: Medication[];
    appointments: Appointment[];
    labTests: LabTest[];
    emergencies: Emergency[];
    [key: string]: any[];
  } {
    const lowercaseQuery = query.toLowerCase();

    return {
      patients: this.data.patients.filter(
        (p) =>
          p.personalInfo.fullName.toLowerCase().includes(lowercaseQuery) ||
          p.personalInfo.identificationNumber.includes(query),
      ),
      medications: this.data.medications.filter(
        (m) =>
          m.name.toLowerCase().includes(lowercaseQuery) ||
          m.instructions.toLowerCase().includes(lowercaseQuery),
      ),
      appointments: this.data.appointments.filter(
        (a) =>
          a.doctorName.toLowerCase().includes(lowercaseQuery) ||
          a.reason.toLowerCase().includes(lowercaseQuery),
      ),
      labTests: this.data.labTests.filter(
        (l) =>
          l.type.toLowerCase().includes(lowercaseQuery) ||
          l.orderedBy.toLowerCase().includes(lowercaseQuery),
      ),
      emergencies: this.data.emergencies.filter(
        (e) =>
          e.code.toLowerCase().includes(lowercaseQuery) ||
          e.location.toLowerCase().includes(lowercaseQuery),
      ),
    };
  }

  // Get data analytics
  public getAnalytics(): {
    totalRecords: number;
    viewActivitySummary: Record<string, number>;
    dataIntegrity: boolean;
    lastUpdated: string;
  } {
    const viewActivitySummary: Record<string, number> = {};

    Object.entries(this.data.viewData).forEach(([viewName, data]) => {
      viewActivitySummary[viewName] = Array.isArray(data) ? data.length : 0;
    });

    const totalRecords = Object.values(this.data).reduce((total, value) => {
      if (Array.isArray(value)) {
        return total + value.length;
      }
      if (typeof value === "object" && value !== null && "viewData" in value) {
        return (
          total +
          Object.values((value as any).viewData).reduce(
            (subtotal: number, subvalue: any) => {
              return subtotal + (Array.isArray(subvalue) ? subvalue.length : 0);
            },
            0,
          )
        );
      }
      return total;
    }, 0);

    return {
      totalRecords,
      viewActivitySummary,
      dataIntegrity: this.data.metadata.dataIntegrity,
      lastUpdated: this.data.metadata.lastUpdated,
    };
  }

  // Private methods
  private updateMetadata(): void {
    this.data.metadata.lastUpdated = new Date().toISOString();
    this.data.metadata.totalRecords = this.calculateTotalRecords();
  }

  private calculateTotalRecords(): number {
    let total = 0;

    // Count core data
    const coreDataKeys: (keyof Omit<
      GlobalMedicalData,
      "viewData" | "metadata"
    >)[] = [
      "patients",
      "vitalSigns",
      "medications",
      "appointments",
      "surgeries",
      "labTests",
      "emergencies",
      "beds",
      "reports",
      "messages",
      "telemedicineSessions",
      "inventory",
      "admissionRequests",
      "educationModules",
    ];

    coreDataKeys.forEach((key) => {
      total += this.data[key].length;
    });

    // Count view data
    Object.values(this.data.viewData).forEach((viewData) => {
      total += viewData.length;
    });

    return total;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem("global-medical-data", JSON.stringify(this.data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      this.data.metadata.dataIntegrity = false;
    }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem("global-medical-data");
      if (saved) {
        const parsedData = JSON.parse(saved);
        this.data = { ...this.data, ...parsedData };
        this.data.metadata.dataIntegrity = true;
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      this.data.metadata.dataIntegrity = false;
    }
  }

  // Export data as JSON
  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  // Import data from JSON
  public importData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      this.data = { ...this.data, ...importedData };
      this.updateMetadata();
      this.saveToStorage();
      this.notifySubscribers();
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  // Clear all data
  public clearAllData(): void {
    this.data = this.initializeData();
    this.saveToStorage();
    this.notifySubscribers();
  }
}

// Export singleton instance
export const globalDataStore = GlobalDataStore.getInstance();

// Utility hooks for React components
export function useGlobalData() {
  const [data, setData] = React.useState(globalDataStore.getData());

  React.useEffect(() => {
    const unsubscribe = globalDataStore.subscribe(setData);
    return unsubscribe;
  }, []);

  return {
    data,
    updateViewData: globalDataStore.updateViewData.bind(globalDataStore),
    addViewData: globalDataStore.addViewData.bind(globalDataStore),
    updateCoreData: globalDataStore.updateCoreData.bind(globalDataStore),
    recordViewAccess: globalDataStore.recordViewAccess.bind(globalDataStore),
    search: globalDataStore.search.bind(globalDataStore),
    getAnalytics: globalDataStore.getAnalytics.bind(globalDataStore),
    exportData: globalDataStore.exportData.bind(globalDataStore),
    importData: globalDataStore.importData.bind(globalDataStore),
    clearAllData: globalDataStore.clearAllData.bind(globalDataStore),
  };
}
