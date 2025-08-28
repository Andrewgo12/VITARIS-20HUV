<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OptimizeResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add performance headers
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Add cache headers for static assets
        if ($request->is('css/*') || $request->is('js/*') || $request->is('images/*')) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000'); // 1 year
        }

        // Add cache headers for API responses
        if ($request->is('api/*')) {
            $response->headers->set('Cache-Control', 'public, max-age=60'); // 1 minute
        }

        // Compress HTML responses
        if ($response->headers->get('Content-Type') === 'text/html; charset=UTF-8') {
            $content = $response->getContent();

            // Minify HTML (remove extra whitespace)
            $content = preg_replace('/\s+/', ' ', $content);
            $content = preg_replace('/>\s+</', '><', $content);

            $response->setContent($content);
        }

        return $response;
    }
}
