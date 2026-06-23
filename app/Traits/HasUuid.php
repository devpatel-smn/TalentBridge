<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasUuid
{
    protected static function bootHasUuid(): void
    {
        static::creating(function (Model $model): void {
            $model->ensureUuidIsSet();
        });
    }

    public function ensureUuidIsSet(): void
    {
        if (! filled($this->uuid)) {
            $this->uuid = (string) Str::uuid();
        }
    }

    protected function performInsert(Builder $query): bool
    {
        $this->ensureUuidIsSet();

        return parent::performInsert($query);
    }
}
