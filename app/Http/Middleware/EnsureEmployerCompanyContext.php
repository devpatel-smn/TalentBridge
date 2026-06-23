<?php

namespace App\Http\Middleware;

use App\Models\Company;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmployerCompanyContext
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isEmployer()) {
            return response()->json([
                'success' => false,
                'message' => 'Employer access required.',
                'data' => null,
                'meta' => null,
                'errors' => null,
                'code' => 'FORBIDDEN',
            ], 403);
        }

        $headerCompanyId = $request->header('X-Company-Id');

        if ($headerCompanyId !== null) {
            if (! $user->belongsToCompany((int) $headerCompanyId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not a member of the selected company.',
                    'data' => null,
                    'meta' => null,
                    'errors' => null,
                    'code' => 'FORBIDDEN',
                ], 403);
            }

            $companyId = (int) $headerCompanyId;
        } else {
            $membership = $user->employerUsers()
                ->where('is_active', true)
                ->orderByDesc('is_primary')
                ->first();

            if (! $membership) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active company membership found.',
                    'data' => null,
                    'meta' => null,
                    'errors' => null,
                    'code' => 'FORBIDDEN',
                ], 403);
            }

            $companyId = $membership->company_id;
        }

        $company = Company::query()->find($companyId);

        if (! $company) {
            return response()->json([
                'success' => false,
                'message' => 'Company not found.',
                'data' => null,
                'meta' => null,
                'errors' => null,
                'code' => 'NOT_FOUND',
            ], 404);
        }

        $request->attributes->set('company_id', $companyId);
        $request->attributes->set('company', $company);

        return $next($request);
    }
}
