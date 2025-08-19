// Configuración global del sistema VITARIS
export const SYSTEM_CONFIG = {
  // Información del sistema
  name: 'VITARIS',
  fullName: 'Sistema Integral de Gestión Hospitalaria VITARIS',
  version: '2.0.0',
  hospital: 'Hospital Universitario del Valle',
  
  // URLs y endpoints
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
    retries: 3,
  },
  
  // Configuración de autenticación
  auth: {
    tokenKey: 'vitaris_token',
    refreshTokenKey: 'vitaris_refresh_token',
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    maxLoginAttempts: 3,
    lockoutDuration: 15 * 60 * 1000, // 15 minutos
  },
  
  // Configuración de notificaciones
  notifications: {
    maxNotifications: 50,
    autoExpireTime: 5000, // 5 segundos
    soundEnabled: true,
    positions: {
      desktop: 'top-right',
      mobile: 'top-center',
    },
  },
  
  // Configuración de la aplicación
  app: {
    theme: 'light',
    language: 'es',
    timezone: 'America/Bogota',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'COP',
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 20, 50, 100],
    },
  },
  
  // Configuración médica
  medical: {
    vitalSigns: {
      refreshInterval: 2000, // 2 segundos
      alertThresholds: {
        heartRate: { min: 60, max: 100, critical: { min: 40, max: 150 } },
        bloodPressure: { 
          systolic: { min: 90, max: 140, critical: { min: 70, max: 180 } },
          diastolic: { min: 60, max: 90, critical: { min: 40, max: 120 } }
        },
        temperature: { min: 36.0, max: 37.5, critical: { min: 35.0, max: 40.0 } },
        oxygenSaturation: { min: 95, max: 100, critical: { min: 85, max: 100 } },
        respiratoryRate: { min: 12, max: 20, critical: { min: 8, max: 30 } },
      },
    },
    appointments: {
      slotDuration: 30, // minutos
      workingHours: {
        start: '08:00',
        end: '18:00',
      },
      maxAdvanceBooking: 90, // días
    },
    prescriptions: {
      maxDuration: 30, // días
      renewalPeriod: 7, // días antes del vencimiento
    },
  },
  
  // Configuración de seguridad
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
      maxAge: 90, // días
    },
    encryption: {
      algorithm: 'AES-256-GCM',
      keyLength: 32,
    },
    audit: {
      enabled: true,
      retentionDays: 365,
      sensitiveActions: [
        'login',
        'logout',
        'password_change',
        'user_create',
        'user_delete',
        'patient_access',
        'medical_record_access',
        'prescription_create',
        'system_config_change',
      ],
    },
  },
  
  // Configuración de backup
  backup: {
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    retention: {
      daily: 7,
      weekly: 4,
      monthly: 12,
    },
    compression: true,
    encryption: true,
    locations: ['local', 'cloud'],
  },
  
  // Configuración de performance
  performance: {
    caching: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5 minutos
      maxSize: 100, // MB
    },
    monitoring: {
      enabled: true,
      metricsInterval: 60000, // 1 minuto
      alertThresholds: {
        cpuUsage: 80,
        memoryUsage: 85,
        diskUsage: 90,
        responseTime: 2000, // ms
      },
    },
    optimization: {
      lazyLoading: true,
      imageCompression: true,
      bundleSplitting: true,
    },
  },
  
  // Configuración de logs
  logging: {
    level: import.meta.env.MODE === 'production' ? 'warn' : 'debug',
    maxFiles: 10,
    maxSize: '10MB',
    format: 'json',
    destinations: ['console', 'file'],
  },
  
  // Configuración de features
  features: {
    telemedicine: true,
    aiAssistant: false,
    mobileApp: true,
    voiceCommands: false,
    biometricAuth: false,
    blockchain: false,
    iot: true,
    analytics: true,
    reporting: true,
    inventory: true,
    billing: true,
    pharmacy: true,
    laboratory: true,
    imaging: true,
    emergencyProtocols: true,
    patientPortal: true,
    staffScheduling: true,
    qualityMetrics: true,
    compliance: true,
    integration: {
      hl7: true,
      fhir: true,
      dicom: true,
      apis: true,
    },
  },
  
  // Configuración de UI/UX
  ui: {
    animations: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
    },
    accessibility: {
      highContrast: false,
      fontSize: 'medium',
      screenReader: true,
      keyboardNavigation: true,
    },
    responsive: {
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280,
      },
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',
    },
  },
  
  // Configuración de integración
  integrations: {
    email: {
      provider: 'smtp',
      host: import.meta.env.VITE_SMTP_HOST || '',
      port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: import.meta.env.VITE_SMTP_USER || '',
        pass: import.meta.env.VITE_SMTP_PASS || '',
      },
    },
    sms: {
      provider: 'twilio',
      accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
      authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
      fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || '',
    },
    storage: {
      provider: 'aws-s3',
      bucket: import.meta.env.VITE_AWS_S3_BUCKET || '',
      region: import.meta.env.VITE_AWS_REGION || '',
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
    },
    analytics: {
      provider: 'google-analytics',
      trackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
      enabled: import.meta.env.MODE === 'production',
    },
  },
  
  // Configuración de desarrollo
  development: {
    mockData: import.meta.env.MODE === 'development',
    debugMode: import.meta.env.MODE === 'development',
    hotReload: true,
    sourceMap: true,
  },
};

// Tipos para TypeScript
export type SystemConfig = typeof SYSTEM_CONFIG;

// Funciones de utilidad
export const getConfig = (path: string): any => {
  return path.split('.').reduce((obj, key) => obj?.[key], SYSTEM_CONFIG);
};

export const isFeatureEnabled = (feature: keyof typeof SYSTEM_CONFIG.features): boolean => {
  return SYSTEM_CONFIG.features[feature] === true;
};

export const getApiUrl = (endpoint: string): string => {
  return `${SYSTEM_CONFIG.api.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

export const getThemeColors = () => {
  return SYSTEM_CONFIG.ui.colors;
};

export const isMobile = (): boolean => {
  return window.innerWidth < SYSTEM_CONFIG.ui.responsive.breakpoints.mobile;
};

export const isTablet = (): boolean => {
  return window.innerWidth < SYSTEM_CONFIG.ui.responsive.breakpoints.tablet;
};

export const isDesktop = (): boolean => {
  return window.innerWidth >= SYSTEM_CONFIG.ui.responsive.breakpoints.desktop;
};

// Configuración por defecto para nuevos usuarios
export const DEFAULT_USER_PREFERENCES = {
  theme: SYSTEM_CONFIG.app.theme,
  language: SYSTEM_CONFIG.app.language,
  notifications: {
    email: true,
    push: true,
    sound: SYSTEM_CONFIG.notifications.soundEnabled,
  },
  dashboard: {
    layout: 'default',
    widgets: ['patients', 'appointments', 'vitals', 'alerts'],
  },
  accessibility: {
    highContrast: SYSTEM_CONFIG.ui.accessibility.highContrast,
    fontSize: SYSTEM_CONFIG.ui.accessibility.fontSize,
  },
};

export default SYSTEM_CONFIG;
