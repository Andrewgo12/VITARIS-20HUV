<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\VitalRedApiService;
use Illuminate\Support\Facades\Cache;

class VitalRedCacheClear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vital-red:cache-clear {--all : Clear all cache including Laravel cache}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear VITAL RED system cache';

    /**
     * Execute the console command.
     */
    public function handle(VitalRedApiService $apiService)
    {
        $this->info('🧹 Clearing VITAL RED Cache...');
        $this->newLine();

        // Clear API cache
        $this->line('📡 Clearing API cache...');
        $apiService->clearCache();
        $this->info('   ✅ API cache cleared');

        // Clear specific VITAL RED cache patterns
        $this->line('🏥 Clearing VITAL RED specific cache...');
        $patterns = [
            'vital_red_*',
            'medical_cases_*',
            'patient_data_*',
            'urgency_data_*',
            'hospitalization_data_*',
            'historical_data_*',
            'admin_data_*'
        ];

        foreach ($patterns as $pattern) {
            Cache::forget($pattern);
        }
        $this->info('   ✅ VITAL RED cache cleared');

        // Clear all Laravel cache if requested
        if ($this->option('all')) {
            $this->line('🚀 Clearing all Laravel cache...');

            $this->call('cache:clear');
            $this->call('config:clear');
            $this->call('route:clear');
            $this->call('view:clear');

            $this->info('   ✅ All Laravel cache cleared');
        }

        $this->newLine();
        $this->info('✅ Cache clearing completed successfully!');

        // Show cache statistics after clearing
        $this->newLine();
        $this->line('📊 Current cache status:');
        $stats = $apiService->getCacheStats();

        foreach ($stats as $endpoint => $stat) {
            $status = $stat['cached'] ? '🟡 Cached' : '🟢 Clear';
            $this->line("   - {$endpoint}: {$status}");
        }
    }
}
