import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmergencyCodeModal from "@/components/modals/EmergencyCodeModal";
import {
  ArrowLeft,
  AlertTriangle,
  Heart,
  Brain,
  Zap,
  Timer,
  Phone,
  Users,
  History,
  Award,
  Calendar,
  Eye,
  UserPlus,
  BarChart3,
  Siren,
} from "lucide-react";

const emergencyProtocols = [
  {
    id: "RCP",
    title: "Reanimación Cardiopulmonar",
    category: "Cardiovascular",
    severity: "CRITICO",
    icon: Heart,
    steps: [
      "Verificar responsividad",
      "Activar código azul",
      "Iniciar compresiones",
      "Administrar epinefrina",
      "Desfibrilar si indicado",
    ],
    medications: [
      "Epinefrina 1mg IV",
      "Amiodarona 300mg IV",
      "Atropina 1mg IV",
    ],
    timeLimit: "Inmediato",
    team: [
      "Médico intensivista",
      "Enfermería especializada",
      "Técnico respiratorio",
    ],
  },
  {
    id: "STROKE",
    title: "Código Stroke",
    category: "Neurológico",
    severity: "CRITICO",
    icon: Brain,
    steps: [
      "Evaluación FAST",
      "TAC cerebral urgente",
      "Laboratorios stat",
      "Evaluación neurológica",
      "Considerar trombolítico",
    ],
    medications: [
      "Alteplase (tPA)",
      "Ácido acetilsalicílico",
      "Anticoagulantes",
    ],
    timeLimit: "4.5 horas",
    team: ["Neurólogo", "Radiólogo", "Enfermería stroke"],
  },
];

