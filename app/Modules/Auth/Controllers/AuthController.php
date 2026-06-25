<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponds;
use App\Models\User;
use App\Modules\Auth\Requests\ChangePasswordRequest;
use App\Modules\Auth\Requests\ForgotPasswordRequest;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Requests\ResetPasswordRequest;
use App\Modules\Auth\Resources\UserResource;
use App\Modules\Auth\Services\AuthService;
use App\Modules\Auth\Services\EmailVerificationService;
use App\Modules\Auth\Services\PasswordResetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponds;

    public function __construct(
        private readonly AuthService $authService,
        private readonly PasswordResetService $passwordResetService,
        private readonly EmailVerificationService $emailVerificationService,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register(
            $request->validated(),
            $request->string('role')->toString()
        );

        $user = $this->authService->loginRegisteredUser($user, $request);

        return $this->created(
            new UserResource($user),
            'Registration successful. Please verify your email address.'
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->string('email')->toString(),
            $request->string('password')->toString(),
            $request
        );

        return $this->success(
            new UserResource($result['user']),
            'Login successful.'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request);

        return $this->success(message: 'Logout successful.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->me($request->user());

        return $this->success(new UserResource($user));
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->passwordResetService->sendResetLink(
            $request->string('email')->toString()
        );

        return $this->success(
            message: 'If an account exists for that email, a password reset link has been sent.'
        );
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = $this->passwordResetService->resetPassword($request->validated());
        $this->passwordResetService->assertResetSucceeded($status);

        return $this->success(message: 'Password has been reset successfully.');
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $this->authService->changePassword(
            $request->user(),
            $request->string('current_password')->toString(),
            $request->string('password')->toString()
        );

        return $this->success(
            new UserResource($user->load(['roles.permissions', 'jobSeekerProfile', 'employerUsers.company'])),
            'Password updated successfully.'
        );
    }

    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->success(message: 'Email address is already verified.');
        }

        $this->emailVerificationService->sendVerificationNotification($user);

        return $this->success(message: 'Verification email sent.');
    }

    public function verifyEmailSigned(Request $request, int $id, string $hash)
    {
        $user = User::query()->findOrFail($id);
        $redirectBase = $request->getSchemeAndHttpHost().'/verify-email';

        if (! $request->hasValidSignature()) {
            return redirect()->to($redirectBase.'?status=invalid');
        }

        if (! $this->emailVerificationService->verify($user, $hash)) {
            return redirect()->to($redirectBase.'?status=invalid');
        }

        return redirect()->to($redirectBase.'?status=verified');
    }
}
