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
    <div className="space-y-6">
      {/* Professional Step Indicator */}
      <Card className="bg-white/95 backdrop-blur-md border-primary/10 transition-all duration-300 shadow-2xl">
        <CardContent className="p-4">
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
                      w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow border-2
                      ${status === 'completed'
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : status === 'current'
                          ? 'bg-primary text-white ring-2 ring-primary/20 border-primary'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 drop-shadow-sm" />
                      ) : (
                        <IconComponent className="w-6 h-6 drop-shadow-sm" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`
                        text-sm font-bold
                        ${status === 'completed'
                          ? 'text-emerald-600'
                          : status === 'current'
                            ? 'text-primary'
                            : 'text-slate-600'}
                      `}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-1 mx-4 mt-6 rounded-full transition-all duration-300 shadow-sm
                      ${step.id < formData.currentStep
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        : 'bg-slate-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Professional Progress */}
          <div className="flex items-center justify-center mt-6 gap-6">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-primary/20 text-primary font-bold">
              Paso {formData.currentStep} de {steps.length}
            </Badge>
            <div className="w-40">
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <Badge variant={completionPercentage === 100 ? "success" : "secondary"} className="bg-white/80 backdrop-blur-sm">
              {completionPercentage}% Completo
            </Badge>
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
