<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCurrentHostIsStateful
{
    public function handle(Request $request, Closure $next): Response
    {
        $statefulHosts = collect(config('sanctum.stateful', []))
            ->flatMap(function (string $host): array {
                $host = trim($host);

                return $host === '' ? [] : [$host];
            })
            ->merge([
                $request->getHost(),
                $request->getHttpHost(),
            ])
            ->filter()
            ->unique()
            ->values()
            ->all();

        config(['sanctum.stateful' => $statefulHosts]);

        return $next($request);
    }
}
