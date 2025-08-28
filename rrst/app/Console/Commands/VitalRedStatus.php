<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\VitalRedApiService;

class VitalRedStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vital-red:status {--detailed : Show detailed information}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check the status of VITAL RED system components';

    /**
     * Execute the console command.
     */
    public function handle(VitalRedApiService $apiService)
    {
        $this->info('🏥 VITAL RED System Status Check');
        $this->newLine();

        // Check Laravel application
        $this->checkLaravelApp();

        // Check AI System
        $this->checkAiSystem($apiService);

        // Check Database
        $this->checkDatabase();

        // Show detailed information if requested
        if ($this->option('detailed')) {
            $this->showDetailedInfo($apiService);
        }

        $this->newLine();
        $this->info('✅ Status check completed');
    }

    private function checkLaravelApp()
    {
        $this->line('📱 Laravel Application:');

        try {
            $version = app()->version();
            $this->info("   ✅ Running Laravel {$version}");

            $environment = app()->environment();
            $this->info("   ✅ Environment: {$environment}");

        } catch (\Exception $e) {
            $this->error("   ❌ Laravel application error: {$e->getMessage()}");
        }

        $this->newLine();
    }

    private function checkAiSystem(VitalRedApiService $apiService)
    {
        $this->line('🤖 AI System:');

        $connectionTest = $apiService->testConnection();

        if ($connectionTest['success']) {
            $this->info("   ✅ AI System is available");
            $this->info("   ✅ Response time: {$connectionTest['response_time']}ms");
        } else {
            $this->error("   ❌ AI System is unavailable");
            $this->error("   ❌ {$connectionTest['message']}");
        }

        $this->newLine();
    }

    private function checkDatabase()
    {
        $this->line('🗄️  Database:');

        try {
            \DB::connection()->getPdo();
            $this->info('   ✅ Database connection successful');

            $userCount = \DB::table('users')->count();
            $this->info("   ✅ Users in database: {$userCount}");

        } catch (\Exception $e) {
            $this->error("   ❌ Database connection failed: {$e->getMessage()}");
        }

        $this->newLine();
    }

    private function showDetailedInfo(VitalRedApiService $apiService)
    {
        $this->line('📊 Detailed Information:');

        // System configuration
        $this->line('   System Configuration:');
        $this->line('   - Base URL: ' . config('vital_red.ai_system.base_url'));
        $this->line('   - Timeout: ' . config('vital_red.ai_system.timeout') . 's');
        $this->line('   - Retry attempts: ' . config('vital_red.ai_system.retry_attempts'));

        // Cache statistics
        $cacheStats = $apiService->getCacheStats();
        $this->line('   Cache Status:');
        foreach ($cacheStats as $endpoint => $stats) {
            $status = $stats['cached'] ? '✅ Cached' : '❌ Not cached';
            $this->line("   - {$endpoint}: {$status}");
        }

        $this->newLine();
    }
}
