<!DOCTYPE html>
<html lang="es" class="antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'VITAL RED - Hospital Referral System')</title>

    <!-- Preload critical resources -->
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link rel="preconnect" href="https://cdn.tailwindcss.com" crossorigin>
    <link rel="preconnect" href="https://unpkg.com" crossorigin>

    <!-- Fonts with display=swap for faster loading -->
    <link href="https://fonts.bunny.net/css?family=geist:400,500,600,700&family=manrope:400,500,600,700&display=swap" rel="stylesheet" />

    <!-- Tailwind CSS - Load synchronously to prevent layout issues -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        // Tailwind CSS configuration
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'geist': ['Geist', 'system-ui', 'sans-serif'],
                        'manrope': ['Manrope', 'system-ui', 'sans-serif'],
                    },
                    backdropBlur: {
                        'xs': '2px',
                    }
                }
            }
        }
    </script>

    <!-- Lucide Icons with defer -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js" defer></script>

    <!-- Alpine.js with defer -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        :root {
            --font-geist: 'Geist', system-ui, sans-serif;
            --font-manrope: 'Manrope', system-ui, sans-serif;
        }

        body {
            font-family: var(--font-geist);
        }

        .font-manrope {
            font-family: var(--font-manrope);
        }

        /* Ensure proper loading and display */
        .bg-white\/80 {
            background-color: rgba(255, 255, 255, 0.8);
        }

        .backdrop-blur-sm {
            backdrop-filter: blur(4px);
        }

        /* Loading state to prevent flash of unstyled content */
        [x-cloak] {
            display: none !important;
        }

        /* Loading spinner */
        .loading-spinner {
            border: 3px solid #f3f4f6;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Page transition */
        .page-transition {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .page-transition.loaded {
            opacity: 1;
            transform: translateY(0);
        }

        /* Smooth transitions */
        * {
            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
        }
    </style>

    @stack('styles')
</head>
<body class="bg-gradient-to-br from-blue-50 via-white to-emerald-50 min-h-screen">
    <div id="app">
        @yield('content')
    </div>

    <!-- Toast Notifications -->
    <div id="toast-container" class="fixed top-4 right-4 z-50 space-y-2"></div>

    @stack('scripts')

    <script>
        // Initialize Lucide icons when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Preload data for faster navigation
            @auth
            preloadSystemData();
            @endauth
        });

        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // INSTANT NAVIGATION SYSTEM - TRUE SPA EXPERIENCE
        let preloadedViews = {};
        let preloadInProgress = false;
        let currentUserRole = '{{ auth()->user()->role ?? "medico" }}';

        async function preloadSystemData() {
            if (preloadInProgress) return;
            preloadInProgress = true;

            try {
                console.log('🚀 INSTANT NAVIGATION: Preloading all views...');

                // Preload all view contents for instant navigation
                const response = await fetch('/ajax/preload-all', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();

                    // Store ALL view contents in memory for instant access
                    preloadedViews = result.views || {};

                    console.log('✅ INSTANT NAVIGATION READY:');
                    console.log(`   📱 Views preloaded: ${result.total_preloaded} views`);
                    console.log(`   🎯 User role: ${result.user_role}`);
                    console.log('   ⚡ Navigation will be INSTANT');

                    // Enable instant navigation
                    enableInstantNavigation();

                    // Show success notification
                    setTimeout(() => {
                        showToast(`⚡ INSTANT MODE: ${result.total_preloaded} vistas listas`, 'success');
                    }, 1000);

                } else {
                    console.warn('⚠️ Preload failed, using standard navigation');
                    enableInstantNavigation(); // Still enable for fallback
                }
            } catch (error) {
                console.warn('⚠️ Preload error:', error.message);
                enableInstantNavigation(); // Still enable for fallback
            } finally {
                preloadInProgress = false;
            }
        }

        // Enable INSTANT navigation using preloaded content
        function enableInstantNavigation() {
            // Intercept ALL navigation clicks for instant response
            document.addEventListener('click', function(e) {
                const link = e.target.closest('a[href]');
                if (!link) return;

                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#') || href === window.location.pathname) return;

                // Prevent default navigation
                e.preventDefault();

                // Navigate instantly
                const viewKey = getViewKeyFromRoute(href);
                navigateInstantly(href, viewKey);
            });

            console.log('⚡ INSTANT navigation enabled - ALL clicks intercepted');
        }

        // Get view key from route
        function getViewKeyFromRoute(route) {
            const routeMap = {
                '/medico/dashboard': 'dashboard',
                '/medico/casos': 'casos',
                '/medico/pacientes': 'pacientes',
                '/medico/urgencias': 'urgencias',
                '/medico/hospitalizados': 'hospitalizados',
                '/medico/historial': 'historial',
                '/admin/dashboard': 'dashboard',
                '/admin/users': 'users',
                '/admin/config': 'config',
                '/admin/backup': 'backup',
                '/admin/supervision': 'supervision',
                '/admin/ai-monitor': 'ai_monitor'
            };
            return routeMap[route];
        }

        // Navigate instantly by replacing content (TRUE SPA)
        async function navigateInstantly(route, viewKey) {
            const startTime = performance.now();
            console.log(`⚡ INSTANT NAVIGATION to ${route}`);

            try {
                let content, title;

                // Try to use preloaded content first
                if (preloadedViews[viewKey]) {
                    content = preloadedViews[viewKey].content;
                    title = preloadedViews[viewKey].title;
                    console.log(`⚡ Using preloaded content for ${viewKey}`);
                } else {
                    // Fallback: Load via AJAX (still very fast)
                    console.log(`⚡ Loading ${viewKey} via AJAX...`);
                    const response = await fetch(`/ajax/view/${currentUserRole}/${viewKey}`, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        content = data.content;
                        title = data.title;

                        // Log performance metrics
                        console.log(`⚡ AJAX load: ${data.render_time}ms render, ${data.load_time}ms total`);
                    } else {
                        throw new Error('Failed to load view');
                    }
                }

                // Replace content instantly
                replacePageContent(content, title, route);

                const endTime = performance.now();
                const loadTime = Math.round(endTime - startTime);
                console.log(`✅ INSTANT NAVIGATION completed in ${loadTime}ms`);

                // Show success feedback
                showInstantNavigationFeedback(loadTime);

            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback to standard navigation
                window.location.href = route;
            }
        }

        // Show brief loading indicator
        function showLoadingIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg';
            indicator.innerHTML = '⚡ Navegación instantánea...';
            document.body.appendChild(indicator);

            setTimeout(() => {
                if (document.body.contains(indicator)) {
                    document.body.removeChild(indicator);
                }
            }, 1000);
        }

        // Preload specific view on hover for even faster navigation
        let hoverPreloadCache = {};
        function preloadViewOnHover(route) {
            // Don't preload if already cached or if it's the current page
            if (hoverPreloadCache[route] || window.location.pathname === route) {
                return;
            }

            const viewKey = getViewKeyFromRoute(route);
            if (!viewKey || preloadedViews[viewKey]) {
                return; // Already preloaded globally
            }

            // Mark as being preloaded to avoid duplicates
            hoverPreloadCache[route] = 'loading';

            // Preload this specific view
            fetch(`/views/data/${viewKey}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    hoverPreloadCache[route] = data.data;
                    console.log(`⚡ Hover preload: ${route} ready`);
                }
            })
            .catch(error => {
                console.warn(`Hover preload failed for ${route}:`, error);
                hoverPreloadCache[route] = 'failed';
            });
        }

        // Replace page content instantly without page reload
        function replacePageContent(content, title, route) {
            // Find the main content area (the <main> element in dashboard layout)
            const mainContent = document.querySelector('main.flex-1.overflow-y-auto') || document.querySelector('main');

            if (mainContent) {
                // Add smooth transition
                mainContent.style.transition = 'opacity 0.15s ease';
                mainContent.style.opacity = '0.3';

                setTimeout(() => {
                    // Replace content instantly
                    mainContent.innerHTML = content;

                    // Update page title in browser
                    document.title = title + ' - VITAL RED';

                    // Update header title if function exists (from header-turbo)
                    if (typeof window.updatePageTitle === 'function') {
                        const pageTitle = title.replace('Dashboard ', '').replace('Gestión de ', '');
                        window.updatePageTitle(pageTitle, pageTitle);
                    }

                    // Update URL without page reload
                    history.pushState({}, title, route);

                    // Update active menu item
                    updateActiveMenuItem(route);

                    // Fade in new content
                    mainContent.style.opacity = '1';

                    // Re-initialize any JavaScript components
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }

                    // Scroll to top of main content
                    mainContent.scrollTop = 0;

                    // Remove transition after animation
                    setTimeout(() => {
                        mainContent.style.transition = '';
                    }, 150);

                }, 50); // Faster transition for better performance
            } else {
                // Fallback if main content area not found
                console.warn('Main content area not found, using standard navigation');
                window.location.href = route;
            }
        }

        // Update active menu item
        function updateActiveMenuItem(route) {
            // Remove active class from all menu items in sidebar
            document.querySelectorAll('aside a, .sidebar a').forEach(link => {
                // Remove active classes
                link.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-emerald-500', 'text-white', 'shadow-lg');
                // Add inactive classes
                link.classList.add('text-slate-700');
                if (!link.classList.contains('hover:bg-slate-100')) {
                    link.classList.add('hover:bg-slate-100', 'hover:text-slate-900');
                }
            });

            // Add active class to current menu item
            const activeLink = document.querySelector(`aside a[href="${route}"], .sidebar a[href="${route}"]`);
            if (activeLink) {
                // Remove inactive classes
                activeLink.classList.remove('text-slate-700', 'hover:bg-slate-100', 'hover:text-slate-900');
                // Add active classes
                activeLink.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-emerald-500', 'text-white', 'shadow-lg');

                console.log(`✅ Updated active menu item: ${route}`);
            } else {
                console.warn(`⚠️ Menu item not found for route: ${route}`);
            }
        }

        // Show instant navigation feedback
        function showInstantNavigationFeedback(loadTime) {
            const feedback = document.createElement('div');
            feedback.className = 'fixed bottom-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 translate-y-full opacity-0';
            feedback.innerHTML = `⚡ ${loadTime}ms`;
            document.body.appendChild(feedback);

            // Animate in
            setTimeout(() => {
                feedback.classList.remove('translate-y-full', 'opacity-0');
            }, 100);

            // Remove after 2 seconds
            setTimeout(() => {
                feedback.classList.add('translate-y-full', 'opacity-0');
                setTimeout(() => {
                    if (document.body.contains(feedback)) {
                        document.body.removeChild(feedback);
                    }
                }, 300);
            }, 2000);
        }

        // Toast notification function
        function showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');

            const bgColor = {
                'success': 'bg-green-500',
                'error': 'bg-red-500',
                'warning': 'bg-yellow-500',
                'info': 'bg-blue-500'
            }[type] || 'bg-blue-500';

            toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`;
            toast.textContent = message;

            container.appendChild(toast);

            // Animate in
            setTimeout(() => {
                toast.classList.remove('translate-x-full', 'opacity-0');
            }, 100);

            // Remove after 5 seconds
            setTimeout(() => {
                toast.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => {
                    container.removeChild(toast);
                }, 300);
            }, 5000);
        }

        // Show Laravel session messages as toasts
        @if(session('success'))
            showToast('{{ session('success') }}', 'success');
        @endif

        @if(session('error'))
            showToast('{{ session('error') }}', 'error');
        @endif

        @if(session('warning'))
            showToast('{{ session('warning') }}', 'warning');
        @endif

        @if(session('info'))
            showToast('{{ session('info') }}', 'info');
        @endif
    </script>
</body>
</html>
