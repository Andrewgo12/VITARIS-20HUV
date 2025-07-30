import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/context/MedicalDataContext";
import type { Medication } from "@/context/MedicalDataContext";
import {
  Pill,
  AlertTriangle,
  User,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  Search,
  Plus,
  X,
} from "lucide-react";

interface NewPrescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId?: string;
  onPrescriptionCreated?: (prescription: Medication) => void;
}

const medications = [
  {
    id: "MED001",
    name: "Atorvastatina",
    activeIngredient: "Atorvastatina cálcica",
    presentations: ["10mg", "20mg", "40mg", "80mg"],
    routes: ["Oral"],
    category: "Hipolipemiante",
    contraindications: ["Embarazo", "Lactancia", "Enfermedad hepática activa"],
    interactions: ["Warfarina", "Ciclosporina", "Gemfibrozil"],
  },
  {
    id: "MED002",
    name: "Amoxicilina",
    activeIngredient: "Amoxicilina trihidrato",
    presentations: ["250mg", "500mg", "875mg"],
    routes: ["Oral", "IV"],
    category: "Antibiótico",
    contraindications: ["Alergia a penicilinas"],
    interactions: ["Warfarina", "Metotrexato"],
  },
  {
    id: "MED003",
    name: "Omeprazol",
    activeIngredient: "Omeprazol magnésico",
    presentations: ["20mg", "40mg"],
    routes: ["Oral", "IV"],
    category: "Inhibidor de bomba de protones",
    contraindications: ["Hipersensibilidad conocida"],
    interactions: ["Clopidogrel", "Warfarina", "Fenitoína"],
  },
];

const frequencies = [
  { value: "QD", label: "Una vez al día (QD)" },
  { value: "BID", label: "Dos veces al día (BID)" },
  { value: "TID", label: "Tres veces al día (TID)" },
  { value: "QID", label: "Cuatro veces al día (QID)" },
  { value: "Q4H", label: "Cada 4 horas" },
  { value: "Q6H", label: "Cada 6 horas" },
  { value: "Q8H", label: "Cada 8 horas" },
  { value: "Q12H", label: "Cada 12 horas" },
  { value: "PRN", label: "Según necesidad (PRN)" },
  { value: "STAT", label: "Inmediatamente (STAT)" },
];

const patients = [
  {
    id: "P001",
    name: "María Elena Rodríguez",
    age: 65,
    room: "UCI-101",
    allergies: ["Penicilina", "Sulfonamidas"],
    conditions: ["Hipertensión", "Diabetes tipo 2"],
    weight: 70,
  },
  {
    id: "P002",
    name: "Carlos Alberto Vásquez",
    age: 45,
    room: "TRAUMA-205",
    allergies: [],
    conditions: ["Fractura múltiple"],
    weight: 80,
  },
];

