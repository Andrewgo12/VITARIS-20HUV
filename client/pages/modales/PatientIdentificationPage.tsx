import { MockFormProvider } from "@/context/MockFormContext";
import PatientIdentificationModalDemo from "@/components/modals/PatientIdentificationModalDemo";

export default function PatientIdentificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-white to-medical-blue/10 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Modal: Identificación del Paciente
          </h1>
          <p className="text-muted-foreground">
            Vista de prueba para el modal de identificación del paciente
          </p>
        </div>

        <MockFormProvider>
          <PatientIdentificationModalDemo />
        </MockFormProvider>
      </div>
    </div>
  );
}
