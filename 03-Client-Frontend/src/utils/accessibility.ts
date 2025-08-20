/**
 * Accessibility Utilities for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { useState, useEffect } from 'react';

// Screen reader hook
export const useScreenReader = () => {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Detect if screen reader is active
    const checkScreenReader = () => {
      // Check for common screen reader indicators
      const hasAriaLive = document.querySelector('[aria-live]');
      const hasScreenReaderText = document.querySelector('.sr-only');
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Check for screen reader user agents
      const screenReaderIndicators = [
        'nvda', 'jaws', 'voiceover', 'talkback', 'orca'
      ];
      
      const hasScreenReaderUA = screenReaderIndicators.some(indicator => 
        userAgent.includes(indicator)
      );

      setIsScreenReaderActive(hasAriaLive || hasScreenReaderText || hasScreenReaderUA);
    };

    checkScreenReader();
    
    // Listen for accessibility events
    const handleFocus = () => checkScreenReader();
    document.addEventListener('focusin', handleFocus);
    
    return () => {
      document.removeEventListener('focusin', handleFocus);
    };
  }, []);

  return isScreenReaderActive;
};

// Generate ARIA attributes for components
export const generateAriaAttributes = (
  type: string,
  label?: string,
  description?: string,
  required?: boolean,
  invalid?: boolean,
  expanded?: boolean
) => {
  const attributes: Record<string, any> = {};

  // Basic attributes
  if (label) {
    attributes['aria-label'] = label;
  }

  if (description) {
    attributes['aria-describedby'] = `${type}-description`;
  }

  if (required) {
    attributes['aria-required'] = 'true';
  }

  if (invalid) {
    attributes['aria-invalid'] = 'true';
  }

  if (expanded !== undefined) {
    attributes['aria-expanded'] = expanded.toString();
  }

  // Role-specific attributes
  switch (type) {
    case 'button':
      attributes['role'] = 'button';
      break;
    case 'dialog':
      attributes['role'] = 'dialog';
      attributes['aria-modal'] = 'true';
      break;
    case 'alert':
      attributes['role'] = 'alert';
      attributes['aria-live'] = 'assertive';
      break;
    case 'status':
      attributes['role'] = 'status';
      attributes['aria-live'] = 'polite';
      break;
    case 'navigation':
      attributes['role'] = 'navigation';
      break;
    case 'main':
      attributes['role'] = 'main';
      break;
    case 'complementary':
      attributes['role'] = 'complementary';
      break;
    case 'banner':
      attributes['role'] = 'banner';
      break;
    case 'contentinfo':
      attributes['role'] = 'contentinfo';
      break;
    case 'search':
      attributes['role'] = 'search';
      break;
    case 'form':
      attributes['role'] = 'form';
      break;
    case 'table':
      attributes['role'] = 'table';
      break;
    case 'grid':
      attributes['role'] = 'grid';
      break;
    case 'listbox':
      attributes['role'] = 'listbox';
      break;
    case 'option':
      attributes['role'] = 'option';
      break;
    case 'tab':
      attributes['role'] = 'tab';
      break;
    case 'tabpanel':
      attributes['role'] = 'tabpanel';
      break;
    case 'tablist':
      attributes['role'] = 'tablist';
      break;
  }

  return attributes;
};

// Medical-specific ARIA labels
export const getMedicalAriaLabel = (
  type: string,
  data?: any
): string => {
  switch (type) {
    case 'case':
      return `Caso médico ${data?.id || ''}: ${data?.patientName || 'Paciente'}, ${data?.diagnosis || 'Sin diagnóstico'}, Urgencia: ${data?.urgency || 'No especificada'}`;
    
    case 'patient':
      return `Paciente ${data?.name || 'Sin nombre'}, Documento: ${data?.document || 'Sin documento'}, Edad: ${data?.age || 'No especificada'}`;
    
    case 'urgency':
      const urgencyLabels = {
        low: 'Urgencia baja',
        medium: 'Urgencia media',
        high: 'Urgencia alta',
        critical: 'Urgencia crítica'
      };
      return urgencyLabels[data as keyof typeof urgencyLabels] || 'Urgencia no especificada';
    
    case 'status':
      const statusLabels = {
        pending: 'Estado pendiente',
        in_review: 'En revisión',
        approved: 'Aprobado',
        rejected: 'Rechazado',
        cancelled: 'Cancelado'
      };
      return statusLabels[data as keyof typeof statusLabels] || 'Estado no especificado';
    
    case 'email':
      return `Correo de ${data?.sender || 'Remitente desconocido'}, Asunto: ${data?.subject || 'Sin asunto'}, Recibido: ${data?.date || 'Fecha desconocida'}`;
    
    case 'referral':
      return `Referencia médica ${data?.number || ''}, Especialidad: ${data?.specialty || 'No especificada'}, Prioridad: ${data?.priority || 'No especificada'}`;
    
    case 'user':
      return `Usuario ${data?.name || 'Sin nombre'}, Rol: ${data?.role || 'Sin rol'}, Email: ${data?.email || 'Sin email'}`;
    
    case 'notification':
      return `Notificación ${data?.type || ''}: ${data?.title || 'Sin título'}, ${data?.message || 'Sin mensaje'}`;
    
    case 'alert':
      return `Alerta del sistema: ${data?.message || 'Sin mensaje'}, Nivel: ${data?.level || 'No especificado'}`;
    
    case 'statistic':
      return `Estadística: ${data?.label || 'Sin etiqueta'}, Valor: ${data?.value || 'Sin valor'}`;
    
    case 'chart':
      return `Gráfico ${data?.type || ''}: ${data?.title || 'Sin título'}, ${data?.description || 'Sin descripción'}`;
    
    case 'form-field':
      const required = data?.required ? 'Campo requerido' : 'Campo opcional';
      return `${data?.label || 'Campo'}, ${required}${data?.error ? `, Error: ${data.error}` : ''}`;
    
    case 'button':
      return `Botón ${data?.action || ''}: ${data?.label || 'Sin etiqueta'}${data?.disabled ? ', Deshabilitado' : ''}`;
    
    case 'link':
      return `Enlace a ${data?.destination || 'destino desconocido'}: ${data?.text || 'Sin texto'}`;
    
    case 'modal':
      return `Ventana modal: ${data?.title || 'Sin título'}${data?.description ? `, ${data.description}` : ''}`;
    
    case 'table':
      return `Tabla ${data?.title || ''} con ${data?.rows || 0} filas y ${data?.columns || 0} columnas`;
    
    case 'pagination':
      return `Paginación: Página ${data?.current || 1} de ${data?.total || 1}, ${data?.itemsPerPage || 0} elementos por página`;
    
    case 'search':
      return `Búsqueda${data?.query ? ` con término: ${data.query}` : ''}, ${data?.results || 0} resultados encontrados`;
    
    case 'filter':
      return `Filtro ${data?.name || ''}: ${data?.value || 'Sin valor'}${data?.active ? ', Activo' : ', Inactivo'}`;
    
    case 'progress':
      return `Progreso: ${data?.percentage || 0}% completado, ${data?.description || 'Sin descripción'}`;
    
    case 'date':
      return `Fecha: ${data?.formatted || data?.value || 'No especificada'}`;
    
    case 'time':
      return `Hora: ${data?.formatted || data?.value || 'No especificada'}`;
    
    case 'file':
      return `Archivo ${data?.name || 'Sin nombre'}, Tipo: ${data?.type || 'Desconocido'}, Tamaño: ${data?.size || 'Desconocido'}`;
    
    default:
      return data?.label || data?.text || 'Elemento sin descripción';
  }
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  options: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: () => void;
  }
) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      options.onEnter?.();
      break;
    case ' ':
      event.preventDefault();
      options.onSpace?.();
      break;
    case 'Escape':
      event.preventDefault();
      options.onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      options.onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      options.onArrowDown?.();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      options.onArrowLeft?.();
      break;
    case 'ArrowRight':
      event.preventDefault();
      options.onArrowRight?.();
      break;
    case 'Tab':
      if (options.onTab) {
        event.preventDefault();
        options.onTab();
      }
      break;
  }
};

// Focus management
export const manageFocus = {
  trap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  restore: (previousElement?: HTMLElement) => {
    if (previousElement) {
      previousElement.focus();
    }
  }
};

// Announce to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export default {
  useScreenReader,
  generateAriaAttributes,
  getMedicalAriaLabel,
  handleKeyboardNavigation,
  manageFocus,
  announceToScreenReader,
};
