<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\VitalRedApiService;

class MedicoController extends Controller
{
    protected VitalRedApiService $apiService;

    public function __construct(VitalRedApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function dashboard()
    {
        // Cache dashboard data for 5 minutes to improve performance
        $cacheKey = 'medico_dashboard_' . (auth()->id() ?? 'guest');

        $dashboardData = \Cache::remember($cacheKey, 300, function () {
            return [
                'medicalCases' => $this->apiService->getMedicalCases(),
                'timestamp' => now()
            ];
        });

        return view('medico.dashboard', $dashboardData);
    }

    public function casos(Request $request)
    {
        try {
            $filters = [
                'priority' => $request->get('priority'),
                'specialty' => $request->get('specialty'),
                'status' => $request->get('status'),
                'search' => $request->get('search')
            ];

            // Cache filtered results for 3 minutes
            $cacheKey = 'medico_casos_' . md5(serialize($filters)) . '_' . (auth()->id() ?? 'guest');

            $medicalCases = \Cache::remember($cacheKey, 180, function () use ($filters) {
                return $this->apiService->getMedicalCases($filters);
            });

            \Log::info('Medico casos loaded', ['cases_count' => count($medicalCases['data']['cases'] ?? [])]);

            return view('medico.casos', compact('medicalCases', 'filters'));
        } catch (\Exception $e) {
            \Log::error('Error in medico casos: ' . $e->getMessage());

            // Return with empty data if there's an error
            $medicalCases = ['data' => ['cases' => [], 'statistics' => []]];
            $filters = [];

            return view('medico.casos', compact('medicalCases', 'filters'));
        }
    }

    public function casoDetail($id)
    {
        $medicalCases = $this->apiService->getMedicalCases();
        $caso = null;

        if (isset($medicalCases['data']['cases'])) {
            foreach ($medicalCases['data']['cases'] as $case) {
                if ($case['id'] == $id) {
                    $caso = $case;
                    break;
                }
            }
        }

        return view('medico.caso-detail', compact('caso'));
    }

    public function pacientes(Request $request)
    {
        try {
            $cacheKey = 'medico_pacientes_' . (auth()->id() ?? 'guest');
            $patientData = \Cache::remember($cacheKey, 300, function () {
                return $this->apiService->getPatientData();
            });
            \Log::info('Medico pacientes loaded', ['patients_count' => count($patientData['data']['patients'] ?? [])]);
            return view('medico.pacientes', compact('patientData'));
        } catch (\Exception $e) {
            \Log::error('Error in medico pacientes: ' . $e->getMessage());
            $patientData = ['data' => ['patients' => [], 'statistics' => []]];
            return view('medico.pacientes', compact('patientData'));
        }
    }

    public function urgencias(Request $request)
    {
        try {
            $cacheKey = 'medico_urgencias_' . (auth()->id() ?? 'guest');
            $urgencyData = \Cache::remember($cacheKey, 300, function () {
                return $this->apiService->getUrgencyData();
            });
            \Log::info('Medico urgencias loaded', ['urgencies_count' => count($urgencyData['data']['urgencies'] ?? [])]);
            return view('medico.urgencias', compact('urgencyData'));
        } catch (\Exception $e) {
            \Log::error('Error in medico urgencias: ' . $e->getMessage());
            $urgencyData = ['data' => ['urgencies' => [], 'statistics' => []]];
            return view('medico.urgencias', compact('urgencyData'));
        }
    }

    public function hospitalizados(Request $request)
    {
        try {
            $cacheKey = 'medico_hospitalizados_' . (auth()->id() ?? 'guest');
            $hospitalizationData = \Cache::remember($cacheKey, 300, function () {
                return $this->apiService->getHospitalizationData();
            });
            \Log::info('Medico hospitalizados loaded', ['admissions_count' => count($hospitalizationData['data']['admissions'] ?? [])]);
            return view('medico.hospitalizados', compact('hospitalizationData'));
        } catch (\Exception $e) {
            \Log::error('Error in medico hospitalizados: ' . $e->getMessage());
            $hospitalizationData = ['data' => ['admissions' => [], 'statistics' => []]];
            return view('medico.hospitalizados', compact('hospitalizationData'));
        }
    }

    public function historial(Request $request)
    {
        try {
            $cacheKey = 'medico_historial_' . (auth()->id() ?? 'guest');
            $historicalData = \Cache::remember($cacheKey, 300, function () {
                return $this->apiService->getHistoricalData();
            });
            \Log::info('Medico historial loaded', ['records_count' => count($historicalData['data']['records'] ?? [])]);
            return view('medico.historial', compact('historicalData'));
        } catch (\Exception $e) {
            \Log::error('Error in medico historial: ' . $e->getMessage());
            $historicalData = ['data' => ['records' => [], 'statistics' => []]];
            return view('medico.historial', compact('historicalData'));
        }
    }


}
