<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\VitalRedApiService;

class TestController extends Controller
{
    protected VitalRedApiService $apiService;

    public function __construct(VitalRedApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function testApis()
    {
        $results = [];
        
        try {
            $results['medical_cases'] = $this->apiService->getMedicalCases();
            $results['medical_cases_status'] = 'OK';
        } catch (\Exception $e) {
            $results['medical_cases_status'] = 'ERROR: ' . $e->getMessage();
        }
        
        try {
            $results['patient_data'] = $this->apiService->getPatientData();
            $results['patient_data_status'] = 'OK';
        } catch (\Exception $e) {
            $results['patient_data_status'] = 'ERROR: ' . $e->getMessage();
        }
        
        try {
            $results['urgency_data'] = $this->apiService->getUrgencyData();
            $results['urgency_data_status'] = 'OK';
        } catch (\Exception $e) {
            $results['urgency_data_status'] = 'ERROR: ' . $e->getMessage();
        }
        
        try {
            $results['hospitalization_data'] = $this->apiService->getHospitalizationData();
            $results['hospitalization_data_status'] = 'OK';
        } catch (\Exception $e) {
            $results['hospitalization_data_status'] = 'ERROR: ' . $e->getMessage();
        }
        
        try {
            $results['historical_data'] = $this->apiService->getHistoricalData();
            $results['historical_data_status'] = 'OK';
        } catch (\Exception $e) {
            $results['historical_data_status'] = 'ERROR: ' . $e->getMessage();
        }
        
        return response()->json($results);
    }
    
    public function testMedicoViews()
    {
        $results = [];
        
        // Test casos
        try {
            $medicalCases = $this->apiService->getMedicalCases();
            $results['casos'] = [
                'status' => 'OK',
                'data_count' => count($medicalCases['data']['cases'] ?? []),
                'has_data' => !empty($medicalCases['data']['cases'])
            ];
        } catch (\Exception $e) {
            $results['casos'] = [
                'status' => 'ERROR',
                'error' => $e->getMessage()
            ];
        }
        
        // Test pacientes
        try {
            $patientData = $this->apiService->getPatientData();
            $results['pacientes'] = [
                'status' => 'OK',
                'data_count' => count($patientData['data']['patients'] ?? []),
                'has_data' => !empty($patientData['data']['patients'])
            ];
        } catch (\Exception $e) {
            $results['pacientes'] = [
                'status' => 'ERROR',
                'error' => $e->getMessage()
            ];
        }
        
        // Test urgencias
        try {
            $urgencyData = $this->apiService->getUrgencyData();
            $results['urgencias'] = [
                'status' => 'OK',
                'data_count' => count($urgencyData['data']['urgencies'] ?? []),
                'has_data' => !empty($urgencyData['data']['urgencies'])
            ];
        } catch (\Exception $e) {
            $results['urgencias'] = [
                'status' => 'ERROR',
                'error' => $e->getMessage()
            ];
        }
        
        // Test hospitalizados
        try {
            $hospitalizationData = $this->apiService->getHospitalizationData();
            $results['hospitalizados'] = [
                'status' => 'OK',
                'data_count' => count($hospitalizationData['data']['admissions'] ?? []),
                'has_data' => !empty($hospitalizationData['data']['admissions'])
            ];
        } catch (\Exception $e) {
            $results['hospitalizados'] = [
                'status' => 'ERROR',
                'error' => $e->getMessage()
            ];
        }
        
        // Test historial
        try {
            $historicalData = $this->apiService->getHistoricalData();
            $results['historial'] = [
                'status' => 'OK',
                'data_count' => count($historicalData['data']['records'] ?? []),
                'has_data' => !empty($historicalData['data']['records'])
            ];
        } catch (\Exception $e) {
            $results['historial'] = [
                'status' => 'ERROR',
                'error' => $e->getMessage()
            ];
        }
        
        return response()->json($results);
    }
}
