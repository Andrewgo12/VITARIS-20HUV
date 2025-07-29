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
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Datos del Paciente",
    description: "Identificación y afiliación EPS",
    icon: User,
  },
  {
    id: 2,
    title: "Remisión y Diagnóstico",
    description: "Motivo y diagnóstico médico",
    icon: FileText,
  },
  {
    id: 3,
    title: "Signos Vitales",
    description: "Estado clínico actual",
    icon: Activity,
  },
  {
    id: 4,
    title: "Documentos de Soporte",
    description: "Archivos y observaciones",
    icon: Upload,
  },
  {
    id: 5,
    title: "Validación Final",
    description: "Confirmación y envío",
    icon: CheckCheck,
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeInOut" }
  },
  tap: { scale: 0.95 }
};

const progressVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
  },
};

const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut",
      type: "spring",
      bounce: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export default function EPSFormWizard() {
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
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Step Indicator with Floating Elements */}
      <motion.div variants={stepVariants}>
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden relative">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <Sparkles className="w-full h-full text-red-500" />
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5">
            <Activity className="w-full h-full text-emerald-500" />
          </div>
          
          <CardContent className="p-8 relative z-10">
            {/* Title Section */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-black mb-2">
                Formulario de Remisión Médica
              </h2>
              <p className="text-black/70">
                Complete los siguientes pasos para enviar la remisión
              </p>
            </motion.div>

            {/* Enhanced Steps */}
            <motion.div 
              className="flex items-center justify-between"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                }
              }}
            >
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const IconComponent = step.icon;

                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => goToStep(step.id)}
                      variants={stepVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <motion.div
                        className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center mb-3 
                        shadow-lg border-2 relative overflow-hidden
                        ${
                          status === "completed"
                            ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-200"
                            : status === "current"
                              ? "bg-red-500 text-white ring-4 ring-red-100 border-red-400 shadow-red-200"
                              : "bg-gray-100 text-gray-400 border-gray-200 shadow-gray-100"
                        }
                      `}
                        whileHover={{
                          boxShadow: status === "completed" 
                            ? "0 10px 25px rgba(16, 185, 129, 0.4)"
                            : status === "current"
                              ? "0 10px 25px rgba(239, 68, 68, 0.4)"
                              : "0 10px 25px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        {/* Subtle glow effect */}
                        <div className={`
                          absolute inset-0 rounded-2xl opacity-30
                          ${status === "completed" ? "bg-emerald-300" : 
                            status === "current" ? "bg-red-300" : "bg-gray-200"}
                        `} />
                        
                        <motion.div
                          initial={false}
                          animate={{ 
                            rotate: status === "completed" ? 360 : 0,
                            scale: status === "current" ? 1.1 : 1
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="relative z-10"
                        >
                          {status === "completed" ? (
                            <CheckCircle2 className="w-7 h-7 drop-shadow-sm" />
                          ) : (
                            <IconComponent className="w-7 h-7 drop-shadow-sm" />
                          )}
                        </motion.div>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p
                          className={`
                          text-sm font-bold mb-1 transition-colors duration-200
                          ${
                            status === "completed"
                              ? "text-emerald-600"
                              : status === "current"
                                ? "text-red-600"
                                : "text-gray-600"
                          }
                        `}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 hidden sm:block">
                          {step.description}
                        </p>
                      </motion.div>
                    </motion.div>

                    {index < steps.length - 1 && (
                      <motion.div
                        className={`
                        w-16 h-2 mx-6 mt-8 rounded-full relative overflow-hidden
                        ${step.id < formData.currentStep ? "bg-emerald-500" : "bg-gray-200"}
                      `}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.1 * index,
                          ease: "easeOut" 
                        }}
                      >
                        {step.id < formData.currentStep && (
                          <motion.div
                            className="absolute inset-0 bg-emerald-400 rounded-full"
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ 
                              duration: 0.8, 
                              delay: 0.5 + (0.1 * index),
                              ease: "easeOut" 
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </motion.div>

            {/* Enhanced Progress Section */}
            <motion.div 
              className="flex items-center justify-center mt-8 gap-8"
              variants={progressVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm border-red-200 text-red-600 font-bold px-4 py-2 rounded-full shadow-lg"
                >
                  Paso {formData.currentStep} de {steps.length}
                </Badge>
              </motion.div>
              
              <div className="w-48 relative">
                <Progress 
                  value={completionPercentage} 
                  className="h-3 rounded-full overflow-hidden bg-gray-200"
                />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={completionPercentage === 100 ? "default" : "secondary"}
                  className={`
                    backdrop-blur-sm px-4 py-2 rounded-full shadow-lg font-bold
                    ${completionPercentage === 100 
                      ? "bg-emerald-500 text-white border-emerald-400" 
                      : "bg-white/90 border-gray-200 text-gray-600"
                    }
                  `}
                >
                  {completionPercentage}% Completo
                </Badge>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Current Step Modal with Smooth Transitions */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={formData.currentStep}
          className="w-full"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {renderCurrentModal()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
