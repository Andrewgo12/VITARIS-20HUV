import { useForm } from "@/context/FormContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertTriangle,
  Edit,
  Send,
  User,
  FileText,
  Activity,
  Upload,
  Hospital,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveFormToStorage } from "@/lib/persistence";

export default function ValidationModal() {
  const { formData, prevStep, dispatch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleEditSection = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Marcar el formulario como completo
      dispatch({
        type: "UPDATE_DOCUMENTS",
        payload: { ...formData.documents },
      });

      // Guardar datos en localStorage para que el dashboard médico los pueda cargar
      const completeFormData = { ...formData, isComplete: true };
      saveFormToStorage(completeFormData);

      // Simular envío al servidor
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsSubmitted(true);

      // Redirigir al dashboard médico después de 2 segundos
      setTimeout(() => {
        navigate("/medical-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalAttachments = () => {
    return (
      (formData.patient.attachments1?.length || 0) +
      (formData.vitals.attachments3?.length || 0) +
      (formData.documents.attachments4?.length || 0)
    );
  };

  if (isSubmitted) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-success/20 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-success">
                ¡Formulario Enviado Exitosamente!
              </h2>
              <p className="text-muted-foreground">
                La información del paciente ha sido enviada al Hospital
                Universitario del Valle
              </p>
            </div>

            <div className="bg-success/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Hospital className="w-5 h-5 text-success" />
                <span className="font-medium">Número de Referencia:</span>
              </div>
              <p className="font-mono text-lg text-success font-bold">
                HUV-{Date.now().toString().slice(-8)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                El hospital recibirá la información inmediatamente. Puede
                esperar una respuesta en las próximas 2-4 horas.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Enviado: {new Date().toLocaleString("es-CO")}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.print()}>
                Imprimir Confirmación
              </Button>
              <Button onClick={() => navigate("/medical-dashboard")}>
                Ver Dashboard Médico
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Nuevo Formulario
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-medical-blue/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-success/10 to-primary/10 border-b">
        <CardTitle className="flex items-center gap-3 text-primary">
          <CheckCircle2 className="w-6 h-6" />
          Paso 5: Validación Final y Confirmación
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Revise toda la información antes de enviarla al Hospital Universitario
          del Valle
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Summary Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Por favor revise cuidadosamente toda la información. Una vez enviada
            al HUV, no podrá ser modificada fácilmente.
          </AlertDescription>
        </Alert>

        {/* Patient Information Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Datos del Paciente</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(1)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nombre:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.patient.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Identificación:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.patient.identificationType}{" "}
                  {formData.patient.identificationNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Edad:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.patient.age} años
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">EPS:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.patient.eps}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Teléfono:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.patient.phone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Archivos:</p>
                <Badge variant="outline">
                  {formData.patient.attachments1?.length || 0} archivos
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Referral Information Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-medical-blue" />
              <h3 className="text-lg font-semibold">Remisión y Diagnóstico</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(2)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div>
              <p className="text-sm font-medium">Servicio:</p>
              <p className="text-sm text-muted-foreground">
                {formData.referral.referralService}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Motivo de remisión:</p>
              <p className="text-sm text-muted-foreground">
                {formData.referral.referralReason}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Diagnóstico principal:</p>
              <p className="text-sm text-muted-foreground">
                {formData.referral.primaryDiagnosis}
              </p>
            </div>
            {formData.referral.medicalSpecialty && (
              <div>
                <p className="text-sm font-medium">Especialidad solicitada:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.referral.medicalSpecialty}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Vital Signs Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-medical-green" />
              <h3 className="text-lg font-semibold">Signos Vitales</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(3)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">FC:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.vitals.heartRate} lpm
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">FR:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.vitals.respiratoryRate} rpm
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Temperatura:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.vitals.temperature}°C
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">PA:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.vitals.systolicBP}/{formData.vitals.diastolicBP}{" "}
                  mmHg
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">SatO2:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.vitals.oxygenSaturation}%
                </p>
              </div>
              {formData.vitals.bmi > 0 && (
                <div>
                  <p className="text-sm font-medium">IMC:</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.vitals.bmi}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Archivos:</p>
                <Badge variant="outline">
                  {formData.vitals.attachments3?.length || 0} archivos
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Documents Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">
                Documentos y Profesional
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection(4)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Profesional:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.documents.professionalName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Cargo:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.documents.professionalPosition}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Teléfono:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.documents.professionalPhone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Documentos:</p>
                <Badge variant="outline">
                  {formData.documents.attachments4?.length || 0} archivos
                </Badge>
              </div>
            </div>
            {formData.documents.additionalObservations && (
              <div>
                <p className="text-sm font-medium">Observaciones:</p>
                <p className="text-sm text-muted-foreground">
                  {formData.documents.additionalObservations}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Final Summary */}
        <div className="bg-medical-light/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Hospital className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Resumen del Envío</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Total archivos:</p>
              <p className="text-muted-foreground">
                {getTotalAttachments()} archivos
              </p>
            </div>
            <div>
              <p className="font-medium">Destino:</p>
              <p className="text-muted-foreground">
                Hospital Universitario del Valle
              </p>
            </div>
            <div>
              <p className="font-medium">Servicio:</p>
              <p className="text-muted-foreground">
                {formData.referral.referralService}
              </p>
            </div>
            <div>
              <p className="font-medium">Prioridad:</p>
              <Badge variant="outline" className="text-warning">
                Remisión Médica
              </Badge>
            </div>
          </div>
        </div>

        {/* Confirmation Question */}
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-medium">
            ¿Está seguro de enviar esta información al Hospital Universitario
            del Valle?
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            Volver a Editar
          </Button>

          <div className="flex gap-2 flex-1 justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Confirmar y Enviar al HUV
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
