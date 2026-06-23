<?php

namespace App\Modules\Employer\Repositories;

use App\Models\EmployerUser;
use App\Modules\Admin\Support\AppliesListQuery;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Employer\Repositories\Contracts\EmployerTeamRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmployerTeamRepository implements EmployerTeamRepositoryInterface
{
    use AppliesListQuery;

    public function paginateByCompany(int $companyId, ListQueryParams $params): LengthAwarePaginator
    {
        $query = EmployerUser::query()
            ->with(['user', 'inviter'])
            ->where('company_id', $companyId);

        if ($params->search) {
            $search = '%'.$params->search.'%';
            $query->whereHas('user', function ($userQuery) use ($search) {
                $userQuery->where('email', 'ilike', $search)
                    ->orWhere('first_name', 'ilike', $search)
                    ->orWhere('last_name', 'ilike', $search);
            });
        }

        $this->applyListQuery(
            $query,
            $params,
            [],
            ['id', 'job_title', 'is_primary', 'is_active', 'joined_at', 'created_at'],
        );

        return $query->paginate(perPage: $params->perPage, page: $params->page);
    }

    public function findByIdForCompany(int $id, int $companyId): ?EmployerUser
    {
        return EmployerUser::query()
            ->with(['user', 'inviter'])
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function findByUserAndCompany(int $userId, int $companyId): ?EmployerUser
    {
        return EmployerUser::query()
            ->with(['user', 'inviter'])
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->first();
    }

    public function create(array $attributes): EmployerUser
    {
        return EmployerUser::query()
            ->create($attributes)
            ->load(['user', 'inviter']);
    }

    public function update(EmployerUser $member, array $attributes): EmployerUser
    {
        $member->update($attributes);

        return $member->fresh(['user', 'inviter']);
    }

    public function delete(EmployerUser $member): bool
    {
        return (bool) $member->delete();
    }

    public function countActiveByCompany(int $companyId): int
    {
        return EmployerUser::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->count();
    }

    public function clearPrimaryForCompany(int $companyId): void
    {
        EmployerUser::query()
            ->where('company_id', $companyId)
            ->where('is_primary', true)
            ->update(['is_primary' => false]);
    }
}
