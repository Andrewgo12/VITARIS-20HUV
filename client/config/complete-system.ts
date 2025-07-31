// Complete System Configuration for VITARIS v2.0.0
export const VITARIS_CONFIG = {
  // System Information
  system: {
    name: 'VITARIS',
    fullName: 'Sistema Integral de Gestión Hospitalaria',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    hospital: {
      name: 'Hospital Universitario del Valle',
      shortName: 'HUV',
      address: 'Calle 5 # 36-08, Cali, Colombia',
      phone: '+57 (2) 555-0123',
      email: 'info@huv.gov.co',
      website: 'https://huv.gov.co'
    }
  },

  // API Configuration
  api: {
    baseUrl: process.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
    retries: 3,
    endpoints: {
      auth: '/auth',
      patients: '/patients',
      medical: '/medical',
      users: '/users',
      system: '/system',
      appointments: '/appointments',
      pharmacy: '/pharmacy',
      inventory: '/inventory',
      billing: '/billing',
      telemedicine: '/telemedicine',
      audit: '/audit',
      quality: '/quality',
      notifications: '/notifications',
      files: '/files',
      reports: '/reports',
      emergency: '/emergency',
      labs: '/labs'
    }
  },

  // Module Configuration
  modules: {
    medical: {
      patients: {
        enabled: true,
        features: ['crud', 'search', 'history', 'vital-signs', 'notes'],
        permissions: ['read_patients', 'write_patients', 'delete_patients']
      },
      admissions: {
        enabled: true,
        features: ['registration', 'bed-management', 'discharge'],
        permissions: ['read_admissions', 'write_admissions']
      },
      surgeries: {
        enabled: true,
        features: ['scheduling', 'tracking', 'reports'],
        permissions: ['read_surgeries', 'write_surgeries']
      },
      pharmacy: {
        enabled: true,
        features: ['medications', 'prescriptions', 'inventory'],
        permissions: ['read_medications', 'write_medications', 'prescribe_medications']
      },
      inventory: {
        enabled: true,
        features: ['stock-management', 'alerts', 'suppliers'],
        permissions: ['read_inventory', 'write_inventory']
      },
      billing: {
        enabled: true,
        features: ['invoicing', 'payments', 'insurance'],
        permissions: ['read_billing', 'write_billing', 'financial_data']
      },
      telemedicine: {
        enabled: true,
        features: ['video-calls', 'scheduling', 'recording'],
        permissions: ['read_telemedicine', 'write_telemedicine']
      },
      labs: {
        enabled: true,
        features: ['results', 'imaging', 'reports'],
        permissions: ['read_labs', 'write_labs']
      },
      icu: {
        enabled: true,
        features: ['monitoring', 'alerts', 'vital-signs'],
        permissions: ['read_icu', 'write_icu']
      },
      emergency: {
        enabled: true,
        features: ['protocols', 'alerts', 'triage'],
        permissions: ['emergency_access']
      }
    },
    administrative: {
      users: {
        enabled: true,
        features: ['management', 'roles', 'permissions'],
        permissions: ['admin_users']
      },
      audit: {
        enabled: true,
        features: ['logs', 'tracking', 'reports'],
        permissions: ['audit_logs']
      },
      quality: {
        enabled: true,
        features: ['metrics', 'indicators', 'reports'],
        permissions: ['read_quality', 'write_quality']
      },
      reports: {
        enabled: true,
        features: ['generation', 'scheduling', 'export'],
        permissions: ['read_reports', 'write_reports']
      }
    },
    system: {
      configuration: {
        enabled: true,
        features: ['settings', 'backup', 'maintenance'],
        permissions: ['admin_system']
      },
      notifications: {
        enabled: true,
        features: ['real-time', 'email', 'sms'],
        permissions: ['read_notifications', 'write_notifications']
      },
      metrics: {
        enabled: true,
        features: ['real-time', 'analytics', 'dashboards'],
        permissions: ['read_metrics']
      }
    }
  },

  // User Roles and Permissions
  security: {
    roles: {
      super_admin: {
        name: 'Super Administrador',
        permissions: [
          'read_patients', 'write_patients', 'delete_patients',
          'read_medical_records', 'write_medical_records',
          'read_appointments', 'write_appointments', 'cancel_appointments',
          'read_medications', 'write_medications', 'prescribe_medications',
          'read_reports', 'write_reports',
          'admin_users', 'admin_system',
          'emergency_access', 'financial_data', 'audit_logs',
          'read_inventory', 'write_inventory',
          'read_billing', 'write_billing',
          'read_telemedicine', 'write_telemedicine',
          'read_quality', 'write_quality',
          'read_notifications', 'write_notifications',
          'read_metrics'
        ]
      },
      admin: {
        name: 'Administrador',
        permissions: [
          'read_patients', 'write_patients',
          'read_appointments', 'write_appointments',
          'read_reports', 'write_reports',
          'admin_users',
          'financial_data', 'audit_logs',
          'read_inventory', 'write_inventory',
          'read_billing', 'write_billing'
        ]
      },
      doctor: {
        name: 'Médico',
        permissions: [
          'read_patients', 'write_patients',
          'read_medical_records', 'write_medical_records',
          'read_appointments', 'write_appointments',
          'read_medications', 'prescribe_medications',
          'emergency_access',
          'read_telemedicine', 'write_telemedicine'
        ]
      },
      nurse: {
        name: 'Enfermero/a',
        permissions: [
          'read_patients', 'write_patients',
          'read_medical_records',
          'read_appointments',
          'read_medications'
        ]
      },
      pharmacist: {
        name: 'Farmacéutico',
        permissions: [
          'read_patients',
          'read_medications', 'write_medications',
          'read_inventory', 'write_inventory'
        ]
      },
      receptionist: {
        name: 'Recepcionista',
        permissions: [
          'read_patients', 'write_patients',
          'read_appointments', 'write_appointments'
        ]
      },
      technician: {
        name: 'Técnico',
        permissions: [
          'read_patients',
          'read_appointments'
        ]
      },
      auditor: {
        name: 'Auditor',
        permissions: [
          'read_patients',
          'read_reports',
          'audit_logs',
          'financial_data'
        ]
      },
      guest: {
        name: 'Invitado',
        permissions: [
          'read_patients'
        ]
      }
    }
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#ef4444', // red-500
      secondary: '#3b82f6', // blue-500
      success: '#10b981', // emerald-500
      warning: '#f59e0b', // amber-500
      error: '#ef4444', // red-500
      info: '#3b82f6' // blue-500
    },
    layout: {
      sidebar: {
        width: 280,
        collapsedWidth: 80
      },
      header: {
        height: 64
      },
      footer: {
        height: 48
      }
    },
    animations: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out'
    }
  },

  // Feature Flags
  features: {
    telemedicine: true,
    aiAssistant: false,
    mobileApp: true,
    voiceCommands: false,
    biometricAuth: false,
    blockchain: false,
    iot: true,
    analytics: true,
    realTimeNotifications: true,
    darkMode: true,
    multiLanguage: true,
    offlineMode: false,
    cloudSync: false,
    advancedReports: true,
    auditTrail: true,
    dataExport: true,
    apiDocumentation: true
  },

  // Performance Configuration
  performance: {
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100
    },
    caching: {
      enabled: true,
      ttl: 300000 // 5 minutes
    },
    debounce: {
      search: 300,
      input: 150
    }
  },

  // Notification Configuration
  notifications: {
    types: {
      emergency: { priority: 'critical', sound: true, persist: true },
      medical: { priority: 'high', sound: true, persist: false },
      system: { priority: 'medium', sound: false, persist: false },
      info: { priority: 'low', sound: false, persist: false }
    },
    channels: {
      inApp: true,
      email: true,
      sms: false,
      push: true
    }
  },

  // Development Configuration
  development: {
    debug: process.env.NODE_ENV === 'development',
    mockData: true,
    apiLogging: true,
    performanceMonitoring: true
  }
};

