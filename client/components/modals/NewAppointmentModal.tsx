import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Bell,
  CheckCircle,
} from "lucide-react";

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const specialties = [
  "Cardiología", "Neurología", "Pediatría", "Ginecología",
  "Traumatología", "Psiquiatría", "Dermatología", "Oftalmología",
  "Urología", "Endocrinología", "Medicina Interna", "Cirugía General",
];

const doctors = [
  { id: "D001", name: "Dr. Carlos Mendoza", specialty: "Cardiología", available: true },
  { id: "D002", name: "Dra. Ana Martínez", specialty: "Neurología", available: true },
  { id: "D003", name: "Dr. Luis Rodríguez", specialty: "Pediatría", available: false },
  { id: "D004", name: "Dra. María González", specialty: "Ginecología", available: true },
  { id: "D005", name: "Dr. Roberto Silva", specialty: "Traumatología", available: true },
];

const appointmentTypes = [
  "Consulta General", "Consulta Especializada", "Control", "Urgencia",
  "Procedimiento", "Cirugía", "Telemedicina", "Segunda Opinión",
];

export default function NewAppointmentModal({ open, onOpenChange }: NewAppointmentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointmentData, setAppointmentData] = useState({
    patientId: "",
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    appointmentType: "",
    specialty: "",
    doctor: "",
    date: "",
    time: "",
    duration: "30",
    location: "",
    notes: "",
    priority: "normal",
    reminders: {
      email: true,
      sms: false,
      call: false,
    },
    insurance: {
      provider: "",
      policyNumber: "",
      copay: "",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setAppointmentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReminderChange = (type: string, enabled: boolean) => {
    setAppointmentData(prev => ({
      ...prev,
      reminders: {
        ...prev.reminders,
        [type]: enabled,
      },
    }));
  };

  const handleInsuranceChange = (field: string, value: string) => {
    setAppointmentData(prev => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Aquí se implementaría la lógica de envío
    console.log("Appointment Data:", appointmentData);
    console.log("Selected Date:", selectedDate);
    onOpenChange(false);
    setCurrentStep(1);
  };

  const availableDoctors = doctors.filter(
    doctor => !appointmentData.specialty || doctor.specialty === appointmentData.specialty
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700">
            Nueva Cita Médica
          </DialogTitle>
          <DialogDescription>
            Complete la información necesaria para programar una nueva cita médica
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center space-x-2 ${
                  step <= currentStep ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-green-600 text-white"
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
                  {step === 2 && "Cita"}
                  {step === 3 && "Configuración"}
                  {step === 4 && "Confirmación"}
                </span>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={currentStep.toString()} className="w-full">
          {/* Paso 1: Información del Paciente */}
          <TabsContent value="1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">ID del Paciente</Label>
                    <Input
                      id="patientId"
                      placeholder="Ej: P12345"
                      value={appointmentData.patientId}
                      onChange={(e) => handleInputChange("patientId", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Nombre Completo *</Label>
                    <Input
                      id="patientName"
                      placeholder="Nombre completo del paciente"
                      value={appointmentData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail">Email</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      placeholder="email@ejemplo.com"
                      value={appointmentData.patientEmail}
                      onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Teléfono *</Label>
                    <Input
                      id="patientPhone"
                      placeholder="+57 300 123 4567"
                      value={appointmentData.patientPhone}
                      onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Información del Seguro</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Aseguradora</Label>
                      <Select onValueChange={(value) => handleInsuranceChange("provider", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar aseguradora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eps-sura">EPS Sura</SelectItem>
                          <SelectItem value="nueva-eps">Nueva EPS</SelectItem>
                          <SelectItem value="sanitas">Sanitas</SelectItem>
                          <SelectItem value="compensar">Compensar</SelectItem>
                          <SelectItem value="particular">Particular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyNumber">Número de Póliza</Label>
                      <Input
                        id="policyNumber"
                        placeholder="Número de póliza"
                        value={appointmentData.insurance.policyNumber}
                        onChange={(e) => handleInsuranceChange("policyNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="copay">Copago</Label>
                      <Input
                        id="copay"
                        placeholder="$50,000"
                        value={appointmentData.insurance.copay}
                        onChange={(e) => handleInsuranceChange("copay", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 2: Detalles de la Cita */}
          <TabsContent value="2" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Programación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Cita *</Label>
                    <Select
                      value={appointmentData.appointmentType}
                      onValueChange={(value) => handleInputChange("appointmentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de cita" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Especialidad *</Label>
                    <Select
                      value={appointmentData.specialty}
                      onValueChange={(value) => handleInputChange("specialty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Médico *</Label>
                    <Select
                      value={appointmentData.doctor}
                      onValueChange={(value) => handleInputChange("doctor", value)}
                      disabled={!appointmentData.specialty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            <div className="flex items-center gap-2">
                              {doctor.name}
                              {doctor.available ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Disponible
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-700">
                                  No disponible
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duración (minutos)</Label>
                      <Select
                        value={appointmentData.duration}
                        onValueChange={(value) => handleInputChange("duration", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="45">45 min</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="90">1.5 horas</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridad</Label>
                      <Select
                        value={appointmentData.priority}
                        onValueChange={(value) => handleInputChange("priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Fecha y Hora
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fecha *</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hora disponible *</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={appointmentData.time === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleInputChange("time", time)}
                          className="text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación y Notas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Select onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultorio-1">Consultorio 1 - Piso 2</SelectItem>
                      <SelectItem value="consultorio-2">Consultorio 2 - Piso 2</SelectItem>
                      <SelectItem value="sala-procedimientos">Sala de Procedimientos</SelectItem>
                      <SelectItem value="telemedicina">Telemedicina (Virtual)</SelectItem>
                      <SelectItem value="quirofano-1">Quirófano 1</SelectItem>
                      <SelectItem value="urgencias">Urgencias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Motivo de consulta, síntomas, preparación especial requerida..."
                    rows={4}
                    value={appointmentData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 3: Configuración de Recordatorios */}
          <TabsContent value="3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recordatorios Automáticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Recordatorio por Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Se enviará un correo 24 horas antes de la cita
                      </p>
                    </div>
                    <Button
                      variant={appointmentData.reminders.email ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReminderChange("email", !appointmentData.reminders.email)}
                    >
                      {appointmentData.reminders.email ? "Activado" : "Desactivado"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Recordatorio por SMS</h4>
                      <p className="text-sm text-muted-foreground">
                        Se enviará un mensaje de texto 2 horas antes de la cita
                      </p>
                    </div>
                    <Button
                      variant={appointmentData.reminders.sms ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReminderChange("sms", !appointmentData.reminders.sms)}
                    >
                      {appointmentData.reminders.sms ? "Activado" : "Desactivado"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Llamada de Confirmación</h4>
                      <p className="text-sm text-muted-foreground">
                        Se realizará una llamada de confirmación 1 día antes
                      </p>
                    </div>
                    <Button
                      variant={appointmentData.reminders.call ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReminderChange("call", !appointmentData.reminders.call)}
                    >
                      {appointmentData.reminders.call ? "Activado" : "Desactivado"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paso 4: Confirmación */}
          <TabsContent value="4" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Resumen de la Cita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Información del Paciente</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Nombre:</strong> {appointmentData.patientName}</p>
                        <p><strong>Teléfono:</strong> {appointmentData.patientPhone}</p>
                        <p><strong>Email:</strong> {appointmentData.patientEmail}</p>
                        {appointmentData.insurance.provider && (
                          <p><strong>Seguro:</strong> {appointmentData.insurance.provider}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">Detalles de la Cita</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Tipo:</strong> {appointmentData.appointmentType}</p>
                        <p><strong>Especialidad:</strong> {appointmentData.specialty}</p>
                        <p><strong>Médico:</strong> {
                          doctors.find(d => d.id === appointmentData.doctor)?.name
                        }</p>
                        <p><strong>Duración:</strong> {appointmentData.duration} minutos</p>
                        <p><strong>Prioridad:</strong> {appointmentData.priority}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Programación</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString()}</p>
                        <p><strong>Hora:</strong> {appointmentData.time}</p>
                        <p><strong>Ubicación:</strong> {appointmentData.location}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">Recordatorios</h4>
                      <div className="space-y-1 text-sm">
                        {appointmentData.reminders.email && <p>✓ Email activado</p>}
                        {appointmentData.reminders.sms && <p>✓ SMS activado</p>}
                        {appointmentData.reminders.call && <p>✓ Llamada activada</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {appointmentData.notes && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Notas</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{appointmentData.notes}</p>
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
              <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Programar Cita
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
