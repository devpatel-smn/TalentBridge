<?php

namespace App\Modules\Job\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Job\Repositories\Contracts\SkillRepositoryInterface;
use App\Modules\Job\Requests\ListSkillsRequest;
use App\Modules\Job\Resources\SkillResource;
use Illuminate\Http\JsonResponse;

class SkillController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly SkillRepositoryInterface $skills,
    ) {}

    public function index(ListSkillsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $paginator = $this->skills->search(
            $validated['search'] ?? null,
            (int) ($validated['per_page'] ?? 20)
        );

        return $this->paginated(
            SkillResource::collection($paginator->items()),
            $paginator,
            'Skills retrieved successfully.',
            $request->only(['search'])
        );
    }
}
