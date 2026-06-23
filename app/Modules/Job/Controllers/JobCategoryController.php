<?php

namespace App\Modules\Job\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Job\Repositories\Contracts\JobCategoryRepositoryInterface;
use App\Modules\Job\Resources\JobCategoryResource;
use Illuminate\Http\JsonResponse;

class JobCategoryController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly JobCategoryRepositoryInterface $categories,
    ) {}

    public function index(): JsonResponse
    {
        $categories = $this->categories->listActive();

        return $this->success(
            JobCategoryResource::collection($categories),
            'Job categories retrieved successfully.'
        );
    }
}
