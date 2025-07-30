import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/context/MedicalDataContext";
import type { DischargeInfo } from "@/context/MedicalDataContext";
import {
  UserMinus,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  FileText,
  Clock,
  User,
  Stethoscope,
  Calendar,
  Pill,
  Home,
  Info,
} from "lucide-react";

interface PatientDischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  onDischargeCompleted?: (discharge: any) => void;
}

export default function PatientDischargeModal({
  isOpen,
  onClose,
  patientId,
  onDischargeCompleted,
}: PatientDischargeModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { getPatient, dischargePatient, releaseBed, beds } = useMedicalData();

  const selectedPatient = patientId ? getPatient(patientId) : null;

  const [dischargeData, setDischargeData] = useState({
    // Required fields for DischargeInfo
    dischargeDate: "",
    dischargeType: "" as "medical" | "voluntary" | "transfer" | "death" | "",
    destination: "",
    finalDiagnosis: "",
    medications: "",
    followUpInstructions: "",
    dischargedBy: "",
    notes: "",

    // Additional fields for comprehensive discharge
    dischargeCondition: "",
    treatmentSummary: "",
    complications: "",
    pendingResults: "",
    homeCarePlan: "",
    nextAppointment: "",
    specialistReferrals: "",
    dischargeTime: "",
    nurseSignoff: "",
    patientEducation: "",
    familyNotified: false,

    // Validations
    vitalSignsStable: false,
    labResultsReviewed: false,
    imagingReviewed: false,
    medicationReconciled: false,
    patientUnderstanding: false,
    transportArranged: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setDischargeData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!dischargeData.dischargeType)
          newErrors.dischargeType = "Tipo de alta es requerido";
        if (!dischargeData.dischargeCondition)
          newErrors.dischargeCondition = "Condición del paciente es requerida";
        if (!dischargeData.finalDiagnosis)
          newErrors.finalDiagnosis = "Diagnóstico final es requerido";
        if (!dischargeData.treatmentSummary)
          newErrors.treatmentSummary = "Resumen del tratamiento es requerido";
        break;
      case 2:
        if (!dischargeData.medications)
          newErrors.medications = "Medicaciones de alta son requeridas";
        if (!dischargeData.homeCarePlan)
          newErrors.homeCarePlan = "Plan de cuidados en casa es requerido";
        if (!dischargeData.followUpInstructions)
          newErrors.followUpInstructions =
            "Instrucciones de seguimiento son requeridas";
        break;
      case 3:
        if (!dischargeData.dischargeDate)
          newErrors.dischargeDate = "Fecha de alta es requerida";
        if (!dischargeData.dischargeTime)
          newErrors.dischargeTime = "Hora de alta es requerida";
        if (!dischargeData.dischargedBy)
          newErrors.dischargedBy = "Médico que da el alta es requerido";
        if (!dischargeData.nurseSignoff)
          newErrors.nurseSignoff = "Firma de enfermería es requerida";
        break;
      case 4:
        if (!dischargeData.vitalSignsStable)
          newErrors.vitalSignsStable = "Debe confirmar signos vitales estables";
        if (!dischargeData.labResultsReviewed)
          newErrors.labResultsReviewed =
            "Debe revisar resultados de laboratorio";
        if (!dischargeData.medicationReconciled)
          newErrors.medicationReconciled = "Debe reconciliar medicaciones";
        if (!dischargeData.patientUnderstanding)
          newErrors.patientUnderstanding =
            "Debe confirmar comprensión del paciente";
        if (!dischargeData.transportArranged)
          newErrors.transportArranged = "Debe confirmar transporte organizado";
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
    if (!validateStep(4) || !selectedPatient) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Prepare discharge info according to the interface
      const dischargeInfo: DischargeInfo = {
        dischargeDate: `${dischargeData.dischargeDate}T${dischargeData.dischargeTime}`,
        dischargeType: dischargeData.dischargeType as "medical" | "voluntary" | "transfer" | "death",
        destination: dischargeData.destination || "Domicilio",
        finalDiagnosis: dischargeData.finalDiagnosis,
        medications: dischargeData.medications,
        followUpInstructions: dischargeData.followUpInstructions,
        dischargedBy: dischargeData.dischargedBy,
        notes: `${dischargeData.treatmentSummary}\n\nComplicaciones: ${dischargeData.complications || 'Ninguna'}\n\nPlan de cuidados: ${dischargeData.homeCarePlan}\n\nEducación al paciente: ${dischargeData.patientEducation || 'Completada'}`,
      };

      // Discharge patient using context
      dischargePatient(selectedPatient.id, dischargeInfo);

      // Release bed if patient had one assigned
      if (selectedPatient.currentStatus.bed) {
        const occupiedBed = beds.find(bed =>
          bed.patientId === selectedPatient.id && bed.status === "occupied"
        );
        if (occupiedBed) {
          releaseBed(occupiedBed.id);
        }
      }

      const dischargeRecord = {
        id: `DISCHARGE-${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.personalInfo.fullName,
        ...dischargeData,
        ...dischargeInfo,
        createdAt: new Date().toISOString(),
        status: "COMPLETED",
      };

      console.log("Alta completada:", dischargeRecord);

      toast({
        title: "Alta procesada exitosamente",
        description: `Se ha procesado el alta de ${selectedPatient.personalInfo.fullName}`,
      });

      // Call callback if provided
      if (onDischargeCompleted) {
        onDischargeCompleted(dischargeRecord);
      }

      // Reset form and close
      setDischargeData({
        dischargeDate: "",
        dischargeType: "",
        destination: "",
        finalDiagnosis: "",
        medications: "",
        followUpInstructions: "",
        dischargedBy: "",
        notes: "",
        dischargeCondition: "",
        treatmentSummary: "",
        complications: "",
        pendingResults: "",
        homeCarePlan: "",
        nextAppointment: "",
        specialistReferrals: "",
        dischargeTime: "",
        nurseSignoff: "",
        patientEducation: "",
        familyNotified: false,
        vitalSignsStable: false,
        labResultsReviewed: false,
        imagingReviewed: false,
        medicationReconciled: false,
        patientUnderstanding: false,
        transportArranged: false,
      });
      setCurrentStep(1);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error processing discharge:", error);
      toast({
        title: "Error al procesar alta",
        description:
          "Ocurrió un error al procesar el alta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Información Médica", icon: Stethoscope },
    { id: 2, title: "Medicaciones y Seguimiento", icon: Pill },
    { id: 3, title: "Información Administrativa", icon: FileText },
    { id: 4, title: "Validaciones Finales", icon: CheckCircle },
  ];

  if (!selectedPatient) {
    return null;
  }

  const daysOfStay = Math.ceil(
    (new Date().getTime() - new Date(selectedPatient.currentStatus.admissionDate).getTime()) /
    (1000 * 3600 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5 text-green-600" />
            Alta de Paciente - {selectedPatient.personalInfo.fullName}
          </DialogTitle>
        </DialogHeader>

        {/* Patient Summary */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Paciente:</strong> {selectedPatient.personalInfo.fullName}
              </div>
              <div>
                <strong>Edad:</strong> {selectedPatient.personalInfo.age} años
              </div>
              <div>
                <strong>Habitación:</strong> {selectedPatient.currentStatus.room || "No asignada"}
              </div>
              <div>
                <strong>Días de estancia:</strong> {daysOfStay}
              </div>
              <div>
                <strong>Diagnóstico de ingreso:</strong>{" "}
                {selectedPatient.medicalInfo.currentSymptoms}
              </div>
              <div>
                <strong>Médico tratante:</strong>{" "}
                {selectedPatient.currentStatus.assignedDoctor}
              </div>
              <div>
                <strong>EPS:</strong>{" "}
                {selectedPatient.epsInfo.eps}
              </div>
              <div>
                <strong>Prioridad:</strong> {" "}
                <Badge variant={selectedPatient.currentStatus.priority === "critical" ? "destructive" : "secondary"}>
                  {selectedPatient.currentStatus.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-green-500 border-green-500 text-white"
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
                    currentStep >= step.id ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Paso 1: Información Médica */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Evaluación Médica del Alta
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dischargeType">Tipo de Alta *</Label>
                      <Select
                        value={dischargeData.dischargeType}
                        onValueChange={(value) =>
                          handleInputChange("dischargeType", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.dischargeType ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Alta Médica</SelectItem>
                          <SelectItem value="voluntary">
                            Alta Voluntaria
                          </SelectItem>
                          <SelectItem value="transfer">Traslado</SelectItem>
                          <SelectItem value="death">Defunción</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.dischargeType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dischargeType}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dischargeCondition">
                        Condición del Paciente *
                      </Label>
                      <Select
                        value={dischargeData.dischargeCondition}
                        onValueChange={(value) =>
                          handleInputChange("dischargeCondition", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.dischargeCondition ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccionar condición" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CURADO">Curado</SelectItem>
                          <SelectItem value="MEJORADO">Mejorado</SelectItem>
                          <SelectItem value="ESTABLE">Estable</SelectItem>
                          <SelectItem value="SIN_CAMBIOS">
                            Sin cambios
                          </SelectItem>
                          <SelectItem value="EMPEORADO">Empeorado</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.dischargeCondition && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dischargeCondition}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="finalDiagnosis">Diagnóstico Final *</Label>
                    <Textarea
                      id="finalDiagnosis"
                      value={dischargeData.finalDiagnosis}
                      onChange={(e) =>
                        handleInputChange("finalDiagnosis", e.target.value)
                      }
                      placeholder="Diagnóstico principal y secundarios al momento del alta"
                      rows={3}
                      className={errors.finalDiagnosis ? "border-red-500" : ""}
                    />
                    {errors.finalDiagnosis && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.finalDiagnosis}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="treatmentSummary">
                      Resumen del Tratamiento *
                    </Label>
                    <Textarea
                      id="treatmentSummary"
                      value={dischargeData.treatmentSummary}
                      onChange={(e) =>
                        handleInputChange("treatmentSummary", e.target.value)
                      }
                      placeholder="Resumen de los tratamientos realizados durante la hospitalización"
                      rows={3}
                      className={
                        errors.treatmentSummary ? "border-red-500" : ""
                      }
                    />
                    {errors.treatmentSummary && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.treatmentSummary}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="complications">Complicaciones</Label>
                    <Textarea
                      id="complications"
                      value={dischargeData.complications}
                      onChange={(e) =>
                        handleInputChange("complications", e.target.value)
                      }
                      placeholder="Complicaciones durante la hospitalización (escribir 'Ninguna' si no aplica)"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pendingResults">
                      Resultados Pendientes
                    </Label>
                    <Textarea
                      id="pendingResults"
                      value={dischargeData.pendingResults}
                      onChange={(e) =>
                        handleInputChange("pendingResults", e.target.value)
                      }
                      placeholder="Resultados de laboratorio o imágenes pendientes"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 2: Medicaciones y Seguimiento */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medicaciones y Plan de Seguimiento
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="medications">
                      Medicaciones de Alta *
                    </Label>
                    <Textarea
                      id="medications"
                      value={dischargeData.medications}
                      onChange={(e) =>
                        handleInputChange(
                          "medications",
                          e.target.value,
                        )
                      }
                      placeholder="Lista detallada de medicamentos con dosis, frecuencia y duración"
                      rows={4}
                      className={
                        errors.medications ? "border-red-500" : ""
                      }
                    />
                    {errors.medications && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.medications}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="homeCarePlan">
                      Plan de Cuidados en Casa *
                    </Label>
                    <Textarea
                      id="homeCarePlan"
                      value={dischargeData.homeCarePlan}
                      onChange={(e) =>
                        handleInputChange("homeCarePlan", e.target.value)
                      }
                      placeholder="Instrucciones detalladas para el cuidado en casa"
                      rows={3}
                      className={errors.homeCarePlan ? "border-red-500" : ""}
                    />
                    {errors.homeCarePlan && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.homeCarePlan}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="followUpInstructions">
                      Instrucciones de Seguimiento *
                    </Label>
                    <Textarea
                      id="followUpInstructions"
                      value={dischargeData.followUpInstructions}
                      onChange={(e) =>
                        handleInputChange(
                          "followUpInstructions",
                          e.target.value,
                        )
                      }
                      placeholder="Cuándo y dónde debe acudir para seguimiento médico"
                      rows={3}
                      className={
                        errors.followUpInstructions ? "border-red-500" : ""
                      }
                    />
                    {errors.followUpInstructions && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.followUpInstructions}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nextAppointment">Próxima Cita</Label>
                      <Input
                        id="nextAppointment"
                        type="datetime-local"
                        value={dischargeData.nextAppointment}
                        onChange={(e) =>
                          handleInputChange("nextAppointment", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialistReferrals">
                        Remisiones a Especialistas
                      </Label>
                      <Input
                        id="specialistReferrals"
                        value={dischargeData.specialistReferrals}
                        onChange={(e) =>
                          handleInputChange(
                            "specialistReferrals",
                            e.target.value,
                          )
                        }
                        placeholder="Especialidades requeridas"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 3: Información Administrativa */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información Administrativa
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dischargeDate">Fecha de Alta *</Label>
                      <Input
                        id="dischargeDate"
                        type="date"
                        value={dischargeData.dischargeDate}
                        onChange={(e) =>
                          handleInputChange("dischargeDate", e.target.value)
                        }
                        className={errors.dischargeDate ? "border-red-500" : ""}
                      />
                      {errors.dischargeDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dischargeDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dischargeTime">Hora de Alta *</Label>
                      <Input
                        id="dischargeTime"
                        type="time"
                        value={dischargeData.dischargeTime}
                        onChange={(e) =>
                          handleInputChange("dischargeTime", e.target.value)
                        }
                        className={errors.dischargeTime ? "border-red-500" : ""}
                      />
                      {errors.dischargeTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dischargeTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dischargedBy">
                        Médico que da el Alta *
                      </Label>
                      <Select
                        value={dischargeData.dischargedBy}
                        onValueChange={(value) =>
                          handleInputChange("dischargedBy", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.dischargedBy ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccionar médico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. García - Medicina Interna">
                            Dr. García - Medicina Interna
                          </SelectItem>
                          <SelectItem value="Dr. López - Cardiología">
                            Dr. López - Cardiología
                          </SelectItem>
                          <SelectItem value="Dr. Martínez - Urgencias">
                            Dr. Martínez - Urgencias
                          </SelectItem>
                          <SelectItem value="Dr. Silva - Neurología">
                            Dr. Silva - Neurología
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.dischargedBy && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dischargedBy}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nurseSignoff">Enfermera a Cargo *</Label>
                      <Select
                        value={dischargeData.nurseSignoff}
                        onValueChange={(value) =>
                          handleInputChange("nurseSignoff", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.nurseSignoff ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccionar enfermera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nurse_maria">
                            Enf. María Rodríguez
                          </SelectItem>
                          <SelectItem value="nurse_carlos">
                            Enf. Carlos Pérez
                          </SelectItem>
                          <SelectItem value="nurse_ana">
                            Enf. Ana Martínez
                          </SelectItem>
                          <SelectItem value="nurse_luis">
                            Enf. Luis González
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.nurseSignoff && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.nurseSignoff}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="patientEducation">
                      Educación al Paciente
                    </Label>
                    <Textarea
                      id="patientEducation"
                      value={dischargeData.patientEducation}
                      onChange={(e) =>
                        handleInputChange("patientEducation", e.target.value)
                      }
                      placeholder="Educación proporcionada al paciente y familia"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="familyNotified"
                      checked={dischargeData.familyNotified}
                      onChange={(e) =>
                        handleInputChange("familyNotified", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label htmlFor="familyNotified">
                      Familia notificada del alta
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 4: Validaciones Finales */}
          {currentStep === 4 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Validaciones Finales del Alta
                </h3>

                <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    <strong>Importante:</strong> Todas las validaciones deben
                    ser completadas antes de procesar el alta del paciente.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="vitalSignsStable"
                        checked={dischargeData.vitalSignsStable}
                        onChange={(e) =>
                          handleInputChange(
                            "vitalSignsStable",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor="vitalSignsStable" className="flex-1">
                        Signos vitales estables en las últimas 4 horas *
                      </Label>
                      {dischargeData.vitalSignsStable && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="labResultsReviewed"
                        checked={dischargeData.labResultsReviewed}
                        onChange={(e) =>
                          handleInputChange(
                            "labResultsReviewed",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor="labResultsReviewed" className="flex-1">
                        Resultados de laboratorio revisados y dentro de
                        parámetros aceptables *
                      </Label>
                      {dischargeData.labResultsReviewed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="imagingReviewed"
                        checked={dischargeData.imagingReviewed}
                        onChange={(e) =>
                          handleInputChange("imagingReviewed", e.target.checked)
                        }
                        className="rounded"
                      />
                      <Label htmlFor="imagingReviewed" className="flex-1">
                        Estudios de imagen revisados (si aplica)
                      </Label>
                      {dischargeData.imagingReviewed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="medicationReconciled"
                        checked={dischargeData.medicationReconciled}
                        onChange={(e) =>
                          handleInputChange(
                            "medicationReconciled",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor="medicationReconciled" className="flex-1">
                        Reconciliación de medicamentos completada *
                      </Label>
                      {dischargeData.medicationReconciled && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="patientUnderstanding"
                        checked={dischargeData.patientUnderstanding}
                        onChange={(e) =>
                          handleInputChange(
                            "patientUnderstanding",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor="patientUnderstanding" className="flex-1">
                        Paciente y familia comprenden las instrucciones de alta
                        *
                      </Label>
                      {dischargeData.patientUnderstanding && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id="transportArranged"
                        checked={dischargeData.transportArranged}
                        onChange={(e) =>
                          handleInputChange(
                            "transportArranged",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor="transportArranged" className="flex-1">
                        Transporte seguro organizado para el paciente *
                      </Label>
                      {dischargeData.transportArranged && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {Object.keys(errors).length > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        <strong>Validaciones requeridas:</strong>
                        <ul className="mt-2 list-disc list-inside">
                          {Object.entries(errors).map(([key, error]) => (
                            <li key={key}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Resumen Final */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-green-600" />
                      Resumen del Alta
                    </h4>
                    <div className="text-sm space-y-1 text-green-700">
                      <div>
                        <strong>Paciente:</strong>{" "}
                        {selectedAdmission.patient.name}
                      </div>
                      <div>
                        <strong>Tipo de Alta:</strong>{" "}
                        {dischargeData.dischargeType || "No especificado"}
                      </div>
                      <div>
                        <strong>Condición:</strong>{" "}
                        {dischargeData.dischargeCondition || "No especificada"}
                      </div>
                      <div>
                        <strong>Fecha programada:</strong>{" "}
                        {dischargeData.dischargeDate}{" "}
                        {dischargeData.dischargeTime}
                      </div>
                      <div>
                        <strong>Médico:</strong>{" "}
                        {dischargeData.dischargingPhysician || "No asignado"}
                      </div>
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
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
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
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Home className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Procesando Alta..." : "Completar Alta"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
