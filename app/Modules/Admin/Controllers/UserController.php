<?php

namespace App\Modules\Admin\Controllers;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\User;
use App\Modules\Admin\Requests\ListRequest;
use App\Modules\Admin\Requests\StoreUserRequest;
use App\Modules\Admin\Requests\UpdateUserRequest;
use App\Modules\Admin\Requests\UpdateUserStatusRequest;
use App\Modules\Admin\Resources\AdminUserResource;
use App\Modules\Admin\Services\UserManagementService;
use App\Modules\Admin\Support\ListQueryParams;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly UserManagementService $userService,
    ) {}

    public function index(ListRequest $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $params = ListQueryParams::fromArray($request->validated());
        $paginator = $this->userService->list($params);

        return $this->paginated(
            AdminUserResource::collection($paginator->items()),
            $paginator,
            'Users retrieved successfully.',
            $request->only(['search', 'filter', 'sort', 'order'])
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated(), $request);

        return $this->created(
            new AdminUserResource($user),
            'User created successfully.'
        );
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return $this->success(
            new AdminUserResource($this->userService->find($user->id)),
            'User retrieved successfully.'
        );
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $updated = $this->userService->update($user, $request->validated(), $request);

        return $this->success(
            new AdminUserResource($updated),
            'User updated successfully.'
        );
    }

    public function updateStatus(UpdateUserStatusRequest $request, User $user): JsonResponse
    {
        $updated = $this->userService->updateStatus(
            $user,
            $request->enum('status', UserStatus::class),
            $request
        );

        return $this->success(
            new AdminUserResource($updated),
            'User status updated successfully.'
        );
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $this->userService->delete($user, request());

        return $this->success(message: 'User deleted successfully.');
    }
}
