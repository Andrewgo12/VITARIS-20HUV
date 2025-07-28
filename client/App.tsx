import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import EPSForm from "./pages/EPSForm";
import HUVDashboard from "./pages/HUVDashboard";
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
import Telemedicine from "./pages/medical/Telemedicine";
import MedicalEducation from "./pages/medical/MedicalEducation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eps-form" element={<EPSForm />} />
          <Route path="/huv-dashboard" element={<HUVDashboard />} />

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
          <Route path="/demo/vital-signs" element={<VitalSignsModalDemo />} />
          <Route path="/demo/documents" element={<DocumentsModalDemo />} />
          <Route path="/demo/validation" element={<ValidationModalDemo />} />

          {/* Diagramas de flujo del sistema */}
          <Route path="/flowchart/frontend" element={<FlowchartFrontend />} />
          <Route path="/flowchart/backend" element={<FlowchartBackend />} />

          {/* Sistema médico completo - Todas las vistas médicas */}
          <Route
            path="/medical/admissions"
            element={<AdmissionsManagement />}
          />
          <Route path="/medical/surgeries" element={<SurgeriesSchedule />} />
          <Route path="/medical/labs-imaging" element={<LabsImaging />} />
          <Route path="/medical/pharmacy" element={<PharmacyManagement />} />
          <Route path="/medical/consultations" element={<ConsultationsHub />} />
          <Route path="/medical/icu-monitoring" element={<ICUMonitoring />} />
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
            element={<AppointmentsScheduler />}
          />
          <Route path="/medical/telemedicine" element={<Telemedicine />} />
          <Route path="/medical/education" element={<MedicalEducation />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
