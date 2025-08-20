/**
 * Formatting Utilities for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// Date formatters
export const formatters = {
  // Date formatting
  date: {
    /**
     * Format date to Colombian short format (dd/MM/yyyy)
     */
    short: (date: string | Date): string => {
      try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Fecha inválida';
        return format(dateObj, 'dd/MM/yyyy', { locale: es });
      } catch {
        return 'Fecha inválida';
      }
    },

    /**
     * Format date with time (dd/MM/yyyy HH:mm)
     */
    long: (date: string | Date): string => {
      try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Fecha inválida';
        return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
      } catch {
        return 'Fecha inválida';
      }
    },

    /**
     * Format time only (HH:mm)
     */
    time: (date: string | Date): string => {
      try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Hora inválida';
        return format(dateObj, 'HH:mm', { locale: es });
      } catch {
        return 'Hora inválida';
      }
    },

    /**
     * Format relative time (hace 2 horas)
     */
    relative: (date: string | Date): string => {
      try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Fecha inválida';
        return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
      } catch {
        return 'Fecha inválida';
      }
    },

    /**
     * Format for display (dd de MMMM de yyyy)
     */
    display: (date: string | Date): string => {
      try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Fecha inválida';
        return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: es });
      } catch {
        return 'Fecha inválida';
      }
    },
  },

  // Number formatting
  number: {
    /**
     * Format number with Colombian locale
     */
    standard: (num: number): string => {
      return new Intl.NumberFormat('es-CO').format(num);
    },

    /**
     * Format currency in Colombian pesos
     */
    currency: (amount: number): string => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(amount);
    },

    /**
     * Format percentage
     */
    percentage: (value: number, decimals: number = 1): string => {
      return `${value.toFixed(decimals)}%`;
    },

    /**
     * Format file size
     */
    fileSize: (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Format duration in seconds to human readable
     */
    duration: (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      } else {
        return `${secs}s`;
      }
    },
  },

  // String formatting
  string: {
    /**
     * Capitalize first letter
     */
    capitalize: (str: string): string => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Convert to title case
     */
    titleCase: (str: string): string => {
      if (!str) return '';
      return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    },

    /**
     * Truncate string with ellipsis
     */
    truncate: (str: string, length: number = 50): string => {
      if (!str) return '';
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    },

    /**
     * Generate initials from name
     */
    initials: (name: string): string => {
      if (!name) return '';
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    /**
     * Format phone number
     */
    phone: (phone: string): string => {
      if (!phone) return '';
      const cleaned = phone.replace(/\D/g, '');
      
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 7) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      }
      
      return phone;
    },

    /**
     * Format document number with dots
     */
    document: (document: string): string => {
      if (!document) return '';
      return document.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    /**
     * Remove accents from string
     */
    removeAccents: (str: string): string => {
      if (!str) return '';
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },

    /**
     * Convert to slug (URL-friendly)
     */
    slug: (str: string): string => {
      if (!str) return '';
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    },
  },

  // Medical specific formatting
  medical: {
    /**
     * Format urgency level
     */
    urgency: (level: string): string => {
      const levels: Record<string, string> = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        critical: 'Crítica',
        baja: 'Baja',
        media: 'Media',
        alta: 'Alta',
        critico: 'Crítica',
      };
      return levels[level?.toLowerCase()] || level || 'No especificado';
    },

    /**
     * Format case status
     */
    status: (status: string): string => {
      const statuses: Record<string, string> = {
        pending: 'Pendiente',
        in_review: 'En Revisión',
        approved: 'Aprobado',
        rejected: 'Rechazado',
        cancelled: 'Cancelado',
      };
      return statuses[status?.toLowerCase()] || status || 'No especificado';
    },

    /**
     * Format referral status
     */
    referralStatus: (status: string): string => {
      const statuses: Record<string, string> = {
        pending: 'Pendiente',
        in_review: 'En Revisión',
        assigned: 'Asignado',
        completed: 'Completado',
        cancelled: 'Cancelado',
        expired: 'Expirado',
      };
      return statuses[status?.toLowerCase()] || status || 'No especificado';
    },

    /**
     * Format medical specialty
     */
    specialty: (specialty: string): string => {
      const specialties: Record<string, string> = {
        cardiologia: 'Cardiología',
        neurologia: 'Neurología',
        gastroenterologia: 'Gastroenterología',
        neumologia: 'Neumología',
        endocrinologia: 'Endocrinología',
        nefrologia: 'Nefrología',
        oncologia: 'Oncología',
        dermatologia: 'Dermatología',
        oftalmologia: 'Oftalmología',
        otorrinolaringologia: 'Otorrinolaringología',
        urologia: 'Urología',
        ginecologia: 'Ginecología',
        pediatria: 'Pediatría',
        geriatria: 'Geriatría',
        psiquiatria: 'Psiquiatría',
        medicina_interna: 'Medicina Interna',
        cirugia_general: 'Cirugía General',
        traumatologia: 'Traumatología',
        anestesiologia: 'Anestesiología',
        radiologia: 'Radiología',
      };
      return specialties[specialty?.toLowerCase()] || formatters.string.titleCase(specialty) || 'No especificado';
    },

    /**
     * Format document type
     */
    documentType: (type: string): string => {
      const types: Record<string, string> = {
        epicrisis: 'Epicrisis',
        laboratorio: 'Laboratorio',
        imagen: 'Imagen',
        receta: 'Receta',
        remision: 'Remisión',
        consulta: 'Consulta',
        procedimiento: 'Procedimiento',
        alta: 'Alta',
      };
      return types[type?.toLowerCase()] || formatters.string.titleCase(type) || 'No especificado';
    },

    /**
     * Format patient age
     */
    age: (birthDate: string | Date): string => {
      try {
        const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
        if (!isValid(birth)) return 'Edad no disponible';
        
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          return `${age - 1} años`;
        }
        
        return `${age} años`;
      } catch {
        return 'Edad no disponible';
      }
    },
  },

  // System formatting
  system: {
    /**
     * Format user role
     */
    role: (role: string): string => {
      const roles: Record<string, string> = {
        medical_evaluator: 'Evaluador Médico',
        administrator: 'Administrador',
        admin: 'Administrador',
        user: 'Usuario',
      };
      return roles[role?.toLowerCase()] || formatters.string.titleCase(role) || 'No especificado';
    },

    /**
     * Format email processing status
     */
    emailStatus: (status: string): string => {
      const statuses: Record<string, string> = {
        pending: 'Pendiente',
        processing: 'Procesando',
        processed: 'Procesado',
        error: 'Error',
        quarantined: 'En Cuarentena',
      };
      return statuses[status?.toLowerCase()] || status || 'No especificado';
    },

    /**
     * Format connection status
     */
    connectionStatus: (connected: boolean): string => {
      return connected ? 'Conectado' : 'Desconectado';
    },

    /**
     * Format service status
     */
    serviceStatus: (status: string): string => {
      const statuses: Record<string, string> = {
        running: 'En Ejecución',
        stopped: 'Detenido',
        error: 'Error',
        starting: 'Iniciando',
        stopping: 'Deteniendo',
      };
      return statuses[status?.toLowerCase()] || status || 'No especificado';
    },
  },
};

// Export individual formatter categories
export const {
  date: dateFormatters,
  number: numberFormatters,
  string: stringFormatters,
  medical: medicalFormatters,
  system: systemFormatters,
} = formatters;

// Export default
export default formatters;