export default function NewPrescriptionModal({ open, onOpenChange }: NewPrescriptionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedMedication, setSelectedMedication] = useState<string>("");
  const [prescriptionData, setPrescriptionData] = useState({
    medication: "",
    dose: "",
    route: "",
    frequency: "",
    duration: "",
    quantity: "",
    refills: "0",
    instructions: "",
    indication: "",
    priority: "normal",
    substitutionAllowed: true,
    requiresPreauth: false,
    patientInstructions: "",
    pharmacyNotes: "",
    monitoring: {
      required: false,
      parameters: [],
      frequency: "",
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [interactions, setInteractions] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const patient = patients.find(p => p.id === selectedPatient);
  const medication = medications.find(m => m.id === selectedMedication);

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setPrescriptionData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMonitoringChange = (field: string, value: any) => {
    setPrescriptionData(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [field]: value,
      },
    }));
  };

  const checkInteractions = () => {
    if (!patient || !medication) return;

    const patientAllergies = patient.allergies;
    const medicationInteractions = medication.interactions;
    const medicationContraindications = medication.contraindications;

    // Verificar alergias
    const allergyWarnings = patientAllergies.filter(allergy => 
      medicationContraindications.some(contra => 
        contra.toLowerCase().includes(allergy.toLowerCase())
      )
    );

    // Verificar interacciones
    const currentInteractions = medicationInteractions.filter(interaction => 
      Math.random() > 0.7 // Simular que el paciente tiene algunos medicamentos
    );

    setWarnings(allergyWarnings.map(allergy => `Alergia a ${allergy}`));
    setInteractions(currentInteractions);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 2 && selectedPatient && selectedMedication) {
        checkInteractions();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Prescription Data:", {
      patient: selectedPatient,
      medication: selectedMedication,
      ...prescriptionData,
    });
    onOpenChange(false);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-700">
            Nueva Prescripción Médica
          </DialogTitle>
          <DialogDescription>
            Complete la información para generar una nueva prescripción médica
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center space-x-2 ${
                  step <= currentStep ? "text-orange-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <span className="text-sm font-medium">
                  {step === 1 && "Paciente"}
                  {step === 2 && "Medicamento"}
                  {step === 3 && "Dosificación"}
                  {step === 4 && "Revisión"}
                </span>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step < currentStep ? "bg-orange-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={currentStep.toString()} className="w-full">
          {/* Paso 1: Selección del Paciente */}
          <TabsContent value="1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Seleccionar Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatient === patient.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                      onClick={() => setSelectedPatient(patient.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <strong>ID:</strong> {patient.id}
                            </div>
                            <div>
                              <strong>Edad:</strong> {patient.age} años
                            </div>
                            <div>
                              <strong>Habitación:</strong> {patient.room}
                            </div>
                            <div>
                              <strong>Peso:</strong> {patient.weight} kg
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div>
                              <strong>Condiciones:</strong> 
                              <div className="flex flex-wrap gap-1 mt-1">
                                {patient.conditions.map((condition, index) => (
                                  <Badge key={index} variant="secondary">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {patient.allergies.length > 0 && (
                              <div>
                                <strong className="text-red-600">Alergias:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {patient.allergies.map((allergy, index) => (
                                    <Badge key={index} variant="destructive">
                                      {allergy}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedPatient === patient.id && (
                          <CheckCircle className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 2: Selección del Medicamento */}
          <TabsContent value="2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Seleccionar Medicamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar medicamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredMedications.map((med) => (
                    <div
                      key={med.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMedication === med.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                      onClick={() => setSelectedMedication(med.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">{med.name}</h3>
                            <Badge variant="outline">{med.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Principio activo:</strong> {med.activeIngredient}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Presentaciones:</strong> {med.presentations.join(", ")}
                            </div>
                            <div>
                              <strong>Vías:</strong> {med.routes.join(", ")}
                            </div>
                          </div>
                          {med.contraindications.length > 0 && (
                            <div className="text-sm">
                              <strong className="text-red-600">Contraindicaciones:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {med.contraindications.map((contra, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {contra}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {selectedMedication === med.id && (
                          <CheckCircle className="w-6 h-6 text-orange-600 ml-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 3: Dosificación y Detalles */}
          <TabsContent value="3" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Dosificación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dosis *</Label>
                      <Select onValueChange={(value) => handleInputChange("dose", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar dosis" />
                        </SelectTrigger>
                        <SelectContent>
                          {medication?.presentations.map((presentation) => (
                            <SelectItem key={presentation} value={presentation}>
                              {presentation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Vía de administración *</Label>
                      <Select onValueChange={(value) => handleInputChange("route", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vía" />
                        </SelectTrigger>
                        <SelectContent>
                          {medication?.routes.map((route) => (
                            <SelectItem key={route} value={route}>
                              {route}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Frecuencia *</Label>
                    <Select onValueChange={(value) => handleInputChange("frequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duración *</Label>
                      <Input
                        placeholder="Ej: 7 días"
                        value={prescriptionData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cantidad *</Label>
                      <Input
                        placeholder="Ej: 21 tabletas"
                        value={prescriptionData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Refills permitidos</Label>
                    <Select
                      value={prescriptionData.refills}
                      onValueChange={(value) => handleInputChange("refills", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sin refills</SelectItem>
                        <SelectItem value="1">1 refill</SelectItem>
                        <SelectItem value="2">2 refills</SelectItem>
                        <SelectItem value="3">3 refills</SelectItem>
                        <SelectItem value="5">5 refills</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Indicaciones e Instrucciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Indicación/Diagnóstico *</Label>
                    <Input
                      placeholder="Ej: Hipertensión arterial"
                      value={prescriptionData.indication}
                      onChange={(e) => handleInputChange("indication", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instrucciones médicas</Label>
                    <Textarea
                      placeholder="Instrucciones específicas para el paciente..."
                      rows={3}
                      value={prescriptionData.instructions}
                      onChange={(e) => handleInputChange("instructions", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instrucciones para el paciente</Label>
                    <Textarea
                      placeholder="Cómo tomar el medicamento, precauciones..."
                      rows={3}
                      value={prescriptionData.patientInstructions}
                      onChange={(e) => handleInputChange("patientInstructions", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notas para farmacia</Label>
                    <Textarea
                      placeholder="Información adicional para el farmacéutico..."
                      rows={2}
                      value={prescriptionData.pharmacyNotes}
                      onChange={(e) => handleInputChange("pharmacyNotes", e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Sustitución permitida</Label>
                      <Switch
                        checked={prescriptionData.substitutionAllowed}
                        onCheckedChange={(checked) => handleInputChange("substitutionAllowed", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Requiere preautorización</Label>
                      <Switch
                        checked={prescriptionData.requiresPreauth}
                        onCheckedChange={(checked) => handleInputChange("requiresPreauth", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Requiere monitoreo</Label>
                      <Switch
                        checked={prescriptionData.monitoring.required}
                        onCheckedChange={(checked) => handleMonitoringChange("required", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Paso 4: Revisión y Alertas */}
          <TabsContent value="4" className="space-y-6">
            {(warnings.length > 0 || interactions.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Alertas y Advertencias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {warnings.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Alergias detectadas:</strong>
                        <ul className="list-disc list-inside mt-2">
                          {warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {interactions.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Posibles interacciones:</strong>
                        <ul className="list-disc list-inside mt-2">
                          {interactions.map((interaction, index) => (
                            <li key={index}>Interacción con {interaction}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Resumen de la Prescripción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Paciente</h4>
                      {patient && (
                        <div className="space-y-1 text-sm">
                          <p><strong>Nombre:</strong> {patient.name}</p>
                          <p><strong>ID:</strong> {patient.id}</p>
                          <p><strong>Edad:</strong> {patient.age} años</p>
                          <p><strong>Peso:</strong> {patient.weight} kg</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">Medicamento</h4>
                      {medication && (
                        <div className="space-y-1 text-sm">
                          <p><strong>Nombre:</strong> {medication.name}</p>
                          <p><strong>Principio activo:</strong> {medication.activeIngredient}</p>
                          <p><strong>Categoría:</strong> {medication.category}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Dosificación</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Dosis:</strong> {prescriptionData.dose}</p>
                        <p><strong>Vía:</strong> {prescriptionData.route}</p>
                        <p><strong>Frecuencia:</strong> {
                          frequencies.find(f => f.value === prescriptionData.frequency)?.label
                        }</p>
                        <p><strong>Duración:</strong> {prescriptionData.duration}</p>
                        <p><strong>Cantidad:</strong> {prescriptionData.quantity}</p>
                        <p><strong>Refills:</strong> {prescriptionData.refills}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">Indicación</h4>
                      <p className="text-sm">{prescriptionData.indication}</p>
                    </div>
                  </div>
                </div>

                {prescriptionData.instructions && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Instrucciones</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{prescriptionData.instructions}</p>
                  </div>
                )}

                {prescriptionData.patientInstructions && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Instrucciones para el paciente</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{prescriptionData.patientInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {currentStep < 4 ? (
              <Button 
                onClick={handleNext} 
                className="bg-orange-600 hover:bg-orange-700"
                disabled={
                  (currentStep === 1 && !selectedPatient) ||
                  (currentStep === 2 && !selectedMedication)
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
                Generar Prescripción
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
