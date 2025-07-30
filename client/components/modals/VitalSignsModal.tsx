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
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Scale,
  Monitor,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/context/MedicalDataContext";
import { ResponsiveModalWrapper } from "@/components/ResponsiveModalWrapper";

interface VitalSignsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  patientId?: string;
  mode?: "create" | "edit";
  vitalSignsId?: string;
  onVitalSignsCreated?: (vitalSigns: any) => void;
}

const glasgowScaleOptions = [
  { value: "15", label: "15 - Normal" },
  { value: "14", label: "14 - Leve alteración" },
  { value: "13", label: "13 - Leve alteración" },
  { value: "12", label: "12 - Moderada alteración" },
  { value: "11", label: "11 - Moderada alteración" },
  { value: "10", label: "10 - Moderada alteración" },
  { value: "9", label: "9 - Severa alteración" },
  { value: "8", label: "8 - Severa alteración" },
  { value: "7", label: "7 - Severa alteración" },
  { value: "6", label: "6 - Severa alteración" },
  { value: "5", label: "5 - Severa alteración" },
  { value: "4", label: "4 - Severa alteración" },
  { value: "3", label: "3 - Coma profundo" },
];

export default function VitalSignsModal({
  isOpen = false,
  onClose,
  patientId,
  mode = "create",
  vitalSignsId,
  onVitalSignsCreated,
}: VitalSignsModalProps) {
  const { toast } = useToast();
  const { 
    addVitalSigns, 
    getPatientVitalSigns, 
    patients, 
    activePatients,
    saveToLocal 
  } = useMedicalData();

  // Form state
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    heartRate: "",
    respiratoryRate: "",
    temperature: "",
    systolicBP: "",
    diastolicBP: "",
    oxygenSaturation: "",
    glasgowScale: "",
    glucometry: "",
    weight: "",
    height: "",
    recordedBy: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedBMI, setCalculatedBMI] = useState<number | null>(null);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (formData.weight && formData.height) {
      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height) / 100; // Convert cm to m
      if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        setCalculatedBMI(Number(bmi.toFixed(1)));
      }
    } else {
      setCalculatedBMI(null);
    }
  }, [formData.weight, formData.height]);

  // Load existing vital signs if editing
  useEffect(() => {
    if (mode === "edit" && patientId && vitalSignsId) {
      const patientVitalSigns = getPatientVitalSigns(patientId);
      const vitalSigns = patientVitalSigns.find(vs => vs.id === vitalSignsId);
      if (vitalSigns) {
        setFormData({
          patientId: vitalSigns.patientId,
          heartRate: vitalSigns.heartRate.toString(),
          respiratoryRate: vitalSigns.respiratoryRate.toString(),
          temperature: vitalSigns.temperature.toString(),
          systolicBP: vitalSigns.bloodPressure.systolic.toString(),
          diastolicBP: vitalSigns.bloodPressure.diastolic.toString(),
          oxygenSaturation: vitalSigns.oxygenSaturation.toString(),
          glasgowScale: "", // Not in base interface, would need to extend
          glucometry: "", // Not in base interface, would need to extend
          weight: vitalSigns.weight?.toString() || "",
          height: vitalSigns.height?.toString() || "",
          recordedBy: vitalSigns.recordedBy,
        });
      }
    }
  }, [mode, patientId, vitalSignsId, getPatientVitalSigns]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field errors when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getVitalSignStatus = (type: string, value: string) => {
    const numValue = parseFloat(value);
    if (!numValue) return null;

    switch (type) {
      case "heartRate":
        if (numValue < 60)
          return { status: "Bradicardia", color: "text-yellow-600", severity: "warning" };
        if (numValue > 100)
          return { status: "Taquicardia", color: "text-red-600", severity: "danger" };
        return { status: "Normal", color: "text-green-600", severity: "normal" };

      case "temperature":
        if (numValue < 36)
          return { status: "Hipotermia", color: "text-blue-600", severity: "warning" };
        if (numValue > 37.5)
          return { status: "Fiebre", color: "text-red-600", severity: "danger" };
        return { status: "Normal", color: "text-green-600", severity: "normal" };

      case "oxygenSaturation":
        if (numValue < 95) 
          return { status: "Baja", color: "text-red-600", severity: "danger" };
        if (numValue < 98)
          return { status: "Límite", color: "text-yellow-600", severity: "warning" };
        return { status: "Normal", color: "text-green-600", severity: "normal" };

      case "systolicBP":
        if (numValue < 90)
          return { status: "Hipotensión", color: "text-red-600", severity: "danger" };
        if (numValue > 140)
          return { status: "Hipertensión", color: "text-red-600", severity: "danger" };
        if (numValue > 120)
          return { status: "Elevada", color: "text-yellow-600", severity: "warning" };
        return { status: "Normal", color: "text-green-600", severity: "normal" };

      case "diastolicBP":
        if (numValue < 60)
          return { status: "Hipotensión", color: "text-red-600", severity: "danger" };
        if (numValue > 90)
          return { status: "Hipertensión", color: "text-red-600", severity: "danger" };
        if (numValue > 80)
          return { status: "Elevada", color: "text-yellow-600", severity: "warning" };
        return { status: "Normal", color: "text-green-600", severity: "normal" };

      default:
        return null;
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Bajo peso", color: "text-blue-600", severity: "warning" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600", severity: "normal" };
    if (bmi < 30) return { category: "Sobrepeso", color: "text-yellow-600", severity: "warning" };
    return { category: "Obesidad", color: "text-red-600", severity: "danger" };
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const required = [
      "patientId",
      "heartRate",
      "respiratoryRate", 
      "temperature",
      "systolicBP",
      "diastolicBP",
      "oxygenSaturation",
      "recordedBy",
    ];

    required.forEach(field => {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData].toString().trim() === "") {
        errors[field] = "Este campo es obligatorio";
      }
    });

    // Validate numeric ranges
    const numericValidations = {
      heartRate: { min: 30, max: 300, name: "Frecuencia cardíaca" },
      respiratoryRate: { min: 5, max: 60, name: "Frecuencia respiratoria" },
      temperature: { min: 30, max: 45, name: "Temperatura" },
      systolicBP: { min: 60, max: 250, name: "Presión sistólica" },
      diastolicBP: { min: 30, max: 150, name: "Presión diastólica" },
      oxygenSaturation: { min: 70, max: 100, name: "Saturación de oxígeno" },
    };

    Object.entries(numericValidations).forEach(([field, validation]) => {
      const value = parseFloat(formData[field as keyof typeof formData]);
      if (!isNaN(value)) {
        if (value < validation.min || value > validation.max) {
          errors[field] = `${validation.name} debe estar entre ${validation.min} y ${validation.max}`;
        }
      }
    });

    // Validate that systolic > diastolic
    const systolic = parseFloat(formData.systolicBP);
    const diastolic = parseFloat(formData.diastolicBP);
    if (!isNaN(systolic) && !isNaN(diastolic) && systolic <= diastolic) {
      errors.systolicBP = "La presión sistólica debe ser mayor que la diastólica";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrija los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const vitalSignsData = {
        patientId: formData.patientId,
        timestamp: new Date().toISOString(),
        bloodPressure: {
          systolic: parseInt(formData.systolicBP),
          diastolic: parseInt(formData.diastolicBP),
        },
        heartRate: parseInt(formData.heartRate),
        temperature: parseFloat(formData.temperature),
        respiratoryRate: parseInt(formData.respiratoryRate),
        oxygenSaturation: parseInt(formData.oxygenSaturation),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        bmi: calculatedBMI || undefined,
        recordedBy: formData.recordedBy,
      };

      if (mode === "edit") {
        // Update logic would go here
        toast({
          title: "Signos vitales actualizados",
          description: "Los signos vitales han sido actualizados exitosamente",
        });
      } else {
        addVitalSigns(vitalSignsData);
        toast({
          title: "Signos vitales registrados",
          description: "Los signos vitales han sido registrados exitosamente",
        });
      }

      // Auto-save to localStorage
      saveToLocal();

      // Call callback if provided
      if (onVitalSignsCreated) {
        onVitalSignsCreated(vitalSignsData);
      }

      // Close modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving vital signs:", error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar los signos vitales",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get patient info for display
  const selectedPatient = patients.find(p => p.id === formData.patientId);

  const modalContent = (
    <Card className="max-w-5xl w-full max-h-[95vh] overflow-y-auto">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
        <CardTitle className="flex items-center gap-3">
          <Activity className="w-6 h-6" />
          {mode === "edit" ? "Editar Signos Vitales" : "Registro de Signos Vitales"}
        </CardTitle>
        <p className="text-teal-100 text-sm">
          Registre la última valoración técnica del paciente con monitoreo en tiempo real
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Patient Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Información del Paciente</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Paciente *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => handleInputChange("patientId", value)}
                disabled={!!patientId} // Disable if patientId is provided
              >
                <SelectTrigger className={fieldErrors.patientId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {activePatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.personalInfo.fullName} - {patient.personalInfo.identificationNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.patientId && (
                <p className="text-red-500 text-sm">{fieldErrors.patientId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordedBy">Registrado por *</Label>
              <Input
                id="recordedBy"
                type="text"
                placeholder="Nombre del profesional"
                value={formData.recordedBy}
                onChange={(e) => handleInputChange("recordedBy", e.target.value)}
                className={fieldErrors.recordedBy ? "border-red-500" : ""}
              />
              {fieldErrors.recordedBy && (
                <p className="text-red-500 text-sm">{fieldErrors.recordedBy}</p>
              )}
            </div>
          </div>

          {/* Patient Info Display */}
          {selectedPatient && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Paciente:</span> {selectedPatient.personalInfo.fullName}
                </div>
                <div>
                  <span className="font-medium">Edad:</span> {selectedPatient.personalInfo.age} años
                </div>
                <div>
                  <span className="font-medium">Habitación:</span> {selectedPatient.currentStatus.room || "No asignada"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Vital Signs */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Signos Vitales Principales</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate">Frecuencia Cardíaca (lpm) *</Label>
              <div className="space-y-1">
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="ej: 80"
                  value={formData.heartRate}
                  onChange={(e) => handleInputChange("heartRate", e.target.value)}
                  className={`font-mono ${fieldErrors.heartRate ? "border-red-500" : ""}`}
                />
                {formData.heartRate && (
                  <Badge
                    variant="outline"
                    className={getVitalSignStatus("heartRate", formData.heartRate)?.color}
                  >
                    {getVitalSignStatus("heartRate", formData.heartRate)?.status}
                  </Badge>
                )}
              </div>
              {fieldErrors.heartRate && (
                <p className="text-red-500 text-sm">{fieldErrors.heartRate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="respiratoryRate">Frecuencia Respiratoria (rpm) *</Label>
              <Input
                id="respiratoryRate"
                type="number"
                placeholder="ej: 20"
                value={formData.respiratoryRate}
                onChange={(e) => handleInputChange("respiratoryRate", e.target.value)}
                className={`font-mono ${fieldErrors.respiratoryRate ? "border-red-500" : ""}`}
              />
              {fieldErrors.respiratoryRate && (
                <p className="text-red-500 text-sm">{fieldErrors.respiratoryRate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperatura Corporal (°C) *</Label>
              <div className="space-y-1">
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="ej: 36.5"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                  className={`font-mono ${fieldErrors.temperature ? "border-red-500" : ""}`}
                />
                {formData.temperature && (
                  <Badge
                    variant="outline"
                    className={getVitalSignStatus("temperature", formData.temperature)?.color}
                  >
                    {getVitalSignStatus("temperature", formData.temperature)?.status}
                  </Badge>
                )}
              </div>
              {fieldErrors.temperature && (
                <p className="text-red-500 text-sm">{fieldErrors.temperature}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="systolicBP">Presión Sistólica (mmHg) *</Label>
              <div className="space-y-1">
                <Input
                  id="systolicBP"
                  type="number"
                  placeholder="ej: 120"
                  value={formData.systolicBP}
                  onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                  className={`font-mono ${fieldErrors.systolicBP ? "border-red-500" : ""}`}
                />
                {formData.systolicBP && (
                  <Badge
                    variant="outline"
                    className={getVitalSignStatus("systolicBP", formData.systolicBP)?.color}
                  >
                    {getVitalSignStatus("systolicBP", formData.systolicBP)?.status}
                  </Badge>
                )}
              </div>
              {fieldErrors.systolicBP && (
                <p className="text-red-500 text-sm">{fieldErrors.systolicBP}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diastolicBP">Presión Diastólica (mmHg) *</Label>
              <div className="space-y-1">
                <Input
                  id="diastolicBP"
                  type="number"
                  placeholder="ej: 80"
                  value={formData.diastolicBP}
                  onChange={(e) => handleInputChange("diastolicBP", e.target.value)}
                  className={`font-mono ${fieldErrors.diastolicBP ? "border-red-500" : ""}`}
                />
                {formData.diastolicBP && (
                  <Badge
                    variant="outline"
                    className={getVitalSignStatus("diastolicBP", formData.diastolicBP)?.color}
                  >
                    {getVitalSignStatus("diastolicBP", formData.diastolicBP)?.status}
                  </Badge>
                )}
              </div>
              {fieldErrors.diastolicBP && (
                <p className="text-red-500 text-sm">{fieldErrors.diastolicBP}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation">Saturación de Oxígeno (%) *</Label>
              <div className="space-y-1">
                <Input
                  id="oxygenSaturation"
                  type="number"
                  placeholder="ej: 98"
                  value={formData.oxygenSaturation}
                  onChange={(e) => handleInputChange("oxygenSaturation", e.target.value)}
                  className={`font-mono ${fieldErrors.oxygenSaturation ? "border-red-500" : ""}`}
                />
                {formData.oxygenSaturation && (
                  <Badge
                    variant="outline"
                    className={getVitalSignStatus("oxygenSaturation", formData.oxygenSaturation)?.color}
                  >
                    {getVitalSignStatus("oxygenSaturation", formData.oxygenSaturation)?.status}
                  </Badge>
                )}
              </div>
              {fieldErrors.oxygenSaturation && (
                <p className="text-red-500 text-sm">{fieldErrors.oxygenSaturation}</p>
              )}
            </div>
          </div>

          {/* Blood Pressure Display */}
          {formData.systolicBP && formData.diastolicBP && (
            <div className="bg-slate-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Presión Arterial:</span>
                <Badge variant="outline" className="font-mono text-lg">
                  {formData.systolicBP}/{formData.diastolicBP} mmHg
                </Badge>
                {getVitalSignStatus("systolicBP", formData.systolicBP)?.severity === "danger" && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Measurements */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Mediciones Adicionales</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="glasgowScale">Escala de Glasgow</Label>
              <Select
                value={formData.glasgowScale}
                onValueChange={(value) => handleInputChange("glasgowScale", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {glasgowScaleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="glucometry">Glucometría (mg/dL)</Label>
              <Input
                id="glucometry"
                type="number"
                placeholder="ej: 100"
                value={formData.glucometry}
                onChange={(e) => handleInputChange("glucometry", e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="ej: 70.5"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Talla (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="ej: 170"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          {/* BMI Display */}
          {calculatedBMI && (
            <div className="bg-slate-50 p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-teal-500" />
                  <span className="font-medium">IMC (Índice de Masa Corporal):</span>
                </div>
                <Badge variant="outline" className="font-mono text-lg">
                  {calculatedBMI}
                </Badge>
                <Badge
                  variant="outline"
                  className={getBMICategory(calculatedBMI).color}
                >
                  {getBMICategory(calculatedBMI).category}
                </Badge>
                {getBMICategory(calculatedBMI).severity === "danger" && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold">Archivos de Soporte</h3>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="font-medium mb-2">
                Sube hojas físicas con signos vitales, fotos de monitores
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
                id="vitals-file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("vitals-file-upload")?.click()}
              >
                Seleccionar Archivos
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Archivos adjuntados:</p>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
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
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                localStorage.setItem('vital_signs_draft', JSON.stringify(formData));
                toast({
                  title: "Progreso guardado",
                  description: "Los datos han sido guardados localmente",
                });
              }}
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
                "Actualizar Signos Vitales"
              ) : (
                "Registrar Signos Vitales"
              )}
              <TrendingUp className="w-4 h-4 ml-2" />
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
      title={mode === "edit" ? "Editar Signos Vitales" : "Registro de Signos Vitales"}
    >
      {modalContent}
    </ResponsiveModalWrapper>
  );
}
