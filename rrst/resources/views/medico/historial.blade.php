@extends('layouts.dashboard-turbo')

@section('page-content')
@php
    $records = $historicalData['data']['records'] ?? [];
    $stats = $historicalData['data']['statistics'] ?? [];
    $totalRecords = count($records);
@endphp

<div class="space-y-6">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Historial Médico</h1>
                <p class="text-slate-600">Registro histórico de casos y consultas médicas</p>
            </div>
            <div class="flex items-center space-x-4">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                    Exportar
                </button>
                <button class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                    Actualizar
                </button>
            </div>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="file-text" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Total Registros</p>
                    <p class="text-2xl font-bold text-blue-600">{{ $totalRecords }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="check-circle" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Casos Resueltos</p>
                    <p class="text-2xl font-bold text-green-600">{{ collect($records)->where('status', 'Resuelto')->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="calendar" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Este Mes</p>
                    <p class="text-2xl font-bold text-purple-600">{{ collect($records)->where('date', '>=', now()->startOfMonth())->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <i data-lucide="clock" class="w-6 h-6 text-white"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-slate-600">Tiempo Promedio</p>
                    <p class="text-2xl font-bold text-orange-600">2.5h</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Fecha Desde</label>
                <input type="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Fecha Hasta</label>
                <input type="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                <select class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Todos</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Seguimiento">En Seguimiento</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Buscar</label>
                <input type="text" 
                       placeholder="Paciente, diagnóstico..."
                       class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex items-end">
                <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i data-lucide="search" class="w-4 h-4 mr-2"></i>
                    Buscar
                </button>
            </div>
        </div>
    </div>

    <!-- Historical Records -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">Registros Históricos</h2>
            <p class="text-sm text-slate-600">{{ $totalRecords }} registros encontrados</p>
        </div>
        
        <div class="divide-y divide-slate-200">
            @forelse($records as $record)
                @php
                    $statusColors = [
                        'Resuelto' => 'bg-green-100 text-green-700',
                        'Pendiente' => 'bg-orange-100 text-orange-700',
                        'En Seguimiento' => 'bg-blue-100 text-blue-700',
                        'Cancelado' => 'bg-red-100 text-red-700'
                    ];
                    $statusColor = $statusColors[$record['status'] ?? 'Pendiente'] ?? 'bg-slate-100 text-slate-700';
                @endphp
                
                <div class="p-6 hover:bg-slate-50 transition-colors">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                                    <span class="text-white font-medium text-sm">
                                        {{ substr($record['patient_name'] ?? 'P', 0, 1) }}
                                    </span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-800">{{ $record['patient_name'] ?? 'Paciente' }}</h3>
                                    <p class="text-sm text-slate-500">ID: {{ $record['case_id'] ?? 'N/A' }}</p>
                                </div>
                                <span class="px-3 py-1 text-xs font-medium rounded-full {{ $statusColor }}">
                                    {{ $record['status'] ?? 'Pendiente' }}
                                </span>
                            </div>
                            
                            <div class="mb-3">
                                <p class="text-slate-700 font-medium">{{ $record['diagnosis'] ?? 'Diagnóstico no especificado' }}</p>
                                @if(isset($record['treatment']) && $record['treatment'])
                                    <p class="text-sm text-slate-600 mt-1">Tratamiento: {{ $record['treatment'] }}</p>
                                @endif
                            </div>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                                <div class="flex items-center">
                                    <i data-lucide="calendar" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $record['date'] ?? 'N/A' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="user" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $record['age'] ?? 'N/A' }} años</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="stethoscope" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $record['specialty'] ?? 'General' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i data-lucide="clock" class="w-4 h-4 mr-2 text-slate-400"></i>
                                    <span>{{ $record['duration'] ?? 'N/A' }}</span>
                                </div>
                            </div>
                            
                            @if(isset($record['notes']) && $record['notes'])
                                <div class="bg-slate-50 rounded-lg p-3">
                                    <p class="text-sm text-slate-700">
                                        <strong>Notas:</strong> {{ $record['notes'] }}
                                    </p>
                                </div>
                            @endif
                        </div>
                        
                        <div class="flex items-center space-x-2 ml-6">
                            <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles completos">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </button>
                            <button class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Descargar reporte">
                                <i data-lucide="download" class="w-5 h-5"></i>
                            </button>
                            <button class="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Ver seguimiento">
                                <i data-lucide="trending-up" class="w-5 h-5"></i>
                            </button>
                            <button class="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" title="Más opciones">
                                <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            @empty
                <div class="p-12 text-center">
                    <i data-lucide="archive" class="w-16 h-16 text-slate-300 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-900 mb-2">No hay registros históricos</h3>
                    <p class="text-slate-500">No se encontraron registros que coincidan con los criterios de búsqueda.</p>
                </div>
            @endforelse
        </div>
        
        @if($totalRecords > 0)
            <!-- Pagination -->
            <div class="p-6 border-t border-slate-200">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-slate-700">
                        Mostrando <span class="font-medium">1</span> a <span class="font-medium">{{ min(10, $totalRecords) }}</span> de <span class="font-medium">{{ $totalRecords }}</span> resultados
                    </p>
                    <div class="flex items-center space-x-2">
                        <button class="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                            Anterior
                        </button>
                        <button class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            1
                        </button>
                        <button class="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                            2
                        </button>
                        <button class="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
