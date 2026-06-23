<?php

use App\Modules\Job\Controllers\JobCategoryController;
use App\Modules\Job\Controllers\PublicJobController;
use App\Modules\Job\Controllers\SkillController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:public-jobs')->group(function () {
    Route::get('jobs', [PublicJobController::class, 'index'])->name('jobs.index');
    Route::get('jobs/featured', [PublicJobController::class, 'featured'])->name('jobs.featured');
    Route::get('jobs/{uuid}', [PublicJobController::class, 'show'])->name('jobs.show');

    Route::get('job-categories', [JobCategoryController::class, 'index'])->name('job-categories.index');
    Route::get('skills', [SkillController::class, 'index'])->name('skills.index');
});
