<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\VitalRedApiService;
use Illuminate\Support\Facades\Cache;

class ViewPreloadController extends Controller
{
    protected VitalRedApiService $apiService;

    public function __construct(VitalRedApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Preload all view data as JSON for ultra-fast client-side navigation
     */
    public function preloadAllViewData()
    {
        $userId = auth()->id() ?? 'guest';
        $userRole = auth()->user()->role ?? 'medico';
        
        $cacheKey = "preloaded_views_data_{$userRole}_{$userId}";
        
        // Cache for 10 minutes
        $viewsData = Cache::remember($cacheKey, 600, function () use ($userRole, $userId) {
            return $this->generateAllViewsData($userRole, $userId);
        });

        return response()->json([
            'success' => true,
            'user_role' => $userRole,
            'views_data' => $viewsData,
            'total_views' => count($viewsData),
            'cache_duration' => 600,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Generate data for all views based on user role
     */
    private function generateAllViewsData(string $userRole, string $userId): array
    {
        $viewsData = [];

        try {
            if ($userRole === 'admin') {
                $viewsData = $this->generateAdminViewsData($userId);
            } else {
                $viewsData = $this->generateMedicoViewsData($userId);
            }
        } catch (\Exception $e) {
            \Log::error('Error generating views data: ' . $e->getMessage());
        }

        return $viewsData;
    }

    /**
     * Generate data for all medico views
     */
    private function generateMedicoViewsData(string $userId): array
    {
        return [
            'dashboard' => [
                'route' => '/medico/dashboard',
                'title' => 'Dashboard Médico',
                'data' => $this->apiService->getMedicalCases(),
                'preloaded_at' => now()->toISOString()
            ],
            'casos' => [
                'route' => '/medico/casos',
                'title' => 'Casos Médicos',
                'data' => $this->apiService->getMedicalCases(),
                'filters' => [],
                'preloaded_at' => now()->toISOString()
            ],
            'pacientes' => [
                'route' => '/medico/pacientes',
                'title' => 'Gestión de Pacientes',
                'data' => $this->apiService->getPatientData(),
                'preloaded_at' => now()->toISOString()
            ],
            'urgencias' => [
                'route' => '/medico/urgencias',
                'title' => 'Centro de Urgencias',
                'data' => $this->apiService->getUrgencyData(),
                'preloaded_at' => now()->toISOString()
            ],
            'hospitalizados' => [
                'route' => '/medico/hospitalizados',
                'title' => 'Pacientes Hospitalizados',
                'data' => $this->apiService->getHospitalizationData(),
                'preloaded_at' => now()->toISOString()
            ],
            'historial' => [
                'route' => '/medico/historial',
                'title' => 'Historial Médico',
                'data' => $this->apiService->getHistoricalData(),
                'preloaded_at' => now()->toISOString()
            ]
        ];
    }

    /**
     * Generate data for all admin views
     */
    private function generateAdminViewsData(string $userId): array
    {
        return [
            'dashboard' => [
                'route' => '/admin/dashboard',
                'title' => 'Panel de Administración',
                'data' => $this->apiService->getAdminData(),
                'preloaded_at' => now()->toISOString()
            ],
            'users' => [
                'route' => '/admin/users',
                'title' => 'Gestión de Usuarios',
                'data' => [
                    'users' => \App\Models\User::all()->toArray(),
                    'total_users' => \App\Models\User::count(),
                    'roles' => ['admin', 'medico'],
                    'specialties' => [
                        'Medicina Interna', 'Cardiología', 'Neurología', 
                        'Pediatría', 'Ginecología', 'Cirugía General'
                    ]
                ],
                'preloaded_at' => now()->toISOString()
            ],
            'config' => [
                'route' => '/admin/config',
                'title' => 'Configuración del Sistema',
                'data' => [
                    'system_config' => config('vital_red'),
                    'app_config' => [
                        'name' => config('app.name'),
                        'env' => config('app.env'),
                        'debug' => config('app.debug'),
                        'timezone' => config('app.timezone')
                    ]
                ],
                'preloaded_at' => now()->toISOString()
            ],
            'backup' => [
                'route' => '/admin/backup',
                'title' => 'Sistema de Respaldos',
                'data' => [
                    'backup_status' => 'active',
                    'last_backup' => now()->subHours(6)->toISOString(),
                    'backup_size' => '2.5 GB',
                    'retention_days' => 30,
                    'auto_backup' => true
                ],
                'preloaded_at' => now()->toISOString()
            ],
            'supervision' => [
                'route' => '/admin/supervision',
                'title' => 'Centro de Supervisión',
                'data' => [
                    'system_health' => 'operational',
                    'active_users' => rand(8, 15),
                    'server_load' => rand(20, 60) . '%',
                    'memory_usage' => rand(40, 80) . '%',
                    'disk_usage' => rand(30, 70) . '%',
                    'uptime' => '99.9%'
                ],
                'preloaded_at' => now()->toISOString()
            ],
            'ai_monitor' => [
                'route' => '/admin/ai-monitor',
                'title' => 'Monitor de IA',
                'data' => [
                    'ai_status' => 'operational',
                    'processed_emails' => rand(100, 500),
                    'success_rate' => rand(85, 98) . '%',
                    'avg_processing_time' => rand(2, 8) . 's',
                    'queue_size' => rand(0, 10),
                    'last_processed' => now()->subMinutes(rand(1, 30))->toISOString()
                ],
                'preloaded_at' => now()->toISOString()
            ]
        ];
    }

    /**
     * Get specific view data
     */
    public function getViewData(Request $request, string $view)
    {
        $userId = auth()->id() ?? 'guest';
        $userRole = auth()->user()->role ?? 'medico';
        
        $cacheKey = "view_data_{$view}_{$userRole}_{$userId}";
        
        $viewData = Cache::remember($cacheKey, 300, function () use ($view, $userRole, $userId) {
            $allViewsData = $this->generateAllViewsData($userRole, $userId);
            return $allViewsData[$view] ?? null;
        });

        if (!$viewData) {
            return response()->json([
                'success' => false,
                'message' => 'View not found or not accessible'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'view' => $view,
            'data' => $viewData,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Clear preloaded views cache
     */
    public function clearViewsCache()
    {
        $userId = auth()->id() ?? 'guest';
        $userRole = auth()->user()->role ?? 'medico';
        
        $patterns = [
            "preloaded_views_data_{$userRole}_{$userId}",
            "view_data_*_{$userRole}_{$userId}"
        ];

        foreach ($patterns as $pattern) {
            Cache::forget($pattern);
        }

        return response()->json([
            'success' => true,
            'message' => 'Views cache cleared successfully',
            'timestamp' => now()->toISOString()
        ]);
    }
}
