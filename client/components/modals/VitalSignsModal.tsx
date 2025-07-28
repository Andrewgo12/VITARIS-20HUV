import { useForm } from '@/context/FormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Activity, Heart, Thermometer, Scale } from 'lucide-react';
import { useState, useEffect } from 'react';

const glasgowScaleOptions = [
  { value: '15', label: '15 - Normal' },
  { value: '14', label: '14 - Leve alteración' },
  { value: '13', label: '13 - Leve alteración' },
  { value: '12', label: '12 - Moderada alteración' },
  { value: '11', label: '11 - Moderada alteración' },
  { value: '10', label: '10 - Moderada alteración' },
  { value: '9', label: '9 - Severa alteración' },
  { value: '8', label: '8 - Severa alteración' },
  { value: '7', label: '7 - Severa alteración' },
  { value: '6', label: '6 - Severa alteración' },
  { value: '5', label: '5 - Severa alteración' },
  { value: '4', label: '4 - Severa alteración' },
  { value: '3', label: '3 - Coma profundo' },
];

export default function VitalSignsModal() {
  const { formData, dispatch, nextStep, prevStep, calculateBMI } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(formData.vitals.attachments3 || []);

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_VITALS', payload: { [field]: value } });
  };

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (formData.vitals.weight && formData.vitals.height) {
      calculateBMI();
    }
  }, [formData.vitals.weight, formData.vitals.height, calculateBMI]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const updatedFiles = [...uploadedFiles, ...files];
    setUploadedFiles(updatedFiles);
    dispatch({ type: 'UPDATE_VITALS', payload: { attachments3: updatedFiles } });
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    dispatch({ type: 'UPDATE_VITALS', payload: { attachments3: updatedFiles } });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Bajo peso', color: 'text-warning' };
    if (bmi < 25) return { category: 'Normal', color: 'text-success' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-warning' };
    return { category: 'Obesidad', color: 'text-destructive' };
  };

  const getVitalSignStatus = (type: string, value: string) => {
    const numValue = parseFloat(value);
    if (!numValue) return null;

    switch (type) {
      case 'heartRate':
        if (numValue < 60) return { status: 'Bradicardia', color: 'text-warning' };
        if (numValue > 100) return { status: 'Taquicardia', color: 'text-destructive' };
        return { status: 'Normal', color: 'text-success' };
      
      case 'temperature':
        if (numValue < 36) return { status: 'Hipotermia', color: 'text-warning' };
        if (numValue > 37.5) return { status: 'Fiebre', color: 'text-destructive' };
        return { status: 'Normal', color: 'text-success' };
      
      case 'oxygenSaturation':
        if (numValue < 95) return { status: 'Baja', color: 'text-destructive' };
        return { status: 'Normal', color: 'text-success' };
      
      default:
        return null;
    }
  };

  const isValid = () => {
    const required = [
      'heartRate', 'respiratoryRate', 'temperature', 'systolicBP',
      'diastolicBP', 'oxygenSaturation', 'glasgowScale', 'glucometry',
      'weight', 'height'
    ];

    const allFieldsValid = required.every(field => {
      const value = formData.vitals[field as keyof typeof formData.vitals];
      return value && value.toString().trim() !== '';
    });

    const hasAttachments = uploadedFiles.length > 0;

    return allFieldsValid && hasAttachments;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-medical-blue/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-medical-green/10 to-medical-blue/10 border-b">
        <CardTitle className="flex items-center gap-3 text-primary">
          <Activity className="w-6 h-6" />
          Paso 3: Signos Vitales y Estado Clínico
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Registre la última valoración técnica del paciente desde la EPS
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Primary Vital Signs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold">Signos Vitales Principales</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate">Frecuencia Cardíaca (lpm) *</Label>
              <div className="space-y-1">
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="ej: 80"
                  value={formData.vitals.heartRate}
                  onChange={(e) => handleInputChange('heartRate', e.target.value)}
                  className="font-mono"
                />
                {formData.vitals.heartRate && (
                  <Badge 
                    variant="outline" 
                    className={getVitalSignStatus('heartRate', formData.vitals.heartRate)?.color}
                  >
                    {getVitalSignStatus('heartRate', formData.vitals.heartRate)?.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="respiratoryRate">Frecuencia Respiratoria (rpm) *</Label>
              <Input
                id="respiratoryRate"
                type="number"
                placeholder="ej: 20"
                value={formData.vitals.respiratoryRate}
                onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperatura Corporal (°C) *</Label>
              <div className="space-y-1">
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="ej: 36.5"
                  value={formData.vitals.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  className="font-mono"
                />
                {formData.vitals.temperature && (
                  <Badge 
                    variant="outline" 
                    className={getVitalSignStatus('temperature', formData.vitals.temperature)?.color}
                  >
                    {getVitalSignStatus('temperature', formData.vitals.temperature)?.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systolicBP">Presión Sistólica (mmHg) *</Label>
              <Input
                id="systolicBP"
                type="number"
                placeholder="ej: 120"
                value={formData.vitals.systolicBP}
                onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diastolicBP">Presión Diastólica (mmHg) *</Label>
              <Input
                id="diastolicBP"
                type="number"
                placeholder="ej: 80"
                value={formData.vitals.diastolicBP}
                onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation">Saturación de Oxígeno (%) *</Label>
              <div className="space-y-1">
                <Input
                  id="oxygenSaturation"
                  type="number"
                  placeholder="ej: 98"
                  value={formData.vitals.oxygenSaturation}
                  onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                  className="font-mono"
                />
                {formData.vitals.oxygenSaturation && (
                  <Badge 
                    variant="outline" 
                    className={getVitalSignStatus('oxygenSaturation', formData.vitals.oxygenSaturation)?.color}
                  >
                    {getVitalSignStatus('oxygenSaturation', formData.vitals.oxygenSaturation)?.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Blood Pressure Display */}
          {formData.vitals.systolicBP && formData.vitals.diastolicBP && (
            <div className="bg-medical-light/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-medical-blue" />
                <span className="font-medium">Presión Arterial:</span>
                <Badge variant="outline" className="font-mono text-lg">
                  {formData.vitals.systolicBP}/{formData.vitals.diastolicBP} mmHg
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Additional Measurements */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-medical-green" />
            <h3 className="text-lg font-semibold">Mediciones Adicionales</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="glasgowScale">Escala de Glasgow *</Label>
              <Select 
                value={formData.vitals.glasgowScale} 
                onValueChange={(value) => handleInputChange('glasgowScale', value)}
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
              <Label htmlFor="glucometry">Glucometría (mg/dL) *</Label>
              <Input
                id="glucometry"
                type="number"
                placeholder="ej: 100"
                value={formData.vitals.glucometry}
                onChange={(e) => handleInputChange('glucometry', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="ej: 70.5"
                value={formData.vitals.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Talla (cm) *</Label>
              <Input
                id="height"
                type="number"
                placeholder="ej: 170"
                value={formData.vitals.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          {/* BMI Display */}
          {formData.vitals.bmi > 0 && (
            <div className="bg-medical-light/50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-medical-blue" />
                  <span className="font-medium">IMC (Índice de Masa Corporal):</span>
                </div>
                <Badge variant="outline" className="font-mono text-lg">
                  {formData.vitals.bmi}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={getBMICategory(formData.vitals.bmi).color}
                >
                  {getBMICategory(formData.vitals.bmi).category}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Archivos de Signos Vitales (Opcionales)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Sube hojas físicas con signos vitales, fotos de monitores
              </p>
              <p className="text-xs text-muted-foreground mb-4">
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
                variant="outline" 
                onClick={() => document.getElementById('vitals-file-upload')?.click()}
              >
                Seleccionar Archivos
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Archivos adjuntados:</p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
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
          <Button
            variant="outline"
            onClick={prevStep}
          >
            Anterior: Remisión y Diagnóstico
          </Button>
          <Button
            onClick={nextStep}
            disabled={!isValid()}
            className="px-8"
          >
            Siguiente: Documentos de Soporte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
