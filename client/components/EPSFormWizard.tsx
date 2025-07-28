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
                      w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 shadow-lg border-2
                      ${status === 'completed'
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 border-emerald-400/50'
                        : status === 'current'
                          ? 'bg-gradient-to-br from-primary to-blue-600 text-white ring-4 ring-primary/20 shadow-primary/30 border-primary/50 scale-110'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500 border-slate-200'
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
                        text-sm font-bold transition-colors duration-200
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
          
          {/* Compact Progress */}
          <div className="flex items-center justify-center mt-4 gap-4">
            <Badge variant="outline" className="bg-white/50 text-xs">
              {formData.currentStep}/{steps.length}
            </Badge>
            <div className="w-32">
              <Progress value={completionPercentage} className="h-1.5" />
            </div>
            <Badge variant="outline" className="bg-white/50 text-xs">
              {completionPercentage}%
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
