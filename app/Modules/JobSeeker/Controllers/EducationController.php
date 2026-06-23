<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Education;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Requests\ListRequest;
use App\Modules\JobSeeker\Requests\StoreEducationRequest;
use App\Modules\JobSeeker\Requests\UpdateEducationRequest;
use App\Modules\JobSeeker\Resources\EducationResource;
use App\Modules\JobSeeker\Services\EducationService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly EducationService $educationService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Education::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->educationService->list($this->profileId($request), $params);

        return $this->paginated(
            EducationResource::collection($paginator->items()),
            $paginator,
            'Educations retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(StoreEducationRequest $request): JsonResponse
    {
        $this->authorize('create', Education::class);

        $education = $this->educationService->create(
            $this->profile($request),
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new EducationResource($education),
            'Education created successfully.'
        );
    }

    public function show(Request $request, int $education): JsonResponse
    {
        $record = $this->educationService->find($this->profileId($request), $education);
        $this->authorize('view', $record);

        return $this->success(
            new EducationResource($record),
            'Education retrieved successfully.'
        );
    }

    public function update(UpdateEducationRequest $request, int $education): JsonResponse
    {
        $record = $this->educationService->find($this->profileId($request), $education);
        $this->authorize('update', $record);

        $updated = $this->educationService->update(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new EducationResource($updated),
            'Education updated successfully.'
        );
    }

    public function destroy(Request $request, int $education): JsonResponse
    {
        $record = $this->educationService->find($this->profileId($request), $education);
        $this->authorize('delete', $record);

        $this->educationService->delete($record, $request->user(), $request);

        return $this->success(message: 'Education deleted successfully.');
    }
}
