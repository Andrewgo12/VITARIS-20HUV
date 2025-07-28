import { createContext, useContext, useState, ReactNode } from "react";

// Mock form data structure
const mockFormData = {
  patient: {
    identificationType: "CC",
    identificationNumber: "12345678",
    fullName: "Juan Pérez García",
    birthDate: "1985-06-15",
    age: 38,
    sex: "M",
    eps: "NUEVA_EPS",
    affiliationRegime: "CONTRIBUTIVO",
    affiliateType: "COTIZANTE",
    affiliationNumber: "123456789",
    affiliationStatus: "ACTIVO",
    sisbenLevel: "NO_APLICA",
    phone: "3001234567",
    email: "juan.perez@email.com",
    address: "Calle 123 #45-67, Cali, Valle del Cauca",
    emergencyContactName: "María García",
    emergencyContactPhone: "3007654321",
    emergencyContactRelation: "CONYUGE",
    occupation: "Ingeniero",
    educationLevel: "UNIVERSITARIO",
    maritalStatus: "CASADO",
    pregnancyStatus: "",
    pregnancyWeeks: "",
    currentSymptoms: "Dolor abdominal intenso, náuseas y vómito",
    symptomsOnset: "Hace 2 días",
    symptomsIntensity: "SEVERO",
    painScale: "8",
    chronicConditions: "Hipertensión arterial controlada",
    previousHospitalizations: "Apendicectomía en 2020",
    insuranceAuthorization: "AUTH-2024-001",
    attachments1: [],
  },
  referral: {
    consultationDate: "2024-01-15T10:30",
    referralService: "URGENCIAS",
    referralReason: "Dolor abdominal agudo con signos de posible obstrucción intestinal",
    primaryDiagnosis: "K59.1",
    secondaryDiagnosis1: "K29.7",
    secondaryDiagnosis2: "I10",
    medicalSpecialty: "CIRUGIA_GENERAL",
    personalHistory: ["HTA", "CIRUGIAS"],
    familyHistory: "Antecedentes familiares de diabetes tipo 2 (madre)",
    allergies: "Penicilina",
    currentMedications: "Losartán 50mg cada 12 horas, Omeprazol 20mg en ayunas",
  },
  vitals: {
    heartRate: "95",
    respiratoryRate: "22",
    temperature: "37.8",
    systolicBP: "145",
    diastolicBP: "90",
    oxygenSaturation: "97",
    glasgowScale: "15",
    glucometry: "120",
    weight: "75.5",
    height: "175",
    bmi: 24.6,
    attachments3: [],
  },
  documents: {
    professionalName: "Dr. Ana López Martínez",
    professionalPosition: "Médico General",
    professionalPhone: "3009876543",
    additionalObservations: "Paciente con cuadro clínico sugestivo de obstrucción intestinal, requiere valoración quirúrgica urgente",
    attachments4: [],
  },
};

interface MockFormContextType {
  formData: typeof mockFormData;
  dispatch: (action: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculateAge: (birthDate: string) => void;
  calculateBMI: () => void;
}

const MockFormContext = createContext<MockFormContextType | undefined>(undefined);

export const MockFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState(mockFormData);

  const dispatch = (action: any) => {
    switch (action.type) {
      case "UPDATE_PATIENT":
        setFormData(prev => ({
          ...prev,
          patient: { ...prev.patient, ...action.payload }
        }));
        break;
      case "UPDATE_REFERRAL":
        setFormData(prev => ({
          ...prev,
          referral: { ...prev.referral, ...action.payload }
        }));
        break;
      case "UPDATE_VITALS":
        setFormData(prev => ({
          ...prev,
          vitals: { ...prev.vitals, ...action.payload }
        }));
        break;
      case "UPDATE_DOCUMENTS":
        setFormData(prev => ({
          ...prev,
          documents: { ...prev.documents, ...action.payload }
        }));
        break;
    }
  };

  const nextStep = () => {
    console.log("Next step");
  };

  const prevStep = () => {
    console.log("Previous step");
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    setFormData(prev => ({
      ...prev,
      patient: { ...prev.patient, age }
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.vitals.weight);
    const height = parseFloat(formData.vitals.height) / 100; // Convert cm to m
    if (weight && height) {
      const bmi = parseFloat((weight / (height * height)).toFixed(1));
      setFormData(prev => ({
        ...prev,
        vitals: { ...prev.vitals, bmi }
      }));
    }
  };

  return (
    <MockFormContext.Provider value={{
      formData,
      dispatch,
      nextStep,
      prevStep,
      calculateAge,
      calculateBMI,
    }}>
      {children}
    </MockFormContext.Provider>
  );
};

export const useMockForm = () => {
  const context = useContext(MockFormContext);
  if (context === undefined) {
    throw new Error("useMockForm must be used within a MockFormProvider");
  }
  return context;
};
