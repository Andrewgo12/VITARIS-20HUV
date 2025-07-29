import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockFormProvider } from "@/context/MockFormContext";
import ValidationModal from "@/components/modals/ValidationModal";
import {
  ArrowLeft,
  CheckCircle,
  Info,
  Eye,
  Shield,
  Send,
  Clipboard,
} from "lucide-react";

export default function ValidationModalDemo() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MockFormProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Demo: Validación Final
                </h1>
                <p className="text-muted-foreground">
                  Vista de demostración del modal de validación y confirmación
                  de envío
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-sm bg-green-50 text-green-700 border-green-200"
            >
              Modal Demo
            </Badge>
          </div>

          {/* Información del componente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-green-600" />
                  Propósito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modal final que presenta un resumen completo de toda la
                  información capturada y permite la validación antes del envío
                  de la remisión.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-blue-600" />
                  Validaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Datos del paciente completos</li>
                  <li>• Información médica validada</li>
                  <li>• Signos vitales registrados</li>
                  <li>• Documentos verificados</li>
                  <li>• Autorización vigente</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-purple-600" />
                  Proceso de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Revisión final de datos</li>
                  <li>• Confirmación de envío</li>
                  <li>• Generación de número de caso</li>
                  <li>• Notificación al HUV</li>
                  <li>• Comprobante de recepción</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Demo del modal */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Demostración del Modal</CardTitle>
              <p className="text-muted-foreground">
                Haz clic en el botón para abrir el modal de validación con el
                resumen completo del caso médico
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Modal de Validación Final
                </h3>
                <p className="text-muted-foreground mb-6">
                  Presenta el resumen completo del caso de síndrome coronario
                  agudo listo para envío al Hospital Universitario del Valle.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Abrir Modal de Validación
                </Button>
              </div>

              {/* Estado de validación */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-green-700">Paciente</div>
                  <div className="text-sm text-muted-foreground">
                    ✓ Completo
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-green-700">
                    Diagnóstico
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ✓ Validado
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-green-700">
                    Signos Vitales
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ✓ Registrados
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-green-700">Documentos</div>
                  <div className="text-sm text-muted-foreground">
                    ✓ Verificados
                  </div>
                </div>
              </div>

              {/* Resumen del caso */}
              <div className="bg-blue-50 p-6 rounded-lg text-left">
                <h4 className="font-semibold mb-3 text-center">
                  Resumen del Caso
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div>
                      <strong>Paciente:</strong> María Elena Rodríguez
                    </div>
                    <div>
                      <strong>Edad:</strong> 67 años
                    </div>
                    <div>
                      <strong>Documento:</strong> CC 12345678
                    </div>
                    <div>
                      <strong>EPS:</strong> Nueva EPS
                    </div>
                  </div>
                  <div>
                    <div>
                      <strong>Diagnóstico:</strong> Síndrome Coronario Agudo
                    </div>
                    <div>
                      <strong>Urgencia:</strong> Alta
                    </div>
                    <div>
                      <strong>Médico:</strong> Dr. Luis F. Gómez
                    </div>
                    <div>
                      <strong>Institución:</strong> IPS San Rafael
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div>
                    <strong>Resumen Clínico:</strong> Paciente con dolor
                    torácico agudo, ECG con STEMI anterior extenso, requiere
                    manejo especializado urgente para reperfusión coronaria.
                  </div>
                </div>
              </div>

              {/* Información técnica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Componente Técnico</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <code>ValidationModal.tsx</code>
                    </div>
                    <div>
                      Ubicación: <code>/components/modals/</code>
                    </div>
                    <div>Validación completa de datos</div>
                    <div>Generación de resumen automático</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Estado de Envío</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <strong>Estado:</strong> Listo para envío
                    </div>
                    <div>
                      <strong>Validaciones:</strong> Todas pasadas
                    </div>
                    <div>
                      <strong>Destino:</strong> HUV - Cardiología
                    </div>
                    <div>
                      <strong>Prioridad:</strong> Urgencia alta
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de seguridad */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">
                    Seguridad y Privacidad
                  </h4>
                </div>
                <p className="text-sm text-amber-700 text-center">
                  Toda la información es transmitida de forma segura y
                  encriptada. El caso será procesado conforme a las normativas
                  de protección de datos en salud.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modal */}
          <ValidationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </MockFormProvider>
  );
}
