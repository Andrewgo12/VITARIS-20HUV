import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  Video,
  Award,
  Clock,
  Users,
  Calendar as CalendarIcon,
  FileText,
  Play,
  Pause,
  CheckCircle,
  Star,
  Download,
  Share,
  Search,
  Filter,
} from "lucide-react";

interface MedicalEducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "course" | "certification" | "simulation" | "library";
}

const courses = [
  {
    id: "COURSE001",
    title: "Farmacología Clínica Avanzada",
    description:
      "Curso completo sobre farmacología aplicada en el entorno clínico",
    instructor: "Dr. Carlos Mendoza",
    duration: "8 horas",
    level: "Avanzado",
    category: "Farmacología",
    rating: 4.8,
    studentsEnrolled: 245,
    modules: 12,
    progress: 35,
    certificationEligible: true,
    continuingEducationCredits: 8,
    tags: ["Farmacología", "Prescripción", "Interacciones"],
    startDate: "2024-02-01",
    endDate: "2024-02-28",
  },
  {
    id: "COURSE002",
    title: "Protocolo de Reanimación Cardiopulmonar",
    description: "Técnicas actualizadas de RCP según guías internacionales",
    instructor: "Dra. Ana Martínez",
    duration: "4 horas",
    level: "Intermedio",
    category: "Emergencias",
    rating: 4.9,
    studentsEnrolled: 189,
    modules: 6,
    progress: 0,
    certificationEligible: true,
    continuingEducationCredits: 4,
    tags: ["RCP", "Emergencias", "ACLS"],
    startDate: "2024-02-15",
    endDate: "2024-03-15",
  },
];

const certifications = [
  {
    id: "CERT001",
    name: "Basic Life Support (BLS)",
    provider: "American Heart Association",
    validityPeriod: "2 años",
    nextRenewal: "2024-12-15",
    status: "Activa",
    creditsRequired: 4,
    creditsCompleted: 4,
  },
  {
    id: "CERT002",
    name: "Advanced Cardiovascular Life Support (ACLS)",
    provider: "American Heart Association",
    validityPeriod: "2 años",
    nextRenewal: "2024-06-20",
    status: "Próximo a vencer",
    creditsRequired: 8,
    creditsCompleted: 6,
  },
];

const simulations = [
  {
    id: "SIM001",
    title: "Manejo de Shock Séptico",
    description:
      "Simulación interactiva para el manejo de pacientes con shock séptico",
    difficulty: "Alto",
    estimatedTime: "45 minutos",
    completed: false,
    score: null,
  },
  {
    id: "SIM002",
    title: "Intubación de Emergencia",
    description:
      "Práctica de técnicas de intubación en situaciones de emergencia",
    difficulty: "Medio",
    estimatedTime: "30 minutos",
    completed: true,
    score: 95,
  },
];

