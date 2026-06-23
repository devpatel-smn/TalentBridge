<?php

use App\Modules\Application\Controllers\JobApplicationController;
use App\Modules\Interview\Controllers\JobSeekerInterviewController;
use App\Modules\JobSeeker\Controllers\DashboardController;
use App\Modules\JobSeeker\Controllers\EducationController;
use App\Modules\JobSeeker\Controllers\ExperienceController;
use App\Modules\JobSeeker\Controllers\JobPreferenceController;
use App\Modules\JobSeeker\Controllers\ProfileController;
use App\Modules\JobSeeker\Controllers\ResumeController;
use App\Modules\JobSeeker\Controllers\SavedJobController;
use App\Modules\JobSeeker\Controllers\SkillController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', DashboardController::class)->name('dashboard');

Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
Route::get('profile/completion', [ProfileController::class, 'completion'])->name('profile.completion');

Route::get('preferences', [JobPreferenceController::class, 'show'])->name('preferences.show');
Route::put('preferences', [JobPreferenceController::class, 'update'])->name('preferences.update');

Route::get('experiences', [ExperienceController::class, 'index'])->name('experiences.index');
Route::post('experiences', [ExperienceController::class, 'store'])->name('experiences.store');
Route::get('experiences/{experience}', [ExperienceController::class, 'show'])->name('experiences.show');
Route::put('experiences/{experience}', [ExperienceController::class, 'update'])->name('experiences.update');
Route::delete('experiences/{experience}', [ExperienceController::class, 'destroy'])->name('experiences.destroy');

Route::get('educations', [EducationController::class, 'index'])->name('educations.index');
Route::post('educations', [EducationController::class, 'store'])->name('educations.store');
Route::get('educations/{education}', [EducationController::class, 'show'])->name('educations.show');
Route::put('educations/{education}', [EducationController::class, 'update'])->name('educations.update');
Route::delete('educations/{education}', [EducationController::class, 'destroy'])->name('educations.destroy');

Route::get('skills', [SkillController::class, 'index'])->name('skills.index');
Route::post('skills', [SkillController::class, 'store'])->name('skills.store');
Route::delete('skills/{jobSeekerSkill}', [SkillController::class, 'destroy'])->name('skills.destroy');

Route::get('resumes', [ResumeController::class, 'index'])->name('resumes.index');
Route::post('resumes', [ResumeController::class, 'store'])->name('resumes.store');
Route::get('resumes/{resume:uuid}', [ResumeController::class, 'show'])->name('resumes.show');
Route::put('resumes/{resume:uuid}', [ResumeController::class, 'update'])->name('resumes.update');
Route::delete('resumes/{resume:uuid}', [ResumeController::class, 'destroy'])->name('resumes.destroy');
Route::patch('resumes/{resume:uuid}/sections', [ResumeController::class, 'updateSections'])->name('resumes.sections.update');
Route::post('resumes/{resume:uuid}/import-profile', [ResumeController::class, 'importFromProfile'])->name('resumes.import-profile');
Route::post('resumes/{resume:uuid}/export', [ResumeController::class, 'export'])->name('resumes.export');

Route::get('saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
Route::post('saved-jobs', [SavedJobController::class, 'store'])->name('saved-jobs.store');
Route::delete('saved-jobs/{jobUuid}', [SavedJobController::class, 'destroy'])->name('saved-jobs.destroy');

Route::get('applications', [JobApplicationController::class, 'index'])->name('applications.index');
Route::get('applications/{uuid}', [JobApplicationController::class, 'show'])->name('applications.show');
Route::delete('applications/{uuid}', [JobApplicationController::class, 'destroy'])->name('applications.destroy');

Route::get('interviews', [JobSeekerInterviewController::class, 'index'])->name('interviews.index');
Route::get('interviews/upcoming', [JobSeekerInterviewController::class, 'upcoming'])->name('interviews.upcoming');
Route::get('interviews/{interview:uuid}', [JobSeekerInterviewController::class, 'show'])->name('interviews.show');
Route::patch('interviews/{interview:uuid}/respond', [JobSeekerInterviewController::class, 'respond'])->name('interviews.respond');
Route::get('interviews/{interview:uuid}/timeline', [JobSeekerInterviewController::class, 'timeline'])->name('interviews.timeline');
