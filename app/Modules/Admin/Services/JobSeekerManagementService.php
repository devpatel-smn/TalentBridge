<?php

namespace App\Modules\Admin\Services;

use App\Models\JobSeekerProfile;
use App\Modules\Admin\Repositories\Contracts\AdminJobSeekerRepositoryInterface;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class JobSeekerManagementService
{
    public function __construct(
        private readonly AdminJobSeekerRepositoryInterface $jobSeekers,
    ) {}

    public function list(ListQueryParams $params): LengthAwarePaginator
    {
        return $this->jobSeekers->paginate($params);
    }

    public function find(string $uuid): JobSeekerProfile
    {
        return $this->jobSeekers->findByUuid($uuid)
            ?? throw ValidationException::withMessages(['uuid' => ['Job seeker profile not found.']]);
    }
}
