<?php

namespace App\Modules\Admin\Services;

use App\Models\EmployerUser;
use App\Modules\Admin\Repositories\Contracts\AdminEmployerRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class EmployerManagementService
{
    public function __construct(
        private readonly AdminEmployerRepositoryInterface $employers,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->employers->paginate($params);
    }

    public function find(int $id): EmployerUser
    {
        return $this->employers->findById($id)
            ?? throw ValidationException::withMessages(['id' => ['Employer not found.']]);
    }
}
