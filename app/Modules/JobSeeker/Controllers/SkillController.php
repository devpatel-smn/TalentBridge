<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\JobSeekerSkill;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Requests\ListRequest;
use App\Modules\JobSeeker\Requests\StoreSkillRequest;
use App\Modules\JobSeeker\Resources\JobSeekerSkillResource;
use App\Modules\JobSeeker\Services\SkillService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly SkillService $skillService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', JobSeekerSkill::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->skillService->list($this->profileId($request), $params);

        return $this->paginated(
            JobSeekerSkillResource::collection($paginator->items()),
            $paginator,
            'Skills retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $this->authorize('create', JobSeekerSkill::class);

        $skill = $this->skillService->add(
            $this->profile($request),
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new JobSeekerSkillResource($skill),
            'Skill added successfully.'
        );
    }

    public function destroy(Request $request, int $jobSeekerSkill): JsonResponse
    {
        $record = $this->skillService->find($this->profileId($request), $jobSeekerSkill);
        $this->authorize('delete', $record);

        $this->skillService->remove($record, $request->user(), $request);

        return $this->success(message: 'Skill removed successfully.');
    }
}
