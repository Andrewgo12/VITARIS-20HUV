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
              {/* Logo and Title Section */}
              <div className="flex items-center justify-center gap-6 mb-6">
                {/* EPS Logo Placeholder */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-medical-blue rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <div className="w-px h-12 bg-border"></div>

                {/* Hospital Logo Placeholder */}
                <div className="w-16 h-16 bg-gradient-to-br from-medical-green to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-medical-blue bg-clip-text text-transparent">
                  Sistema de Remisión EPS
                </h1>
                <h2 className="text-xl font-semibold text-foreground">
                  Hospital Universitario del Valle
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  <span className="text-sm text-muted-foreground font-medium">FORMULARIO DE INGRESO</span>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-lg p-4 max-w-3xl mx-auto border border-medical-blue/20">
                <p className="text-muted-foreground leading-relaxed">
                  Complete toda la información del paciente para realizar la remisión médica al HUV.
                  Este formulario digital agiliza el proceso de ingreso y garantiza que toda la información
                  relevante llegue inmediatamente al hospital.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Los campos marcados con asterisco (<span className="text-destructive">*</span>) son obligatorios.
                </p>
              </div>
            </div>

            {/* Form Wizard */}
            <EPSFormWizard />
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
