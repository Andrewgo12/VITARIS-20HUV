<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class VitalRedApiService
{
    private string $baseUrl;
    private int $timeout;
    private int $retryAttempts;
    private array $endpoints;

    public function __construct()
    {
        $this->baseUrl = config('vital_red.ai_system.base_url');
        $this->timeout = config('vital_red.ai_system.timeout');
        $this->retryAttempts = config('vital_red.ai_system.retry_attempts');
        $this->endpoints = config('vital_red.ai_system.endpoints');
    }

    /**
     * Get medical cases data with optional filters
     */
    public function getMedicalCases(array $filters = []): array
    {
        return $this->makeRequest('medical_cases', $filters, 'medical_cases');
    }

    /**
     * Get patient data
     */
    public function getPatientData(): array
    {
        return $this->makeRequest('patient_data', [], 'patient_data');
    }

    /**
     * Get urgency data
     */
    public function getUrgencyData(): array
    {
        return $this->makeRequest('urgency_data', [], 'urgency_data');
    }

    /**
     * Get hospitalization data
     */
    public function getHospitalizationData(): array
    {
        return $this->makeRequest('hospitalization_data', [], 'hospitalization_data');
    }

    /**
     * Get historical data
     */
    public function getHistoricalData(): array
    {
        return $this->makeRequest('historical_data', [], 'historical_data');
    }

    /**
     * Get admin data
     */
    public function getAdminData(): array
    {
        return $this->makeRequest('admin_data', [], 'admin_data');
    }

    /**
     * Check if AI system is available
     */
    public function isAiSystemAvailable(): bool
    {
        try {
            $response = Http::timeout(5)->get($this->baseUrl . '/health');
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get AI system status
     */
    public function getAiSystemStatus(): array
    {
        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/status');

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error('Error getting AI system status: ' . $e->getMessage());
        }

        return [
            'status' => 'unknown',
            'last_check' => now()->toISOString(),
            'available' => false
        ];
    }

    /**
     * Make HTTP request to AI system
     */
    private function makeRequest(string $endpoint, array $params = [], string $defaultKey = null): array
    {
        $cacheKey = "vital_red_api_{$endpoint}_" . md5(serialize($params));

        // Try to get from cache first (cache for 5 minutes for faster navigation)
        if ($cachedData = Cache::get($cacheKey)) {
            return $cachedData;
        }

        // First try the external AI system
        try {
            $url = $this->baseUrl . $this->endpoints[$endpoint];

            if (!empty($params)) {
                $url .= '?' . http_build_query(array_filter($params));
            }

            $response = Http::timeout($this->timeout)
                          ->retry($this->retryAttempts, 1000)
                          ->get($url);

            if ($response->successful()) {
                $data = $response->json();

                // Cache successful response for 5 minutes for faster navigation
                Cache::put($cacheKey, $data, 300);

                return $data;
            } else {
                Log::warning("AI API request failed for {$endpoint}: HTTP {$response->status()}");
            }
        } catch (\Exception $e) {
            Log::error("Error making request to AI system for {$endpoint}: " . $e->getMessage());
        }

        // If AI system fails, try local Laravel API as fallback
        try {
            $localUrl = url('/api/vital-red/' . str_replace('_', '-', $endpoint));

            if (!empty($params)) {
                $localUrl .= '?' . http_build_query(array_filter($params));
            }

            $response = Http::timeout(10)->get($localUrl);

            if ($response->successful()) {
                $data = $response->json();

                // Cache local response for 2 minutes for faster navigation
                Cache::put($cacheKey, $data, 120);

                return $data;
            }
        } catch (\Exception $e) {
            Log::error("Error making request to local API for {$endpoint}: " . $e->getMessage());
        }

        return $this->getDefaultData($defaultKey);
    }

    /**
     * Get default data when API is unavailable
     */
    private function getDefaultData(string $key = null): array
    {
        if (!$key) {
            return [
                'success' => false,
                'data' => [],
                'error' => 'AI system unavailable'
            ];
        }

        $defaultData = config("vital_red.defaults.{$key}", []);

        if (isset($defaultData['metadata'])) {
            $defaultData['metadata']['generated_at'] = now()->toISOString();
        }

        return [
            'success' => true,
            'data' => $defaultData,
            'source' => 'default'
        ];
    }

    /**
     * Clear API cache
     */
    public function clearCache(): void
    {
        $patterns = [
            'vital_red_api_medical_cases_*',
            'vital_red_api_patient_data_*',
            'vital_red_api_urgency_data_*',
            'vital_red_api_hospitalization_data_*',
            'vital_red_api_historical_data_*',
            'vital_red_api_admin_data_*'
        ];

        foreach ($patterns as $pattern) {
            Cache::forget($pattern);
        }
    }

    /**
     * Get cache statistics
     */
    public function getCacheStats(): array
    {
        $endpoints = array_keys($this->endpoints);
        $stats = [];

        foreach ($endpoints as $endpoint) {
            $cacheKey = "vital_red_api_{$endpoint}_" . md5('');
            $stats[$endpoint] = [
                'cached' => Cache::has($cacheKey),
                'last_updated' => Cache::get($cacheKey . '_timestamp', 'Never')
            ];
        }

        return $stats;
    }

    /**
     * Test connection to AI system
     */
    public function testConnection(): array
    {
        $startTime = microtime(true);

        try {
            $response = Http::timeout(10)->get($this->baseUrl . '/ping');
            $endTime = microtime(true);

            return [
                'success' => $response->successful(),
                'status_code' => $response->status(),
                'response_time' => round(($endTime - $startTime) * 1000, 2), // ms
                'message' => $response->successful() ? 'Connection successful' : 'Connection failed'
            ];
        } catch (\Exception $e) {
            $endTime = microtime(true);

            return [
                'success' => false,
                'status_code' => 0,
                'response_time' => round(($endTime - $startTime) * 1000, 2),
                'message' => 'Connection error: ' . $e->getMessage()
            ];
        }
    }
}
