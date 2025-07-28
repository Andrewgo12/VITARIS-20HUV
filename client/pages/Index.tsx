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
              {/* Professional Logo and Title */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary via-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                  <svg className="w-7 h-7 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <div className="text-center">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-primary to-blue-600 bg-clip-text text-transparent mb-2">
                    Sistema de Remisión EPS
                  </h1>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      <span className="font-semibold text-primary">Digital & Seguro</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300"></div>
                    <span className="font-medium text-slate-600">Hospital Universitario del Valle</span>
                  </div>
                </div>

                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                  <svg className="w-7 h-7 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>

              {/* Professional Info Message */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-4 max-w-2xl mx-auto shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 font-semibold flex-1">
                    Complete todos los campos para procesar la remisión médica al HUV
                  </p>
                </div>
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
