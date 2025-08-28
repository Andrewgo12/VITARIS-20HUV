@extends('layouts.dashboard-turbo')

@section('page-content')
@php
    $stats = $adminData['data']['statistics'] ?? [];
    $records = $adminData['data']['records'] ?? [];
    $totalRecords = count($records);
@endphp

<div class="space-y-6">
    <!-- Admin Header -->
    <div class="bg-gradient-to-r from-slate-600 to-blue-600 text-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold flex items-center">
                    <i data-lucide="shield" class="w-8 h-8 mr-3"></i>
                    Panel de Administración
                </h1>
                <p class="text-slate-100 mt-1">Control y supervisión del sistema VITAL RED</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold">{{ $stats['total_users'] ?? 0 }}</div>
                <div class="text-slate-200">Usuarios Activos</div>
            </div>
        </div>
    </div>

    <!-- System Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="activity" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Estado del Sistema</p>
                    <p class="text-2xl font-bold text-green-600">Operativo</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="users" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Sesiones Activas</p>
                    <p class="text-2xl font-bold text-blue-600">{{ $stats['active_sessions'] ?? 0 }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="database" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Registros Totales</p>
                    <p class="text-2xl font-bold text-purple-600">{{ $totalRecords }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="hard-drive" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Último Respaldo</p>
                    <p class="text-2xl font-bold text-orange-600">{{ $stats['last_backup'] ?? 'N/A' }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- System Management -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="settings" class="w-5 h-5 mr-2 text-blue-600"></i>
                    Gestión del Sistema
                </h3>
            </div>
            <div class="p-6 space-y-3">
                <a href="{{ route('admin.users') }}" class="flex items-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <i data-lucide="users" class="w-5 h-5 mr-3"></i>
                    <span class="font-medium">Gestión de Usuarios</span>
                </a>
                <a href="{{ route('admin.config') }}" class="flex items-center p-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <i data-lucide="settings" class="w-5 h-5 mr-3"></i>
                    <span class="font-medium">Configuración</span>
                </a>
                <a href="{{ route('admin.backup') }}" class="flex items-center p-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <i data-lucide="hard-drive" class="w-5 h-5 mr-3"></i>
                    <span class="font-medium">Respaldos</span>
                </a>
            </div>
        </div>

        <!-- Monitoring -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="eye" class="w-5 h-5 mr-2 text-purple-600"></i>
                    Monitoreo
                </h3>
            </div>
            <div class="p-6 space-y-3">
                <a href="{{ route('admin.supervision') }}" class="flex items-center p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <i data-lucide="monitor" class="w-5 h-5 mr-3"></i>
                    <span class="font-medium">Supervisión del Sistema</span>
                </a>
                <a href="{{ route('admin.ai-monitor') }}" class="flex items-center p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <i data-lucide="brain" class="w-5 h-5 mr-3"></i>
                    <span class="font-medium">Monitor de IA</span>
                </a>
                <button class="w-full flex items-center p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <i data-lucide="bar-chart" class="w-5 h-5 mr-3"></i>
                    <span class="font-medium">Reportes</span>
                </button>
            </div>
        </div>

        <!-- System Health -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="heart" class="w-5 h-5 mr-2 text-green-600"></i>
                    Estado del Sistema
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span class="text-sm text-slate-600 flex items-center">
                        <i data-lucide="cpu" class="w-4 h-4 mr-2 text-blue-600"></i>
                        CPU
                    </span>
                    <span class="font-semibold text-slate-800">23%</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span class="text-sm text-slate-600 flex items-center">
                        <i data-lucide="memory-stick" class="w-4 h-4 mr-2 text-green-600"></i>
                        Memoria
                    </span>
                    <span class="font-semibold text-slate-800">45%</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span class="text-sm text-slate-600 flex items-center">
                        <i data-lucide="hard-drive" class="w-4 h-4 mr-2 text-orange-600"></i>
                        Disco
                    </span>
                    <span class="font-semibold text-slate-800">67%</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span class="text-sm text-slate-600 flex items-center">
                        <i data-lucide="wifi" class="w-4 h-4 mr-2 text-purple-600"></i>
                        Red
                    </span>
                    <span class="font-semibold text-green-600">Estable</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-800">Actividad Reciente</h2>
                <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">Ver todo</button>
            </div>
        </div>
        <div class="divide-y divide-slate-200">
            <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i data-lucide="user-plus" class="w-4 h-4 text-green-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-slate-900">Nuevo usuario registrado: Dr. María González</p>
                        <p class="text-xs text-slate-500 mt-1">Hace 15 minutos</p>
                    </div>
                </div>
            </div>
            <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i data-lucide="hard-drive" class="w-4 h-4 text-blue-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-slate-900">Respaldo automático completado exitosamente</p>
                        <p class="text-xs text-slate-500 mt-1">Hace 2 horas</p>
                    </div>
                </div>
            </div>
            <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <i data-lucide="brain" class="w-4 h-4 text-purple-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-slate-900">Sistema de IA procesó 156 casos médicos</p>
                        <p class="text-xs text-slate-500 mt-1">Hace 4 horas</p>
                    </div>
                </div>
            </div>
            <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <i data-lucide="settings" class="w-4 h-4 text-orange-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-slate-900">Configuración del sistema actualizada</p>
                        <p class="text-xs text-slate-500 mt-1">Ayer</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Auto-refresh system stats every 60 seconds
    setInterval(() => {
        // Update system health indicators
        console.log('Actualizando estadísticas del sistema...');
    }, 60000);
</script>
@endpush
@endsection
