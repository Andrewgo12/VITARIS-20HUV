import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Clock,
  User,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle,
  X,
  Phone,
  MessageSquare,
  Mail,
  Settings,
  Pause,
  Play
} from 'lucide-react';

interface AlertRule {
  id: string;
  parameter: string;
  condition: 'greater' | 'less' | 'between';
  value: number;
  value2?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  description: string;
}

interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  parameter: string;
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  responseTime?: number;
}

interface AlertsManagerProps {
  patients: any[];
  onAlertAction?: (alertId: string, action: string) => void;
}

const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'hr_high',
    parameter: 'hr',
    condition: 'greater',
    value: 120,
    severity: 'high',
    enabled: true,
    description: 'Frecuencia cardíaca alta'
  },
  {
    id: 'hr_low',
    parameter: 'hr',
    condition: 'less',
    value: 50,
    severity: 'high',
    enabled: true,
    description: 'Frecuencia cardíaca baja'
  },
  {
    id: 'hr_critical_high',
    parameter: 'hr',
    condition: 'greater',
    value: 150,
    severity: 'critical',
    enabled: true,
    description: 'Frecuencia cardíaca crítica alta'
  },
  {
    id: 'bp_high',
    parameter: 'systolic',
    condition: 'greater',
    value: 180,
    severity: 'high',
    enabled: true,
    description: 'Presión sistólica alta'
  },
  {
    id: 'bp_low',
    parameter: 'systolic',
    condition: 'less',
    value: 90,
    severity: 'high',
    enabled: true,
    description: 'Presión sistólica baja'
  },
  {
    id: 'spo2_low',
    parameter: 'spo2',
    condition: 'less',
    value: 92,
    severity: 'high',
    enabled: true,
    description: 'Saturación de oxígeno baja'
  },
  {
    id: 'spo2_critical',
    parameter: 'spo2',
    condition: 'less',
    value: 88,
    severity: 'critical',
    enabled: true,
    description: 'Saturación de oxígeno crítica'
  },
  {
    id: 'temp_high',
    parameter: 'temp',
    condition: 'greater',
    value: 38.5,
    severity: 'medium',
    enabled: true,
    description: 'Temperatura alta'
  },
  {
    id: 'temp_critical_high',
    parameter: 'temp',
    condition: 'greater',
    value: 40,
    severity: 'critical',
    enabled: true,
    description: 'Temperatura crítica alta'
  },
  {
    id: 'temp_low',
    parameter: 'temp',
    condition: 'less',
    value: 35,
    severity: 'high',
    enabled: true,
    description: 'Hipotermia'
  }
];

