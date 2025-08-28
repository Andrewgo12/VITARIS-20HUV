@php
    $user = auth()->user();
    $userRole = $user->role ?? 'medico';
    $currentRoute = request()->route()->getName();
    
    // Cache menu items for ultra-fast rendering
    $cacheKey = "sidebar_menu_{$userRole}";
    $menuItems = Cache::remember($cacheKey, 3600, function () use ($userRole) {
        if ($userRole === 'admin') {
            return [
                [
                    'name' => 'Dashboard',
                    'href' => 'admin.dashboard',
                    'icon' => 'layout-dashboard',
                    'route' => '/admin/dashboard'
                ],
                [
                    'name' => 'Usuarios',
                    'href' => 'admin.users',
                    'icon' => 'users',
                    'route' => '/admin/users'
                ],
                [
                    'name' => 'Configuración',
                    'href' => 'admin.config',
                    'icon' => 'settings',
                    'route' => '/admin/config'
                ],
                [
                    'name' => 'Respaldos',
                    'href' => 'admin.backup',
                    'icon' => 'database',
                    'route' => '/admin/backup'
                ],
                [
                    'name' => 'Supervisión',
                    'href' => 'admin.supervision',
                    'icon' => 'monitor',
                    'route' => '/admin/supervision'
                ],
                [
                    'name' => 'Monitor IA',
                    'href' => 'admin.ai-monitor',
                    'icon' => 'brain',
                    'route' => '/admin/ai-monitor'
                ]
            ];
        } else {
            return [
                [
                    'name' => 'Dashboard',
                    'href' => 'medico.dashboard',
                    'icon' => 'layout-dashboard',
                    'route' => '/medico/dashboard'
                ],
                [
                    'name' => 'Casos Médicos',
                    'href' => 'medico.casos',
                    'icon' => 'file-medical',
                    'route' => '/medico/casos'
                ],
                [
                    'name' => 'Pacientes',
                    'href' => 'medico.pacientes',
                    'icon' => 'users',
                    'route' => '/medico/pacientes'
                ],
                [
                    'name' => 'Urgencias',
                    'href' => 'medico.urgencias',
                    'icon' => 'alert-triangle',
                    'route' => '/medico/urgencias'
                ],
                [
                    'name' => 'Hospitalizados',
                    'href' => 'medico.hospitalizados',
                    'icon' => 'bed',
                    'route' => '/medico/hospitalizados'
                ],
                [
                    'name' => 'Historial',
                    'href' => 'medico.historial',
                    'icon' => 'history',
                    'route' => '/medico/historial'
                ]
            ];
        }
    });
@endphp

<!-- Sidebar Content - Optimized for Speed -->
<div class="flex flex-col h-full">
    <!-- Logo Section - Cached -->
    <div class="flex items-center justify-center p-6 border-b border-slate-200">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <i data-lucide="heart-pulse" class="w-6 h-6 text-white"></i>
            </div>
            <div>
                <h1 class="text-xl font-bold text-slate-800 font-manrope">VITAL RED</h1>
                <p class="text-xs text-slate-500 uppercase tracking-wide">{{ $userRole === 'admin' ? 'Administrador' : 'Médico' }}</p>
            </div>
        </div>
    </div>

    <!-- Navigation Menu - Ultra Optimized -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        @foreach($menuItems as $item)
            @php
                $isActive = $currentRoute === $item['href'] || request()->is(ltrim($item['route'], '/'));
            @endphp
            
            <a href="{{ route($item['href']) }}"
               class="nav-link sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      {{ $isActive
                         ? 'active bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                         : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' }}"
               data-route="{{ $item['route'] }}"
               data-preload="true">
                
                <i data-lucide="{{ $item['icon'] }}" class="w-5 h-5 mr-3 flex-shrink-0"></i>
                <span class="truncate">{{ $item['name'] }}</span>
                
                @if($isActive)
                    <div class="ml-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
                @endif
            </a>
        @endforeach
    </nav>

    <!-- User Info Section - Cached -->
    <div class="p-4 border-t border-slate-200">
        <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">
                    {{ strtoupper(substr($user->name ?? 'U', 0, 1)) }}
                </span>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 truncate">{{ $user->name ?? 'Usuario' }}</p>
                <p class="text-xs text-slate-500 truncate">{{ $user->email ?? 'email@hospital.com' }}</p>
            </div>
        </div>
        
        <!-- Logout Button -->
        <form method="POST" action="{{ route('logout') }}" class="mt-3">
            @csrf
            <button type="submit" 
                    class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 transition-colors duration-200">
                <i data-lucide="log-out" class="w-4 h-4 mr-2"></i>
                Cerrar Sesión
            </button>
        </form>
    </div>
</div>

<!-- Inline CSS for instant rendering -->
<style>
/* Critical sidebar styles for instant rendering */
.nav-link {
    transform: translateZ(0); /* GPU acceleration */
    backface-visibility: hidden;
}

.nav-link:hover {
    transform: translateY(-1px) translateZ(0);
}

.nav-link.active {
    transform: translateY(0) translateZ(0);
}

/* Optimize scrolling */
nav {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}

nav::-webkit-scrollbar {
    width: 4px;
}

nav::-webkit-scrollbar-track {
    background: transparent;
}

nav::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
}

/* Preload states */
.sidebar-item {
    min-height: 3rem;
    will-change: transform, background-color;
}

/* Reduce layout shifts */
.sidebar-item i {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
}
</style>

<!-- Inline JavaScript for instant interactions -->
<script>
// Optimize sidebar interactions immediately
(function() {
    // Cache DOM queries
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Optimize hover effects
    navLinks.forEach(link => {
        // Preload hover state
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-1px) translateZ(0)';
            }
        }, { passive: true });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) translateZ(0)';
            }
        }, { passive: true });
    });
    
    console.log('⚡ Sidebar optimized for instant interactions');
})();
</script>
