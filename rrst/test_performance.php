<?php

/**
 * VITAL RED System - Performance Test Script
 * Tests loading times for all views and routes
 */

$baseUrl = 'http://127.0.0.1:8000';

// Routes to test
$routes = [
    'Login Page' => '/login',
    'Admin Dashboard' => '/admin/dashboard',
    'Admin Users' => '/admin/users',
    'Admin Config' => '/admin/config',
    'Admin Backup' => '/admin/backup',
    'Admin Supervision' => '/admin/supervision',
    'Admin AI Monitor' => '/admin/ai-monitor',
    'Medico Dashboard' => '/medico/dashboard',
    'Medico Casos' => '/medico/casos',
    'Medico Pacientes' => '/medico/pacientes',
    'Medico Urgencias' => '/medico/urgencias',
    'Medico Hospitalizados' => '/medico/hospitalizados',
    'Medico Historial' => '/medico/historial',
];

// API routes to test
$apiRoutes = [
    'Health Check' => '/api/vital-red/health',
    'Status' => '/api/vital-red/status',
    'Medical Cases' => '/api/vital-red/medical-cases',
    'Patient Data' => '/api/vital-red/patient-data',
    'Urgency Data' => '/api/vital-red/urgency-data',
    'Hospitalization Data' => '/api/vital-red/hospitalization-data',
    'Historical Data' => '/api/vital-red/historical-data',
    'Admin Data' => '/api/vital-red/admin-data',
];

echo "🏥 VITAL RED System - Performance Test\n";
echo "=====================================\n\n";

// Test function
function testRoute($name, $url, $expectJson = false) {
    $startTime = microtime(true);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $totalTime = curl_getinfo($ch, CURLINFO_TOTAL_TIME);
    $error = curl_error($ch);
    curl_close($ch);
    
    $endTime = microtime(true);
    $loadTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
    
    // Status indicators
    $status = '❌';
    $message = '';
    
    if ($error) {
        $message = "Error: $error";
    } elseif ($httpCode >= 200 && $httpCode < 300) {
        $status = '✅';
        $message = "OK";
    } elseif ($httpCode >= 300 && $httpCode < 400) {
        $status = '🔄';
        $message = "Redirect";
    } elseif ($httpCode >= 400 && $httpCode < 500) {
        $status = '⚠️ ';
        $message = "Client Error ($httpCode)";
    } else {
        $status = '❌';
        $message = "Server Error ($httpCode)";
    }
    
    // Performance rating
    $perfRating = '';
    if ($loadTime < 100) {
        $perfRating = '🚀 Excellent';
    } elseif ($loadTime < 300) {
        $perfRating = '⚡ Good';
    } elseif ($loadTime < 500) {
        $perfRating = '🟡 Fair';
    } elseif ($loadTime < 1000) {
        $perfRating = '🟠 Slow';
    } else {
        $perfRating = '🔴 Very Slow';
    }
    
    printf("%-25s %s %-15s %6.0fms %s\n", 
        $name, 
        $status, 
        $message, 
        $loadTime, 
        $perfRating
    );
    
    return [
        'name' => $name,
        'status' => $httpCode,
        'time' => $loadTime,
        'success' => $httpCode >= 200 && $httpCode < 400
    ];
}

// Test web routes
echo "🌐 Testing Web Routes:\n";
echo "Route                     Status Message         Time   Performance\n";
echo "─────────────────────────────────────────────────────────────────────\n";

$webResults = [];
foreach ($routes as $name => $route) {
    $result = testRoute($name, $baseUrl . $route);
    $webResults[] = $result;
    usleep(100000); // 100ms delay between requests
}

echo "\n";

// Test API routes
echo "📡 Testing API Routes:\n";
echo "Route                     Status Message         Time   Performance\n";
echo "─────────────────────────────────────────────────────────────────────\n";

$apiResults = [];
foreach ($apiRoutes as $name => $route) {
    $result = testRoute($name, $baseUrl . $route, true);
    $apiResults[] = $result;
    usleep(100000); // 100ms delay between requests
}

echo "\n";

// Calculate statistics
$allResults = array_merge($webResults, $apiResults);
$successfulResults = array_filter($allResults, fn($r) => $r['success']);
$times = array_column($successfulResults, 'time');

if (!empty($times)) {
    $avgTime = array_sum($times) / count($times);
    $minTime = min($times);
    $maxTime = max($times);
    $successRate = (count($successfulResults) / count($allResults)) * 100;
    
    echo "📊 Performance Summary:\n";
    echo "═══════════════════════\n";
    printf("Total Routes Tested:    %d\n", count($allResults));
    printf("Successful Responses:   %d (%.1f%%)\n", count($successfulResults), $successRate);
    printf("Average Load Time:      %.0fms\n", $avgTime);
    printf("Fastest Response:       %.0fms\n", $minTime);
    printf("Slowest Response:       %.0fms\n", $maxTime);
    
    echo "\n🎯 Performance Rating: ";
    if ($avgTime < 200) {
        echo "🚀 Excellent - System is highly optimized!\n";
    } elseif ($avgTime < 400) {
        echo "⚡ Good - System performance is solid\n";
    } elseif ($avgTime < 600) {
        echo "🟡 Fair - Consider optimization\n";
    } else {
        echo "🔴 Needs Improvement - Optimization required\n";
    }
    
    echo "\n💡 Recommendations:\n";
    if ($avgTime > 300) {
        echo "   - Run 'php artisan vital-red:optimize --production'\n";
        echo "   - Enable OPcache in PHP\n";
        echo "   - Consider using Redis for caching\n";
    }
    if ($successRate < 100) {
        echo "   - Check failed routes and fix any issues\n";
        echo "   - Verify authentication and authorization\n";
    }
    echo "   - Monitor performance regularly\n";
    echo "   - Use a CDN for static assets in production\n";
    
} else {
    echo "❌ No successful responses - check system status\n";
}

echo "\n🏥 VITAL RED Performance Test Complete\n";
echo "Generated: " . date('Y-m-d H:i:s') . "\n";
