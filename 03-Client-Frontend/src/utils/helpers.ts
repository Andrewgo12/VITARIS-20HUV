/**
 * Helper Utilities for VITAL RED Application
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining classes (from shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const dateUtils = {
  /**
   * Format date to Colombian format
   */
  formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Fecha inválida';
      return format(dateObj, formatStr, { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  },

  /**
   * Format date with time
   */
  formatDateTime(date: string | Date): string {
    return dateUtils.formatDate(date, 'dd/MM/yyyy HH:mm');
  },

  /**
   * Format time only
   */
  formatTime(date: string | Date): string {
    return dateUtils.formatDate(date, 'HH:mm');
  },

  /**
   * Format relative time (e.g., "hace 2 horas")
   */
  formatRelativeTime(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Fecha inválida';
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return 'Fecha inválida';
    }
  },

  /**
   * Check if date is today
   */
  isToday(date: string | Date): boolean {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      const today = new Date();
      return dateObj.toDateString() === today.toDateString();
    } catch (error) {
      return false;
    }
  },

  /**
   * Get Colombian current date
   */
  getCurrentDate(): Date {
    return new Date();
  },

  /**
   * Convert to ISO string for API
   */
  toISOString(date: Date): string {
    return date.toISOString();
  }
};

// String utilities
export const stringUtils = {
  /**
   * Capitalize first letter
   */
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert to title case
   */
  toTitleCase(str: string): string {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Truncate string with ellipsis
   */
  truncate(str: string, length: number = 50): string {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  /**
   * Remove accents from string
   */
  removeAccents(str: string): string {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  /**
   * Generate initials from name
   */
  getInitials(name: string): string {
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
  formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  /**
   * Format document number
   */
  formatDocument(document: string): string {
    if (!document) return '';
    return document.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
};

// Number utilities
export const numberUtils = {
  /**
   * Format number with Colombian locale
   */
  formatNumber(num: number): string {
    return new Intl.NumberFormat('es-CO').format(num);
  },

  /**
   * Format currency in Colombian pesos
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Format percentage
   */
  formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Parse number from string
   */
  parseNumber(str: string): number {
    const cleaned = str.replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
  }
};

// Validation utilities
export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate Colombian document number
   */
  isValidDocument(document: string): boolean {
    const cleaned = document.replace(/\D/g, '');
    return cleaned.length >= 6 && cleaned.length <= 12;
  },

  /**
   * Validate phone number
   */
  isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  },

  /**
   * Validate password strength
   */
  isValidPassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  /**
   * Check if string is empty or whitespace
   */
  isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }
};

// File utilities
export const fileUtils = {
  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Get file extension
   */
  getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  /**
   * Check if file type is allowed
   */
  isAllowedFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  },

  /**
   * Check if file size is within limit
   */
  isFileSizeValid(file: File, maxSizeInBytes: number): boolean {
    return file.size <= maxSizeInBytes;
  },

  /**
   * Generate unique filename
   */
  generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const extension = fileUtils.getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_${timestamp}.${extension}`;
  }
};

// URL utilities
export const urlUtils = {
  /**
   * Build URL with query parameters
   */
  buildUrl(baseUrl: string, params: Record<string, any>): string {
    const url = new URL(baseUrl, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  },

  /**
   * Get query parameter from URL
   */
  getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Remove query parameter from URL
   */
  removeQueryParam(param: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url.toString());
  }
};

// Array utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   */
  removeDuplicates<T>(array: T[]): T[] {
    return [...new Set(array)];
  },

  /**
   * Group array by key
   */
  groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Sort array by key
   */
  sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * Paginate array
   */
  paginate<T>(array: T[], page: number, pageSize: number): T[] {
    const startIndex = (page - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
  }
};

// Local storage utilities
export const storageUtils = {
  /**
   * Set item in localStorage with JSON serialization
   */
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Get item from localStorage with JSON parsing
   */
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Color utilities
export const colorUtils = {
  /**
   * Get color for urgency level
   */
  getUrgencyColor(urgency: string): string {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100',
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  },

  /**
   * Get color for status
   */
  getStatusColor(status: string): string {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      in_review: 'text-blue-600 bg-blue-100',
      approved: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  },

  /**
   * Generate random color
   */
  generateRandomColor(): string {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
};

// Export all utilities
export {
  dateUtils,
  stringUtils,
  numberUtils,
  validationUtils,
  fileUtils,
  urlUtils,
  arrayUtils,
  storageUtils,
  colorUtils,
};
