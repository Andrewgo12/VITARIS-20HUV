/**
 * Validation Utilities for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import { VALIDATION_CONFIG } from '@/config/app';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'El email es requerido' };
  }

  if (!VALIDATION_CONFIG.EMAIL_PATTERN.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `La contraseña debe tener al menos ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} caracteres` 
    };
  }

  if (!VALIDATION_CONFIG.PASSWORD_PATTERN.test(password)) {
    return { 
      isValid: false, 
      error: 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos' 
    };
  }

  return { isValid: true };
};

// Phone validation
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'El teléfono es requerido' };
  }

  if (!VALIDATION_CONFIG.PHONE_PATTERN.test(phone)) {
    return { isValid: false, error: 'Formato de teléfono inválido' };
  }

  return { isValid: true };
};

// Document validation (Colombian ID)
export const validateDocument = (document: string): ValidationResult => {
  if (!document) {
    return { isValid: false, error: 'El documento es requerido' };
  }

  if (!VALIDATION_CONFIG.DOCUMENT_PATTERN.test(document)) {
    return { isValid: false, error: 'El documento debe tener entre 6 y 12 dígitos' };
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'El nombre es requerido' };
  }

  if (name.length < VALIDATION_CONFIG.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `El nombre debe tener al menos ${VALIDATION_CONFIG.NAME_MIN_LENGTH} caracteres` 
    };
  }

  if (name.length > VALIDATION_CONFIG.NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `El nombre no puede tener más de ${VALIDATION_CONFIG.NAME_MAX_LENGTH} caracteres` 
    };
  }

  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} es requerido` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} es requerido` };
  }

  return { isValid: true };
};

// Date validation
export const validateDate = (date: string | Date, fieldName: string = 'Fecha'): ValidationResult => {
  if (!date) {
    return { isValid: false, error: `${fieldName} es requerida` };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} inválida` };
  }

  return { isValid: true };
};

// Age validation
export const validateAge = (age: number, min: number = 0, max: number = 120): ValidationResult => {
  if (age < min || age > max) {
    return { isValid: false, error: `La edad debe estar entre ${min} y ${max} años` };
  }

  return { isValid: true };
};

// File validation
export const validateFile = (
  file: File, 
  maxSize: number = 10 * 1024 * 1024, // 10MB
  allowedTypes: string[] = ['application/pdf', 'image/jpeg', 'image/png']
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'El archivo es requerido' };
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { isValid: false, error: `El archivo no puede ser mayor a ${maxSizeMB}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Tipo de archivo no permitido' };
  }

  return { isValid: true };
};

// Medical case validation
export const validateMedicalCase = (caseData: any): FormValidationResult => {
  const errors: Record<string, string> = {};

  // Patient name validation
  const nameValidation = validateName(caseData.patientName);
  if (!nameValidation.isValid) {
    errors.patientName = nameValidation.error!;
  }

  // Patient ID validation
  const documentValidation = validateDocument(caseData.patientId);
  if (!documentValidation.isValid) {
    errors.patientId = documentValidation.error!;
  }

  // Diagnosis validation
  const diagnosisValidation = validateRequired(caseData.diagnosis, 'Diagnóstico');
  if (!diagnosisValidation.isValid) {
    errors.diagnosis = diagnosisValidation.error!;
  }

  // Urgency validation
  const urgencyValidation = validateRequired(caseData.urgency, 'Nivel de urgencia');
  if (!urgencyValidation.isValid) {
    errors.urgency = urgencyValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// User validation
export const validateUser = (userData: any): FormValidationResult => {
  const errors: Record<string, string> = {};

  // Name validation
  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  // Email validation
  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  // Password validation (only for new users)
  if (userData.password) {
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!;
    }
  }

  // Role validation
  const roleValidation = validateRequired(userData.role, 'Rol');
  if (!roleValidation.isValid) {
    errors.role = roleValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Login validation
export const validateLogin = (loginData: any): FormValidationResult => {
  const errors: Record<string, string> = {};

  // Email validation
  const emailValidation = validateEmail(loginData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  // Password validation
  const passwordValidation = validateRequired(loginData.password, 'Contraseña');
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Gmail configuration validation
export const validateGmailConfig = (configData: any): FormValidationResult => {
  const errors: Record<string, string> = {};

  // Email account validation
  const emailValidation = validateEmail(configData.emailAccount);
  if (!emailValidation.isValid) {
    errors.emailAccount = emailValidation.error!;
  }

  // Interval validation
  if (!configData.interval || configData.interval < 1) {
    errors.interval = 'El intervalo debe ser mayor a 0';
  }

  // Notification email validation (if notifications enabled)
  if (configData.emailNotifications && configData.notificationEmail) {
    const notificationEmailValidation = validateEmail(configData.notificationEmail);
    if (!notificationEmailValidation.isValid) {
      errors.notificationEmail = notificationEmailValidation.error!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Generic form validation
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => ValidationResult>
): FormValidationResult => {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(data[field]);
    if (!result.isValid) {
      errors[field] = result.error!;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Export all validators
export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateDocument,
  validateName,
  validateRequired,
  validateDate,
  validateAge,
  validateFile,
  validateMedicalCase,
  validateUser,
  validateLogin,
  validateGmailConfig,
  validateForm,
};
