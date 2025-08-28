@extends('layouts.dashboard-turbo')

@section('page-content')
<div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold flex items-center">
                    <i data-lucide="eye" class="w-8 h-8 mr-3"></i>
                    Centro de Supervisión
                </h1>
                <p class="text-purple-100 mt-1">Monitoreo en tiempo real del sistema VITAL RED</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold">Operativo</div>
                <div class="text-purple-200">Estado del Sistema</div>
            </div>
        </div>
    </div>

    <!-- System Health Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="cpu" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">CPU</p>
                    <p class="text-2xl font-bold text-green-600">23%</p>
                </div>
            </div>
            <div class="mt-4">
                <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: 23%"></div>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="memory-stick" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Memoria</p>
                    <p class="text-2xl font-bold text-blue-600">45%</p>
                </div>
            </div>
            <div class="mt-4">
                <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: 45%"></div>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="hard-drive" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Disco</p>
                    <p class="text-2xl font-bold text-orange-600">67%</p>
                </div>
            </div>
            <div class="mt-4">
                <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-orange-600 h-2 rounded-full" style="width: 67%"></div>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="wifi" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Red</p>
                    <p class="text-2xl font-bold text-purple-600">Estable</p>
                </div>
            </div>
            <div class="mt-4">
                <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-purple-600 h-2 rounded-full" style="width: 95%"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Services Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Active Services -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="server" class="w-5 h-5 mr-2 text-green-600"></i>
                    Servicios Activos
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span class="font-medium text-slate-800">Servidor Web</span>
                    </div>
                    <span class="text-green-600 text-sm font-medium">Activo</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span class="font-medium text-slate-800">Base de Datos</span>
                    </div>
                    <span class="text-green-600 text-sm font-medium">Activo</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span class="font-medium text-slate-800">Sistema de IA</span>
                    </div>
                    <span class="text-green-600 text-sm font-medium">Activo</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span class="font-medium text-slate-800">Procesador de Gmail</span>
                    </div>
                    <span class="text-green-600 text-sm font-medium">Activo</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span class="font-medium text-slate-800">Sistema de Respaldos</span>
                    </div>
                    <span class="text-yellow-600 text-sm font-medium">Programado</span>
                </div>
            </div>
        </div>

        <!-- Real-time Metrics -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="activity" class="w-5 h-5 mr-2 text-blue-600"></i>
                    Métricas en Tiempo Real
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Usuarios Conectados</span>
                    <span class="font-bold text-slate-800">12</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Casos Procesados (Hoy)</span>
                    <span class="font-bold text-slate-800">156</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Emails Procesados</span>
                    <span class="font-bold text-slate-800">100</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Tiempo de Respuesta</span>
                    <span class="font-bold text-slate-800">0.38s</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Uptime</span>
                    <span class="font-bold text-green-600">99.9%</span>
                </div>
            </div>
        </div>
    </div>

    <!-- System Logs -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-800">Logs del Sistema</h2>
                <div class="flex items-center space-x-2">
                    <select class="px-3 py-1 text-sm border border-slate-300 rounded-lg">
                        <option>Todos los logs</option>
                        <option>Errores</option>
                        <option>Advertencias</option>
                        <option>Info</option>
                    </select>
                    <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <i data-lucide="refresh-cw" class="w-4 h-4 mr-1"></i>
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
        
        <div class="max-h-96 overflow-y-auto">
            <div class="divide-y divide-slate-200">
                <div class="p-4 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-slate-900">Sistema iniciado correctamente</span>
                                <span class="text-xs text-slate-500">Hace 2 horas</span>
                            </div>
                            <p class="text-xs text-slate-600 mt-1">Todos los servicios están funcionando normalmente</p>
                        </div>
                    </div>
                </div>
                <div class="p-4 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-slate-900">Procesamiento de IA completado</span>
                                <span class="text-xs text-slate-500">Hace 5 minutos</span>
                            </div>
                            <p class="text-xs text-slate-600 mt-1">100 emails procesados exitosamente</p>
                        </div>
                    </div>
                </div>
                <div class="p-4 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-slate-900">Respaldo automático completado</span>
                                <span class="text-xs text-slate-500">Hace 6 horas</span>
                            </div>
                            <p class="text-xs text-slate-600 mt-1">Respaldo de 156.7 MB creado exitosamente</p>
                        </div>
                    </div>
                </div>
                <div class="p-4 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-slate-900">Advertencia: Uso de disco alto</span>
                                <span class="text-xs text-slate-500">Hace 1 día</span>
                            </div>
                            <p class="text-xs text-slate-600 mt-1">El disco está al 67% de capacidad</p>
                        </div>
                    </div>
                </div>
                <div class="p-4 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-slate-900">Nuevo usuario registrado</span>
                                <span class="text-xs text-slate-500">Hace 2 días</span>
                            </div>
                            <p class="text-xs text-slate-600 mt-1">Dr. Carlos Rodríguez - Neurología</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Alerts and Notifications -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800 flex items-center">
                <i data-lucide="bell" class="w-5 h-5 mr-2 text-orange-600"></i>
                Alertas y Notificaciones
            </h2>
        </div>
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-center">
                        <i data-lucide="check-circle" class="w-5 h-5 text-green-600 mr-2"></i>
                        <span class="font-medium text-green-800">Sistema Estable</span>
                    </div>
                    <p class="text-sm text-green-600 mt-1">Todos los servicios funcionando correctamente</p>
                </div>
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div class="flex items-center">
                        <i data-lucide="info" class="w-5 h-5 text-blue-600 mr-2"></i>
                        <span class="font-medium text-blue-800">Actualización Disponible</span>
                    </div>
                    <p class="text-sm text-blue-600 mt-1">Nueva versión del sistema disponible</p>
                </div>
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div class="flex items-center">
                        <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-600 mr-2"></i>
                        <span class="font-medium text-yellow-800">Mantenimiento Programado</span>
                    </div>
                    <p class="text-sm text-yellow-600 mt-1">Mantenimiento el domingo a las 2:00 AM</p>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Auto-refresh every 30 seconds
    setInterval(() => {
        // Update metrics
        console.log('Actualizando métricas del sistema...');
    }, 30000);
</script>
@endpush
@endsection
