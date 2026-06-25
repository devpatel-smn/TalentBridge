<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Modules\Auth\Requests\AcceptTeamInvitationRequest;
use App\Modules\Auth\Resources\UserResource;
use App\Modules\Employer\Services\TeamInvitationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamInvitationController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly TeamInvitationService $teamInvitations,
    ) {}

    public function preview(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        $preview = $this->teamInvitations->preview(
            $validated['email'],
            $validated['token'],
        );

        return $this->success($preview, 'Invitation details retrieved successfully.');
    }

    public function accept(AcceptTeamInvitationRequest $request): JsonResponse
    {
        $user = $this->teamInvitations->accept($request->validated(), $request);

        return $this->success(
            new UserResource($user),
            'Invitation accepted successfully.'
        );
    }
}
