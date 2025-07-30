import { FormProvider } from "@/context/FormContext";
import EPSFormWizard from "@/components/EPSFormWizard";
import EmergencyFloatingButton from "@/components/EmergencyFloatingButton";
import NavigationImproved from "@/components/NavigationImproved";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Activity,
  Shield,
  CheckCircle,
  Stethoscope,
  MonitorSpeaker,
  Hospital,
  Users,
  Calendar,
  FileText,
  ArrowRight,
  Zap,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function IndexImproved() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Stethoscope,
      title: t("dashboard.title"),
      description: "Acceso al sistema médico completo",
      path: "/medical-dashboard-improved",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MonitorSpeaker,
      title: t("patients.title"),
      description: "Gestión de pacientes activos",
      path: "/medical/active-patients",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: CheckCircle,
      title: language === "es" ? "Prueba del Sistema" : "System Test",
      description: "Verificación de componentes",
      path: "/system-test",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-primary/10">
          <Heart className="w-24 h-24" />
        </div>
        <div className="absolute top-40 right-20 text-medical-green/10">
          <Activity className="w-20 h-20" />
        </div>
        <div className="absolute bottom-40 left-20 text-blue-500/10">
          <Stethoscope className="w-28 h-28" />
        </div>
        <div className="absolute bottom-20 right-40 text-purple-500/10">
          <Shield className="w-16 h-16" />
        </div>
      </div>

      <FormProvider>
        {/* Header */}
        <header className="glass-header relative z-50">
          <div className="container mx-auto px-6 py-4">
            <NavigationImproved 
              userName="Usuario EPS"
              userRole={t("medical.eps")}
              showFullNav={false}
            />
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Card className="card-modern max-w-5xl mx-auto">
              <CardContent className="p-8 lg:p-12">
                {/* Brand Section */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  {/* EPS Icon */}
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
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

                  {/* Central Branding */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-5xl font-bold text-foreground tracking-tight">
                          VITAL
                          <span className="text-primary font-light"> RED</span>
                        </h1>
                        <p className="text-foreground text-lg font-medium">
                          {t("medical.referral")}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                      Conectamos EPS y Hospital Universitario del Valle con
                      tecnología médica avanzada y segura
                    </p>

                    {/* Status Badges */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Badge variant="outline" className="gap-2 py-2 px-4 bg-emerald-50 border-emerald-200 text-emerald-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Sistema Activo
                      </Badge>
                      <Badge variant="outline" className="gap-2 py-2 px-4 bg-blue-50 border-blue-200 text-blue-700">
                        <Shield className="w-4 h-4" />
                        Certificado SSL
                      </Badge>
                      <Badge variant="outline" className="gap-2 py-2 px-4 bg-amber-50 border-amber-200 text-amber-700">
                        <Award className="w-4 h-4" />
                        MinSalud
                      </Badge>
                    </div>
                  </div>

                  {/* HUV Icon */}
                  <div className="w-20 h-20 bg-medical-green rounded-2xl flex items-center justify-center shadow-lg">
                    <Hospital className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-primary/5 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                    <p className="text-lg font-semibold text-foreground">
                      {t("medical.completeSteps")}
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    Complete el formulario EPS para iniciar el proceso de remisión médica
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* EPS Form Wizard */}
          <div className="mb-12">
            <EPSFormWizard />
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Acceso Rápido al Sistema
              </h2>
              <p className="text-muted-foreground">
                Navegue directamente a las diferentes secciones del sistema médico
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="card-modern cursor-pointer group hover:shadow-medium transition-all duration-300"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {action.description}
                    </p>
                    <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
                      Acceder
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* System Information */}
          <Card className="card-modern max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Shield className="w-12 h-12 text-primary" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Sistema Certificado y Seguro
                  </h3>
                  <p className="text-muted-foreground">
                    Cumplimiento total con normativas de salud digital
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Certificación MinSalud</h4>
                  <p className="text-sm text-muted-foreground">Aprobado por el Ministerio de Salud</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Seguridad HIPAA</h4>
                  <p className="text-sm text-muted-foreground">Protección de datos médicos</p>
                </div>
                <div className="text-center">
                  <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Tiempo Real</h4>
                  <p className="text-sm text-muted-foreground">Procesamiento instantáneo</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground border-t border-border pt-6">
                <p className="mb-2">
                  © 2024 Vital Red - Sistema de Remisión EPS - Hospital Universitario del Valle
                </p>
                <p>
                  Desarrollado conforme a los estándares de seguridad en salud digital
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Floating Button */}
        <EmergencyFloatingButton />
      </FormProvider>
    </div>
  );
}
