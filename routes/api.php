<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    require __DIR__.'/api/v1/auth.php';
    require __DIR__.'/api/v1/jobs.php';
    require __DIR__.'/api/v1/companies.php';
});
