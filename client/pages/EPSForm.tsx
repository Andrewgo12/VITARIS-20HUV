import { FormProvider } from "@/context/FormContext";
import EPSFormWizard from "@/components/EPSFormWizard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EPSForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <FormProvider>
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Portal EPS - Formulario de Remisión
              </h1>
              <p className="text-sm text-slate-600">
                Sistema de remisión al Hospital Universitario del Valle
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Form Wizard */}
            <EPSFormWizard />

            <div className="text-xs text-muted-foreground mt-8 text-center">
              <p>
                © 2024 Sistema de Remisión EPS - Hospital Universitario del
                Valle
              </p>
              <p>
                Desarrollado conforme a los estándares de seguridad en salud
                digital
              </p>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