export default function AlertsManager({ patients, onAlertAction }: AlertsManagerProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(DEFAULT_ALERT_RULES);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoResolve, setAutoResolve] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMbBD2a2+/AciMFl'); // Simple alert tone
  }, []);

  // Generate mock vital signs data for patients
  const generateVitalSigns = (patient: any) => {
    return {
      hr: 70 + Math.random() * 40 + (patient.severity === 'CRITICO' ? 20 : 0),
      systolic: 120 + Math.random() * 40 + (patient.severity === 'CRITICO' ? 20 : 0),
      diastolic: 80 + Math.random() * 20,
      temp: 36.5 + Math.random() * 2 + (patient.severity === 'CRITICO' ? 1 : 0),
      spo2: 95 + Math.random() * 5 - (patient.severity === 'CRITICO' ? 3 : 0),
      rr: 16 + Math.random() * 8
    };
  };

  // Check for alerts based on vital signs
  const checkAlerts = () => {
    if (!isMonitoring) return;

    patients.forEach(patient => {
      const vitals = generateVitalSigns(patient);
      
      alertRules.forEach(rule => {
        if (!rule.enabled) return;

        const paramValue = vitals[rule.parameter as keyof typeof vitals];
        let shouldAlert = false;

        switch (rule.condition) {
          case 'greater':
            shouldAlert = paramValue > rule.value;
            break;
          case 'less':
            shouldAlert = paramValue < rule.value;
            break;
          case 'between':
            shouldAlert = rule.value2 ? (paramValue >= rule.value && paramValue <= rule.value2) : false;
            break;
        }

        if (shouldAlert) {
          // Check if we already have a recent unresolved alert for this patient/parameter
          const existingAlert = alerts.find(alert => 
            alert.patientId === patient.id && 
            alert.parameter === rule.parameter && 
            !alert.resolved &&
            (new Date().getTime() - alert.timestamp.getTime()) < 300000 // 5 minutes
          );

          if (!existingAlert) {
            const newAlert: Alert = {
              id: `alert-${Date.now()}-${Math.random()}`,
              patientId: patient.id,
              patientName: patient.patient.name,
              parameter: rule.parameter,
              value: paramValue,
              severity: rule.severity,
              message: `${rule.description}: ${paramValue.toFixed(1)} ${getParameterUnit(rule.parameter)}`,
              timestamp: new Date(),
              acknowledged: false,
              resolved: false
            };

            setAlerts(prev => [newAlert, ...prev]);
            
            // Play sound for critical and high alerts
            if (soundEnabled && (rule.severity === 'critical' || rule.severity === 'high')) {
              playAlertSound();
            }

            // Show toast notification
            toast({
              title: `Alerta ${rule.severity.toUpperCase()}`,
              description: `${patient.patient.name}: ${newAlert.message}`,
              variant: rule.severity === 'critical' ? 'destructive' : 'default',
            });

            // Notify parent component
            if (onAlertAction) {
              onAlertAction(newAlert.id, 'created');
            }
          }
        }
      });
    });

    // Auto-resolve alerts if parameter returns to normal
    if (autoResolve) {
      setAlerts(prev => prev.map(alert => {
        if (!alert.resolved) {
          const patient = patients.find(p => p.id === alert.patientId);
          if (patient) {
            const vitals = generateVitalSigns(patient);
            const paramValue = vitals[alert.parameter as keyof typeof vitals];
            
            // Check if value is back to normal ranges
            const isNormal = isParameterNormal(alert.parameter, paramValue);
            if (isNormal) {
              return { ...alert, resolved: true, responseTime: new Date().getTime() - alert.timestamp.getTime() };
            }
          }
        }
        return alert;
      }));
    }
  };

  const isParameterNormal = (parameter: string, value: number): boolean => {
    const normalRanges = {
      hr: { min: 60, max: 100 },
      systolic: { min: 90, max: 140 },
      diastolic: { min: 60, max: 90 },
      temp: { min: 36.1, max: 37.5 },
      spo2: { min: 95, max: 100 },
      rr: { min: 12, max: 20 }
    };

    const range = normalRanges[parameter as keyof typeof normalRanges];
    return range ? value >= range.min && value <= range.max : true;
  };

  const getParameterUnit = (parameter: string): string => {
    const units = {
      hr: 'lpm',
      systolic: 'mmHg',
      diastolic: 'mmHg',
      temp: '°C',
      spo2: '%',
      rr: 'rpm'
    };
    return units[parameter as keyof typeof units] || '';
  };

  const getParameterIcon = (parameter: string) => {
    const icons = {
      hr: Heart,
      systolic: Activity,
      diastolic: Activity,
      temp: Thermometer,
      spo2: Droplets,
      rr: Wind
    };
    return icons[parameter as keyof typeof icons] || AlertTriangle;
  };

  const playAlertSound = () => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Handle audio play error silently
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    
    if (onAlertAction) {
      onAlertAction(alertId, 'acknowledged');
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { 
        ...alert, 
        resolved: true, 
        responseTime: new Date().getTime() - alert.timestamp.getTime() 
      } : alert
    ));
    
    if (onAlertAction) {
      onAlertAction(alertId, 'resolved');
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    if (onAlertAction) {
      onAlertAction(alertId, 'dismissed');
    }
  };

  // Start monitoring
  useEffect(() => {
    if (isMonitoring) {
      monitoringIntervalRef.current = setInterval(checkAlerts, 10000); // Check every 10 seconds
    } else {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    }

    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [isMonitoring, alertRules, patients, alerts, autoResolve, soundEnabled]);

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');

  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-red-600" />
              Sistema de Alertas UCI
              {isMonitoring && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isMonitoring ? 'Pausar' : 'Iniciar'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{highAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Altas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{alerts.filter(a => a.resolved).length}</div>
              <div className="text-sm text-muted-foreground">Resueltas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alertas Activas ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.slice(0, 10).map(alert => {
                const IconComponent = getParameterIcon(alert.parameter);
                return (
                  <Alert key={alert.id} className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                    alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-5 h-5 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{alert.patientName}</span>
                          </div>
                          <AlertDescription className="text-sm">
                            {alert.message}
                          </AlertDescription>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.timestamp.toLocaleTimeString('es-CO')}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {alert.patientId}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            <Bell className="w-4 h-4 mr-1" />
                            Confirmar
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolver
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Alert>
                );
              })}
              
              {activeAlerts.length > 10 && (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  Y {activeAlerts.length - 10} alertas más...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Llamar Médico
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Enviar Mensaje
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Notificar Familia
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sonido de alertas</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? 'Activado' : 'Desactivado'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-resolución</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoResolve(!autoResolve)}
                >
                  {autoResolve ? 'Activado' : 'Desactivado'}
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Reglas de Alerta</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {alertRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{rule.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {rule.parameter} {rule.condition} {rule.value}
                          {rule.value2 && ` - ${rule.value2}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(rule.severity)} variant="outline">
                          {rule.severity}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAlertRules(prev => prev.map(r => 
                              r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                            ));
                          }}
                        >
                          {rule.enabled ? 'ON' : 'OFF'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeAlerts.length === 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>Sistema funcionando correctamente.</strong> No hay alertas activas en este momento.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
