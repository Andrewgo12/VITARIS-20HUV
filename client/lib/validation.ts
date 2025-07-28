import {
  PatientData,
  ReferralData,
  VitalSigns,
  DocumentsData,
} from "@/context/FormContext";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePatientData(patient: PatientData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!patient.identificationType)
    errors.push("Tipo de identificación es requerido");
  if (!patient.identificationNumber)
    errors.push("Número de identificación es requerido");
  if (!patient.fullName) errors.push("Nombre completo es requerido");
  if (!patient.birthDate) errors.push("Fecha de nacimiento es requerida");
  if (!patient.sex) errors.push("Sexo es requerido");
  if (!patient.eps) errors.push("EPS es requerida");
  if (!patient.affiliationRegime)
    errors.push("Régimen de afiliación es requerido");
  if (!patient.affiliateType) errors.push("Tipo de afiliado es requerido");
  if (!patient.affiliationNumber)
    errors.push("Número de afiliación es requerido");
  if (!patient.affiliationStatus)
    errors.push("Estado de afiliación es requerido");
  if (!patient.phone) errors.push("Teléfono es requerido");
  if (!patient.address) errors.push("Dirección es requerida");

  // Format validation
  if (
    patient.identificationNumber &&
    !/^\d+$/.test(patient.identificationNumber)
  ) {
    errors.push("Número de identificación debe contener solo números");
  }

  if (patient.phone && !/^\d{7,10}$/.test(patient.phone)) {
    errors.push("Teléfono debe tener entre 7 y 10 dígitos");
  }

  if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
    errors.push("Formato de correo electrónico inválido");
  }

  // Age validation
  if (patient.age < 0 || patient.age > 120) {
    errors.push("Edad debe estar entre 0 y 120 años");
  }

  // Warnings
  if (!patient.email) {
    warnings.push("Se recomienda proporcionar un correo electrónico");
  }

  if (patient.attachments1.length === 0) {
    warnings.push("Se recomienda adjuntar documentos de identificación");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateReferralData(referral: ReferralData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!referral.referralService)
    errors.push("Servicio de remisión es requerido");
  if (!referral.referralReason) errors.push("Motivo de remisión es requerido");
  if (!referral.primaryDiagnosis)
    errors.push("Diagnóstico principal es requerido");

  // Content validation
  if (referral.referralReason && referral.referralReason.length < 20) {
    errors.push("Motivo de remisión debe tener al menos 20 caracteres");
  }

  if (referral.referralReason && referral.referralReason.length > 1000) {
    errors.push("Motivo de remisión no puede exceder 1000 caracteres");
  }

  // Warnings
  if (!referral.medicalSpecialty) {
    warnings.push("Se recomienda especificar la especialidad médica");
  }

  if (!referral.allergies) {
    warnings.push('Se recomienda especificar alergias conocidas o "Ninguna"');
  }

  if (referral.personalHistory.length === 0) {
    warnings.push("Se recomienda marcar antecedentes personales relevantes");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateVitalSigns(vitals: VitalSigns): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!vitals.heartRate) errors.push("Frecuencia cardíaca es requerida");
  if (!vitals.respiratoryRate)
    errors.push("Frecuencia respiratoria es requerida");
  if (!vitals.temperature) errors.push("Temperatura es requerida");
  if (!vitals.systolicBP) errors.push("Presión sistólica es requerida");
  if (!vitals.diastolicBP) errors.push("Presión diastólica es requerida");
  if (!vitals.oxygenSaturation)
    errors.push("Saturación de oxígeno es requerida");

  // Range validation
  const hr = parseFloat(vitals.heartRate);
  if (hr && (hr < 30 || hr > 200)) {
    errors.push("Frecuencia cardíaca debe estar entre 30 y 200 lpm");
  }

  const rr = parseFloat(vitals.respiratoryRate);
  if (rr && (rr < 8 || rr > 50)) {
    errors.push("Frecuencia respiratoria debe estar entre 8 y 50 rpm");
  }

  const temp = parseFloat(vitals.temperature);
  if (temp && (temp < 32 || temp > 45)) {
    errors.push("Temperatura debe estar entre 32°C y 45°C");
  }

  const systolic = parseFloat(vitals.systolicBP);
  const diastolic = parseFloat(vitals.diastolicBP);
  if (systolic && diastolic && systolic <= diastolic) {
    errors.push("Presión sistólica debe ser mayor que la diastólica");
  }

  if (systolic && (systolic < 60 || systolic > 250)) {
    errors.push("Presión sistólica debe estar entre 60 y 250 mmHg");
  }

  if (diastolic && (diastolic < 30 || diastolic > 150)) {
    errors.push("Presión diastólica debe estar entre 30 y 150 mmHg");
  }

  const sat = parseFloat(vitals.oxygenSaturation);
  if (sat && (sat < 70 || sat > 100)) {
    errors.push("Saturación de oxígeno debe estar entre 70% y 100%");
  }

  // Critical values warnings
  if (hr && (hr < 50 || hr > 120)) {
    warnings.push("Frecuencia cardíaca fuera del rango normal (50-120 lpm)");
  }

  if (temp && (temp < 35.5 || temp > 38)) {
    warnings.push("Temperatura fuera del rango normal (35.5-38°C)");
  }

  if (sat && sat < 95) {
    warnings.push("Saturación de oxígeno baja (<95%) - Requiere atención");
  }

  if (systolic && systolic > 140) {
    warnings.push("Presión sistólica elevada (>140 mmHg)");
  }

  // Optional field warnings
  if (!vitals.glasgowScale) {
    warnings.push("Se recomienda evaluar la escala de Glasgow");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateDocumentsData(
  documents: DocumentsData,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!documents.professionalName)
    errors.push("Nombre del profesional es requerido");
  if (!documents.professionalPosition)
    errors.push("Cargo del profesional es requerido");
  if (!documents.professionalPhone)
    errors.push("Teléfono del profesional es requerido");

  // Phone validation
  if (
    documents.professionalPhone &&
    !/^\d{7,10}$/.test(documents.professionalPhone)
  ) {
    errors.push("Teléfono profesional debe tener entre 7 y 10 dígitos");
  }

  // Warnings
  if (!documents.additionalObservations) {
    warnings.push("Se recomienda agregar observaciones adicionales");
  }

  if (documents.attachments4.length === 0) {
    warnings.push("Se recomienda adjuntar documentos de soporte médico");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  return allowedTypes.includes(extension);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
