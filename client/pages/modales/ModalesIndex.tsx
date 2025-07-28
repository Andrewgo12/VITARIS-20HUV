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
} from "lucide-react";

const modales = [
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

export default function ModalesIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-white to-medical-blue/10 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Vista de Modales - Formulario EPS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora cada modal del formulario de remisión EPS de manera individual. 
            Cada modal representa un paso del proceso de referencia al Hospital Universitario del Valle.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Modales</p>
                <p className="text-2xl font-bold">{modales.length}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pasos del Formulario</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sistema Destino</p>
                <p className="text-lg font-bold">HUV</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </CardContent>
          </Card>
        </div>

        {/* Modales Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modales.map((modal) => {
            const Icon = modal.icon;
            return (
              <Card key={modal.id} className="hover:shadow-lg transition-shadow duration-200">
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

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-medical-light/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Información del Sistema</h3>
              <p className="text-sm text-muted-foreground">
                Sistema de referencia médica para el Hospital Universitario del Valle (HUV). 
                Cada modal contiene datos de ejemplo pre-cargados para facilitar la visualización.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