export default function EmergencyProtocols() {
  const navigate = useNavigate();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [selectedEmergencyCode, setSelectedEmergencyCode] = useState("");

  const handleActivateCode = (code: string) => {
    setSelectedEmergencyCode(code);
    setIsEmergencyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Protocolos de Emergencia
              </h1>
              <p className="text-muted-foreground">
                Guías de manejo para situaciones críticas
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <Siren className="w-4 h-4" />
            Activar Código de Emergencia
          </Button>
        </div>

        <Tabs defaultValue="protocols" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="protocols">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Protocolos
            </TabsTrigger>
            <TabsTrigger value="codes">
              <Zap className="w-4 h-4 mr-2" />
              Códigos
            </TabsTrigger>
            <TabsTrigger value="training">
              <Users className="w-4 h-4 mr-2" />
              Entrenamiento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="protocols" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyProtocols.map((protocol) => {
                const IconComponent = protocol.icon;
                return (
                  <Card
                    key={protocol.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-8 h-8 text-red-600" />
                        <div>
                          <CardTitle className="text-xl">
                            {protocol.title}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className="bg-red-500 text-white">
                              {protocol.severity}
                            </Badge>
                            <Badge variant="outline">{protocol.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Pasos del protocolo:
                        </h4>
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
                            <Badge
                              key={index}
                              variant="outline"
                              className="mr-1 mb-1"
                            >
                              {med}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Límite de tiempo:</strong>
                          <div className="text-red-600 font-medium">
                            {protocol.timeLimit}
                          </div>
                        </div>
                        <div>
                          <strong>Equipo requerido:</strong>
                          <div>{protocol.team.length} especialistas</div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setIsEmergencyModalOpen(true)}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Códigos de Emergencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Códigos de Emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        code: "CÓDIGO AZUL",
                        description: "Paro Cardiorrespiratorio",
                        action: "Equipo de reanimación - UCI",
                        color: "blue",
                        priority: "CRITICAL",
                      },
                      {
                        code: "CÓDIGO ROJO",
                        description: "Incendio o Emergencia de Fuego",
                        action: "Evacuación inmediata - Bomberos",
                        color: "red",
                        priority: "CRITICAL",
                      },
                      {
                        code: "CÓDIGO AMARILLO",
                        description: "Evacuación por Amenaza",
                        action: "Evacuación ordenada - Seguridad",
                        color: "yellow",
                        priority: "HIGH",
                      },
                      {
                        code: "CÓDIGO VERDE",
                        description: "Emergencia Externa",
                        action: "Preparación para víctimas masivas",
                        color: "green",
                        priority: "HIGH",
                      },
                      {
                        code: "CÓDIGO NEGRO",
                        description: "Amenaza de Seguridad",
                        action: "Cierre de accesos - Policía",
                        color: "gray",
                        priority: "CRITICAL",
                      },
                      {
                        code: "CÓDIGO BLANCO",
                        description: "Emergencia Pediátrica",
                        action: "Equipo pediátrico de emergencia",
                        color: "purple",
                        priority: "HIGH",
                      },
                    ].map((emergency, idx) => (
                      <Card
                        key={idx}
                        className={`p-4 border-l-4 border-${emergency.color}-500`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="font-bold text-lg">
                              {emergency.code}
                            </div>
                            <Badge
                              variant={
                                emergency.priority === "CRITICAL"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {emergency.priority}
                            </Badge>
                          </div>
                          <div className="font-medium">
                            {emergency.description}
                          </div>
                          <div className="text-sm text-gray-600">
                            {emergency.action}
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() =>
                              handleActivateCode(emergency.code.split(" ")[1])
                            } // Extract color from code
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Activar Código
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estado de Equipos de Emergencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Equipos de Respuesta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        team: "Equipo de Reanimación",
                        status: "AVAILABLE",
                        location: "UCI - Planta 3",
                        members: 4,
                        responseTime: "< 3 min",
                      },
                      {
                        team: "Equipo de Trauma",
                        status: "BUSY",
                        location: "Quirófano 2",
                        members: 6,
                        responseTime: "< 5 min",
                      },
                      {
                        team: "Equipo Pediátrico",
                        status: "AVAILABLE",
                        location: "Pediatría",
                        members: 3,
                        responseTime: "< 4 min",
                      },
                      {
                        team: "Equipo de Seguridad",
                        status: "AVAILABLE",
                        location: "Central de Seguridad",
                        members: 8,
                        responseTime: "< 2 min",
                      },
                    ].map((team, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{team.team}</div>
                            <Badge
                              variant={
                                team.status === "AVAILABLE"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {team.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Ubicación: {team.location}</div>
                            <div>Miembros: {team.members}</div>
                            <div>Tiempo de respuesta: {team.responseTime}</div>
                          </div>
                          {team.status === "AVAILABLE" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Contactar Equipo
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activaciones Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-600" />
                  Activaciones Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "14:32",
                      code: "CÓDIGO AZUL",
                      location: "Habitación 301",
                      duration: "12 min",
                      outcome: "Exitoso",
                      status: "completed",
                    },
                    {
                      time: "09:15",
                      code: "CÓDIGO AMARILLO",
                      location: "Edificio Principal",
                      duration: "45 min",
                      outcome: "Falsa alarma",
                      status: "completed",
                    },
                    {
                      time: "03:28",
                      code: "CÓDIGO AZUL",
                      location: "Urgencias",
                      duration: "8 min",
                      outcome: "Exitoso",
                      status: "completed",
                    },
                  ].map((activation, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">
                          {activation.time}
                        </div>
                        <div className="font-bold">{activation.code}</div>
                        <div className="text-sm text-gray-600">
                          {activation.location}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm">
                          Duración: {activation.duration}
                        </div>
                        <Badge
                          variant={
                            activation.outcome === "Exitoso"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {activation.outcome}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Certificaciones del Personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Estado de Certificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        certification: "BLS (Basic Life Support)",
                        certified: 156,
                        total: 180,
                        expiring: 12,
                        status: "good",
                      },
                      {
                        certification: "ACLS (Advanced Cardiac Life Support)",
                        certified: 89,
                        total: 120,
                        expiring: 8,
                        status: "warning",
                      },
                      {
                        certification: "PALS (Pediatric Advanced Life Support)",
                        certified: 34,
                        total: 45,
                        expiring: 3,
                        status: "good",
                      },
                      {
                        certification: "NRP (Neonatal Resuscitation)",
                        certified: 23,
                        total: 30,
                        expiring: 5,
                        status: "warning",
                      },
                    ].map((cert, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">
                            {cert.certification}
                          </div>
                          <Badge
                            variant={
                              cert.status === "good" ? "default" : "secondary"
                            }
                          >
                            {cert.certified}/{cert.total}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${cert.status === "good" ? "bg-green-500" : "bg-yellow-500"}`}
                            style={{
                              width: `${(cert.certified / cert.total) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          {cert.expiring} certificaciones expiran próximamente
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Próximos Entrenamientos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Próximos Entrenamientos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Simulacro de Código Azul",
                        date: "2024-01-18",
                        time: "14:00",
                        location: "Simulador UCI",
                        participants: 25,
                        type: "simulation",
                      },
                      {
                        title: "Certificación BLS",
                        date: "2024-01-20",
                        time: "09:00",
                        location: "Aula 3",
                        participants: 15,
                        type: "certification",
                      },
                      {
                        title: "Actualización ACLS",
                        date: "2024-01-25",
                        time: "15:00",
                        location: "Centro de Simulación",
                        participants: 12,
                        type: "update",
                      },
                      {
                        title: "Simulacro de Evacuación",
                        date: "2024-01-28",
                        time: "10:00",
                        location: "Todo el Hospital",
                        participants: 200,
                        type: "simulation",
                      },
                    ].map((training, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{training.title}</div>
                            <Badge
                              variant={
                                training.type === "certification"
                                  ? "default"
                                  : training.type === "simulation"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {training.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>
                              {training.date} a las {training.time}
                            </div>
                            <div>{training.location}</div>
                            <div>{training.participants} participantes</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                            <Button size="sm">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Inscribirse
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historial de Entrenamientos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Estadísticas de Entrenamiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      metric: "Simulacros Realizados",
                      value: 24,
                      period: "Este año",
                      change: "+3 vs año anterior",
                    },
                    {
                      metric: "Personal Certificado",
                      value: "87%",
                      period: "Actual",
                      change: "+5% vs mes anterior",
                    },
                    {
                      metric: "Tiempo Promedio Respuesta",
                      value: "2.8 min",
                      period: "Último mes",
                      change: "-0.3 min vs anterior",
                    },
                    {
                      metric: "Efectividad Entrenamientos",
                      value: "94%",
                      period: "Evaluaciones",
                      change: "+2% vs trimestre anterior",
                    },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">{stat.metric}</div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.period}</div>
                      <div className="text-xs text-green-600">
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <EmergencyCodeModal
          open={isEmergencyModalOpen}
          onOpenChange={setIsEmergencyModalOpen}
          preselectedCode={selectedEmergencyCode}
        />
      </div>
    </div>
  );
}
