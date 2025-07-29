import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MedicalEducationModal from "@/components/modals/MedicalEducationModal";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  Video,
  FileText,
  Plus,
  Clock,
  Star,
  Play,
  CheckCircle,
} from "lucide-react";

const mockCourses = [
  {
    id: "COURSE001",
    title: "Farmacología Clínica Avanzada",
    instructor: "Dr. Carlos Mendoza",
    duration: "8 horas",
    level: "Avanzado",
    rating: 4.8,
    progress: 35,
    enrolled: 245,
    category: "Farmacología",
  },
  {
    id: "COURSE002",
    title: "Protocolo de Reanimación Cardiopulmonar",
    instructor: "Dra. Ana Martínez",
    duration: "4 horas",
    level: "Intermedio",
    rating: 4.9,
    progress: 0,
    enrolled: 189,
    category: "Emergencias",
  },
];

const mockCertifications = [
  {
    id: "CERT001",
    name: "Basic Life Support (BLS)",
    status: "Activa",
    expiry: "2024-12-15",
    progress: 100,
  },
  {
    id: "CERT002",
    name: "Advanced Cardiovascular Life Support (ACLS)",
    status: "Próximo a vencer",
    expiry: "2024-06-20",
    progress: 75,
  },
];

export default function MedicalEducation() {
  const navigate = useNavigate();
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "course" | "certification" | "simulation" | "library"
  >("course");
  const [courses] = useState(mockCourses);
  const [certifications] = useState(mockCertifications);

  const openModal = (
    mode: "course" | "certification" | "simulation" | "library",
  ) => {
    setModalMode(mode);
    setIsEducationModalOpen(true);
  };

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
            <Button
              onClick={() => openModal("course")}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="w-4 h-4" />
              Explorar Cursos
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Button
                    onClick={() => openModal("course")}
                    className="w-full h-20 flex flex-col items-center justify-center"
                    variant="outline"
                  >
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Inscribirse</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {courses.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cursos Activos
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-muted-foreground">
                    Completados
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">48h</div>
                  <div className="text-sm text-muted-foreground">
                    Horas de Estudio
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-amber-600" />
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge variant="outline">{course.level}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Instructor: {course.instructor}</div>
                          <div>Categoría: {course.category}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.enrolled} estudiantes
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {course.progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progreso</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={() => openModal("course")}
                          className="w-full"
                          variant={course.progress > 0 ? "outline" : "default"}
                        >
                          {course.progress > 0 ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Continuar
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Inscribirse
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      {cert.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Estado</span>
                        <Badge
                          className={
                            cert.status === "Activa"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {cert.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Vencimiento</span>
                        <span>{cert.expiry}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} className="h-2" />
                      </div>
                    </div>
                    <Button
                      onClick={() => openModal("certification")}
                      variant="outline"
                      className="w-full"
                    >
                      {cert.status === "Próximo a vencer"
                        ? "Renovar"
                        : "Ver Detalles"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={() => openModal("certification")}
              className="w-full"
            >
              <Award className="w-4 h-4 mr-2" />
              Explorar Más Certificaciones
            </Button>
          </TabsContent>

          <TabsContent value="simulations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">
                    Manejo de Shock Séptico
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulación interactiva - 45 min
                  </p>
                  <Button
                    onClick={() => openModal("simulation")}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">
                    Intubación de Emergencia
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completado - 95% puntuación
                  </p>
                  <Button
                    onClick={() => openModal("simulation")}
                    variant="outline"
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Repetir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Reanimación Pediátrica</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulación avanzada - 60 min
                  </p>
                  <Button
                    onClick={() => openModal("simulation")}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Guías Clínicas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Protocolos actualizados
                  </p>
                  <Button
                    onClick={() => openModal("library")}
                    variant="outline"
                    className="w-full"
                  >
                    Explorar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Revistas Científicas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Investigación actual
                  </p>
                  <Button
                    onClick={() => openModal("library")}
                    variant="outline"
                    className="w-full"
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Video className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Videos Educativos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Procedimientos y técnicas
                  </p>
                  <Button
                    onClick={() => openModal("library")}
                    variant="outline"
                    className="w-full"
                  >
                    Ver
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <MedicalEducationModal
          open={isEducationModalOpen}
          onOpenChange={setIsEducationModalOpen}
          mode={modalMode}
        />
      </div>
    </div>
  );
}
