import { useForm } from '@/context/FormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, FileText, User, Activity, Upload, CheckCheck } from 'lucide-react';
import { calculateFormCompletionPercentage } from '@/lib/persistence';
import PatientIdentificationModal from '@/components/modals/PatientIdentificationModal';
import ReferralDiagnosisModal from '@/components/modals/ReferralDiagnosisModal';
import VitalSignsModal from '@/components/modals/VitalSignsModal';
import DocumentsModal from '@/components/modals/DocumentsModal';
import ValidationModal from '@/components/modals/ValidationModal';

const steps = [
  {
    id: 1,
    title: 'Datos del Paciente',
    description: 'Identificación y afiliación EPS',
    icon: User,
  },
  {
    id: 2,
    title: 'Remisión y Diagnóstico',
    description: 'Motivo y diagnóstico médico',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Signos Vitales',
    description: 'Estado clínico actual',
    icon: Activity,
  },
  {
    id: 4,
    title: 'Documentos de Soporte',
    description: 'Archivos y observaciones',
    icon: Upload,
  },
  {
    id: 5,
    title: 'Validación Final',
    description: 'Confirmación y envío',
    icon: CheckCheck,
  },
];

export default function EPSFormWizard() {
  const { formData, goToStep } = useForm();
  const completionPercentage = calculateFormCompletionPercentage(formData);

  const getStepStatus = (stepId: number) => {
    if (stepId < formData.currentStep) return 'completed';
    if (stepId === formData.currentStep) return 'current';
    return 'upcoming';
  };

  const renderCurrentModal = () => {
    switch (formData.currentStep) {
      case 1:
        return <PatientIdentificationModal />;
      case 2:
        return <ReferralDiagnosisModal />;
      case 3:
        return <VitalSignsModal />;
      case 4:
        return <DocumentsModal />;
      case 5:
        return <ValidationModal />;
      default:
        return <PatientIdentificationModal />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <Card className="bg-white/80 backdrop-blur-sm border-medical-blue/20 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const IconComponent = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div 
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => goToStep(step.id)}
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-200
                      ${status === 'completed' 
                        ? 'bg-success text-white' 
                        : status === 'current' 
                          ? 'bg-primary text-white ring-4 ring-primary/20' 
                          : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                      }
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`
                        text-sm font-medium
                        ${status === 'current' ? 'text-primary' : 'text-foreground'}
                      `}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4 mt-6 transition-colors duration-200
                      ${step.id < formData.currentStep ? 'bg-success' : 'bg-border'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress Badge and Bar */}
          <div className="flex flex-col items-center mt-6 space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white/50">
                Paso {formData.currentStep} de {steps.length}
              </Badge>
              <Badge variant="outline" className="bg-white/50">
                {completionPercentage}% Completado
              </Badge>
            </div>
            <div className="w-full max-w-md">
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Modal */}
      <div className="w-full transform transition-all duration-500 ease-in-out">
        {renderCurrentModal()}
      </div>
    </div>
  );
}
