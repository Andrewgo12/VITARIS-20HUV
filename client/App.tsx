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
import NotFound from "./pages/NotFound";

// System index
import SystemIndex from "./pages/SystemIndex";

// Demo pages
import LandingPageDemo from "./pages/demos/LandingPageDemo";
import LoginDemo from "./pages/demos/LoginDemo";
import EPSFormDemo from "./pages/demos/EPSFormDemo";
import HUVDashboardDemo from "./pages/demos/HUVDashboardDemo";

// Modal pages
import ModalesIndex from "./pages/modales/ModalesIndex";
import PatientIdentificationPage from "./pages/modales/PatientIdentificationPage";
import ReferralDiagnosisPage from "./pages/modales/ReferralDiagnosisPage";
import VitalSignsPage from "./pages/modales/VitalSignsPage";
import DocumentsPage from "./pages/modales/DocumentsPage";
import ValidationPage from "./pages/modales/ValidationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/system" element={<SystemIndex />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eps-form" element={<EPSForm />} />
          <Route path="/huv-dashboard" element={<HUVDashboard />} />

          {/* Demo routes for individual review */}
          <Route path="/demos/landing" element={<LandingPageDemo />} />
          <Route path="/demos/login" element={<LoginDemo />} />
          <Route path="/demos/eps-form" element={<EPSFormDemo />} />
          <Route path="/demos/huv-dashboard" element={<HUVDashboardDemo />} />

          {/* Modal testing routes */}
          <Route path="/modales" element={<ModalesIndex />} />
          <Route
            path="/modales/patient-identification"
            element={<PatientIdentificationPage />}
          />
          <Route
            path="/modales/referral-diagnosis"
            element={<ReferralDiagnosisPage />}
          />
          <Route path="/modales/vital-signs" element={<VitalSignsPage />} />
          <Route path="/modales/documents" element={<DocumentsPage />} />
          <Route path="/modales/validation" element={<ValidationPage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
