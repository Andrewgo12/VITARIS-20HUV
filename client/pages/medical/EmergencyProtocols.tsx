import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, Heart, Brain, Zap, Timer, Phone, Users } from "lucide-react";

const emergencyProtocols = [
  {
    id: "RCP",
    title: "Reanimación Cardiopulmonar",
    category: "Cardiovascular",
    severity: "CRITICO",
    icon: Heart,
    steps: ["Verificar responsividad", "Activar código azul", "Iniciar compresiones", "Administrar epinefrina", "Desfibrilar si indicado"],
    medications: ["Epinefrina 1mg IV", "Amiodarona 300mg IV", "Atropina 1mg IV"],
    timeLimit: "Inmediato",
    team: ["Médico intensivista", "Enfermería especializada", "Técnico respiratorio"]
  },
  {
    id: "STROKE",
    title: "Código Stroke",
    category: "Neurológico", 
    severity: "CRITICO",
    icon: Brain,
    steps: ["Evaluación FAST", "TAC cerebral urgente", "Laboratorios stat", "Evaluación neurológica", "Considerar trombolítico"],
    medications: ["Alteplase (tPA)", "Ácido acetilsalicílico", "Anticoagulantes"],
    timeLimit: "4.5 horas",
    team: ["Neurólogo", "Radiólogo", "Enfermería stroke"]
  }
];

export default function EmergencyProtocols() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/system")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al Sistema
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Protocolos de Emergencia
              </h1>
              <p className="text-muted-foreground">Guías de manejo para situaciones críticas</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="protocols" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="protocols"><AlertTriangle className="w-4 h-4 mr-2" />Protocolos</TabsTrigger>
            <TabsTrigger value="codes"><Zap className="w-4 h-4 mr-2" />Códigos</TabsTrigger>
            <TabsTrigger value="training"><Users className="w-4 h-4 mr-2" />Entrenamiento</TabsTrigger>
          </TabsList>

          <TabsContent value="protocols" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyProtocols.map((protocol) => {
                const IconComponent = protocol.icon;
                return (
                  <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-8 h-8 text-red-600" />
                        <div>
                          <CardTitle className="text-xl">{protocol.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className="bg-red-500 text-white">{protocol.severity}</Badge>
                            <Badge variant="outline">{protocol.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Pasos del protocolo:</h4>
                        <ol className="space-y-1 text-sm">
                          {protocol.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Medicamentos:</h4>
                        <div className="space-y-1">
                          {protocol.medications.map((med, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1">{med}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Límite de tiempo:</strong>
                          <div className="text-red-600 font-medium">{protocol.timeLimit}</div>
                        </div>
                        <div>
                          <strong>Equipo requerido:</strong>
                          <div>{protocol.team.length} especialistas</div>
                        </div>
                      </div>

                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Activar Protocolo
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="codes" className="space-y-6">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema de Códigos:</strong> Códigos azul (paro cardíaco), rojo (incendio), 
                amarillo (evacuación), verde (emergencia externa), etc.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Entrenamiento:</strong> Simulacros regulares, certificaciones BLS/ACLS,
                evaluación de competencias y mejora continua.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
