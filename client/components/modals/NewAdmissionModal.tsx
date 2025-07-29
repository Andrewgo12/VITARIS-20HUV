import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  User,
  Stethoscope,
  Building,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

interface NewAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewAdmissionModal({ isOpen, onClose }: NewAdmissionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Datos del Paciente
    patientId: '',
    patientName: '',
    patientAge: '',
    patientSex: '',
    patientDocument: '',
    
    // Datos de Admisión
    admissionType: '',
    department: '',
    room: '',
    attendingPhysician: '',
    admissionDate: '',
    priority: '',
    
    // Información Médica
    mainDiagnosis: '',
    secondaryDiagnoses: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    
    // Información de Contacto
    emergencyContact: '',
    emergencyPhone: '',
    insurance: '',
    insuranceNumber: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Aquí iría la lógica para guardar la admisión
    console.log('Nueva admisión:', formData);
    onClose();
  };

  const steps = [
    { id: 1, title: 'Datos del Paciente', icon: User },
    { id: 2, title: 'Información de Admisión', icon: Building },
    { id: 3, title: 'Información Médica', icon: Stethoscope },
    { id: 4, title: 'Contacto y Seguro', icon: Calendar }
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
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-2 hidden md:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
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
                      onChange={(e) => handleInputChange('patientId', e.target.value)}
                      placeholder="Ej: P-2024-001234"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="patientDocument">Documento de Identidad *</Label>
                    <Input
                      id="patientDocument"
                      value={formData.patientDocument}
                      onChange={(e) => handleInputChange('patientDocument', e.target.value)}
                      placeholder="Número de documento"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="patientName">Nombre Completo *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      placeholder="Nombres y apellidos completos"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="patientAge">Edad *</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) => handleInputChange('patientAge', e.target.value)}
                      placeholder="Edad en años"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="patientSex">Sexo *</Label>
                    <Select value={formData.patientSex} onValueChange={(value) => handleInputChange('patientSex', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                        <SelectItem value="O">Otro</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select value={formData.admissionType} onValueChange={(value) => handleInputChange('admissionType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMERGENCY">Urgencias</SelectItem>
                        <SelectItem value="ELECTIVE">Electiva</SelectItem>
                        <SelectItem value="TRANSFER">Transferencia</SelectItem>
                        <SelectItem value="OBSERVATION">Observación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Prioridad *</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
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
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICU">UCI</SelectItem>
                        <SelectItem value="EMERGENCY">Urgencias</SelectItem>
                        <SelectItem value="INTERNAL">Medicina Interna</SelectItem>
                        <SelectItem value="SURGERY">Cirugía</SelectItem>
                        <SelectItem value="CARDIOLOGY">Cardiología</SelectItem>
                        <SelectItem value="NEUROLOGY">Neurología</SelectItem>
                        <SelectItem value="PEDIATRICS">Pediatría</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="room">Habitación</Label>
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => handleInputChange('room', e.target.value)}
                      placeholder="Ej: 301-A"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="attendingPhysician">Médico Tratante *</Label>
                    <Select value={formData.attendingPhysician} onValueChange={(value) => handleInputChange('attendingPhysician', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar médico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr_garcia">Dr. García - Medicina Interna</SelectItem>
                        <SelectItem value="dr_lopez">Dr. López - Cardiología</SelectItem>
                        <SelectItem value="dr_martinez">Dr. Martínez - Urgencias</SelectItem>
                        <SelectItem value="dr_silva">Dr. Silva - Neurología</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="admissionDate">Fecha de Admisión *</Label>
                    <Input
                      id="admissionDate"
                      type="datetime-local"
                      value={formData.admissionDate}
                      onChange={(e) => handleInputChange('admissionDate', e.target.value)}
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
                    <Label htmlFor="mainDiagnosis">Diagnóstico Principal *</Label>
                    <Textarea
                      id="mainDiagnosis"
                      value={formData.mainDiagnosis}
                      onChange={(e) => handleInputChange('mainDiagnosis', e.target.value)}
                      placeholder="Diagnóstico principal de admisión"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryDiagnoses">Diagnósticos Secundarios</Label>
                    <Textarea
                      id="secondaryDiagnoses"
                      value={formData.secondaryDiagnoses}
                      onChange={(e) => handleInputChange('secondaryDiagnoses', e.target.value)}
                      placeholder="Diagnósticos adicionales o comorbilidades"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="allergies">Alergias</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="Alergias conocidas a medicamentos, alimentos, etc."
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="medications">Medicamentos Actuales</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => handleInputChange('medications', e.target.value)}
                      placeholder="Medicamentos que el paciente toma actualmente"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="medicalHistory">Historia Médica Relevante</Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
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
                    <Label htmlFor="emergencyContact">Contacto de Emergencia *</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Nombre del contacto de emergencia"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyPhone">Teléfono de Emergencia *</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="insurance">Seguro Médico</Label>
                    <Select value={formData.insurance} onValueChange={(value) => handleInputChange('insurance', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar seguro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eps_sanitas">EPS Sanitas</SelectItem>
                        <SelectItem value="eps_sura">EPS Sura</SelectItem>
                        <SelectItem value="eps_compensar">EPS Compensar</SelectItem>
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
                      onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                      placeholder="Número de póliza o afiliación"
                    />
                  </div>
                </div>

                {/* Resumen */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de la Admisión</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Paciente:</strong> {formData.patientName || 'Sin especificar'}</div>
                    <div><strong>Tipo:</strong> {formData.admissionType || 'Sin especificar'}</div>
                    <div><strong>Departamento:</strong> {formData.department || 'Sin especificar'}</div>
                    <div><strong>Prioridad:</strong> 
                      {formData.priority && (
                        <Badge variant={
                          formData.priority === 'CRITICAL' ? 'destructive' :
                          formData.priority === 'HIGH' ? 'default' : 'secondary'
                        } className="ml-2">
                          {formData.priority}
                        </Badge>
                      )}
                    </div>
                    <div><strong>Médico:</strong> {formData.attendingPhysician || 'Sin asignar'}</div>
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
              <Button onClick={handleNext}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Crear Admisión
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
