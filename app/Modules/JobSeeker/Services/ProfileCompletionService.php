<?php

namespace App\Modules\JobSeeker\Services;

use App\Models\JobSeekerProfile;
use App\Models\User;
use App\Modules\JobSeeker\Repositories\Contracts\EducationRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\JobSeekerSkillRepositoryInterface;
use App\Modules\JobSeeker\Repositories\Contracts\ResumeRepositoryInterface;

class ProfileCompletionService
{
    public function __construct(
        private readonly ExperienceRepositoryInterface $experiences,
        private readonly EducationRepositoryInterface $educations,
        private readonly JobSeekerSkillRepositoryInterface $skills,
        private readonly ResumeRepositoryInterface $resumes,
    ) {}

    /**
     * @return array{percentage: int, breakdown: array<string, array{weight: int, completed: bool, score: int}>}
     */
    public function calculate(JobSeekerProfile $profile, User $user): array
    {
        $breakdown = [
            'basic_info' => [
                'weight' => 15,
                'completed' => $this->hasBasicInfo($profile, $user),
                'score' => 0,
            ],
            'summary' => [
                'weight' => 10,
                'completed' => $this->hasSummary($profile),
                'score' => 0,
            ],
            'skills' => [
                'weight' => 15,
                'completed' => $this->skills->countForProfile($profile->id) >= 3,
                'score' => 0,
            ],
            'experience' => [
                'weight' => 25,
                'completed' => $this->experiences->countForProfile($profile->id) >= 1,
                'score' => 0,
            ],
            'education' => [
                'weight' => 15,
                'completed' => $this->educations->countForProfile($profile->id) >= 1,
                'score' => 0,
            ],
            'resume' => [
                'weight' => 20,
                'completed' => $this->resumes->hasResumeForProfile($profile->id)
                    || $profile->resume_file_id !== null,
                'score' => 0,
            ],
        ];

        $percentage = 0;

        foreach ($breakdown as $key => $section) {
            $score = $section['completed'] ? $section['weight'] : 0;
            $breakdown[$key]['score'] = $score;
            $percentage += $score;
        }

        return [
            'percentage' => min(100, $percentage),
            'breakdown' => $breakdown,
        ];
    }

    private function hasBasicInfo(JobSeekerProfile $profile, User $user): bool
    {
        return filled($user->first_name)
            && filled($user->last_name)
            && filled($profile->headline)
            && filled($profile->location_city)
            && filled($profile->location_country);
    }

    private function hasSummary(JobSeekerProfile $profile): bool
    {
        return filled($profile->summary) && strlen(trim($profile->summary)) > 50;
    }
}
