import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Hospital,
  HeartPulse,
  Shield,
  Lock,
  User,
  Building2,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login
    setTimeout(() => {
      setLoading(false);

      if (userType === "EPS") {
        navigate("/eps-form");
      } else if (userType === "HUV") {
        navigate("/huv-dashboard");
      }
    }, 1500);
  };

  const userTypeInfo = {
    EPS: {
      icon: Building2,
      title: "EPS - Entidad Promotora de Salud",
      description: "Acceso para generar remisiones médicas",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
    },
    HUV: {
      icon: Hospital,
      title: "HUV - Hospital Universitario del Valle",
      description: "Acceso para médicos y personal hospitalario",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
  };

  return (
    <div className="min-h-screen bg-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm10-20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-red-600 p-12 flex-col justify-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
          </div>

          <div className="max-w-md mx-auto relative z-10">
            {/* Logo Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <HeartPulse className="w-7 h-7 text-red-500" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    VITAL
                    <span className="text-red-200 font-light"> RED</span>
                  </h2>
                  <p className="text-white/80 text-sm font-medium">Sistema Médico</p>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight text-center">
              Acceso Seguro al
              <br />
              <span className="text-red-200">Sistema Hospitalario</span>
            </h1>

            <p className="text-lg text-white/90 mb-8 text-center leading-relaxed">
              Conectamos EPS y Hospital Universitario del Valle con tecnología de última generación
            </p>

            {/* Enhanced Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Máxima Seguridad</div>
                  <div className="text-white/80 text-sm">Certificado MinSalud</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Siempre Disponible</div>
                  <div className="text-white/80 text-sm">24/7 sin interrupciones</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6 text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>

            {/* Login Card */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                {/* Vital Red Branding */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 bg-red-500 rounded-2xl p-4 mb-4 shadow-lg">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <HeartPulse className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-black text-white tracking-tight">
                        VITAL
                        <span className="text-red-200 font-light"> RED</span>
                      </h2>
                      <p className="text-white/90 text-xs">Sistema Médico</p>
                    </div>
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                  Acceso al Sistema
                </CardTitle>
                <p className="text-slate-600 text-sm">
                  Ingrese sus credenciales para continuar
                </p>

                {/* Security Badge */}
                <div className="flex justify-center mt-4">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 border-emerald-200 text-emerald-700"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Conexión Segura SSL
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="userType" required>
                      Tipo de Usuario
                    </Label>
                    <Select
                      value={userType}
                      onValueChange={setUserType}
                      required
                    >
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Seleccione su tipo de acceso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EPS">
                          <div className="flex items-center gap-3 py-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium">
                                EPS - Entidad Promotora de Salud
                              </div>
                              <div className="text-xs text-slate-500">
                                Generar remisiones médicas
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="HUV">
                          <div className="flex items-center gap-3 py-2">
                            <Hospital className="w-5 h-5 text-emerald-600" />
                            <div>
                              <div className="font-medium">
                                HUV - Hospital Universitario del Valle
                              </div>
                              <div className="text-xs text-slate-500">
                                Personal médico y administrativo
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* User Type Info */}
                    {userType &&
                      userTypeInfo[userType as keyof typeof userTypeInfo] && (
                        <div
                          className={`p-4 rounded-lg border ${userTypeInfo[userType as keyof typeof userTypeInfo].bgColor}`}
                        >
                          <div className="flex items-center gap-3">
                            {React.createElement(
                              userTypeInfo[
                                userType as keyof typeof userTypeInfo
                              ].icon,
                              {
                                className: `w-5 h-5 ${userTypeInfo[userType as keyof typeof userTypeInfo].color}`,
                              },
                            )}
                            <div>
                              <div className="font-medium text-slate-800">
                                {
                                  userTypeInfo[
                                    userType as keyof typeof userTypeInfo
                                  ].title
                                }
                              </div>
                              <div className="text-sm text-slate-600">
                                {
                                  userTypeInfo[
                                    userType as keyof typeof userTypeInfo
                                  ].description
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Username */}
                  <div className="space-y-3">
                    <Label htmlFor="username" required>
                      Usuario
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Ingrese su nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-12 h-14"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <Label htmlFor="password" required>
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-14"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-slate-600">
                        Recordar mi sesión
                      </span>
                    </label>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      ¿Olvidó su contraseña?
                    </Button>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold"
                    disabled={loading || !userType || !username || !password}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verificando credenciales...
                      </div>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>

                {/* Help Section */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <AlertCircle className="w-4 h-4" />
                      ¿Problemas de acceso?
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">
                        Soporte Técnico: <strong>+57 (2) 555-0123</strong>
                      </p>
                      <p className="text-sm text-slate-600">
                        Email: <strong>soporte@eps-huv.gov.co</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-6 text-center text-xs text-slate-500">
              <p>Esta es una conexión segura. Su información está protegida.</p>
              <p>© 2024 Ministerio de Salud y Protección Social</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
