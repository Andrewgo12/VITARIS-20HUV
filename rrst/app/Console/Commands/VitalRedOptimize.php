<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class VitalRedOptimize extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vital-red:optimize {--production : Optimize for production environment}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize VITAL RED system for better performance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Optimizing VITAL RED System...');
        $this->newLine();

        // Clear all caches first
        $this->line('🧹 Clearing caches...');
        $this->call('vital-red:cache-clear', ['--all' => true]);

        // Optimize configuration
        $this->line('⚙️  Optimizing configuration...');
        $this->call('config:cache');
        $this->info('   ✅ Configuration cached');

        // Optimize routes
        $this->line('🛣️  Optimizing routes...');
        $this->call('route:cache');
        $this->info('   ✅ Routes cached');

        // Optimize views
        $this->line('👁️  Optimizing views...');
        $this->call('view:cache');
        $this->info('   ✅ Views cached');

        if ($this->option('production')) {
            $this->line('🏭 Applying production optimizations...');

            // Optimize autoloader
            $this->line('📦 Optimizing autoloader...');
            $this->call('optimize');
            $this->info('   ✅ Autoloader optimized');

            // Additional production optimizations
            $this->warn('   ⚠️  Make sure to set APP_ENV=production and APP_DEBUG=false in .env');
        }

        // Show optimization results
        $this->newLine();
        $this->info('✅ VITAL RED System optimization completed!');
        $this->newLine();

        $this->line('📊 Optimization Summary:');
        $this->line('   - Configuration: Cached');
        $this->line('   - Routes: Cached');
        $this->line('   - Views: Cached');
        $this->line('   - API Cache: Cleared and ready');

        if ($this->option('production')) {
            $this->line('   - Autoloader: Optimized for production');
        }

        $this->newLine();
        $this->line('🎯 Performance Tips:');
        $this->line('   - Use Redis for cache in production');
        $this->line('   - Enable OPcache in PHP');
        $this->line('   - Use a CDN for static assets');
        $this->line('   - Monitor with APM tools');
    }
}
