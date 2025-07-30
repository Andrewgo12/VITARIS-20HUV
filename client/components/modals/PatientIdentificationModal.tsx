import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  FileText,
  User,
  CreditCard,
  MapPin,
  Phone,
  Activity,
  Heart,
  Shield,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Users,
  ChevronRight,
  IdCard,
  Building,
  Baby,
  CheckCircle,
  AlertTriangle,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/context/MedicalDataContext";
import { ResponsiveModalWrapper } from "@/components/ResponsiveModalWrapper";

interface PatientIdentificationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  patientId?: string;
  mode?: "create" | "edit";
  onPatientCreated?: (patient: any) => void;
}

const identificationTypes = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "RC", label: "Registro Civil" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PP", label: "Pasaporte" },
];

const sexOptions = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
];

const epsOptions = [
  { value: "NUEVA_EPS", label: "Nueva EPS" },
  { value: "SAVIA_SALUD", label: "Savia Salud" },
  { value: "SANITAS", label: "Sanitas" },
  { value: "FAMISANAR", label: "Famisanar" },
  { value: "COMPENSAR", label: "Compensar" },
  { value: "SURA", label: "SURA" },
  { value: "OTRO", label: "Otro" },
];

const affiliationRegimes = [
  { value: "SUBSIDIADO", label: "Subsidiado" },
  { value: "CONTRIBUTIVO", label: "Contributivo" },
  { value: "ESPECIAL", label: "Especial" },
];

const affiliateTypes = [
  { value: "COTIZANTE", label: "Cotizante" },
  { value: "BENEFICIARIO", label: "Beneficiario" },
  { value: "ADICIONAL", label: "Adicional" },
];

const affiliationStatuses = [
  { value: "ACTIVO", label: "Activo" },
  { value: "SUSPENDIDO", label: "Suspendido" },
  { value: "RETIRADO", label: "Retirado" },
];

const sisbenLevels = [
  { value: "1", label: "Nivel 1" },
  { value: "2", label: "Nivel 2" },
  { value: "3", label: "Nivel 3" },
  { value: "4", label: "Nivel 4" },
  { value: "NO_APLICA", label: "No Aplica" },
];

const educationLevels = [
  { value: "NINGUNO", label: "Ninguno" },
  { value: "PRIMARIA", label: "Primaria" },
  { value: "SECUNDARIA", label: "Secundaria" },
  { value: "TECNICO", label: "Técnico" },
  { value: "UNIVERSITARIO", label: "Universitario" },
  { value: "POSTGRADO", label: "Postgrado" },
];

const maritalStatuses = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "UNION_LIBRE", label: "Unión Libre" },
  { value: "SEPARADO", label: "Separado(a)" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUDO", label: "Viudo(a)" },
];

const relationOptions = [
  { value: "PADRE", label: "Padre" },
  { value: "MADRE", label: "Madre" },
  { value: "HIJO", label: "Hijo(a)" },
  { value: "HERMANO", label: "Hermano(a)" },
  { value: "CONYUGE", label: "Cónyuge" },
  { value: "AMIGO", label: "Amigo(a)" },
  { value: "OTRO", label: "Otro" },
];

const painScales = [
  { value: "0", label: "0 - Sin dolor" },
  { value: "1", label: "1 - Muy leve" },
  { value: "2", label: "2 - Leve" },
  { value: "3", label: "3 - Moderado bajo" },
  { value: "4", label: "4 - Moderado" },
  { value: "5", label: "5 - Moderado alto" },
  { value: "6", label: "6 - Intenso bajo" },
  { value: "7", label: "7 - Intenso" },
  { value: "8", label: "8 - Muy intenso" },
  { value: "9", label: "9 - Insoportable" },
  { value: "10", label: "10 - Máximo dolor" },
];

const intensityLevels = [
  { value: "LEVE", label: "Leve" },
  { value: "MODERADO", label: "Moderado" },
  { value: "SEVERO", label: "Severo" },
  { value: "CRITICO", label: "Crítico" },
];

