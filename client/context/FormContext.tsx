import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface PatientData {
  // Modal 1: Patient Identification
  identificationType: string;
  identificationNumber: string;
  fullName: string;
  birthDate: string;
  age: number;
  sex: string;
  eps: string;
  affiliationRegime: string;
  affiliateType: string;
  affiliationNumber: string;
  affiliationStatus: string;
  sisbenLevel: string;
  phone: string;
  address: string;
  email: string;
  attachments1: File[];
}

export interface ReferralData {
  // Modal 2: Referral and Diagnosis
  consultationDate: string;
  referralService: string;
  referralReason: string;
  primaryDiagnosis: string;
  secondaryDiagnosis1: string;
  secondaryDiagnosis2: string;
  medicalSpecialty: string;
  personalHistory: string[];
  familyHistory: string;
  allergies: string;
  currentMedications: string;
}

export interface VitalSigns {
  // Modal 3: Vital Signs
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  systolicBP: string;
  diastolicBP: string;
  oxygenSaturation: string;
  glasgowScale: string;
  glucometry: string;
  weight: string;
  height: string;
  bmi: number;
  attachments3: File[];
}

export interface DocumentsData {
  // Modal 4: Documents
  additionalObservations: string;
  professionalName: string;
  professionalPosition: string;
  professionalPhone: string;
  attachments4: File[];
}

export interface FormData {
  currentStep: number;
  patient: PatientData;
  referral: ReferralData;
  vitals: VitalSigns;
  documents: DocumentsData;
  isComplete: boolean;
}

type FormAction = 
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_PATIENT'; payload: Partial<PatientData> }
  | { type: 'UPDATE_REFERRAL'; payload: Partial<ReferralData> }
  | { type: 'UPDATE_VITALS'; payload: Partial<VitalSigns> }
  | { type: 'UPDATE_DOCUMENTS'; payload: Partial<DocumentsData> }
  | { type: 'RESET_FORM' }
  | { type: 'CALCULATE_BMI' };

const initialFormData: FormData = {
  currentStep: 1,
  patient: {
    identificationType: '',
    identificationNumber: '',
    fullName: '',
    birthDate: '',
    age: 0,
    sex: '',
    eps: '',
    affiliationRegime: '',
    affiliateType: '',
    affiliationNumber: '',
    affiliationStatus: '',
    sisbenLevel: '',
    phone: '',
    address: '',
    email: '',
    attachments1: [],
  },
  referral: {
    consultationDate: new Date().toISOString().split('T')[0],
    referralService: '',
    referralReason: '',
    primaryDiagnosis: '',
    secondaryDiagnosis1: '',
    secondaryDiagnosis2: '',
    medicalSpecialty: '',
    personalHistory: [],
    familyHistory: '',
    allergies: '',
    currentMedications: '',
  },
  vitals: {
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    systolicBP: '',
    diastolicBP: '',
    oxygenSaturation: '',
    glasgowScale: '',
    glucometry: '',
    weight: '',
    height: '',
    bmi: 0,
    attachments3: [],
  },
  documents: {
    additionalObservations: '',
    professionalName: '',
    professionalPosition: '',
    professionalPhone: '',
    attachments4: [],
  },
  isComplete: false,
};

function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_PATIENT':
      return { 
        ...state, 
        patient: { ...state.patient, ...action.payload }
      };
    case 'UPDATE_REFERRAL':
      return { 
        ...state, 
        referral: { ...state.referral, ...action.payload }
      };
    case 'UPDATE_VITALS':
      return { 
        ...state, 
        vitals: { ...state.vitals, ...action.payload }
      };
    case 'UPDATE_DOCUMENTS':
      return { 
        ...state, 
        documents: { ...state.documents, ...action.payload }
      };
    case 'CALCULATE_BMI':
      const weight = parseFloat(state.vitals.weight);
      const height = parseFloat(state.vitals.height) / 100; // Convert cm to m
      const bmi = weight && height ? weight / (height * height) : 0;
      return {
        ...state,
        vitals: { ...state.vitals, bmi: Math.round(bmi * 10) / 10 }
      };
    case 'RESET_FORM':
      return initialFormData;
    default:
      return state;
  }
}

interface FormContextType {
  formData: FormData;
  dispatch: React.Dispatch<FormAction>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  calculateAge: (birthDate: string) => void;
  calculateBMI: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);

  const nextStep = () => {
    if (formData.currentStep < 5) {
      dispatch({ type: 'SET_STEP', payload: formData.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (formData.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: formData.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    // Only allow going to previous steps or current step, not future steps
    if (step >= 1 && step <= 5 && step <= formData.currentStep) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    dispatch({ type: 'UPDATE_PATIENT', payload: { age } });
  };

  const calculateBMI = () => {
    dispatch({ type: 'CALCULATE_BMI' });
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      dispatch, 
      nextStep, 
      prevStep, 
      goToStep,
      calculateAge,
      calculateBMI
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
