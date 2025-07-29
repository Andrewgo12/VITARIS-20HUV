import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  LogOut,
  Heart,
  Activity,
  Clock,
  User,
  Shield,
  MonitorSpeaker,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


// Mock patient data
const mockPatients = [
  {
    id: 1,
    identificationType: "CC",
    identificationNumber: "12345678",
    fullName: "Juan Carlos Pérez González",
    eps: "NUEVA_EPS",
    age: 45,
    symptoms: "Dolor torácico agudo, dificultad respiratoria",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 14:30",
    status: "PENDING",
    vitals: { heartRate: "120", temperature: "38.5", bloodPressure: "160/95" },
  },
  {
    id: 2,
    identificationType: "CC",
    identificationNumber: "87654321",
    fullName: "María Elena Rodríguez Vargas",
    eps: "SANITAS",
    age: 32,
    symptoms: "Dolor abdominal severo, náuseas y vómito",
    urgencyLevel: "SEVERO",
    arrivalTime: "2024-01-15 15:15",
    status: "PENDING",
    vitals: { heartRate: "95", temperature: "37.8", bloodPressure: "140/85" },
  },
  {
    id: 3,
    identificationType: "CC",
    identificationNumber: "11223344",
    fullName: "Carlos Alberto Mendoza Silva",
    eps: "FAMISANAR",
    age: 58,
    symptoms: "Accidente de tránsito, posible fractura de fémur",
    urgencyLevel: "CRITICO",
    arrivalTime: "2024-01-15 16:00",
    status: "PENDING",
    vitals: { heartRate: "110", temperature: "36.8", bloodPressure: "150/90" },
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: { scale: 0.98 },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function HUVDashboard() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [priorityRating, setPriorityRating] = useState("");
  const [authorizationNotes, setAuthorizationNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const navigate = useNavigate();

  const handleAuthorize = (patientId: number, authorized: boolean) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: authorized ? "AUTHORIZED" : "REJECTED" }
          : p,
      ),
    );
  };

  const handleSetPriority = (patientId: number, priority: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, urgencyLevel: priority } : p,
      ),
    );
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICO":
        return "destructive";
      case "SEVERO":
        return "warning";
      case "MODERADO":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AUTHORIZED":
        return "success";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredPatients =
    filterStatus === "ALL"
      ? patients
      : patients.filter((p) => p.status === filterStatus);

  return (
    <motion.div 
      className="min-h-screen bg-gray-100 p-4 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 text-red-200 opacity-20"
          variants={floatingVariants}
          animate="float"
        >
          <Heart className="w-20 h-20" />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 text-emerald-200 opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1 }}
        >
          <Activity className="w-16 h-16" />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 text-blue-200 opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 2 }}
        >
          <Shield className="w-18 h-18" />
        </motion.div>
      </div>

      {/* Enhanced Header with Vital Red Branding */}
      <motion.div 
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-0 p-8 mb-6 relative overflow-hidden"
        variants={headerVariants}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-full h-full text-red-500" />
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <motion.div 
            className="flex items-center gap-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Vital Red Logo */}
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight">
                  VITAL <span className="text-red-500 font-light">RED</span>
                </h1>
                <p className="text-black font-medium">Dashboard HUV</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Badge variant="outline" className="bg-emerald-100 border-emerald-300 text-emerald-700 px-4 py-2">
                <MonitorSpeaker className="w-4 h-4 mr-2" />
                Sistema Activo
              </Badge>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div 
        className="mb-6"
        variants={headerVariants}
      >
        <Card withMotion={false} className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-black">Remisiones Pendientes</h2>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 h-12 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los Estados</SelectItem>
                    <SelectItem value="PENDING">Pendientes</SelectItem>
                    <SelectItem value="AUTHORIZED">Autorizados</SelectItem>
                    <SelectItem value="REJECTED">Rechazados</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Patient List with Stagger Animation */}
      <motion.div 
        className="space-y-4"
        variants={listVariants}
      >
        <AnimatePresence mode="popLayout">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                withMotion={false}
                className={`
                  bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300
                  ${patient.urgencyLevel === "CRITICO" ? "border-l-8 border-l-red-500 shadow-red-100" : 
                    patient.urgencyLevel === "SEVERO" ? "border-l-8 border-l-amber-500 shadow-amber-100" :
                    "border-l-8 border-l-blue-500 shadow-blue-100"}
                `}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-6"
                      variants={{
                        visible: {
                          transition: { staggerChildren: 0.05 }
                        }
                      }}
                    >
                      {/* Patient Avatar */}
                      <motion.div 
                        className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {patient.fullName.split(' ').map(n => n[0]).join('')}
                      </motion.div>

                      <motion.div className="flex-1" variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-black">{patient.fullName}</h3>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge 
                              variant={getPriorityColor(patient.urgencyLevel)}
                              className="px-3 py-1 font-semibold"
                            >
                              {patient.urgencyLevel}
                            </Badge>
                          </motion.div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <motion.div 
                            className="flex items-center gap-2"
                            variants={itemVariants}
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-black">{patient.identificationNumber}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-2"
                            variants={itemVariants}
                          >
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-black">{patient.arrivalTime}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-2"
                            variants={itemVariants}
                          >
                            <Activity className="w-4 h-4 text-gray-500" />
                            <span className="text-black">{patient.eps}</span>
                          </motion.div>
                        </div>
                        
                        <motion.p 
                          className="text-black mt-2 leading-relaxed"
                          variants={itemVariants}
                        >
                          {patient.symptoms}
                        </motion.p>
                      </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                      className="flex items-center gap-3"
                      variants={{
                        visible: {
                          transition: { staggerChildren: 0.05 }
                        }
                      }}
                    >
                      <motion.div variants={itemVariants}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPatient(patient)}
                                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver
                              </Button>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-black">
                                Evaluación de Remisión
                              </DialogTitle>
                            </DialogHeader>
                            {selectedPatient && (
                              <motion.div 
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                              >
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label className="text-black font-semibold">Paciente</Label>
                                    <p className="text-black">{selectedPatient.fullName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-black font-semibold">Urgencia</Label>
                                    <Badge variant={getPriorityColor(selectedPatient.urgencyLevel)}>
                                      {selectedPatient.urgencyLevel}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-black font-semibold">Síntomas</Label>
                                  <p className="text-black mt-1">{selectedPatient.symptoms}</p>
                                </div>

                                <div>
                                  <Label htmlFor="priority" className="text-black font-semibold">Prioridad Hospitalaria</Label>
                                  <Select value={priorityRating} onValueChange={setPriorityRating}>
                                    <SelectTrigger className="h-12 rounded-xl border-2">
                                      <SelectValue placeholder="Seleccionar prioridad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="CRITICO">Crítico</SelectItem>
                                      <SelectItem value="SEVERO">Severo</SelectItem>
                                      <SelectItem value="MODERADO">Moderado</SelectItem>
                                      <SelectItem value="LEVE">Leve</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="notes" className="text-black font-semibold">Notas de Autorización</Label>
                                  <Textarea
                                    id="notes"
                                    value={authorizationNotes}
                                    onChange={(e) => setAuthorizationNotes(e.target.value)}
                                    placeholder="Observaciones médicas..."
                                    className="rounded-xl border-2 resize-none"
                                    rows={3}
                                  />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        handleAuthorize(selectedPatient.id, false);
                                        setSelectedPatient(null);
                                      }}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Rechazar
                                    </Button>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant="success"
                                      onClick={() => {
                                        handleAuthorize(selectedPatient.id, true);
                                        if (priorityRating) {
                                          handleSetPriority(selectedPatient.id, priorityRating);
                                        }
                                        setSelectedPatient(null);
                                      }}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Autorizar
                                    </Button>
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge variant={getStatusColor(patient.status)} className="px-3 py-1">
                            {patient.status === "PENDING" ? "Pendiente" :
                             patient.status === "AUTHORIZED" ? "Autorizado" : "Rechazado"}
                          </Badge>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Empty State */}
      <AnimatePresence>
        {filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <Card withMotion={false} className="text-center p-12 bg-white/90">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No hay pacientes con este filtro
              </h3>
              <p className="text-black">
                Cambie el filtro para ver más remisiones.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
