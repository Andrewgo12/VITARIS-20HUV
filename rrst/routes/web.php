<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\PreloadController;
use App\Http\Controllers\ViewPreloadController;
use App\Http\Controllers\AjaxViewController;

// Redirect root to login
Route::get('/', function () {
    return redirect('/login');
});

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected routes
Route::middleware('auth')->group(function () {

    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Medico routes
    Route::prefix('medico')->name('medico.')->group(function () {
        Route::get('/dashboard', [MedicoController::class, 'dashboard'])->name('dashboard');
        Route::get('/casos', [MedicoController::class, 'casos'])->name('casos');
        Route::get('/casos/{id}', [MedicoController::class, 'casoDetail'])->name('casos.detail');
        Route::get('/pacientes', [MedicoController::class, 'pacientes'])->name('pacientes');
        Route::get('/urgencias', [MedicoController::class, 'urgencias'])->name('urgencias');
        Route::get('/hospitalizados', [MedicoController::class, 'hospitalizados'])->name('hospitalizados');
        Route::get('/historial', [MedicoController::class, 'historial'])->name('historial');
    });

    // Admin routes
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::get('/config', [AdminController::class, 'config'])->name('config');
        Route::get('/backup', [AdminController::class, 'backup'])->name('backup');
        Route::get('/supervision', [AdminController::class, 'supervision'])->name('supervision');
        Route::get('/ai-monitor', [AdminController::class, 'aiMonitor'])->name('ai-monitor');
    });

});

// Test routes (remove in production)
Route::get('/test/apis', [TestController::class, 'testApis']);
Route::get('/test/medico-views', [TestController::class, 'testMedicoViews']);

// Temporary test routes without auth (remove in production)
Route::get('/test/casos', [MedicoController::class, 'casos']);
Route::get('/test/pacientes', [MedicoController::class, 'pacientes']);
Route::get('/test/urgencias', [MedicoController::class, 'urgencias']);
Route::get('/test/hospitalizados', [MedicoController::class, 'hospitalizados']);
Route::get('/test/historial', [MedicoController::class, 'historial']);

// Preload routes for faster navigation
Route::middleware('auth')->group(function () {
    Route::get('/preload/all', [PreloadController::class, 'preloadAllData'])->name('preload.all');
    Route::get('/preload/{type}', [PreloadController::class, 'preloadData'])->name('preload.data');
    Route::get('/cache/status', [PreloadController::class, 'getCacheStatus'])->name('cache.status');

    // Ultra-fast view preload routes
    Route::get('/views/preload-all', [ViewPreloadController::class, 'preloadAllViewData'])->name('views.preload.all');
    Route::get('/views/data/{view}', [ViewPreloadController::class, 'getViewData'])->name('views.data');
    Route::delete('/views/cache', [ViewPreloadController::class, 'clearViewsCache'])->name('views.cache.clear');

    // AJAX instant navigation routes
    Route::get('/ajax/view/{role}/{view}', [AjaxViewController::class, 'getViewContent'])->name('ajax.view');
    Route::get('/ajax/preload-all', [AjaxViewController::class, 'preloadAllViews'])->name('ajax.preload.all');
});
