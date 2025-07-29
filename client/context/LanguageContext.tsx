import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones
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
    
    // Mensajes
    'msg.success': 'Operación exitosa',
    'msg.error': 'Ha ocurrido un error',
    'msg.saved': 'Cambios guardados correctamente',
    'msg.deleted': 'Elemento eliminado',
    
    // Sistema médico específico
    'medical.eps': 'EPS - Entidad Promotora de Salud',
    'medical.huv': 'HUV - Hospital Universitario del Valle',
    'medical.vital': 'Vital Red',
    'medical.system': 'Sistema Médico',
    'medical.referral': 'Sistema de Remisión',
    'medical.emergency': 'Urgencias',
    'medical.patient': 'Paciente',
    'medical.doctor': 'Médico',
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
    
    // Messages
    'msg.success': 'Operation successful',
    'msg.error': 'An error occurred',
    'msg.saved': 'Changes saved successfully',
    'msg.deleted': 'Item deleted',
    
    // Medical system specific
    'medical.eps': 'EPS - Health Promoting Entity',
    'medical.huv': 'HUV - Valle University Hospital',
    'medical.vital': 'Vital Red',
    'medical.system': 'Medical System',
    'medical.referral': 'Referral System',
    'medical.emergency': 'Emergency',
    'medical.patient': 'Patient',
    'medical.doctor': 'Doctor',
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

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
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
