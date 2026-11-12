<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        // 1. If not authenticated, return 401 Unauthorized
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // 2. If authenticated but role does not match, return 403 Forbidden
        if ($user->role !== $role) {
            return response()->json([
                'message' => "Forbidden: You do not have '{$role}' privileges to perform this action."
            ], 403);
        }

        return $next($request);
    }
}
