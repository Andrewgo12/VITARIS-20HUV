import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNotifications } from '@/components/ui/notification-system';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Activity, 
  Database, 
  Zap,
  Shield,
  Users,
  Heart,
  Package,
  DollarSign,
  Video,
  FileText,
  AlertTriangle,
  Settings,
  BarChart3
} from 'lucide-react';

// Import ALL API services for complete verification
import { 
  vitarisApi,
  authApi,
  patientsApi,
  medicalApi,
  notificationsApi,
  systemApi,
  emergencyApi,
  labsApi,
  telemedicineApi,
  inventoryApi,
  billingApi,
  qualityApi,
  auditApi,
  filesApi,
  enhancedAppointmentsApi,
  enhancedUsersApi
} from '@/services/api';

interface APIEndpoint {
  name: string;
  description: string;
  icon: React.ReactNode;
  apiCall: () => Promise<any>;
  category: string;
  status: 'pending' | 'success' | 'error';
  response?: any;
  error?: string;
}

const CompleteAPIVerification: React.FC = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{success: number, error: number, total: number}>({
    success: 0,
    error: 0,
    total: 0
  });
  const { addNotification } = useNotifications();

  // Define ALL API endpoints for complete verification
  const apiEndpoints: Omit<APIEndpoint, 'status'>[] = [
    // Authentication APIs
    {
      name: 'Verify Token',
      description: 'Verificar token de autenticación',
      icon: <Shield className="w-4 h-4" />,
      apiCall: () => authApi.verifyToken(),
      category: 'Authentication'
    },

    // Patient APIs
    {
      name: 'Get All Patients',
      description: 'Obtener lista de todos los pacientes',
      icon: <Users className="w-4 h-4" />,
      apiCall: () => patientsApi.getAll(),
      category: 'Patients'
    },

    // Medical APIs
    {
      name: 'Get Vital Signs',
      description: 'Obtener signos vitales en tiempo real',
      icon: <Heart className="w-4 h-4" />,
      apiCall: () => medicalApi.getVitalSigns(),
      category: 'Medical'
    },
    {
      name: 'Get Medical Metrics',
      description: 'Obtener métricas médicas del sistema',
      icon: <Activity className="w-4 h-4" />,
      apiCall: () => medicalApi.getMetrics(),
      category: 'Medical'
    },
    {
      name: 'Get Admissions',
      description: 'Obtener lista de admisiones',
      icon: <Users className="w-4 h-4" />,
      apiCall: () => medicalApi.getAdmissions(),
      category: 'Medical'
    },
    {
      name: 'Get Surgeries',
      description: 'Obtener programación de cirugías',
      icon: <Activity className="w-4 h-4" />,
      apiCall: () => medicalApi.getSurgeries(),
      category: 'Medical'
    },

    // System APIs
    {
      name: 'Get System Metrics',
      description: 'Obtener métricas del sistema',
      icon: <Database className="w-4 h-4" />,
      apiCall: () => systemApi.getMetrics(),
      category: 'System'
    },
    {
      name: 'Get System Health',
      description: 'Verificar estado de salud del sistema',
      icon: <Zap className="w-4 h-4" />,
      apiCall: () => systemApi.getHealth(),
      category: 'System'
    },

    // Emergency APIs
    {
      name: 'Get Emergency Alerts',
      description: 'Obtener alertas de emergencia',
      icon: <AlertTriangle className="w-4 h-4" />,
      apiCall: () => emergencyApi.getAlerts(),
      category: 'Emergency'
    },

    // Labs APIs
    {
      name: 'Get Labs and Imaging',
      description: 'Obtener laboratorios e imágenes',
      icon: <FileText className="w-4 h-4" />,
      apiCall: () => labsApi.getLabsAndImaging(),
      category: 'Labs'
    },

    // Telemedicine APIs
    {
      name: 'Get Telemedicine Sessions',
      description: 'Obtener sesiones de telemedicina',
      icon: <Video className="w-4 h-4" />,
      apiCall: () => telemedicineApi.getSessions(),
      category: 'Telemedicine'
    },

    // Inventory APIs
    {
      name: 'Get Inventory',
      description: 'Obtener inventario médico',
      icon: <Package className="w-4 h-4" />,
      apiCall: () => inventoryApi.getAll(),
      category: 'Inventory'
    },

    // Billing APIs
    {
      name: 'Get Billing',
      description: 'Obtener información de facturación',
      icon: <DollarSign className="w-4 h-4" />,
      apiCall: () => billingApi.getAll(),
      category: 'Billing'
    },

    // Quality APIs
    {
      name: 'Get Quality Metrics',
      description: 'Obtener métricas de calidad',
      icon: <BarChart3 className="w-4 h-4" />,
      apiCall: () => qualityApi.getMetrics(),
      category: 'Quality'
    },

    // Audit APIs
    {
      name: 'Get Audit Logs',
      description: 'Obtener registros de auditoría',
      icon: <FileText className="w-4 h-4" />,
      apiCall: () => auditApi.getLogs(),
      category: 'Audit'
    },

    // Appointments APIs
    {
      name: 'Get Appointments',
      description: 'Obtener citas médicas',
      icon: <Settings className="w-4 h-4" />,
      apiCall: () => enhancedAppointmentsApi.getAll(),
      category: 'Appointments'
    },

    // Users APIs
    {
      name: 'Get All Users',
      description: 'Obtener lista de usuarios',
      icon: <Users className="w-4 h-4" />,
      apiCall: () => enhancedUsersApi.getAll(),
      category: 'Users'
    },
    {
      name: 'Get User Profile',
      description: 'Obtener perfil de usuario',
      icon: <Users className="w-4 h-4" />,
      apiCall: () => enhancedUsersApi.getProfile(),
      category: 'Users'
    },

    // Notifications APIs
    {
      name: 'Get Notifications',
      description: 'Obtener notificaciones del sistema',
      icon: <AlertTriangle className="w-4 h-4" />,
      apiCall: () => notificationsApi.getAll(),
      category: 'Notifications'
    }
  ];

  useEffect(() => {
    const initialEndpoints = apiEndpoints.map(endpoint => ({
      ...endpoint,
      status: 'pending' as const
    }));
    setEndpoints(initialEndpoints);
    setResults({
      success: 0,
      error: 0,
      total: initialEndpoints.length
    });
  }, []);

  const testAllEndpoints = async () => {
    setTesting(true);
    setProgress(0);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      
      try {
        const response = await endpoint.apiCall();
        
        setEndpoints(prev => prev.map((ep, index) => 
          index === i 
            ? { ...ep, status: 'success', response }
            : ep
        ));
        
        successCount++;
        
        addNotification({
          type: 'info',
          title: `✅ ${endpoint.name}`,
          message: 'API endpoint funcionando correctamente',
          priority: 'low'
        });
        
      } catch (error) {
        setEndpoints(prev => prev.map((ep, index) => 
          index === i 
            ? { ...ep, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
            : ep
        ));
        
        errorCount++;
        
        addNotification({
          type: 'warning',
          title: `❌ ${endpoint.name}`,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          priority: 'medium'
        });
      }
      
      setProgress(((i + 1) / endpoints.length) * 100);
      setResults({
        success: successCount,
        error: errorCount,
        total: endpoints.length
      });
      
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTesting(false);
    
    addNotification({
      type: 'info',
      title: 'Verificación Completa',
      message: `${successCount}/${endpoints.length} endpoints funcionando correctamente`,
      priority: 'high'
    });
  };

  const resetTests = () => {
    setEndpoints(prev => prev.map(ep => ({
      ...ep,
      status: 'pending' as const,
      response: undefined,
      error: undefined
    })));
    setProgress(0);
    setResults({
      success: 0,
      error: 0,
      total: endpoints.length
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Loader2 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Exitoso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>;
    }
  };

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, APIEndpoint[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verificación Completa de APIs
        </h1>
        <p className="text-gray-600">
          Prueba todos los endpoints de la API para verificar el 100% de funcionalidad
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Panel de Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={testAllEndpoints} 
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {testing ? 'Probando...' : 'Probar Todos los Endpoints'}
            </Button>
            
            <Button 
              onClick={resetTests} 
              variant="outline"
              disabled={testing}
            >
              Reiniciar Pruebas
            </Button>
          </div>

          {testing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.success}</div>
              <div className="text-sm text-gray-600">Exitosos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{results.error}</div>
              <div className="text-sm text-gray-600">Errores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results by Category */}
      {Object.entries(groupedEndpoints).map(([category, categoryEndpoints]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {category} APIs ({categoryEndpoints.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {endpoint.icon}
                    <div>
                      <div className="font-medium">{endpoint.name}</div>
                      <div className="text-sm text-gray-600">{endpoint.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(endpoint.status)}
                    {getStatusBadge(endpoint.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary Alert */}
      {results.success > 0 || results.error > 0 ? (
        <Alert className={results.error === 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {results.error === 0 ? (
              <span className="text-green-800">
                🎉 ¡Excelente! Todos los {results.success} endpoints están funcionando correctamente.
                El sistema VITARIS tiene 100% de conectividad API.
              </span>
            ) : (
              <span className="text-yellow-800">
                ⚠️ {results.success} endpoints funcionando, {results.error} con errores.
                Revisa los endpoints con errores para completar la integración.
              </span>
            )}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export default CompleteAPIVerification;
