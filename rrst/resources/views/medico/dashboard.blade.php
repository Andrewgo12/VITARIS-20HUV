@extends('layouts.dashboard-turbo')

@push('styles')
<style>
    /* Optimize animations for better performance */
    .card-hover {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        will-change: transform;
    }
    .card-hover:hover {
        transform: translateY(-2px);
    }
</style>
@endpush

@section('page-content')
@php
    $stats = $medicalCases['data']['statistics'] ?? [];
    $cases = $medicalCases['data']['cases'] ?? [];
    $totalCases = count($cases);
    $pendingCases = collect($cases)->where('status', 'Pendiente')->count();
    $highPriorityCases = collect($cases)->where('priority', 'Alta')->count();
@endphp

<div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Casos Pendientes -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6 card-hover cursor-pointer">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-600">Casos Pendientes</p>
                    <p class="text-3xl font-bold text-orange-600">{{ $pendingCases }}</p>
                    <p class="text-xs text-slate-500 mt-1">Requieren evaluación</p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <i data-lucide="inbox" class="w-6 h-6 text-white"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-orange-600 font-medium">{{ $highPriorityCases }} urgentes</span>
                <span class="text-slate-500 ml-2">• {{ $pendingCases - $highPriorityCases }} normales</span>
            </div>
        </div>

        <!-- Total de Casos -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6 card-hover cursor-pointer">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-600">Total de Casos</p>
                    <p class="text-3xl font-bold text-blue-600">{{ $totalCases }}</p>
                    <p class="text-xs text-slate-500 mt-1">Este mes</p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <i data-lucide="file-text" class="w-6 h-6 text-white"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-green-600 font-medium">+12%</span>
                <span class="text-slate-500 ml-2">vs mes anterior</span>
            </div>
        </div>

        <!-- Prioridad Alta -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-600">Prioridad Alta</p>
                    <p class="text-3xl font-bold text-red-600">{{ $highPriorityCases }}</p>
                    <p class="text-xs text-slate-500 mt-1">Requieren atención inmediata</p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <i data-lucide="alert-triangle" class="w-6 h-6 text-white"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-red-600 font-medium">Crítico</span>
                <span class="text-slate-500 ml-2">• Respuesta < 2h</span>
            </div>
        </div>

        <!-- Tiempo Promedio -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-600">Tiempo Promedio</p>
                    <p class="text-3xl font-bold text-emerald-600">2.5h</p>
                    <p class="text-xs text-slate-500 mt-1">Tiempo de respuesta</p>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <i data-lucide="clock" class="w-6 h-6 text-white"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-emerald-600 font-medium">-15 min</span>
                <span class="text-slate-500 ml-2">vs ayer</span>
            </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Casos Pendientes -->
        <div class="lg:col-span-2">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
                <div class="p-6 border-b border-slate-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-slate-800">Casos Pendientes</h3>
                        <span class="text-sm text-slate-500">{{ $pendingCases }} casos</span>
                    </div>
                    <p class="text-sm text-slate-600 mt-1">Solicitudes que requieren su atención inmediata</p>
                </div>
                <div class="p-6 space-y-4 max-h-96 overflow-y-auto">
                    @forelse(collect($cases)->where('status', 'Pendiente')->take(5) as $case)
                        <div class="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] bg-gradient-to-r from-white to-slate-50">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3 mb-2">
                                        <h4 class="font-semibold text-slate-800">{{ $case['patient_name'] ?? 'Paciente' }}</h4>
                                        <span class="px-2 py-1 text-xs font-medium rounded-full
                                            {{ ($case['priority'] ?? '') === 'Alta' ? 'bg-red-100 text-red-700' :
                                               (($case['priority'] ?? '') === 'Media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700') }}">
                                            {{ $case['priority'] ?? 'Normal' }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-slate-600 mb-2">{{ $case['diagnosis'] ?? 'Diagnóstico no especificado' }}</p>
                                    <div class="flex items-center space-x-4 text-xs text-slate-500">
                                        <span class="flex items-center">
                                            <i data-lucide="user" class="w-3 h-3 mr-1"></i>
                                            {{ $case['age'] ?? 'N/A' }} años
                                        </span>
                                        <span class="flex items-center">
                                            <i data-lucide="clock" class="w-3 h-3 mr-1"></i>
                                            {{ $case['time_elapsed'] ?? 'Recién llegado' }}
                                        </span>
                                        <span class="flex items-center">
                                            <i data-lucide="stethoscope" class="w-3 h-3 mr-1"></i>
                                            {{ $case['specialty'] ?? 'General' }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                        <i data-lucide="check" class="w-4 h-4"></i>
                                    </button>
                                    <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <i data-lucide="eye" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="text-center py-8">
                            <i data-lucide="inbox" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
                            <p class="text-slate-500">No hay casos pendientes</p>
                        </div>
                    @endforelse
                </div>
                @if($pendingCases > 5)
                    <div class="p-4 border-t border-slate-200">
                        <a href="{{ route('medico.casos') }}" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Ver todos los casos ({{ $pendingCases }})
                        </a>
                    </div>
                @endif
            </div>
        </div>

        <!-- Quick Actions & Summary -->
        <div class="space-y-6">
            <!-- Resumen de Hoy -->
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
                <div class="p-6 border-b border-slate-200">
                    <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                        <i data-lucide="calendar" class="w-5 h-5 mr-2 text-blue-600"></i>
                        Resumen de Hoy
                    </h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span class="text-sm text-slate-600 flex items-center">
                            <i data-lucide="activity" class="w-4 h-4 mr-2 text-emerald-600"></i>
                            Casos evaluados
                        </span>
                        <span class="font-semibold text-slate-800">15</span>
                    </div>
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span class="text-sm text-slate-600 flex items-center">
                            <i data-lucide="check-circle" class="w-4 h-4 mr-2 text-green-600"></i>
                            Aprobados
                        </span>
                        <span class="font-semibold text-slate-800">12</span>
                    </div>
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span class="text-sm text-slate-600 flex items-center">
                            <i data-lucide="x-circle" class="w-4 h-4 mr-2 text-red-600"></i>
                            Rechazados
                        </span>
                        <span class="font-semibold text-slate-800">2</span>
                    </div>
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span class="text-sm text-slate-600 flex items-center">
                            <i data-lucide="clock" class="w-4 h-4 mr-2 text-blue-600"></i>
                            Tiempo promedio
                        </span>
                        <span class="font-semibold text-slate-800">2.3h</span>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
                <div class="p-6 border-b border-slate-200">
                    <h3 class="text-lg font-semibold text-slate-800">Acciones Rápidas</h3>
                </div>
                <div class="p-6 space-y-3">
                    <a href="{{ route('medico.casos') }}" class="flex items-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <i data-lucide="file-text" class="w-5 h-5 mr-3"></i>
                        <span class="font-medium">Ver Todos los Casos</span>
                    </a>
                    <a href="{{ route('medico.urgencias') }}" class="flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <i data-lucide="alert-triangle" class="w-5 h-5 mr-3"></i>
                        <span class="font-medium">Urgencias</span>
                    </a>
                    <a href="{{ route('medico.pacientes') }}" class="flex items-center p-3 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <i data-lucide="users" class="w-5 h-5 mr-3"></i>
                        <span class="font-medium">Gestión de Pacientes</span>
                    </a>
                    <a href="{{ route('medico.historial') }}" class="flex items-center p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <i data-lucide="clock" class="w-5 h-5 mr-3"></i>
                        <span class="font-medium">Historial</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Actualizar datos cada 30 segundos
    setInterval(() => {
        window.location.reload();
    }, 30000);
</script>
@endpush
@endsection
