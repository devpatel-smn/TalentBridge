<?php

namespace App\Modules\JobSeeker\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileCompletionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'percentage' => $this->resource['percentage'],
            'breakdown' => $this->resource['breakdown'],
        ];
    }
}
