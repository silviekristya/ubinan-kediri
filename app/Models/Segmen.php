<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segmen extends Model
{
    use HasFactory;

    protected $table = 'segmen';
    protected $primaryKey = 'id_segmen';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_segmen',
        'kode_segmen',
        'nama_segmen',
        'kecamatan_id',
    ];

    /**
     * Relationship: Segmen belongs to a Kecamatan
     */
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id', 'id');
    }

    /**
     * Relationship: one Segmen has many Sampel
     */
    public function sampel()
    {
        return $this->hasMany(Sampel::class, 'segmen_id', 'id_segmen');
    }
}