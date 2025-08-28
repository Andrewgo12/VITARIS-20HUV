<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function index()
    {
        return view('dashboard.index');
    }

    public function medico()
    {
        // Obtener datos de la API de casos médicos
        $medicalCases = $this->getMedicalCasesData();
        
        return view('medico.dashboard', compact('medicalCases'));
    }

    public function admin()
    {
        // Obtener datos administrativos
        $adminData = $this->getAdminData();
        
        return view('admin.dashboard', compact('adminData'));
    }

    private function getMedicalCasesData()
    {
        try {
            // Intentar obtener datos del sistema de procesamiento de Gmail
            $response = Http::get('http://localhost:3000/api/medical-cases');
            
            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            // Log error
        }

        // Datos por defecto si no se puede conectar
        return [
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_cases' => 0,
                    'source' => 'Default Data',
                    'version' => '1.0'
                ],
                'cases' => [],
                'statistics' => [
                    'by_priority' => [],
                    'by_specialty' => [],
                    'by_status' => []
                ]
            ]
        ];
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
                    'source' => 'Default Data',
                    'version' => '1.0'
                ],
                'records' => [],
                'statistics' => []
            ]
        ];
    }
}
