import { FormProvider } from '@/context/FormContext';
import EPSFormWizard from '@/components/EPSFormWizard';
import EmergencyFloatingButton from '@/components/EmergencyFloatingButton';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-secondary">
      <FormProvider>
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            {/* Compact Header */}
            <div className="text-center mb-6">
              {/* Compact Logo and Title */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-medical-blue rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <div className="text-left">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-medical-blue bg-clip-text text-transparent">
                    Remisión EPS → HUV
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="font-medium">Sistema Digital de Remisión</span>
                  </div>
                </div>

                <div className="w-10 h-10 bg-gradient-to-br from-medical-green to-accent rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>

              {/* Priority Warning */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 max-w-2xl mx-auto">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Todos los campos son obligatorios. Solo pacientes de alta prioridad son aceptados en HUV.
                </p>
              </div>
            </div>

            {/* Form Wizard */}
            <EPSFormWizard />

            <div className="text-xs text-muted-foreground mt-8 text-center">
              <p>© 2024 Sistema de Remisión EPS - Hospital Universitario del Valle</p>
              <p>Desarrollado conforme a los estándares de seguridad en salud digital</p>
            </div>
          </div>
        </div>

        {/* Emergency Floating Button */}
        <EmergencyFloatingButton />
      </FormProvider>
    </div>
  );
}
