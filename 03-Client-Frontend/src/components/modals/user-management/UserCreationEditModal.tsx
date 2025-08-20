import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Save,
  X,
  Mail,
  Shield,
  Stethoscope,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'medical_evaluator' | 'vital_red_admin';
  specialty?: string;
  licenseNumber?: string;
  isActive: boolean;
}

interface UserCreationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isEditMode: boolean;
  onSave: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'medical_evaluator' | 'vital_red_admin';
    specialty?: string;
    licenseNumber?: string;
    phone?: string;
    notes?: string;
  }) => void;
}

export default function UserCreationEditModal({
  isOpen,
  onClose,
  user,
  isEditMode,
  onSave,
}: UserCreationEditModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "medical_evaluator" as 'medical_evaluator' | 'vital_red_admin',
    specialty: "",
    licenseNumber: "",
    phone: "",
    notes: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isEditMode) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        confirmPassword: "",
        role: user.role,
        specialty: user.specialty || "",
        licenseNumber: user.licenseNumber || "",
        phone: "",
        notes: "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "medical_evaluator",
        specialty: "",
        licenseNumber: "",
        phone: "",
        notes: "",
      });
    }
    setErrors({});
  }, [user, isEditMode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    if (formData.role === 'medical_evaluator') {
      if (!formData.specialty.trim()) {
        newErrors.specialty = "La especialidad es requerida para médicos evaluadores";
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "El número de licencia es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        specialty: formData.role === 'medical_evaluator' ? formData.specialty.trim() : undefined,
        licenseNumber: formData.role === 'medical_evaluator' ? formData.licenseNumber.trim() : undefined,
        phone: formData.phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        ...((!isEditMode || formData.password) && { password: formData.password }),
      };

      onSave(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const specialties = [
    "Cardiología",
    "Neurología",
    "Medicina Interna",
    "Ortopedia",
    "Ginecología",
    "Pediatría",
    "Cirugía General",
    "Oncología",
    "Psiquiatría",
    "Dermatología",
    "Anestesiología",
    "Radiología",
    "Patología",
    "Medicina de Emergencias"
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'medical_evaluator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vital_red_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'medical_evaluator': return 'Puede evaluar casos médicos, tomar decisiones de traslado y gestionar solicitudes';
      case 'vital_red_admin': return 'Acceso completo al sistema, gestión de usuarios y configuración';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <DialogTitle className="text-xl font-bold text-gray-900">
                {isEditMode ? `Editar Usuario - ${user?.firstName} ${user?.lastName}` : 'Crear Nuevo Usuario'}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Nombre del usuario"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Apellido del usuario"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="usuario@vitalred.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditMode ? 'Cambiar Contraseña (opcional)' : 'Credenciales de Acceso'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">
                    {isEditMode ? 'Nueva contraseña' : 'Contraseña *'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      placeholder={isEditMode ? "Dejar vacío para mantener actual" : "Mínimo 8 caracteres"}
                      className={errors.password ? 'border-red-500' : ''}
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
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">
                    {isEditMode ? 'Confirmar nueva contraseña' : 'Confirmar contraseña *'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      placeholder="Confirmar contraseña"
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

          {/* Role and Permissions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rol y Permisos</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Seleccionar rol *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {['medical_evaluator', 'vital_red_admin'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => updateFormData('role', role)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.role === role
                            ? getRoleColor(role) + ' border-current'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {role === 'medical_evaluator' ? (
                            <Stethoscope className="w-5 h-5" />
                          ) : (
                            <Shield className="w-5 h-5" />
                          )}
                          <div className="text-left">
                            <h4 className="font-medium">
                              {role === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getRoleDescription(role)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medical Evaluator specific fields */}
                {formData.role === 'medical_evaluator' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialty">Especialidad *</Label>
                      <select
                        id="specialty"
                        value={formData.specialty}
                        onChange={(e) => updateFormData('specialty', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.specialty ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Seleccionar especialidad</option>
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
                      {errors.specialty && (
                        <p className="text-sm text-red-600 mt-1">{errors.specialty}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">Número de Licencia *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                        placeholder="VR-MD-XXX"
                        className={errors.licenseNumber ? 'border-red-500' : ''}
                      />
                      {errors.licenseNumber && (
                        <p className="text-sm text-red-600 mt-1">{errors.licenseNumber}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas Adicionales</h3>
              <div>
                <Label htmlFor="notes">Observaciones</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Información adicional sobre el usuario..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Resumen del usuario</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Nombre completo: {formData.firstName} {formData.lastName}</p>
                <p>• Email: {formData.email}</p>
                <p>• Rol: {formData.role === 'medical_evaluator' ? 'Médico Evaluador' : 'Administrador'}</p>
                {formData.role === 'medical_evaluator' && formData.specialty && (
                  <p>• Especialidad: {formData.specialty}</p>
                )}
                {formData.role === 'medical_evaluator' && formData.licenseNumber && (
                  <p>• Licencia: {formData.licenseNumber}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditMode ? 'Actualizando...' : 'Creando...'}
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
