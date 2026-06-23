<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Experience;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Requests\ListRequest;
use App\Modules\JobSeeker\Requests\StoreExperienceRequest;
use App\Modules\JobSeeker\Requests\UpdateExperienceRequest;
use App\Modules\JobSeeker\Resources\ExperienceResource;
use App\Modules\JobSeeker\Services\ExperienceService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly ExperienceService $experienceService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Experience::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->experienceService->list($this->profileId($request), $params);

        return $this->paginated(
            ExperienceResource::collection($paginator->items()),
            $paginator,
            'Experiences retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(StoreExperienceRequest $request): JsonResponse
    {
        $this->authorize('create', Experience::class);

        $experience = $this->experienceService->create(
            $this->profile($request),
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new ExperienceResource($experience),
            'Experience created successfully.'
        );
    }

    public function show(Request $request, int $experience): JsonResponse
    {
        $record = $this->experienceService->find($this->profileId($request), $experience);
        $this->authorize('view', $record);

        return $this->success(
            new ExperienceResource($record),
            'Experience retrieved successfully.'
        );
    }

    public function update(UpdateExperienceRequest $request, int $experience): JsonResponse
    {
        $record = $this->experienceService->find($this->profileId($request), $experience);
        $this->authorize('update', $record);

        $updated = $this->experienceService->update(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new ExperienceResource($updated),
            'Experience updated successfully.'
        );
    }

    public function destroy(Request $request, int $experience): JsonResponse
    {
        $record = $this->experienceService->find($this->profileId($request), $experience);
        $this->authorize('delete', $record);

        $this->experienceService->delete($record, $request->user(), $request);

        return $this->success(message: 'Experience deleted successfully.');
    }
}
