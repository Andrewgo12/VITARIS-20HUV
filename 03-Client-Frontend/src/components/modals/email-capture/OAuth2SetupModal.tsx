/**
 * OAuth2 Setup Modal - VITAL RED
 * Modal para configurar OAuth2 de Gmail
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Key, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useNotifications } from '@/components/ui/notification-system';

interface OAuth2SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

const OAuth2SetupModal: React.FC<OAuth2SetupModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSecret, setShowSecret] = useState(false);
  const [config, setConfig] = useState<OAuth2Config>({
    clientId: '',
    clientSecret: '',
    redirectUri: 'http://localhost:8001/api/gmail/oauth/callback',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ]
  });

  const handleSaveConfig = async () => {
    if (!config.clientId.trim() || !config.clientSecret.trim()) {
      addNotification({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor complete Client ID y Client Secret.',
        priority: 'medium'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.updateOAuth2Config(config);
      
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Configuración guardada',
          message: 'La configuración OAuth2 se ha guardado exitosamente.',
          priority: 'medium'
        });
        setStep(3);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.error || 'Failed to save OAuth2 config');
      }
    } catch (error) {
      console.error('Error saving OAuth2 config:', error);
      addNotification({
        type: 'warning',
        title: 'Error guardando configuración',
        message: 'No se pudo guardar la configuración OAuth2.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const response = await apiService.testOAuth2Connection();
      
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Conexión exitosa',
          message: 'La conexión OAuth2 se ha establecido correctamente.',
          priority: 'medium'
        });
        onClose();
      } else {
        throw new Error(response.error || 'Failed to test OAuth2 connection');
      }
    } catch (error) {
      console.error('Error testing OAuth2 connection:', error);
      addNotification({
        type: 'warning',
        title: 'Error de conexión',
        message: 'No se pudo establecer la conexión OAuth2.',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification({
      type: 'success',
      title: 'Copiado',
      message: 'Texto copiado al portapapeles.',
      priority: 'low'
    });
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Paso 1: Crear proyecto en Google Cloud Console</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Ir a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
          <li>2. Crear un nuevo proyecto o seleccionar uno existente</li>
          <li>3. Habilitar la API de Gmail</li>
          <li>4. Ir a "Credenciales" y crear credenciales OAuth 2.0</li>
        </ol>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">URI de redirección autorizada</h4>
        <div className="flex items-center gap-2">
          <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
            {config.redirectUri}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(config.redirectUri)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-yellow-700 mt-2">
          Copie esta URI y agréguela en la configuración OAuth2 de Google Cloud Console
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="clientId">Client ID</Label>
        <Input
          id="clientId"
          value={config.clientId}
          onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
          placeholder="123456789-abcdefghijklmnop.apps.googleusercontent.com"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="clientSecret">Client Secret</Label>
        <div className="relative">
          <Input
            id="clientSecret"
            type={showSecret ? "text" : "password"}
            value={config.clientSecret}
            onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
            placeholder="GOCSPX-abcdefghijklmnopqrstuvwxyz"
            disabled={loading}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowSecret(!showSecret)}
          >
            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="redirectUri">URI de Redirección</Label>
        <Input
          id="redirectUri"
          value={config.redirectUri}
          onChange={(e) => setConfig({ ...config, redirectUri: e.target.value })}
          disabled={loading}
        />
      </div>

      <div>
        <Label>Permisos Solicitados</Label>
        <div className="space-y-2 mt-2">
          {config.scopes.map((scope, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {scope.split('/').pop()}
              </Badge>
              <span className="text-sm text-gray-600">{scope}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-green-800">Configuración Completada</h3>
        <p className="text-green-600 mt-2">
          La configuración OAuth2 se ha guardado exitosamente.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">Próximos pasos:</h4>
        <ul className="text-sm text-green-700 space-y-1 text-left">
          <li>• Probar la conexión OAuth2</li>
          <li>• Autorizar el acceso a Gmail</li>
          <li>• Configurar filtros de captura</li>
          <li>• Iniciar monitoreo automático</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Configuración OAuth2 de Gmail
          </DialogTitle>
          <DialogDescription>
            Configurar autenticación OAuth2 para acceso a Gmail
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              Paso {step} de 3
            </span>
          </div>

          {/* Step content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {step === 3 ? 'Cerrar' : 'Cancelar'}
          </Button>
          
          {step === 1 && (
            <Button onClick={() => setStep(2)}>
              Siguiente
            </Button>
          )}
          
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Anterior
              </Button>
              <Button onClick={handleSaveConfig} disabled={loading}>
                <Shield className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </>
          )}
          
          {step === 3 && (
            <Button onClick={handleTestConnection} disabled={loading}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Probar Conexión
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OAuth2SetupModal;