export default function MedicalEducationModal({
  open,
  onOpenChange,
  mode = "course",
}: MedicalEducationModalProps) {
  const [activeTab, setActiveTab] = useState(mode);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [enrollmentData, setEnrollmentData] = useState({
    courseId: "",
    scheduledStartDate: new Date(),
    studyPlan: "self-paced",
    notifications: true,
    groupStudy: false,
    mentorship: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const course = courses.find((c) => c.id === selectedCourse);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = () => {
    console.log("Enrolling in course:", selectedCourse, enrollmentData);
    onOpenChange(false);
  };

  const handleStartSimulation = (simulationId: string) => {
    console.log("Starting simulation:", simulationId);
    // Aquí se implementaría la lógica para iniciar la simulación
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-700 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Educación Médica Continua
          </DialogTitle>
          <DialogDescription>
            Acceda a cursos, certificaciones, simulaciones y recursos educativos
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(
              value as "course" | "certification" | "simulation" | "library",
            )
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="course" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger
              value="certification"
              className="flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Certificaciones
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Simulaciones
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Biblioteca
            </TabsTrigger>
          </TabsList>

          {/* Tab de Cursos */}
          <TabsContent value="course" className="space-y-6">
            {!selectedCourse ? (
              <>
                {/* Filtros de búsqueda */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Buscar cursos</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar por título o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Categoría</Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Farmacología">
                              Farmacología
                            </SelectItem>
                            <SelectItem value="Emergencias">
                              Emergencias
                            </SelectItem>
                            <SelectItem value="Cardiología">
                              Cardiología
                            </SelectItem>
                            <SelectItem value="Pediatría">Pediatría</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nivel</Label>
                        <Select
                          value={selectedLevel}
                          onValueChange={setSelectedLevel}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermedio">
                              Intermedio
                            </SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de cursos */}
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-2 space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="text-xl font-semibold">
                                {course.title}
                              </h3>
                              <Badge variant="outline">{course.level}</Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {course.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {course.instructor}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {course.rating}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {course.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-sm space-y-1">
                              <div>
                                <strong>Estudiantes:</strong>{" "}
                                {course.studentsEnrolled}
                              </div>
                              <div>
                                <strong>Módulos:</strong> {course.modules}
                              </div>
                              <div>
                                <strong>Créditos:</strong>{" "}
                                {course.continuingEducationCredits} CEC
                              </div>
                              <div>
                                <strong>Categoría:</strong> {course.category}
                              </div>
                            </div>
                            {course.progress > 0 && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Progreso</span>
                                  <span>{course.progress}%</span>
                                </div>
                                <Progress
                                  value={course.progress}
                                  className="h-2"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => setSelectedCourse(course.id)}
                              className="w-full"
                              variant={
                                course.progress > 0 ? "outline" : "default"
                              }
                            >
                              {course.progress > 0
                                ? "Continuar"
                                : "Inscribirse"}
                            </Button>
                            <Button variant="outline" size="sm">
                              Vista Previa
                            </Button>
                            {course.certificationEligible && (
                              <Badge className="text-center bg-green-100 text-green-700">
                                <Award className="w-3 h-3 mr-1" />
                                Certificable
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              /* Formulario de inscripción */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Inscripción al Curso: {course?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Fecha de inicio</Label>
                        <Calendar
                          mode="single"
                          selected={enrollmentData.scheduledStartDate}
                          onSelect={(date) =>
                            date &&
                            setEnrollmentData((prev) => ({
                              ...prev,
                              scheduledStartDate: date,
                            }))
                          }
                          disabled={(date) => date < new Date()}
                          className="rounded-md border mt-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Plan de estudio</Label>
                        <Select
                          value={enrollmentData.studyPlan}
                          onValueChange={(value) =>
                            setEnrollmentData((prev) => ({
                              ...prev,
                              studyPlan: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self-paced">
                              Autodirigido
                            </SelectItem>
                            <SelectItem value="structured">
                              Estructurado (4 semanas)
                            </SelectItem>
                            <SelectItem value="intensive">
                              Intensivo (2 semanas)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Notificaciones de progreso</Label>
                          <Switch
                            checked={enrollmentData.notifications}
                            onCheckedChange={(checked) =>
                              setEnrollmentData((prev) => ({
                                ...prev,
                                notifications: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Unirse a grupo de estudio</Label>
                          <Switch
                            checked={enrollmentData.groupStudy}
                            onCheckedChange={(checked) =>
                              setEnrollmentData((prev) => ({
                                ...prev,
                                groupStudy: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Solicitar mentoría</Label>
                          <Switch
                            checked={enrollmentData.mentorship}
                            onCheckedChange={(checked) =>
                              setEnrollmentData((prev) => ({
                                ...prev,
                                mentorship: checked,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">
                            Resumen del curso
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div>
                              <strong>Duración:</strong> {course?.duration}
                            </div>
                            <div>
                              <strong>Módulos:</strong> {course?.modules}
                            </div>
                            <div>
                              <strong>Créditos CEC:</strong>{" "}
                              {course?.continuingEducationCredits}
                            </div>
                            <div>
                              <strong>Instructor:</strong> {course?.instructor}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCourse("")}
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={handleEnroll}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Confirmar Inscripción
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab de Certificaciones */}
          <TabsContent value="certification" className="space-y-6">
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
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Proveedor:</strong> {cert.provider}
                      </div>
                      <div>
                        <strong>Vigencia:</strong> {cert.validityPeriod}
                      </div>
                      <div>
                        <strong>Próxima renovación:</strong> {cert.nextRenewal}
                      </div>
                      <div>
                        <strong>Estado:</strong>
                        <Badge
                          className={`ml-2 ${
                            cert.status === "Activa"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {cert.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Créditos completados</span>
                        <span>
                          {cert.creditsCompleted}/{cert.creditsRequired}
                        </span>
                      </div>
                      <Progress
                        value={
                          (cert.creditsCompleted / cert.creditsRequired) * 100
                        }
                        className="h-2"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Certificado
                      </Button>
                      {cert.status === "Próximo a vencer" && (
                        <Button size="sm">Renovar</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Certificaciones Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Award className="w-6 h-6 mb-2" />
                    <span className="text-sm">PALS</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Award className="w-6 h-6 mb-2" />
                    <span className="text-sm">ATLS</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Award className="w-6 h-6 mb-2" />
                    <span className="text-sm">NRP</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Simulaciones */}
          <TabsContent value="simulation" className="space-y-6">
            <div className="space-y-4">
              {simulations.map((sim) => (
                <Card key={sim.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2 space-y-2">
                        <h3 className="text-lg font-semibold">{sim.title}</h3>
                        <p className="text-muted-foreground">
                          {sim.description}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <Badge variant="outline">
                            Dificultad: {sim.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {sim.estimatedTime}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {sim.completed && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {sim.score}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Puntuación
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleStartSimulation(sim.id)}
                          variant={sim.completed ? "outline" : "default"}
                        >
                          {sim.completed ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Repetir
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Iniciar
                            </>
                          )}
                        </Button>
                        {sim.completed && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completado
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab de Biblioteca */}
          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Biblioteca Médica Digital
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en la biblioteca médica..."
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold">Guías Clínicas</h4>
                      <p className="text-sm text-muted-foreground">
                        Protocolos actualizados
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Explorar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold">Revistas Científicas</h4>
                      <p className="text-sm text-muted-foreground">
                        Investigación actual
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Acceder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Video className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-semibold">Videos Educativos</h4>
                      <p className="text-sm text-muted-foreground">
                        Procedimientos y técnicas
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Ver
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
