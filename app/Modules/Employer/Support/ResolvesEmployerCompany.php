<?php

namespace App\Modules\Employer\Support;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

trait ResolvesEmployerCompany
{
    protected function companyId(Request $request): int
    {
        $companyId = $request->attributes->get('company_id');

        if (! is_int($companyId) && ! is_numeric($companyId)) {
            throw ValidationException::withMessages([
                'company' => ['No active company context found.'],
            ]);
        }

        return (int) $companyId;
    }

    protected function company(Request $request): Company
    {
        $company = $request->attributes->get('company');

        if ($company instanceof Company) {
            return $company;
        }

        throw ValidationException::withMessages([
            'company' => ['No active company context found.'],
        ]);
    }
}
