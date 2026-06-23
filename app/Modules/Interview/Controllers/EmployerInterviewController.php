<?php

namespace App\Modules\Interview\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Interview;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\Employer\Support\ResolvesEmployerCompany;
use App\Modules\Interview\Requests\CancelInterviewRequest;
use App\Modules\Interview\Requests\CompleteInterviewRequest;
use App\Modules\Interview\Requests\ListInterviewsRequest;
use App\Modules\Interview\Requests\ManageParticipantsRequest;
use App\Modules\Interview\Requests\RescheduleInterviewRequest;
use App\Modules\Interview\Requests\ScheduleInterviewRequest;
use App\Modules\Interview\Requests\SubmitInterviewFeedbackRequest;
use App\Modules\Interview\Requests\UpdateInterviewNotesRequest;
use App\Modules\Interview\Requests\UpdateInterviewStatusRequest;
use App\Modules\Interview\Resources\InterviewResource;
use App\Modules\Interview\Resources\InterviewTimelineResource;
use App\Modules\Interview\Services\InterviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployerInterviewController extends Controller
{
    use ApiResponds, ResolvesEmployerCompany;

    public function __construct(
        private readonly InterviewService $interviewService,
    ) {}

    public function index(ListInterviewsRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Interview::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->interviewService->listForCompany($this->companyId($request), $params);

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
        $paginator = $this->interviewService->listUpcomingForCompany($this->companyId($request), $params);

        return $this->paginated(
            InterviewResource::collection($paginator->items()),
            $paginator,
            'Upcoming interviews retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(ScheduleInterviewRequest $request): JsonResponse
    {
        $this->authorize('create', Interview::class);

        $interview = $this->interviewService->schedule(
            $this->companyId($request),
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->created(
            new InterviewResource($interview),
            'Interview scheduled successfully.'
        );
    }

    public function show(Request $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('view', $record);

        return $this->success(
            new InterviewResource($record),
            'Interview retrieved successfully.'
        );
    }

    public function reschedule(RescheduleInterviewRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $updated = $this->interviewService->reschedule(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview rescheduled successfully.'
        );
    }

    public function cancel(CancelInterviewRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $updated = $this->interviewService->cancel(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview cancelled successfully.'
        );
    }

    public function complete(CompleteInterviewRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $updated = $this->interviewService->complete(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview completed successfully.'
        );
    }

    public function updateStatus(UpdateInterviewStatusRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $updated = $this->interviewService->updateStatus(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview status updated successfully.'
        );
    }

    public function updateNotes(UpdateInterviewNotesRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $updated = $this->interviewService->updateNotes(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview notes updated successfully.'
        );
    }

    public function submitFeedback(SubmitInterviewFeedbackRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $updated = $this->interviewService->submitFeedback(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview feedback submitted successfully.'
        );
    }

    public function manageParticipants(ManageParticipantsRequest $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $updated = $this->interviewService->manageParticipants(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new InterviewResource($updated),
            'Interview participants updated successfully.'
        );
    }

    public function timeline(Request $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('view', $record);

        return $this->success(
            new InterviewTimelineResource($this->interviewService->timeline($record)),
            'Interview timeline retrieved successfully.'
        );
    }

    public function destroy(Request $request, Interview $interview): JsonResponse
    {
        $record = $this->interviewService->findForCompany($this->companyId($request), $interview->uuid);
        $this->authorize('manage', $record);

        $this->interviewService->delete($record, $request->user(), $request);

        return $this->success(null, 'Interview deleted successfully.');
    }
}
