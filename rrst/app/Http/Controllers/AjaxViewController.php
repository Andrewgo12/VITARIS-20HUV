<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\VitalRedApiService;
use Illuminate\Support\Facades\Cache;

class AjaxViewController extends Controller
{
    protected VitalRedApiService $apiService;

    public function __construct(VitalRedApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Get view content via AJAX for instant navigation
     */
    public function getViewContent(Request $request, string $role, string $view)
    {
        $userId = auth()->id() ?? 'guest';
        $cacheKey = "ajax_view_{$role}_{$view}_{$userId}";

        try {
            // Cache for 5 minutes
            $viewData = Cache::remember($cacheKey, 300, function () use ($role, $view, $userId) {
                return $this->generateViewData($role, $view, $userId);
            });

            if (!$viewData) {
                return response()->json([
                    'success' => false,
                    'message' => 'View not found'
                ], 404);
            }

            // Render only the content part of the view (ultra-fast)
            $startTime = microtime(true);
            $content = view($viewData['view'], $viewData['data'])->render();
            $renderTime = (microtime(true) - $startTime) * 1000; // Convert to milliseconds

            return response()->json([
                'success' => true,
                'content' => $content,
                'title' => $viewData['title'],
                'page_title' => $viewData['page_title'] ?? $viewData['title'],
                'section' => $viewData['section'] ?? $viewData['title'],
                'route' => $viewData['route'],
                'cached' => true,
                'render_time' => round($renderTime, 2),
                'load_time' => round((microtime(true) - LARAVEL_START) * 1000, 2),
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            \Log::error("Ajax view error for {$role}/{$view}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error loading view: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate view data based on role and view
     */
    private function generateViewData(string $role, string $view, string $userId): ?array
    {
        if ($role === 'medico') {
            return $this->getMedicoViewData($view, $userId);
        } elseif ($role === 'admin') {
            return $this->getAdminViewData($view, $userId);
        }

        return null;
    }

    /**
     * Get medico view data
     */
    private function getMedicoViewData(string $view, string $userId): ?array
    {
        switch ($view) {
            case 'dashboard':
                $medicalCases = $this->apiService->getMedicalCases();
                return [
                    'view' => 'medico.dashboard',
                    'data' => compact('medicalCases'),
                    'title' => 'Dashboard Médico',
                    'page_title' => 'Dashboard',
                    'section' => 'Médico',
                    'route' => '/medico/dashboard'
                ];

            case 'casos':
                $medicalCases = $this->apiService->getMedicalCases();
                $filters = [];
                return [
                    'view' => 'medico.casos',
                    'data' => compact('medicalCases', 'filters'),
                    'title' => 'Casos Médicos',
                    'page_title' => 'Casos Médicos',
                    'section' => 'Gestión',
                    'route' => '/medico/casos'
                ];

            case 'pacientes':
                $patientData = $this->apiService->getPatientData();
                return [
                    'view' => 'medico.pacientes',
                    'data' => compact('patientData'),
                    'title' => 'Gestión de Pacientes',
                    'page_title' => 'Pacientes',
                    'section' => 'Gestión',
                    'route' => '/medico/pacientes'
                ];

            case 'urgencias':
                $urgencyData = $this->apiService->getUrgencyData();
                return [
                    'view' => 'medico.urgencias',
                    'data' => compact('urgencyData'),
                    'title' => 'Centro de Urgencias',
                    'route' => '/medico/urgencias'
                ];

            case 'hospitalizados':
                $hospitalizationData = $this->apiService->getHospitalizationData();
                return [
                    'view' => 'medico.hospitalizados',
                    'data' => compact('hospitalizationData'),
                    'title' => 'Pacientes Hospitalizados',
                    'route' => '/medico/hospitalizados'
                ];

            case 'historial':
                $historicalData = $this->apiService->getHistoricalData();
                return [
                    'view' => 'medico.historial',
                    'data' => compact('historicalData'),
                    'title' => 'Historial Médico',
                    'route' => '/medico/historial'
                ];

            default:
                return null;
        }
    }

    /**
     * Get admin view data
     */
    private function getAdminViewData(string $view, string $userId): ?array
    {
        switch ($view) {
            case 'dashboard':
                $adminData = $this->apiService->getAdminData();
                return [
                    'view' => 'admin.dashboard',
                    'data' => compact('adminData'),
                    'title' => 'Panel de Administración',
                    'route' => '/admin/dashboard'
                ];

            case 'users':
                $users = \App\Models\User::all();
                return [
                    'view' => 'admin.users',
                    'data' => compact('users'),
                    'title' => 'Gestión de Usuarios',
                    'route' => '/admin/users'
                ];

            case 'config':
                $config = [
                    'system' => config('vital_red'),
                    'app' => [
                        'name' => config('app.name'),
                        'env' => config('app.env'),
                        'debug' => config('app.debug')
                    ]
                ];
                return [
                    'view' => 'admin.config',
                    'data' => compact('config'),
                    'title' => 'Configuración del Sistema',
                    'route' => '/admin/config'
                ];

            case 'backup':
                $backupData = [
                    'status' => 'active',
                    'last_backup' => now()->subHours(6),
                    'size' => '2.5 GB',
                    'retention' => 30
                ];
                return [
                    'view' => 'admin.backup',
                    'data' => compact('backupData'),
                    'title' => 'Sistema de Respaldos',
                    'route' => '/admin/backup'
                ];

            case 'supervision':
                $supervisionData = [
                    'system_health' => 'operational',
                    'active_users' => rand(8, 15),
                    'server_load' => rand(20, 60),
                    'uptime' => '99.9%'
                ];
                return [
                    'view' => 'admin.supervision',
                    'data' => compact('supervisionData'),
                    'title' => 'Centro de Supervisión',
                    'route' => '/admin/supervision'
                ];

            case 'ai-monitor':
                $aiData = [
                    'status' => 'operational',
                    'processed' => rand(100, 500),
                    'success_rate' => rand(85, 98),
                    'queue_size' => rand(0, 10)
                ];
                return [
                    'view' => 'admin.ai-monitor',
                    'data' => compact('aiData'),
                    'title' => 'Monitor de IA',
                    'route' => '/admin/ai-monitor'
                ];

            default:
                return null;
        }
    }

    /**
     * Preload all view contents for instant navigation
     */
    public function preloadAllViews(Request $request)
    {
        $userId = auth()->id() ?? 'guest';
        $userRole = auth()->user()->role ?? 'medico';

        $views = [];
        $viewNames = [];

        if ($userRole === 'medico') {
            $viewNames = ['dashboard', 'casos', 'pacientes', 'urgencias', 'hospitalizados', 'historial'];
        } else {
            $viewNames = ['dashboard', 'users', 'config', 'backup', 'supervision', 'ai-monitor'];
        }

        foreach ($viewNames as $viewName) {
            try {
                $viewData = $this->generateViewData($userRole, $viewName, $userId);
                if ($viewData) {
                    $content = view($viewData['view'], $viewData['data'])->render();
                    $views[$viewName] = [
                        'content' => $content,
                        'title' => $viewData['title'],
                        'route' => $viewData['route']
                    ];
                }
            } catch (\Exception $e) {
                \Log::warning("Failed to preload view {$viewName}: " . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'views' => $views,
            'total_preloaded' => count($views),
            'user_role' => $userRole,
            'timestamp' => now()->toISOString()
        ]);
    }
}
