@extends('layouts.dashboard-turbo')

@section('page-content')
@php
    $urgencies = $urgencyData['data']['urgencies'] ?? [];
    $stats = $urgencyData['data']['statistics'] ?? [];
    $totalUrgencies = count($urgencies);
    $criticalCases = collect($urgencies)->where('priority', 'Crítica')->count();
@endphp

<div class="space-y-6">
    <!-- Emergency Header -->
    <div class="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold flex items-center">
                    <i data-lucide="alert-triangle" class="w-8 h-8 mr-3"></i>
                    Centro de Urgencias
                </h1>
                <p class="text-red-100 mt-1">Gestión de casos de emergencia y urgencias médicas</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold">{{ $totalUrgencies }}</div>
                <div class="text-red-100">Casos Activos</div>
            </div>
        </div>
    </div>

    <!-- Critical Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-red-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="zap" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Críticos</p>
                    <p class="text-2xl font-bold text-red-600">{{ $criticalCases }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="clock" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Tiempo Promedio</p>
                    <p class="text-2xl font-bold text-orange-600">8min</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="activity" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">En Proceso</p>
                    <p class="text-2xl font-bold text-yellow-600">{{ collect($urgencies)->where('status', 'En Proceso')->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="check-circle" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Resueltos Hoy</p>
                    <p class="text-2xl font-bold text-green-600">{{ collect($urgencies)->where('status', 'Resuelto')->count() }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Priority Filter -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Filtros de Prioridad</h2>
            <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                Actualizar
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <button class="p-3 border-2 border-red-500 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors">
                <i data-lucide="zap" class="w-4 h-4 mr-2"></i>
                Crítica ({{ $criticalCases }})
            </button>
            <button class="p-3 border-2 border-orange-300 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors">
                <i data-lucide="alert-triangle" class="w-4 h-4 mr-2"></i>
                Alta ({{ collect($urgencies)->where('priority', 'Alta')->count() }})
            </button>
            <button class="p-3 border-2 border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg font-medium hover:bg-yellow-100 transition-colors">
                <i data-lucide="minus-circle" class="w-4 h-4 mr-2"></i>
                Media ({{ collect($urgencies)->where('priority', 'Media')->count() }})
            </button>
            <button class="p-3 border-2 border-green-300 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors">
                <i data-lucide="circle" class="w-4 h-4 mr-2"></i>
                Baja ({{ collect($urgencies)->where('priority', 'Baja')->count() }})
            </button>
            <button class="p-3 border-2 border-slate-300 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                <i data-lucide="list" class="w-4 h-4 mr-2"></i>
                Todas ({{ $totalUrgencies }})
            </button>
        </div>
    </div>

    <!-- Urgencies List -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">Casos de Urgencia Activos</h2>
            <p class="text-sm text-slate-600">{{ $totalUrgencies }} casos requieren atención inmediata</p>
        </div>
        
        <div class="divide-y divide-slate-200">
            @forelse($urgencies as $urgency)
                @php
                    $priorityColors = [
                        'Crítica' => 'border-l-red-500 bg-red-50',
                        'Alta' => 'border-l-orange-500 bg-orange-50',
                        'Media' => 'border-l-yellow-500 bg-yellow-50',
                        'Baja' => 'border-l-green-500 bg-green-50'
                    ];
                    $priorityColor = $priorityColors[$urgency['priority'] ?? 'Baja'] ?? 'border-l-slate-500 bg-slate-50';
                @endphp
                
                <div class="p-6 border-l-4 {{ $priorityColor }} hover:shadow-md transition-all duration-200">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-3">
                                <h3 class="text-lg font-semibold text-slate-800">{{ $urgency['patient_name'] ?? 'Paciente de Urgencia' }}</h3>
                                <span class="px-3 py-1 text-xs font-bold rounded-full 
                                    {{ ($urgency['priority'] ?? '') === 'Crítica' ? 'bg-red-500 text-white' : 
                                       (($urgency['priority'] ?? '') === 'Alta' ? 'bg-orange-500 text-white' : 
                                       (($urgency['priority'] ?? '') === 'Media' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white')) }}">
                                    {{ $urgency['priority'] ?? 'Baja' }}
                                </span>
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                    {{ $urgency['status'] ?? 'Pendiente' }}
                                </span>
                            </div>
                            
                            <p class="text-slate-700 mb-3 font-medium">{{ $urgency['chief_complaint'] ?? 'Motivo de consulta no especificado' }}</p>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                                <div class="flex items-center">
                                    <i data-lucide="user" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $urgency['age'] ?? 'N/A' }} años</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="clock" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span class="font-medium text-red-600">{{ $urgency['time_waiting'] ?? 'Recién llegado' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="thermometer" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $urgency['vital_signs'] ?? 'Signos vitales pendientes' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $urgency['location'] ?? 'Sala de espera' }}</span>
                                </div>
                            </div>
                            
                            @if(isset($urgency['notes']) && $urgency['notes'])
                                <div class="bg-slate-100 rounded-lg p-3 text-sm text-slate-700">
                                    <strong>Notas:</strong> {{ $urgency['notes'] }}
                                </div>
                            @endif
                        </div>
                        
                        <div class="flex flex-col items-end space-y-2 ml-6">
                            <div class="flex items-center space-x-2">
                                <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles">
                                    <i data-lucide="eye" class="w-5 h-5"></i>
                                </button>
                                <button class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Atender">
                                    <i data-lucide="user-check" class="w-5 h-5"></i>
                                </button>
                                <button class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Transferir">
                                    <i data-lucide="arrow-right" class="w-5 h-5"></i>
                                </button>
                            </div>
                            
                            @if(($urgency['priority'] ?? '') === 'Crítica')
                                <div class="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded">
                                    ⚠️ ATENCIÓN INMEDIATA
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            @empty
                <div class="p-12 text-center">
                    <i data-lucide="heart" class="w-16 h-16 text-green-400 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-900 mb-2">No hay urgencias activas</h3>
                    <p class="text-slate-500">Excelente! No hay casos de urgencia que requieran atención inmediata.</p>
                </div>
            @endforelse
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Auto-refresh every 30 seconds for urgencies
    setInterval(() => {
        window.location.reload();
    }, 30000);
    
    // Sound alert for critical cases (if any)
    @if($criticalCases > 0)
        // Play alert sound for critical cases
        console.log('⚠️ ALERTA: {{ $criticalCases }} casos críticos requieren atención inmediata');
    @endif
</script>
@endpush
@endsection
