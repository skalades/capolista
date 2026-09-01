<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckLevel
{
    /**
     * Level hierarchy: 0=Superadmin, 1=Owner, 2=Admin, 3=Kepala Divisi, 4=Staf, 5=Customer
     * Parameter: level:0,1,2 -> hanya level tersebut yang diizinkan
     */
    public function handle(Request $request, Closure $next, string ...$levels): Response
    {
        $user = $request->user();
        
        if (!$user || !in_array((string)$user->level_akses, $levels, true)) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Akses ditolak.'], 403);
            }
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
