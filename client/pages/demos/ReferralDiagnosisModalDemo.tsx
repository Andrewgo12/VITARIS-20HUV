import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockFormProvider } from "@/context/MockFormContext";
import ReferralDiagnosisModal from "@/components/modals/ReferralDiagnosisModal";
import { ArrowLeft, FileText, Info, Eye, Stethoscope } from "lucide-react";

export default function ReferralDiagnosisModalDemo() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MockFormProvider>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/system")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Sistema
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Demo: Diagnóstico y Referencia
                </h1>
                <p className="text-muted-foreground">
                  Vista de demostración del modal de diagnóstico médico y
                  referencia
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-sm bg-red-50 text-red-700 border-red-200"
            >
              Modal Demo
            </Badge>
          </div>

          {/* Información del componente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-red-600" />
                  Propósito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modal especializado para capturar información médica
                  detallada, incluyendo diagnóstico, historia clínica y
                  justificación de la remisión.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                  Información Médica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Diagnóstico principal</li>
                  <li>• Resumen clínico detallado</li>
                  <li>• Medicamentos actuales</li>
                  <li>• Alergias conocidas</li>
                  <li>• Antecedentes relevantes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Datos de Referencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Institución de origen</li>
                  <li>• Médico referente</li>
                  <li>• Nivel de urgencia</li>
                  <li>• Especialidad requerida</li>
                  <li>• Resultados paraclínicos</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Demo del modal */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Demostración del Modal</CardTitle>
              <p className="text-muted-foreground">
                Haz clic en el botón para abrir el modal de diagnóstico con un
                caso médico completo de ejemplo
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-lg">
                <Stethoscope className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Modal de Diagnóstico Médico
                </h3>
                <p className="text-muted-foreground mb-6">
                  Contiene un caso clínico completo de síndrome coronario agudo
                  con toda la información médica necesaria para la remisión.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Abrir Modal de Diagnóstico
                </Button>
              </div>

              {/* Información del caso */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Caso Clínico Demo</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <strong>Diagnóstico:</strong> Síndrome Coronario Agudo
                    </div>
                    <div>
                      <strong>Especialidad:</strong> Cardiología
                    </div>
                    <div>
                      <strong>Urgencia:</strong> Alta
                    </div>
                    <div>
                      <strong>Médico:</strong> Dr. Luis F. Gómez
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Información Técnica</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <code>ReferralDiagnosisModal.tsx</code>
                    </div>
                    <div>
                      Ubicación: <code>/components/modals/</code>
                    </div>
                    <div>Validaciones médicas completas</div>
                    <div>Campos de texto enriquecido</div>
                  </div>
                </div>
              </div>

              {/* Detalles médicos */}
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold mb-2">
                  Resumen del Caso de Ejemplo
                </h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Paciente:</strong> Mujer de 67 años con dolor torácico
                  agudo, cambios electrocardiográficos sugestivos de STEMI
                  anterior extenso. Antecedentes de HTA y DM2. Requiere manejo
                  especializado urgente para consideración de reperfusión
                  coronaria.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modal */}
          {isModalOpen && <ReferralDiagnosisModal />}
        </div>
      </div>
    </MockFormProvider>
  );
}
