import React, { createContext, useContext, useState } from "react";

// Mock data para demostración
const mockFormData = {
  patient: {
    documentType: "CC",
    documentNumber: "12345678",
    firstName: "María Elena",
    lastName: "Rodríguez García",
    birthDate: "1956-08-15",
    gender: "female",
    phone: "+57 301 234 5678",
    email: "maria.rodriguez@email.com",
    address: "Calle 45 #23-67, Bogotá",
    neighborhood: "Chapinero",
    city: "Bogotá",
    emergencyContactName: "José Rodríguez",
    emergencyContactPhone: "+57 320 987 6543",
    relationship: "hijo",
    occupation: "Profesora jubilada",
    maritalStatus: "widowed",
    educationLevel: "university",
    insurance: "Nueva EPS",
    regime: "contributivo",
  },
  referral: {
    originInstitution: "IPS San Rafael",
    referringDoctor: "Dr. Luis Fernando Gómez",
    medicalLicense: "12345678",
    contactPhone: "+57 312 555 0123",
    referralDate: "2024-01-15",
    referralTime: "14:30",
    urgencyLevel: "high",
    specialty: "cardiologia",
    diagnosis:
      "Dolor torácico agudo con cambios electrocardiográficos sugestivos de síndrome coronario agudo",
    clinicalSummary:
      "Paciente femenina de 67 años que consulta por dolor torácico de inicio súbito, localizado en región precordial, de carácter opresivo, irradiado a brazo izquierdo y mandíbula. Asociado a diaforesis, náuseas y disnea. ECG muestra elevación del segmento ST en derivaciones V2-V5. Antecedentes de hipertensión arterial y diabetes mellitus tipo 2.",
    currentMedications: [
      "Losartán 100mg VO cada 24 horas",
      "Metformina 850mg VO cada 12 horas",
      "Atorvastatina 40mg VO cada 24 horas",
      "Aspirina 100mg VO cada 24 horas",
    ],
    allergies: ["Penicilina", "Mariscos"],
    relevantHistory:
      "HTA desde hace 10 años, DM2 desde hace 8 años, dislipidemia mixta. Antecedente familiar de cardiopatía isquémica (padre).",
    reasonForReferral:
      "Paciente requiere manejo especializado por síndrome coronario agudo con elevación del ST para consideración de reperfusión coronaria urgente.",
    paraclinicalResults:
      "ECG: STEMI anterior extenso, Troponina I: 15.2 ng/mL (VN <0.04), Hemoglobina: 12.8 g/dL, Creatinina: 1.1 mg/dL, Glicemia: 180 mg/dL",
  },
  vitals: {
    bloodPressure: "180/95",
    heartRate: "120",
    respiratoryRate: "28",
    temperature: "38.5",
    oxygenSaturation: "89",
    weight: "72",
    height: "165",
    bmi: "26.4",
    painScale: "8",
    consciousnessLevel: "alert",
    additionalObservations:
      "Paciente sudorosa, pálida, con evidente malestar general. Dolor torácico persistente a pesar de nitroglicerina sublingual. Presenta disnea de medianos esfuerzos.",
    vitalsTakenAt: "2024-01-15T14:45:00",
    takenBy: "Aux. Enfermería Carmen Ruiz",
  },
  documents: {
    hasAuthorization: true,
    authorizationNumber: "AUT-2024-001567",
    hasIdentification: true,
    hasInsuranceCard: true,
    hasConsentForm: true,
    hasLabResults: true,
    hasImagingStudies: false,
    hasPreviousReports: true,
    additionalDocuments: [
      {
        type: "ecg",
        description: "Electrocardiograma de 12 derivaciones",
        required: true,
        uploaded: true,
      },
      {
        type: "lab",
        description: "Exámenes de laboratorio completos",
        required: true,
        uploaded: true,
      },
      {
        type: "consent",
        description: "Consentimiento informado firmado",
        required: true,
        uploaded: true,
      },
    ],
    observations:
      "Documentación completa y en orden. Autorización de la EPS vigente. Consentimiento informado firmado por la paciente.",
  },
  validation: {
    patientDataComplete: true,
    referralDataComplete: true,
    vitalsDataComplete: true,
    documentsComplete: true,
    authorizationValid: true,
    dataVerified: true,
    finalReview:
      "Todos los datos han sido verificados y están completos. La remisión cumple con todos los requisitos para ser procesada. Información clínica detallada y urgencia justificada.",
    submittedAt: null,
    submittedBy: "",
    confirmationNumber: "",
  },
};

interface MockFormContextType {
  formData: typeof mockFormData;
  updateFormData: (section: string, data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  errors: Record<string, string[]>;
}

const MockFormContext = createContext<MockFormContextType | null>(null);

export const MockFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState(mockFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data },
    }));
  };

  const value = {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    isLoading,
    errors,
  };

  return (
    <MockFormContext.Provider value={value}>
      {children}
    </MockFormContext.Provider>
  );
};

export const useMockForm = () => {
  const context = useContext(MockFormContext);
  if (!context) {
    throw new Error("useMockForm must be used within a MockFormProvider");
  }
  return context;
};
