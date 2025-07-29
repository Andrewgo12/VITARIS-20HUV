import { FormProvider } from "@/context/FormContext";
import EPSFormWizard from "@/components/EPSFormWizard";
import EmergencyFloatingButton from "@/components/EmergencyFloatingButton";
import MainNavigation from "@/components/MainNavigation";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: 360,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  tap: { scale: 0.9 },
};

export default function Index() {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-100 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating medical icons */}
        <motion.div 
          className="absolute top-20 left-10 text-red-200 opacity-30"
          variants={floatingVariants}
          animate="float"
        >
          <Heart className="w-16 h-16" />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 text-emerald-200 opacity-30"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1 }}
        >
          <Activity className="w-12 h-12" />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 text-blue-200 opacity-30"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 2 }}
        >
          <Stethoscope className="w-14 h-14" />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-40 text-purple-200 opacity-30"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 3 }}
        >
          <Shield className="w-10 h-10" />
        </motion.div>

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
          <motion.div 
            className="mb-6 flex justify-end"
            variants={sectionVariants}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/50">
              <MainNavigation 
                userName="Usuario EPS"
                userRole={t('medical.eps')}
                showUserMenu={true}
              />
            </div>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header with Vital Red Branding */}
            <motion.div 
              className="text-center mb-8"
              variants={sectionVariants}
            >
              {/* Vital Red Hero Section */}
              <motion.div 
                className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-0 max-w-4xl mx-auto mb-8 relative overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Enhanced Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-full h-full text-red-500" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  >
                    <MonitorSpeaker className="w-full h-full text-emerald-500" />
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex items-center justify-center gap-8 mb-6"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.2 }
                    }
                  }}
                >
                  {/* EPS Icon */}
                  <motion.div 
                    className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-xl"
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg
                      className="w-10 h-10 text-white drop-shadow-sm"
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
                  </motion.div>

                  {/* Vital Red Central Branding */}
                  <motion.div 
                    className="text-center"
                    variants={sectionVariants}
                  >
                    <motion.div 
                      className="flex items-center justify-center gap-4 mb-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg"
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <svg
                          className="w-8 h-8 text-white"
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
                      </motion.div>
                      <div>
                        <motion.h1 
                          className="text-5xl font-black text-black tracking-tight leading-none"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        >
                          VITAL
                          <span className="text-red-500 font-light"> RED</span>
                        </motion.h1>
                        <motion.p 
                          className="text-black text-lg font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          Sistema de Remisión EPS
                        </motion.p>
                      </div>
                    </motion.div>

                    <motion.p 
                      className="text-black text-lg mb-6 max-w-2xl mx-auto leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      Conectamos EPS y Hospital Universitario del Valle con tecnología médica avanzada
                    </motion.p>

                    <motion.div 
                      className="flex items-center justify-center gap-4"
                      variants={{
                        visible: {
                          transition: { staggerChildren: 0.1 }
                        }
                      }}
                    >
                      <motion.div 
                        className="flex items-center gap-2 bg-emerald-500 px-4 py-2 rounded-full border-2 border-emerald-600 shadow-lg"
                        variants={sectionVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span 
                          className="w-3 h-3 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="font-semibold text-white text-sm">
                          Sistema Activo
                        </span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-full border-2 border-blue-600 shadow-lg"
                        variants={sectionVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </motion.div>
                        <span className="font-semibold text-white text-sm">
                          Certificado SSL
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* HUV Icon */}
                  <motion.div 
                    className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl"
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg
                      className="w-10 h-10 text-white drop-shadow-sm"
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
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Call to Action */}
              <motion.div 
                className="bg-red-500 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl text-white relative overflow-hidden"
                variants={sectionVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background pattern */}
                <motion.div 
                  className="absolute inset-0 opacity-10"
                  animate={{ x: [-100, 100, -100] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"></div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center gap-3 relative z-10"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <motion.p 
                    className="text-lg font-semibold"
                    variants={sectionVariants}
                  >
                    Complete el formulario paso a paso para generar su remisión médica
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Form Wizard */}
            <motion.div variants={sectionVariants}>
              <EPSFormWizard />
            </motion.div>

            {/* Enhanced Footer */}
            <motion.div 
              className="text-xs text-black mt-8 text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              variants={sectionVariants}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                © 2024 Vital Red - Sistema de Remisión EPS - Hospital Universitario del Valle
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                Desarrollado conforme a los estándares de seguridad en salud digital
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Emergency Floating Button */}
        <EmergencyFloatingButton />
      </FormProvider>
    </motion.div>
  );
}
