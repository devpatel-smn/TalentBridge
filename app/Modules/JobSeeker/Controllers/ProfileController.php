<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\JobSeeker\Requests\UpdateProfileRequest;
use App\Modules\JobSeeker\Resources\ProfileCompletionResource;
use App\Modules\JobSeeker\Resources\ProfileResource;
use App\Modules\JobSeeker\Services\ProfileService;
use App\Modules\JobSeeker\Support\ResolvesJobSeekerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ApiResponds, ResolvesJobSeekerProfile;

    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $profile = $this->profileService->getProfile($request->user());
        $this->authorize('view', $profile);

        return $this->success(
            new ProfileResource($profile),
            'Profile retrieved successfully.'
        );
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $profile = $this->profile($request);
        $this->authorize('update', $profile);

        $updated = $this->profileService->updateProfile(
            $profile,
            $request->validated(),
            $request->user(),
            $request
        );

        return $this->success(
            new ProfileResource($updated),
            'Profile updated successfully.'
        );
    }

    public function completion(Request $request): JsonResponse
    {
        $profile = $this->profile($request);
        $this->authorize('view', $profile);

        return $this->success(
            new ProfileCompletionResource(
                $this->profileService->getCompletion($profile, $request->user())
            ),
            'Profile completion retrieved successfully.'
        );
    }
}
