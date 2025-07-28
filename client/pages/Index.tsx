import { FormProvider } from '@/context/FormContext';
import EPSFormWizard from '@/components/EPSFormWizard';
import EmergencyFloatingButton from '@/components/EmergencyFloatingButton';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Professional medical background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm10-20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(0,112,240,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,112,240,0.1) 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }} />
      <FormProvider>
        <div className="container mx-auto px-4 py-4 relative z-10">
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

              {/* Info Message */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 max-w-2xl mx-auto">
                <p className="text-sm text-primary font-medium">
                  📋 Complete todos los campos para procesar la remisión médica
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
