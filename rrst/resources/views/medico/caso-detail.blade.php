@extends('layouts.dashboard-turbo')

@section('page-content')
@php
    $caso = $caso ?? [
        'id' => 'REF-2024-001',
        'patient_name' => 'María Elena Rodríguez',
        'age' => 45,
        'diagnosis' => 'Dolor torácico agudo',
        'priority' => 'Alta',
        'status' => 'Pendiente',
        'specialty' => 'Cardiología',
        'time_elapsed' => 'Hace 2 horas',
        'date' => '2025-08-28',
        'referring_physician' => 'Dr. Juan Pérez',
        'referring_hospital' => 'Hospital Regional Norte',
        'chief_complaint' => 'Dolor torácico de inicio súbito, irradiado a brazo izquierdo',
        'vital_signs' => 'PA: 150/90, FC: 95, FR: 22, Temp: 36.8°C',
        'medical_history' => 'Hipertensión arterial, diabetes mellitus tipo 2',
        'current_medications' => 'Losartán 50mg, Metformina 850mg',
        'physical_examination' => 'Paciente consciente, orientada, con dolor torácico persistente...',
        'laboratory_results' => 'Troponinas elevadas, ECG con cambios isquémicos',
        'imaging_studies' => 'Radiografía de tórax normal, ECG con ondas T invertidas en V1-V4',
        'treatment_plan' => 'Antiagregación, anticoagulación, monitoreo cardíaco continuo',
        'notes' => 'Paciente requiere evaluación urgente por cardiología para posible cateterismo'
    ];
@endphp

