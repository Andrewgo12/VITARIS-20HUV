import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings,
  Palette,
  Globe,
  Shield,
  Lock,
  History,
  User,
  Monitor,
  Smartphone,
  LogOut,
  Trash2,
  Download,
  FileText,
  Eye,
  EyeOff,
  Bell,
  Mail,
  MessageSquare,
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

const SystemSettings: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Estados para diferentes configuraciones
  const [systemSettings, setSystemSettings] = useState({
    theme: "light",
    fontSize: "medium",
    animations: true,
    spacing: "normal",
    compactMode: false,
    autoSave: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    analytics: true,
    crashReports: true,
    personalizedAds: false,
    locationTracking: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    emergencyAlerts: true,
    systemUpdates: true,
    securityAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    autoLogout: true,
    passwordExpiry: "90",
    loginNotifications: true,
  });

  // Datos de ejemplo para historial
  const systemHistory = [
    {
      action: "Cambio de configuración",
      details: "Tema cambiado a oscuro",
      date: "2024-01-15 10:30",
      user: "Admin",
    },
    {
      action: "Backup del sistema",
      details: "Backup automático completado",
      date: "2024-01-15 02:00",
      user: "Sistema",
    },
    {
      action: "Actualización de seguridad",
      details: "Parches de seguridad aplicados",
      date: "2024-01-14 18:45",
      user: "Sistema",
    },
    {
      action: "Nuevo usuario registrado",
      details: "Dr. Carlos Mendez",
      date: "2024-01-14 14:20",
      user: "Admin",
    },
  ];

  const [activeSessions, setActiveSessions] = useState([
    {
      id: "1",
      device: "Chrome - Windows 11",
      location: "Cali, Colombia",
      ip: "192.168.1.100",
      lastActive: "2024-01-15 09:30",
      current: true,
    },
    {
      id: "2",
      device: "Safari - iPhone 14",
      location: "Cali, Colombia",
      ip: "192.168.1.101",
      lastActive: "2024-01-14 18:45",
      current: false,
    },
    {
      id: "3",
      device: "Firefox - Ubuntu",
      location: "Bogotá, Colombia",
      ip: "192.168.1.102",
      lastActive: "2024-01-13 16:20",
      current: false,
    },
  ]);

  const handleUpdateSetting = (category: string, key: string, value: any) => {
    switch (category) {
      case "system":
        setSystemSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "privacy":
        setPrivacySettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "notifications":
        setNotificationSettings((prev) => ({ ...prev, [key]: value }));
        break;
      case "security":
        setSecuritySettings((prev) => ({ ...prev, [key]: value }));
        break;
    }
  };

  const handleLogoutSession = (sessionId: string) => {
    // Lógica para cerrar sesión específica
    setActiveSessions((prev) =>
      prev.filter((session) => session.id !== sessionId),
    );
    // En producción: hacer llamada a API para invalidar la sesión
    // await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
  };

  const handleExportData = async () => {
    try {
      // Crear y descargar archivo JSON con datos del usuario
      const userData = {
        profile: { name: "Usuario", email: "usuario@ejemplo.com" },
        settings: {
          systemSettings,
          privacySettings,
          notificationSettings,
          securitySettings,
        },
        sessions: activeSessions,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `vital-red-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar datos:", error);
    }
  };

  const handleClearHistory = async () => {
    try {
      // En producción: llamada a API para limpiar historial
      // await fetch('/api/user/history', { method: 'DELETE' });

      // Simular limpieza del historial local
      localStorage.removeItem("vital-red-history");

      // Actualizar estado si hay algún historial en el componente
      console.log("Historial limpiado exitosamente");
    } catch (error) {
      console.error("Error al limpiar historial:", error);
    }
  };

  const handleResetSettings = () => {
    // Resetear todas las configuraciones a valores por defecto
    setSystemSettings({
      theme: "light",
      fontSize: "medium",
      animations: true,
      spacing: "normal",
      compactMode: false,
      autoSave: true,
    });
    setPrivacySettings({
      shareData: false,
      analytics: true,
      crashReports: true,
      personalizedAds: false,
      locationTracking: false,
    });
    setNotificationSettings({
      emailNotifications: true,
      pushNotifications: true,
      soundNotifications: false,
      emergencyAlerts: true,
      systemUpdates: true,
      securityAlerts: true,
    });
    setSecuritySettings({
      twoFactorAuth: false,
      sessionTimeout: "30",
      autoLogout: true,
      passwordExpiry: "90",
      loginNotifications: true,
    });
    alert("Configuraciones restablecidas");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-black hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("nav.back")}
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-black">
              {t("settings.title")}
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Datos
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restablecer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-black">
                      Restablecer Configuraciones
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-black">
                      Esto restablecerá todas las configuraciones a sus valores
                      por defecto. ¿Está seguro?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-black">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetSettings}>
                      Restablecer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              {t("settings.appearance")}
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t("settings.language")}
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("settings.account")}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t("settings.privacy")}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t("settings.security")}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              {t("settings.history")}
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Apariencia */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Palette className="w-5 h-5" />
                  {t("appearance.theme")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-black">Tema del Sistema</Label>
                    <Select
                      value={systemSettings.theme}
                      onValueChange={(value) =>
                        handleUpdateSetting("system", "theme", value)
                      }
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          {t("appearance.light")}
                        </SelectItem>
                        <SelectItem value="dark">
                          {t("appearance.dark")}
                        </SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-black">
                      {t("appearance.fontSize")}
                    </Label>
                    <Select
                      value={systemSettings.fontSize}
                      onValueChange={(value) =>
                        handleUpdateSetting("system", "fontSize", value)
                      }
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeño</SelectItem>
                        <SelectItem value="medium">Mediano</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                        <SelectItem value="extra-large">
                          Extra Grande
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-black">
                      {t("appearance.spacing")}
                    </Label>
                    <Select
                      value={systemSettings.spacing}
                      onValueChange={(value) =>
                        handleUpdateSetting("system", "spacing", value)
                      }
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compacto</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="comfortable">Cómodo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">
                        {t("appearance.animations")}
                      </Label>
                      <p className="text-sm text-black">
                        Habilitar efectos de transición
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.animations}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting("system", "animations", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Modo Compacto</Label>
                      <p className="text-sm text-black">
                        Reducir espacios entre elementos
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.compactMode}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting("system", "compactMode", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Guardado Automático</Label>
                      <p className="text-sm text-black">
                        Guardar cambios automáticamente
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.autoSave}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting("system", "autoSave", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Idioma */}
          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Globe className="w-5 h-5" />
                  {t("language.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-black">
                    {t("language.current")}:
                    <Badge
                      variant="outline"
                      className="ml-2 text-black border-gray-300"
                    >
                      {language === "es"
                        ? t("language.spanish")
                        : t("language.english")}
                    </Badge>
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setLanguage("es")}
                    variant={language === "es" ? "default" : "outline"}
                    className={`flex items-center gap-3 h-16 ${language === "es" ? "" : "text-black"}`}
                  >
                    <span className="text-2xl">🇪🇸</span>
                    <div className="text-left">
                      <div className="font-semibold">Español</div>
                      <div className="text-sm opacity-70">Spanish</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setLanguage("en")}
                    variant={language === "en" ? "default" : "outline"}
                    className={`flex items-center gap-3 h-16 ${language === "en" ? "" : "text-black"}`}
                  >
                    <span className="text-2xl">🇺🇸</span>
                    <div className="text-left">
                      <div className="font-semibold">English</div>
                      <div className="text-sm opacity-70">Inglés</div>
                    </div>
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-black">
                      Cambio Instantáneo
                    </span>
                  </div>
                  <p className="text-sm text-black">
                    El cambio de idioma se aplica inmediatamente a toda la
                    interfaz sin necesidad de recargar la página.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Gestión de Cuenta */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <User className="w-5 h-5" />
                  Sesiones Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border ${session.current ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {session.device.includes("iPhone") ? (
                            <Smartphone className="w-5 h-5 text-black" />
                          ) : (
                            <Monitor className="w-5 h-5 text-black" />
                          )}
                          <div>
                            <p className="font-medium text-black">
                              {session.device}
                            </p>
                            <p className="text-sm text-black">
                              {session.location}
                            </p>
                            <p className="text-xs text-black">
                              IP: {session.ip}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {session.current ? (
                            <Badge
                              variant="outline"
                              className="text-emerald-600 border-emerald-600 mb-2"
                            >
                              Sesión Actual
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLogoutSession(session.id)}
                              className="text-red-600 border-red-300 mb-2"
                            >
                              <LogOut className="w-4 h-4 mr-1" />
                              Cerrar
                            </Button>
                          )}
                          <p className="text-xs text-black">
                            {session.lastActive}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Bell className="w-5 h-5" />
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">
                        Notificaciones por Email
                      </Label>
                      <p className="text-sm text-black">
                        Recibir alertas por correo
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting(
                          "notifications",
                          "emailNotifications",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Notificaciones Push</Label>
                      <p className="text-sm text-black">
                        Alertas en el navegador
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting(
                          "notifications",
                          "pushNotifications",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Sonidos</Label>
                      <p className="text-sm text-black">
                        Reproducir sonidos de alerta
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.soundNotifications}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting(
                          "notifications",
                          "soundNotifications",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">
                        Alertas de Emergencia
                      </Label>
                      <p className="text-sm text-black">
                        Notificaciones críticas
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emergencyAlerts}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting(
                          "notifications",
                          "emergencyAlerts",
                          checked,
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Privacidad */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Shield className="w-5 h-5" />
                  Configuración de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">
                        Compartir Datos de Uso
                      </Label>
                      <p className="text-sm text-black">
                        Ayudar a mejorar el sistema compartiendo datos anónimos
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.shareData}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting("privacy", "shareData", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">
                        Análisis y Estadísticas
                      </Label>
                      <p className="text-sm text-black">
                        Permitir recopilación de estadísticas de uso
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.analytics}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting("privacy", "analytics", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Reportes de Errores</Label>
                      <p className="text-sm text-black">
                        Enviar reportes automáticos de errores
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.crashReports}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting("privacy", "crashReports", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">
                        Seguimiento de Ubicación
                      </Label>
                      <p className="text-sm text-black">
                        Permitir acceso a datos de ubicación
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.locationTracking}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting(
                          "privacy",
                          "locationTracking",
                          checked,
                        )
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-black">Importante</span>
                  </div>
                  <p className="text-sm text-black">
                    Estos ajustes de privacidad solo afectan datos no
                    esenciales. Los datos médicos y de pacientes siempre están
                    protegidos según las normativas de salud.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Seguridad */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Lock className="w-5 h-5" />
                  Configuración de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">
                        {t("security.twoFactor")}
                      </Label>
                      <p className="text-sm text-black">
                        Activar autenticación de dos pasos
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting(
                          "security",
                          "twoFactorAuth",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Cierre Automático</Label>
                      <p className="text-sm text-black">
                        Cerrar sesión tras inactividad
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.autoLogout}
                      onCheckedChange={(checked) =>
                        handleUpdateSetting("security", "autoLogout", checked)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-black">
                      Tiempo de Sesión (minutos)
                    </Label>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) =>
                        handleUpdateSetting("security", "sessionTimeout", value)
                      }
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="480">8 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-black">
                      Expiración de Contraseña (días)
                    </Label>
                    <Select
                      value={securitySettings.passwordExpiry}
                      onValueChange={(value) =>
                        handleUpdateSetting("security", "passwordExpiry", value)
                      }
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="60">60 días</SelectItem>
                        <SelectItem value="90">90 días</SelectItem>
                        <SelectItem value="180">180 días</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">
                      Notificaciones de Inicio de Sesión
                    </Label>
                    <p className="text-sm text-black">
                      Alertas cuando alguien accede a tu cuenta
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) =>
                      handleUpdateSetting(
                        "security",
                        "loginNotifications",
                        checked,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Historial */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-black">
                    <History className="w-5 h-5" />
                    Historial del Sistema
                  </CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpiar Historial
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-black">
                          Limpiar Historial
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-black">
                          ¿Está seguro que desea eliminar todo el historial?
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-black">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearHistory}>
                          Limpiar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-black" />
                        <div>
                          <p className="font-medium text-black">
                            {entry.action}
                          </p>
                          <p className="text-sm text-black">{entry.details}</p>
                          <p className="text-xs text-black">
                            Por: {entry.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-black">{entry.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
