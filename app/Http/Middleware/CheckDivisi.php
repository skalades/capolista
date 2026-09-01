<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDivisi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $divisi): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->canAccessDivisi($divisi)) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Akses ditolak. Divisi tidak sesuai.'], 403);
            }
            abort(403, 'Anda tidak memiliki akses ke divisi ini.');
        }

        return $next($request);
    }
}
