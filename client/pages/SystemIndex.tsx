import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  User,
  FileText,
  Activity,
  Upload,
  CheckCircle2,
  Eye,
  ArrowRight,
  Home,
  LogIn,
  UserCheck,
  Hospital,
  Layers,
  Settings,
  Monitor,
} from "lucide-react";

const mainPages = [
  {
    id: "landing",
    title: "Landing Page",
    description: "Página principal del sistema con información completa sobre la plataforma de remisión médica",
    icon: Home,
    route: "/",
    demoRoute: "/demos/landing",
    color: "text-primary",
    bgColor: "bg-primary/10",
    category: "Principal",
    features: ["Hero section", "Información del sistema", "Estadísticas", "Proceso de remisión", "Especificaciones técnicas"]
  },
  {
    id: "login",
    title: "Portal de Acceso",
    description: "Sistema de autenticación para EPS y HUV con validación de credenciales y tipos de usuario",
    icon: LogIn,
    route: "/login",
    demoRoute: "/demos/login",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    category: "Autenticación",
    features: ["Login EPS/HUV", "Validación segura", "Recuperar contraseña", "Tipos de usuario"]
  },
  {
    id: "eps-form",
    title: "Formulario EPS",
    description: "Wizard completo de remisión médica con 5 pasos para envío de pacientes al HUV",
    icon: UserCheck,
    route: "/eps-form",
    demoRoute: "/demos/eps-form",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    category: "EPS",
    features: ["Wizard de 5 pasos", "Validación de datos", "Subida de archivos", "Envío al HUV"]
  },
  {
    id: "huv-dashboard",
    title: "Dashboard HUV",
    description: "Panel médico para gestión, evaluación y autorización de remisiones recibidas",
    icon: Hospital,
    route: "/huv-dashboard",
    demoRoute: "/demos/huv-dashboard",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    category: "Hospital",
    features: ["Lista de pacientes", "Evaluación médica", "Autorización/Rechazo", "Filtros avanzados"]
  },
];

const modalPages = [
  {
    id: "modales-index",
    title: "Índice de Modales",
    description: "Vista general de todos los modales del sistema con navegación individual",
    icon: Layers,
    route: "/modales",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    step: "Índice",
  },
  {
    id: "patient-identification",
    title: "Identificación del Paciente",
    description: "Datos básicos del paciente, EPS, contacto de emergencia y evaluación clínica inicial",
    icon: User,
    route: "/modales/patient-identification",
    color: "text-primary",
    bgColor: "bg-primary/10",
    step: "Paso 1",
  },
  {
    id: "referral-diagnosis",
    title: "Remisión y Diagnóstico",
    description: "Motivo de remisión, diagnósticos CIE10 e historial médico previo",
    icon: FileText,
    route: "/modales/referral-diagnosis",
    color: "text-medical-blue",
    bgColor: "bg-medical-blue/10",
    step: "Paso 2",
  },
  {
    id: "vital-signs",
    title: "Signos Vitales",
    description: "Signos vitales principales, mediciones adicionales y archivos de soporte",
    icon: Activity,
    route: "/modales/vital-signs",
    color: "text-medical-green",
    bgColor: "bg-medical-green/10",
    step: "Paso 3",
  },
  {
    id: "documents",
    title: "Documentos de Soporte",
    description: "Información del profesional, observaciones y archivos adjuntos",
    icon: Upload,
    route: "/modales/documents",
    color: "text-warning",
    bgColor: "bg-warning/10",
    step: "Paso 4",
  },
  {
    id: "validation",
    title: "Validación Final",
    description: "Resumen de información y confirmación para envío al HUV",
    icon: CheckCircle2,
    route: "/modales/validation",
    color: "text-success",
    bgColor: "bg-success/10",
    step: "Paso 5",
  },
];

const categories = [
  { name: "Principal", color: "text-slate-700", bgColor: "bg-slate-100" },
  { name: "Autenticación", color: "text-blue-700", bgColor: "bg-blue-100" },
  { name: "EPS", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  { name: "Hospital", color: "text-purple-700", bgColor: "bg-purple-100" },
];

export default function SystemIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-primary to-emerald-600 bg-clip-text text-transparent mb-4">
              Sistema de Remisión EPS-HUV
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-4">
              Explorador de Vistas y Componentes
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Acceso completo a todas las vistas, páginas y modales del sistema. 
              Explora cada componente individualmente para revisión y desarrollo.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{mainPages.length}</div>
              <div className="text-sm text-muted-foreground">Páginas Principales</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{modalPages.length}</div>
              <div className="text-sm text-muted-foreground">Modales del Sistema</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-muted-foreground">Pasos del Formulario</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Vistas Disponibles</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Pages Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-slate-800">Páginas Principales del Sistema</h2>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Badge key={category.name} className={`${category.bgColor} ${category.color} border-0`}>
                {category.name}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainPages.map((page) => {
              const Icon = page.icon;
              return (
                <Card key={page.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className={`${page.bgColor} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-7 h-7 ${page.color}`} />
                        <div>
                          <CardTitle className="text-xl">{page.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">{page.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {page.description}
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-600 mb-2">Características:</p>
                      <div className="flex flex-wrap gap-1">
                        {page.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={page.route} className="flex-1">
                        <Button className="w-full" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Original
                        </Button>
                      </Link>
                      <Link to={page.demoRoute} className="flex-1">
                        <Button className="w-full">
                          <Monitor className="w-4 h-4 mr-2" />
                          Ver Demo
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Modals Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold text-slate-800">Modales y Componentes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modalPages.map((modal) => {
              const Icon = modal.icon;
              return (
                <Card key={modal.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className={`${modal.bgColor} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${modal.color}`} />
                        <Badge variant="outline">{modal.step}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{modal.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {modal.description}
                    </p>
                    
                    <Link to={modal.route}>
                      <Button className="w-full" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Modal
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Información del Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">React 18</div>
                  <div className="text-sm text-slate-600">Framework Frontend</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">TypeScript</div>
                  <div className="text-sm text-slate-600">Tipado Estático</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">Tailwind CSS</div>
                  <div className="text-sm text-slate-600">Sistema de Diseño</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Sistema completo de remisión médica desarrollado para la gestión eficiente 
                  entre Entidades Promotoras de Salud (EPS) y el Hospital Universitario del Valle. 
                  Todas las vistas incluyen datos de ejemplo para facilitar la revisión.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
