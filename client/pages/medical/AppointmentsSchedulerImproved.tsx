import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import NavigationImproved from "@/components/NavigationImproved";

interface Appointment {
  id: number;
  patientName: string;
  patientId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  priority: "normal" | "urgent" | "emergency";
  room: string;
  notes?: string;
  phone: string;
  type: "consultation" | "follow-up" | "procedure" | "emergency";
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "María González",
    patientId: "12345678",
    doctorName: "Dr. Carlos Méndez",
    specialty: "Cardiología",
    date: "2024-01-15",
    time: "09:00",
    duration: 30,
    status: "scheduled",
    priority: "urgent",
    room: "Consulta 201",
    phone: "300-123-4567",
    type: "consultation",
    notes: "Control post-quirúrgico",
  },
  {
    id: 2,
    patientName: "Juan Pérez",
    patientId: "87654321",
    doctorName: "Dra. Ana López",
    specialty: "Medicina Interna",
    date: "2024-01-15",
    time: "10:30",
    duration: 45,
    status: "confirmed",
    priority: "normal",
    room: "Consulta 105",
    phone: "301-234-5678",
    type: "follow-up",
  },
  {
    id: 3,
    patientName: "Carmen Silva",
    patientId: "11223344",
    doctorName: "Dr. Luis Torres",
    specialty: "Neurología",
    date: "2024-01-15",
    time: "14:00",
    duration: 60,
    status: "in-progress",
    priority: "emergency",
    room: "Consulta 302",
    phone: "302-345-6789",
    type: "emergency",
  },
];

export default function AppointmentsSchedulerImproved() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedDoctor, setSelectedDoctor] = useState("ALL");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patientId.includes(searchTerm) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || appointment.status === selectedStatus;
    const matchesDoctor =
      selectedDoctor === "ALL" || appointment.doctorName === selectedDoctor;
    const matchesDate = appointment.date === format(selectedDate, "yyyy-MM-dd");

    return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
  });

  const stats = {
    total: filteredAppointments.length,
    scheduled: filteredAppointments.filter((a) => a.status === "scheduled")
      .length,
    confirmed: filteredAppointments.filter((a) => a.status === "confirmed")
      .length,
    inProgress: filteredAppointments.filter((a) => a.status === "in-progress")
      .length,
    completed: filteredAppointments.filter((a) => a.status === "completed")
      .length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200";
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: "Programada",
      confirmed: "Confirmada",
      "in-progress": "En Curso",
      completed: "Completada",
      cancelled: "Cancelada",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
  }: {
    icon: any;
    title: string;
    value: number;
    color: string;
  }) => (
    <Card className="card-modern">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn("w-5 h-5", color)} />
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="card-modern transition-all duration-300 hover:shadow-medium">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {appointment.patientName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">
                  {appointment.patientName}
                </h3>
                <Badge className={getPriorityColor(appointment.priority)}>
                  {appointment.priority === "emergency"
                    ? "Emergencia"
                    : appointment.priority === "urgent"
                      ? "Urgente"
                      : "Normal"}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>ID: {appointment.patientId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-3 h-3" />
                  <span>
                    {appointment.doctorName} - {appointment.specialty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    {appointment.time} ({appointment.duration} min)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>{appointment.room}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {getStatusLabel(appointment.status)}
          </Badge>
        </div>

        {appointment.notes && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-foreground">{appointment.notes}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAppointment(appointment)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalles de la Cita</DialogTitle>
              </DialogHeader>
              {selectedAppointment && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Paciente</Label>
                      <p>{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Documento</Label>
                      <p>{selectedAppointment.patientId}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Médico</Label>
                      <p>{selectedAppointment.doctorName}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Especialidad</Label>
                      <p>{selectedAppointment.specialty}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Fecha y Hora</Label>
                      <p>
                        {format(
                          new Date(selectedAppointment.date),
                          "dd 'de' MMMM, yyyy",
                          { locale: es },
                        )}{" "}
                        - {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold">Duración</Label>
                      <p>{selectedAppointment.duration} minutos</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Consultorio</Label>
                      <p>{selectedAppointment.room}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Teléfono</Label>
                      <p>{selectedAppointment.phone}</p>
                    </div>
                  </div>

                  {selectedAppointment.notes && (
                    <div>
                      <Label className="font-semibold">Notas</Label>
                      <p className="mt-1 p-3 bg-muted rounded-lg">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Llamar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 border-b">
        <div className="container mx-auto px-6 py-4">
          <NavigationImproved
            userName="Dr. Médico"
            userRole="Especialista"
            notifications={stats.total}
          />
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/medical-dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Agenda de Citas
              </h1>
              <p className="text-muted-foreground">
                Programación y gestión de citas médicas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Exportar Agenda
            </Button>
            <Button
              className="gap-2"
              onClick={() => setShowNewAppointment(true)}
            >
              <Plus className="w-4 h-4" />
              Nueva Cita
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={CalendarIcon}
            title="Total Citas"
            value={stats.total}
            color="text-blue-600"
          />
          <StatCard
            icon={Clock}
            title="Programadas"
            value={stats.scheduled}
            color="text-orange-600"
          />
          <StatCard
            icon={CheckCircle}
            title="Confirmadas"
            value={stats.confirmed}
            color="text-green-600"
          />
          <StatCard
            icon={AlertCircle}
            title="En Curso"
            value={stats.inProgress}
            color="text-yellow-600"
          />
          <StatCard
            icon={CheckCircle}
            title="Completadas"
            value={stats.completed}
            color="text-emerald-600"
          />
        </div>

        {/* Filters and Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="card-modern lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar paciente o médico..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos</SelectItem>
                      <SelectItem value="scheduled">Programadas</SelectItem>
                      <SelectItem value="confirmed">Confirmadas</SelectItem>
                      <SelectItem value="in-progress">En Curso</SelectItem>
                      <SelectItem value="completed">Completadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Seleccionar Fecha</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={es}
                className="rounded-lg border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Header */}
        <div className="mb-6">
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </h2>
                  <p className="text-muted-foreground">
                    {stats.total} citas programadas
                  </p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {format(selectedDate, "dd/MM/yyyy")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <Card className="card-modern">
            <CardContent className="p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No hay citas programadas
              </h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron citas para la fecha seleccionada
              </p>
              <Button
                className="gap-2"
                onClick={() => setShowNewAppointment(true)}
              >
                <Plus className="w-4 h-4" />
                Programar Nueva Cita
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
