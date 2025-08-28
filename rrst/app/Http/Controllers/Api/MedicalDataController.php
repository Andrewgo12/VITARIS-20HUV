<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicalDataController extends Controller
{
    /**
     * Get medical cases data
     */
    public function getMedicalCases(Request $request): JsonResponse
    {
        $filters = $request->only(['priority', 'specialty', 'status', 'search']);
        
        $cases = $this->generateMedicalCases($filters);
        
        return response()->json([
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_cases' => count($cases),
                    'source' => 'Laravel API',
                    'version' => '1.0',
                    'filters_applied' => array_filter($filters)
                ],
                'cases' => $cases,
                'statistics' => $this->generateStatistics($cases)
            ]
        ]);
    }

    /**
     * Get patient data
     */
    public function getPatientData(): JsonResponse
    {
        $patients = $this->generatePatients();
        
        return response()->json([
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_patients' => count($patients),
                    'source' => 'Laravel API',
                    'version' => '1.0'
                ],
                'patients' => $patients,
                'statistics' => [
                    'active_patients' => collect($patients)->where('status', 'Activo')->count(),
                    'high_risk' => collect($patients)->where('risk_level', 'Alto')->count(),
                    'new_this_month' => collect($patients)->where('created_at', '>=', now()->startOfMonth())->count()
                ]
            ]
        ]);
    }

    /**
     * Get urgency data
     */
    public function getUrgencyData(): JsonResponse
    {
        $urgencies = $this->generateUrgencies();
        
        return response()->json([
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_urgencies' => count($urgencies),
                    'source' => 'Laravel API',
                    'version' => '1.0'
                ],
                'urgencies' => $urgencies,
                'statistics' => [
                    'critical' => collect($urgencies)->where('priority', 'Crítica')->count(),
                    'high' => collect($urgencies)->where('priority', 'Alta')->count(),
                    'in_process' => collect($urgencies)->where('status', 'En Proceso')->count()
                ]
            ]
        ]);
    }

    /**
     * Get hospitalization data
     */
    public function getHospitalizationData(): JsonResponse
    {
        $admissions = $this->generateHospitalizations();
        
        return response()->json([
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_admissions' => count($admissions),
                    'source' => 'Laravel API',
                    'version' => '1.0'
                ],
                'admissions' => $admissions,
                'statistics' => [
                    'occupancy_rate' => 75.5,
                    'average_stay' => 4.2,
                    'stable_patients' => collect($admissions)->where('status', 'Estable')->count()
                ]
            ]
        ]);
    }

    /**
     * Get historical data
     */
    public function getHistoricalData(): JsonResponse
    {
        $records = $this->generateHistoricalRecords();
        
        return response()->json([
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_records' => count($records),
                    'source' => 'Laravel API',
                    'version' => '1.0'
                ],
                'records' => $records,
                'statistics' => [
                    'resolved_cases' => collect($records)->where('status', 'Resuelto')->count(),
                    'this_month' => collect($records)->where('date', '>=', now()->startOfMonth())->count()
                ]
            ]
        ]);
    }

    /**
     * Get admin data
     */
    public function getAdminData(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'total_records' => 156,
                    'source' => 'Laravel API',
                    'version' => '1.0'
                ],
                'records' => [],
                'statistics' => [
                    'total_users' => \App\Models\User::count(),
                    'active_sessions' => rand(8, 15),
                    'system_health' => 'operational',
                    'last_backup' => now()->subHours(6)->format('Y-m-d H:i:s')
                ]
            ]
        ]);
    }

    /**
     * Generate sample medical cases
     */
    private function generateMedicalCases(array $filters = []): array
    {
        $cases = [
            [
                'id' => 'REF-2024-001',
                'patient_name' => 'María Elena Rodríguez',
                'age' => 45,
                'diagnosis' => 'Dolor torácico agudo',
                'priority' => 'Alta',
                'status' => 'Pendiente',
                'specialty' => 'Cardiología',
                'time_elapsed' => 'Hace 2 horas',
                'date' => now()->format('Y-m-d'),
                'referring_physician' => 'Dr. Juan Pérez',
                'referring_hospital' => 'Hospital Regional Norte'
            ],
            [
                'id' => 'REF-2024-002',
                'patient_name' => 'Carlos Alberto Mendoza',
                'age' => 62,
                'diagnosis' => 'Accidente cerebrovascular',
                'priority' => 'Crítica',
                'status' => 'Pendiente',
                'specialty' => 'Neurología',
                'time_elapsed' => 'Hace 30 minutos',
                'date' => now()->format('Y-m-d'),
                'referring_physician' => 'Dra. Ana García',
                'referring_hospital' => 'Hospital Central'
            ],
            [
                'id' => 'REF-2024-003',
                'patient_name' => 'Sofía Martínez López',
                'age' => 8,
                'diagnosis' => 'Fiebre alta persistente',
                'priority' => 'Media',
                'status' => 'Aprobado',
                'specialty' => 'Pediatría',
                'time_elapsed' => 'Hace 4 horas',
                'date' => now()->subDay()->format('Y-m-d'),
                'referring_physician' => 'Dr. Luis Hernández',
                'referring_hospital' => 'Hospital Infantil'
            ],
            [
                'id' => 'REF-2024-004',
                'patient_name' => 'Roberto Silva Castro',
                'age' => 55,
                'diagnosis' => 'Infarto agudo de miocardio',
                'priority' => 'Crítica',
                'status' => 'Pendiente',
                'specialty' => 'Cardiología',
                'time_elapsed' => 'Hace 1 hora',
                'date' => now()->format('Y-m-d'),
                'referring_physician' => 'Dr. Miguel Torres',
                'referring_hospital' => 'Hospital Regional Sur'
            ],
            [
                'id' => 'REF-2024-005',
                'patient_name' => 'Ana Patricia Vega',
                'age' => 34,
                'diagnosis' => 'Complicaciones del embarazo',
                'priority' => 'Alta',
                'status' => 'En Evaluación',
                'specialty' => 'Ginecología',
                'time_elapsed' => 'Hace 3 horas',
                'date' => now()->format('Y-m-d'),
                'referring_physician' => 'Dra. Carmen Ruiz',
                'referring_hospital' => 'Hospital Materno'
            ]
        ];

        // Apply filters
        if (!empty($filters['priority'])) {
            $cases = array_filter($cases, fn($case) => $case['priority'] === $filters['priority']);
        }
        
        if (!empty($filters['specialty'])) {
            $cases = array_filter($cases, fn($case) => $case['specialty'] === $filters['specialty']);
        }
        
        if (!empty($filters['status'])) {
            $cases = array_filter($cases, fn($case) => $case['status'] === $filters['status']);
        }
        
        if (!empty($filters['search'])) {
            $search = strtolower($filters['search']);
            $cases = array_filter($cases, fn($case) => 
                str_contains(strtolower($case['patient_name']), $search) ||
                str_contains(strtolower($case['diagnosis']), $search)
            );
        }

        return array_values($cases);
    }

    /**
     * Generate statistics for cases
     */
    private function generateStatistics(array $cases): array
    {
        $collection = collect($cases);
        
        return [
            'by_priority' => [
                'Crítica' => $collection->where('priority', 'Crítica')->count(),
                'Alta' => $collection->where('priority', 'Alta')->count(),
                'Media' => $collection->where('priority', 'Media')->count(),
                'Baja' => $collection->where('priority', 'Baja')->count(),
            ],
            'by_specialty' => [
                'Cardiología' => $collection->where('specialty', 'Cardiología')->count(),
                'Neurología' => $collection->where('specialty', 'Neurología')->count(),
                'Pediatría' => $collection->where('specialty', 'Pediatría')->count(),
                'Ginecología' => $collection->where('specialty', 'Ginecología')->count(),
            ],
            'by_status' => [
                'Pendiente' => $collection->where('status', 'Pendiente')->count(),
                'Aprobado' => $collection->where('status', 'Aprobado')->count(),
                'Rechazado' => $collection->where('status', 'Rechazado')->count(),
                'En Evaluación' => $collection->where('status', 'En Evaluación')->count(),
            ]
        ];
    }

    /**
     * Generate sample patients
     */
    private function generatePatients(): array
    {
        return [
            [
                'id' => 'PAT-001',
                'name' => 'María Elena Rodríguez',
                'age' => 45,
                'gender' => 'Femenino',
                'document' => '12345678',
                'status' => 'Activo',
                'risk_level' => 'Alto',
                'last_visit' => now()->subDays(2)->format('Y-m-d'),
                'created_at' => now()->subMonths(2)
            ],
            [
                'id' => 'PAT-002',
                'name' => 'Carlos Alberto Mendoza',
                'age' => 62,
                'gender' => 'Masculino',
                'document' => '87654321',
                'status' => 'Hospitalizado',
                'risk_level' => 'Crítico',
                'last_visit' => now()->format('Y-m-d'),
                'created_at' => now()->subWeeks(3)
            ]
        ];
    }

    /**
     * Generate sample urgencies
     */
    private function generateUrgencies(): array
    {
        return [
            [
                'id' => 'URG-001',
                'patient_name' => 'Roberto Silva Castro',
                'age' => 55,
                'priority' => 'Crítica',
                'status' => 'En Proceso',
                'chief_complaint' => 'Dolor torácico severo con irradiación',
                'time_waiting' => 'Hace 45 minutos',
                'vital_signs' => 'PA: 180/110, FC: 110, FR: 24',
                'location' => 'Sala de Emergencias 1',
                'notes' => 'Paciente con sospecha de IAM, requiere cateterismo urgente'
            ]
        ];
    }

    /**
     * Generate sample hospitalizations
     */
    private function generateHospitalizations(): array
    {
        return [
            [
                'id' => 'HOSP-001',
                'patient_name' => 'Ana Patricia Vega',
                'age' => 34,
                'bed_number' => '201-A',
                'ward' => 'Cardiología',
                'status' => 'Estable',
                'admission_date' => now()->subDays(3)->format('Y-m-d'),
                'length_of_stay' => '3 días',
                'attending_physician' => 'Dr. Carlos Mendoza',
                'diagnosis' => 'Post-operatorio de angioplastia',
                'treatment_plan' => 'Antiagregación dual, monitoreo cardíaco',
                'discharge_planned' => true
            ]
        ];
    }

    /**
     * Generate sample historical records
     */
    private function generateHistoricalRecords(): array
    {
        return [
            [
                'id' => 'HIST-001',
                'case_id' => 'REF-2024-001',
                'patient_name' => 'María Elena Rodríguez',
                'age' => 45,
                'diagnosis' => 'Dolor torácico agudo',
                'status' => 'Resuelto',
                'specialty' => 'Cardiología',
                'date' => now()->subDays(5)->format('Y-m-d'),
                'duration' => '2.5 horas',
                'treatment' => 'Angioplastia exitosa',
                'notes' => 'Paciente evolucionó favorablemente, alta médica'
            ]
        ];
    }
}
