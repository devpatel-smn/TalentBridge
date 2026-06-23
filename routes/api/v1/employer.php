<?php

use App\Modules\Application\Controllers\EmployerApplicationController;
use App\Modules\Employer\Controllers\CompanyController;
use App\Modules\Employer\Controllers\CompanySettingsController;
use App\Modules\Employer\Controllers\CompanyVerificationController;
use App\Modules\Employer\Controllers\DashboardController;
use App\Modules\Employer\Controllers\TeamMemberController;
use App\Modules\Interview\Controllers\EmployerInterviewController;
use App\Modules\Job\Controllers\EmployerJobController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', DashboardController::class)->name('dashboard');

Route::get('company', [CompanyController::class, 'show'])->name('company.show');
Route::put('company', [CompanyController::class, 'update'])->name('company.update');

Route::get('company/settings', [CompanySettingsController::class, 'show'])->name('company.settings.show');
Route::put('company/settings', [CompanySettingsController::class, 'update'])->name('company.settings.update');

Route::get('company/verification', [CompanyVerificationController::class, 'show'])->name('company.verification.show');
Route::post('company/verification', [CompanyVerificationController::class, 'store'])->name('company.verification.store');

Route::get('team', [TeamMemberController::class, 'index'])->name('team.index');
Route::post('team', [TeamMemberController::class, 'store'])->name('team.store');
Route::get('team/{teamMember}', [TeamMemberController::class, 'show'])->name('team.show');
Route::put('team/{teamMember}', [TeamMemberController::class, 'update'])->name('team.update');
Route::delete('team/{teamMember}', [TeamMemberController::class, 'destroy'])->name('team.destroy');

Route::get('jobs', [EmployerJobController::class, 'index'])->name('jobs.index');
Route::post('jobs', [EmployerJobController::class, 'store'])->name('jobs.store');
Route::get('jobs/{uuid}', [EmployerJobController::class, 'show'])->name('jobs.show');
Route::put('jobs/{uuid}', [EmployerJobController::class, 'update'])->name('jobs.update');
Route::delete('jobs/{uuid}', [EmployerJobController::class, 'destroy'])->name('jobs.destroy');
Route::patch('jobs/{uuid}/publish', [EmployerJobController::class, 'publish'])->name('jobs.publish');
Route::patch('jobs/{uuid}/close', [EmployerJobController::class, 'close'])->name('jobs.close');
Route::patch('jobs/{uuid}/archive', [EmployerJobController::class, 'archive'])->name('jobs.archive');
Route::get('jobs/{uuid}/analytics', [EmployerJobController::class, 'analytics'])->name('jobs.analytics');
Route::get('jobs/{uuid}/applicants', [EmployerApplicationController::class, 'index'])->name('jobs.applicants.index');
Route::get('jobs/{uuid}/applicants/analytics', [EmployerApplicationController::class, 'analytics'])->name('jobs.applicants.analytics');
Route::get('applicants/{uuid}', [EmployerApplicationController::class, 'show'])->name('applicants.show');
Route::patch('applicants/{uuid}/status', [EmployerApplicationController::class, 'updateStatus'])->name('applicants.status.update');
Route::patch('applicants/{uuid}/notes', [EmployerApplicationController::class, 'updateNotes'])->name('applicants.notes.update');

Route::get('interviews', [EmployerInterviewController::class, 'index'])->name('interviews.index');
Route::get('interviews/upcoming', [EmployerInterviewController::class, 'upcoming'])->name('interviews.upcoming');
Route::post('interviews', [EmployerInterviewController::class, 'store'])->name('interviews.store');
Route::get('interviews/{interview:uuid}', [EmployerInterviewController::class, 'show'])->name('interviews.show');
Route::patch('interviews/{interview:uuid}/reschedule', [EmployerInterviewController::class, 'reschedule'])->name('interviews.reschedule');
Route::patch('interviews/{interview:uuid}/cancel', [EmployerInterviewController::class, 'cancel'])->name('interviews.cancel');
Route::patch('interviews/{interview:uuid}/complete', [EmployerInterviewController::class, 'complete'])->name('interviews.complete');
Route::patch('interviews/{interview:uuid}/status', [EmployerInterviewController::class, 'updateStatus'])->name('interviews.status.update');
Route::patch('interviews/{interview:uuid}/notes', [EmployerInterviewController::class, 'updateNotes'])->name('interviews.notes.update');
Route::patch('interviews/{interview:uuid}/feedback', [EmployerInterviewController::class, 'submitFeedback'])->name('interviews.feedback.submit');
Route::put('interviews/{interview:uuid}/participants', [EmployerInterviewController::class, 'manageParticipants'])->name('interviews.participants.update');
Route::get('interviews/{interview:uuid}/timeline', [EmployerInterviewController::class, 'timeline'])->name('interviews.timeline');
Route::delete('interviews/{interview:uuid}', [EmployerInterviewController::class, 'destroy'])->name('interviews.destroy');
