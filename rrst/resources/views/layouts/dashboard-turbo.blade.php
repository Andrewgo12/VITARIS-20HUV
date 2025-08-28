@extends('layouts.app')

@section('content')
<div class="flex h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50" id="dashboard-container">
    <!-- Sidebar - Cached and Optimized -->
    <aside id="sidebar-container" class="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 flex-shrink-0">
        @include('components.sidebar-turbo')
    </aside>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header - Cached and Optimized -->
        <header id="header-container" class="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
            @include('components.header-turbo')
        </header>
        
        <!-- Page Content - This is what changes instantly -->
        <main id="main-content" class="flex-1 overflow-y-auto p-6 transition-opacity duration-150">
            @yield('page-content')
        </main>
    </div>
</div>

<!-- Preload critical CSS for instant rendering -->
<style>
/* Critical CSS inlined for instant rendering */
#dashboard-container {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #d1fae5 100%);
}

#sidebar-container {
    width: 16rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-right: 1px solid #e2e8f0;
    flex-shrink: 0;
}

#header-container {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 1.5rem;
}

#main-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    transition: opacity 0.15s ease;
}

/* Optimize animations for 60fps */
* {
    will-change: auto;
}

.nav-link {
    transition: all 0.2s ease;
    transform: translateZ(0); /* Force GPU acceleration */
}

.nav-link:hover {
    transform: translateY(-1px) translateZ(0);
}

/* Preload hover states */
.nav-link.active {
    background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Optimize scrolling */
#main-content {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
}

/* Reduce layout shifts */
.sidebar-item {
    min-height: 3rem;
    display: flex;
    align-items: center;
}

/* Critical loading states */
.loading-content {
    opacity: 0.6;
    pointer-events: none;
}

.loaded-content {
    opacity: 1;
    pointer-events: auto;
}
</style>

<!-- Preload JavaScript for instant interactions -->
<script>
// Critical JavaScript inlined for instant execution
document.addEventListener('DOMContentLoaded', function() {
    // Optimize sidebar interactions
    const sidebarLinks = document.querySelectorAll('.nav-link');
    sidebarLinks.forEach(link => {
        // Preload hover effects
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px) translateZ(0)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) translateZ(0)';
            }
        });
    });
    
    // Optimize main content scrolling
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        // Enable smooth scrolling with momentum
        mainContent.style.webkitOverflowScrolling = 'touch';
        
        // Optimize scroll performance
        let ticking = false;
        mainContent.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    // Scroll optimizations can go here
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // Preload critical resources
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
    });
    
    // Mark layout as loaded
    document.body.classList.add('layout-loaded');
    
    console.log('⚡ TURBO Layout loaded and optimized');
});

// Optimize layout rendering
function optimizeLayoutRendering() {
    // Force layout calculation to prevent reflows
    const sidebar = document.getElementById('sidebar-container');
    const header = document.getElementById('header-container');
    const main = document.getElementById('main-content');
    
    if (sidebar && header && main) {
        // Pre-calculate dimensions
        const sidebarWidth = sidebar.offsetWidth;
        const headerHeight = header.offsetHeight;
        
        // Store for instant access
        window.layoutDimensions = {
            sidebarWidth,
            headerHeight,
            mainContentHeight: window.innerHeight - headerHeight
        };
        
        console.log('⚡ Layout dimensions cached for instant access');
    }
}

// Run optimization after layout is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeLayoutRendering);
} else {
    optimizeLayoutRendering();
}
</script>
@endsection
