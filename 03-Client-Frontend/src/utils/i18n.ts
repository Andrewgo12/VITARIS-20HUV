/**
 * Internationalization Utilities for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { useState, useEffect } from 'react';

// Supported languages
export type Language = 'es' | 'en';

// Translation keys and values
export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    ok: string;
    search: string;
    filter: string;
    clear: string;
    refresh: string;
    export: string;
    import: string;
    download: string;
    upload: string;
    print: string;
    share: string;
    copy: string;
    paste: string;
    cut: string;
    undo: string;
    redo: string;
    select: string;
    selectAll: string;
    none: string;
    all: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    thisWeek: string;
    thisMonth: string;
    thisYear: string;
  };

  // Authentication
  auth: {
    login: string;
    logout: string;
    username: string;
    password: string;
    email: string;
    forgotPassword: string;
    resetPassword: string;
    changePassword: string;
    confirmPassword: string;
    rememberMe: string;
    signIn: string;
    signOut: string;
    invalidCredentials: string;
    sessionExpired: string;
    accessDenied: string;
    accountLocked: string;
    passwordTooWeak: string;
    passwordMismatch: string;
    emailRequired: string;
    passwordRequired: string;
  };

  // Medical
  medical: {
    patient: string;
    patients: string;
    case: string;
    cases: string;
    diagnosis: string;
    treatment: string;
    symptoms: string;
    medication: string;
    allergy: string;
    allergies: string;
    medicalHistory: string;
    referral: string;
    referrals: string;
    specialty: string;
    specialties: string;
    urgency: string;
    priority: string;
    status: string;
    approved: string;
    rejected: string;
    pending: string;
    inReview: string;
    cancelled: string;
    completed: string;
    low: string;
    medium: string;
    high: string;
    critical: string;
    doctor: string;
    nurse: string;
    evaluator: string;
    administrator: string;
    hospital: string;
    department: string;
    room: string;
    bed: string;
    appointment: string;
    appointments: string;
    schedule: string;
    availability: string;
  };

  // Navigation
  navigation: {
    dashboard: string;
    medicalCases: string;
    caseDetail: string;
    requestHistory: string;
    userManagement: string;
    supervision: string;
    systemConfig: string;
    backupManagement: string;
    emailMonitor: string;
    emailConfig: string;
    home: string;
    profile: string;
    settings: string;
    help: string;
    about: string;
    contact: string;
    support: string;
    documentation: string;
  };

  // Forms
  forms: {
    required: string;
    optional: string;
    invalid: string;
    valid: string;
    fieldRequired: string;
    invalidFormat: string;
    tooShort: string;
    tooLong: string;
    mustMatch: string;
    mustBeUnique: string;
    invalidEmail: string;
    invalidPhone: string;
    invalidDate: string;
    invalidNumber: string;
    minLength: string;
    maxLength: string;
    minValue: string;
    maxValue: string;
    selectOption: string;
    enterValue: string;
    chooseFile: string;
    dragDropFile: string;
    fileTooBig: string;
    fileTypeNotAllowed: string;
    uploadFailed: string;
    uploadSuccess: string;
  };

  // Messages
  messages: {
    saveSuccess: string;
    saveError: string;
    deleteSuccess: string;
    deleteError: string;
    updateSuccess: string;
    updateError: string;
    createSuccess: string;
    createError: string;
    loadError: string;
    networkError: string;
    serverError: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    validationError: string;
    confirmDelete: string;
    confirmCancel: string;
    unsavedChanges: string;
    operationSuccess: string;
    operationFailed: string;
    processingRequest: string;
    requestCompleted: string;
    requestFailed: string;
  };
}

// Spanish translations
const esTranslations: Translations = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    close: 'Cerrar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    yes: 'Sí',
    no: 'No',
    ok: 'Aceptar',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpiar',
    refresh: 'Actualizar',
    export: 'Exportar',
    import: 'Importar',
    download: 'Descargar',
    upload: 'Subir',
    print: 'Imprimir',
    share: 'Compartir',
    copy: 'Copiar',
    paste: 'Pegar',
    cut: 'Cortar',
    undo: 'Deshacer',
    redo: 'Rehacer',
    select: 'Seleccionar',
    selectAll: 'Seleccionar todo',
    none: 'Ninguno',
    all: 'Todos',
    today: 'Hoy',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    thisWeek: 'Esta semana',
    thisMonth: 'Este mes',
    thisYear: 'Este año',
  },
  auth: {
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    username: 'Usuario',
    password: 'Contraseña',
    email: 'Correo electrónico',
    forgotPassword: '¿Olvidaste tu contraseña?',
    resetPassword: 'Restablecer contraseña',
    changePassword: 'Cambiar contraseña',
    confirmPassword: 'Confirmar contraseña',
    rememberMe: 'Recordarme',
    signIn: 'Entrar',
    signOut: 'Salir',
    invalidCredentials: 'Credenciales inválidas',
    sessionExpired: 'Sesión expirada',
    accessDenied: 'Acceso denegado',
    accountLocked: 'Cuenta bloqueada',
    passwordTooWeak: 'Contraseña muy débil',
    passwordMismatch: 'Las contraseñas no coinciden',
    emailRequired: 'El correo es requerido',
    passwordRequired: 'La contraseña es requerida',
  },
  medical: {
    patient: 'Paciente',
    patients: 'Pacientes',
    case: 'Caso',
    cases: 'Casos',
    diagnosis: 'Diagnóstico',
    treatment: 'Tratamiento',
    symptoms: 'Síntomas',
    medication: 'Medicamento',
    allergy: 'Alergia',
    allergies: 'Alergias',
    medicalHistory: 'Historia médica',
    referral: 'Referencia',
    referrals: 'Referencias',
    specialty: 'Especialidad',
    specialties: 'Especialidades',
    urgency: 'Urgencia',
    priority: 'Prioridad',
    status: 'Estado',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    pending: 'Pendiente',
    inReview: 'En revisión',
    cancelled: 'Cancelado',
    completed: 'Completado',
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica',
    doctor: 'Doctor',
    nurse: 'Enfermera',
    evaluator: 'Evaluador',
    administrator: 'Administrador',
    hospital: 'Hospital',
    department: 'Departamento',
    room: 'Habitación',
    bed: 'Cama',
    appointment: 'Cita',
    appointments: 'Citas',
    schedule: 'Horario',
    availability: 'Disponibilidad',
  },
  navigation: {
    dashboard: 'Panel de control',
    medicalCases: 'Casos médicos',
    caseDetail: 'Detalle del caso',
    requestHistory: 'Historial de solicitudes',
    userManagement: 'Gestión de usuarios',
    supervision: 'Supervisión',
    systemConfig: 'Configuración del sistema',
    backupManagement: 'Gestión de respaldos',
    emailMonitor: 'Monitor de correos',
    emailConfig: 'Configuración de correos',
    home: 'Inicio',
    profile: 'Perfil',
    settings: 'Configuración',
    help: 'Ayuda',
    about: 'Acerca de',
    contact: 'Contacto',
    support: 'Soporte',
    documentation: 'Documentación',
  },
  forms: {
    required: 'Requerido',
    optional: 'Opcional',
    invalid: 'Inválido',
    valid: 'Válido',
    fieldRequired: 'Este campo es requerido',
    invalidFormat: 'Formato inválido',
    tooShort: 'Muy corto',
    tooLong: 'Muy largo',
    mustMatch: 'Debe coincidir',
    mustBeUnique: 'Debe ser único',
    invalidEmail: 'Correo inválido',
    invalidPhone: 'Teléfono inválido',
    invalidDate: 'Fecha inválida',
    invalidNumber: 'Número inválido',
    minLength: 'Longitud mínima',
    maxLength: 'Longitud máxima',
    minValue: 'Valor mínimo',
    maxValue: 'Valor máximo',
    selectOption: 'Seleccionar opción',
    enterValue: 'Ingresar valor',
    chooseFile: 'Elegir archivo',
    dragDropFile: 'Arrastrar y soltar archivo',
    fileTooBig: 'Archivo muy grande',
    fileTypeNotAllowed: 'Tipo de archivo no permitido',
    uploadFailed: 'Error al subir archivo',
    uploadSuccess: 'Archivo subido exitosamente',
  },
  messages: {
    saveSuccess: 'Guardado exitosamente',
    saveError: 'Error al guardar',
    deleteSuccess: 'Eliminado exitosamente',
    deleteError: 'Error al eliminar',
    updateSuccess: 'Actualizado exitosamente',
    updateError: 'Error al actualizar',
    createSuccess: 'Creado exitosamente',
    createError: 'Error al crear',
    loadError: 'Error al cargar',
    networkError: 'Error de conexión',
    serverError: 'Error del servidor',
    notFound: 'No encontrado',
    unauthorized: 'No autorizado',
    forbidden: 'Prohibido',
    validationError: 'Error de validación',
    confirmDelete: '¿Confirmar eliminación?',
    confirmCancel: '¿Confirmar cancelación?',
    unsavedChanges: 'Cambios sin guardar',
    operationSuccess: 'Operación exitosa',
    operationFailed: 'Operación fallida',
    processingRequest: 'Procesando solicitud',
    requestCompleted: 'Solicitud completada',
    requestFailed: 'Solicitud fallida',
  },
};

// English translations (basic implementation)
const enTranslations: Translations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    print: 'Print',
    share: 'Share',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    undo: 'Undo',
    redo: 'Redo',
    select: 'Select',
    selectAll: 'Select all',
    none: 'None',
    all: 'All',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    thisMonth: 'This month',
    thisYear: 'This year',
  },
  // ... (rest of English translations would be implemented similarly)
  auth: esTranslations.auth, // Using Spanish as fallback for now
  medical: esTranslations.medical,
  navigation: esTranslations.navigation,
  forms: esTranslations.forms,
  messages: esTranslations.messages,
};

// Translation store
const translations: Record<Language, Translations> = {
  es: esTranslations,
  en: enTranslations,
};

// Current language state
let currentLanguage: Language = 'es';

// Get current language
export const getCurrentLanguage = (): Language => currentLanguage;

// Set language
export const setLanguage = (language: Language): void => {
  currentLanguage = language;
  localStorage.setItem('vital-red-language', language);
};

// Get translation
export const t = (key: string, params?: Record<string, string>): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  // Replace parameters
  if (params) {
    return Object.entries(params).reduce(
      (str, [param, replacement]) => str.replace(`{{${param}}}`, replacement),
      value
    );
  }
  
  return value;
};

// Hook for using translations
export const useTranslation = () => {
  const [language, setLanguageState] = useState<Language>(currentLanguage);
  
  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('vital-red-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      currentLanguage = savedLanguage;
      setLanguageState(savedLanguage);
    }
  }, []);
  
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setLanguageState(newLanguage);
  };
  
  return {
    language,
    setLanguage: changeLanguage,
    t,
    translations: translations[language],
  };
};

// Initialize language from localStorage
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('vital-red-language') as Language;
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
  }
}

export default {
  getCurrentLanguage,
  setLanguage,
  t,
  useTranslation,
  translations,
};
