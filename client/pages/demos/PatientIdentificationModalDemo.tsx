import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockFormProvider } from "@/context/MockFormContext";
import PatientIdentificationModal from "@/components/modals/PatientIdentificationModal";
import { ArrowLeft, User, Info, Eye } from "lucide-react";

export default function PatientIdentificationModalDemo() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MockFormProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Demo: Identificación del Paciente
                </h1>
                <p className="text-muted-foreground">
                  Vista de demostración del modal de identificación de paciente
                </p>
              </div>
            </div>
            
            <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
              Modal Demo
            </Badge>
          </div>

          {/* Información del componente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Propósito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este modal captura la información básica de identificación del paciente, 
                  incluyendo datos personales, contacto y seguro médico.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Campos Incluidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Datos de identificación</li>
                  <li>• Información personal</li>
                  <li>• Datos de contacto</li>
                  <li>• Contacto de emergencia</li>
                  <li>• Información del seguro</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  Funcionalidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Validación en tiempo real</li>
                  <li>• Campos obligatorios</li>
                  <li>• Formato de documentos</li>
                  <li>• Datos precargados (demo)</li>
                  <li>• Navegación entre pasos</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Demo del modal */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Demostración del Modal</CardTitle>
              <p className="text-muted-foreground">
                Haz clic en el botón para abrir el modal de identificación del paciente con datos de ejemplo
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
                <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Modal de Identificación</h3>
                <p className="text-muted-foreground mb-6">
                  Este modal contiene todos los campos necesarios para la identificación 
                  completa del paciente en el sistema de remisión.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Abrir Modal de Identificación
                </Button>
              </div>

              {/* Información técnica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Componente Técnico</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div><code>PatientIdentificationModal.tsx</code></div>
                    <div>Ubicación: <code>/components/modals/</code></div>
                    <div>Context: MockFormProvider</div>
                    <div>Validación: Zod Schema</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Datos de Ejemplo</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Paciente: María Elena Rodríguez</div>
                    <div>Documento: CC 12345678</div>
                    <div>EPS: Nueva EPS</div>
                    <div>Contacto: +57 301 234 5678</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modal */}
          <PatientIdentificationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </MockFormProvider>
  );
}
