<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlokSensus extends Model
{
    use HasFactory;

    protected $table = 'blok_sensus';
    protected $primaryKey = 'id_bs';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_bs',
        'nomor_bs',
        'kel_desa_id',
    ];

    public function kelDesa()
    {
        return $this->belongsTo(KelDesa::class, 'kel_desa_id', 'id');
    }

    /**
     * Relationship: one BlokSensus has many Sls (nama_sls entries)
     */
    public function sls()
    {
        return $this->hasMany(Sls::class, 'bs_id', 'id_bs');
    }
}