import { FormProvider } from "@/context/FormContext";
import EPSFormWizard from "@/components/EPSFormWizard";
import EmergencyFloatingButton from "@/components/EmergencyFloatingButton";
import MainNavigation from "@/components/MainNavigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Professional medical background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm10-20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,112,240,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,112,240,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      <FormProvider>
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header with Vital Red Branding */}
            <div className="text-center mb-8">
              {/* Vital Red Hero Section */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-8 mb-6">
                  {/* EPS Icon */}
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
                    <svg
                      className="w-8 h-8 text-white drop-shadow-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  {/* Vital Red Central Branding */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-7 h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h1 className="text-5xl font-black text-black tracking-tight leading-none">
                          VITAL
                          <span className="text-red-500 font-light"> RED</span>
                        </h1>
                        <p className="text-black text-lg font-medium">Sistema de Remisión EPS</p>
                      </div>
                    </div>

                    <p className="text-black text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                      Conectamos EPS y Hospital Universitario del Valle con tecnología médica avanzada
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="font-semibold text-white text-sm">
                          Sistema Activo
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-semibold text-white text-sm">
                          Certificado SSL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* HUV Icon */}
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg
                      className="w-8 h-8 text-white drop-shadow-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-red-500 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl text-white">
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-semibold">
                    Complete el formulario paso a paso para generar su remisión médica
                  </p>
                </div>
              </div>
            </div>

            {/* Form Wizard */}
            <EPSFormWizard />

            <div className="text-xs text-muted-foreground mt-8 text-center">
              <p>
                © 2024 Vital Red - Sistema de Remisión EPS - Hospital Universitario del
                Valle
              </p>
              <p>
                Desarrollado conforme a los estándares de seguridad en salud
                digital
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Floating Button */}
        <EmergencyFloatingButton />
      </FormProvider>
    </div>
  );
}
