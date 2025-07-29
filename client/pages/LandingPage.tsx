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
