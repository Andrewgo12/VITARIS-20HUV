/**
 * Extraction Config Modal - Gmail Extractor
 * Modal para configuración avanzada de extracción
 */

import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Brain, 
  Database, 
  Shield,
  Zap,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';
import { useNotifications } from '@/components/ui/notification-system';

interface ExtractionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: any) => void;
}

interface ExtractorConfig {
  // Configuración general
  max_emails: number;
  batch_size: number;
  retry_attempts: number;
  retry_delay: number;
  
  // Configuración de Selenium
  headless: boolean;
  window_width: number;
  window_height: number;
  timeout: number;
  implicit_wait: number;
  
  // Configuración de procesamiento
  download_attachments: boolean;
  process_pdfs: boolean;
  enable_ocr: boolean;
  enable_ai_analysis: boolean;
  
  // Configuración de Gemini AI
  gemini_api_key: string;
  gemini_model: string;
  gemini_max_tokens: number;
  
  // Configuración de base de datos
  db_host: string;
  db_port: number;
  db_user: string;
  db_password: string;
  db_name: string;
  
  // Configuración de seguridad
  user_agent: string;
  delay_between_requests: number;
  max_concurrent_extractions: number;
}

const DEFAULT_CONFIG: ExtractorConfig = {
  max_emails: 300,
  batch_size: 10,
  retry_attempts: 3,
  retry_delay: 5,
  headless: true,
  window_width: 1920,
  window_height: 1080,
  timeout: 30,
  implicit_wait: 10,
  download_attachments: true,
  process_pdfs: true,
  enable_ocr: false,
  enable_ai_analysis: true,
  gemini_api_key: '',
  gemini_model: 'gemini-pro',
  gemini_max_tokens: 2048,
  db_host: 'localhost',
  db_port: 3306,
  db_user: 'root',
  db_password: '',
  db_name: 'vital_red',
  user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  delay_between_requests: 2,
  max_concurrent_extractions: 2
};

