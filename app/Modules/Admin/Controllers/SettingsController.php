<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\SystemSetting;
use App\Modules\Admin\Requests\UpdateSettingsRequest;
use App\Modules\Admin\Resources\SystemSettingResource;
use App\Modules\Admin\Services\SettingsManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly SettingsManagementService $settingsService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', SystemSetting::class);

        return $this->success(
            SystemSettingResource::collection($this->settingsService->all()),
            'System settings retrieved successfully.'
        );
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        $updated = $this->settingsService->updateMany(
            $request->validated('settings'),
            $request->user(),
            $request
        );

        return $this->success(
            SystemSettingResource::collection($updated),
            'System settings updated successfully.'
        );
    }
}
