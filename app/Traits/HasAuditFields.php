<?php

namespace App\Traits;

trait HasAuditFields
{
    protected static function bootHasAuditFields(): void
    {
        static::creating(function (self $model): void {
            if (auth()->check() && empty($model->created_by)) {
                $model->created_by = auth()->id();
            }
        });

        static::updating(function (self $model): void {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });
    }
}
