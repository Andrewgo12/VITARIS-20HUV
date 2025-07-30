import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockFormProvider } from "@/context/MockFormContext";
import VitalSignsModal from "@/components/modals/VitalSignsModal";
import {
  ArrowLeft,
  Heart,
  Info,
  Eye,
  Activity,
  Thermometer,
} from "lucide-react";

export default function VitalSignsModalDemo() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MockFormProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Demo: Signos Vitales
                </h1>
                <p className="text-muted-foreground">
                  Vista de demostración del modal de registro de signos vitales
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-sm bg-pink-50 text-pink-700 border-pink-200"
            >
              Modal Demo
            </Badge>
          </div>

          {/* Información del componente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-pink-600" />
                  Propósito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modal especializado para el registro completo de signos
                  vitales y observaciones clínicas del paciente al momento de la
                  remisión.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Signos Vitales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Presión arterial</li>
                  <li>• Frecuencia cardíaca</li>
                  <li>• Frecuencia respiratoria</li>
                  <li>• Temperatura corporal</li>
                  <li>• Saturación de oxígeno</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Datos Adicionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Peso y estatura</li>
                  <li>• Índice de masa corporal</li>
                  <li>• Escala de dolor</li>
                  <li>• Estado de conciencia</li>
                  <li>• Observaciones clínicas</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Demo del modal */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Demostración del Modal</CardTitle>
              <p className="text-muted-foreground">
                Haz clic en el botón para abrir el modal de signos vitales con
                valores de un paciente crítico
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-8 rounded-lg">
                <Activity className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Modal de Signos Vitales
                </h3>
                <p className="text-muted-foreground mb-6">
                  Contiene los signos vitales alterados de una paciente con
                  síndrome coronario agudo, incluyendo observaciones relevantes.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Abrir Modal de Signos Vitales
                </Button>
              </div>

              {/* Información de los signos vitales */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="font-semibold">FC</div>
                  <div className="text-2xl font-bold text-red-600">120</div>
                  <div className="text-xs text-muted-foreground">
                    lpm (elevada)
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold">PA</div>
                  <div className="text-2xl font-bold text-blue-600">180/95</div>
                  <div className="text-xs text-muted-foreground">
                    mmHg (alta)
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold">T°</div>
                  <div className="text-2xl font-bold text-orange-600">38.5</div>
                  <div className="text-xs text-muted-foreground">
                    °C (febrícula)
                  </div>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg text-center">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">
                    O2
                  </div>
                  <div className="font-semibold">SpO2</div>
                  <div className="text-2xl font-bold text-cyan-600">89</div>
                  <div className="text-xs text-muted-foreground">% (baja)</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">
                    FR
                  </div>
                  <div className="font-semibold">FR</div>
                  <div className="text-2xl font-bold text-purple-600">28</div>
                  <div className="text-xs text-muted-foreground">
                    rpm (elevada)
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">
                    P
                  </div>
                  <div className="font-semibold">Dolor</div>
                  <div className="text-2xl font-bold text-green-600">8/10</div>
                  <div className="text-xs text-muted-foreground">severo</div>
                </div>
              </div>

              {/* Información técnica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Componente Técnico</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <code>VitalSignsModal.tsx</code>
                    </div>
                    <div>
                      Ubicación: <code>/components/modals/</code>
                    </div>
                    <div>Validación de rangos normales</div>
                    <div>Cálculo automático de IMC</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Estado del Paciente</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <strong>Condición:</strong> Signos vitales alterados
                    </div>
                    <div>
                      <strong>Alerta:</strong> Múltiples parámetros fuera de
                      rango
                    </div>
                    <div>
                      <strong>IMC:</strong> 26.4 (sobrepeso)
                    </div>
                    <div>
                      <strong>Observaciones:</strong> Paciente sudorosa y pálida
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modal */}
          {isModalOpen && <VitalSignsModal />}
        </div>
      </div>
    </MockFormProvider>
  );
}
