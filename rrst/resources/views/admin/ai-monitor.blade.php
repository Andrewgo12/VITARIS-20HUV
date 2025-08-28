@extends('layouts.dashboard-turbo')

@section('page-content')
<div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold flex items-center">
                    <i data-lucide="brain" class="w-8 h-8 mr-3"></i>
                    Monitor de Inteligencia Artificial
                </h1>
                <p class="text-indigo-100 mt-1">Supervisión del sistema de procesamiento de Gmail con IA</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold">Activo</div>
                <div class="text-indigo-200">Estado de IA</div>
            </div>
        </div>
    </div>

    <!-- AI Performance Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="zap" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Procesados Hoy</p>
                    <p class="text-2xl font-bold text-green-600">156</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="target" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Precisión</p>
                    <p class="text-2xl font-bold text-blue-600">94.5%</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="clock" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Tiempo Promedio</p>
                    <p class="text-2xl font-bold text-purple-600">0.38s</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="inbox" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">En Cola</p>
                    <p class="text-2xl font-bold text-orange-600">12</p>
                </div>
            </div>
        </div>
    </div>

    <!-- AI Processing Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Current Processing -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="activity" class="w-5 h-5 mr-2 text-blue-600"></i>
                    Procesamiento Actual
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Estado del Procesador</span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Activo</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Emails en Procesamiento</span>
                    <span class="font-bold text-slate-800">3</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Archivos Adjuntos Extraídos</span>
                    <span class="font-bold text-slate-800">8</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Última Ejecución</span>
                    <span class="font-bold text-slate-800">Hace 2 min</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Próxima Ejecución</span>
                    <span class="font-bold text-slate-800">En 3 min</span>
                </div>
            </div>
        </div>

        <!-- Model Information -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="cpu" class="w-5 h-5 mr-2 text-purple-600"></i>
                    Información del Modelo
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Versión del Modelo</span>
                    <span class="font-bold text-slate-800">v2.1.0</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Último Entrenamiento</span>
                    <span class="font-bold text-slate-800">Hace 3 días</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Datos de Entrenamiento</span>
                    <span class="font-bold text-slate-800">10,000 casos</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Capacidad Estimada</span>
                    <span class="font-bold text-slate-800">76,659 emails/día</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span class="text-sm font-medium text-slate-700">Tasa de Éxito</span>
                    <span class="font-bold text-green-600">100%</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Processing History -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-800">Historial de Procesamiento</h2>
                <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <i data-lucide="refresh-cw" class="w-4 h-4 mr-1"></i>
                    Actualizar
                </button>
            </div>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha/Hora</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Emails</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Éxito</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tiempo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Archivos</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                    <tr class="hover:bg-slate-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            2025-08-28 14:30:15
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            100
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            100%
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            37.57s
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            8 adjuntos
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                Completado
                            </span>
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            2025-08-28 14:25:08
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            85
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            98.8%
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            32.14s
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            5 adjuntos
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                Completado
                            </span>
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            2025-08-28 14:20:03
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            92
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            100%
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            35.89s
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            12 adjuntos
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                Completado
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- AI Configuration -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800 flex items-center">
                <i data-lucide="settings" class="w-5 h-5 mr-2 text-indigo-600"></i>
                Configuración de IA
            </h2>
        </div>
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Intervalo de Procesamiento</label>
                    <select class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="5" selected>5 minutos</option>
                        <option value="10">10 minutos</option>
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Nivel de Confianza</label>
                    <input type="range" 
                           min="50" 
                           max="100" 
                           value="85" 
                           class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
                    <div class="flex justify-between text-xs text-slate-500 mt-1">
                        <span>50%</span>
                        <span>85%</span>
                        <span>100%</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Modo de Operación</label>
                    <select class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="auto" selected>Automático</option>
                        <option value="manual">Manual</option>
                        <option value="scheduled">Programado</option>
                    </select>
                </div>
            </div>
            
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div class="mt-6 flex space-x-4">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i data-lucide="play" class="w-4 h-4 mr-2"></i>
                    Iniciar Procesamiento
                </button>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i data-lucide="pause" class="w-4 h-4 mr-2"></i>
                    Pausar Procesamiento
                </button>
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <i data-lucide="save" class="w-4 h-4 mr-2"></i>
                    Guardar Configuración
                </button>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Auto-refresh AI metrics every 15 seconds
    setInterval(() => {
        console.log('Actualizando métricas de IA...');
        // Here you would update the metrics from the AI system
    }, 15000);
</script>
@endpush
@endsection