// Export individual configurations for convenience
export const SYSTEM_INFO = VITARIS_CONFIG.system;
export const API_CONFIG = VITARIS_CONFIG.api;
export const MODULES_CONFIG = VITARIS_CONFIG.modules;
export const SECURITY_CONFIG = VITARIS_CONFIG.security;
export const UI_CONFIG = VITARIS_CONFIG.ui;
export const FEATURES_CONFIG = VITARIS_CONFIG.features;
export const PERFORMANCE_CONFIG = VITARIS_CONFIG.performance;
export const NOTIFICATIONS_CONFIG = VITARIS_CONFIG.notifications;
export const DEV_CONFIG = VITARIS_CONFIG.development;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof VITARIS_CONFIG.features): boolean => {
  return VITARIS_CONFIG.features[feature] === true;
};

export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

export const getModuleConfig = (category: keyof typeof VITARIS_CONFIG.modules, module: string) => {
  return VITARIS_CONFIG.modules[category]?.[module as keyof typeof VITARIS_CONFIG.modules[typeof category]];
};

export const isModuleEnabled = (category: keyof typeof VITARIS_CONFIG.modules, module: string): boolean => {
  const moduleConfig = getModuleConfig(category, module);
  return moduleConfig?.enabled === true;
};

// Default export
export default VITARIS_CONFIG;
