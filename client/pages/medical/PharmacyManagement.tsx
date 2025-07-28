import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, Pill, AlertTriangle, CheckCircle, Search, Plus, 
  Calendar, User, Clock, FileText, Activity, Zap, Building
} from "lucide-react";

const mockMedications = [
  {
    id: "MED-001",
    patient: { name: "María Elena Rodríguez", room: "UCI-101", id: "P001" },
    medication: "Atorvastatina",
    dose: "40mg",
    frequency: "Cada 24 horas",
    route: "Oral",
    status: "ACTIVO",
    prescriber: "Dr. Carlos Mendoza",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    stock: 45,
    interactions: ["Warfarina"],
    allergies: false
  },
  {
    id: "MED-002", 
    patient: { name: "Carlos Alberto Vásquez", room: "TRAUMA-205", id: "P002" },
    medication: "Morfina",
    dose: "10mg",
    frequency: "PRN dolor",
    route: "IV",
    status: "ACTIVO",
    prescriber: "Dra. Ana Martínez",
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    stock: 12,
    interactions: [],
    allergies: false
  }
];

export default function PharmacyManagement() {
  const navigate = useNavigate();
  const [medications] = useState(mockMedications);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Gestión Farmacéutica
              </h1>
              <p className="text-muted-foreground">
                Control completo de medicamentos, prescripciones e inventario
              </p>
            </div>
          </div>
          <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4" />
            Nueva Prescripción
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{medications.length}</div>
              <div className="text-sm text-muted-foreground">Prescripciones Activas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-muted-foreground">Medicamentos en Stock</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">8</div>
              <div className="text-sm text-muted-foreground">Stock Bajo</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-muted-foreground">Interacciones Detectadas</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="prescriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Prescripciones
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Interacciones
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-6">
            <div className="space-y-4">
              {medications.map((med) => (
                <Card key={med.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold">{med.patient.name}</h3>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><strong>Habitación:</strong> {med.patient.room}</div>
                          <div><strong>ID Paciente:</strong> {med.patient.id}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Pill className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold">Medicamento</h4>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><strong>Nombre:</strong> {med.medication}</div>
                          <div><strong>Dosis:</strong> {med.dose}</div>
                          <div><strong>Frecuencia:</strong> {med.frequency}</div>
                          <div><strong>Vía:</strong> {med.route}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Prescripción</h4>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><strong>Médico:</strong> {med.prescriber}</div>
                          <div><strong>Inicio:</strong> {med.startDate}</div>
                          <div><strong>Fin:</strong> {med.endDate}</div>
                          <Badge className="bg-green-500 text-white">{med.status}</Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Control</h4>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><strong>Stock:</strong> {med.stock} unidades</div>
                          {med.interactions.length > 0 && (
                            <div className="text-red-600">
                              <strong>Interacciones:</strong> {med.interactions.join(", ")}
                            </div>
                          )}
                          {!med.allergies && (
                            <div className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Sin alergias conocidas
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">Administrar</Button>
                          <Button size="sm" variant="outline" className="w-full">Ver Historia</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Alert>
              <Building className="h-4 w-4" />
              <AlertDescription>
                <strong>Gestión de Inventario:</strong> Control de stock, fechas de vencimiento, 
                proveedores, y sistema de alertas automáticas para reposición.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema de Interacciones:</strong> Detección automática de interacciones 
                medicamentosas, alergias y contraindicaciones en tiempo real.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Reportes Farmacéuticos:</strong> Estadísticas de consumo, análisis de costos,
                reportes de seguridad y cumplimiento regulatorio.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
