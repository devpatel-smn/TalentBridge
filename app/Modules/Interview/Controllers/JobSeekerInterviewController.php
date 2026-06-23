<?php

namespace App\Modules\Interview\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Interview;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Interview\Requests\ListInterviewsRequest;
use App\Modules\Interview\Requests\RespondInterviewRequest;
use App\Modules\Interview\Resources\InterviewResource;
use App\Modules\Interview\Resources\InterviewTimelineResource;
use App\Modules\Interview\Services\InterviewService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobSeekerInterviewController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly InterviewService $interviewService,
    ) {}

    public function index(ListInterviewsRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Interview::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->interviewService->listForProfile($this->profileId($request), $params);

        return $this->paginated(
            InterviewResource::collection($paginator->items()),
            $paginator,
            'Interviews retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function upcoming(ListInterviewsRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Interview::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->interviewService->listUpcomingForProfile($this->profileId($request), $params);

        return $this->paginated(
            InterviewResource::collection($paginator->items()),
            $paginator,
            'Upcoming interviews retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function show(Request $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForProfile($this->profileId($request), $interview->uuid);
        $this->authorize('view', $record);

        return $this->success(
            new InterviewResource($record),
            'Interview retrieved successfully.'
        );
    }

    public function respond(RespondInterviewRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForProfile($this->profileId($request), $interview->uuid);
        $this->authorize('respond', $record);

        $updated = $this->interviewService->respond(
            $record,
            $request->user(),
            $request->validated(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview response recorded successfully.'
        );
    }

    public function timeline(Request $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForProfile($this->profileId($request), $interview->uuid);
        $this->authorize('view', $record);

        return $this->success(
            new InterviewTimelineResource($this->interviewService->timeline($record)),
            'Interview timeline retrieved successfully.'
        );
    }
}
