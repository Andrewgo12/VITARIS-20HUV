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
          <Route path="/huv-dashboard-advanced" element={<HUVDashboardAdvanced />} />
          <Route path="/patient/:id" element={<PatientDetailView />} />
          <Route path="/medical-tools" element={<MedicalTools />} />

          {/* Modales Demo - Rutas individuales para testing */}
          <Route path="/demo/patient-identification" element={<PatientIdentificationModalDemo />} />
          <Route path="/demo/referral-diagnosis" element={<ReferralDiagnosisModalDemo />} />
          <Route path="/demo/vital-signs" element={<VitalSignsModalDemo />} />
          <Route path="/demo/documents" element={<DocumentsModalDemo />} />
          <Route path="/demo/validation" element={<ValidationModalDemo />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
