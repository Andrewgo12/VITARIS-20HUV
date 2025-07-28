import { useForm } from '@/context/FormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, User, CreditCard, MapPin } from 'lucide-react';
import { useState } from 'react';

const identificationTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'RC', label: 'Registro Civil' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PP', label: 'Pasaporte' },
];

const sexOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
];

const epsOptions = [
  { value: 'NUEVA_EPS', label: 'Nueva EPS' },
  { value: 'SAVIA_SALUD', label: 'Savia Salud' },
  { value: 'SANITAS', label: 'Sanitas' },
  { value: 'FAMISANAR', label: 'Famisanar' },
  { value: 'COMPENSAR', label: 'Compensar' },
  { value: 'OTRO', label: 'Otro' },
];

const affiliationRegimes = [
  { value: 'SUBSIDIADO', label: 'Subsidiado' },
  { value: 'CONTRIBUTIVO', label: 'Contributivo' },
  { value: 'ESPECIAL', label: 'Especial' },
];

const affiliateTypes = [
  { value: 'COTIZANTE', label: 'Cotizante' },
  { value: 'BENEFICIARIO', label: 'Beneficiario' },
  { value: 'ADICIONAL', label: 'Adicional' },
];

const affiliationStatuses = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'SUSPENDIDO', label: 'Suspendido' },
  { value: 'RETIRADO', label: 'Retirado' },
];

const sisbenLevels = [
  { value: '1', label: 'Nivel 1' },
  { value: '2', label: 'Nivel 2' },
  { value: '3', label: 'Nivel 3' },
  { value: '4', label: 'Nivel 4' },
  { value: 'NO_APLICA', label: 'No Aplica' },
];

export default function PatientIdentificationModal() {
  const { formData, dispatch, nextStep, calculateAge } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(formData.patient.attachments1 || []);

  const handleInputChange = (field: string, value: string | number) => {
    dispatch({ type: 'UPDATE_PATIENT', payload: { [field]: value } });
    
    // Calculate age when birth date changes
    if (field === 'birthDate' && value) {
      calculateAge(value as string);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const updatedFiles = [...uploadedFiles, ...files];
    setUploadedFiles(updatedFiles);
    dispatch({ type: 'UPDATE_PATIENT', payload: { attachments1: updatedFiles } });
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    dispatch({ type: 'UPDATE_PATIENT', payload: { attachments1: updatedFiles } });
  };

  const isValid = () => {
    const required = [
      'identificationType', 'identificationNumber', 'fullName', 'birthDate',
      'sex', 'eps', 'affiliationRegime', 'affiliateType', 'affiliationNumber',
      'affiliationStatus', 'phone', 'address'
    ];
    
    return required.every(field => {
      const value = formData.patient[field as keyof typeof formData.patient];
      return value && value.toString().trim() !== '';
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-medical-blue/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-medical-blue/10 border-b">
        <CardTitle className="flex items-center gap-3 text-primary">
          <User className="w-6 h-6" />
          Paso 1: Datos de Identificación del Paciente
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete la información básica del paciente y validación de afiliación EPS
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4 mb-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Información Personal</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identificationType">Tipo de Identificación *</Label>
              <Select 
                value={formData.patient.identificationType} 
                onValueChange={(value) => handleInputChange('identificationType', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="identificationNumber">N��mero de Identificación *</Label>
              <Input
                id="identificationNumber"
                type="text"
                placeholder="Número de documento"
                value={formData.patient.identificationNumber}
                onChange={(e) => handleInputChange('identificationNumber', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nombres y apellidos"
                value={formData.patient.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.patient.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                value={formData.patient.age || ''}
                readOnly
                className="bg-muted"
                placeholder="Calculada automáticamente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sexo *</Label>
              <Select 
                value={formData.patient.sex} 
                onValueChange={(value) => handleInputChange('sex', value)}
              >
                <SelectTrigger>
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
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-medical-blue" />
            <h3 className="text-lg font-semibold">Información EPS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eps">EPS *</Label>
              <Select 
                value={formData.patient.eps} 
                onValueChange={(value) => handleInputChange('eps', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="affiliationRegime">Régimen de Afiliación *</Label>
              <Select 
                value={formData.patient.affiliationRegime} 
                onValueChange={(value) => handleInputChange('affiliationRegime', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="affiliateType">Tipo de Afiliado *</Label>
              <Select 
                value={formData.patient.affiliateType} 
                onValueChange={(value) => handleInputChange('affiliateType', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="affiliationNumber">Número de Afiliación *</Label>
              <Input
                id="affiliationNumber"
                type="text"
                placeholder="Número de afiliación EPS"
                value={formData.patient.affiliationNumber}
                onChange={(e) => handleInputChange('affiliationNumber', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliationStatus">Estado de Afiliación *</Label>
              <Select 
                value={formData.patient.affiliationStatus} 
                onValueChange={(value) => handleInputChange('affiliationStatus', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="sisbenLevel">Nivel SISBEN *</Label>
              <Select 
                value={formData.patient.sisbenLevel} 
                onValueChange={(value) => handleInputChange('sisbenLevel', value)}
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
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-medical-green" />
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono de Contacto *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Número de teléfono"
                value={formData.patient.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.patient.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Textarea
              id="address"
              placeholder="Dirección completa de residencia"
              value={formData.patient.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Archivos Adjuntos (Opcionales)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center -mb-1">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Sube documentos de identidad, carné EPS, foto del paciente
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
                id="file-upload"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
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
        <div className="flex justify-end pt-6 border-t">
          <Button
            onClick={nextStep}
            disabled={!isValid()}
            className="px-8"
          >
            Siguiente: Remisión y Diagnóstico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
