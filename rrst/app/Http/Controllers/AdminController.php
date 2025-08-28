<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\VitalRedApiService;

class AdminController extends Controller
{
    protected VitalRedApiService $apiService;

    public function __construct(VitalRedApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function dashboard()
    {
        // Cache admin dashboard data for 5 minutes
        $cacheKey = 'admin_dashboard_' . (auth()->id() ?? 'guest');

        $dashboardData = \Cache::remember($cacheKey, 300, function () {
            return [
                'adminData' => $this->apiService->getAdminData(),
                'timestamp' => now()
            ];
        });

        return view('admin.dashboard', $dashboardData);
    }

    public function users()
    {
        return view('admin.users');
    }

    public function config()
    {
        return view('admin.config');
    }

    public function backup()
    {
        return view('admin.backup');
    }

    public function supervision()
    {
        $cacheKey = 'admin_supervision_' . (auth()->id() ?? 'guest');
        $supervisionData = \Cache::remember($cacheKey, 300, function () {
            return $this->getSupervisionData();
        });
        return view('admin.supervision', compact('supervisionData'));
    }

    public function aiMonitor()
    {
        $cacheKey = 'admin_ai_monitor_' . (auth()->id() ?? 'guest');
        $aiData = \Cache::remember($cacheKey, 300, function () {
            return $this->getAiMonitorData();
        });
        return view('admin.ai-monitor', compact('aiData'));
    }

    private function getAdminData()
    {
        try {
            $response = Http::get('http://localhost:3000/api/admin-data');

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            // Log error
        }

        return [
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_records' => 0,
                    'source' => 'Default Admin Data',
                    'version' => '1.0'
                ],
                'records' => [],
                'statistics' => [
                    'total_users' => 0,
                    'active_sessions' => 0,
                    'system_health' => 'unknown',
                    'last_backup' => null
                ]
            ]
        ];
    }

    private function getSupervisionData()
    {
        // Datos de supervisión del sistema
        return [
            'system_status' => 'operational',
            'active_processes' => 5,
            'memory_usage' => '45%',
            'cpu_usage' => '23%',
            'disk_usage' => '67%',
            'last_update' => now(),
            'alerts' => []
        ];
    }

    private function getAiMonitorData()
    {
        // Datos de monitoreo de IA
        return [
            'ai_status' => 'active',
            'processing_queue' => 12,
            'processed_today' => 156,
            'accuracy_rate' => '94.5%',
            'last_training' => now()->subDays(3),
            'model_version' => '2.1.0'
        ];
    }
}
