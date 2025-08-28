<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MedicalDataController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// VITAL RED API Routes
Route::prefix('vital-red')->group(function () {
    Route::get('/medical-cases', [MedicalDataController::class, 'getMedicalCases']);
    Route::get('/patient-data', [MedicalDataController::class, 'getPatientData']);
    Route::get('/urgency-data', [MedicalDataController::class, 'getUrgencyData']);
    Route::get('/hospitalization-data', [MedicalDataController::class, 'getHospitalizationData']);
    Route::get('/historical-data', [MedicalDataController::class, 'getHistoricalData']);
    Route::get('/admin-data', [MedicalDataController::class, 'getAdminData']);
    
    // Health check endpoints
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'timestamp' => now()]);
    });
    
    Route::get('/status', function () {
        return response()->json([
            'status' => 'operational',
            'version' => '1.0.0',
            'laravel_version' => app()->version(),
            'timestamp' => now(),
            'uptime' => 'Available'
        ]);
    });
    
    Route::get('/ping', function () {
        return response()->json(['pong' => true, 'timestamp' => now()]);
    });
});

// Legacy API Routes (for compatibility with original system)
Route::get('/medical-cases', [MedicalDataController::class, 'getMedicalCases']);
Route::get('/patient-data', [MedicalDataController::class, 'getPatientData']);
Route::get('/urgency-data', [MedicalDataController::class, 'getUrgencyData']);
Route::get('/hospitalization-data', [MedicalDataController::class, 'getHospitalizationData']);
Route::get('/historical-data', [MedicalDataController::class, 'getHistoricalData']);
Route::get('/admin-data', [MedicalDataController::class, 'getAdminData']);
