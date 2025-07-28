import { useForm } from '@/context/FormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Stethoscope, AlertTriangle, History, Calendar } from 'lucide-react';
import { useState } from 'react';

const referralServices = [
  { value: 'URGENCIAS', label: 'Urgencias' },
  { value: 'CONSULTA_EXTERNA', label: 'Consulta Externa' },
  { value: 'HOSPITALIZACION', label: 'Hospitalización' },
];

const medicalSpecialties = [
  { value: 'MEDICINA_INTERNA', label: 'Medicina Interna' },
  { value: 'GINECOLOGIA', label: 'Ginecología' },
  { value: 'PEDIATRIA', label: 'Pediatría' },
  { value: 'CARDIOLOGIA', label: 'Cardiología' },
  { value: 'NEUROLOGIA', label: 'Neurología' },
  { value: 'ORTOPEDIA', label: 'Ortopedia' },
  { value: 'DERMATOLOGIA', label: 'Dermatología' },
  { value: 'PSIQUIATRIA', label: 'Psiquiatría' },
  { value: 'CIRUGIA_GENERAL', label: 'Cirugía General' },
  { value: 'OTRO', label: 'Otro' },
];

const personalHistoryOptions = [
  { value: 'HTA', label: 'Hipertensión Arterial' },
  { value: 'DIABETES', label: 'Diabetes Mellitus' },
  { value: 'CARDIOPATIA', label: 'Cardiopatía' },
  { value: 'ASMA', label: 'Asma' },
  { value: 'EPOC', label: 'EPOC' },
  { value: 'CANCER', label: 'Cáncer' },
  { value: 'CIRUGIAS', label: 'Cirugías Previas' },
  { value: 'ALERGIAS', label: 'Alergias' },
  { value: 'OTROS', label: 'Otros' },
];

// Mock CIE10 codes for demonstration
const cie10Options = [
  { value: 'K59.1', label: 'K59.1 - Diarrea funcional' },
  { value: 'J44.1', label: 'J44.1 - EPOC con exacerbación aguda' },
  { value: 'I10', label: 'I10 - Hipertensión esencial (primaria)' },
  { value: 'E11.9', label: 'E11.9 - Diabetes mellitus tipo 2 sin complicaciones' },
  { value: 'J06.9', label: 'J06.9 - Infección aguda de las vías respiratorias superiores' },
  { value: 'K29.7', label: 'K29.7 - Gastritis' },
  { value: 'M79.3', label: 'M79.3 - Paniculitis' },
  { value: 'R50.9', label: 'R50.9 - Fiebre no especificada' },
];