export default function PatientIdentificationModal({
  isOpen = false,
  onClose,
  patientId,
  mode = "create",
  onPatientCreated,
}: PatientIdentificationModalProps) {
  const { toast } = useToast();
  const { addPatient, updatePatient, getPatient, saveToLocal } =
    useMedicalData();

  // Initialize form data
  const [formData, setFormData] = useState({
    // Personal Information
    identificationType: "",
    identificationNumber: "",
    fullName: "",
    birthDate: "",
    age: 0,
    sex: "",
    bloodType: "",
    allergies: [],

    // EPS Information
    eps: "",
    affiliationRegime: "",
    affiliateType: "",
    affiliationNumber: "",
    affiliationStatus: "",
    sisbenLevel: "",

    // Contact Information
    address: "",
    phone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    // Sociodemographic Information
    occupation: "",
    educationLevel: "",
    maritalStatus: "",
    pregnancyStatus: "",
    pregnancyWeeks: "",

    // Medical Information
    currentSymptoms: "",
    symptomsOnset: "",
    symptomsIntensity: "",
    painScale: "",
    chronicConditions: "",
    previousHospitalizations: "",
    insuranceAuthorization: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load patient data if editing
  useEffect(() => {
    if (mode === "edit" && patientId) {
      const patient = getPatient(patientId);
      if (patient) {
        setFormData({
          identificationType: patient.personalInfo.identificationType,
          identificationNumber: patient.personalInfo.identificationNumber,
          fullName: patient.personalInfo.fullName,
          birthDate: patient.personalInfo.birthDate,
          age: patient.personalInfo.age,
          sex: patient.personalInfo.sex,
          bloodType: patient.personalInfo.bloodType || "",
          allergies: patient.personalInfo.allergies || [],
          eps: patient.epsInfo.eps,
          affiliationRegime: patient.epsInfo.affiliationRegime,
          affiliateType: patient.epsInfo.affiliateType,
          affiliationNumber: patient.epsInfo.affiliationNumber,
          affiliationStatus: patient.epsInfo.affiliationStatus,
          sisbenLevel: patient.epsInfo.sisbenLevel || "",
          address: patient.contactInfo.address,
          phone: patient.contactInfo.phone,
          email: patient.contactInfo.email || "",
          emergencyContactName: patient.contactInfo.emergencyContactName,
          emergencyContactPhone: patient.contactInfo.emergencyContactPhone,
          emergencyContactRelation:
            patient.contactInfo.emergencyContactRelation,
          occupation: patient.sociodemographic.occupation,
          educationLevel: patient.sociodemographic.educationLevel,
          maritalStatus: patient.sociodemographic.maritalStatus,
          pregnancyStatus: patient.sociodemographic.pregnancyStatus || "",
          pregnancyWeeks:
            patient.sociodemographic.pregnancyWeeks?.toString() || "",
          currentSymptoms: patient.medicalInfo.currentSymptoms,
          symptomsOnset: patient.medicalInfo.symptomsOnset,
          symptomsIntensity: patient.medicalInfo.symptomsIntensity,
          painScale: patient.medicalInfo.painScale.toString(),
          chronicConditions: patient.medicalInfo.chronicConditions,
          previousHospitalizations:
            patient.medicalInfo.previousHospitalizations,
          insuranceAuthorization: patient.medicalInfo.insuranceAuthorization,
        });
      }
    }
  }, [mode, patientId, getPatient]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Calculate age when birth date changes
    if (field === "birthDate" && value) {
      const age = calculateAge(value as string);
      setFormData((prev) => ({ ...prev, age }));
    }

    // Clear field errors when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const required = [
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
      "emergencyContactName",
      "emergencyContactPhone",
      "emergencyContactRelation",
      "occupation",
      "educationLevel",
      "maritalStatus",
      "currentSymptoms",
      "symptomsOnset",
      "symptomsIntensity",
      "painScale",
      "chronicConditions",
      "previousHospitalizations",
      "insuranceAuthorization",
    ];

    required.forEach((field) => {
      if (
        !formData[field as keyof typeof formData] ||
        formData[field as keyof typeof formData].toString().trim() === ""
      ) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    // Validate pregnancy fields for females
    if (formData.sex === "F") {
      if (!formData.pregnancyStatus) {
        errors.pregnancyStatus = "Campo obligatorio para pacientes femeninas";
      }
      if (formData.pregnancyStatus === "SI" && !formData.pregnancyWeeks) {
        errors.pregnancyWeeks = "Semanas de gestación requeridas";
      }
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Formato de email inválido";
    }

    // Validate identification number
    if (
      formData.identificationNumber &&
      !/^[0-9]+$/.test(formData.identificationNumber)
    ) {
      errors.identificationNumber = "Solo se permiten números";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const attachments = uploadedFiles.map((file, index) => ({
        id: `att_${Date.now()}_${index}`,
        name: file.name,
        type: "identification",
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString(),
      }));

      const patientData = {
        personalInfo: {
          identificationType: formData.identificationType,
          identificationNumber: formData.identificationNumber,
          fullName: formData.fullName,
          birthDate: formData.birthDate,
          age: formData.age,
          sex: formData.sex,
          bloodType: formData.bloodType,
          allergies: formData.allergies,
        },
        epsInfo: {
          eps: formData.eps,
          affiliationRegime: formData.affiliationRegime,
          affiliateType: formData.affiliateType,
          affiliationNumber: formData.affiliationNumber,
          affiliationStatus: formData.affiliationStatus,
          sisbenLevel: formData.sisbenLevel,
        },
        contactInfo: {
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          emergencyContactRelation: formData.emergencyContactRelation,
        },
        sociodemographic: {
          occupation: formData.occupation,
          educationLevel: formData.educationLevel,
          maritalStatus: formData.maritalStatus,
          pregnancyStatus: formData.pregnancyStatus,
          pregnancyWeeks: formData.pregnancyWeeks
            ? parseInt(formData.pregnancyWeeks)
            : undefined,
        },
        medicalInfo: {
          currentSymptoms: formData.currentSymptoms,
          symptomsOnset: formData.symptomsOnset,
          symptomsIntensity: formData.symptomsIntensity,
          painScale: parseInt(formData.painScale),
          chronicConditions: formData.chronicConditions,
          previousHospitalizations: formData.previousHospitalizations,
          insuranceAuthorization: formData.insuranceAuthorization,
        },
        currentStatus: {
          status: "active" as const,
          admissionDate: new Date().toISOString(),
          assignedDoctor: "Dr. Sistema",
          priority: "medium" as const,
        },
        attachments,
      };

      if (mode === "edit" && patientId) {
        updatePatient(patientId, patientData);
        toast({
          title: "Paciente actualizado",
          description:
            "Los datos del paciente han sido actualizados exitosamente",
        });
      } else {
        addPatient(patientData);
        toast({
          title: "Paciente registrado",
          description:
            "El paciente ha sido registrado exitosamente en el sistema",
        });
      }

      // Auto-save to localStorage
      saveToLocal();

      // Call callback if provided
      if (onPatientCreated) {
        onPatientCreated(patientData);
      }

      // Close modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar la información del paciente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProgress = () => {
    // Save progress to localStorage
    localStorage.setItem(
      "patient_identification_draft",
      JSON.stringify(formData),
    );
    toast({
      title: "Progreso guardado",
      description: "Los datos han sido guardados localmente",
    });
  };

  const modalContent = (
    <Card className="max-w-6xl w-full max-h-[95vh] overflow-y-auto">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <CardTitle className="flex items-center gap-3">
          <User className="w-6 h-6" />
          {mode === "edit" ? "Editar Paciente" : "Identificación del Paciente"}
        </CardTitle>
        <p className="text-blue-100 text-sm">
          Complete la información básica del paciente y validación de afiliación
          EPS
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Información Personal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identificationType">
                Tipo de Identificación *
              </Label>
              <Select
                value={formData.identificationType}
                onValueChange={(value) =>
                  handleInputChange("identificationType", value)
                }
              >
                <SelectTrigger
                  className={
                    fieldErrors.identificationType ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {identificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.identificationType && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.identificationType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="identificationNumber">
                Número de Identificación *
              </Label>
              <Input
                id="identificationNumber"
                type="text"
                placeholder="Número de documento"
                value={formData.identificationNumber}
                onChange={(e) =>
                  handleInputChange("identificationNumber", e.target.value)
                }
                className={`font-mono ${fieldErrors.identificationNumber ? "border-red-500" : ""}`}
              />
              {fieldErrors.identificationNumber && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.identificationNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nombres y apellidos"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={fieldErrors.fullName ? "border-red-500" : ""}
              />
              {fieldErrors.fullName && (
                <p className="text-red-500 text-sm">{fieldErrors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className={fieldErrors.birthDate ? "border-red-500" : ""}
              />
              {fieldErrors.birthDate && (
                <p className="text-red-500 text-sm">{fieldErrors.birthDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ""}
                readOnly
                className="bg-gray-50"
                placeholder="Calculada automáticamente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sexo *</Label>
              <Select
                value={formData.sex}
                onValueChange={(value) => handleInputChange("sex", value)}
              >
                <SelectTrigger
                  className={fieldErrors.sex ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
                <SelectContent>
                  {sexOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.sex && (
                <p className="text-red-500 text-sm">{fieldErrors.sex}</p>
              )}
            </div>
          </div>
        </div>

        {/* EPS Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Información EPS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eps">EPS *</Label>
              <Select
                value={formData.eps}
                onValueChange={(value) => handleInputChange("eps", value)}
              >
                <SelectTrigger
                  className={fieldErrors.eps ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar EPS" />
                </SelectTrigger>
                <SelectContent>
                  {epsOptions.map((eps) => (
                    <SelectItem key={eps.value} value={eps.value}>
                      {eps.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.eps && (
                <p className="text-red-500 text-sm">{fieldErrors.eps}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliationRegime">Régimen de Afiliación *</Label>
              <Select
                value={formData.affiliationRegime}
                onValueChange={(value) =>
                  handleInputChange("affiliationRegime", value)
                }
              >
                <SelectTrigger
                  className={
                    fieldErrors.affiliationRegime ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Seleccionar régimen" />
                </SelectTrigger>
                <SelectContent>
                  {affiliationRegimes.map((regime) => (
                    <SelectItem key={regime.value} value={regime.value}>
                      {regime.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.affiliationRegime && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.affiliationRegime}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliateType">Tipo de Afiliado *</Label>
              <Select
                value={formData.affiliateType}
                onValueChange={(value) =>
                  handleInputChange("affiliateType", value)
                }
              >
                <SelectTrigger
                  className={fieldErrors.affiliateType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {affiliateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.affiliateType && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.affiliateType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliationNumber">Número de Afiliación *</Label>
              <Input
                id="affiliationNumber"
                type="text"
                placeholder="Número de afiliación EPS"
                value={formData.affiliationNumber}
                onChange={(e) =>
                  handleInputChange("affiliationNumber", e.target.value)
                }
                className={`font-mono ${fieldErrors.affiliationNumber ? "border-red-500" : ""}`}
              />
              {fieldErrors.affiliationNumber && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.affiliationNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliationStatus">Estado de Afiliación *</Label>
              <Select
                value={formData.affiliationStatus}
                onValueChange={(value) =>
                  handleInputChange("affiliationStatus", value)
                }
              >
                <SelectTrigger
                  className={
                    fieldErrors.affiliationStatus ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {affiliationStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.affiliationStatus && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.affiliationStatus}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sisbenLevel">Nivel SISBEN</Label>
              <Select
                value={formData.sisbenLevel}
                onValueChange={(value) =>
                  handleInputChange("sisbenLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  {sisbenLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Información de Contacto</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Número de teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`font-mono ${fieldErrors.phone ? "border-red-500" : ""}`}
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-sm">{fieldErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={fieldErrors.email ? "border-red-500" : ""}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Textarea
              id="address"
              placeholder="Dirección completa de residencia"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
              className={`resize-none ${fieldErrors.address ? "border-red-500" : ""}`}
            />
            {fieldErrors.address && (
              <p className="text-red-500 text-sm">{fieldErrors.address}</p>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Contacto de Emergencia</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Nombre Completo *</Label>
              <Input
                id="emergencyContactName"
                type="text"
                placeholder="Nombre del contacto"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  handleInputChange("emergencyContactName", e.target.value)
                }
                className={
                  fieldErrors.emergencyContactName ? "border-red-500" : ""
                }
              />
              {fieldErrors.emergencyContactName && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.emergencyContactName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Teléfono *</Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                placeholder="Número de contacto"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  handleInputChange("emergencyContactPhone", e.target.value)
                }
                className={`font-mono ${fieldErrors.emergencyContactPhone ? "border-red-500" : ""}`}
              />
              {fieldErrors.emergencyContactPhone && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.emergencyContactPhone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation">Parentesco *</Label>
              <Select
                value={formData.emergencyContactRelation}
                onValueChange={(value) =>
                  handleInputChange("emergencyContactRelation", value)
                }
              >
                <SelectTrigger
                  className={
                    fieldErrors.emergencyContactRelation ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {relationOptions.map((relation) => (
                    <SelectItem key={relation.value} value={relation.value}>
                      {relation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.emergencyContactRelation && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.emergencyContactRelation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sociodemographic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Información Sociodemográfica</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Ocupación *</Label>
              <Input
                id="occupation"
                type="text"
                placeholder="Profesión u oficio"
                value={formData.occupation}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
                }
                className={fieldErrors.occupation ? "border-red-500" : ""}
              />
              {fieldErrors.occupation && (
                <p className="text-red-500 text-sm">{fieldErrors.occupation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationLevel">Nivel Educativo *</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) =>
                  handleInputChange("educationLevel", value)
                }
              >
                <SelectTrigger
                  className={fieldErrors.educationLevel ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.educationLevel && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.educationLevel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Estado Civil *</Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) =>
                  handleInputChange("maritalStatus", value)
                }
              >
                <SelectTrigger
                  className={fieldErrors.maritalStatus ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.maritalStatus && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.maritalStatus}
                </p>
              )}
            </div>
          </div>

          {/* Pregnancy Information (conditional) */}
          {formData.sex === "F" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50 p-4 rounded-lg border border-pink-200">
              <div className="space-y-2">
                <Label htmlFor="pregnancyStatus">Estado de Embarazo *</Label>
                <Select
                  value={formData.pregnancyStatus}
                  onValueChange={(value) =>
                    handleInputChange("pregnancyStatus", value)
                  }
                >
                  <SelectTrigger
                    className={
                      fieldErrors.pregnancyStatus ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">No embarazada</SelectItem>
                    <SelectItem value="SI">Embarazada</SelectItem>
                    <SelectItem value="LACTANDO">Lactando</SelectItem>
                    <SelectItem value="NO_SABE">No sabe</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.pregnancyStatus && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.pregnancyStatus}
                  </p>
                )}
              </div>

              {formData.pregnancyStatus === "SI" && (
                <div className="space-y-2">
                  <Label htmlFor="pregnancyWeeks">Semanas de Gestación *</Label>
                  <Input
                    id="pregnancyWeeks"
                    type="number"
                    placeholder="ej: 20"
                    min="1"
                    max="42"
                    value={formData.pregnancyWeeks}
                    onChange={(e) =>
                      handleInputChange("pregnancyWeeks", e.target.value)
                    }
                    className={
                      fieldErrors.pregnancyWeeks ? "border-red-500" : ""
                    }
                  />
                  {fieldErrors.pregnancyWeeks && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.pregnancyWeeks}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clinical Assessment */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Evaluación Clínica Inicial</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentSymptoms">Síntomas Actuales *</Label>
              <Textarea
                id="currentSymptoms"
                placeholder="Describa detalladamente los síntomas principales que presenta el paciente"
                value={formData.currentSymptoms}
                onChange={(e) =>
                  handleInputChange("currentSymptoms", e.target.value)
                }
                rows={3}
                className={`resize-none ${fieldErrors.currentSymptoms ? "border-red-500" : ""}`}
              />
              {fieldErrors.currentSymptoms && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.currentSymptoms}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symptomsOnset">Inicio de Síntomas *</Label>
                <Input
                  id="symptomsOnset"
                  type="text"
                  placeholder="ej: Hace 2 días, Esta mañana"
                  value={formData.symptomsOnset}
                  onChange={(e) =>
                    handleInputChange("symptomsOnset", e.target.value)
                  }
                  className={fieldErrors.symptomsOnset ? "border-red-500" : ""}
                />
                {fieldErrors.symptomsOnset && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.symptomsOnset}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptomsIntensity">
                  Intensidad de Síntomas *
                </Label>
                <Select
                  value={formData.symptomsIntensity}
                  onValueChange={(value) =>
                    handleInputChange("symptomsIntensity", value)
                  }
                >
                  <SelectTrigger
                    className={
                      fieldErrors.symptomsIntensity ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {intensityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.symptomsIntensity && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.symptomsIntensity}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="painScale">Escala de Dolor (0-10) *</Label>
              <Select
                value={formData.painScale}
                onValueChange={(value) => handleInputChange("painScale", value)}
              >
                <SelectTrigger
                  className={fieldErrors.painScale ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar intensidad" />
                </SelectTrigger>
                <SelectContent>
                  {painScales.map((scale) => (
                    <SelectItem key={scale.value} value={scale.value}>
                      {scale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.painScale && (
                <p className="text-red-500 text-sm">{fieldErrors.painScale}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chronicConditions">Condiciones Crónicas *</Label>
              <Textarea
                id="chronicConditions"
                placeholder="Liste condiciones médicas crónicas conocidas (Diabetes, HTA, etc.) o escriba 'Ninguna'"
                value={formData.chronicConditions}
                onChange={(e) =>
                  handleInputChange("chronicConditions", e.target.value)
                }
                rows={2}
                className={`resize-none ${fieldErrors.chronicConditions ? "border-red-500" : ""}`}
              />
              {fieldErrors.chronicConditions && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.chronicConditions}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousHospitalizations">
                Hospitalizaciones Previas *
              </Label>
              <Textarea
                id="previousHospitalizations"
                placeholder="Describa hospitalizaciones previas y fechas aproximadas, o escriba 'Ninguna'"
                value={formData.previousHospitalizations}
                onChange={(e) =>
                  handleInputChange("previousHospitalizations", e.target.value)
                }
                rows={2}
                className={`resize-none ${fieldErrors.previousHospitalizations ? "border-red-500" : ""}`}
              />
              {fieldErrors.previousHospitalizations && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.previousHospitalizations}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceAuthorization">
                Autorización Aseguradora *
              </Label>
              <Input
                id="insuranceAuthorization"
                type="text"
                placeholder="Número de autorización o 'En trámite'"
                value={formData.insuranceAuthorization}
                onChange={(e) =>
                  handleInputChange("insuranceAuthorization", e.target.value)
                }
                className={
                  fieldErrors.insuranceAuthorization ? "border-red-500" : ""
                }
              />
              {fieldErrors.insuranceAuthorization && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.insuranceAuthorization}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Archivos Adjuntos</h3>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="font-medium mb-2">
                Sube documentos de identidad, carné EPS, foto del paciente
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Formatos permitidos: PDF, JPG, PNG. Máximo 10MB por archivo.
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Seleccionar Archivos
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Archivos adjuntados:</p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium text-sm">
                            {file.name}
                          </span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveProgress}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Progreso
            </Button>
          </div>

          <div className="flex gap-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? (
                <>Guardando...</>
              ) : mode === "edit" ? (
                "Actualizar Paciente"
              ) : (
                "Registrar Paciente"
              )}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ResponsiveModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "edit" ? "Editar Paciente" : "Identificación del Paciente"
      }
    >
      {modalContent}
    </ResponsiveModalWrapper>
  );
}
