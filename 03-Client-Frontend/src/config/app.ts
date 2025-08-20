/**
 * Application Configuration for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

// Environment variables
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  GMAIL_API_URL: import.meta.env.VITE_GMAIL_API_URL || 'http://localhost:8001',
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8002',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: 'VITAL RED',
  VERSION: '2.0.0',
  DESCRIPTION: 'Sistema de Evaluación Médica Automatizada',
  HOSPITAL: 'Hospital Universitaria ESE',
  DEPARTMENT: 'Departamento de Innovación y Desarrollo',
  SUPPORT_EMAIL: 'soporte@hospital-ese.com',
  DOCUMENTATION_URL: 'https://docs.vital-red.com',
  GITHUB_URL: 'https://github.com/hospital-ese/vital-red',
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_GMAIL_INTEGRATION: import.meta.env.VITE_ENABLE_GMAIL_INTEGRATION === 'true',
  ENABLE_REAL_TIME_UPDATES: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES !== 'false',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: isDevelopment && import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_MOCK_DATA: isDevelopment && import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
} as const;

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    DEFAULT: import.meta.env.VITE_DEFAULT_THEME || 'light',
    STORAGE_KEY: 'vital-red-theme',
  },
  LANGUAGE: {
    DEFAULT: import.meta.env.VITE_DEFAULT_LANGUAGE || 'es',
    STORAGE_KEY: 'vital-red-language',
    SUPPORTED: ['es', 'en'],
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10'),
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
    MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'),
  },
  TOAST: {
    DURATION: parseInt(import.meta.env.VITE_TOAST_DURATION || '5000'),
    MAX_TOASTS: parseInt(import.meta.env.VITE_MAX_TOASTS || '5'),
  },
  MODAL: {
    CLOSE_ON_ESCAPE: import.meta.env.VITE_MODAL_CLOSE_ON_ESCAPE !== 'false',
    CLOSE_ON_OVERLAY_CLICK: import.meta.env.VITE_MODAL_CLOSE_ON_OVERLAY !== 'false',
  },
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'), // 1 hour
  TOKEN_REFRESH_THRESHOLD: parseInt(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD || '300000'), // 5 minutes
  MAX_LOGIN_ATTEMPTS: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5'),
  LOCKOUT_DURATION: parseInt(import.meta.env.VITE_LOCKOUT_DURATION || '900000'), // 15 minutes
  ENABLE_2FA: import.meta.env.VITE_ENABLE_2FA === 'true',
  ENABLE_SESSION_MONITORING: import.meta.env.VITE_ENABLE_SESSION_MONITORING !== 'false',
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB
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
  UPLOAD_ENDPOINT: '/files/upload',
  CHUNK_SIZE: parseInt(import.meta.env.VITE_UPLOAD_CHUNK_SIZE || '1048576'), // 1MB
} as const;

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: parseInt(import.meta.env.VITE_WS_RECONNECT_INTERVAL || '5000'),
  MAX_RECONNECT_ATTEMPTS: parseInt(import.meta.env.VITE_WS_MAX_RECONNECT_ATTEMPTS || '10'),
  HEARTBEAT_INTERVAL: parseInt(import.meta.env.VITE_WS_HEARTBEAT_INTERVAL || '30000'),
  CONNECTION_TIMEOUT: parseInt(import.meta.env.VITE_WS_CONNECTION_TIMEOUT || '10000'),
  AUTO_CONNECT: import.meta.env.VITE_WS_AUTO_CONNECT !== 'false',
} as const;

// Gmail Integration Configuration
export const GMAIL_CONFIG = {
  POLL_INTERVAL: parseInt(import.meta.env.VITE_GMAIL_POLL_INTERVAL || '300000'), // 5 minutes
  MAX_EMAILS_PER_REQUEST: parseInt(import.meta.env.VITE_GMAIL_MAX_EMAILS || '50'),
  ENABLE_AUTO_PROCESSING: import.meta.env.VITE_GMAIL_AUTO_PROCESSING !== 'false',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_GMAIL_NOTIFICATIONS !== 'false',
  FILTER_KEYWORDS: (import.meta.env.VITE_GMAIL_FILTER_KEYWORDS || 'referencia,interconsulta,remision').split(','),
  PRIORITY_KEYWORDS: (import.meta.env.VITE_GMAIL_PRIORITY_KEYWORDS || 'urgente,critico,emergencia').split(','),
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  ENABLE_LAZY_LOADING: import.meta.env.VITE_ENABLE_LAZY_LOADING !== 'false',
  ENABLE_VIRTUAL_SCROLLING: import.meta.env.VITE_ENABLE_VIRTUAL_SCROLLING === 'true',
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY || '300'),
  THROTTLE_DELAY: parseInt(import.meta.env.VITE_THROTTLE_DELAY || '100'),
  CACHE_TTL: parseInt(import.meta.env.VITE_CACHE_TTL || '300000'), // 5 minutes
  MAX_CACHE_SIZE: parseInt(import.meta.env.VITE_MAX_CACHE_SIZE || '100'),
} as const;

// Monitoring Configuration
export const MONITORING_CONFIG = {
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_PERFORMANCE_TRACKING: import.meta.env.VITE_ENABLE_PERFORMANCE_TRACKING === 'true',
  ENABLE_USER_ANALYTICS: import.meta.env.VITE_ENABLE_USER_ANALYTICS === 'true',
  ERROR_REPORTING_URL: import.meta.env.VITE_ERROR_REPORTING_URL,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
} as const;

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_REDUX_DEVTOOLS: isDevelopment && import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS !== 'false',
  ENABLE_REACT_DEVTOOLS: isDevelopment,
  ENABLE_CONSOLE_LOGS: isDevelopment || import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true',
  MOCK_API_DELAY: parseInt(import.meta.env.VITE_MOCK_API_DELAY || '1000'),
  ENABLE_HOT_RELOAD: isDevelopment,
} as const;

// Production Configuration
export const PROD_CONFIG = {
  ENABLE_SERVICE_WORKER: isProduction && import.meta.env.VITE_ENABLE_SERVICE_WORKER !== 'false',
  ENABLE_COMPRESSION: isProduction,
  ENABLE_MINIFICATION: isProduction,
  ENABLE_TREE_SHAKING: isProduction,
  ENABLE_CODE_SPLITTING: isProduction,
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: parseInt(import.meta.env.VITE_PASSWORD_MIN_LENGTH || '8'),
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  PHONE_PATTERN: /^[+]?[\d\s\-\(\)]{10,}$/,
  DOCUMENT_PATTERN: /^\d{6,12}$/,
  NAME_MIN_LENGTH: parseInt(import.meta.env.VITE_NAME_MIN_LENGTH || '2'),
  NAME_MAX_LENGTH: parseInt(import.meta.env.VITE_NAME_MAX_LENGTH || '100'),
} as const;

// Date Configuration
export const DATE_CONFIG = {
  DEFAULT_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  TIME_FORMAT: 'HH:mm',
  ISO_FORMAT: 'yyyy-MM-dd',
  DISPLAY_FORMAT: 'dd \'de\' MMMM \'de\' yyyy',
  TIMEZONE: 'America/Bogota',
  LOCALE: 'es-CO',
} as const;

// Export environment helpers
export const ENV = {
  isDevelopment,
  isProduction,
  isTest: import.meta.env.MODE === 'test',
  mode: import.meta.env.MODE,
} as const;

// Export all configuration
export default {
  API_CONFIG,
  APP_CONFIG,
  FEATURES,
  UI_CONFIG,
  SECURITY_CONFIG,
  FILE_CONFIG,
  WEBSOCKET_CONFIG,
  GMAIL_CONFIG,
  PERFORMANCE_CONFIG,
  MONITORING_CONFIG,
  DEV_CONFIG,
  PROD_CONFIG,
  VALIDATION_CONFIG,
  DATE_CONFIG,
  ENV,
};
