import { useForm } from "@/context/FormContext";
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
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

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

export default function PatientIdentificationModal() {
  const { t } = useLanguage();
  const { formData, dispatch, nextStep, calculateAge } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    formData.patient.attachments1 || [],
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldWarnings, setFieldWarnings] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});
  const [validatedFields, setValidatedFields] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const validateField = useCallback(async (field: string, value: string | number) => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    switch (field) {
      case 'identificationNumber':
        const idStr = value.toString();
        if (idStr.length < 6) {
          errors[field] = 'Número de identificación muy corto';
        } else if (!/^[0-9]+$/.test(idStr)) {
          errors[field] = 'Solo se permiten números';
        } else if (idStr.length > 15) {
          errors[field] = 'Número de identificación muy largo';
        }
        break;

      case 'fullName':
        const nameStr = value.toString();
        if (nameStr.length < 2) {
          errors[field] = 'El nombre debe tener al menos 2 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameStr)) {
          errors[field] = 'El nombre solo puede contener letras y espacios';
        } else if (nameStr.split(' ').length < 2) {
          warnings[field] = 'Se recomienda incluir nombres y apellidos';
        }
        break;

      case 'age':
        const ageNum = Number(value);
        if (ageNum < 0) {
          errors[field] = 'La edad no puede ser negativa';
        } else if (ageNum > 120) {
          errors[field] = 'Edad no válida';
        } else if (ageNum > 100) {
          warnings[field] = 'Edad muy alta, verificar';
        }
        break;

      case 'phone':
        const phoneStr = value.toString();
        if (phoneStr.length > 0) {
          if (!/^[+]?[0-9\s\-()]+$/.test(phoneStr)) {
            errors[field] = 'Formato de teléfono inválido';
          } else if (phoneStr.replace(/[^0-9]/g, '').length < 7) {
            warnings[field] = 'Teléfono muy corto';
          }
        }
        break;

      case 'email':
        const emailStr = value.toString();
        if (emailStr.length > 0) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
            errors[field] = 'Formato de email inválido';
          }
        }
        break;

      case 'affiliationNumber':
        const affStr = value.toString();
        if (affStr.length > 0 && affStr.length < 8) {
          warnings[field] = 'Número de afiliación muy corto';
        }
        break;

      case 'pregnancyWeeks':
        if (formData.patient.pregnancyStatus === 'SI') {
          const weeks = Number(value);
          if (weeks < 1 || weeks > 42) {
            errors[field] = 'Semanas de gestación deben estar entre 1 y 42';
          } else if (weeks < 12) {
            warnings[field] = 'Primer trimestre';
          } else if (weeks > 37) {
            warnings[field] = 'Término completo';
          }
        }
        break;
    }

    return { errors, warnings };
  }, [formData.patient.pregnancyStatus]);

  const handleInputChange = async (field: string, value: string | number) => {
    dispatch({ type: "UPDATE_PATIENT", payload: { [field]: value } });

    // Calculate age when birth date changes
    if (field === "birthDate" && value) {
      calculateAge(value as string);
    }

    // Real-time validation
    if (value.toString().length > 0) {
      setIsValidating(prev => ({ ...prev, [field]: true }));

      try {
        const { errors, warnings } = await validateField(field, value);

        setFieldErrors(prev => {
          const newErrors = { ...prev };
          if (Object.keys(errors).length > 0) {
            Object.assign(newErrors, errors);
          } else {
            delete newErrors[field];
          }
          return newErrors;
        });

        setFieldWarnings(prev => {
          const newWarnings = { ...prev };
          if (Object.keys(warnings).length > 0) {
            Object.assign(newWarnings, warnings);
          } else {
            delete newWarnings[field];
          }
          return newWarnings;
        });

        setValidatedFields(prev => ({ ...prev, [field]: Object.keys(errors).length === 0 }));

        // Show success toast for valid fields
        if (Object.keys(errors).length === 0 && value.toString().length > 2) {
          setValidatedFields(prev => ({ ...prev, [field]: true }));
        }

      } finally {
        setIsValidating(prev => ({ ...prev, [field]: false }));
      }
    } else {
      // Clear validation for empty fields
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      setFieldWarnings(prev => {
        const newWarnings = { ...prev };
        delete newWarnings[field];
        return newWarnings;
      });
      setValidatedFields(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const updatedFiles = [...uploadedFiles, ...files];
    setUploadedFiles(updatedFiles);
    dispatch({
      type: "UPDATE_PATIENT",
      payload: { attachments1: updatedFiles },
    });
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    dispatch({
      type: "UPDATE_PATIENT",
      payload: { attachments1: updatedFiles },
    });
  };

  const isValid = () => {
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
      "sisbenLevel",
      "phone",
      "address",
      "email",
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

    let allFieldsValid = required.every((field) => {
      const value = formData.patient[field as keyof typeof formData.patient];
      return value && value.toString().trim() !== "";
    });

    // Additional validation for female patients
    if (formData.patient.sex === "F") {
      allFieldsValid =
        allFieldsValid && formData.patient.pregnancyStatus.trim() !== "";
      if (formData.patient.pregnancyStatus === "SI") {
        allFieldsValid =
          allFieldsValid && formData.patient.pregnancyWeeks.trim() !== "";
      }
    }

    const hasAttachments = uploadedFiles.length > 0;

    return allFieldsValid && hasAttachments;
  };

  return (
    <div>
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
          <Heart className="w-full h-full text-red-500" />
        </div>

        <CardHeader className="bg-red-500 text-white relative overflow-hidden py-4">
          <CardTitle className="flex items-center gap-3 text-white text-lg">
            <User className="w-6 h-6" />
            {t('profile.title')} - Paso 1: Datos de Identificación del Paciente
          </CardTitle>
          <p className="text-red-100 text-sm">
            Complete la información básica del paciente y validación de afiliación EPS
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Información Personal</h3>
              <div className="flex-1 h-px bg-blue-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identificationType" className="text-black font-medium flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-gray-500" />
                  Tipo de Identificación *
                </Label>
                <Select
                  value={formData.patient.identificationType}
                  onValueChange={(value) =>
                    handleInputChange("identificationType", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-blue-500 transition-colors">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="identificationNumber" className="text-black font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  Número de Identificación *
                </Label>
                <div className="relative">
                  <Input
                    id="identificationNumber"
                    type="text"
                    placeholder="Número de documento"
                    value={formData.patient.identificationNumber}
                    onChange={(e) =>
                      handleInputChange("identificationNumber", e.target.value)
                    }
                    className={`h-10 rounded-lg border-2 transition-colors font-mono ${
                      fieldErrors.identificationNumber ? 'border-red-500 focus:border-red-500' :
                      validatedFields.identificationNumber ? 'border-green-500 focus:border-green-500' :
                      'focus:border-blue-500'
                    }`}
                    withMotion={false}
                    required
                  />
                  {isValidating.identificationNumber && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {validatedFields.identificationNumber && !fieldErrors.identificationNumber && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {fieldErrors.identificationNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldErrors.identificationNumber}
                  </p>
                )}
                {fieldWarnings.identificationNumber && !fieldErrors.identificationNumber && (
                  <p className="text-yellow-600 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldWarnings.identificationNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-black font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  {t('profile.name')} *
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nombres y apellidos"
                    value={formData.patient.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`h-10 rounded-lg border-2 transition-colors ${
                      fieldErrors.fullName ? 'border-red-500 focus:border-red-500' :
                      validatedFields.fullName ? 'border-green-500 focus:border-green-500' :
                      'focus:border-blue-500'
                    }`}
                    withMotion={false}
                  />
                  {isValidating.fullName && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {validatedFields.fullName && !fieldErrors.fullName && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {fieldErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldErrors.fullName}
                  </p>
                )}
                {fieldWarnings.fullName && !fieldErrors.fullName && (
                  <p className="text-yellow-600 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldWarnings.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-black font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Fecha de Nacimiento *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.patient.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className="h-10 rounded-lg border-2 focus:border-blue-500 transition-colors"
                  withMotion={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-black font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Edad
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.patient.age || ""}
                  readOnly
                  className="h-10 rounded-lg border-2 bg-gray-50"
                  placeholder="Calculada automáticamente"
                  withMotion={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex" className="text-black font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Sexo *
                </Label>
                <Select
                  value={formData.patient.sex}
                  onValueChange={(value) => handleInputChange("sex", value)}
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-blue-500 transition-colors">
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
              </div>
            </div>
          </div>

          {/* EPS Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Información EPS</h3>
              <div className="flex-1 h-px bg-emerald-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eps" className="text-black font-medium flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  EPS *
                </Label>
                <Select
                  value={formData.patient.eps}
                  onValueChange={(value) => handleInputChange("eps", value)}
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-emerald-500 transition-colors">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliationRegime" className="text-black font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  Régimen de Afiliación *
                </Label>
                <Select
                  value={formData.patient.affiliationRegime}
                  onValueChange={(value) =>
                    handleInputChange("affiliationRegime", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-emerald-500 transition-colors">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliateType" className="text-black font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Tipo de Afiliado *
                </Label>
                <Select
                  value={formData.patient.affiliateType}
                  onValueChange={(value) =>
                    handleInputChange("affiliateType", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-emerald-500 transition-colors">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliationNumber" className="text-black font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  Número de Afiliación *
                </Label>
                <Input
                  id="affiliationNumber"
                  type="text"
                  placeholder="Número de afiliación EPS"
                  value={formData.patient.affiliationNumber}
                  onChange={(e) =>
                    handleInputChange("affiliationNumber", e.target.value)
                  }
                  className="h-10 rounded-lg border-2 focus:border-emerald-500 transition-colors font-mono"
                  withMotion={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliationStatus" className="text-black font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  Estado de Afiliación *
                </Label>
                <Select
                  value={formData.patient.affiliationStatus}
                  onValueChange={(value) =>
                    handleInputChange("affiliationStatus", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-emerald-500 transition-colors">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="sisbenLevel" className="text-black font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  Nivel SISBEN *
                </Label>
                <Select
                  value={formData.patient.sisbenLevel}
                  onValueChange={(value) =>
                    handleInputChange("sisbenLevel", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-emerald-500 transition-colors">
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
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Información de Contacto</h3>
              <div className="flex-1 h-px bg-purple-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-black font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {t('profile.phone')} *
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.patient.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`h-10 rounded-lg border-2 transition-colors font-mono ${
                      fieldErrors.phone ? 'border-red-500 focus:border-red-500' :
                      validatedFields.phone ? 'border-green-500 focus:border-green-500' :
                      'focus:border-purple-500'
                    }`}
                    withMotion={false}
                  />
                  {isValidating.phone && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    </div>
                  )}
                  {validatedFields.phone && !fieldErrors.phone && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {fieldErrors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldErrors.phone}
                  </p>
                )}
                {fieldWarnings.phone && !fieldErrors.phone && (
                  <p className="text-yellow-600 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldWarnings.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {t('profile.email')} *
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.patient.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-10 rounded-lg border-2 transition-colors ${
                      fieldErrors.email ? 'border-red-500 focus:border-red-500' :
                      validatedFields.email ? 'border-green-500 focus:border-green-500' :
                      'focus:border-purple-500'
                    }`}
                    withMotion={false}
                  />
                  {isValidating.email && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    </div>
                  )}
                  {validatedFields.email && !fieldErrors.email && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
                {fieldWarnings.email && !fieldErrors.email && (
                  <p className="text-yellow-600 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {fieldWarnings.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-black font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Dirección *
              </Label>
              <Textarea
                id="address"
                placeholder="Dirección completa de residencia"
                value={formData.patient.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
                className="rounded-lg border-2 focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Contacto de Emergencia</h3>
              <div className="flex-1 h-px bg-red-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-black font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Nombre Completo *
                </Label>
                <Input
                  id="emergencyContactName"
                  type="text"
                  placeholder="Nombre del contacto"
                  value={formData.patient.emergencyContactName}
                  onChange={(e) =>
                    handleInputChange("emergencyContactName", e.target.value)
                  }
                  className="h-10 rounded-lg border-2 focus:border-red-500 transition-colors"
                  withMotion={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone" className="text-black font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Teléfono *
                </Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  placeholder="Número de contacto"
                  value={formData.patient.emergencyContactPhone}
                  onChange={(e) =>
                    handleInputChange("emergencyContactPhone", e.target.value)
                  }
                  className="h-10 rounded-lg border-2 focus:border-red-500 transition-colors font-mono"
                  withMotion={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation" className="text-black font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Parentesco *
                </Label>
                <Select
                  value={formData.patient.emergencyContactRelation}
                  onValueChange={(value) =>
                    handleInputChange("emergencyContactRelation", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-red-500 transition-colors">
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
              </div>
            </div>
          </div>

          {/* Additional Patient Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Información Sociodemográfica</h3>
              <div className="flex-1 h-px bg-indigo-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-black font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  Ocupación *
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  placeholder="Profesión u oficio"
                  value={formData.patient.occupation}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                  className="h-10 rounded-lg border-2 focus:border-indigo-500 transition-colors"
                  withMotion={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="educationLevel" className="text-black font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  Nivel Educativo *
                </Label>
                <Select
                  value={formData.patient.educationLevel}
                  onValueChange={(value) =>
                    handleInputChange("educationLevel", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-indigo-500 transition-colors">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus" className="text-black font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  Estado Civil *
                </Label>
                <Select
                  value={formData.patient.maritalStatus}
                  onValueChange={(value) =>
                    handleInputChange("maritalStatus", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-indigo-500 transition-colors">
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
              </div>
            </div>

            {/* Pregnancy Information (conditional) */}
            {formData.patient.sex === "F" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
                <div className="space-y-2">
                  <Label htmlFor="pregnancyStatus" className="text-black font-medium flex items-center gap-2">
                    <Baby className="w-4 h-4 text-gray-500" />
                    Estado de Embarazo *
                  </Label>
                  <Select
                    value={formData.patient.pregnancyStatus}
                    onValueChange={(value) =>
                      handleInputChange("pregnancyStatus", value)
                    }
                  >
                    <SelectTrigger className="h-10 rounded-lg border-2 focus:border-pink-500 transition-colors">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NO">No embarazada</SelectItem>
                      <SelectItem value="SI">Embarazada</SelectItem>
                      <SelectItem value="LACTANDO">Lactando</SelectItem>
                      <SelectItem value="NO_SABE">No sabe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.patient.pregnancyStatus === "SI" && (
                  <div className="space-y-2">
                    <Label htmlFor="pregnancyWeeks" className="text-black font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Semanas de Gestación *
                    </Label>
                    <Input
                      id="pregnancyWeeks"
                      type="number"
                      placeholder="ej: 20"
                      min="1"
                      max="42"
                      value={formData.patient.pregnancyWeeks}
                      onChange={(e) =>
                        handleInputChange("pregnancyWeeks", e.target.value)
                      }
                      className="h-10 rounded-lg border-2 focus:border-pink-500 transition-colors"
                      withMotion={false}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clinical Assessment */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-md">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Evaluación Clínica Inicial</h3>
              <div className="flex-1 h-px bg-teal-200"></div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentSymptoms" className="text-black font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  Síntomas Actuales *
                </Label>
                <Textarea
                  id="currentSymptoms"
                  placeholder="Describa detalladamente los síntomas principales que presenta el paciente"
                  value={formData.patient.currentSymptoms}
                  onChange={(e) =>
                    handleInputChange("currentSymptoms", e.target.value)
                  }
                  rows={3}
                  className="rounded-lg border-2 focus:border-teal-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symptomsOnset" className="text-black font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Inicio de Síntomas *
                  </Label>
                  <Input
                    id="symptomsOnset"
                    type="text"
                    placeholder="ej: Hace 2 días, Esta mañana"
                    value={formData.patient.symptomsOnset}
                    onChange={(e) =>
                      handleInputChange("symptomsOnset", e.target.value)
                    }
                    className="h-10 rounded-lg border-2 focus:border-teal-500 transition-colors"
                    withMotion={false}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptomsIntensity" className="text-black font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    Intensidad de Síntomas *
                  </Label>
                  <Select
                    value={formData.patient.symptomsIntensity}
                    onValueChange={(value) =>
                      handleInputChange("symptomsIntensity", value)
                    }
                  >
                    <SelectTrigger className="h-10 rounded-lg border-2 focus:border-teal-500 transition-colors">
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="painScale" className="text-black font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  Escala de Dolor (0-10) *
                </Label>
                <Select
                  value={formData.patient.painScale}
                  onValueChange={(value) => handleInputChange("painScale", value)}
                >
                  <SelectTrigger className="h-10 rounded-lg border-2 focus:border-teal-500 transition-colors">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronicConditions" className="text-black font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Condiciones Crónicas *
                </Label>
                <Textarea
                  id="chronicConditions"
                  placeholder="Liste condiciones médicas crónicas conocidas (Diabetes, HTA, etc.) o escriba 'Ninguna'"
                  value={formData.patient.chronicConditions}
                  onChange={(e) =>
                    handleInputChange("chronicConditions", e.target.value)
                  }
                  rows={2}
                  className="rounded-lg border-2 focus:border-teal-500 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousHospitalizations" className="text-black font-medium flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  Hospitalizaciones Previas *
                </Label>
                <Textarea
                  id="previousHospitalizations"
                  placeholder="Describa hospitalizaciones previas y fechas aproximadas, o escriba 'Ninguna'"
                  value={formData.patient.previousHospitalizations}
                  onChange={(e) =>
                    handleInputChange("previousHospitalizations", e.target.value)
                  }
                  rows={2}
                  className="rounded-lg border-2 focus:border-teal-500 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceAuthorization" className="text-black font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  Autorización Aseguradora *
                </Label>
                <Input
                  id="insuranceAuthorization"
                  type="text"
                  placeholder="Número de autorización o 'En trámite'"
                  value={formData.patient.insuranceAuthorization}
                  onChange={(e) =>
                    handleInputChange("insuranceAuthorization", e.target.value)
                  }
                  className="h-10 rounded-lg border-2 focus:border-teal-500 transition-colors"
                  withMotion={false}
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Archivos Adjuntos *</h3>
              <div className="flex-1 h-px bg-orange-200"></div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50 hover:bg-orange-100 transition-colors">
                <Upload className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-black font-medium mb-2">
                  Sube documentos de identidad, carné EPS, foto del paciente
                </p>
                <p className="text-sm text-gray-600 mb-4">
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
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                  withMotion={false}
                >
                  Seleccionar Archivos
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-black font-medium">Archivos adjuntados:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-black font-medium text-sm">{file.name}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:bg-red-50"
                          withMotion={false}
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
          <div className="flex justify-end pt-4 border-t-2 border-gray-200">
            <Button 
              onClick={nextStep} 
              disabled={!isValid()} 
              className="px-6 py-2 text-base bg-red-500 hover:bg-red-600 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100"
              withMotion={false}
            >
              <span>Siguiente: Remisión y Diagnóstico</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
