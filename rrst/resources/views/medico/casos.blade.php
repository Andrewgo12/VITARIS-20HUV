@extends('layouts.dashboard-turbo')

@section('page-content')
@php
    $cases = $medicalCases['data']['cases'] ?? [];
    $stats = $medicalCases['data']['statistics'] ?? [];
    $totalCases = count($cases);
    $pendingCases = collect($cases)->where('status', 'Pendiente')->count();
    $highPriority = collect($cases)->where('priority', 'Alta')->count();
@endphp

<div class="space-y-6">
    <!-- Header with Stats -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Casos Médicos</h1>
                <p class="text-slate-600">Gestión y evaluación de casos médicos</p>
            </div>
            <div class="flex items-center space-x-4">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                    Actualizar
                </button>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div class="flex items-center">
                    <i data-lucide="file-text" class="w-8 h-8 text-blue-600 mr-3"></i>
                    <div>
                        <p class="text-sm text-blue-600 font-medium">Total Casos</p>
                        <p class="text-2xl font-bold text-blue-800">{{ $totalCases }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                <div class="flex items-center">
                    <i data-lucide="clock" class="w-8 h-8 text-orange-600 mr-3"></i>
                    <div>
                        <p class="text-sm text-orange-600 font-medium">Pendientes</p>
                        <p class="text-2xl font-bold text-orange-800">{{ $pendingCases }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                <div class="flex items-center">
                    <i data-lucide="alert-triangle" class="w-8 h-8 text-red-600 mr-3"></i>
                    <div>
                        <p class="text-sm text-red-600 font-medium">Alta Prioridad</p>
                        <p class="text-2xl font-bold text-red-800">{{ $highPriority }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                <div class="flex items-center">
                    <i data-lucide="check-circle" class="w-8 h-8 text-green-600 mr-3"></i>
                    <div>
                        <p class="text-sm text-green-600 font-medium">Tasa Aceptación</p>
                        <p class="text-2xl font-bold text-green-800">78%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <form method="GET" action="{{ route('medico.casos') }}" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Prioridad</label>
                <select name="priority" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Todas</option>
                    <option value="Alta" {{ ($filters['priority'] ?? '') === 'Alta' ? 'selected' : '' }}>Alta</option>
                    <option value="Media" {{ ($filters['priority'] ?? '') === 'Media' ? 'selected' : '' }}>Media</option>
                    <option value="Baja" {{ ($filters['priority'] ?? '') === 'Baja' ? 'selected' : '' }}>Baja</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                <select name="status" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Todos</option>
                    <option value="Pendiente" {{ ($filters['status'] ?? '') === 'Pendiente' ? 'selected' : '' }}>Pendiente</option>
                    <option value="Aprobado" {{ ($filters['status'] ?? '') === 'Aprobado' ? 'selected' : '' }}>Aprobado</option>
                    <option value="Rechazado" {{ ($filters['status'] ?? '') === 'Rechazado' ? 'selected' : '' }}>Rechazado</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Especialidad</label>
                <select name="specialty" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Todas</option>
                    <option value="Cardiología" {{ ($filters['specialty'] ?? '') === 'Cardiología' ? 'selected' : '' }}>Cardiología</option>
                    <option value="Neurología" {{ ($filters['specialty'] ?? '') === 'Neurología' ? 'selected' : '' }}>Neurología</option>
                    <option value="Pediatría" {{ ($filters['specialty'] ?? '') === 'Pediatría' ? 'selected' : '' }}>Pediatría</option>
                    <option value="Medicina Interna" {{ ($filters['specialty'] ?? '') === 'Medicina Interna' ? 'selected' : '' }}>Medicina Interna</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Buscar</label>
                <input type="text" 
                       name="search" 
                       value="{{ $filters['search'] ?? '' }}"
                       placeholder="Nombre del paciente..."
                       class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex items-end space-x-2">
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i data-lucide="search" class="w-4 h-4 mr-2"></i>
                    Filtrar
                </button>
                <a href="{{ route('medico.casos') }}" class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </a>
            </div>
        </form>
    </div>

    <!-- Cases List -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">Lista de Casos</h2>
            <p class="text-sm text-slate-600">{{ count($cases) }} casos encontrados</p>
        </div>
        
        <div class="divide-y divide-slate-200">
            @forelse($cases as $case)
                <div class="p-6 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-3">
                                <h3 class="text-lg font-semibold text-slate-800">{{ $case['patient_name'] ?? 'Paciente' }}</h3>
                                <span class="px-3 py-1 text-xs font-medium rounded-full 
                                    {{ ($case['priority'] ?? '') === 'Alta' ? 'bg-red-100 text-red-700' : 
                                       (($case['priority'] ?? '') === 'Media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700') }}">
                                    {{ $case['priority'] ?? 'Normal' }}
                                </span>
                                <span class="px-3 py-1 text-xs font-medium rounded-full 
                                    {{ ($case['status'] ?? '') === 'Pendiente' ? 'bg-orange-100 text-orange-700' : 
                                       (($case['status'] ?? '') === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') }}">
                                    {{ $case['status'] ?? 'Pendiente' }}
                                </span>
                            </div>
                            
                            <p class="text-slate-700 mb-3">{{ $case['diagnosis'] ?? 'Diagnóstico no especificado' }}</p>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                                <div class="flex items-center">
                                    <i data-lucide="user" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $case['age'] ?? 'N/A' }} años</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="stethoscope" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $case['specialty'] ?? 'General' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="clock" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $case['time_elapsed'] ?? 'Recién llegado' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="calendar" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $case['date'] ?? 'Hoy' }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-2 ml-6">
                            <a href="{{ route('medico.casos.detail', $case['id'] ?? 1) }}" 
                               class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                               title="Ver detalles">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </a>
                            @if(($case['status'] ?? '') === 'Pendiente')
                                <button class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                                        title="Aprobar">
                                    <i data-lucide="check" class="w-5 h-5"></i>
                                </button>
                                <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                        title="Rechazar">
                                    <i data-lucide="x" class="w-5 h-5"></i>
                                </button>
                            @endif
                            <button class="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" 
                                    title="Más opciones">
                                <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            @empty
                <div class="p-12 text-center">
                    <i data-lucide="file-text" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-900 mb-2">No se encontraron casos</h3>
                    <p class="text-slate-500">No hay casos médicos que coincidan con los filtros seleccionados.</p>
                </div>
            @endforelse
        </div>
    </div>
</div>
@endsection
