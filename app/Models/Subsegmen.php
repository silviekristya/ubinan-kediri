<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subsegmen extends Model
{
    use HasFactory;

    protected $fillable = [
        'segmen_id',
        'nama',
    ];

    /**
     * Relationships.
     */
    public function segmen()
    {
        return $this->belongsTo(Segmen::class);
    }
}
