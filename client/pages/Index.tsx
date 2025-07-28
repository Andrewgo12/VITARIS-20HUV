import { FormProvider } from '@/context/FormContext';
import EPSFormWizard from '@/components/EPSFormWizard';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-secondary">
      <FormProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-primary">Sistema EPS</h1>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Formulario de Ingreso - Hospital Universitario del Valle
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete toda la información del paciente para realizar la remisión al HUV. 
                Todos los campos marcados con asterisco (*) son obligatorios.
              </p>
            </div>

            {/* Form Wizard */}
            <EPSFormWizard />
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
