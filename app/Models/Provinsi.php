<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provinsi extends Model
{
    use HasFactory;

    protected $table = 'provinsi';
    protected $primaryKey = 'kode_provinsi';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_provinsi',
        'nama_provinsi',
    ];

    /**
     * Get the kabupaten/kota for the provinsi.
     */
    public function kabKota()
    {
        return $this->hasMany(KabKota::class, 'provinsi_id', 'kode_provinsi');
    }
}