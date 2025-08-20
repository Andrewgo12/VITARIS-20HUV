import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/components/ui/notification-system";
import { PermissionsProvider } from "@/components/ui/permissions-system";
import LanguageFloatingButton from "@/components/LanguageFloatingButton";

// VITAL RED System Components - Only these views are allowed
import Login from "./pages/Login";
import VitalRedDashboard from "./pages/VitalRedDashboard";
import MedicalCasesInbox from "./pages/MedicalCasesInbox";
import ClinicalCaseDetail from "./pages/ClinicalCaseDetail";
import UserManagement from "./pages/UserManagement";
import RequestHistory from "./pages/RequestHistory";
import EmailMonitor from "./pages/EmailMonitor";
import EmailCaptureConfig from "./pages/EmailCaptureConfig";
import SupervisionPanel from "./pages/SupervisionPanel";
import SystemConfiguration from "./pages/SystemConfiguration";
import BackupManagement from "./pages/BackupManagement";
import GmailExtractor from "./pages/GmailExtractor";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <NotificationProvider>
          <PermissionsProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <BrowserRouter>
                <Routes>
                  {/* VITAL RED System Routes - Only these routes are allowed */}
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />

                  {/* Protected Dashboard Route */}
                  <Route path="/vital-red/dashboard" element={
                    <ProtectedRoute>
                      <VitalRedDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Medical Evaluator Routes */}
                  <Route path="/vital-red/medical-cases" element={
                    <ProtectedRoute requiredRole="medical_evaluator">
                      <MedicalCasesInbox />
                    </ProtectedRoute>
                  } />
                  <Route path="/vital-red/case-detail/:caseId" element={
                    <ProtectedRoute requiredRole="medical_evaluator">
                      <ClinicalCaseDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/vital-red/request-history" element={
                    <ProtectedRoute>
                      <RequestHistory />
                    </ProtectedRoute>
                  } />

                  {/* Administrator Routes */}
                  <Route path="/vital-red/user-management" element={
                    <ProtectedRoute adminOnly={true}>
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/vital-red/supervision" element={
                    <ProtectedRoute adminOnly={true}>
                      <SupervisionPanel />
                    </ProtectedRoute>
                  } />
                  <Route path="/vital-red/system-config" element={
                    <ProtectedRoute adminOnly={true}>
                      <SystemConfiguration />
                    </ProtectedRoute>
                  } />
                  <Route path="/vital-red/backup-management" element={
                    <ProtectedRoute adminOnly={true}>
                      <BackupManagement />
                    </ProtectedRoute>
                  } />

                  {/* AI Module Routes - Backoffice Automatizado */}
                  <Route path="/vital-red/email-monitor" element={
                    <ProtectedRoute>
                      <EmailMonitor />
                    </ProtectedRoute>
                  } />
                  <Route path="/vital-red/email-config" element={
                    <ProtectedRoute adminOnly={true}>
                      <EmailCaptureConfig />
                    </ProtectedRoute>
                  } />

                  {/* Gmail Extractor Route */}
                  <Route path="/vital-red/gmail-extractor" element={
                    <ProtectedRoute adminOnly={true}>
                      <GmailExtractor />
                    </ProtectedRoute>
                  } />

                  {/* Catch-all route */}
                  <Route path="*" element={<Login />} />
                </Routes>
                <LanguageFloatingButton />
              </BrowserRouter>
            </ErrorBoundary>
          </PermissionsProvider>
        </NotificationProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
