<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    use HasFactory;

    protected $table = 'pegawai';

    protected $fillable = [
        'user_id',
        'nama',
        'role',
        'is_pml',
        'no_telepon',
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
        return $this->hasOne(Tim::class, 'pml_id'); // Satu PML hanya memiliki satu tim
    }

}
