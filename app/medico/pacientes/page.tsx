"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUniversalData } from "@/app/hooks/useUniversalData"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Calendar,
  FileText,
  Edit,
  Search,
  Filter,
  RefreshCw,
  Users,
  Activity,
  Shield,
  Clock,
} from "lucide-react"

export default function PacientesPage() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Usar el hook universal para obtener datos de pacientes
  const {
    data: patientData,
    loading,
    error,
    refresh
  } = useUniversalData('/api/patient-data', {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    riskLevel: riskFilter !== 'all' ? riskFilter : undefined,
    search: searchTerm || undefined
  })

  const patients = patientData?.patients || []
  const statistics = patientData?.statistics || {}
  const metadata = patientData?.metadata || {}

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Follow-up': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el color del badge según el nivel de riesgo
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Estadísticas generales
  const totalPatients = patients.length
  const activePatients = patients.filter(p => p.status === 'Active').length
  const highRiskPatients = patients.filter(p => p.riskLevel === 'High').length
  const followUpRequired = patients.filter(p => p.followUpRequired).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos de pacientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Pacientes</h1>
            <p className="text-muted-foreground">
              {metadata.source && (
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Datos desde: {metadata.source}
                </span>
              )}
            </p>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                {activePatients} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePatients}</div>
              <p className="text-xs text-muted-foreground">
                {((activePatients / totalPatients) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alto Riesgo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highRiskPatients}</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención prioritaria
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seguimiento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{followUpRequired}</div>
              <p className="text-xs text-muted-foreground">
                Requieren seguimiento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, ID o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Active">Activo</SelectItem>
                  <SelectItem value="Inactive">Inactivo</SelectItem>
                  <SelectItem value="Follow-up">Seguimiento</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Nivel de riesgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="High">Alto riesgo</SelectItem>
                  <SelectItem value="Medium">Riesgo medio</SelectItem>
                  <SelectItem value="Low">Bajo riesgo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de pacientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>ID: {patient.id}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <Badge className={getRiskColor(patient.riskLevel)}>
                      {patient.riskLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.age} años, {patient.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Dr. {patient.assignedDoctor}</span>
                  </div>
                  {patient.followUpRequired && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span>Seguimiento requerido</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalles del Paciente: {patient.name}</DialogTitle>
                      </DialogHeader>
                      {selectedPatient && (
                        <Tabs defaultValue="general" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="medical">Médico</TabsTrigger>
                            <TabsTrigger value="communication">Comunicación</TabsTrigger>
                            <TabsTrigger value="insurance">Seguro</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="general" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Información Personal</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Nombre:</strong> {selectedPatient.name}</p>
                                  <p><strong>Edad:</strong> {selectedPatient.age} años</p>
                                  <p><strong>Género:</strong> {selectedPatient.gender}</p>
                                  <p><strong>Teléfono:</strong> {selectedPatient.phone}</p>
                                  <p><strong>Email:</strong> {selectedPatient.email}</p>
                                  <p><strong>Dirección:</strong> {selectedPatient.address}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Contacto de Emergencia</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Nombre:</strong> {selectedPatient.emergencyContact.name}</p>
                                  <p><strong>Relación:</strong> {selectedPatient.emergencyContact.relationship}</p>
                                  <p><strong>Teléfono:</strong> {selectedPatient.emergencyContact.phone}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="medical" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Historia Médica</h4>
                                <ul className="text-sm space-y-1">
                                  {selectedPatient.medicalHistory.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Alergias</h4>
                                <ul className="text-sm space-y-1">
                                  {selectedPatient.allergies.map((allergy: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                      {allergy}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Medicamentos Actuales</h4>
                              <ul className="text-sm space-y-1">
                                {selectedPatient.currentMedications.map((medication: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {medication}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="communication" className="space-y-4">
                            <h4 className="font-semibold">Historial de Comunicación</h4>
                            <div className="space-y-3">
                              {selectedPatient.communicationHistory.map((comm: any, index: number) => (
                                <div key={index} className="border rounded-lg p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline">{comm.type}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(comm.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm mb-1">{comm.summary}</p>
                                  <p className="text-xs text-muted-foreground">Dr. {comm.doctor}</p>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="insurance" className="space-y-4">
                            <h4 className="font-semibold mb-2">Información del Seguro</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Proveedor:</strong> {selectedPatient.insuranceInfo.provider}</p>
                              <p><strong>Número de Póliza:</strong> {selectedPatient.insuranceInfo.policyNumber}</p>
                              <p><strong>Cobertura:</strong> {selectedPatient.insuranceInfo.coverage}</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {patients.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron pacientes</h3>
              <p className="text-muted-foreground">
                {error ? 'Error cargando datos. Usando datos por defecto.' : 'Intenta ajustar los filtros de búsqueda.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
