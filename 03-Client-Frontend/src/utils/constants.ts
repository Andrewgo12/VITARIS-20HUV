/**
 * Constants for VITAL RED Application
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

// Application Constants
export const APP_NAME = 'VITAL RED';
export const APP_VERSION = '2.0.0';
export const HOSPITAL_NAME = 'Hospital Universitaria ESE';
export const DEPARTMENT = 'Departamento de Innovación y Desarrollo';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  MEDICAL_CASES: {
    LIST: '/medical-cases',
    DETAIL: '/medical-cases/:id',
    UPDATE: '/medical-cases/:id',
    APPROVE: '/medical-cases/:id/approve',
    REJECT: '/medical-cases/:id/reject',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  GMAIL: {
    EMAILS: '/emails',
    EMAIL_DETAIL: '/emails/:id',
    STATISTICS: '/statistics',
    SYNC: '/service/sync',
    STATUS: '/service/status',
    REFERRALS: '/referrals',
    PATIENTS: '/patients',
  },
} as const;

// User Roles
export const USER_ROLES = {
  MEDICAL_EVALUATOR: 'medical_evaluator',
  ADMINISTRATOR: 'administrator',
} as const;

// Permissions
export const PERMISSIONS = {
  VIEW_MEDICAL_CASES: 'view_medical_cases',
  EDIT_MEDICAL_CASES: 'edit_medical_cases',
  APPROVE_MEDICAL_CASES: 'approve_medical_cases',
  REJECT_MEDICAL_CASES: 'reject_medical_cases',
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_REPORTS: 'view_reports',
  MANAGE_SYSTEM: 'manage_system',
  VIEW_GMAIL_INTEGRATION: 'view_gmail_integration',
  CONFIGURE_GMAIL: 'configure_gmail',
} as const;

// Case Status
export const CASE_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

// Case Urgency Levels
export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Email Processing Status
export const EMAIL_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  ERROR: 'error',
  QUARANTINED: 'quarantined',
} as const;

// Referral Status
export const REFERRAL_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  ASSIGNED: 'assigned',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICO: 'critico',
} as const;

// Medical Specialties
export const MEDICAL_SPECIALTIES = {
  CARDIOLOGIA: 'cardiologia',
  NEUROLOGIA: 'neurologia',
  GASTROENTEROLOGIA: 'gastroenterologia',
  NEUMOLOGIA: 'neumologia',
  ENDOCRINOLOGIA: 'endocrinologia',
  NEFROLOGIA: 'nefrologia',
  ONCOLOGIA: 'oncologia',
  DERMATOLOGIA: 'dermatologia',
  OFTALMOLOGIA: 'oftalmologia',
  OTORRINOLARINGOLOGIA: 'otorrinolaringologia',
  UROLOGIA: 'urologia',
  GINECOLOGIA: 'ginecologia',
  PEDIATRIA: 'pediatria',
  GERIATRIA: 'geriatria',
  PSIQUIATRIA: 'psiquiatria',
  MEDICINA_INTERNA: 'medicina_interna',
  CIRUGIA_GENERAL: 'cirugia_general',
  TRAUMATOLOGIA: 'traumatologia',
  ANESTESIOLOGIA: 'anestesiologia',
  RADIOLOGIA: 'radiologia',
} as const;

// Document Types
export const DOCUMENT_TYPES = {
  EPICRISIS: 'epicrisis',
  LABORATORIO: 'laboratorio',
  IMAGEN: 'imagen',
  RECETA: 'receta',
  REMISION: 'remision',
  CONSULTA: 'consulta',
  PROCEDIMIENTO: 'procedimiento',
  ALTA: 'alta',
} as const;

// Referral Types
export const REFERRAL_TYPES = {
  INTERCONSULTA: 'interconsulta',
  URGENTE: 'urgente',
  PROGRAMADA: 'programada',
  SEGUIMIENTO: 'seguimiento',
} as const;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/vital-red/dashboard',
  MEDICAL_CASES: '/vital-red/medical-cases',
  CASE_DETAIL: '/vital-red/case-detail',
  REQUEST_HISTORY: '/vital-red/request-history',
  USER_MANAGEMENT: '/vital-red/user-management',
  SUPERVISION: '/vital-red/supervision',
  SYSTEM_CONFIG: '/vital-red/system-config',
  BACKUP_MANAGEMENT: '/vital-red/backup-management',
  EMAIL_MONITOR: '/vital-red/email-monitor',
  EMAIL_CONFIG: '/vital-red/email-config',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'user_preferences',
} as const;

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Language Options
export const LANGUAGES = {
  SPANISH: 'es',
  ENGLISH: 'en',
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
  ISO: 'yyyy-MM-dd',
  DISPLAY: 'dd \'de\' MMMM \'de\' yyyy',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt'],
} as const;

// WebSocket Events
export const WEBSOCKET_EVENTS = {
  CONNECTION_ESTABLISHED: 'connection_established',
  NEW_EMAIL: 'new_email',
  NEW_REFERRAL: 'new_referral',
  REFERRAL_UPDATED: 'referral_updated',
  PROCESSING_STATUS: 'processing_status',
  SYSTEM_ALERT: 'system_alert',
  STATISTICS: 'statistics',
  PING: 'ping',
  PONG: 'pong',
  ERROR: 'error',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
} as const;

// WebSocket Rooms
export const WEBSOCKET_ROOMS = {
  DASHBOARD: 'dashboard',
  EMAILS: 'emails',
  REFERRALS: 'referrals',
  ALERTS: 'alerts',
  PROCESSING: 'processing',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Intente nuevamente.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  TOKEN_EXPIRED: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente.',
  SAVE_SUCCESS: 'Datos guardados exitosamente.',
  UPDATE_SUCCESS: 'Datos actualizados exitosamente.',
  DELETE_SUCCESS: 'Elemento eliminado exitosamente.',
  APPROVAL_SUCCESS: 'Caso aprobado exitosamente.',
  REJECTION_SUCCESS: 'Caso rechazado exitosamente.',
  SYNC_SUCCESS: 'Sincronización completada exitosamente.',
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Ingrese un email válido.',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.',
  },
  PHONE: {
    PATTERN: /^[+]?[\d\s\-\(\)]{10,}$/,
    MESSAGE: 'Ingrese un número de teléfono válido.',
  },
  DOCUMENT: {
    PATTERN: /^\d{6,12}$/,
    MESSAGE: 'El documento debe tener entre 6 y 12 dígitos.',
  },
} as const;

// Export all constants as default
export default {
  APP_NAME,
  APP_VERSION,
  HOSPITAL_NAME,
  DEPARTMENT,
  API_ENDPOINTS,
  USER_ROLES,
  PERMISSIONS,
  CASE_STATUS,
  URGENCY_LEVELS,
  EMAIL_STATUS,
  REFERRAL_STATUS,
  PRIORITY_LEVELS,
  MEDICAL_SPECIALTIES,
  DOCUMENT_TYPES,
  REFERRAL_TYPES,
  ROUTES,
  STORAGE_KEYS,
  THEMES,
  LANGUAGES,
  DATE_FORMATS,
  PAGINATION,
  FILE_UPLOAD,
  WEBSOCKET_EVENTS,
  WEBSOCKET_ROOMS,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
};
