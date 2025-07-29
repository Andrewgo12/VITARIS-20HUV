import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockFormProvider } from "@/context/MockFormContext";
import DocumentsModal from "@/components/modals/DocumentsModal";
import {
  ArrowLeft,
  Files,
  Info,
  Eye,
  FileText,
  Upload,
  CheckCircle,
} from "lucide-react";

export default function DocumentsModalDemo() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MockFormProvider>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Demo: Gestión de Documentos
                </h1>
                <p className="text-muted-foreground">
                  Vista de demostración del modal de gestión y verificación de
                  documentos
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-sm bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Modal Demo
            </Badge>
          </div>

          {/* Información del componente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-600" />
                  Propósito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modal para la gestión completa de documentos requeridos en el
                  proceso de remisión, incluyendo verificación y carga de
                  archivos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Files className="w-5 h-5 text-green-600" />
                  Documentos Requeridos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Autorización de la EPS</li>
                  <li>• Cédula de identidad</li>
                  <li>• Tarjeta del seguro</li>
                  <li>• Consentimiento informado</li>
                  <li>• Resultados de laboratorio</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Funcionalidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verificación de documentos</li>
                  <li>• Carga de archivos</li>
                  <li>• Validación de formatos</li>
                  <li>• Lista de documentos adicionales</li>
                  <li>• Observaciones y notas</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Demo del modal */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Demostración del Modal</CardTitle>
              <p className="text-muted-foreground">
                Haz clic en el botón para abrir el modal de documentos con un
                conjunto completo de archivos verificados
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-lg">
                <Files className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Modal de Gestión de Documentos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Contiene todos los documentos requeridos ya verificados y
                  cargados para el caso de remisión médica de emergencia.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Abrir Modal de Documentos
                </Button>
              </div>

              {/* Estado de los documentos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-700">
                    Documentos Básicos
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <div>✓ Autorización EPS</div>
                    <div>✓ Cédula de identidad</div>
                    <div>✓ Tarjeta del seguro</div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-700">
                    Documentos Médicos
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <div>✓ Consentimiento informado</div>
                    <div>✓ Resultados de laboratorio</div>
                    <div>✓ Electrocardiograma</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-700">
                    Estado de Carga
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <div>📄 3 archivos cargados</div>
                    <div>✅ Verificación completa</div>
                    <div>📝 Con observaciones</div>
                  </div>
                </div>
              </div>

              {/* Información técnica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Componente Técnico</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <code>DocumentsModal.tsx</code>
                    </div>
                    <div>
                      Ubicación: <code>/components/modals/</code>
                    </div>
                    <div>Validación de archivos</div>
                    <div>Gestión de estado de documentos</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Documentos Demo</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <strong>Autorización:</strong> AUT-2024-001567
                    </div>
                    <div>
                      <strong>EPS:</strong> Nueva EPS
                    </div>
                    <div>
                      <strong>Estado:</strong> Documentación completa
                    </div>
                    <div>
                      <strong>Observaciones:</strong> En orden
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles del proceso */}
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold mb-2">Proceso de Verificación</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Estado actual:</strong> Todos los documentos han sido
                  verificados y están completos. La autorización de la EPS está
                  vigente y el consentimiento informado ha sido firmado por la
                  paciente. La documentación médica incluye ECG con cambios del
                  STEMI y laboratorios que confirman el diagnóstico.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modal */}
          <DocumentsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </MockFormProvider>
  );
}
