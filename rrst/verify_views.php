<?php

/**
 * VITAL RED System - View Verification Script
 * Quick test to verify all views are loading correctly
 */

$baseUrl = 'http://127.0.0.1:8000';

// Test routes
$routes = [
    'Login' => '/login',
    'Medico Dashboard' => '/medico/dashboard',
    'Medico Casos' => '/medico/casos',
    'Medico Pacientes' => '/medico/pacientes',
    'Medico Urgencias' => '/medico/urgencias',
    'Medico Hospitalizados' => '/medico/hospitalizados',
    'Medico Historial' => '/medico/historial',
    'Admin Dashboard' => '/admin/dashboard',
    'Admin Users' => '/admin/users',
    'Admin Config' => '/admin/config',
    'Admin Backup' => '/admin/backup',
    'Admin Supervision' => '/admin/supervision',
    'Admin AI Monitor' => '/admin/ai-monitor',
];

echo "🏥 VITAL RED - View Verification\n";
echo "================================\n\n";

function testRoute($name, $url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_HEADER, false);
    
    $startTime = microtime(true);
    $response = curl_exec($ch);
    $endTime = microtime(true);
    
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    $loadTime = ($endTime - $startTime) * 1000;
    
    // Check if response contains expected elements
    $hasHtml = strpos($response, '<html') !== false;
    $hasTailwind = strpos($response, 'tailwindcss') !== false;
    $hasLucide = strpos($response, 'lucide') !== false;
    $hasContent = strlen($response) > 1000; // Basic content check
    
    $status = '❌';
    $issues = [];
    
    if ($error) {
        $issues[] = "Connection error: $error";
    } elseif ($httpCode >= 200 && $httpCode < 300) {
        $status = '✅';
        if (!$hasHtml) $issues[] = 'No HTML structure';
        if (!$hasTailwind) $issues[] = 'Tailwind CSS missing';
        if (!$hasLucide) $issues[] = 'Lucide icons missing';
        if (!$hasContent) $issues[] = 'Content too short';
        
        if (!empty($issues)) {
            $status = '⚠️ ';
        }
    } elseif ($httpCode >= 300 && $httpCode < 400) {
        $status = '🔄';
        $issues[] = "Redirect ($httpCode)";
    } else {
        $issues[] = "HTTP Error ($httpCode)";
    }
    
    $issueText = empty($issues) ? 'OK' : implode(', ', $issues);
    
    printf("%-20s %s %-30s %6.0fms\n", 
        $name, 
        $status, 
        $issueText, 
        $loadTime
    );
    
    return [
        'success' => $httpCode >= 200 && $httpCode < 400 && empty($issues),
        'time' => $loadTime,
        'issues' => $issues
    ];
}

echo "Route                Status Issues                        Time\n";
echo "─────────────────────────────────────────────────────────────────\n";

$results = [];
foreach ($routes as $name => $route) {
    $result = testRoute($name, $baseUrl . $route);
    $results[] = $result;
    usleep(200000); // 200ms delay
}

echo "\n";

// Summary
$successful = array_filter($results, fn($r) => $r['success']);
$successRate = (count($successful) / count($results)) * 100;
$avgTime = array_sum(array_column($results, 'time')) / count($results);

echo "📊 Summary:\n";
echo "═══════════\n";
printf("Routes tested: %d\n", count($results));
printf("Successful: %d (%.1f%%)\n", count($successful), $successRate);
printf("Average load time: %.0fms\n", $avgTime);

if ($successRate == 100) {
    echo "\n🎉 All views are loading correctly!\n";
} elseif ($successRate >= 80) {
    echo "\n⚠️  Most views are working, check failed routes\n";
} else {
    echo "\n❌ Multiple issues detected, system needs attention\n";
}

echo "\n💡 Tips:\n";
echo "- Clear cache: php artisan view:clear\n";
echo "- Restart server if needed\n";
echo "- Check browser console for JS errors\n";
echo "- Verify Tailwind CSS is loading\n";

echo "\nTest completed: " . date('Y-m-d H:i:s') . "\n";
