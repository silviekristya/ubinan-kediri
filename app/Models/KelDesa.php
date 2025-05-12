<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KelDesa extends Model
{
    use HasFactory;

    protected $table = 'kel_desa';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'kode_kel_desa',
        'nama_kel_desa',
        'kecamatan_id',
    ];

    /**
     * Get the kecamatan that owns the desa/kelurahan.
     */
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id', 'id');
    }

    public function blokSensus()
    {
        return $this->hasMany(BlokSensus::class, 'kel_desa_id', 'id');
    }
}
