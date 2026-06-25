<?php

use App\Models\Role;
use App\Modules\Application\Controllers\JobApplicationController;
use App\Modules\Auth\Controllers\AuthController;
use App\Modules\Auth\Controllers\TeamInvitationController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');

    Route::middleware('throttle:auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
    });

    Route::middleware('throttle:password-reset')->group(function () {
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');
        Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
        Route::get('team-invitations/preview', [TeamInvitationController::class, 'preview'])->name('team-invitations.preview');
        Route::post('team-invitations/accept', [TeamInvitationController::class, 'accept'])->name('team-invitations.accept');
    });

    Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmailSigned'])
        ->middleware('signed')
        ->name('email.verify');

    Route::middleware(['auth:sanctum', 'active'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
        Route::put('password', [AuthController::class, 'changePassword'])->name('password.change');

        Route::post('email/verify/resend', [AuthController::class, 'resendVerificationEmail'])
            ->middleware('throttle:6,1')
            ->name('email.resend');
    });
});

Route::middleware(['auth:sanctum', 'active', 'verified', 'throttle:api'])->group(function () {
    Route::post('jobs/{uuid}/apply', [JobApplicationController::class, 'store'])
        ->middleware('role:'.Role::JOB_SEEKER)
        ->name('jobs.apply');

    require __DIR__.'/notifications.php';

    Route::prefix('admin')->middleware('role:'.Role::ADMIN)->name('admin.')->group(function () {
        require __DIR__.'/admin.php';
    });

    Route::prefix('employer')->middleware(['role:'.Role::EMPLOYER, 'employer.company'])->name('employer.')->group(function () {
        require __DIR__.'/employer.php';
    });

    Route::prefix('job-seeker')->middleware('role:'.Role::JOB_SEEKER)->name('job-seeker.')->group(function () {
        require __DIR__.'/job-seeker.php';
    });
});
