import { useForm } from "@/context/FormContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  FileText,
  User,
  Activity,
  Upload,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { calculateFormCompletionPercentage } from "@/lib/persistence";
import PatientIdentificationModal from "@/components/modals/PatientIdentificationModal";
import ReferralDiagnosisModal from "@/components/modals/ReferralDiagnosisModal";
import VitalSignsModal from "@/components/modals/VitalSignsModal";
import DocumentsModal from "@/components/modals/DocumentsModal";
import ValidationModal from "@/components/modals/ValidationModal";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
  {
    id: 1,
    titleKey: "step.patientData",
    descriptionKey: "step.patientDataDesc",
    icon: User,
  },
  {
    id: 2,
    titleKey: "step.referralDiagnosis",
    descriptionKey: "step.referralDiagnosisDesc",
    icon: FileText,
  },
  {
    id: 3,
    titleKey: "step.vitalSigns",
    descriptionKey: "step.vitalSignsDesc",
    icon: Activity,
  },
  {
    id: 4,
    titleKey: "step.documents",
    descriptionKey: "step.documentsDesc",
    icon: Upload,
  },
  {
    id: 5,
    titleKey: "step.validation",
    descriptionKey: "step.validationDesc",
    icon: CheckCheck,
  },
];

export default function EPSFormWizard() {
  const { t } = useLanguage();
  const { formData, goToStep } = useForm();
  const completionPercentage = calculateFormCompletionPercentage(formData);

  const getStepStatus = (stepId: number) => {
    if (stepId < formData.currentStep) return "completed";
    if (stepId === formData.currentStep) return "current";
    return "upcoming";
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
    <div className="space-y-4">
      {/* Compact Step Indicator */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-2xl overflow-hidden relative">
        {/* Decorative Background Elements - Static */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
          <Sparkles className="w-full h-full text-red-500" />
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-12 opacity-5">
          <Activity className="w-full h-full text-emerald-500" />
        </div>
        
        <CardContent className="p-4 relative z-10">
          {/* Compact Title Section */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-black mb-1">
              {t('medical.formWizard')}
            </h2>
            <p className="text-sm text-black/70">
              {t('medical.completeSteps')}
            </p>
          </div>

          {/* Compact Steps */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const IconComponent = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className="flex flex-col items-center cursor-pointer group transition-all duration-200 hover:scale-105"
                    onClick={() => goToStep(step.id)}
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow border-2 transition-all duration-200
                      ${
                        status === "completed"
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-200"
                          : status === "current"
                            ? "bg-red-500 text-white ring-2 ring-red-100 border-red-400 shadow-red-200"
                            : "bg-gray-100 text-gray-400 border-gray-200 shadow-gray-100"
                      }
                    `}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 drop-shadow-sm" />
                      ) : (
                        <IconComponent className="w-5 h-5 drop-shadow-sm" />
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p
                        className={`
                        text-xs font-bold transition-colors duration-200
                        ${
                          status === "completed"
                            ? "text-emerald-600"
                            : status === "current"
                              ? "text-red-600"
                              : "text-gray-600"
                        }
                      `}
                      >
                        {t(step.titleKey)}
                      </p>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        {t(step.descriptionKey)}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`
                      w-12 h-1 mx-3 mt-5 rounded-full transition-all duration-300
                      ${step.id < formData.currentStep ? "bg-emerald-500" : "bg-gray-200"}
                    `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Compact Progress Section */}
          <div className="flex items-center justify-center gap-4">
            <Badge
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-red-200 text-red-600 font-bold px-3 py-1 rounded-full shadow-sm text-xs"
            >
              {t('step.current', { current: formData.currentStep, total: steps.length })}
            </Badge>
            
            <div className="w-32 relative">
              <Progress 
                value={completionPercentage} 
                className="h-2 rounded-full overflow-hidden bg-gray-200"
              />
            </div>
            
            <Badge
              variant={completionPercentage === 100 ? "default" : "secondary"}
              className={`
                backdrop-blur-sm px-3 py-1 rounded-full shadow-sm font-bold text-xs
                ${completionPercentage === 100 
                  ? "bg-emerald-500 text-white border-emerald-400" 
                  : "bg-white/90 border-gray-200 text-gray-600"
                }
              `}
            >
              {t('step.complete', { percentage: completionPercentage })}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Modal with Simple Transition */}
      <div className="w-full transition-all duration-300 ease-in-out">
        {renderCurrentModal()}
      </div>
    </div>
  );
}
