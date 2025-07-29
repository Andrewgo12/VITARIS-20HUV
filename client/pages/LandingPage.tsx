import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Hospital,
  Stethoscope,
  HeartPulse,
  Activity,
  Phone,
  Globe,
  Award,
  Zap,
  Monitor,
  Settings,
  Eye,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();



  const benefits = [
    "Eliminación del papeleo tradicional",
    "Reducción de errores en transcripción",
    "Acceso inmediato a historial médico",
    "Trazabilidad completa del proceso",
    "Comunicación directa EPS-Hospital",
    "Optimización de recursos hospitalarios",
  ];

  const stats = [
    { number: "24/7", label: "Disponibilidad del Sistema" },
    { number: "100%", label: "Digital y Sin Papel" },
    { number: "<30s", label: "Tiempo Promedio de Envío" },
    { number: "99.9%", label: "Confiabilidad del Sistema" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo and Badges */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                <Hospital className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 bg-white/80">
                  Certificado por MinSalud
                </Badge>
                <Badge variant="success" className="ml-2">
                  Nivel 4 - HUV
                </Badge>
              </div>
              <div className="w-20 h-20 bg-medical-green rounded-2xl flex items-center justify-center shadow-2xl">
                <HeartPulse className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Vital Red - Sistema Digital de Remisión
              <br />
              <span className="text-4xl md:text-5xl">
                EPS ↔ Hospital Universitario del Valle
              </span>
            </h1>

            <p className="text-xl text-black max-w-4xl mx-auto mb-8 leading-relaxed">
              Vital Red es una plataforma tecnológica avanzada para la gestión
              integral de remisiones médicas entre Entidades Promotoras de Salud
              (EPS) y el Hospital Universitario del Valle. Optimiza procesos,
              reduce tiempos y mejora la atención al paciente.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="xl"
                onClick={() => navigate("/login")}
                className="text-lg px-8 py-4"
              >
                <Zap className="w-5 h-5 mr-2" />
                Acceder al Sistema
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>


            </div>
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section className="py-20 bg-medical-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Beneficios del Sistema Digital
                </h2>
                <p className="text-lg text-white mb-8">
                  La digitalización del proceso de remisión médica trae
                  múltiples ventajas tanto para las EPS como para el Hospital
                  Universitario del Valle.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Users className="w-6 h-6 text-medical-blue" />
                      Para EPS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-black">
                      • Proceso simplificado
                    </div>
                    <div className="text-sm text-black">• Menos errores</div>
                    <div className="text-sm text-black">
                      • Respuesta inmediata
                    </div>
                    <div className="text-sm text-black">
                      • Trazabilidad completa
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Hospital className="w-6 h-6 text-medical-green" />
                      Para HUV
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-black">
                      • Información completa
                    </div>
                    <div className="text-sm text-black">
                      • Priorización eficiente
                    </div>
                    <div className="text-sm text-black">
                      • Mejor planificación
                    </div>
                    <div className="text-sm text-black">
                      • Reducción de costos
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-black text-center mb-16">
              Especificaciones Técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-medical-green" />
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">• Encriptación SSL/TLS</div>
                  <div className="text-sm">• Autenticación de dos factores</div>
                  <div className="text-sm">• Logs de auditoría</div>
                  <div className="text-sm">• Cumplimiento RGPD</div>
                  <div className="text-sm">• Backup automático</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-medical-blue" />
                    Accesibilidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">• Acceso web 24/7</div>
                  <div className="text-sm">• Responsive design</div>
                  <div className="text-sm">• Compatible con tablets</div>
                  <div className="text-sm">• Optimizado para móviles</div>
                  <div className="text-sm">• Sin instalación requerida</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-slate-600" />
                    Calidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">• Certificación ISO 27001</div>
                  <div className="text-sm">• Uptime 99.9%</div>
                  <div className="text-sm">• Soporte técnico 24/7</div>
                  <div className="text-sm">• Actualizaciones automáticas</div>
                  <div className="text-sm">• Monitoreo continuo</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact and Support */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-black mb-8">
              Soporte y Contacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Phone className="w-8 h-8 text-medical-blue mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Soporte Técnico</h3>
                  <p className="text-sm text-black">+57 (2) 555-0123</p>
                  <p className="text-sm text-black">soporte@eps-huv.gov.co</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="w-8 h-8 text-medical-green mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Horario de Atención</h3>
                  <p className="text-sm text-black">24 horas, 7 días</p>
                  <p className="text-sm text-black">Disponibilidad continua</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Stethoscope className="w-8 h-8 text-medical-blue mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Capacitación</h3>
                  <p className="text-sm text-black">
                    Entrenamientos disponibles
                  </p>
                  <p className="text-sm text-black">
                    capacitacion@eps-huv.gov.co
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4">
                ¿Listo para comenzar?
              </h3>
              <p className="text-black mb-6">
                Acceda al sistema con sus credenciales autorizadas y comience a
                utilizar la plataforma de remisión digital más avanzada del
                país.
              </p>
              <Button
                size="xl"
                onClick={() => navigate("/login")}
                className="text-lg px-12 py-4"
              >
                <Zap className="w-5 h-5 mr-2" />
                Iniciar Sesión
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-medical-blue rounded-xl flex items-center justify-center">
                <Hospital className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">
                Vital Red - Sistema de Remisión EPS-HUV
              </h3>
            </div>
            <p className="text-white mb-6">
              Desarrollado por el Ministerio de Salud y Protección Social en
              colaboración con el Hospital Universitario del Valle.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white">
              <span>© 2024 MinSalud Colombia</span>
              <span>•</span>
              <span>Términos y Condiciones</span>
              <span>•</span>
              <span>Política de Privacidad</span>
              <span>•</span>
              <span>Seguridad</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
