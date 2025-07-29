import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import NewAppointmentModal from "@/components/modals/NewAppointmentModal";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  MapPin,
} from "lucide-react";

const mockAppointments = [
  {
    id: "CITA-001",
    patient: { name: "María Elena Rodríguez", id: "P001", phone: "+57 300 123 4567" },
    doctor: "Dr. Carlos Mendoza",
    specialty: "Cardiología",
    date: "2024-01-15",
    time: "09:00",
    duration: "30 min",
    type: "Consulta Especializada",
    status: "Confirmada",
    location: "Consultorio 1 - Piso 2",
    notes: "Control post-operatorio",
  },
  {
    id: "CITA-002",
    patient: { name: "Carlos Alberto Vásquez", id: "P002", phone: "+57 301 987 6543" },
    doctor: "Dra. Ana Martínez",
    specialty: "Neurología",
    date: "2024-01-15",
    time: "10:30",
    duration: "45 min",
    type: "Consulta General",
    status: "Pendiente",
    location: "Consultorio 3 - Piso 2",
    notes: "Primera consulta por cefaleas",
  },
];

export default function AppointmentsScheduler() {
  const navigate = useNavigate();
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [appointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmada': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Programación de Citas
              </h1>
              <p className="text-muted-foreground">
                Gestión integral de citas médicas
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsNewAppointmentOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Nueva Cita
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Clock className="w-4 h-4 mr-2" />
              Citas
            </TabsTrigger>
            <TabsTrigger value="availability">
              <User className="w-4 h-4 mr-2" />
              Disponibilidad
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Search className="w-4 h-4 mr-2" />
              Recordatorios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendario de Citas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="text-center font-semibold p-2 bg-gray-100 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayNumber = i + 1;
                    const hasAppointment = dayNumber === 15;
                    return (
                      <div
                        key={i}
                        className={`p-2 text-center rounded cursor-pointer transition-colors ${
                          hasAppointment ? 'bg-green-100 border-green-500' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-sm">{dayNumber <= 31 ? dayNumber : ''}</div>
                        {hasAppointment && (
                          <div className="text-xs text-green-700 mt-1">
                            {appointments.length} citas
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, médico o especialidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold">{appointment.patient.name}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>ID: {appointment.patient.id}</div>
                          <div>Tel: {appointment.patient.phone}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Programación</h4>
                        </div>
                        <div className="text-sm">
                          <div><strong>Fecha:</strong> {appointment.date}</div>
                          <div><strong>Hora:</strong> {appointment.time}</div>
                          <div><strong>Duración:</strong> {appointment.duration}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold">Médico</h4>
                        </div>
                        <div className="text-sm">
                          <div><strong>Doctor:</strong> {appointment.doctor}</div>
                          <div><strong>Especialidad:</strong> {appointment.specialty}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold">Estado</h4>
                        </div>
                        <div className="space-y-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {appointment.type}
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <strong className="text-sm">Notas:</strong>
                        <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>Disponibilidad Médica:</strong> Horarios de
                especialistas, vacaciones, guardias médicas, rotaciones y
                gestión de ausencias.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                <strong>Recordatorios Automáticos:</strong> SMS, email y
                llamadas automáticas, confirmación de citas, seguimiento
                post-cita y encuestas de satisfacción.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <NewAppointmentModal
          open={isNewAppointmentOpen}
          onOpenChange={setIsNewAppointmentOpen}
        />
      </div>
    </div>
  );
}
