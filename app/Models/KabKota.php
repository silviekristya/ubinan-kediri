<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KabKota extends Model
{
    use HasFactory;

    protected $table = 'kab_kota';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'kode_kab_kota',
        'nama_kab_kota',
        'provinsi_id',
    ];

    /**
     * Get the provinsi that owns the kabupaten/kota.
     */
    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'provinsi_id', 'kode_provinsi');
    }

    /**
     * Get the kecamatans for the kabupaten/kota.
     */
    public function kecamatan()
    {
        return $this->hasMany(Kecamatan::class, 'kab_kota_id', 'id');
    }
}