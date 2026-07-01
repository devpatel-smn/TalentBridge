<?php

use App\Modules\Job\Controllers\PublicCompanyController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:public-jobs')->group(function () {
    Route::get('companies', [PublicCompanyController::class, 'index'])->name('companies.index');
    Route::get('companies/industries', [PublicCompanyController::class, 'industries'])->name('companies.industries');
    Route::get('companies/{slug}', [PublicCompanyController::class, 'show'])->name('companies.show');
});
