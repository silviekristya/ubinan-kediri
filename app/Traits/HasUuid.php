<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUuid
{
    /**
     * Boot function from Laravel, called when the model is instantiated.
     */
    protected static function bootHasUuid()
    {
        static::creating(function ($model) {
            // Pastikan hanya menggunakan UUID jika id tidak ada (untuk menghindari rewrite)
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /**
     * Set the incrementing property to false to avoid auto-increment issues.
     */
    public function getIncrementing()
    {
        return false;
    }

    /**
     * Set the key type to string for UUID.
     */
    public function getKeyType()
    {
        return 'string';
    }
}
