@php
    $userRole = auth()->user()->role ?? 'medico';
    $userName = auth()->user()->name ?? ($userRole === 'admin' ? 'Administrador Sistema' : 'Dr. Médico Evaluador');

    // Determine page title based on current route
    $routeName = request()->route()->getName();
    $pageTitle = match($routeName) {
        'medico.dashboard' => 'Dashboard Médico',
        'medico.casos' => 'Casos Médicos',
        'medico.casos.detail' => 'Detalle del Caso',
        'medico.pacientes' => 'Gestión de Pacientes',
        'medico.urgencias' => 'Centro de Urgencias',
        'medico.hospitalizados' => 'Pacientes Hospitalizados',
        'medico.historial' => 'Historial Médico',
        'admin.dashboard' => 'Panel de Administración',
        'admin.users' => 'Gestión de Usuarios',
        'admin.config' => 'Configuración del Sistema',
        'admin.backup' => 'Sistema de Respaldos',
        'admin.supervision' => 'Centro de Supervisión',
        'admin.ai-monitor' => 'Monitor de IA',
        default => 'Dashboard'
    };
@endphp

<header class="flex h-16 items-center justify-between px-6 bg-white/80 backdrop-blur-sm border-b border-slate-200">
    <div>
        <h1 class="text-xl font-semibold text-slate-800">{{ $pageTitle }}</h1>
    </div>

    <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <div class="relative" x-data="{ open: false }">
            <button @click="open = !open"
                    class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <i data-lucide="bell" class="w-5 h-5"></i>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Notifications Dropdown -->
            <div x-show="open"
                 x-transition
                 @click.away="open = false"
                 class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div class="p-4 border-b border-slate-200">
                    <h3 class="text-sm font-medium text-slate-900">Notificaciones</h3>
                </div>
                <div class="max-h-64 overflow-y-auto">
                    <div class="p-4 hover:bg-slate-50 border-b border-slate-100">
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div class="flex-1">
                                <p class="text-sm text-slate-900">Nuevo caso médico asignado</p>
                                <p class="text-xs text-slate-500 mt-1">Hace 5 minutos</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 hover:bg-slate-50 border-b border-slate-100">
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div class="flex-1">
                                <p class="text-sm text-slate-900">Caso evaluado exitosamente</p>
                                <p class="text-xs text-slate-500 mt-1">Hace 15 minutos</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 hover:bg-slate-50">
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                            <div class="flex-1">
                                <p class="text-sm text-slate-900">Recordatorio: Revisión pendiente</p>
                                <p class="text-xs text-slate-500 mt-1">Hace 1 hora</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-3 border-t border-slate-200">
                    <button class="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Ver todas las notificaciones
                    </button>
                </div>
            </div>
        </div>

        <!-- User Menu -->
        <div class="relative" x-data="{ open: false }">
            <button @click="open = !open"
                    class="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-4 h-4 text-white"></i>
                </div>
                <span class="text-sm font-medium">{{ $userName }}</span>
                <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </button>

            <!-- User Dropdown -->
            <div x-show="open"
                 x-transition
                 @click.away="open = false"
                 class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div class="p-2">
                    <a href="#" class="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                        <i data-lucide="user" class="w-4 h-4 mr-2"></i>
                        Perfil
                    </a>
                    <a href="#" class="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                        <i data-lucide="settings" class="w-4 h-4 mr-2"></i>
                        Configuración
                    </a>
                    <hr class="my-2">
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                            <i data-lucide="log-out" class="w-4 h-4 mr-2"></i>
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</header>
