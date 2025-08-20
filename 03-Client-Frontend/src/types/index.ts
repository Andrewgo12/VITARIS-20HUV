/**
 * TypeScript Type Definitions for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

// Base types
export type ID = string | number;
export type Timestamp = string; // ISO string
export type Email = string;
export type PhoneNumber = string;
export type DocumentNumber = string;

// User types
export type UserRole = 'medical_evaluator' | 'administrator';

export interface User {
  id: ID;
  email: Email;
  name: string;
  role: UserRole;
  permissions: string[];
  isActive?: boolean;
  lastLogin?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CreateUserRequest {
  email: Email;
  name: string;
  password: string;
  role: UserRole;
  permissions?: string[];
}

export interface UpdateUserRequest {
  email?: Email;
  name?: string;
  role?: UserRole;
  permissions?: string[];
  isActive?: boolean;
}

// Authentication types
export interface LoginCredentials {
  email: Email;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: Timestamp;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Medical case types
export type CaseStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'cancelled';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type PriorityLevel = 'baja' | 'media' | 'alta' | 'critico';

export interface Patient {
  id: ID;
  documentNumber: DocumentNumber;
  documentType: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: 'M' | 'F' | 'O';
  birthDate?: Timestamp;
  phone?: PhoneNumber;
  email?: Email;
  address?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  insuranceType?: string;
  emergencyContact?: Record<string, any>;
  medicalHistory?: Record<string, any>;
  allergies?: string[];
  currentMedications?: string[];
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface MedicalCase {
  id: ID;
  patientId: ID;
  patient?: Patient;
  patientName: string;
  patientDocument: DocumentNumber;
  diagnosis: string;
  urgency: UrgencyLevel;
  priority: PriorityLevel;
  status: CaseStatus;
  submittedDate: Timestamp;
  evaluatorId?: ID;
  evaluator?: User;
  notes?: string;
  attachments?: Attachment[];
  referralId?: ID;
  referral?: MedicalReferral;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CreateMedicalCaseRequest {
  patientId: ID;
  diagnosis: string;
  urgency: UrgencyLevel;
  priority?: PriorityLevel;
  notes?: string;
  attachments?: File[];
}

export interface UpdateMedicalCaseRequest {
  diagnosis?: string;
  urgency?: UrgencyLevel;
  priority?: PriorityLevel;
  status?: CaseStatus;
  notes?: string;
  evaluatorId?: ID;
}

// Email and referral types
export type EmailStatus = 'pending' | 'processing' | 'processed' | 'error' | 'quarantined';
export type ReferralStatus = 'pending' | 'in_review' | 'assigned' | 'completed' | 'cancelled' | 'expired';
export type ReferralType = 'interconsulta' | 'urgente' | 'programada' | 'seguimiento';
export type DocumentType = 'epicrisis' | 'laboratorio' | 'imagen' | 'receta' | 'remision' | 'consulta' | 'procedimiento' | 'alta';

export interface EmailMessage {
  id: ID;
  gmailId: string;
  threadId?: string;
  subject: string;
  senderEmail: Email;
  senderName?: string;
  recipientEmail?: Email;
  dateReceived: Timestamp;
  dateProcessed?: Timestamp;
  bodyText?: string;
  bodyHtml?: string;
  snippet?: string;
  processingStatus: EmailStatus;
  isMedicalReferral: boolean;
  referralType?: ReferralType;
  priorityLevel: PriorityLevel;
  patientData?: Record<string, any>;
  medicalData?: Record<string, any>;
  extractedEntities?: Record<string, any>;
  confidenceScore?: number;
  errorMessage?: string;
  retryCount?: number;
  attachments?: EmailAttachment[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EmailAttachment {
  id: ID;
  emailMessageId: ID;
  filename: string;
  originalFilename?: string;
  mimeType?: string;
  fileSize?: number;
  filePath?: string;
  attachmentId?: string;
  documentType?: DocumentType;
  extractedText?: string;
  extractionConfidence?: number;
  isEncrypted?: boolean;
  processingStatus: EmailStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface MedicalReferral {
  id: ID;
  referralNumber: string;
  emailMessageId?: ID;
  emailMessage?: EmailMessage;
  patientRecordId?: ID;
  patient?: Patient;
  referralType: ReferralType;
  specialtyRequested: string;
  priorityLevel: PriorityLevel;
  status: ReferralStatus;
  primaryDiagnosis?: string;
  secondaryDiagnoses?: string[];
  clinicalSummary?: string;
  reasonForReferral?: string;
  currentMedications?: string[];
  relevantHistory?: string;
  vitalSigns?: Record<string, any>;
  labResults?: Record<string, any>;
  imagingResults?: Record<string, any>;
  referringHospital?: string;
  referringPhysician?: string;
  referringDepartment?: string;
  assignedTo?: string;
  assignedAt?: Timestamp;
  appointmentDate?: Timestamp;
  appointmentLocation?: string;
  referralDate: Timestamp;
  responseDate?: Timestamp;
  completionDate?: Timestamp;
  expiryDate?: Timestamp;
  notes?: string;
  internalNotes?: string;
  attachmentsCount?: number;
  followUpRequired?: boolean;
  followUpDate?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// File and attachment types
export interface Attachment {
  id: ID;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Timestamp;
  uploadedBy: ID;
}

export interface FileUploadResponse {
  id: ID;
  url: string;
  filename: string;
  size: number;
}

// API response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  timestamp: Timestamp;
  data?: any;
  room?: string;
}

export type WebSocketEventType = 
  | 'connection_established'
  | 'new_email'
  | 'new_referral'
  | 'referral_updated'
  | 'processing_status'
  | 'system_alert'
  | 'statistics'
  | 'ping'
  | 'pong'
  | 'error'
  | 'join_room'
  | 'leave_room';

// Dashboard and statistics types
export interface DashboardStats {
  totalCases: number;
  pendingCases: number;
  approvedCases: number;
  rejectedCases: number;
  totalEmails: number;
  processedEmails: number;
  pendingEmails: number;
  errorEmails: number;
  totalReferrals: number;
  activeReferrals: number;
  completedReferrals: number;
  averageProcessingTime: number;
  lastUpdate: Timestamp;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  activeConnections: number;
  queueSize: number;
  errorRate: number;
  responseTime: number;
}

// Filter and search types
export interface CaseFilters {
  status?: CaseStatus[];
  urgency?: UrgencyLevel[];
  evaluator?: ID[];
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
  search?: string;
}

export interface EmailFilters {
  status?: EmailStatus[];
  isReferral?: boolean;
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
  sender?: string;
  search?: string;
}

export interface ReferralFilters {
  status?: ReferralStatus[];
  specialty?: string[];
  priority?: PriorityLevel[];
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
  search?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | undefined;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Notification types
export interface Notification {
  id: ID;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Timestamp;
  read: boolean;
  userId: ID;
  data?: Record<string, any>;
}

// Configuration types
export interface GmailConfig {
  enabled: boolean;
  interval: number;
  emailAccount: Email;
  oauthConfigured: boolean;
  lastSync: Timestamp;
  totalCaptured: number;
  errorCount: number;
  filterKeywords: string[];
  senderDomains: string[];
  subjectFilters: string[];
  excludeKeywords: string[];
  emailNotifications: boolean;
  notificationEmail: Email;
  alertThreshold: number;
  dailyReport: boolean;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Export all types as default
export default {
  // Re-export all types for convenience
};