export default function ReferralDiagnosisModal() {
  const { formData, dispatch, nextStep, prevStep } = useForm();
  const [selectedHistory, setSelectedHistory] = useState<string[]>(formData.referral.personalHistory || []);
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [filteredDiagnoses, setFilteredDiagnoses] = useState(cie10Options);

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_REFERRAL', payload: { [field]: value } });
  };

  const handleHistoryChange = (value: string, checked: boolean) => {
    let newHistory: string[];
    if (checked) {
      newHistory = [...selectedHistory, value];
    } else {
      newHistory = selectedHistory.filter(item => item !== value);
    }
    setSelectedHistory(newHistory);
    dispatch({ type: 'UPDATE_REFERRAL', payload: { personalHistory: newHistory } });
  };

  const handleDiagnosisSearch = (searchTerm: string) => {
    setDiagnosisSearch(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredDiagnoses(cie10Options);
    } else {
      const filtered = cie10Options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDiagnoses(filtered);
    }
  };

  const isValid = () => {
    const required = ['referralService', 'referralReason', 'primaryDiagnosis'];
    return required.every(field => {
      const value = formData.referral[field as keyof typeof formData.referral];
      return value && value.toString().trim() !== '';
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-medical-blue/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-medical-blue/10 to-primary/10 border-b">
        <CardTitle className="flex items-center gap-3 text-primary">
          <FileText className="w-6 h-6" />
          Paso 2: Motivo de Remisión y Diagnóstico
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Proporcione la razón médica de la remisión y diagnósticos asociados
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Referral Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Información de Remisión</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consultationDate">Fecha y Hora de Consulta</Label>
              <Input
                id="consultationDate"
                type="datetime-local"
                value={formData.referral.consultationDate}
                onChange={(e) => handleInputChange('consultationDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralService">Servicio al que se Remite *</Label>
              <Select 
                value={formData.referral.referralService} 
                onValueChange={(value) => handleInputChange('referralService', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {referralServices.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralReason">Motivo de Remisión *</Label>
            <Textarea
              id="referralReason"
              placeholder="Describa detalladamente el motivo de la remisión médica"
              value={formData.referral.referralReason}
              onChange={(e) => handleInputChange('referralReason', e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalSpecialty">Especialidad Médica Solicitada *</Label>
            <Select 
              value={formData.referral.medicalSpecialty} 
              onValueChange={(value) => handleInputChange('medicalSpecialty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar especialidad" />
              </SelectTrigger>
              <SelectContent>
                {medicalSpecialties.map((specialty) => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Diagnosis Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-medical-green" />
            <h3 className="text-lg font-semibold">Diagnósticos CIE10</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primaryDiagnosis">Diagnóstico Principal Sospechado *</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Buscar por código CIE10 o descripción..."
                  value={diagnosisSearch}
                  onChange={(e) => handleDiagnosisSearch(e.target.value)}
                />
                {diagnosisSearch && (
                  <div className="max-h-32 overflow-y-auto border rounded-md bg-background">
                    {filteredDiagnoses.map((diagnosis) => (
                      <div
                        key={diagnosis.value}
                        className="p-2 hover:bg-accent cursor-pointer text-sm"
                        onClick={() => {
                          handleInputChange('primaryDiagnosis', diagnosis.value);
                          setDiagnosisSearch(diagnosis.label);
                        }}
                      >
                        {diagnosis.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formData.referral.primaryDiagnosis && (
                <Badge variant="outline" className="mt-2">
                  Seleccionado: {formData.referral.primaryDiagnosis}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondaryDiagnosis1">Diagnóstico Secundario 1 *</Label>
                <Select 
                  value={formData.referral.secondaryDiagnosis1} 
                  onValueChange={(value) => handleInputChange('secondaryDiagnosis1', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar diagnóstico" />
                  </SelectTrigger>
                  <SelectContent>
                    {cie10Options.map((diagnosis) => (
                      <SelectItem key={diagnosis.value} value={diagnosis.value}>
                        {diagnosis.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryDiagnosis2">Diagnóstico Secundario 2 *</Label>
                <Select 
                  value={formData.referral.secondaryDiagnosis2} 
                  onValueChange={(value) => handleInputChange('secondaryDiagnosis2', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar diagnóstico" />
                  </SelectTrigger>
                  <SelectContent>
                    {cie10Options.map((diagnosis) => (
                      <SelectItem key={diagnosis.value} value={diagnosis.value}>
                        {diagnosis.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-medical-blue" />
            <h3 className="text-lg font-semibold">Historial Médico Previo</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Antecedentes Personales</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {personalHistoryOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={selectedHistory.includes(option.value)}
                      onCheckedChange={(checked) => handleHistoryChange(option.value, checked as boolean)}
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyHistory">Antecedentes Familiares</Label>
              <Textarea
                id="familyHistory"
                placeholder="Describa antecedentes familiares relevantes"
                value={formData.referral.familyHistory}
                onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias Conocidas</Label>
              <Textarea
                id="allergies"
                placeholder="Medicamentos, alimentos, sustancias, etc."
                value={formData.referral.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications">Medicamentos Actuales</Label>
              <Textarea
                id="currentMedications"
                placeholder="Liste medicamentos actuales con nombre, dosis y frecuencia"
                value={formData.referral.currentMedications}
                onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
          >
            Anterior: Datos del Paciente
          </Button>
          <Button
            onClick={nextStep}
            disabled={!isValid()}
            className="px-8"
          >
            Siguiente: Signos Vitales
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
