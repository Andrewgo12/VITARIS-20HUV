import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  User,
  Heart,
  Activity,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Calendar,
  Pill,
  AlertCircle,
  CheckCircle,
  Edit,
  Printer,
  Share,
  MoreHorizontal
} from "lucide-react";

// Mock data expandido del paciente
const getPatientDetail = (id: string) => {
  const patients = {
    "1": {
      id: 1,
      name: "María Elena Rodríguez",
      age: 67,
      gender: "Femenino",
      admissionTime: "2024-01-15T08:30:00",
      symptoms: "Dolor torácico agudo, dificultad respiratoria, sudoración profusa",
      diagnosis: "Posible infarto agudo de miocardio",
      urgencyLevel: "CRITICO",
      doctor: "Dr. Carlos Mendoza",
      room: "UCI-101",
      process: "cardiologia",
      vitals: {
        heartRate: "120",
        bloodPressure: "180/95",
        temperature: "38.5",
        oxygenSaturation: "89",
        respiratoryRate: "28"
      },
      lastUpdate: "Hace 2 minutos",
      status: "En observación",
      medications: ["Aspirina 100mg", "Atorvastatina 40mg", "Metoprolol 50mg"],
      allergies: ["Penicilina", "Mariscos"],
      bloodType: "O+",
      weight: "72kg",
      height: "1.65m",
      contactPhone: "+57 301 234 5678",
      emergencyContact: "José Rodríguez (Hijo) - +57 320 987 6543",
      address: "Calle 45 #23-67, Bogotá",
      occupation: "Profesora jubilada",
      civilStatus: "Viuda",
      insurance: "Nueva EPS",
      admissionReason: "Dolor torácico de inicio súbito",
      medicalHistory: [
        "Hipertensión arterial - 10 años",
        "Diabetes mellitus tipo 2 - 8 años",
        "Hiperlipidemia - 5 años",
        "Osteoporosis - 3 años"
      ],
      surgicalHistory: [
        "Apendicectomía - 1987",
        "Colecistectomía - 2015"
      ],
      familyHistory: [
        "Padre: Cardiopatía isquémica",
        "Madre: Diabetes mellitus",
        "Hermano: Hipertensión arterial"
      ],
      currentTreatment: [
        {
          medication: "Aspirina",
          dose: "100mg",
          frequency: "Cada 24 horas",
          route: "Oral",
          startDate: "2024-01-15"
        },
        {
          medication: "Atorvastatina",
          dose: "40mg",
          frequency: "Cada 24 horas",
          route: "Oral",
          startDate: "2024-01-15"
        },
        {
          medication: "Metoprolol",
          dose: "50mg",
          frequency: "Cada 12 horas",
          route: "Oral",
          startDate: "2024-01-15"
        }
      ],
      vitalHistory: [
        {
          time: "16:00",
          heartRate: "118",
          bloodPressure: "175/90",
          temperature: "38.3",
          oxygenSaturation: "91",
          respiratoryRate: "26"
        },
        {
          time: "14:00",
          heartRate: "122",
          bloodPressure: "185/100",
          temperature: "38.7",
          oxygenSaturation: "88",
          respiratoryRate: "30"
        },
        {
          time: "12:00",
          heartRate: "125",
          bloodPressure: "190/105",
          temperature: "38.9",
          oxygenSaturation: "86",
          respiratoryRate: "32"
        }
      ],
      clinicalNotes: [
        {
          time: "15:45",
          author: "Dr. Carlos Mendoza",
          note: "Paciente continúa con dolor torácico intermitente. ECG muestra cambios compatibles con STEMI. Se administra trombolítico. Monitoreo continuo."
        },
        {
          time: "13:30",
          author: "Enf. Ana García",
          note: "Paciente refiere mejoría leve del dolor torácico. Signos vitales estables. Familiar acompañante informado del estado."
        },
        {
          time: "11:15",
          author: "Dr. Carlos Mendoza",
          note: "Ingreso a UCI. Paciente consciente, orientada. Dolor torácico 8/10. Iniciamos protocolo IAM."
        }
      ]
    },
    "2": {
      id: 2,
      name: "Carlos Alberto Vásquez",
      age: 34,
      gender: "Masculino",
      admissionTime: "2024-01-15T10:15:00",
      symptoms: "Fractura abierta en tibia derecha, dolor severo",
      diagnosis: "Fractura expuesta de tibia y peroné",
      urgencyLevel: "URGENTE",
      doctor: "Dra. Ana Martínez",
      room: "TRAUMA-205",
      process: "traumatologia",
      vitals: {
        heartRate: "95",
        bloodPressure: "140/85",
        temperature: "37.2",
        oxygenSaturation: "96",
        respiratoryRate: "22"
      },
      lastUpdate: "Hace 15 minutos",
      status: "Pre-quirúrgico",
      medications: ["Morfina 10mg", "Clindamicina 600mg"],
      allergies: ["Ninguna conocida"],
      bloodType: "A+",
      weight: "85kg",
      height: "1.78m",
      contactPhone: "+57 312 456 7890",
      emergencyContact: "Laura Vásquez (Esposa) - +57 315 678 9012",
      address: "Carrera 15 #78-45, Medellín",
      occupation: "Ingeniero civil",
      civilStatus: "Casado",
      insurance: "Sanitas EPS",
      admissionReason: "Accidente de motocicleta - fractura expuesta",
      medicalHistory: [
        "Sin antecedentes médicos relevantes"
      ],
      surgicalHistory: [
        "Ninguna cirugía previa"
      ],
      familyHistory: [
        "Sin antecedentes familiares relevantes"
      ],
      currentTreatment: [
        {
          medication: "Morfina",
          dose: "10mg",
          frequency: "Cada 6 horas PRN",
          route: "IV",
          startDate: "2024-01-15"
        },
        {
          medication: "Clindamicina",
          dose: "600mg",
          frequency: "Cada 8 horas",
          route: "IV",
          startDate: "2024-01-15"
        }
      ],
      vitalHistory: [
        {
          time: "16:00",
          heartRate: "92",
          bloodPressure: "135/80",
          temperature: "37.0",
          oxygenSaturation: "97",
          respiratoryRate: "20"
        },
        {
          time: "14:00",
          heartRate: "98",
          bloodPressure: "145/90",
          temperature: "37.5",
          oxygenSaturation: "95",
          respiratoryRate: "24"
        }
      ],
      clinicalNotes: [
        {
          time: "15:30",
          author: "Dra. Ana Martínez",
          note: "Paciente programado para cirugía de reducción abierta con fijación interna (RAFI). Exámenes prequirúrgicos completos. Consentimiento informado firmado."
        },
        {
          time: "12:45",
          author: "Dr. Luis Hernández",
          note: "Radiografías confirman fractura expuesta de tibia y peroné. Herida limpia, sin signos de infección. Profilaxis antibiótica iniciada."
        }
      ]
    }
  };

  return patients[id as keyof typeof patients] || null;
};