<div class="space-y-6">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between">
            <div>
                <div class="flex items-center space-x-3 mb-2">
                    <h1 class="text-2xl font-bold text-slate-800">{{ $caso['patient_name'] }}</h1>
                    <span class="px-3 py-1 text-sm font-medium rounded-full 
                        {{ $caso['priority'] === 'Alta' ? 'bg-red-100 text-red-700' : 
                           ($caso['priority'] === 'Media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700') }}">
                        {{ $caso['priority'] }} Prioridad
                    </span>
                    <span class="px-3 py-1 text-sm font-medium rounded-full 
                        {{ $caso['status'] === 'Pendiente' ? 'bg-orange-100 text-orange-700' : 
                           ($caso['status'] === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') }}">
                        {{ $caso['status'] }}
                    </span>
                </div>
                <p class="text-slate-600">Caso ID: {{ $caso['id'] }} • {{ $caso['specialty'] }}</p>
            </div>
            <div class="flex items-center space-x-4">
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <i data-lucide="check" class="w-4 h-4 mr-2"></i>
                    Aprobar
                </button>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i data-lucide="x" class="w-4 h-4 mr-2"></i>
                    Rechazar
                </button>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                    Exportar
                </button>
            </div>
        </div>
    </div>

    <!-- Patient Information -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Basic Info -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="user" class="w-5 h-5 mr-2 text-blue-600"></i>
                    Información del Paciente
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-600">Edad</span>
                    <span class="font-semibold text-slate-800">{{ $caso['age'] }} años</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-600">Fecha de Ingreso</span>
                    <span class="font-semibold text-slate-800">{{ $caso['date'] }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-600">Tiempo Transcurrido</span>
                    <span class="font-semibold text-slate-800">{{ $caso['time_elapsed'] }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-600">Especialidad</span>
                    <span class="font-semibold text-slate-800">{{ $caso['specialty'] }}</span>
                </div>
            </div>
        </div>

        <!-- Referring Info -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="hospital" class="w-5 h-5 mr-2 text-green-600"></i>
                    Hospital de Origen
                </h3>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <span class="text-sm font-medium text-slate-600">Hospital</span>
                    <p class="font-semibold text-slate-800">{{ $caso['referring_hospital'] }}</p>
                </div>
                <div>
                    <span class="text-sm font-medium text-slate-600">Médico Referente</span>
                    <p class="font-semibold text-slate-800">{{ $caso['referring_physician'] }}</p>
                </div>
            </div>
        </div>

        <!-- Vital Signs -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="activity" class="w-5 h-5 mr-2 text-red-600"></i>
                    Signos Vitales
                </h3>
            </div>
            <div class="p-6">
                <p class="text-sm text-slate-700">{{ $caso['vital_signs'] }}</p>
            </div>
        </div>
    </div>

    <!-- Medical Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chief Complaint -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="clipboard" class="w-5 h-5 mr-2 text-purple-600"></i>
                    Motivo de Consulta
                </h3>
            </div>
            <div class="p-6">
                <p class="text-slate-700">{{ $caso['chief_complaint'] }}</p>
            </div>
        </div>

        <!-- Diagnosis -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="stethoscope" class="w-5 h-5 mr-2 text-indigo-600"></i>
                    Diagnóstico
                </h3>
            </div>
            <div class="p-6">
                <p class="text-slate-700 font-medium">{{ $caso['diagnosis'] }}</p>
            </div>
        </div>

        <!-- Medical History -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="clock" class="w-5 h-5 mr-2 text-orange-600"></i>
                    Antecedentes Médicos
                </h3>
            </div>
            <div class="p-6">
                <p class="text-slate-700">{{ $caso['medical_history'] }}</p>
            </div>
        </div>

        <!-- Current Medications -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="pill" class="w-5 h-5 mr-2 text-green-600"></i>
                    Medicamentos Actuales
                </h3>
            </div>
            <div class="p-6">
                <p class="text-slate-700">{{ $caso['current_medications'] }}</p>
            </div>
        </div>
    </div>

    <!-- Clinical Findings -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                <i data-lucide="search" class="w-5 h-5 mr-2 text-blue-600"></i>
                Examen Físico
            </h3>
        </div>
        <div class="p-6">
            <p class="text-slate-700">{{ $caso['physical_examination'] }}</p>
        </div>
    </div>

    <!-- Laboratory and Imaging -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Laboratory Results -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="flask-conical" class="w-5 h-5 mr-2 text-purple-600"></i>
                    Resultados de Laboratorio
                </h3>
            </div>
            <div class="p-6">
                <p class="text-slate-700">{{ $caso['laboratory_results'] }}</p>
            </div>
        </div>

        <!-- Imaging Studies -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <div class="p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                    <i data-lucide="scan" class="w-5 h-5 mr-2 text-indigo-600"></i>
                    Estudios de Imagen
                </h3>
            </div>
            <div class="p-6">
                <p class="text-slate-700">{{ $caso['imaging_studies'] }}</p>
            </div>
        </div>
    </div>

    <!-- Treatment Plan -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                <i data-lucide="clipboard-list" class="w-5 h-5 mr-2 text-green-600"></i>
                Plan de Tratamiento
            </h3>
        </div>
        <div class="p-6">
            <p class="text-slate-700">{{ $caso['treatment_plan'] }}</p>
        </div>
    </div>

    <!-- Notes and Comments -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                <i data-lucide="message-square" class="w-5 h-5 mr-2 text-orange-600"></i>
                Notas y Comentarios
            </h3>
        </div>
        <div class="p-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p class="text-yellow-800">{{ $caso['notes'] }}</p>
            </div>
            
            <!-- Add Comment Form -->
            <div class="mt-6">
                <label class="block text-sm font-medium text-slate-700 mb-2">Agregar Comentario</label>
                <textarea rows="3" 
                          placeholder="Escriba su comentario o evaluación..."
                          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                <div class="mt-3 flex justify-end space-x-3">
                    <button class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                        Cancelar
                    </button>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Agregar Comentario
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <a href="{{ route('medico.casos') }}" class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                    Volver a Casos
                </a>
            </div>
            <div class="flex items-center space-x-4">
                <button class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i data-lucide="x-circle" class="w-4 h-4 mr-2"></i>
                    Rechazar Caso
                </button>
                <button class="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    <i data-lucide="clock" class="w-4 h-4 mr-2"></i>
                    Solicitar Información
                </button>
                <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <i data-lucide="check-circle" class="w-4 h-4 mr-2"></i>
                    Aprobar Referencia
                </button>
            </div>
        </div>
    </div>
</div>
@endsection
