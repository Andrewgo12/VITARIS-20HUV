import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones expandidas
const translations = {
  es: {
    // Navegación y menús
    'nav.login': 'Iniciar Sesión',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar Sesión',
    'nav.back': 'Volver',
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    
    // Perfil de usuario
    'profile.title': 'Perfil de Usuario',
    'profile.edit': 'Editar Perfil',
    'profile.personal': 'Información Personal',
    'profile.name': 'Nombre Completo',
    'profile.email': 'Correo Electrónico',
    'profile.document': 'Documento de Identidad',
    'profile.phone': 'Teléfono',
    'profile.role': 'Rol',
    'profile.photo': 'Foto de Perfil',
    'profile.save': 'Guardar Cambios',
    'profile.cancel': 'Cancelar',
    
    // Formulario de paciente
    'patient.identification': 'Identificación del Paciente',
    'patient.personalInfo': 'Información Personal',
    'patient.epsInfo': 'Información EPS',
    'patient.contactInfo': 'Información de Contacto',
    'patient.emergencyContact': 'Contacto de Emergencia',
    'patient.sociodemographic': 'Información Sociodemográfica',
    'patient.clinicalAssessment': 'Evaluación Clínica',
    'patient.attachments': 'Archivos Adjuntos',
    
    // Campos específicos
    'field.identificationType': 'Tipo de Identificación',
    'field.identificationNumber': 'Número de Identificación',
    'field.fullName': 'Nombre Completo',
    'field.birthDate': 'Fecha de Nacimiento',
    'field.age': 'Edad',
    'field.sex': 'Sexo',
    'field.eps': 'EPS',
    'field.affiliationRegime': 'Régimen de Afiliación',
    'field.affiliateType': 'Tipo de Afiliado',
    'field.affiliationNumber': 'Número de Afiliación',
    'field.affiliationStatus': 'Estado de Afiliación',
    'field.sisbenLevel': 'Nivel SISBEN',
    'field.address': 'Dirección',
    'field.emergencyContactName': 'Nombre del Contacto de Emergencia',
    'field.emergencyContactPhone': 'Teléfono de Contacto de Emergencia',
    'field.emergencyContactRelation': 'Parentesco',
    'field.occupation': 'Ocupación',
    'field.educationLevel': 'Nivel Educativo',
    'field.maritalStatus': 'Estado Civil',
    'field.pregnancyStatus': 'Estado de Embarazo',
    'field.pregnancyWeeks': 'Semanas de Gestación',
    'field.currentSymptoms': 'Síntomas Actuales',
    'field.symptomsOnset': 'Inicio de Síntomas',
    'field.symptomsIntensity': 'Intensidad de Síntomas',
    'field.painScale': 'Escala de Dolor',
    'field.chronicConditions': 'Condiciones Crónicas',
    'field.previousHospitalizations': 'Hospitalizaciones Previas',
    'field.insuranceAuthorization': 'Autorización de Seguro',
    
    // Cambio de contraseña
    'password.title': 'Cambiar Contraseña',
    'password.current': 'Contraseña Actual',
    'password.new': 'Nueva Contraseña',
    'password.confirm': 'Confirmar Contraseña',
    'password.change': 'Cambiar Contraseña',
    
    // Eliminar cuenta
    'account.delete': 'Eliminar Cuenta',
    'account.deleteWarning': '¿Está seguro que desea eliminar su cuenta permanentemente?',
    'account.deleteConfirm': 'Esta acción no se puede deshacer',
    'account.deleteButton': 'Eliminar Definitivamente',
    
    // Actividad reciente
    'activity.title': 'Actividad Reciente',
    'activity.lastLogin': 'Último Inicio de Sesión',
    'activity.views': 'Vistas Abiertas',
    'activity.downloads': 'Descargas',
    
    // Configuración
    'settings.title': 'Configuración del Sistema',
    'settings.appearance': 'Apariencia',
    'settings.language': 'Idioma',
    'settings.account': 'Gestión de Cuenta',
    'settings.privacy': 'Privacidad',
    'settings.security': 'Seguridad',
    'settings.history': 'Historial',
    
    // Apariencia
    'appearance.theme': 'Tema',
    'appearance.light': 'Claro',
    'appearance.dark': 'Oscuro',
    'appearance.fontSize': 'Tamaño de Letra',
    'appearance.animations': 'Animaciones',
    'appearance.spacing': 'Espaciado',
    
    // Idioma
    'language.title': 'Configuración de Idioma',
    'language.current': 'Idioma Actual',
    'language.spanish': 'Español',
    'language.english': 'Inglés',
    'language.change': 'Cambiar Idioma',
    
    // Seguridad
    'security.title': 'Configuración de Seguridad',
    'security.twoFactor': 'Autenticación de Dos Factores',
    'security.sessions': 'Sesiones Activas',
    'security.devices': 'Dispositivos Conocidos',
    'security.blockedIps': 'IPs Bloqueadas',
    
    // Botones generales
    'btn.save': 'Guardar',
    'btn.cancel': 'Cancelar',
    'btn.edit': 'Editar',
    'btn.delete': 'Eliminar',
    'btn.confirm': 'Confirmar',
    'btn.close': 'Cerrar',
    'btn.yes': 'Sí',
    'btn.no': 'No',
    'btn.next': 'Siguiente',
    'btn.previous': 'Anterior',
    'btn.finish': 'Finalizar',
    'btn.submit': 'Enviar',
    'btn.upload': 'Subir',
    'btn.download': 'Descargar',
    'btn.view': 'Ver',
    'btn.authorize': 'Autorizar',
    'btn.reject': 'Rechazar',
    'btn.selectFiles': 'Seleccionar Archivos',
    
    // Mensajes
    'msg.success': 'Operación exitosa',
    'msg.error': 'Ha ocurrido un error',
    'msg.saved': 'Cambios guardados correctamente',
    'msg.deleted': 'Elemento eliminado',
    'msg.loading': 'Cargando...',
    'msg.noData': 'No hay datos disponibles',
    'msg.required': 'Campo obligatorio',
    'msg.invalidEmail': 'Correo electrónico inválido',
    'msg.passwordsDoNotMatch': 'Las contraseñas no coinciden',
    
    // Sistema médico específico
    'medical.eps': 'EPS - Entidad Promotora de Salud',
    'medical.huv': 'HUV - Hospital Universitario del Valle',
    'medical.vital': 'Vital Red',
    'medical.system': 'Sistema Médico',
    'medical.referral': 'Sistema de Remisión EPS',
    'medical.emergency': 'Urgencias',
    'medical.patient': 'Paciente',
    'medical.doctor': 'Médico',
    'medical.formWizard': 'Formulario de Remisión Médica',
    'medical.completeSteps': 'Complete los siguientes pasos para enviar la remisión',
    
    // Estados y opciones
    'status.pending': 'Pendiente',
    'status.authorized': 'Autorizado',
    'status.rejected': 'Rechazado',
    'status.active': 'Activo',
    'status.inactive': 'Inactivo',
    'priority.critical': 'Crítico',
    'priority.severe': 'Severo',
    'priority.moderate': 'Moderado',
    'priority.mild': 'Leve',
    
    // Placeholders
    'placeholder.selectType': 'Seleccionar tipo',
    'placeholder.enterDocument': 'Número de documento',
    'placeholder.fullName': 'Nombres y apellidos',
    'placeholder.email': 'correo@ejemplo.com',
    'placeholder.phone': 'Número de teléfono',
    'placeholder.address': 'Dirección completa de residencia',
    'placeholder.selectOption': 'Seleccionar opción',
    'placeholder.selectSex': 'Seleccionar sexo',
    'placeholder.selectEPS': 'Seleccionar EPS',
    'placeholder.selectRegime': 'Seleccionar régimen',
    'placeholder.selectLevel': 'Seleccionar nivel',
    'placeholder.selectStatus': 'Seleccionar estado',
    'placeholder.contactName': 'Nombre del contacto',
    'placeholder.selectRelation': 'Seleccionar parentesco',
    'placeholder.profession': 'Profesión u oficio',
    'placeholder.describeSyptoms': 'Describa detalladamente los síntomas principales',
    'placeholder.symptomsOnset': 'ej: Hace 2 días, Esta mañana',
    'placeholder.chronicConditions': 'Liste condiciones médicas crónicas conocidas o escriba "Ninguna"',
    'placeholder.previousHospitalizations': 'Describa hospitalizaciones previas y fechas aproximadas',
    'placeholder.authorizationNumber': 'Número de autorización o "En trámite"',
    
    // File upload
    'upload.title': 'Archivos Adjuntos',
    'upload.description': 'Sube documentos de identidad, carné EPS, foto del paciente',
    'upload.formats': 'Formatos permitidos: PDF, JPG, PNG. Máximo 10MB por archivo.',
    'upload.attachedFiles': 'Archivos adjuntados:',
    'upload.calculatedAutomatically': 'Calculada automáticamente',
    
    // Stepper
    'step.patientData': 'Datos del Paciente',
    'step.patientDataDesc': 'Identificación y afiliación EPS',
    'step.referralDiagnosis': 'Remisión y Diagnóstico',
    'step.referralDiagnosisDesc': 'Motivo y diagnóstico médico',
    'step.vitalSigns': 'Signos Vitales',
    'step.vitalSignsDesc': 'Estado clínico actual',
    'step.documents': 'Documentos de Soporte',
    'step.documentsDesc': 'Archivos y observaciones',
    'step.validation': 'Validación Final',
    'step.validationDesc': 'Confirmación y envío',
    'step.current': 'Paso {current} de {total}',
    'step.complete': '{percentage}% Completo',
  },
  en: {
    // Navigation and menus
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.back': 'Back',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    
    // User profile
    'profile.title': 'User Profile',
    'profile.edit': 'Edit Profile',
    'profile.personal': 'Personal Information',
    'profile.name': 'Full Name',
    'profile.email': 'Email Address',
    'profile.document': 'ID Document',
    'profile.phone': 'Phone',
    'profile.role': 'Role',
    'profile.photo': 'Profile Photo',
    'profile.save': 'Save Changes',
    'profile.cancel': 'Cancel',
    
    // Patient form
    'patient.identification': 'Patient Identification',
    'patient.personalInfo': 'Personal Information',
    'patient.epsInfo': 'EPS Information',
    'patient.contactInfo': 'Contact Information',
    'patient.emergencyContact': 'Emergency Contact',
    'patient.sociodemographic': 'Sociodemographic Information',
    'patient.clinicalAssessment': 'Clinical Assessment',
    'patient.attachments': 'Attachments',
    
    // Specific fields
    'field.identificationType': 'Identification Type',
    'field.identificationNumber': 'Identification Number',
    'field.fullName': 'Full Name',
    'field.birthDate': 'Birth Date',
    'field.age': 'Age',
    'field.sex': 'Sex',
    'field.eps': 'EPS',
    'field.affiliationRegime': 'Affiliation Regime',
    'field.affiliateType': 'Affiliate Type',
    'field.affiliationNumber': 'Affiliation Number',
    'field.affiliationStatus': 'Affiliation Status',
    'field.sisbenLevel': 'SISBEN Level',
    'field.address': 'Address',
    'field.emergencyContactName': 'Emergency Contact Name',
    'field.emergencyContactPhone': 'Emergency Contact Phone',
    'field.emergencyContactRelation': 'Relationship',
    'field.occupation': 'Occupation',
    'field.educationLevel': 'Education Level',
    'field.maritalStatus': 'Marital Status',
    'field.pregnancyStatus': 'Pregnancy Status',
    'field.pregnancyWeeks': 'Weeks of Gestation',
    'field.currentSymptoms': 'Current Symptoms',
    'field.symptomsOnset': 'Symptoms Onset',
    'field.symptomsIntensity': 'Symptoms Intensity',
    'field.painScale': 'Pain Scale',
    'field.chronicConditions': 'Chronic Conditions',
    'field.previousHospitalizations': 'Previous Hospitalizations',
    'field.insuranceAuthorization': 'Insurance Authorization',
    
    // Password change
    'password.title': 'Change Password',
    'password.current': 'Current Password',
    'password.new': 'New Password',
    'password.confirm': 'Confirm Password',
    'password.change': 'Change Password',
    
    // Delete account
    'account.delete': 'Delete Account',
    'account.deleteWarning': 'Are you sure you want to permanently delete your account?',
    'account.deleteConfirm': 'This action cannot be undone',
    'account.deleteButton': 'Delete Permanently',
    
    // Recent activity
    'activity.title': 'Recent Activity',
    'activity.lastLogin': 'Last Login',
    'activity.views': 'Views Opened',
    'activity.downloads': 'Downloads',
    
    // Settings
    'settings.title': 'System Settings',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.account': 'Account Management',
    'settings.privacy': 'Privacy',
    'settings.security': 'Security',
    'settings.history': 'History',
    
    // Appearance
    'appearance.theme': 'Theme',
    'appearance.light': 'Light',
    'appearance.dark': 'Dark',
    'appearance.fontSize': 'Font Size',
    'appearance.animations': 'Animations',
    'appearance.spacing': 'Spacing',
    
    // Language
    'language.title': 'Language Settings',
    'language.current': 'Current Language',
    'language.spanish': 'Spanish',
    'language.english': 'English',
    'language.change': 'Change Language',
    
    // Security
    'security.title': 'Security Settings',
    'security.twoFactor': 'Two-Factor Authentication',
    'security.sessions': 'Active Sessions',
    'security.devices': 'Known Devices',
    'security.blockedIps': 'Blocked IPs',
    
    // General buttons
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.confirm': 'Confirm',
    'btn.close': 'Close',
    'btn.yes': 'Yes',
    'btn.no': 'No',
    'btn.next': 'Next',
    'btn.previous': 'Previous',
    'btn.finish': 'Finish',
    'btn.submit': 'Submit',
    'btn.upload': 'Upload',
    'btn.download': 'Download',
    'btn.view': 'View',
    'btn.authorize': 'Authorize',
    'btn.reject': 'Reject',
    'btn.selectFiles': 'Select Files',
    
    // Messages
    'msg.success': 'Operation successful',
    'msg.error': 'An error occurred',
    'msg.saved': 'Changes saved successfully',
    'msg.deleted': 'Item deleted',
    'msg.loading': 'Loading...',
    'msg.noData': 'No data available',
    'msg.required': 'Required field',
    'msg.invalidEmail': 'Invalid email address',
    'msg.passwordsDoNotMatch': 'Passwords do not match',
    
    // Medical system specific
    'medical.eps': 'EPS - Health Promoting Entity',
    'medical.huv': 'HUV - Valle University Hospital',
    'medical.vital': 'Vital Red',
    'medical.system': 'Medical System',
    'medical.referral': 'EPS Referral System',
    'medical.emergency': 'Emergency',
    'medical.patient': 'Patient',
    'medical.doctor': 'Doctor',
    'medical.formWizard': 'Medical Referral Form',
    'medical.completeSteps': 'Complete the following steps to submit the referral',
    
    // States and options
    'status.pending': 'Pending',
    'status.authorized': 'Authorized',
    'status.rejected': 'Rejected',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'priority.critical': 'Critical',
    'priority.severe': 'Severe',
    'priority.moderate': 'Moderate',
    'priority.mild': 'Mild',
    
    // Placeholders
    'placeholder.selectType': 'Select type',
    'placeholder.enterDocument': 'Document number',
    'placeholder.fullName': 'First and last names',
    'placeholder.email': 'email@example.com',
    'placeholder.phone': 'Phone number',
    'placeholder.address': 'Complete residential address',
    'placeholder.selectOption': 'Select option',
    'placeholder.selectSex': 'Select sex',
    'placeholder.selectEPS': 'Select EPS',
    'placeholder.selectRegime': 'Select regime',
    'placeholder.selectLevel': 'Select level',
    'placeholder.selectStatus': 'Select status',
    'placeholder.contactName': 'Contact name',
    'placeholder.selectRelation': 'Select relationship',
    'placeholder.profession': 'Profession or occupation',
    'placeholder.describeSyptoms': 'Describe in detail the main symptoms presented by the patient',
    'placeholder.symptomsOnset': 'e.g.: 2 days ago, This morning',
    'placeholder.chronicConditions': 'List known chronic medical conditions or write "None"',
    'placeholder.previousHospitalizations': 'Describe previous hospitalizations and approximate dates',
    'placeholder.authorizationNumber': 'Authorization number or "In process"',
    
    // File upload
    'upload.title': 'Attached Files',
    'upload.description': 'Upload ID documents, EPS card, patient photo',
    'upload.formats': 'Allowed formats: PDF, JPG, PNG. Maximum 10MB per file.',
    'upload.attachedFiles': 'Attached files:',
    'upload.calculatedAutomatically': 'Calculated automatically',
    
    // Stepper
    'step.patientData': 'Patient Data',
    'step.patientDataDesc': 'Identification and EPS affiliation',
    'step.referralDiagnosis': 'Referral and Diagnosis',
    'step.referralDiagnosisDesc': 'Reason and medical diagnosis',
    'step.vitalSigns': 'Vital Signs',
    'step.vitalSignsDesc': 'Current clinical status',
    'step.documents': 'Supporting Documents',
    'step.documentsDesc': 'Files and observations',
    'step.validation': 'Final Validation',
    'step.validationDesc': 'Confirmation and submission',
    'step.current': 'Step {current} of {total}',
    'step.complete': '{percentage}% Complete',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vital-red-language');
    return (saved as Language) || 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vital-red-language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    // Replace parameters in the translation
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, String(params[param]));
      });
    }
    
    return translation;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
