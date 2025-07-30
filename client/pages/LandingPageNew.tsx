import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Hospital,
  HeartPulse,
  Zap,
  Shield,
  Users,
  Clock,
  Award,
  Stethoscope,
  Activity,
  FileText,
  BarChart3,
  CheckCircle,
  Star,
} from "lucide-react";

export default function LandingPageNew() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Seguridad Certificada",
      description: "Cumplimiento total con normativas MinSalud y protección de datos HIPAA."
    },
    {
      icon: Clock,
      title: "Tiempo Real",
      description: "Procesamiento instantáneo de remisiones con notificaciones automáticas."
    },
    {
      icon: Users,
      title: "Integración Total",
      description: "Conecta EPS y HUV en una plataforma unificada y eficiente."
    },
    {
      icon: BarChart3,
      title: "Analytics Avanzados",
      description: "Reportes detallados y métricas de rendimiento en tiempo real."
    }
  ];

  const stats = [
    { label: "Pacientes Atendidos", value: "50,000+", icon: Users },
    { label: "Tiempo Promedio", value: "< 5 min", icon: Clock },
    { label: "Disponibilidad", value: "99.9%", icon: Award },
    { label: "EPS Conectadas", value: "25+", icon: Hospital }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Modern Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Vital Red</h1>
                <p className="text-xs text-muted-foreground">Sistema EPS-HUV</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="gap-2"
            >
              <Zap className="w-4 h-4" />
              Acceder
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - More Compact */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Certification Badges */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <Badge variant="outline" className="gap-2 py-2 px-4">
                <Shield className="w-4 h-4" />
                Certificado MinSalud
              </Badge>
              <Badge variant="secondary" className="gap-2 py-2 px-4">
                <Award className="w-4 h-4" />
                Nivel 4 HUV
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Sistema Digital de Remisión
              <span className="block text-primary mt-2">EPS ↔ HUV</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Plataforma tecnológica que optimiza la gestión de remisiones médicas entre 
              Entidades Promotoras de Salud y el Hospital Universitario del Valle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="btn-primary-modern text-lg px-8 py-4 h-auto"
              >
                <Zap className="w-5 h-5 mr-2" />
                Ingresar al Sistema
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/system-test")}
                className="text-lg px-8 py-4 h-auto"
              >
                <Activity className="w-5 h-5 mr-2" />
                Ver Demo
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="card-modern text-center p-4">
                  <CardContent className="p-0">
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Improved Layout */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tecnología Médica Avanzada
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solución integral que conecta el sistema de salud con eficiencia y seguridad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-modern h-full">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Acceso Rápido al Sistema
              </h2>
              <p className="text-xl text-muted-foreground">
                Ingrese directamente a las diferentes áreas del sistema médico
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-modern group cursor-pointer" onClick={() => navigate("/medical-dashboard-improved")}>
                <CardContent className="p-6 text-center">
                  <Stethoscope className="w-16 h-16 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Dashboard Médico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Gestión completa de pacientes y citas médicas
                  </p>
                  <Button variant="outline" className="w-full">
                    Acceder
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-modern group cursor-pointer" onClick={() => navigate("/huv-dashboard")}>
                <CardContent className="p-6 text-center">
                  <Hospital className="w-16 h-16 text-medical-green mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Dashboard HUV
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Sistema hospitalario y gestión de remisiones
                  </p>
                  <Button variant="outline" className="w-full">
                    Acceder
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-modern group cursor-pointer" onClick={() => navigate("/medical/active-patients")}>
                <CardContent className="p-6 text-center">
                  <Users className="w-16 h-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Pacientes Activos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Seguimiento en tiempo real de pacientes
                  </p>
                  <Button variant="outline" className="w-full">
                    Acceder
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-medical-green rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Confianza y Seguridad Garantizada
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Sistema certificado que cumple con los más altos estándares de seguridad 
              en el manejo de información médica sensible
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Certificación MinSalud</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Cumplimiento HIPAA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Encriptación End-to-End</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Auditoría Continua</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">Vital Red</h3>
                <p className="text-sm text-slate-300">Sistema EPS-HUV</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-300 mb-6">
              <span>© 2024 MinSalud Colombia</span>
              <span>•</span>
              <span>Términos de Servicio</span>
              <span>•</span>
              <span>Política de Privacidad</span>
              <span>•</span>
              <span>Soporte Técnico</span>
            </div>

            <p className="text-slate-400 text-sm">
              Desarrollado bajo los estándares de seguridad y calidad del sistema de salud colombiano
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
