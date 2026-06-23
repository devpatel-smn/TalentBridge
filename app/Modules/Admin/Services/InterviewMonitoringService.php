<?php

namespace App\Modules\Admin\Services;

use App\Models\Interview;
use App\Modules\Admin\Repositories\Contracts\AdminInterviewRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class InterviewMonitoringService
{
    public function __construct(
        private readonly AdminInterviewRepositoryInterface $interviews,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->interviews->paginate($params);
    }

    public function find(string $uuid): Interview
    {
        return $this->interviews->findByUuid($uuid)
            ?? throw ValidationException::withMessages(['uuid' => ['Interview not found.']]);
    }
}
