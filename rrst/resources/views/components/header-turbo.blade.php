@php
    $user = auth()->user();
    $currentTime = now()->format('H:i');
    $currentDate = now()->format('d/m/Y');
    
    // Cache header data for ultra-fast rendering
    $cacheKey = "header_data_" . ($user->id ?? 'guest');
    $headerData = Cache::remember($cacheKey, 1800, function () use ($user, $currentTime, $currentDate) {
        return [
            'user_name' => $user->name ?? 'Usuario',
            'user_role' => $user->role ?? 'medico',
            'user_email' => $user->email ?? 'email@hospital.com',
            'time' => $currentTime,
            'date' => $currentDate,
            'greeting' => now()->hour < 12 ? 'Buenos días' : (now()->hour < 18 ? 'Buenas tardes' : 'Buenas noches')
        ];
    });
@endphp

<!-- Header Content - Optimized for Speed -->
<div class="flex items-center justify-between">
    <!-- Left Section - Page Title and Breadcrumb -->
    <div class="flex items-center space-x-4">
        <!-- Dynamic Page Title -->
        <div>
            <h2 id="page-title" class="text-2xl font-bold text-slate-800 font-manrope">
                @yield('page-title', 'Dashboard')
            </h2>
            <nav id="breadcrumb" class="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                <span>VITAL RED</span>
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span id="current-section">{{ ucfirst($headerData['user_role']) }}</span>
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                <span id="current-page" class="text-slate-700 font-medium">Dashboard</span>
            </nav>
        </div>
    </div>

    <!-- Right Section - User Info and Actions -->
    <div class="flex items-center space-x-4">
        <!-- System Status Indicator -->
        <div class="hidden md:flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-green-700">Sistema Operativo</span>
        </div>

        <!-- Time and Date -->
        <div class="hidden lg:flex flex-col items-end text-sm">
            <div class="text-slate-700 font-medium" id="current-time">{{ $headerData['time'] }}</div>
            <div class="text-slate-500" id="current-date">{{ $headerData['date'] }}</div>
        </div>

        <!-- Notifications -->
        <div class="relative">
            <button class="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                    title="Notificaciones">
                <i data-lucide="bell" class="w-5 h-5"></i>
                <!-- Notification Badge -->
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                </span>
            </button>
        </div>

        <!-- User Menu -->
        <div class="relative" x-data="{ open: false }">
            <button @click="open = !open" 
                    class="flex items-center space-x-3 p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                <!-- User Avatar -->
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-semibold">
                        {{ strtoupper(substr($headerData['user_name'], 0, 1)) }}
                    </span>
                </div>
                
                <!-- User Info -->
                <div class="hidden md:block text-left">
                    <div class="text-sm font-medium">{{ $headerData['greeting'] }}</div>
                    <div class="text-xs text-slate-500">{{ $headerData['user_name'] }}</div>
                </div>
                
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-200" 
                   :class="{ 'rotate-180': open }"></i>
            </button>

            <!-- Dropdown Menu -->
            <div x-show="open" 
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-1 scale-100"
                 x-transition:leave="transition ease-in duration-150"
                 x-transition:leave-start="opacity-1 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                 @click.away="open = false"
                 class="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                
                <!-- User Info -->
                <div class="p-4 border-b border-slate-200">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-semibold">
                                {{ strtoupper(substr($headerData['user_name'], 0, 1)) }}
                            </span>
                        </div>
                        <div>
                            <div class="font-medium text-slate-900">{{ $headerData['user_name'] }}</div>
                            <div class="text-sm text-slate-500">{{ $headerData['user_email'] }}</div>
                            <div class="text-xs text-slate-400 capitalize">{{ $headerData['user_role'] }}</div>
                        </div>
                    </div>
                </div>

                <!-- Menu Items -->
                <div class="py-2">
                    <a href="#" class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <i data-lucide="user" class="w-4 h-4 mr-3"></i>
                        Mi Perfil
                    </a>
                    <a href="#" class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <i data-lucide="settings" class="w-4 h-4 mr-3"></i>
                        Configuración
                    </a>
                    <a href="#" class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <i data-lucide="help-circle" class="w-4 h-4 mr-3"></i>
                        Ayuda
                    </a>
                    <div class="border-t border-slate-200 my-2"></div>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <i data-lucide="log-out" class="w-4 h-4 mr-3"></i>
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Inline CSS for instant rendering -->
<style>
/* Critical header styles for instant rendering */
#page-title {
    transition: opacity 0.15s ease;
}

#breadcrumb {
    transition: opacity 0.15s ease;
}

/* Optimize dropdown animations */
[x-cloak] {
    display: none !important;
}

/* Notification badge animation */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Optimize button interactions */
button {
    transform: translateZ(0); /* GPU acceleration */
    backface-visibility: hidden;
}

/* Reduce layout shifts */
.user-menu {
    min-width: 16rem;
}

/* Time update animation */
#current-time {
    transition: opacity 0.3s ease;
}

#current-date {
    transition: opacity 0.3s ease;
}
</style>

<!-- Inline JavaScript for instant interactions -->
<script>
// Optimize header interactions immediately
(function() {
    // Update time every minute
    function updateTime() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('es-ES');
        }
    }
    
    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
    
    // Optimize page title updates for SPA navigation
    window.updatePageTitle = function(title, section) {
        const titleElement = document.getElementById('page-title');
        const sectionElement = document.getElementById('current-page');
        
        if (titleElement && title) {
            titleElement.style.opacity = '0.5';
            setTimeout(() => {
                titleElement.textContent = title;
                titleElement.style.opacity = '1';
            }, 75);
        }
        
        if (sectionElement && section) {
            sectionElement.style.opacity = '0.5';
            setTimeout(() => {
                sectionElement.textContent = section;
                sectionElement.style.opacity = '1';
            }, 75);
        }
    };
    
    console.log('⚡ Header optimized for instant interactions');
})();
</script>
