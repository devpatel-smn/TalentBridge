<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful as SanctumMiddleware;

class EnsureFrontendRequestsAreStateful extends SanctumMiddleware
{
    /**
     * Treat first-party SPA requests as stateful even when the Origin header
     * is missing or does not exactly match configured Sanctum domains.
     */
    public static function fromFrontend($request): bool
    {
        if (parent::fromFrontend($request)) {
            return true;
        }

        if (! static::requestLooksLikeSpa($request)) {
            return false;
        }

        $stateful = array_filter(config('sanctum.stateful', []));

        foreach ([$request->getHttpHost(), $request->getHost()] as $host) {
            if (in_array($host, $stateful, true)) {
                return true;
            }
        }

        return false;
    }

    private static function requestLooksLikeSpa(Request $request): bool
    {
        return $request->hasHeader('X-XSRF-TOKEN')
            || $request->cookies->has('XSRF-TOKEN')
            || $request->headers->get('X-Requested-With') === 'XMLHttpRequest';
    }

}
