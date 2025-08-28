@extends('layouts.dashboard-turbo')

@section('page-content')
<div class="space-y-6">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Configuración del Sistema</h1>
                <p class="text-slate-600">Parámetros y configuraciones generales del sistema VITAL RED</p>
            </div>
            <div class="flex items-center space-x-4">
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <i data-lucide="save" class="w-4 h-4 mr-2"></i>
                    Guardar Cambios
                </button>
                <button class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                    Restablecer
                </button>
            </div>
        </div>
    </div>

    <!-- Configuration Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- General Settings -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="settings" class="w-5 h-5 mr-2 text-blue-600"></i>
                    Configuración General
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Nombre del Hospital</label>
                    <input type="text" 
                           value="Hospital Universitaria ESE"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
                    <textarea rows="3" 
                              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">Calle Principal #123, Ciudad, País</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Teléfono Principal</label>
                    <input type="tel" 
                           value="+57 (1) 234-5678"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Email de Contacto</label>
                    <input type="email" 
                           value="contacto@hospital.com"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
        </div>

        <!-- System Settings -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="cpu" class="w-5 h-5 mr-2 text-purple-600"></i>
                    Configuración del Sistema
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Zona Horaria</label>
                    <select class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="America/Bogota" selected>América/Bogotá (UTC-5)</option>
                        <option value="America/New_York">América/Nueva_York (UTC-5)</option>
                        <option value="Europe/Madrid">Europa/Madrid (UTC+1)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Idioma del Sistema</label>
                    <select class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="es" selected>Español</option>
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Tiempo de Sesión (minutos)</label>
                    <input type="number" 
                           value="120"
                           min="30"
                           max="480"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-700">Modo de Mantenimiento</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>

        <!-- Email Configuration -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="mail" class="w-5 h-5 mr-2 text-green-600"></i>
                    Configuración de Email
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Servidor SMTP</label>
                    <input type="text" 
                           value="smtp.gmail.com"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Puerto SMTP</label>
                    <input type="number" 
                           value="587"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Usuario SMTP</label>
                    <input type="email" 
                           value="sistema@hospital.com"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Contraseña SMTP</label>
                    <input type="password" 
                           value="••••••••••••"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-700">Usar TLS/SSL</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>

        <!-- AI Configuration -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="brain" class="w-5 h-5 mr-2 text-indigo-600"></i>
                    Configuración de IA
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">URL del Servicio de IA</label>
                    <input type="url" 
                           value="http://localhost:3000"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Intervalo de Procesamiento (minutos)</label>
                    <input type="number" 
                           value="5"
                           min="1"
                           max="60"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Nivel de Confianza Mínimo (%)</label>
                    <input type="number" 
                           value="85"
                           min="50"
                           max="100"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-700">Procesamiento Automático</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-700">Notificaciones de IA</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <!-- Security Settings -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                <i data-lucide="shield" class="w-5 h-5 mr-2 text-red-600"></i>
                Configuración de Seguridad
            </h3>
        </div>
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Intentos de Login Máximos</label>
                    <input type="number" 
                           value="5"
                           min="3"
                           max="10"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Tiempo de Bloqueo (minutos)</label>
                    <input type="number" 
                           value="15"
                           min="5"
                           max="60"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Longitud Mínima de Contraseña</label>
                    <input type="number" 
                           value="8"
                           min="6"
                           max="20"
                           class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-700">Autenticación de Dos Factores</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-700">Logs de Auditoría</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
