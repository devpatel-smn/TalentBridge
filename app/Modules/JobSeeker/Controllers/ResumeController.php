<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\Resume;
use App\Modules\Admin\Support\ListQueryParams;
use App\Modules\JobSeeker\Requests\ListRequest;
use App\Modules\JobSeeker\Requests\StoreResumeRequest;
use App\Modules\JobSeeker\Requests\UpdateResumeRequest;
use App\Modules\JobSeeker\Requests\UpdateResumeSectionsRequest;
use App\Modules\JobSeeker\Resources\ResumeResource;
use App\Modules\JobSeeker\Services\ResumeBuilderService;
use App\Modules\JobSeeker\Services\ResumeUploadService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResumeController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly ResumeUploadService $uploadService,
        private readonly ResumeBuilderService $builderService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('create', Resume::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->uploadService->list($this->profileId($request), $params);

        return $this->paginated(
            ResumeResource::collection($paginator->items()),
            $paginator,
            'Resumes retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(StoreResumeRequest $request): JsonResponse
    {
        $this->authorize('create', Resume::class);

        $data = $request->validated();
        $profile = $this->profile($request);

        $resume = $data['source'] === Resume::SOURCE_BUILDER
            ? $this->builderService->create($profile, $data, $request->user(), $request)
            : $this->uploadService->upload($profile, $data, $request->user(), $request);

        return $this->created(
            new ResumeResource($resume),
            'Resume created successfully.'
        );
    }

    public function show(Request $request, Resume $resume): JsonResponse
    {
        $record = $this->uploadService->find($this->profileId($request), $resume->uuid);
        $this->authorize('view', $record);

        return $this->success(
            new ResumeResource($record),
            'Resume retrieved successfully.'
        );
    }

    public function update(UpdateResumeRequest $request, Resume $resume): JsonResponse
    {
        $record = $this->uploadService->find($this->profileId($request), $resume->uuid);
        $this->authorize('manage', $record);

        $updated = $record->source === Resume::SOURCE_BUILDER
            ? $this->builderService->update($record, $request->validated(), $request->user(), $request)
            : $this->uploadService->update($record, $request->validated(), $request->user(), $request);

        return $this->success(
            new ResumeResource($updated),
            'Resume updated successfully.'
        );
    }

    public function destroy(Request $request, Resume $resume): JsonResponse
    {
        $record = $this->uploadService->find($this->profileId($request), $resume->uuid);
        $this->authorize('delete', $record);

        $this->uploadService->delete($record, $request->user(), $request);

        return $this->success(message: 'Resume deleted successfully.');
    }

    public function updateSections(UpdateResumeSectionsRequest $request, Resume $resume): JsonResponse
    {
        $record = $this->uploadService->find($this->profileId($request), $resume->uuid);
        $this->authorize('manage', $record);

        $updated = $this->builderService->updateSections(
            $record,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new ResumeResource($updated),
            'Resume sections updated successfully.'
        );
    }

    public function importFromProfile(Request $request, Resume $resume): JsonResponse
    {
        $record = $this->uploadService->find($this->profileId($request), $resume->uuid);
        $this->authorize('manage', $record);

        $updated = $this->builderService->importFromProfile(
            $record,
            $request->user(),
            $request
        );

        return $this->success(
            new ResumeResource($updated),
            'Profile data imported into resume successfully.'
        );
    }

    public function export(Request $request, Resume $resume): JsonResponse
    {
        $record = $this->uploadService->find($this->profileId($request), $resume->uuid);
        $this->authorize('manage', $record);

        $result = $this->builderService->export($record, $request->user(), $request);

        return $this->success([
            'resume' => new ResumeResource($result['resume']),
            'export_status' => $result['export_status'],
            'file_uuid' => $result['file_uuid'],
        ], 'Resume export prepared successfully.');
    }
}