export default function PatientDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(getPatientDetail(id || "1"));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Paciente no encontrado</h2>
            <p className="text-muted-foreground mb-4">El paciente solicitado no existe en el sistema.</p>
            <Button onClick={() => navigate("/huv-dashboard-advanced")}>
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "CRITICO": return "bg-red-500 text-white";
      case "URGENTE": return "bg-orange-500 text-white";
      case "ALTO": return "bg-yellow-500 text-black";
      case "MODERADO": return "bg-blue-500 text-white";
      case "BAJO": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getVitalStatus = (vitals: any) => {
    const hr = parseInt(vitals.heartRate);
    const temp = parseFloat(vitals.temperature);
    const oxygen = parseInt(vitals.oxygenSaturation);
    
    if (hr > 100 || temp > 38 || oxygen < 95) return { status: "Alerta", color: "text-red-600" };
    if (hr > 90 || temp > 37.5 || oxygen < 98) return { status: "Vigilancia", color: "text-yellow-600" };
    return { status: "Normal", color: "text-green-600" };
  };

  const vitalStatus = getVitalStatus(patient.vitals);

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-secondary/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/huv-dashboard-advanced")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
                Historia Clínica - {patient.name}
              </h1>
              <p className="text-muted-foreground">
                Última actualización: {currentTime.toLocaleDateString("es-CO")} - {currentTime.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Alert si es crítico */}
        {patient.urgencyLevel === "CRITICO" && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>PACIENTE EN ESTADO CRÍTICO</strong> - Requiere monitoreo continuo y atención inmediata.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del paciente */}
          <div className="lg:col-span-1 space-y-6">
            {/* Datos básicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="w-20 h-20 bg-gradient-to-br from-medical-blue to-medical-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                    {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <h3 className="font-semibold text-lg">{patient.name}</h3>
                  <Badge className={`${getUrgencyColor(patient.urgencyLevel)} mt-1`}>
                    {patient.urgencyLevel}
                  </Badge>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Edad:</span>
                    <span>{patient.age} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Género:</span>
                    <span>{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tipo de sangre:</span>
                    <span className="font-mono">{patient.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Peso:</span>
                    <span>{patient.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Altura:</span>
                    <span>{patient.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Estado civil:</span>
                    <span>{patient.civilStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ocupación:</span>
                    <span>{patient.occupation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">EPS:</span>
                    <span>{patient.insurance}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contacto
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>{patient.contactPhone}</div>
                    <div className="text-muted-foreground">{patient.emergencyContact}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Dirección
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {patient.address}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signos vitales actuales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Signos Vitales Actuales
                </CardTitle>
                <Badge variant="outline" className={vitalStatus.color}>
                  {vitalStatus.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">Frecuencia Cardíaca</div>
                    <div className="text-lg font-bold text-red-700">{patient.vitals.heartRate}</div>
                    <div className="text-xs text-muted-foreground">lpm</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">Presión Arterial</div>
                    <div className="text-lg font-bold text-blue-700">{patient.vitals.bloodPressure}</div>
                    <div className="text-xs text-muted-foreground">mmHg</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">Temperatura</div>
                    <div className="text-lg font-bold text-orange-700">{patient.vitals.temperature}</div>
                    <div className="text-xs text-muted-foreground">°C</div>
                  </div>
                  <div className="text-center p-3 bg-cyan-50 rounded-lg">
                    <Droplets className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
                    <div className="text-sm text-muted-foreground">Saturación O2</div>
                    <div className="text-lg font-bold text-cyan-700">{patient.vitals.oxygenSaturation}</div>
                    <div className="text-xs text-muted-foreground">%</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Wind className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">Frecuencia Respiratoria</div>
                  <div className="text-lg font-bold text-purple-700">{patient.vitals.respiratoryRate}</div>
                  <div className="text-xs text-muted-foreground">rpm</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna principal - Información clínica */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="clinical" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="clinical">Información Clínica</TabsTrigger>
                <TabsTrigger value="treatment">Tratamiento</TabsTrigger>
                <TabsTrigger value="vitals">Historial Vital</TabsTrigger>
                <TabsTrigger value="notes">Notas Clínicas</TabsTrigger>
              </TabsList>

              <TabsContent value="clinical" className="space-y-6">
                {/* Admisión actual */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Admisión Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</label>
                        <div className="text-lg">
                          {new Date(patient.admissionTime).toLocaleDateString("es-CO")} - {new Date(patient.admissionTime).toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Médico Tratante</label>
                        <div className="text-lg">{patient.doctor}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                        <div className="text-lg">{patient.room}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Estado Actual</label>
                        <div className="text-lg">{patient.status}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Motivo de Consulta</label>
                      <div className="text-lg mt-1">{patient.admissionReason}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Síntomas Principales</label>
                      <div className="text-lg mt-1 text-red-700">{patient.symptoms}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Diagnóstico</label>
                      <div className="text-lg mt-1 font-medium">{patient.diagnosis}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Antecedentes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Antecedentes Médicos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {patient.medicalHistory.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-medical-blue rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Antecedentes Quirúrgicos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {patient.surgicalHistory.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-medical-green rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Antecedentes Familiares</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {patient.familyHistory.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Alergias */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      Alergias Conocidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-sm">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="treatment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Tratamiento Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patient.currentTreatment.map((med, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{med.medication}</h4>
                            <Badge variant="outline">Activo</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">Dosis:</span>
                              <div>{med.dose}</div>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Frecuencia:</span>
                              <div>{med.frequency}</div>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Vía:</span>
                              <div>{med.route}</div>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Inicio:</span>
                              <div>{new Date(med.startDate).toLocaleDateString("es-CO")}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Historial de Signos Vitales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patient.vitalHistory.map((vital, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Registro - {vital.time}</h4>
                            <Badge variant="outline">{vital.time}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-muted-foreground">FC</div>
                              <div className="font-medium text-red-600">{vital.heartRate} lpm</div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">PA</div>
                              <div className="font-medium text-blue-600">{vital.bloodPressure}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">T°</div>
                              <div className="font-medium text-orange-600">{vital.temperature}°C</div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">SpO2</div>
                              <div className="font-medium text-cyan-600">{vital.oxygenSaturation}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">FR</div>
                              <div className="font-medium text-purple-600">{vital.respiratoryRate} rpm</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Notas Clínicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patient.clinicalNotes.map((note, index) => (
                        <div key={index} className="border-l-4 border-medical-blue pl-4 py-2">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{note.author}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {note.time}
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
