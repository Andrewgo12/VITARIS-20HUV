import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowDown,
  Home,
  LogIn,
  FileText,
  Monitor,
  Users,
  Heart,
  Files,
  CheckCircle,
  Stethoscope,
  Calculator,
  Eye,
  Settings,
  UserCheck,
  Activity,
  Search,
  Database
} from "lucide-react";

export default function FlowchartFrontend() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Diagrama de Flujo - Frontend VITARIS
              </h1>
              <p className="text-muted-foreground text-lg">
                Flujo completo de navegación y vistas del sistema médico
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
            Frontend Flow
          </Badge>
        </div>

        {/* Diagrama de flujo */}
        <div className="space-y-8">
          
          {/* 1. Punto de entrada */}
          <div className="text-center">
            <Card className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white max-w-sm">
              <CardContent className="p-6">
                <Home className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Landing Page</h3>
                <p className="text-sm opacity-90">Página principal del sistema</p>
                <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /</div>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-4">
              <ArrowDown className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          {/* 2. Autenticación */}
          <div className="text-center">
            <Card className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white max-w-sm">
              <CardContent className="p-6">
                <LogIn className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Sistema de Login</h3>
                <p className="text-sm opacity-90">Autenticación EPS/HUV</p>
                <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /login</div>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-4">
              <ArrowDown className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          {/* 3. Bifurcación por rol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Lado EPS */}
            <div className="space-y-6">
              <div className="text-center">
                <Badge className="bg-orange-500 text-white text-lg px-4 py-2">ROL: EPS</Badge>
              </div>
              
              {/* Formulario EPS */}
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold">Formulario EPS</h3>
                  <p className="text-sm opacity-90">Wizard de 5 pasos</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /eps-form</div>
                </CardContent>
              </Card>
              
              {/* 5 Modales del formulario */}
              <div className="space-y-3">
                <div className="text-center text-sm font-semibold text-gray-600">Pasos del Formulario:</div>
                
                <Card className="bg-orange-100 border-orange-300">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="font-semibold">Identificación del Paciente</div>
                      <div className="text-xs text-gray-600">Datos personales y contacto</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-100 border-red-300">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="font-semibold">Diagnóstico y Referencia</div>
                      <div className="text-xs text-gray-600">Información médica detallada</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-pink-100 border-pink-300">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="font-semibold">Signos Vitales</div>
                      <div className="text-xs text-gray-600">Parámetros médicos</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-100 border-yellow-300">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <div className="font-semibold">Gestión de Documentos</div>
                      <div className="text-xs text-gray-600">Carga y verificación</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-100 border-green-300">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <div>
                      <div className="font-semibold">Validación Final</div>
                      <div className="text-xs text-gray-600">Confirmación y envío</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Lado HUV */}
            <div className="space-y-6">
              <div className="text-center">
                <Badge className="bg-purple-500 text-white text-lg px-4 py-2">ROL: HUV</Badge>
              </div>
              
              {/* Dashboard básico */}
              <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <CardContent className="p-6 text-center">
                  <Monitor className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold">Dashboard HUV Básico</h3>
                  <p className="text-sm opacity-90">Lista de remisiones</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /huv-dashboard</div>
                </CardContent>
              </Card>
              
              {/* Dashboard avanzado */}
              <Card className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <Stethoscope className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold">Dashboard Médico Avanzado</h3>
                  <p className="text-sm opacity-90">Gestión médica completa</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /huv-dashboard-advanced</div>
                </CardContent>
              </Card>
              
              {/* Vista individual */}
              <Card className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold">Vista Individual Paciente</h3>
                  <p className="text-sm opacity-90">Historia clínica completa</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /patient/:id</div>
                </CardContent>
              </Card>
              
              {/* Herramientas médicas */}
              <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <Calculator className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold">Herramientas Médicas</h3>
                  <p className="text-sm opacity-90">Calculadoras y protocolos</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /medical-tools</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 4. Sistema de navegación transversal */}
          <div className="text-center mt-12">
            <div className="mb-6">
              <Badge className="bg-gray-500 text-white text-lg px-4 py-2">SISTEMA TRANSVERSAL</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              
              {/* Explorador de vistas */}
              <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                <CardContent className="p-6 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-lg font-bold">Explorador de Vistas</h3>
                  <p className="text-sm opacity-90">Hub central de navegación</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /system</div>
                </CardContent>
              </Card>
              
              {/* Modales demo */}
              <Card className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-lg font-bold">Modales Demo</h3>
                  <p className="text-sm opacity-90">5 vistas individuales</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /demo/*</div>
                </CardContent>
              </Card>
              
              {/* NotFound */}
              <Card className="bg-gradient-to-r from-gray-500 to-slate-600 text-white">
                <CardContent className="p-6 text-center">
                  <Search className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-lg font-bold">404 - NotFound</h3>
                  <p className="text-sm opacity-90">Página no encontrada</p>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">Route: /*</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 5. Flujo de navegación detallado */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flujo de Navegación Detallado
            </h2>
            
            <div className="max-w-6xl mx-auto">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-center text-xl">Mapa de Rutas y Conexiones</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Rutas principales */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-blue-700">🏠 Rutas Principales</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/</code></span>
                          <span>Landing Page</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/login</code></span>
                          <span>Sistema de Login</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/eps-form</code></span>
                          <span>Formulario EPS (5 pasos)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/huv-dashboard</code></span>
                          <span>Dashboard HUV Básico</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/system</code></span>
                          <span>Explorador de Vistas</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rutas avanzadas */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-purple-700">⚕️ Rutas Médicas Avanzadas</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/huv-dashboard-advanced</code></span>
                          <span>Dashboard Médico</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/patient/:id</code></span>
                          <span>Vista Individual</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/medical-tools</code></span>
                          <span>Herramientas Médicas</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/demo/*</code></span>
                          <span>Modales Demo (5)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                          <span><code>/*</code></span>
                          <span>NotFound</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conexiones entre vistas */}
                  <div className="mt-8">
                    <h3 className="font-bold text-lg mb-4 text-green-700">🔗 Conexiones de Navegación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <div className="font-semibold mb-2">Desde Landing Page:</div>
                        <div>→ Login</div>
                        <div>→ Sistema (/system)</div>
                        <div>→ Info sections</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <div className="font-semibold mb-2">Desde Sistema:</div>
                        <div>→ Todas las vistas</div>
                        <div>→ Modales demo</div>
                        <div>→ Dashboard avanzado</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded border border-purple-200">
                        <div className="font-semibold mb-2">Desde Dashboard:</div>
                        <div>→ Vista paciente</div>
                        <div>→ Herramientas médicas</div>
                        <div>→ Modales de acción</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-12">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-center">📊 Estadísticas del Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-gray-600">Rutas Totales</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-green-600">6</div>
                    <div className="text-sm text-gray-600">Páginas Principales</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-sm text-gray-600">Modales Demo</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Roles de Usuario</div>
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
