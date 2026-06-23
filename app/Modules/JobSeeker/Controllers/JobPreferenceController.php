<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\JobSeeker\Requests\UpdateJobPreferencesRequest;
use App\Modules\JobSeeker\Resources\JobPreferencesResource;
use App\Modules\JobSeeker\Services\ProfileService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobPreferenceController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $profile = $this->profile($request);
        $this->authorize('view', $profile);

        return $this->success(
            new JobPreferencesResource($profile),
            'Job preferences retrieved successfully.'
        );
    }

    public function update(UpdateJobPreferencesRequest $request): JsonResponse
    {
        $profile = $this->profile($request);
        $this->authorize('update', $profile);

        $updated = $this->profileService->updatePreferences(
            $profile,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new JobPreferencesResource($updated),
            'Job preferences updated successfully.'
        );
    }
}
