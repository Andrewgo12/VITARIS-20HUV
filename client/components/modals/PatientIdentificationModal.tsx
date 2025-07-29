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
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
};

export default function PatientIdentificationModal() {
  const { formData, dispatch, nextStep, calculateAge } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    formData.patient.attachments1 || [],
  );

  const handleInputChange = (field: string, value: string | number) => {
    dispatch({ type: "UPDATE_PATIENT", payload: { [field]: value } });

    // Calculate age when birth date changes
    if (field === "birthDate" && value) {
      calculateAge(value as string);
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={cardVariants}>
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
            <Sparkles className="w-full h-full text-red-500" />
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5">
            <Heart className="w-full h-full text-emerald-500" />
          </div>

          <CardHeader className="bg-red-500 text-white relative overflow-hidden">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full"></div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <User className="w-7 h-7" />
                </motion.div>
                Paso 1: Datos de Identificación del Paciente
              </CardTitle>
              <p className="text-red-100 mt-2">
                Complete la información básica del paciente y validación de afiliación EPS
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-10 p-8">
            {/* Personal Information */}
            <motion.div 
              className="space-y-6"
              variants={sectionVariants}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black">Información Personal</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="identificationType" className="text-black font-medium" required>
                    Tipo de Identificación
                  </Label>
                  <Select
                    value={formData.patient.identificationType}
                    onValueChange={(value) =>
                      handleInputChange("identificationType", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors">
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
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="identificationNumber" className="text-black font-medium" required>
                    Número de Identificación
                  </Label>
                  <Input
                    id="identificationNumber"
                    type="text"
                    placeholder="Número de documento"
                    value={formData.patient.identificationNumber}
                    onChange={(e) =>
                      handleInputChange("identificationNumber", e.target.value)
                    }
                    className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors font-mono"
                    required
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="fullName" className="text-black font-medium" required>
                    Nombre Completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nombres y apellidos"
                    value={formData.patient.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="birthDate" className="text-black font-medium">Fecha de Nacimiento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.patient.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="age" className="text-black font-medium">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.patient.age || ""}
                    readOnly
                    className="h-12 rounded-xl border-2 bg-gray-50"
                    placeholder="Calculada automáticamente"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="sex" className="text-black font-medium">Sexo *</Label>
                  <Select
                    value={formData.patient.sex}
                    onValueChange={(value) => handleInputChange("sex", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors">
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
                </motion.div>
              </motion.div>
            </motion.div>

            {/* EPS Information */}
            <motion.div 
              className="space-y-6"
              variants={sectionVariants}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black">Información EPS</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="eps" className="text-black font-medium">EPS *</Label>
                  <Select
                    value={formData.patient.eps}
                    onValueChange={(value) => handleInputChange("eps", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-emerald-500 transition-colors">
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
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="affiliationRegime" className="text-black font-medium">Régimen de Afiliación *</Label>
                  <Select
                    value={formData.patient.affiliationRegime}
                    onValueChange={(value) =>
                      handleInputChange("affiliationRegime", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-emerald-500 transition-colors">
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
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="affiliateType" className="text-black font-medium">Tipo de Afiliado *</Label>
                  <Select
                    value={formData.patient.affiliateType}
                    onValueChange={(value) =>
                      handleInputChange("affiliateType", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-emerald-500 transition-colors">
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
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="affiliationNumber" className="text-black font-medium">Número de Afiliación *</Label>
                  <Input
                    id="affiliationNumber"
                    type="text"
                    placeholder="Número de afiliación EPS"
                    value={formData.patient.affiliationNumber}
                    onChange={(e) =>
                      handleInputChange("affiliationNumber", e.target.value)
                    }
                    className="h-12 rounded-xl border-2 focus:border-emerald-500 transition-colors font-mono"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="affiliationStatus" className="text-black font-medium">Estado de Afiliación *</Label>
                  <Select
                    value={formData.patient.affiliationStatus}
                    onValueChange={(value) =>
                      handleInputChange("affiliationStatus", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-emerald-500 transition-colors">
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
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="sisbenLevel" className="text-black font-medium">Nivel SISBEN *</Label>
                  <Select
                    value={formData.patient.sisbenLevel}
                    onValueChange={(value) =>
                      handleInputChange("sisbenLevel", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-emerald-500 transition-colors">
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
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="space-y-6"
              variants={sectionVariants}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black">Información de Contacto</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="phone" className="text-black font-medium">Teléfono de Contacto *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.patient.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-12 rounded-xl border-2 focus:border-purple-500 transition-colors font-mono"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="email" className="text-black font-medium">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.patient.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 rounded-xl border-2 focus:border-purple-500 transition-colors"
                  />
                </motion.div>
              </motion.div>

              <motion.div className="space-y-3" variants={inputVariants}>
                <Label htmlFor="address" className="text-black font-medium">Dirección *</Label>
                <Textarea
                  id="address"
                  placeholder="Dirección completa de residencia"
                  value={formData.patient.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className="rounded-xl border-2 focus:border-purple-500 transition-colors resize-none"
                />
              </motion.div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div 
              className="space-y-6"
              variants={sectionVariants}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black">Contacto de Emergencia</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="emergencyContactName" className="text-black font-medium">Nombre Completo *</Label>
                  <Input
                    id="emergencyContactName"
                    type="text"
                    placeholder="Nombre del contacto"
                    value={formData.patient.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                    className="h-12 rounded-xl border-2 focus:border-red-500 transition-colors"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="emergencyContactPhone" className="text-black font-medium">Teléfono *</Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    placeholder="Número de contacto"
                    value={formData.patient.emergencyContactPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyContactPhone", e.target.value)
                    }
                    className="h-12 rounded-xl border-2 focus:border-red-500 transition-colors font-mono"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="emergencyContactRelation" className="text-black font-medium">Parentesco *</Label>
                  <Select
                    value={formData.patient.emergencyContactRelation}
                    onValueChange={(value) =>
                      handleInputChange("emergencyContactRelation", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-red-500 transition-colors">
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
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Additional Patient Information */}
            <motion.div 
              className="space-y-6"
              variants={sectionVariants}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black">Información Sociodemográfica</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="occupation" className="text-black font-medium">Ocupación *</Label>
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Profesión u oficio"
                    value={formData.patient.occupation}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    className="h-12 rounded-xl border-2 focus:border-indigo-500 transition-colors"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="educationLevel" className="text-black font-medium">Nivel Educativo *</Label>
                  <Select
                    value={formData.patient.educationLevel}
                    onValueChange={(value) =>
                      handleInputChange("educationLevel", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-indigo-500 transition-colors">
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
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="maritalStatus" className="text-black font-medium">Estado Civil *</Label>
                  <Select
                    value={formData.patient.maritalStatus}
                    onValueChange={(value) =>
                      handleInputChange("maritalStatus", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-indigo-500 transition-colors">
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
                </motion.div>
              </motion.div>

              {/* Pregnancy Information (conditional) */}
              <AnimatePresence>
                {formData.patient.sex === "F" && (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-pink-50 p-6 rounded-2xl border-2 border-pink-200"
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.div className="space-y-3" variants={inputVariants}>
                      <Label htmlFor="pregnancyStatus" className="text-black font-medium">Estado de Embarazo *</Label>
                      <Select
                        value={formData.patient.pregnancyStatus}
                        onValueChange={(value) =>
                          handleInputChange("pregnancyStatus", value)
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl border-2 focus:border-pink-500 transition-colors">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NO">No embarazada</SelectItem>
                          <SelectItem value="SI">Embarazada</SelectItem>
                          <SelectItem value="LACTANDO">Lactando</SelectItem>
                          <SelectItem value="NO_SABE">No sabe</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <AnimatePresence>
                      {formData.patient.pregnancyStatus === "SI" && (
                        <motion.div 
                          className="space-y-3" 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Label htmlFor="pregnancyWeeks" className="text-black font-medium">Semanas de Gestación *</Label>
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
                            className="h-12 rounded-xl border-2 focus:border-pink-500 transition-colors"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Clinical Assessment */}
            <motion.div 
              className="space-y-6"
              variants={sectionVariants}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black">Evaluación Clínica Inicial</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-teal-200 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="space-y-6"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="currentSymptoms" className="text-black font-medium">Síntomas Actuales *</Label>
                  <Textarea
                    id="currentSymptoms"
                    placeholder="Describa detalladamente los síntomas principales que presenta el paciente"
                    value={formData.patient.currentSymptoms}
                    onChange={(e) =>
                      handleInputChange("currentSymptoms", e.target.value)
                    }
                    rows={4}
                    className="rounded-xl border-2 focus:border-teal-500 transition-colors resize-none"
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div className="space-y-3" variants={inputVariants}>
                    <Label htmlFor="symptomsOnset" className="text-black font-medium">Inicio de Síntomas *</Label>
                    <Input
                      id="symptomsOnset"
                      type="text"
                      placeholder="ej: Hace 2 días, Esta mañana"
                      value={formData.patient.symptomsOnset}
                      onChange={(e) =>
                        handleInputChange("symptomsOnset", e.target.value)
                      }
                      className="h-12 rounded-xl border-2 focus:border-teal-500 transition-colors"
                    />
                  </motion.div>

                  <motion.div className="space-y-3" variants={inputVariants}>
                    <Label htmlFor="symptomsIntensity" className="text-black font-medium">
                      Intensidad de Síntomas *
                    </Label>
                    <Select
                      value={formData.patient.symptomsIntensity}
                      onValueChange={(value) =>
                        handleInputChange("symptomsIntensity", value)
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl border-2 focus:border-teal-500 transition-colors">
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
                  </motion.div>
                </div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="painScale" className="text-black font-medium">Escala de Dolor (0-10) *</Label>
                  <Select
                    value={formData.patient.painScale}
                    onValueChange={(value) => handleInputChange("painScale", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-teal-500 transition-colors">
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
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="chronicConditions" className="text-black font-medium">Condiciones Crónicas *</Label>
                  <Textarea
                    id="chronicConditions"
                    placeholder="Liste condiciones médicas crónicas conocidas (Diabetes, HTA, etc.) o escriba 'Ninguna'"
                    value={formData.patient.chronicConditions}
                    onChange={(e) =>
                      handleInputChange("chronicConditions", e.target.value)
                    }
                    rows={3}
                    className="rounded-xl border-2 focus:border-teal-500 transition-colors resize-none"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="previousHospitalizations" className="text-black font-medium">
                    Hospitalizaciones Previas *
                  </Label>
                  <Textarea
                    id="previousHospitalizations"
                    placeholder="Describa hospitalizaciones previas y fechas aproximadas, o escriba 'Ninguna'"
                    value={formData.patient.previousHospitalizations}
                    onChange={(e) =>
                      handleInputChange("previousHospitalizations", e.target.value)
                    }
                    rows={3}
                    className="rounded-xl border-2 focus:border-teal-500 transition-colors resize-none"
                  />
                </motion.div>

                <motion.div className="space-y-3" variants={inputVariants}>
                  <Label htmlFor="insuranceAuthorization" className="text-black font-medium">
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
                    className="h-12 rounded-xl border-2 focus:border-teal-500 transition-colors"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* File Uploads */}
            <motion.div 
              className="space-y-6"
              variants={sectionVariants}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black">Archivos Adjuntos *</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="space-y-6"
                variants={inputVariants}
              >
                <motion.div 
                  className="border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-black font-medium mb-2">
                    Sube documentos de identidad, carné EPS, foto del paciente
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
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
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      Seleccionar Archivos
                    </Button>
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {uploadedFiles.length > 0 && (
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-black font-medium">Archivos adjuntados:</p>
                      <motion.div 
                        className="space-y-3"
                        variants={{
                          visible: {
                            transition: { staggerChildren: 0.1 }
                          }
                        }}
                      >
                        {uploadedFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-black font-medium">{file.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </Badge>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-end pt-8 border-t-2 border-gray-200"
              variants={sectionVariants}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  onClick={nextStep} 
                  disabled={!isValid()} 
                  className="px-8 py-4 text-lg bg-red-500 hover:bg-red-600 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Siguiente: Remisión y Diagnóstico</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
