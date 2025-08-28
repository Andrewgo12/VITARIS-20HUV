@extends('layouts.dashboard-turbo')

@section('page-content')
@php
    $admissions = $hospitalizationData['data']['admissions'] ?? [];
    $stats = $hospitalizationData['data']['statistics'] ?? [];
    $totalAdmissions = count($admissions);
    $occupancyRate = $stats['occupancy_rate'] ?? 0;
@endphp

<div class="space-y-6">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Pacientes Hospitalizados</h1>
                <p class="text-slate-600">Gestión y seguimiento de pacientes internados</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold text-blue-600">{{ $totalAdmissions }}</div>
                <div class="text-slate-500">Pacientes Internados</div>
            </div>
        </div>
    </div>

    <!-- Hospital Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="bed" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Ocupación</p>
                    <p class="text-2xl font-bold text-blue-600">{{ number_format($occupancyRate, 1) }}%</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="activity" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Estables</p>
                    <p class="text-2xl font-bold text-green-600">{{ collect($admissions)->where('status', 'Estable')->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="alert-circle" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Observación</p>
                    <p class="text-2xl font-bold text-yellow-600">{{ collect($admissions)->where('status', 'Observación')->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="calendar" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Estancia Promedio</p>
                    <p class="text-2xl font-bold text-purple-600">{{ $stats['average_stay'] ?? 0 }} días</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Ward Filter -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Filtrar por Pabellón</h2>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                Actualizar
            </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
            <button class="p-3 border-2 border-blue-300 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                <i data-lucide="heart" class="w-4 h-4 mr-2"></i>
                Cardiología
            </button>
            <button class="p-3 border-2 border-purple-300 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors">
                <i data-lucide="brain" class="w-4 h-4 mr-2"></i>
                Neurología
            </button>
            <button class="p-3 border-2 border-green-300 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors">
                <i data-lucide="baby" class="w-4 h-4 mr-2"></i>
                Pediatría
            </button>
            <button class="p-3 border-2 border-red-300 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors">
                <i data-lucide="zap" class="w-4 h-4 mr-2"></i>
                UCI
            </button>
            <button class="p-3 border-2 border-orange-300 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors">
                <i data-lucide="scissors" class="w-4 h-4 mr-2"></i>
                Cirugía
            </button>
            <button class="p-3 border-2 border-slate-300 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                <i data-lucide="list" class="w-4 h-4 mr-2"></i>
                Todos
            </button>
        </div>
    </div>

    <!-- Patients List -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">Pacientes Hospitalizados</h2>
            <p class="text-sm text-slate-600">{{ $totalAdmissions }} pacientes actualmente internados</p>
        </div>
        
        <div class="divide-y divide-slate-200">
            @forelse($admissions as $admission)
                @php
                    $statusColors = [
                        'Estable' => 'bg-green-100 text-green-700',
                        'Observación' => 'bg-yellow-100 text-yellow-700',
                        'Crítico' => 'bg-red-100 text-red-700',
                        'Recuperación' => 'bg-blue-100 text-blue-700'
                    ];
                    $statusColor = $statusColors[$admission['status'] ?? 'Estable'] ?? 'bg-slate-100 text-slate-700';
                @endphp
                
                <div class="p-6 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span class="text-white font-bold">
                                        {{ substr($admission['patient_name'] ?? 'P', 0, 1) }}
                                    </span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-800">{{ $admission['patient_name'] ?? 'Paciente' }}</h3>
                                    <p class="text-sm text-slate-500">Cama {{ $admission['bed_number'] ?? 'N/A' }} - {{ $admission['ward'] ?? 'Pabellón General' }}</p>
                                </div>
                                <span class="px-3 py-1 text-xs font-medium rounded-full {{ $statusColor }}">
                                    {{ $admission['status'] ?? 'Estable' }}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                                <div class="flex items-center">
                                    <i data-lucide="user" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $admission['age'] ?? 'N/A' }} años</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="calendar" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $admission['admission_date'] ?? 'Hoy' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="clock" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $admission['length_of_stay'] ?? '1' }} días</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="stethoscope" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $admission['attending_physician'] ?? 'Dr. Asignado' }}</span>
                                </div>
                            </div>
                            
                            <div class="bg-slate-50 rounded-lg p-3 mb-3">
                                <p class="text-sm text-slate-700">
                                    <strong>Diagnóstico:</strong> {{ $admission['diagnosis'] ?? 'Diagnóstico pendiente' }}
                                </p>
                            </div>
                            
                            @if(isset($admission['treatment_plan']) && $admission['treatment_plan'])
                                <div class="bg-blue-50 rounded-lg p-3">
                                    <p class="text-sm text-blue-700">
                                        <strong>Plan de Tratamiento:</strong> {{ $admission['treatment_plan'] }}
                                    </p>
                                </div>
                            @endif
                        </div>
                        
                        <div class="flex flex-col items-end space-y-2 ml-6">
                            <div class="flex items-center space-x-2">
                                <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver historial">
                                    <i data-lucide="file-text" class="w-5 h-5"></i>
                                </button>
                                <button class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Signos vitales">
                                    <i data-lucide="activity" class="w-5 h-5"></i>
                                </button>
                                <button class="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Medicamentos">
                                    <i data-lucide="pill" class="w-5 h-5"></i>
                                </button>
                                <button class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Notas médicas">
                                    <i data-lucide="edit" class="w-5 h-5"></i>
                                </button>
                            </div>
                            
                            @if(($admission['status'] ?? '') === 'Crítico')
                                <div class="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded">
                                    ⚠️ ESTADO CRÍTICO
                                </div>
                            @endif
                            
                            @if(isset($admission['discharge_planned']) && $admission['discharge_planned'])
                                <div class="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                                    📅 Alta programada
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            @empty
                <div class="p-12 text-center">
                    <i data-lucide="bed" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-900 mb-2">No hay pacientes hospitalizados</h3>
                    <p class="text-slate-500">Actualmente no hay pacientes internados en el hospital.</p>
                </div>
            @endforelse
        </div>
    </div>
</div>
@endsection
