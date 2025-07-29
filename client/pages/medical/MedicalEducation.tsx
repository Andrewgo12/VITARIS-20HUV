import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  Video,
  FileText,
} from "lucide-react";

export default function MedicalEducation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Educación Médica
              </h1>
              <p className="text-muted-foreground">
                Formación continua y desarrollo profesional
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">
              <BookOpen className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="certifications">
              <Award className="w-4 h-4 mr-2" />
              Certificaciones
            </TabsTrigger>
            <TabsTrigger value="simulations">
              <Users className="w-4 h-4 mr-2" />
              Simulaciones
            </TabsTrigger>
            <TabsTrigger value="library">
              <FileText className="w-4 h-4 mr-2" />
              Biblioteca
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                <strong>Cursos de Educación Continua:</strong> Módulos
                interactivos, webinars, casos clínicos, evaluaciones en línea y
                seguimiento de progreso académico.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                <strong>Certificaciones Médicas:</strong> BLS, ACLS, PALS,
                certificaciones de especialidad, renovaciones, tracking de
                vencimientos y recordatorios automáticos.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="simulations" className="space-y-6">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>Simulaciones Clínicas:</strong> Casos virtuales
                interactivos, escenarios de emergencia, evaluación de
                competencias y retroalimentación inmediata.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Biblioteca Médica Digital:</strong> Base de datos de
                literatura médica, guías clínicas actualizadas, revistas
                científicas y motor de búsqueda especializado.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
