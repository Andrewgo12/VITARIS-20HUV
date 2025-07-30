import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/context/MedicalDataContext";
import type { Patient } from "@/context/MedicalDataContext";
import {
  Calendar,
  User,
  Stethoscope,
  Building,
  AlertTriangle,
  CheckCircle,
  X,
  Search,
  Loader2,
  Save,
  BedDouble,
} from "lucide-react";

interface NewAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdmissionCreated?: (admission: any) => void;
  patientId?: string;
}

export default function NewAdmissionModal({
  isOpen,
  onClose,
  onAdmissionCreated,
  patientId,
}: NewAdmissionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [patientFound, setPatientFound] = useState(!!patientId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const { toast } = useToast();
  const {
    addPatient,
    patients,
    getAvailableBeds,
    assignBed,
    createAdmissionRequest,
    getPatient
  } = useMedicalData();

  const [formData, setFormData] = useState({
    // Datos del Paciente
    patientId: patientId || "",
    patientName: "",
    patientAge: "",
    patientSex: "",
    patientDocument: "",

    // Datos de Admisión
    admissionType: "",
    department: "",
    room: "",
    bedId: "",
    attendingPhysician: "",
    admissionDate: new Date().toISOString().split('T')[0],
    priority: "",

    // Información Médica
    mainDiagnosis: "",
    secondaryDiagnoses: "",
    allergies: "",
    medications: "",
    medicalHistory: "",

    // Información de Contacto
    emergencyContact: "",
    emergencyPhone: "",
    insurance: "",
    insuranceNumber: "",
  });

  // Pre-fill patient data if patientId is provided
  React.useEffect(() => {
    if (patientId) {
      const patient = getPatient(patientId);
      if (patient) {
        setFormData(prev => ({
          ...prev,
          patientId: patient.id,
          patientName: patient.personalInfo.fullName,
          patientAge: patient.personalInfo.age.toString(),
          patientSex: patient.personalInfo.sex,
          patientDocument: patient.personalInfo.identificationNumber,
          allergies: patient.personalInfo.allergies?.join(", ") || "",
          emergencyContact: patient.contactInfo.emergencyContactName,
          emergencyPhone: patient.contactInfo.emergencyContactPhone,
          insurance: patient.epsInfo.eps,
          insuranceNumber: patient.epsInfo.affiliationNumber,
        }));
        setPatientFound(true);
      }
    }
  }, [patientId, getPatient]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Auto-populate data when searching by patient document
    if (field === "patientDocument" && value.length >= 8) {
      searchPatientByDocument(value);
    }
  };

  const searchPatientByDocument = async (document: string) => {
    setSearchingPatient(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Search in existing patients
      const foundPatient = patients.find(
        patient => patient.personalInfo.identificationNumber === document
      );

      if (foundPatient) {
        setFormData((prev) => ({
          ...prev,
          patientId: foundPatient.id,
          patientName: foundPatient.personalInfo.fullName,
          patientAge: foundPatient.personalInfo.age.toString(),
          patientSex: foundPatient.personalInfo.sex,
          allergies: foundPatient.personalInfo.allergies?.join(", ") || "",
          emergencyContact: foundPatient.contactInfo.emergencyContactName,
          emergencyPhone: foundPatient.contactInfo.emergencyContactPhone,
          insurance: foundPatient.epsInfo.eps,
          insuranceNumber: foundPatient.epsInfo.affiliationNumber,
        }));
        setPatientFound(true);
        toast({
          title: "Paciente encontrado",
          description: `Se encontraron los datos de ${foundPatient.personalInfo.fullName}`,
        });
      } else {
        setPatientFound(false);
        toast({
          title: "Paciente no encontrado",
          description:
            "No se encontró un paciente con este documento. Complete los datos para crear un nuevo registro.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setPatientFound(false);
      toast({
        title: "Error en la búsqueda",
        description: "Ocurrió un error al buscar el paciente. Inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSearchingPatient(false);
    }
  };

  const loadAvailableRooms = async (department: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get available beds based on department type
      const departmentTypeMap: Record<string, string> = {
        ICU: "icu",
        EMERGENCY: "emergency",
        INTERNAL: "general",
        SURGERY: "general",
        CARDIOLOGY: "general",
        NEUROLOGY: "general",
        PEDIATRICS: "general",
      };

      const bedType = departmentTypeMap[department] || "general";
      const availableBeds = getAvailableBeds(bedType);

      setAvailableRooms(availableBeds.map(bed => `${bed.ward} - ${bed.number}`));
    } catch (error) {
      console.error("Error loading rooms:", error);
      toast({
        title: "Error cargando habitaciones",
        description: "No se pudieron cargar las habitaciones disponibles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.department) {
      loadAvailableRooms(formData.department);
    }
  }, [formData.department]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.patientId)
          newErrors.patientId = "ID del paciente es requerido";
        if (!formData.patientDocument)
          newErrors.patientDocument = "Documento es requerido";
        if (!formData.patientName)
          newErrors.patientName = "Nombre es requerido";
        if (!formData.patientAge) newErrors.patientAge = "Edad es requerida";
        if (!formData.patientSex) newErrors.patientSex = "Sexo es requerido";
        break;
      case 2:
        if (!formData.admissionType)
          newErrors.admissionType = "Tipo de admisión es requerido";
        if (!formData.department)
          newErrors.department = "Departamento es requerido";
        if (!formData.attendingPhysician)
          newErrors.attendingPhysician = "Médico tratante es requerido";
        if (!formData.admissionDate)
          newErrors.admissionDate = "Fecha de admisión es requerida";
        if (!formData.priority) newErrors.priority = "Prioridad es requerida";
        break;
      case 3:
        if (!formData.mainDiagnosis)
          newErrors.mainDiagnosis = "Diagnóstico principal es requerido";
        break;
      case 4:
        if (!formData.emergencyContact)
          newErrors.emergencyContact = "Contacto de emergencia es requerido";
        if (!formData.emergencyPhone)
          newErrors.emergencyPhone = "Teléfono de emergencia es requerido";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        toast({
          title: "Paso completado",
          description: `Paso ${currentStep} completado correctamente`,
        });
      }
    } else {
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newAdmission = {
        id: `ADM-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        status: "ACTIVE",
      };

      console.log("Nueva admisión creada:", newAdmission);

      toast({
        title: "Admisión creada exitosamente",
        description: `Se ha creado la admisión ${newAdmission.id} para ${formData.patientName}`,
      });

      // Call callback if provided
      if (onAdmissionCreated) {
        onAdmissionCreated(newAdmission);
      }

      // Reset form and close
      setFormData({
        patientId: "",
        patientName: "",
        patientAge: "",
        patientSex: "",
        patientDocument: "",
        admissionType: "",
        department: "",
        room: "",
        attendingPhysician: "",
        admissionDate: "",
        priority: "",
        mainDiagnosis: "",
        secondaryDiagnoses: "",
        allergies: "",
        medications: "",
        medicalHistory: "",
        emergencyContact: "",
        emergencyPhone: "",
        insurance: "",
        insuranceNumber: "",
      });
      setCurrentStep(1);
      setPatientFound(false);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error creating admission:", error);
      toast({
        title: "Error al crear admisión",
        description:
          "Ocurrió un error al crear la admisión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Datos del Paciente", icon: User },
    { id: 2, title: "Información de Admisión", icon: Building },
    { id: 3, title: "Información Médica", icon: Stethoscope },
    { id: 4, title: "Contacto y Seguro", icon: Calendar },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Nueva Admisión Hospitalaria
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-2 hidden md:block">
                <div
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Paso 1: Datos del Paciente */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Paciente
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientId">ID del Paciente *</Label>
                    <Input
                      id="patientId"
                      value={formData.patientId}
                      onChange={(e) =>
                        handleInputChange("patientId", e.target.value)
                      }
                      placeholder="Ej: P-2024-001234"
                      className={errors.patientId ? "border-red-500" : ""}
                    />
                    {errors.patientId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.patientId}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="patientDocument">
                      Documento de Identidad *
                    </Label>
                    <div className="relative">
                      <Input
                        id="patientDocument"
                        value={formData.patientDocument}
                        onChange={(e) =>
                          handleInputChange("patientDocument", e.target.value)
                        }
                        placeholder="Número de documento"
                        className={
                          errors.patientDocument ? "border-red-500" : ""
                        }
                      />
                      {searchingPatient && (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                      )}
                      {patientFound && (
                        <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {errors.patientDocument && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.patientDocument}
                      </p>
                    )}
                    {patientFound && (
                      <Alert className="mt-2 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          Paciente encontrado en el sistema. Los datos se han
                          completado automáticamente.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="patientName">Nombre Completo *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) =>
                        handleInputChange("patientName", e.target.value)
                      }
                      placeholder="Nombres y apellidos completos"
                      className={errors.patientName ? "border-red-500" : ""}
                      readOnly={patientFound}
                    />
                    {errors.patientName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.patientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="patientAge">Edad *</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) =>
                        handleInputChange("patientAge", e.target.value)
                      }
                      placeholder="Edad en años"
                      className={errors.patientAge ? "border-red-500" : ""}
                      readOnly={patientFound}
                      min="0"
                      max="120"
                    />
                    {errors.patientAge && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.patientAge}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="patientSex">Sexo *</Label>
                    <Select
                      value={formData.patientSex}
                      onValueChange={(value) =>
                        handleInputChange("patientSex", value)
                      }
                      disabled={patientFound}
                    >
                      <SelectTrigger
                        className={errors.patientSex ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Seleccionar sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                        <SelectItem value="O">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.patientSex && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.patientSex}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 2: Información de Admisión */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Detalles de la Admisión
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admissionType">Tipo de Admisión *</Label>
                    <Select
                      value={formData.admissionType}
                      onValueChange={(value) =>
                        handleInputChange("admissionType", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.admissionType ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMERGENCY">Urgencias</SelectItem>
                        <SelectItem value="ELECTIVE">Electiva</SelectItem>
                        <SelectItem value="TRANSFER">Transferencia</SelectItem>
                        <SelectItem value="OBSERVATION">Observación</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.admissionType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.admissionType}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="priority">Prioridad *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        handleInputChange("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL">Crítica</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                        <SelectItem value="MEDIUM">Media</SelectItem>
                        <SelectItem value="LOW">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Departamento *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        handleInputChange("department", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICU">UCI</SelectItem>
                        <SelectItem value="EMERGENCY">Urgencias</SelectItem>
                        <SelectItem value="INTERNAL">
                          Medicina Interna
                        </SelectItem>
                        <SelectItem value="SURGERY">Cirugía</SelectItem>
                        <SelectItem value="CARDIOLOGY">Cardiología</SelectItem>
                        <SelectItem value="NEUROLOGY">Neurología</SelectItem>
                        <SelectItem value="PEDIATRICS">Pediatría</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="room">Habitación</Label>
                    <Select
                      value={formData.room}
                      onValueChange={(value) =>
                        handleInputChange("room", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar habitación" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Cargando habitaciones...
                          </div>
                        ) : availableRooms.length > 0 ? (
                          availableRooms.map((room) => (
                            <SelectItem key={room} value={room}>
                              <div className="flex items-center gap-2">
                                <BedDouble className="h-4 w-4" />
                                {room}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500">
                            No hay habitaciones disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="attendingPhysician">
                      Médico Tratante *
                    </Label>
                    <Select
                      value={formData.attendingPhysician}
                      onValueChange={(value) =>
                        handleInputChange("attendingPhysician", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar médico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr_garcia">
                          Dr. García - Medicina Interna
                        </SelectItem>
                        <SelectItem value="dr_lopez">
                          Dr. López - Cardiología
                        </SelectItem>
                        <SelectItem value="dr_martinez">
                          Dr. Martínez - Urgencias
                        </SelectItem>
                        <SelectItem value="dr_silva">
                          Dr. Silva - Neurología
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="admissionDate">Fecha de Admisión *</Label>
                    <Input
                      id="admissionDate"
                      type="datetime-local"
                      value={formData.admissionDate}
                      onChange={(e) =>
                        handleInputChange("admissionDate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 3: Información Médica */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Información Médica
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mainDiagnosis">
                      Diagnóstico Principal *
                    </Label>
                    <Textarea
                      id="mainDiagnosis"
                      value={formData.mainDiagnosis}
                      onChange={(e) =>
                        handleInputChange("mainDiagnosis", e.target.value)
                      }
                      placeholder="Diagnóstico principal de admisión"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryDiagnoses">
                      Diagnósticos Secundarios
                    </Label>
                    <Textarea
                      id="secondaryDiagnoses"
                      value={formData.secondaryDiagnoses}
                      onChange={(e) =>
                        handleInputChange("secondaryDiagnoses", e.target.value)
                      }
                      placeholder="Diagnósticos adicionales o comorbilidades"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="allergies">Alergias</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) =>
                        handleInputChange("allergies", e.target.value)
                      }
                      placeholder="Alergias conocidas a medicamentos, alimentos, etc."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="medications">Medicamentos Actuales</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) =>
                        handleInputChange("medications", e.target.value)
                      }
                      placeholder="Medicamentos que el paciente toma actualmente"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalHistory">
                      Historia Médica Relevante
                    </Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) =>
                        handleInputChange("medicalHistory", e.target.value)
                      }
                      placeholder="Antecedentes médicos, cirugías previas, hospitalizaciones"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 4: Contacto y Seguro */}
          {currentStep === 4 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Información de Contacto y Seguro
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">
                      Contacto de Emergencia *
                    </Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        handleInputChange("emergencyContact", e.target.value)
                      }
                      placeholder="Nombre del contacto de emergencia"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyPhone">
                      Teléfono de Emergencia *
                    </Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        handleInputChange("emergencyPhone", e.target.value)
                      }
                      placeholder="Número de teléfono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="insurance">Seguro Médico</Label>
                    <Select
                      value={formData.insurance}
                      onValueChange={(value) =>
                        handleInputChange("insurance", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar seguro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eps_sanitas">EPS Sanitas</SelectItem>
                        <SelectItem value="eps_sura">EPS Sura</SelectItem>
                        <SelectItem value="eps_compensar">
                          EPS Compensar
                        </SelectItem>
                        <SelectItem value="eps_nueva">Nueva EPS</SelectItem>
                        <SelectItem value="particular">Particular</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="insuranceNumber">Número de Póliza</Label>
                    <Input
                      id="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={(e) =>
                        handleInputChange("insuranceNumber", e.target.value)
                      }
                      placeholder="Número de póliza o afiliación"
                    />
                  </div>
                </div>

                {/* Resumen */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de la Admisión</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>Paciente:</strong>{" "}
                      {formData.patientName || "Sin especificar"}
                    </div>
                    <div>
                      <strong>Tipo:</strong>{" "}
                      {formData.admissionType || "Sin especificar"}
                    </div>
                    <div>
                      <strong>Departamento:</strong>{" "}
                      {formData.department || "Sin especificar"}
                    </div>
                    <div>
                      <strong>Prioridad:</strong>
                      {formData.priority && (
                        <Badge
                          variant={
                            formData.priority === "CRITICAL"
                              ? "destructive"
                              : formData.priority === "HIGH"
                                ? "default"
                                : "secondary"
                          }
                          className="ml-2"
                        >
                          {formData.priority}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <strong>Médico:</strong>{" "}
                      {formData.attendingPhysician || "Sin asignar"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Creando..." : "Crear Admisión"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
