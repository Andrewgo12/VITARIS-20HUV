<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\VitalRedApiService;
use Illuminate\Support\Facades\Cache;

class PreloadController extends Controller
{
    protected VitalRedApiService $apiService;

    public function __construct(VitalRedApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Preload all data AND views for ultra-fast navigation
     */
    public function preloadAllData()
    {
        $userId = auth()->id() ?? 'guest';
        $userRole = auth()->user()->role ?? 'medico';
        $data = [];

        try {
            // Preload all data
            $data['medical_cases'] = $this->preloadMedicalCases($userId);
            $data['patient_data'] = $this->preloadPatientData($userId);
            $data['urgency_data'] = $this->preloadUrgencyData($userId);
            $data['hospitalization_data'] = $this->preloadHospitalizationData($userId);
            $data['historical_data'] = $this->preloadHistoricalData($userId);

            // Preload admin data if user is admin
            if ($userRole === 'admin') {
                $data['admin_data'] = $this->preloadAdminData($userId);
            }

            // Preload view content for ultra-fast navigation
            $data['preloaded_views'] = $this->preloadAllViews($userRole, $userId);

            return response()->json([
                'success' => true,
                'message' => 'Data and views preloaded successfully',
                'preloaded_items' => array_keys($data),
                'preloaded_views' => count($data['preloaded_views']),
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error preloading data: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    /**
     * Preload specific data type
     */
    public function preloadData(Request $request, string $type)
    {
        $userId = auth()->id() ?? 'guest';

        try {
            $data = match($type) {
                'medical-cases' => $this->preloadMedicalCases($userId),
                'patients' => $this->preloadPatientData($userId),
                'urgencies' => $this->preloadUrgencyData($userId),
                'hospitalizados' => $this->preloadHospitalizationData($userId),
                'historial' => $this->preloadHistoricalData($userId),
                'admin' => $this->preloadAdminData($userId),
                default => throw new \InvalidArgumentException("Unknown data type: $type")
            };

            return response()->json([
                'success' => true,
                'type' => $type,
                'cached' => true,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'type' => $type,
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    private function preloadMedicalCases(string $userId): array
    {
        $cacheKey = 'medico_casos__' . $userId;
        return Cache::remember($cacheKey, 300, function () {
            return $this->apiService->getMedicalCases();
        });
    }

    private function preloadPatientData(string $userId): array
    {
        $cacheKey = 'medico_pacientes_' . $userId;
        return Cache::remember($cacheKey, 300, function () {
            return $this->apiService->getPatientData();
        });
    }

    private function preloadUrgencyData(string $userId): array
    {
        $cacheKey = 'medico_urgencias_' . $userId;
        return Cache::remember($cacheKey, 300, function () {
            return $this->apiService->getUrgencyData();
        });
    }

    private function preloadHospitalizationData(string $userId): array
    {
        $cacheKey = 'medico_hospitalizados_' . $userId;
        return Cache::remember($cacheKey, 300, function () {
            return $this->apiService->getHospitalizationData();
        });
    }

    private function preloadHistoricalData(string $userId): array
    {
        $cacheKey = 'medico_historial_' . $userId;
        return Cache::remember($cacheKey, 300, function () {
            return $this->apiService->getHistoricalData();
        });
    }

    private function preloadAdminData(string $userId): array
    {
        $cacheKey = 'admin_dashboard_' . $userId;
        return Cache::remember($cacheKey, 300, function () {
            return $this->apiService->getAdminData();
        });
    }

    /**
     * Preload all views for ultra-fast navigation
     */
    private function preloadAllViews(string $userRole, string $userId): array
    {
        $preloadedViews = [];

        try {
            // Define views to preload based on user role
            $viewsToPreload = $this->getViewsForRole($userRole);

            foreach ($viewsToPreload as $viewName => $route) {
                $cacheKey = "preloaded_view_{$viewName}_{$userId}";

                // Cache the view content for 10 minutes
                $viewContent = \Cache::remember($cacheKey, 600, function () use ($route, $viewName) {
                    return $this->renderViewContent($route, $viewName);
                });

                if ($viewContent) {
                    $preloadedViews[$viewName] = [
                        'route' => $route,
                        'cached' => true,
                        'size' => strlen($viewContent)
                    ];
                }
            }

        } catch (\Exception $e) {
            \Log::error('Error preloading views: ' . $e->getMessage());
        }

        return $preloadedViews;
    }

    /**
     * Get views to preload based on user role
     */
    private function getViewsForRole(string $role): array
    {
        if ($role === 'admin') {
            return [
                'admin_dashboard' => '/admin/dashboard',
                'admin_users' => '/admin/users',
                'admin_config' => '/admin/config',
                'admin_backup' => '/admin/backup',
                'admin_supervision' => '/admin/supervision',
                'admin_ai_monitor' => '/admin/ai-monitor',
            ];
        } else {
            return [
                'medico_dashboard' => '/medico/dashboard',
                'medico_casos' => '/medico/casos',
                'medico_pacientes' => '/medico/pacientes',
                'medico_urgencias' => '/medico/urgencias',
                'medico_hospitalizados' => '/medico/hospitalizados',
                'medico_historial' => '/medico/historial',
            ];
        }
    }

    /**
     * Render view content for caching
     */
    private function renderViewContent(string $route, string $viewName): ?string
    {
        try {
            // Create a mock request to render the view
            $request = \Request::create($route, 'GET');
            $request->setUserResolver(function () {
                return auth()->user();
            });

            // Get the appropriate controller and method
            $response = app()->handle($request);

            if ($response->getStatusCode() === 200) {
                return $response->getContent();
            }

        } catch (\Exception $e) {
            \Log::warning("Could not preload view {$viewName}: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Get cache status for all data types
     */
    public function getCacheStatus()
    {
        $userId = auth()->id() ?? 'guest';

        $cacheKeys = [
            'medical_cases' => 'medico_casos__' . $userId,
            'patients' => 'medico_pacientes_' . $userId,
            'urgencies' => 'medico_urgencias_' . $userId,
            'hospitalizados' => 'medico_hospitalizados_' . $userId,
            'historial' => 'medico_historial_' . $userId,
            'admin' => 'admin_dashboard_' . $userId,
        ];

        $status = [];
        foreach ($cacheKeys as $type => $key) {
            $status[$type] = [
                'cached' => \Cache::has($key),
                'key' => $key
            ];
        }

        return response()->json([
            'success' => true,
            'cache_status' => $status,
            'timestamp' => now()->toISOString()
        ]);
    }
}
