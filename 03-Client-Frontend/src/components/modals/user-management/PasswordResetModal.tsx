import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Key,
  Send,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Mail,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onReset: (resetData: {
    method: 'manual' | 'email' | 'temporary';
    newPassword?: string;
    sendEmail: boolean;
    forceChange: boolean;
  }) => void;
}

export default function PasswordResetModal({
  isOpen,
  onClose,
  user,
  onReset,
}: PasswordResetModalProps) {
  const [resetMethod, setResetMethod] = useState<'manual' | 'email' | 'temporary'>('email');
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [forceChange, setForceChange] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
    setConfirmPassword(password);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (resetMethod === 'manual' || resetMethod === 'temporary') {
      if (!newPassword) {
        newErrors.newPassword = "La nueva contraseña es requerida";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
      }

      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      onReset({
        method: resetMethod,
        newPassword: (resetMethod === 'manual' || resetMethod === 'temporary') ? newPassword : undefined,
        sendEmail,
        forceChange,
      });

      // Reset form
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      console.error('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'email': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manual': return 'bg-green-100 text-green-800 border-green-200';
      case 'temporary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'manual': return <Key className="w-5 h-5" />;
      case 'temporary': return <RefreshCw className="w-5 h-5" />;
      default: return <Key className="w-5 h-5" />;
    }
  };

  const getMethodTitle = (method: string) => {
    switch (method) {
      case 'email': return 'Envío por Email';
      case 'manual': return 'Contraseña Manual';
      case 'temporary': return 'Contraseña Temporal';
      default: return '';
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case 'email': return 'Enviar enlace de restablecimiento al email del usuario';
      case 'manual': return 'Establecer una nueva contraseña específica';
      case 'temporary': return 'Generar contraseña temporal que debe cambiarse en el primer acceso';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-blue-600" />
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Restablecer Contraseña
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {user.firstName} {user.lastName} - {user.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-blue-700">
                    <span>{user.email}</span>
                    <span>• {user.role === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Method Selection */}
          <div>
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              Método de restablecimiento
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['email', 'manual', 'temporary'].map((method) => (
                <button
                  key={method}
                  onClick={() => setResetMethod(method as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    resetMethod === method
                      ? getMethodColor(method) + ' border-current'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    {getMethodIcon(method)}
                    <span className="font-medium">{getMethodTitle(method)}</span>
                    <span className="text-xs text-gray-600">
                      {getMethodDescription(method)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Password Input (for manual and temporary methods) */}
          {(resetMethod === 'manual' || resetMethod === 'temporary') && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {resetMethod === 'manual' ? 'Nueva Contraseña' : 'Contraseña Temporal'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">Nueva contraseña *</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          className={errors.newPassword ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateRandomPassword}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generar
                      </Button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar nueva contraseña"
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Options */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones adicionales</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <Label htmlFor="sendEmail" className="font-medium text-gray-900 cursor-pointer">
                      Enviar notificación por email
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Notificar al usuario sobre el cambio de contraseña por email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="forceChange"
                    checked={forceChange}
                    onChange={(e) => setForceChange(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <Label htmlFor="forceChange" className="font-medium text-gray-900 cursor-pointer">
                      Forzar cambio en el próximo acceso
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      El usuario deberá cambiar la contraseña en su próximo inicio de sesión
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Warning */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-semibold text-yellow-900 mb-1">Consideraciones de seguridad</h4>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• Esta acción invalidará todas las sesiones activas del usuario</li>
                    <li>• El usuario deberá iniciar sesión nuevamente con la nueva contraseña</li>
                    <li>• Se registrará esta acción en los logs de auditoría del sistema</li>
                    {resetMethod === 'email' && (
                      <li>• El enlace de restablecimiento expirará en 24 horas</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Summary */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Resumen de la acción</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>• Método: {getMethodTitle(resetMethod)}</p>
                <p>• Usuario: {user.firstName} {user.lastName} ({user.email})</p>
                <p>• Notificación por email: {sendEmail ? 'Sí' : 'No'}</p>
                <p>• Forzar cambio: {forceChange ? 'Sí' : 'No'}</p>
                {(resetMethod === 'manual' || resetMethod === 'temporary') && newPassword && (
                  <p>• Nueva contraseña: {"*".repeat(newPassword.length)} ({newPassword.length} caracteres)</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleReset} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Restablecer contraseña
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
