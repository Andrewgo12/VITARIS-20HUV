import { FormProvider } from "@/context/FormContext";
import EPSFormWizard from "@/components/EPSFormWizard";
import EmergencyFloatingButton from "@/components/EmergencyFloatingButton";
import MainNavigation from "@/components/MainNavigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Heart, 
  Activity, 
  Shield, 
  CheckCircle, 
  Star, 
  Sparkles,
  Stethoscope,
  MonitorSpeaker 
} from "lucide-react";

export default function Index() {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-red-200 opacity-20">
          <Heart className="w-16 h-16" />
        </div>
        <div className="absolute top-40 right-20 text-emerald-200 opacity-20">
          <Activity className="w-12 h-12" />
        </div>
        <div className="absolute bottom-40 left-20 text-blue-200 opacity-20">
          <Stethoscope className="w-14 h-14" />
        </div>
        <div className="absolute bottom-20 right-40 text-purple-200 opacity-20">
          <Shield className="w-10 h-10" />
        </div>

        {/* Subtle gradient overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

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
          backgroundImage: `linear-gradient(rgba(239,68,68,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      
      <FormProvider>
        <div className="container mx-auto px-4 py-4 relative z-10">
          {/* Enhanced Navigation */}
          <div className="mb-6 flex justify-end">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/50">
              <MainNavigation 
                userName="Usuario EPS"
                userRole={t('medical.eps')}
                showUserMenu={true}
              />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header with Vital Red Branding */}
            <div className="text-center mb-6">
              {/* Vital Red Hero Section */}
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-0 max-w-4xl mx-auto mb-6 relative overflow-hidden">
                {/* Enhanced Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                  <Sparkles className="w-full h-full text-red-500" />
                </div>
                <div className="absolute bottom-0 left-0 w-20 h-20 opacity-10">
                  <MonitorSpeaker className="w-full h-full text-emerald-500" />
                </div>
                
                <div className="flex items-center justify-center gap-6 mb-4">
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
                    <div className="flex items-center justify-center gap-4 mb-3">
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
                        <h1 className="text-4xl font-black text-black tracking-tight leading-none">
                          VITAL
                          <span className="text-red-500 font-light"> RED</span>
                        </h1>
                        <p className="text-black text-base font-medium">{t('medical.referral')}</p>
                      </div>
                    </div>

                    <p className="text-black text-base mb-4 max-w-2xl mx-auto leading-relaxed">
                      Conectamos EPS y Hospital Universitario del Valle con tecnología médica avanzada
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-2 bg-emerald-500 px-3 py-2 rounded-full border-2 border-emerald-600 shadow-md">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        <span className="font-semibold text-white text-sm">
                          Sistema Activo
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-blue-500 px-3 py-2 rounded-full border-2 border-blue-600 shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="bg-red-500 rounded-xl p-4 max-w-2xl mx-auto shadow-lg text-white relative overflow-hidden">
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-base font-semibold">
  {t('medical.completeSteps')}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Form Wizard */}
            <EPSFormWizard />

            {/* System Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <button
                onClick={() => window.location.href = '/medical-dashboard-new'}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-5 h-5" />
                {t('dashboard.title')}
              </button>
              <button
                onClick={() => window.location.href = '/medical/active-patients'}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <MonitorSpeaker className="w-5 h-5" />
                {t('patients.title')}
              </button>
              <button
                onClick={() => window.location.href = '/system-test'}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {language === 'es' ? 'Prueba del Sistema' : 'System Test'}
              </button>
            </div>

            {/* Enhanced Footer */}
            <div className="text-xs text-black mt-6 text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <p>
                © 2024 Vital Red - Sistema de Remisión EPS - Hospital Universitario del Valle
              </p>
              <p>
                Desarrollado conforme a los estándares de seguridad en salud digital
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
