<?php

namespace App\Http\Traits;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

trait ApiResponds
{
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        ?array $meta = null,
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'meta' => $meta,
            'errors' => null,
        ], $status);
    }

    protected function created(mixed $data = null, string $message = 'Created successfully'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    protected function paginated(
        mixed $data,
        LengthAwarePaginator $paginator,
        string $message = 'Success',
        ?array $filters = null,
    ): JsonResponse {
        return $this->success($data, $message, 200, [
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'filters' => $filters,
        ]);
    }

    protected function error(
        string $message,
        mixed $errors = null,
        int $status = 400,
        ?string $code = null,
    ): JsonResponse {
        $payload = [
            'success' => false,
            'message' => $message,
            'data' => null,
            'meta' => null,
            'errors' => $errors,
        ];

        if ($code !== null) {
            $payload['code'] = $code;
        }

        return response()->json($payload, $status);
    }
}
