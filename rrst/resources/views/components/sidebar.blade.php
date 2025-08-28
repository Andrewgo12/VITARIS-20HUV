@php
    $userRole = auth()->user()->role ?? 'medico';
    $currentRoute = request()->route()->getName();

    $medicoNavItems = [
        ['href' => 'medico.dashboard', 'label' => 'Dashboard', 'icon' => 'activity'],
        ['href' => 'medico.casos', 'label' => 'Casos Médicos', 'icon' => 'file-text'],
        ['href' => 'medico.pacientes', 'label' => 'Pacientes', 'icon' => 'users'],
        ['href' => 'medico.urgencias', 'label' => 'Urgencias', 'icon' => 'alert-triangle'],
        ['href' => 'medico.hospitalizados', 'label' => 'Hospitalizados', 'icon' => 'bed'],
        ['href' => 'medico.historial', 'label' => 'Historial', 'icon' => 'clock'],
    ];

    $adminNavItems = [
        ['href' => 'admin.dashboard', 'label' => 'Dashboard', 'icon' => 'bar-chart-3'],
        ['href' => 'admin.users', 'label' => 'Usuarios', 'icon' => 'users'],
        ['href' => 'admin.supervision', 'label' => 'Supervisión', 'icon' => 'eye'],
        ['href' => 'admin.ai-monitor', 'label' => 'Monitor IA', 'icon' => 'brain'],
        ['href' => 'admin.config', 'label' => 'Configuración', 'icon' => 'settings'],
        ['href' => 'admin.backup', 'label' => 'Respaldos', 'icon' => 'hard-drive'],
    ];

    $navItems = $userRole === 'admin' ? $adminNavItems : $medicoNavItems;
@endphp

<aside class="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 shadow-lg"
       x-data="{ mobileOpen: false }"
       x-init="$nextTick(() => lucide.createIcons())">
    <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 px-4 border-b border-slate-200">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <i data-lucide="heart-pulse" class="w-5 h-5 text-white"></i>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-slate-800 font-manrope">VITAL RED</h1>
                    <p class="text-xs text-slate-500">Hospital System</p>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
            @foreach($navItems as $item)
                @php
                    $isActive = str_starts_with($currentRoute, $item['href']);
                @endphp
                <a href="{{ route($item['href']) }}"
                   class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                          {{ $isActive
                             ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                             : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' }}"
                   onmouseenter="preloadViewOnHover('{{ route($item['href']) }}')"
                   data-route="{{ route($item['href']) }}">
                    <i data-lucide="{{ $item['icon'] }}"
                       class="w-5 h-5 mr-3 {{ $isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600' }}"></i>
                    {{ $item['label'] }}
                </a>
            @endforeach
        </nav>

        <!-- User Info -->
        <div class="px-4 py-4 border-t border-slate-200">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-5 h-5 text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 truncate">
                        {{ auth()->user()->name }}
                    </p>
                    <p class="text-xs text-slate-500 truncate">
                        {{ $userRole === 'admin' ? 'Administrador' : 'Médico Evaluador' }}
                    </p>
                </div>
            </div>

            <!-- Logout Button -->
            <form method="POST" action="{{ route('logout') }}" class="mt-3">
                @csrf
                <button type="submit"
                        class="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <i data-lucide="log-out" class="w-4 h-4 mr-2"></i>
                    Cerrar Sesión
                </button>
            </form>
        </div>
    </div>
</aside>
