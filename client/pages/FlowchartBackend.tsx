import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Database,
  Server,
  Shield,
  Bell,
  FileText,
  Users,
  Activity,
  Cloud,
  Lock,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3,
  Upload,
  Download,
  Smartphone,
  Globe,
  Zap,
} from "lucide-react";

export default function FlowchartBackend() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Diagrama de Flujo - Backend Vital Red
              </h1>
              <p className="text-muted-foreground text-lg">
                Arquitectura backend completa esperada para el sistema médico
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-sm bg-slate-50 text-slate-700 border-slate-200"
          >
            Backend Architecture
          </Badge>
        </div>

        {/* Diagrama de arquitectura */}
        <div className="space-y-12">
          {/* 1. Capa de Entrada - API Gateway */}
          <div className="text-center">
            <Card className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white max-w-md">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">API Gateway</h3>
                <p className="text-sm opacity-90">
                  Punto de entrada único al sistema
                </p>
                <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">
                  nginx / Express Gateway
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-4">
              <ArrowDown className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          {/* 2. Capa de Autenticación y Autorización */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-bold">Autenticación</h3>
                <p className="text-sm opacity-90">JWT + OAuth 2.0</p>
                <div className="text-xs mt-2 space-y-1">
                  <div className="bg-white/20 rounded px-2 py-1">
                    JWT Tokens
                  </div>
                  <div className="bg-white/20 rounded px-2 py-1">
                    2FA Opcional
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardContent className="p-6 text-center">
                <Lock className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-bold">Autorización</h3>
                <p className="text-sm opacity-90">RBAC + Permisos</p>
                <div className="text-xs mt-2 space-y-1">
                  <div className="bg-white/20 rounded px-2 py-1">
                    Roles: EPS, HUV, Admin
                  </div>
                  <div className="bg-white/20 rounded px-2 py-1">
                    ACL Granular
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
              <CardContent className="p-6 text-center">
                <Activity className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-bold">Session Management</h3>
                <p className="text-sm opacity-90">Redis + JWT</p>
                <div className="text-xs mt-2 space-y-1">
                  <div className="bg-white/20 rounded px-2 py-1">
                    Session Store
                  </div>
                  <div className="bg-white/20 rounded px-2 py-1">
                    Token Refresh
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-gray-400" />
          </div>

          {/* 3. Microservicios Core */}
          <div>
            <div className="text-center mb-8">
              <Badge className="bg-slate-600 text-white text-lg px-4 py-2">
                MICROSERVICIOS CORE
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Servicio de Usuarios */}
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <CardContent className="p-6">
                  <Users className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold text-center mb-2">User Service</h3>
                  <div className="text-xs space-y-1">
                    <div>• Gestión de usuarios EPS/HUV</div>
                    <div>• Perfiles y roles</div>
                    <div>• Configuraciones</div>
                    <div>• Auditoría de accesos</div>
                  </div>
                  <div className="text-xs mt-3 bg-white/20 rounded px-2 py-1 text-center">
                    POST /api/users | GET /api/users
                  </div>
                </CardContent>
              </Card>

              {/* Servicio de Remisiones */}
              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CardContent className="p-6">
                  <FileText className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold text-center mb-2">
                    Referral Service
                  </h3>
                  <div className="text-xs space-y-1">
                    <div>• CRUD de remisiones</div>
                    <div>• Validación médica</div>
                    <div>• Estados y workflow</div>
                    <div>• Trazabilidad completa</div>
                  </div>
                  <div className="text-xs mt-3 bg-white/20 rounded px-2 py-1 text-center">
                    POST /api/referrals | PUT /api/referrals/:id
                  </div>
                </CardContent>
              </Card>

              {/* Servicio de Pacientes */}
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <Activity className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold text-center mb-2">
                    Patient Service
                  </h3>
                  <div className="text-xs space-y-1">
                    <div>• Historia clínica</div>
                    <div>• Signos vitales</div>
                    <div>• Antecedentes médicos</div>
                    <div>• Seguimiento</div>
                  </div>
                  <div className="text-xs mt-3 bg-white/20 rounded px-2 py-1 text-center">
                    GET /api/patients/:id | POST /api/vitals
                  </div>
                </CardContent>
              </Card>

              {/* Servicio de Documentos */}
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardContent className="p-6">
                  <Upload className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold text-center mb-2">
                    Document Service
                  </h3>
                  <div className="text-xs space-y-1">
                    <div>• Upload de archivos</div>
                    <div>• Validación de formatos</div>
                    <div>• Almacenamiento seguro</div>
                    <div>• OCR y análisis</div>
                  </div>
                  <div className="text-xs mt-3 bg-white/20 rounded px-2 py-1 text-center">
                    POST /api/documents | GET /api/documents/:id
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 4. Servicios de Soporte */}
          <div>
            <div className="text-center mb-8">
              <Badge className="bg-indigo-600 text-white text-lg px-4 py-2">
                SERVICIOS DE SOPORTE
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Notificaciones */}
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                <CardContent className="p-6">
                  <Bell className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold text-center mb-2">
                    Notification Service
                  </h3>
                  <div className="text-xs space-y-1">
                    <div>• Email notifications</div>
                    <div>• SMS alerts</div>
                    <div>• Push notifications</div>
                    <div>• Webhook integrations</div>
                  </div>
                  <div className="text-xs mt-3 bg-white/20 rounded px-2 py-1 text-center">
                    WebSocket + Queue
                  </div>
                </CardContent>
              </Card>

              {/* Validaciones */}
              <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                <CardContent className="p-6">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold text-center mb-2">
                    Validation Service
                  </h3>
                  <div className="text-xs space-y-1">
                    <div>• Validación de esquemas</div>
                    <div>• Reglas de negocio</div>
                    <div>• Validación médica</div>
                    <div>• Cross-validation</div>
                  </div>
                  <div className="text-xs mt-3 bg-white/20 rounded px-2 py-1 text-center">
                    Joi/Zod + Rules Engine
                  </div>
                </CardContent>
              </Card>

              {/* Auditoría */}
              <Card className="bg-gradient-to-br from-slate-500 to-gray-600 text-white">
                <CardContent className="p-6">
                  <BarChart3 className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold text-center mb-2">Audit Service</h3>
                  <div className="text-xs space-y-1">
                    <div>• Logs de auditoría</div>
                    <div>• Trazabilidad</div>
                    <div>• Compliance</div>
                    <div>• Reportes</div>
                  </div>
                  <div className="text-xs mt-3 bg-white/20 rounded px-2 py-1 text-center">
                    ElasticSearch + Logstash
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 5. Capa de Datos */}
          <div>
            <div className="flex justify-center mb-8">
              <ArrowDown className="w-8 h-8 text-gray-400" />
            </div>

            <div className="text-center mb-8">
              <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                CAPA DE DATOS
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Base de datos principal */}
              <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                <CardContent className="p-6 text-center">
                  <Database className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">PostgreSQL</h3>
                  <div className="text-xs space-y-1">
                    <div>• Datos transaccionales</div>
                    <div>• Usuarios y roles</div>
                    <div>• Remisiones</div>
                    <div>• Pacientes</div>
                  </div>
                </CardContent>
              </Card>

              {/* Cache */}
              <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <CardContent className="p-6 text-center">
                  <Zap className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Redis</h3>
                  <div className="text-xs space-y-1">
                    <div>• Cache de sesiones</div>
                    <div>• Cache de datos</div>
                    <div>• Rate limiting</div>
                    <div>• Real-time data</div>
                  </div>
                </CardContent>
              </Card>

              {/* Almacenamiento */}
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <CardContent className="p-6 text-center">
                  <Cloud className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">S3 / MinIO</h3>
                  <div className="text-xs space-y-1">
                    <div>• Documentos médicos</div>
                    <div>• Imágenes</div>
                    <div>• Backups</div>
                    <div>• Archivos adjuntos</div>
                  </div>
                </CardContent>
              </Card>

              {/* Búsqueda */}
              <Card className="bg-gradient-to-br from-purple-500 to-violet-500 text-white">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">ElasticSearch</h3>
                  <div className="text-xs space-y-1">
                    <div>• Búsqueda avanzada</div>
                    <div>• Logs y auditoría</div>
                    <div>• Analytics</div>
                    <div>• Reportes</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 6. Integraciones Externas */}
          <div>
            <div className="text-center mb-8">
              <Badge className="bg-orange-600 text-white text-lg px-4 py-2">
                INTEGRACIONES EXTERNAS
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Sistema HUV */}
              <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                <CardContent className="p-6 text-center">
                  <Server className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Sistema HUV</h3>
                  <div className="text-xs space-y-1">
                    <div>• API REST</div>
                    <div>• WebHooks</div>
                    <div>• Sincronización</div>
                    <div>• Status updates</div>
                  </div>
                </CardContent>
              </Card>

              {/* Sistemas EPS */}
              <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                <CardContent className="p-6 text-center">
                  <Globe className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Sistemas EPS</h3>
                  <div className="text-xs space-y-1">
                    <div>• OAuth 2.0</div>
                    <div>• API standardizada</div>
                    <div>• Data validation</div>
                    <div>• Callbacks</div>
                  </div>
                </CardContent>
              </Card>

              {/* MinSalud */}
              <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <CardContent className="p-6 text-center">
                  <Shield className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">MinSalud</h3>
                  <div className="text-xs space-y-1">
                    <div>• Compliance</div>
                    <div>• Reportes</div>
                    <div>• Estadísticas</div>
                    <div>• Certificación</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 7. API Endpoints Detallados */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              API Endpoints Esperados
            </h2>

            <div className="max-w-6xl mx-auto">
              <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-center text-xl">
                    Documentación de APIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Autenticación */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-green-700">
                        🔐 Autenticación
                      </h3>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="p-2 bg-green-100 rounded border">
                          <span className="text-green-800 font-bold">POST</span>{" "}
                          /api/auth/login
                        </div>
                        <div className="p-2 bg-blue-100 rounded border">
                          <span className="text-blue-800 font-bold">POST</span>{" "}
                          /api/auth/refresh
                        </div>
                        <div className="p-2 bg-red-100 rounded border">
                          <span className="text-red-800 font-bold">POST</span>{" "}
                          /api/auth/logout
                        </div>
                        <div className="p-2 bg-purple-100 rounded border">
                          <span className="text-purple-800 font-bold">GET</span>{" "}
                          /api/auth/profile
                        </div>
                      </div>
                    </div>

                    {/* Remisiones */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-blue-700">
                        📋 Remisiones
                      </h3>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="p-2 bg-green-100 rounded border">
                          <span className="text-green-800 font-bold">POST</span>{" "}
                          /api/referrals
                        </div>
                        <div className="p-2 bg-blue-100 rounded border">
                          <span className="text-blue-800 font-bold">GET</span>{" "}
                          /api/referrals
                        </div>
                        <div className="p-2 bg-yellow-100 rounded border">
                          <span className="text-yellow-800 font-bold">PUT</span>{" "}
                          /api/referrals/:id
                        </div>
                        <div className="p-2 bg-purple-100 rounded border">
                          <span className="text-purple-800 font-bold">GET</span>{" "}
                          /api/referrals/:id
                        </div>
                      </div>
                    </div>

                    {/* Pacientes */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-purple-700">
                        👤 Pacientes
                      </h3>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="p-2 bg-green-100 rounded border">
                          <span className="text-green-800 font-bold">POST</span>{" "}
                          /api/patients
                        </div>
                        <div className="p-2 bg-blue-100 rounded border">
                          <span className="text-blue-800 font-bold">GET</span>{" "}
                          /api/patients/:id
                        </div>
                        <div className="p-2 bg-yellow-100 rounded border">
                          <span className="text-yellow-800 font-bold">PUT</span>{" "}
                          /api/patients/:id
                        </div>
                        <div className="p-2 bg-purple-100 rounded border">
                          <span className="text-purple-800 font-bold">
                            POST
                          </span>{" "}
                          /api/patients/:id/vitals
                        </div>
                      </div>
                    </div>

                    {/* Documentos */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-orange-700">
                        📄 Documentos
                      </h3>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="p-2 bg-green-100 rounded border">
                          <span className="text-green-800 font-bold">POST</span>{" "}
                          /api/documents/upload
                        </div>
                        <div className="p-2 bg-blue-100 rounded border">
                          <span className="text-blue-800 font-bold">GET</span>{" "}
                          /api/documents/:id
                        </div>
                        <div className="p-2 bg-yellow-100 rounded border">
                          <span className="text-yellow-800 font-bold">PUT</span>{" "}
                          /api/documents/:id/verify
                        </div>
                        <div className="p-2 bg-red-100 rounded border">
                          <span className="text-red-800 font-bold">DELETE</span>{" "}
                          /api/documents/:id
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WebSockets */}
                  <div className="mt-8">
                    <h3 className="font-bold text-lg mb-4 text-cyan-700">
                      ⚡ Real-time (WebSockets)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-cyan-50 p-4 rounded border border-cyan-200">
                        <div className="font-semibold mb-2">
                          Notificaciones:
                        </div>
                        <div>• Nuevas remisiones</div>
                        <div>• Cambios de estado</div>
                        <div>• Alertas críticas</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <div className="font-semibold mb-2">
                          Dashboard Updates:
                        </div>
                        <div>• Estadísticas en vivo</div>
                        <div>• Estado de pacientes</div>
                        <div>• Queue en tiempo real</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <div className="font-semibold mb-2">Colaboración:</div>
                        <div>• Multi-user editing</div>
                        <div>• Chat interno</div>
                        <div>• Status indicators</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 8. Tecnologías y Stack */}
          <div className="mt-12">
            <Card className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-center">
                  🛠️ Stack Tecnológico Recomendado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-lg mb-3">
                      <Server className="w-8 h-8 mx-auto text-green-600" />
                    </div>
                    <h4 className="font-bold mb-2">Backend</h4>
                    <div className="text-sm space-y-1">
                      <div>Node.js + Express</div>
                      <div>TypeScript</div>
                      <div>Nest.js (opcional)</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 p-4 rounded-lg mb-3">
                      <Database className="w-8 h-8 mx-auto text-blue-600" />
                    </div>
                    <h4 className="font-bold mb-2">Base de Datos</h4>
                    <div className="text-sm space-y-1">
                      <div>PostgreSQL</div>
                      <div>Redis</div>
                      <div>ElasticSearch</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 p-4 rounded-lg mb-3">
                      <Cloud className="w-8 h-8 mx-auto text-purple-600" />
                    </div>
                    <h4 className="font-bold mb-2">Cloud & DevOps</h4>
                    <div className="text-sm space-y-1">
                      <div>Docker</div>
                      <div>Kubernetes</div>
                      <div>AWS/Azure</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 p-4 rounded-lg mb-3">
                      <Shield className="w-8 h-8 mx-auto text-orange-600" />
                    </div>
                    <h4 className="font-bold mb-2">Seguridad</h4>
                    <div className="text-sm space-y-1">
                      <div>JWT + OAuth</div>
                      <div>SSL/TLS</div>
                      <div>Rate Limiting</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 9. Métricas de rendimiento */}
          <div className="mt-12">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-center">
                  📈 Métricas de Rendimiento Esperadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-blue-600">
                      &lt;200ms
                    </div>
                    <div className="text-sm text-gray-600">
                      API Response Time
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-green-600">
                      99.9%
                    </div>
                    <div className="text-sm text-gray-600">Uptime SLA</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-purple-600">
                      10K+
                    </div>
                    <div className="text-sm text-gray-600">
                      Concurrent Users
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-orange-600">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600">Availability</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
