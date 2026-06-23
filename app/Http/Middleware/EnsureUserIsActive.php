<?php

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
                'data' => null,
                'meta' => null,
                'errors' => null,
                'code' => 'UNAUTHENTICATED',
            ], 401);
        }

        if ($user->status === UserStatus::Suspended) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended.',
                'data' => null,
                'meta' => null,
                'errors' => null,
                'code' => 'FORBIDDEN',
            ], 403);
        }

        if ($user->status === UserStatus::Inactive) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive.',
                'data' => null,
                'meta' => null,
                'errors' => null,
                'code' => 'FORBIDDEN',
            ], 403);
        }

        return $next($request);
    }
}
