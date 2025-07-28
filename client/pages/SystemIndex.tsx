import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor,
  Users,
  FileText,
  Heart,
  CheckCircle,
  Eye,
  Stethoscope,
  Calculator,
  UserCheck,
  ClipboardList,
  Activity,
  Files,
  Settings,
  Home,
  ArrowLeft,
  Bed,
  Scissors,
  TestTube,
  Pill,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Phone,
  Calendar,
  Video,
  GraduationCap,
  Camera,
} from "lucide-react";

export default function SystemIndex() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mainPages = [
    {
      id: "landing",
      title: "Landing Page",
      description: "Página principal del sistema VITARIS",
      route: "/",
      icon: Home,
      category: "main",
      color: "bg-blue-500",
    },
    {
      id: "login",
      title: "Sistema de Login",
      description: "Autenticación y acceso al sistema",
      route: "/login",
      icon: UserCheck,
      category: "main",
      color: "bg-green-500",
    },
    {
      id: "eps-form",
      title: "Formulario EPS",
      description: "Formulario completo de registro médico",
      route: "/eps-form",
      icon: ClipboardList,
      category: "main",
      color: "bg-purple-500",
    },
    {
      id: "huv-dashboard",
      title: "Dashboard HUV",
      description: "Dashboard básico del hospital",
      route: "/huv-dashboard",
      icon: Monitor,
      category: "main",
      color: "bg-indigo-500",
    },
    {
      id: "huv-dashboard-advanced",
      title: "Dashboard Médico Avanzado",
      description: "Dashboard completo con herramientas médicas profesionales",
      route: "/huv-dashboard-advanced",
      icon: Stethoscope,
      category: "medical",
      color: "bg-medical-blue",
    },
    {
      id: "medical-tools",
      title: "Herramientas Médicas",
      description:
        "Calculadoras médicas, protocolos y herramientas de emergencia",
      route: "/medical-tools",
      icon: Calculator,
      category: "medical",
      color: "bg-medical-green",
    },
    {
      id: "flowchart-frontend",
      title: "Diagrama Frontend",
      description: "Flujo completo de navegación y vistas del frontend",
      route: "/flowchart/frontend",
      icon: Monitor,
      category: "diagram",
      color: "bg-cyan-500",
    },
    {
      id: "flowchart-backend",
      title: "Diagrama Backend",
      description: "Arquitectura backend completa esperada del sistema",
      route: "/flowchart/backend",
      icon: Settings,
      category: "diagram",
      color: "bg-slate-500",
    },
    // SISTEMA MÉDICO COMPLETO - TODAS LAS VISTAS MÉDICAS
    {
      id: "admissions-management",
      title: "Gestión de Admisiones",
      description: "Control completo de admisiones, altas y gestión de camas",
      route: "/medical/admissions",
      icon: Bed,
      category: "medical-advanced",
      color: "bg-blue-600",
    },
    {
      id: "surgeries-schedule",
      title: "Programación de Cirugías",
      description: "Sistema completo de programación y seguimiento quirúrgico",
      route: "/medical/surgeries",
      icon: Scissors,
      category: "medical-advanced",
      color: "bg-purple-600",
    },
    {
      id: "labs-imaging",
      title: "Laboratorios e Imágenes",
      description: "Sistema integral de diagnósticos y resultados",
      route: "/medical/labs-imaging",
      icon: TestTube,
      category: "medical-advanced",
      color: "bg-green-600",
    },
    {
      id: "pharmacy-management",
      title: "Gestión Farmacéutica",
      description: "Control de medicamentos, prescripciones e inventario",
      route: "/medical/pharmacy",
      icon: Pill,
      category: "medical-advanced",
      color: "bg-orange-600",
    },
    {
      id: "consultations-hub",
      title: "Hub de Interconsultas",
      description: "Gestión de interconsultas entre especialidades",
      route: "/medical/consultations",
      icon: Users,
      category: "medical-advanced",
      color: "bg-indigo-600",
    },
    {
      id: "icu-monitoring",
      title: "Monitoreo UCI",
      description: "Cuidados intensivos en tiempo real",
      route: "/medical/icu-monitoring",
      icon: Activity,
      category: "medical-advanced",
      color: "bg-red-600",
    },
    {
      id: "emergency-protocols",
      title: "Protocolos de Emergencia",
      description: "Guías de manejo para situaciones críticas",
      route: "/medical/emergency-protocols",
      icon: AlertTriangle,
      category: "medical-advanced",
      color: "bg-red-500",
    },
    {
      id: "medical-reports",
      title: "Reportes Médicos",
      description: "Estadísticas, análisis y reportes del sistema",
      route: "/medical/reports",
      icon: BarChart3,
      category: "medical-advanced",
      color: "bg-blue-500",
    },
    {
      id: "team-communication",
      title: "Comunicación Médica",
      description: "Comunicación segura entre equipos médicos",
      route: "/medical/team-communication",
      icon: MessageSquare,
      category: "medical-advanced",
      color: "bg-purple-500",
    },
    {
      id: "appointments-scheduler",
      title: "Programación de Citas",
      description: "Gestión integral de citas médicas",
      route: "/medical/appointments",
      icon: Calendar,
      category: "medical-advanced",
      color: "bg-green-500",
    },
    {
      id: "telemedicine",
      title: "Telemedicina",
      description: "Consultas médicas a distancia",
      route: "/medical/telemedicine",
      icon: Video,
      category: "medical-advanced",
      color: "bg-cyan-600",
    },
    {
      id: "medical-education",
      title: "Educación Médica",
      description: "Formación continua y desarrollo profesional",
      route: "/medical/education",
      icon: GraduationCap,
      category: "medical-advanced",
      color: "bg-amber-600",
    },
  ];

  const modalDemos = [
    {
      id: "patient-identification",
      title: "Identificación del Paciente",
      description: "Modal para datos básicos del paciente",
      route: "/demo/patient-identification",
      icon: Users,
      category: "modal",
      color: "bg-orange-500",
    },
    {
      id: "referral-diagnosis",
      title: "Diagnóstico y Referencia",
      description: "Modal para diagnóstico médico y referencia",
      route: "/demo/referral-diagnosis",
      icon: FileText,
      category: "modal",
      color: "bg-red-500",
    },
    {
      id: "vital-signs",
      title: "Signos Vitales",
      description: "Modal para registro de signos vitales",
      route: "/demo/vital-signs",
      icon: Heart,
      category: "modal",
      color: "bg-pink-500",
    },
    {
      id: "documents",
      title: "Documentos",
      description: "Modal para gestión de documentos médicos",
      route: "/demo/documents",
      icon: Files,
      category: "modal",
      color: "bg-yellow-500",
    },
    {
      id: "validation",
      title: "Validación Final",
      description: "Modal de validación y confirmación",
      route: "/demo/validation",
      icon: CheckCircle,
      category: "modal",
      color: "bg-green-600",
    },
  ];

  const allViews = [...mainPages, ...modalDemos];

  const filteredViews =
    selectedCategory === "all"
      ? allViews
      : allViews.filter((view) => view.category === selectedCategory);

  const getStats = () => {
    return {
      total: allViews.length,
      main: mainPages.filter((p) => p.category === "main").length,
      medical: mainPages.filter((p) => p.category === "medical").length,
      medicalAdvanced: mainPages.filter((p) => p.category === "medical-advanced").length,
      modals: modalDemos.length,
      diagrams: mainPages.filter((p) => p.category === "diagram").length,
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-blue via-primary to-medical-green bg-clip-text text-transparent mb-2">
              Sistema VITARIS - Explorador de Vistas
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Navegación completa de todas las vistas y componentes del sistema
              médico
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Vistas
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-medical-blue">
                  {stats.main}
                </div>
                <div className="text-sm text-muted-foreground">
                  Páginas Principales
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-medical-green">
                  {stats.medical}
                </div>
                <div className="text-sm text-muted-foreground">
                  Médicas Básicas
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.medicalAdvanced}
                </div>
                <div className="text-sm text-muted-foreground">
                  Médicas Avanzadas
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">
                  {stats.modals}
                </div>
                <div className="text-sm text-muted-foreground">
                  Modales Demo
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {stats.diagrams}
                </div>
                <div className="text-sm text-muted-foreground">
                  Diagramas
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filtros y Navegación */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Todas
            </TabsTrigger>
            <TabsTrigger value="main" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Principales
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Médicas Básicas
            </TabsTrigger>
            <TabsTrigger value="medical-advanced" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Médicas Avanzadas
            </TabsTrigger>
            <TabsTrigger value="modal" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Modales
            </TabsTrigger>
            <TabsTrigger value="diagram" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Diagramas
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredViews.map((view) => {
                const IconComponent = view.icon;
                return (
                  <Card
                    key={view.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`p-2 rounded-lg ${view.color} text-white`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {view.category === "main"
                            ? "Principal"
                            : view.category === "medical"
                              ? "Médico Básico"
                              : view.category === "medical-advanced"
                                ? "Médico Avanzado"
                                : view.category === "modal"
                                  ? "Modal"
                                  : "Diagrama"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {view.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {view.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => navigate(view.route)}
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Vista
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer de información */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Navegación VITARIS
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Este explorador te permite navegar por todas las vistas del
                sistema médico VITARIS. Incluye páginas principales,
                herramientas médicas especializadas y modales de demostración.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">React 18</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">TailwindCSS</Badge>
                <Badge variant="secondary">Radix UI</Badge>
                <Badge variant="secondary">Sistema Médico</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
