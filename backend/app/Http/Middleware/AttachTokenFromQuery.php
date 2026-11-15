<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AttachTokenFromQuery
{
    /**
     * Handle an incoming request.
     * If the client provides a token query parameter and no Authorization header,
     * convert it to an Authorization: Bearer <token> header for Sanctum authentication.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->bearerToken() && $request->filled('token')) {
            $request->headers->set('Authorization', 'Bearer ' . $request->query('token'));
        }

        return $next($request);
    }
}
