<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mitra extends Model
{
    use HasFactory;
    protected $table = 'mitra';
    protected $fillable = [
        'user_id',
        'nama',
        'no_telepon',
        'identitas',
        'tim_id',
    ];

    /**
     * Relationships.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tim()
{
    return $this->belongsTo(Tim::class, 'tim_id'); // Setiap Mitra hanya memiliki satu Tim
}

}
