import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  Heart,
  Activity,
  Thermometer,
  Scale,
  Timer,
  AlertTriangle,
  Info,
  CheckCircle,
  Pill,
  Stethoscope,
  ArrowLeft,
  Brain,
  Zap,
  Target,
  Clock,
} from "lucide-react";

export default function MedicalTools() {
  const navigate = useNavigate();

  // Estados para las calculadoras
  const [bmirValues, setBmirValues] = useState({ weight: "", height: "" });
  const [bmirResult, setBmirResult] = useState<any>(null);

  const [heartRateValues, setHeartRateValues] = useState({
    age: "",
    restingHR: "",
  });
  const [heartRateResult, setHeartRateResult] = useState<any>(null);

  const [dosageValues, setDosageValues] = useState({
    weight: "",
    medication: "",
    dosagePerKg: "",
  });
  const [dosageResult, setDosageResult] = useState<any>(null);

  // Cálculo de IMC
  const calculateBMI = () => {
    const weight = parseFloat(bmirValues.weight);
    const height = parseFloat(bmirValues.height) / 100; // convertir cm a metros

    if (weight > 0 && height > 0) {
      const bmi = weight / (height * height);
      let category = "";
      let color = "";
      let recommendation = "";

      if (bmi < 18.5) {
        category = "Bajo peso";
        color = "text-blue-600";
        recommendation =
          "Consultar con nutricionista para plan de aumento de peso";
      } else if (bmi < 25) {
        category = "Peso normal";
        color = "text-green-600";
        recommendation = "Mantener estilo de vida saludable";
      } else if (bmi < 30) {
        category = "Sobrepeso";
        color = "text-yellow-600";
        recommendation = "Considerar plan de reducción de peso";
      } else {
        category = "Obesidad";
        color = "text-red-600";
        recommendation = "Consulta médica especializada recomendada";
      }

      setBmirResult({
        bmi: bmi.toFixed(1),
        category,
        color,
        recommendation,
      });
    }
  };

  // Cálculo de zonas de frecuencia cardíaca
  const calculateHeartRateZones = () => {
    const age = parseInt(heartRateValues.age);
    const restingHR = parseInt(heartRateValues.restingHR);

    if (age > 0 && restingHR > 0) {
      const maxHR = 220 - age;
      const hrReserve = maxHR - restingHR;

      const zones = {
        recovery: {
          min: Math.round(restingHR + hrReserve * 0.5),
          max: Math.round(restingHR + hrReserve * 0.6),
          name: "Recuperación",
          color: "bg-green-100 text-green-800",
        },
        aerobic: {
          min: Math.round(restingHR + hrReserve * 0.6),
          max: Math.round(restingHR + hrReserve * 0.7),
          name: "Aeróbico",
          color: "bg-blue-100 text-blue-800",
        },
        anaerobic: {
          min: Math.round(restingHR + hrReserve * 0.7),
          max: Math.round(restingHR + hrReserve * 0.8),
          name: "Anaeróbico",
          color: "bg-yellow-100 text-yellow-800",
        },
        maxEffort: {
          min: Math.round(restingHR + hrReserve * 0.8),
          max: maxHR,
          name: "Máximo Esfuerzo",
          color: "bg-red-100 text-red-800",
        },
      };

      setHeartRateResult({ maxHR, zones });
    }
  };

  // Cálculo de dosificación
  const calculateDosage = () => {
    const weight = parseFloat(dosageValues.weight);
    const dosagePerKg = parseFloat(dosageValues.dosagePerKg);

    if (weight > 0 && dosagePerKg > 0) {
      const totalDose = weight * dosagePerKg;
      setDosageResult({
        totalDose: totalDose.toFixed(2),
        weight,
        dosagePerKg,
        medication: dosageValues.medication,
      });
    }
  };

  // Protocolos de emergencia
  const emergencyProtocols = [
    {
      id: "rcp",
      title: "RCP Adultos",
      icon: Heart,
      color: "bg-red-500",
      steps: [
        "Verificar responsividad y respiración",
        "Activar sistema de emergencias",
        "Posición: manos en centro del pecho",
        "Compresiones: 30 x 2 ventilaciones",
        "Frecuencia: 100-120 por minuto",
        "Profundidad: 5-6 cm",
        "Continuar hasta llegada de ayuda",
      ],
    },
    {
      id: "shock",
      title: "Shock Anafiláctico",
      icon: AlertTriangle,
      color: "bg-orange-500",
      steps: [
        "Eliminar o alejarse del alérgeno",
        "Epinefrina IM inmediatamente",
        "Posición supina con piernas elevadas",
        "Oxígeno al 100%",
        "Acceso venoso con SSN",
        "Corticoides IV",
        "Monitoreo continuo",
      ],
    },
    {
      id: "stroke",
      title: "Código Stroke",
      icon: Brain,
      color: "bg-purple-500",
      steps: [
        "FAST: Cara, Brazos, Habla, Tiempo",
        "Hora de inicio de síntomas",
        "TC cerebral urgente",
        "Glicemia y signos vitales",
        "Evaluación neurológica",
        "Considerar trombolítico",
        "Traslado a UCI",
      ],
    },
  ];

  // Medicamentos de emergencia
  const emergencyMeds = [
    {
      name: "Epinefrina",
      indication: "Shock anafiláctico, Paro cardíaco",
      dose: "0.3-0.5mg IM (1:1000) / 1mg IV (1:10000)",
      route: "IM, IV",
    },
    {
      name: "Adenosina",
      indication: "Taquicardia supraventricular",
      dose: "6mg IV bolo, luego 12mg si no respuesta",
      route: "IV",
    },
    {
      name: "Atropina",
      indication: "Bradicardia sintomática",
      dose: "0.5-1mg IV cada 3-5 min (máx 3mg)",
      route: "IV",
    },
    {
      name: "Amiodarona",
      indication: "Arritmias ventriculares",
      dose: "150mg IV en 10 min, luego infusión",
      route: "IV",
    },
  ];

  // Tiempos críticos
  const criticalTimes = [
    {
      condition: "Stroke",
      timeWindow: "4.5 horas",
      intervention: "Trombolítico",
      icon: Brain,
      color: "text-purple-600",
    },
    {
      condition: "IAM",
      timeWindow: "90 minutos",
      intervention: "Angioplastia",
      icon: Heart,
      color: "text-red-600",
    },
    {
      condition: "Trauma Severo",
      timeWindow: "1 hora dorada",
      intervention: "Cirugía",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      condition: "Sepsis",
      timeWindow: "1 hora",
      intervention: "Antibióticos",
      icon: Zap,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-secondary/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
                Herramientas Médicas
              </h1>
              <p className="text-muted-foreground">
                Calculadoras, protocolos y herramientas para la práctica clínica
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="calculators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="calculators"
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Calculadoras
            </TabsTrigger>
            <TabsTrigger value="protocols" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Protocolos
            </TabsTrigger>
            <TabsTrigger
              value="medications"
              className="flex items-center gap-2"
            >
              <Pill className="w-4 h-4" />
              Medicamentos
            </TabsTrigger>
            <TabsTrigger value="times" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Tiempos Críticos
            </TabsTrigger>
          </TabsList>

          {/* Calculadoras */}
          <TabsContent value="calculators" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calculadora de IMC */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-medical-blue" />
                    Calculadora de IMC
                  </CardTitle>
                  <CardDescription>Índice de Masa Corporal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={bmirValues.weight}
                      onChange={(e) =>
                        setBmirValues((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={bmirValues.height}
                      onChange={(e) =>
                        setBmirValues((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button onClick={calculateBMI} className="w-full">
                    Calcular IMC
                  </Button>

                  {bmirResult && (
                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="text-lg font-bold">
                            IMC: {bmirResult.bmi}
                          </div>
                          <div className={`font-medium ${bmirResult.color}`}>
                            {bmirResult.category}
                          </div>
                          <div className="text-sm">
                            {bmirResult.recommendation}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Monitor de Signos Vitales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-medical-green" />
                    Monitor de Signos Vitales
                  </CardTitle>
                  <CardDescription>
                    Evaluación de signos vitales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                      <div className="text-sm text-muted-foreground">
                        FC Normal
                      </div>
                      <div className="text-lg font-bold">60-100</div>
                      <div className="text-xs">lpm</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Activity className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <div className="text-sm text-muted-foreground">
                        PA Normal
                      </div>
                      <div className="text-lg font-bold">120/80</div>
                      <div className="text-xs">mmHg</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                      <div className="text-sm text-muted-foreground">
                        T° Normal
                      </div>
                      <div className="text-lg font-bold">36.5-37.2</div>
                      <div className="text-xs">°C</div>
                    </div>
                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold">
                        O2
                      </div>
                      <div className="text-sm text-muted-foreground">
                        SpO2 Normal
                      </div>
                      <div className="text-lg font-bold">95-100</div>
                      <div className="text-xs">%</div>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Valores de referencia:</strong> Estos son rangos
                      normales para adultos en reposo.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Calculadora de Dosificación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-medical-blue" />
                    Calculadora de Dosificación
                  </CardTitle>
                  <CardDescription>Dosis por peso corporal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="med-weight">Peso del paciente (kg)</Label>
                    <Input
                      id="med-weight"
                      type="number"
                      placeholder="70"
                      value={dosageValues.weight}
                      onChange={(e) =>
                        setDosageValues((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medicamento</Label>
                    <Select
                      value={dosageValues.medication}
                      onValueChange={(value) =>
                        setDosageValues((prev) => ({
                          ...prev,
                          medication: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar medicamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paracetamol">Paracetamol</SelectItem>
                        <SelectItem value="ibuprofeno">Ibuprofeno</SelectItem>
                        <SelectItem value="amoxicilina">Amoxicilina</SelectItem>
                        <SelectItem value="omeprazol">Omeprazol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosis por kg</Label>
                    <Input
                      id="dosage"
                      type="number"
                      placeholder="10"
                      value={dosageValues.dosagePerKg}
                      onChange={(e) =>
                        setDosageValues((prev) => ({
                          ...prev,
                          dosagePerKg: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button onClick={calculateDosage} className="w-full">
                    Calcular Dosis
                  </Button>

                  {dosageResult && (
                    <Alert className="mt-4">
                      <Pill className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="text-lg font-bold">
                            Dosis Total: {dosageResult.totalDose} mg
                          </div>
                          <div className="text-sm">
                            {dosageResult.medication} -{" "}
                            {dosageResult.dosagePerKg} mg/kg para{" "}
                            {dosageResult.weight} kg
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Calculadora de Frecuencia Cardíaca */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Zonas de Frecuencia Cardíaca
                </CardTitle>
                <CardDescription>
                  Calcula las zonas de entrenamiento cardíaco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Edad (años)</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="30"
                        value={heartRateValues.age}
                        onChange={(e) =>
                          setHeartRateValues((prev) => ({
                            ...prev,
                            age: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resting">FC en reposo</Label>
                      <Input
                        id="resting"
                        type="number"
                        placeholder="60"
                        value={heartRateValues.restingHR}
                        onChange={(e) =>
                          setHeartRateValues((prev) => ({
                            ...prev,
                            restingHR: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button
                      onClick={calculateHeartRateZones}
                      className="w-full"
                    >
                      Calcular Zonas
                    </Button>
                  </div>

                  {heartRateResult && (
                    <div className="md:col-span-2 space-y-4">
                      <div className="text-lg font-semibold">
                        FC Máxima: {heartRateResult.maxHR} lpm
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(heartRateResult.zones).map(
                          ([key, zone]: [string, any]) => (
                            <div
                              key={key}
                              className={`p-4 rounded-lg ${zone.color}`}
                            >
                              <div className="font-medium">{zone.name}</div>
                              <div className="text-lg font-bold">
                                {zone.min} - {zone.max} lpm
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Protocolos de Emergencia */}
          <TabsContent value="protocols" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyProtocols.map((protocol) => {
                const IconComponent = protocol.icon;
                return (
                  <Card key={protocol.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${protocol.color} text-white`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {protocol.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 text-sm">
                        {protocol.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="bg-medical-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Medicamentos de Emergencia */}
          <TabsContent value="medications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyMeds.map((med, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-medical-blue" />
                      {med.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Indicación
                      </Label>
                      <div className="text-sm mt-1">{med.indication}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Dosis
                      </Label>
                      <div className="text-sm mt-1 font-mono bg-muted p-2 rounded">
                        {med.dose}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Vía de administración
                      </Label>
                      <Badge variant="outline" className="mt-1">
                        {med.route}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tiempos Críticos */}
          <TabsContent value="times" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {criticalTimes.map((time, index) => {
                const IconComponent = time.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className={`w-5 h-5 ${time.color}`} />
                        {time.condition}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                        <Clock className="w-12 h-12 text-red-500 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-red-600">
                          {time.timeWindow}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Ventana terapéutica
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="text-sm">
                          <Target className="w-3 h-3 mr-1" />
                          {time.intervention}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Alert className="mt-6">
              <Timer className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota importante:</strong> Estos tiempos son ventanas
                críticas donde la intervención temprana puede marcar una
                diferencia significativa en el pronóstico del paciente.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
