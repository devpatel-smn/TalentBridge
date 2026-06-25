<?php

namespace App\Modules\Employer\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\EmployerUser;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Employer\Requests\InviteTeamMemberRequest;
use App\Modules\Employer\Requests\ListTeamMembersRequest;
use App\Modules\Employer\Requests\UpdateTeamMemberRequest;
use App\Modules\Employer\Resources\TeamMemberResource;
use App\Modules\Employer\Services\TeamManagementService;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly TeamManagementService $teamService,
    ) {}

    public function index(ListTeamMembersRequest $request): JsonResponse
    {
        $this->authorize('viewAny', EmployerUser::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->teamService->list($this->companyId($request), $params);

        return $this->paginated(
            TeamMemberResource::collection($paginator->items()),
            $paginator,
            'Team members retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(InviteTeamMemberRequest $request): JsonResponse
    {
        $this->authorize('create', EmployerUser::class);

        $member = $this->teamService->invite(
            $this->companyId($request),
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new TeamMemberResource($member),
            $member->is_active && $member->joined_at !== null
                ? 'Team member added successfully.'
                : 'Team invitation sent successfully.'
        );
    }

    public function show(Request $request, EmployerUser $teamMember): JsonResponse
    {
        $member = $this->teamService->find($this->companyId($request), $teamMember->id);
        $this->authorize('view', $member);

        return $this->success(
            new TeamMemberResource($member),
            'Team member retrieved successfully.'
        );
    }

    public function update(UpdateTeamMemberRequest $request, EmployerUser $teamMember): JsonResponse
    {
        $member = $this->teamService->find($this->companyId($request), $teamMember->id);
        $this->authorize('update', $member);

        $updated = $this->teamService->update(
            $member,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new TeamMemberResource($updated),
            'Team member updated successfully.'
        );
    }

    public function destroy(Request $request, EmployerUser $teamMember): JsonResponse
    {
        $member = $this->teamService->find($this->companyId($request), $teamMember->id);
        $this->authorize('delete', $member);

        $this->teamService->remove($member, $request->user(), $request);

        return $this->success(message: 'Team member removed successfully.');
    }
}
