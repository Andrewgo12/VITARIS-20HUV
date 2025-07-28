import { FormData } from "@/context/FormContext";

const STORAGE_KEY = "eps-form-data";

export function saveFormToStorage(formData: FormData): void {
  try {
    // Create a serializable version of the form data (excluding File objects)
    const serializableData = {
      ...formData,
      patient: {
        ...formData.patient,
        attachments1: formData.patient.attachments1.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          lastModified: f.lastModified,
        })),
      },
      vitals: {
        ...formData.vitals,
        attachments3: formData.vitals.attachments3.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          lastModified: f.lastModified,
        })),
      },
      documents: {
        ...formData.documents,
        attachments4: formData.documents.attachments4.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          lastModified: f.lastModified,
        })),
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
  } catch (error) {
    console.warn("Could not save form data to storage:", error);
  }
}

export function loadFormFromStorage(): Partial<FormData> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Could not load form data from storage:", error);
  }
  return null;
}

export function clearFormFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Could not clear form data from storage:", error);
  }
}

export function generateFormPDF(formData: FormData): string {
  // This would generate a PDF summary of the form
  // For now, return a formatted text version

  const summary = `
FORMULARIO DE INGRESO EPS - HOSPITAL UNIVERSITARIO DEL VALLE
===========================================================

DATOS DEL PACIENTE:
- Nombre: ${formData.patient.fullName}
- Identificación: ${formData.patient.identificationType} ${formData.patient.identificationNumber}
- Edad: ${formData.patient.age} años
- Sexo: ${formData.patient.sex}
- EPS: ${formData.patient.eps}
- Teléfono: ${formData.patient.phone}
- Dirección: ${formData.patient.address}

REMISIÓN Y DIAGNÓSTICO:
- Servicio: ${formData.referral.referralService}
- Motivo: ${formData.referral.referralReason}
- Diagnóstico Principal: ${formData.referral.primaryDiagnosis}
- Especialidad: ${formData.referral.medicalSpecialty || "No especificada"}

SIGNOS VITALES:
- FC: ${formData.vitals.heartRate} lpm
- FR: ${formData.vitals.respiratoryRate} rpm
- Temperatura: ${formData.vitals.temperature}°C
- PA: ${formData.vitals.systolicBP}/${formData.vitals.diastolicBP} mmHg
- SatO2: ${formData.vitals.oxygenSaturation}%
- IMC: ${formData.vitals.bmi || "No calculado"}

PROFESIONAL:
- Nombre: ${formData.documents.professionalName}
- Cargo: ${formData.documents.professionalPosition}
- Teléfono: ${formData.documents.professionalPhone}

ARCHIVOS ADJUNTOS:
- Identificación: ${formData.patient.attachments1.length} archivos
- Signos Vitales: ${formData.vitals.attachments3.length} archivos
- Documentos: ${formData.documents.attachments4.length} archivos

Fecha de generación: ${new Date().toLocaleString("es-CO")}
  `;

  return summary;
}

export function exportFormAsJSON(formData: FormData): string {
  return JSON.stringify(formData, null, 2);
}

export function calculateFormCompletionPercentage(formData: FormData): number {
  let totalFields = 0;
  let completedFields = 0;

  // Patient data (12 required fields)
  const patientRequired = [
    "identificationType",
    "identificationNumber",
    "fullName",
    "birthDate",
    "sex",
    "eps",
    "affiliationRegime",
    "affiliateType",
    "affiliationNumber",
    "affiliationStatus",
    "phone",
    "address",
  ];

  totalFields += patientRequired.length;
  completedFields += patientRequired.filter((field) => {
    const value = formData.patient[field as keyof typeof formData.patient];
    return value && value.toString().trim() !== "";
  }).length;

  // Referral data (3 required fields)
  const referralRequired = [
    "referralService",
    "referralReason",
    "primaryDiagnosis",
  ];
  totalFields += referralRequired.length;
  completedFields += referralRequired.filter((field) => {
    const value = formData.referral[field as keyof typeof formData.referral];
    return value && value.toString().trim() !== "";
  }).length;

  // Vital signs (6 required fields)
  const vitalsRequired = [
    "heartRate",
    "respiratoryRate",
    "temperature",
    "systolicBP",
    "diastolicBP",
    "oxygenSaturation",
  ];
  totalFields += vitalsRequired.length;
  completedFields += vitalsRequired.filter((field) => {
    const value = formData.vitals[field as keyof typeof formData.vitals];
    return value && value.toString().trim() !== "";
  }).length;

  // Documents data (3 required fields)
  const documentsRequired = [
    "professionalName",
    "professionalPosition",
    "professionalPhone",
  ];
  totalFields += documentsRequired.length;
  completedFields += documentsRequired.filter((field) => {
    const value = formData.documents[field as keyof typeof formData.documents];
    return value && value.toString().trim() !== "";
  }).length;

  return Math.round((completedFields / totalFields) * 100);
}
