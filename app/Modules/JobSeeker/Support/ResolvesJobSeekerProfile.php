<?php

namespace App\Modules\JobSeeker\Support;

use App\Models\JobSeekerProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

trait ResolvesJobSeekerProfile
{
    protected function profileId(Request $request): int
    {
        $profile = $this->profile($request);

        return $profile->id;
    }

    protected function profile(Request $request): JobSeekerProfile
    {
        $profile = $request->user()?->jobSeekerProfile;

        if (! $profile instanceof JobSeekerProfile) {
            throw ValidationException::withMessages([
                'profile' => ['Job seeker profile not found.'],
            ]);
        }

        return $profile;
    }
}
