<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\SavedJob;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Requests\ListRequest;
use App\Modules\JobSeeker\Requests\StoreSavedJobRequest;
use App\Modules\JobSeeker\Resources\SavedJobResource;
use App\Modules\JobSeeker\Services\SavedJobService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly SavedJobService $savedJobService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', SavedJob::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->savedJobService->list($this->profileId($request), $params);

        return $this->paginated(
            SavedJobResource::collection($paginator->items()),
            $paginator,
            'Saved jobs retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(StoreSavedJobRequest $request): JsonResponse
    {
        $this->authorize('create', SavedJob::class);

        $savedJob = $this->savedJobService->save(
            $this->profile($request),
            $request->validated('job_uuid'),
            $request->user(),
            $request
        );

        return $this->created(
            new SavedJobResource($savedJob),
            'Job saved successfully.'
        );
    }

    public function destroy(Request $request, string $jobUuid): JsonResponse
    {
        $profileId = $this->profileId($request);
        $savedJob = $this->savedJobService->findByJobUuid($profileId, $jobUuid)
            ?? abort(404, 'Saved job not found.');

        $this->authorize('delete', $savedJob);

        $this->savedJobService->unsave(
            $this->profile($request),
            $jobUuid,
            $request->user(),
            $request
        );

        return $this->success(message: 'Saved job removed successfully.');
    }
}
