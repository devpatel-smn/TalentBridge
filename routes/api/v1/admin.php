<?php

use App\Modules\Admin\Controllers\ActivityLogController;
use App\Modules\Admin\Controllers\AnalyticsController;
use App\Modules\Admin\Controllers\AuditLogController;
use App\Modules\Admin\Controllers\CompanyController;
use App\Modules\Admin\Controllers\DashboardController;
use App\Modules\Admin\Controllers\EmployerController;
use App\Modules\Admin\Controllers\InterviewController;
use App\Modules\Admin\Controllers\JobController;
use App\Modules\Admin\Controllers\JobSeekerController;
use App\Modules\Admin\Controllers\SettingsController;
use App\Modules\Admin\Controllers\UserController;
use App\Modules\Admin\Controllers\VerificationController;
use App\Modules\Notification\Controllers\AdminNotificationController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', DashboardController::class)->name('dashboard');

Route::apiResource('users', UserController::class);
Route::patch('users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');

Route::get('employers', [EmployerController::class, 'index'])->name('employers.index');
Route::get('employers/{employer}', [EmployerController::class, 'show'])->name('employers.show');

Route::get('job-seekers', [JobSeekerController::class, 'index'])->name('job-seekers.index');
Route::get('job-seekers/{uuid}', [JobSeekerController::class, 'show'])->name('job-seekers.show');

Route::get('companies', [CompanyController::class, 'index'])->name('companies.index');
Route::get('companies/{uuid}', [CompanyController::class, 'show'])->name('companies.show');
Route::put('companies/{uuid}', [CompanyController::class, 'update'])->name('companies.update');
Route::delete('companies/{uuid}', [CompanyController::class, 'destroy'])->name('companies.destroy');

Route::get('jobs', [JobController::class, 'index'])->name('jobs.index');
Route::get('jobs/{uuid}', [JobController::class, 'show'])->name('jobs.show');
Route::put('jobs/{uuid}', [JobController::class, 'update'])->name('jobs.update');
Route::delete('jobs/{uuid}', [JobController::class, 'destroy'])->name('jobs.destroy');

Route::get('interviews', [InterviewController::class, 'index'])->name('interviews.index');
Route::get('interviews/{uuid}', [InterviewController::class, 'show'])->name('interviews.show');

Route::get('verifications', [VerificationController::class, 'index'])->name('verifications.index');
Route::get('verifications/{verification}', [VerificationController::class, 'show'])->name('verifications.show');
Route::patch('verifications/{verification}', [VerificationController::class, 'review'])->name('verifications.review');

Route::get('analytics', AnalyticsController::class)->name('analytics');

Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
Route::get('activity-logs/{id}', [ActivityLogController::class, 'show'])->name('activity-logs.show');

Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
Route::get('audit-logs/{id}', [AuditLogController::class, 'show'])->name('audit-logs.show');

Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');

Route::post('notifications/send', [AdminNotificationController::class, 'send'])->name('notifications.send');