const ExtractionConfigModal: React.FC<ExtractionConfigModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { addNotification } = useNotifications();
  const [config, setConfig] = useState<ExtractorConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCurrentConfig();
    }
  }, [isOpen]);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch('/api/gmail-extractor/config');
      
      if (response.ok) {
        const currentConfig = await response.json();
        setConfig({ ...DEFAULT_CONFIG, ...currentConfig });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleConfigChange = (key: keyof ExtractorConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gmail-extractor/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Configuración guardada',
          message: 'La configuración se ha actualizado exitosamente',
          priority: 'medium'
        });
        
        setHasChanges(false);
        if (onSave) onSave(config);
        onClose();
      } else {
        throw new Error('Error guardando configuración');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      addNotification({
        type: 'warning',
        title: 'Error',
        message: 'No se pudo guardar la configuración',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setHasChanges(true);
  };

  const testGeminiConnection = async () => {
    if (!config.gemini_api_key) {
      addNotification({
        type: 'warning',
        title: 'Clave API requerida',
        message: 'Por favor ingrese la clave API de Gemini',
        priority: 'medium'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/gmail-extractor/test-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: config.gemini_api_key })
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Conexión exitosa',
          message: 'La conexión con Gemini AI es correcta',
          priority: 'medium'
        });
      } else {
        throw new Error('Error en conexión con Gemini');
      }
    } catch (error) {
      addNotification({
        type: 'warning',
        title: 'Error de conexión',
        message: 'No se pudo conectar con Gemini AI',
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración Avanzada del Extractor
          </DialogTitle>
          <DialogDescription>
            Configurar parámetros avanzados para la extracción de Gmail
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="selenium">Selenium</TabsTrigger>
            <TabsTrigger value="processing">Procesamiento</TabsTrigger>
            <TabsTrigger value="ai">Gemini AI</TabsTrigger>
            <TabsTrigger value="database">Base de Datos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxEmails">Máximo de correos por sesión</Label>
                <Input
                  id="maxEmails"
                  type="number"
                  value={config.max_emails}
                  onChange={(e) => handleConfigChange('max_emails', parseInt(e.target.value))}
                  min="1"
                  max="1000"
                />
              </div>
              
              <div>
                <Label htmlFor="batchSize">Tamaño de lote</Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={config.batch_size}
                  onChange={(e) => handleConfigChange('batch_size', parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
              
              <div>
                <Label htmlFor="retryAttempts">Intentos de reintento</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  value={config.retry_attempts}
                  onChange={(e) => handleConfigChange('retry_attempts', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              
              <div>
                <Label htmlFor="retryDelay">Delay entre reintentos (segundos)</Label>
                <Input
                  id="retryDelay"
                  type="number"
                  value={config.retry_delay}
                  onChange={(e) => handleConfigChange('retry_delay', parseInt(e.target.value))}
                  min="1"
                  max="60"
                />
              </div>
            </div>

            <div>
              <Label>Delay entre solicitudes: {config.delay_between_requests}s</Label>
              <Slider
                value={[config.delay_between_requests]}
                onValueChange={(value) => handleConfigChange('delay_between_requests', value[0])}
                max={10}
                min={0.5}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Extracciones concurrentes máximas: {config.max_concurrent_extractions}</Label>
              <Slider
                value={[config.max_concurrent_extractions]}
                onValueChange={(value) => handleConfigChange('max_concurrent_extractions', value[0])}
                max={5}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="selenium" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="headless"
                checked={config.headless}
                onCheckedChange={(checked) => handleConfigChange('headless', checked)}
              />
              <Label htmlFor="headless">Modo headless (sin interfaz)</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="windowWidth">Ancho de ventana</Label>
                <Input
                  id="windowWidth"
                  type="number"
                  value={config.window_width}
                  onChange={(e) => handleConfigChange('window_width', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="windowHeight">Alto de ventana</Label>
                <Input
                  id="windowHeight"
                  type="number"
                  value={config.window_height}
                  onChange={(e) => handleConfigChange('window_height', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="timeout">Timeout general (segundos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={config.timeout}
                  onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="implicitWait">Espera implícita (segundos)</Label>
                <Input
                  id="implicitWait"
                  type="number"
                  value={config.implicit_wait}
                  onChange={(e) => handleConfigChange('implicit_wait', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="userAgent">User Agent</Label>
              <Input
                id="userAgent"
                value={config.user_agent}
                onChange={(e) => handleConfigChange('user_agent', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="downloadAttachments"
                  checked={config.download_attachments}
                  onCheckedChange={(checked) => handleConfigChange('download_attachments', checked)}
                />
                <Label htmlFor="downloadAttachments">Descargar archivos adjuntos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="processPdfs"
                  checked={config.process_pdfs}
                  onCheckedChange={(checked) => handleConfigChange('process_pdfs', checked)}
                />
                <Label htmlFor="processPdfs">Procesar archivos PDF</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableOcr"
                  checked={config.enable_ocr}
                  onCheckedChange={(checked) => handleConfigChange('enable_ocr', checked)}
                />
                <Label htmlFor="enableOcr">Habilitar OCR para imágenes</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableAiAnalysis"
                  checked={config.enable_ai_analysis}
                  onCheckedChange={(checked) => handleConfigChange('enable_ai_analysis', checked)}
                />
                <Label htmlFor="enableAiAnalysis">Habilitar análisis con IA</Label>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                El OCR requiere Tesseract instalado en el sistema. El análisis con IA requiere configurar la clave API de Gemini.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div>
              <Label htmlFor="geminiApiKey">Clave API de Gemini</Label>
              <div className="flex gap-2">
                <Input
                  id="geminiApiKey"
                  type="password"
                  value={config.gemini_api_key}
                  onChange={(e) => handleConfigChange('gemini_api_key', e.target.value)}
                  placeholder="Ingrese su clave API de Gemini"
                />
                <Button
                  variant="outline"
                  onClick={testGeminiConnection}
                  disabled={loading || !config.gemini_api_key}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Probar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="geminiModel">Modelo de Gemini</Label>
                <Input
                  id="geminiModel"
                  value={config.gemini_model}
                  onChange={(e) => handleConfigChange('gemini_model', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="geminiMaxTokens">Máximo de tokens</Label>
                <Input
                  id="geminiMaxTokens"
                  type="number"
                  value={config.gemini_max_tokens}
                  onChange={(e) => handleConfigChange('gemini_max_tokens', parseInt(e.target.value))}
                />
              </div>
            </div>

            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                Obtenga su clave API gratuita en Google AI Studio: https://makersuite.google.com/app/apikey
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dbHost">Host</Label>
                <Input
                  id="dbHost"
                  value={config.db_host}
                  onChange={(e) => handleConfigChange('db_host', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="dbPort">Puerto</Label>
                <Input
                  id="dbPort"
                  type="number"
                  value={config.db_port}
                  onChange={(e) => handleConfigChange('db_port', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="dbUser">Usuario</Label>
                <Input
                  id="dbUser"
                  value={config.db_user}
                  onChange={(e) => handleConfigChange('db_user', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="dbPassword">Contraseña</Label>
                <Input
                  id="dbPassword"
                  type="password"
                  value={config.db_password}
                  onChange={(e) => handleConfigChange('db_password', e.target.value)}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="dbName">Nombre de la base de datos</Label>
                <Input
                  id="dbName"
                  value={config.db_name}
                  onChange={(e) => handleConfigChange('db_name', e.target.value)}
                />
              </div>
            </div>

            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                Asegúrese de que la base de datos esté accesible y que el usuario tenga permisos para crear tablas.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restablecer
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || !hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtractionConfigModal;
