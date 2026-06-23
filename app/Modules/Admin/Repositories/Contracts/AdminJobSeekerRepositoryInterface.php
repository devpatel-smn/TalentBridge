<?php

namespace App\Modules\Admin\Repositories\Contracts;

use App\Models\JobSeekerProfile;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminJobSeekerRepositoryInterface
{
    public function paginate(ListQueryParams $params): LengthAwarePaginator;

    public function findByUuid(string $uuid): ?JobSeekerProfile;
}
