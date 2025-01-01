<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segmen extends Model
{
    use HasFactory;
    protected $table = 'segmen';
    protected $fillable = [
        'nama',
    ];

    /**
     * Relationships.
     */
    public function subsegmen()
    {
        return $this->hasMany(Subsegmen::class);
    }
}
