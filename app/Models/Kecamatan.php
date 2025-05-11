<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    use HasFactory;

    protected $table = 'kecamatan';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'kode_kecamatan',
        'nama_kecamatan',
        'kab_kota_id',
    ];

    /**
     * Get the kabupaten/kota that owns the kecamatan.
     */
    public function kabKota()
    {
        return $this->belongsTo(KabKota::class, 'kab_kota_id', 'id');
    }

    /**
     * Get the desa/kelurahans for the kecamatan.
     */
    public function desaKelurahan()
    {
        return $this->hasMany(KelDesa::class, 'kecamatan_id', 'id');
    }
}