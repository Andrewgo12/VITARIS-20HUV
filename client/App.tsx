import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/context/LanguageContext";
import { MedicalDataProvider } from "@/context/MedicalDataContext";
import LanguageFloatingButton from "@/components/LanguageFloatingButton";
import LandingPage from "./pages/LandingPage";
import LandingPageNew from "./pages/LandingPageNew";
import Login from "./pages/Login";
import EPSForm from "./pages/EPSForm";
import HUVDashboard from "./pages/HUVDashboard";
import HUVDashboardImproved from "./pages/HUVDashboardImproved";
import MedicalDashboard from "./pages/MedicalDashboard";
import MedicalDashboardNew from "./pages/MedicalDashboardNew";
import MedicalDashboardImproved from "./pages/MedicalDashboardImproved";
import MedicalDashboardAdvanced from "./pages/medical/MedicalDashboardAdvanced";
import PatientHistorySystem from "./pages/medical/PatientHistorySystem";
import VitalSignsMonitoring from "./pages/medical/VitalSignsMonitoring";
import PrescriptionSystemAdvanced from "./pages/medical/PrescriptionSystemAdvanced";
import LabsImagingSystem from "./pages/medical/LabsImagingSystem";
import ICUEmergencySystem from "./pages/medical/ICUEmergencySystem";
import BedsManagement from "./pages/medical/BedsManagement";
import PatientTracking from "./pages/medical/PatientTracking";
import ClinicalReports from "./pages/medical/ClinicalReports";
import ActivePatients from "./pages/medical/ActivePatients";
import ActivePatientsImproved from "./pages/medical/ActivePatientsImproved";
import SystemIndex from "./pages/SystemIndex";
import HUVDashboardAdvanced from "./pages/HUVDashboardAdvanced";
import PatientDetailView from "./pages/PatientDetailView";
import MedicalTools from "./pages/MedicalTools";
// Modales Demo
import PatientIdentificationModalDemo from "./pages/demos/PatientIdentificationModalDemo";
import ReferralDiagnosisModalDemo from "./pages/demos/ReferralDiagnosisModalDemo";
import VitalSignsModalDemo from "./pages/demos/VitalSignsModalDemo";
import DocumentsModalDemo from "./pages/demos/DocumentsModalDemo";
import ValidationModalDemo from "./pages/demos/ValidationModalDemo";
// Diagramas de flujo
import FlowchartFrontend from "./pages/FlowchartFrontend";
import FlowchartBackend from "./pages/FlowchartBackend";
// Vistas médicas completas
import AdmissionsManagement from "./pages/medical/AdmissionsManagement";
import SurgeriesSchedule from "./pages/medical/SurgeriesSchedule";
import LabsImaging from "./pages/medical/LabsImaging";
import PharmacyManagement from "./pages/medical/PharmacyManagement";
import ConsultationsHub from "./pages/medical/ConsultationsHub";
import ICUMonitoring from "./pages/medical/ICUMonitoring";
import EmergencyProtocols from "./pages/medical/EmergencyProtocols";
import MedicalReports from "./pages/medical/MedicalReports";
import TeamCommunication from "./pages/medical/TeamCommunication";
import AppointmentsScheduler from "./pages/medical/AppointmentsScheduler";
import AppointmentsSchedulerImproved from "./pages/medical/AppointmentsSchedulerImproved";
import Telemedicine from "./pages/medical/Telemedicine";
import MedicalEducation from "./pages/medical/MedicalEducation";
import UserProfile from "./pages/UserProfile";
import SystemSettings from "./pages/SystemSettings";
import NotFound from "./pages/NotFound";
import SystemTest from "./pages/SystemTest";
import IndexImproved from "./pages/IndexImproved";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <MedicalDataProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing-new" element={<LandingPageNew />} />
                <Route path="/login" element={<Login />} />
                <Route path="/eps-form" element={<EPSForm />} />
                <Route path="/huv-dashboard" element={<HUVDashboard />} />
                <Route path="/huv-dashboard-improved" element={<HUVDashboardImproved />} />
                <Route
                  path="/medical-dashboard"
                  element={<MedicalDashboardImproved />}
                />
                <Route
                  path="/medical-dashboard-original"
                  element={<MedicalDashboard />}
                />
                <Route
                  path="/medical-dashboard-new"
                  element={<MedicalDashboardNew />}
                />
                <Route
                  path="/medical-dashboard-improved"
                  element={<MedicalDashboardImproved />}
                />

                {/* Vistas médicas especializadas */}
                <Route
                  path="/medical/beds-management"
                  element={<BedsManagement />}
                />
                <Route
                  path="/medical/patient-tracking"
                  element={<PatientTracking />}
                />
                <Route
                  path="/medical/clinical-reports"
                  element={<ClinicalReports />}
                />
                <Route
                  path="/medical/active-patients"
                  element={<ActivePatientsImproved />}
                />
                <Route
                  path="/medical/active-patients-original"
                  element={<ActivePatients />}
                />

                {/* Sistema de navegación y vistas médicas avanzadas */}
                <Route path="/system" element={<SystemIndex />} />
                <Route
                  path="/huv-dashboard-advanced"
                  element={<HUVDashboardAdvanced />}
                />
                <Route path="/patient/:id" element={<PatientDetailView />} />
                <Route path="/medical-tools" element={<MedicalTools />} />

                {/* Modales Demo - Rutas individuales para testing */}
                <Route
                  path="/demo/patient-identification"
                  element={<PatientIdentificationModalDemo />}
                />
                <Route
                  path="/demo/referral-diagnosis"
                  element={<ReferralDiagnosisModalDemo />}
                />
                <Route
                  path="/demo/vital-signs"
                  element={<VitalSignsModalDemo />}
                />
                <Route
                  path="/demo/documents"
                  element={<DocumentsModalDemo />}
                />
                <Route
                  path="/demo/validation"
                  element={<ValidationModalDemo />}
                />

                {/* Diagramas de flujo del sistema */}
                <Route
                  path="/flowchart/frontend"
                  element={<FlowchartFrontend />}
                />
                <Route
                  path="/flowchart/backend"
                  element={<FlowchartBackend />}
                />

                {/* Sistema médico completo - Todas las vistas médicas */}
                <Route
                  path="/medical/admissions"
                  element={<AdmissionsManagement />}
                />
                <Route
                  path="/medical/surgeries"
                  element={<SurgeriesSchedule />}
                />
                <Route path="/medical/labs-imaging" element={<LabsImaging />} />
                <Route
                  path="/medical/pharmacy"
                  element={<PharmacyManagement />}
                />
                <Route
                  path="/medical/consultations"
                  element={<ConsultationsHub />}
                />
                <Route
                  path="/medical/icu-monitoring"
                  element={<ICUMonitoring />}
                />
                <Route
                  path="/medical/emergency-protocols"
                  element={<EmergencyProtocols />}
                />
                <Route path="/medical/reports" element={<MedicalReports />} />
                <Route
                  path="/medical/team-communication"
                  element={<TeamCommunication />}
                />
                <Route
                  path="/medical/appointments"
                  element={<AppointmentsSchedulerImproved />}
                />
                <Route
                  path="/medical/appointments-original"
                  element={<AppointmentsScheduler />}
                />
                <Route
                  path="/medical/telemedicine"
                  element={<Telemedicine />}
                />
                <Route
                  path="/medical/education"
                  element={<MedicalEducation />}
                />

                {/* Advanced Medical Systems */}
                <Route
                  path="/medical/dashboard-advanced"
                  element={<MedicalDashboardAdvanced />}
                />
                <Route
                  path="/medical/patient-history"
                  element={<PatientHistorySystem />}
                />
                <Route
                  path="/medical/vital-signs-monitoring"
                  element={<VitalSignsMonitoring />}
                />
                <Route
                  path="/medical/prescriptions"
                  element={<PrescriptionSystemAdvanced />}
                />
                <Route
                  path="/medical/labs-imaging-system"
                  element={<LabsImagingSystem />}
                />
                <Route
                  path="/medical/icu-emergency-system"
                  element={<ICUEmergencySystem />}
                />

                {/* Perfil y Configuración */}
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<SystemSettings />} />

                {/* System Test Page */}
                <Route path="/system-test" element={<SystemTest />} />

                {/* System Index - EPS Form */}
                <Route path="/system-index" element={<IndexImproved />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <LanguageFloatingButton />
            </BrowserRouter>
          </ErrorBoundary>
        </MedicalDataProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Prevent multiple root creation during HMR
const container = document.getElementById("root")!;
if (!(container as any)._reactRoot) {
  const root = createRoot(container);
  (container as any)._reactRoot = root;
  root.render(<App />);
} else {
  (container as any)._reactRoot.render(<App />);
}
