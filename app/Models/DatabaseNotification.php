<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Notifications\DatabaseNotification as LaravelDatabaseNotification;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $type
 * @property string $notifiable_type
 * @property int $notifiable_id
 * @property array<string, mixed> $data
 * @property Carbon|null $read_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class DatabaseNotification extends LaravelDatabaseNotification
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data' => 'array',
            'read_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeRead(Builder $query): Builder
    {
        return $query->whereNotNull('read_at');
    }
}
