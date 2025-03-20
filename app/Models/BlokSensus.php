<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlokSensus extends Model
{
    use HasFactory;

    protected $table = 'blok_sensus';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nomor_bs',
    ];

    // Relasi ke nama_sls (id_bs): satu Blok Sensus memiliki banyak Nama SLS
    public function namaSls()
    {
        return $this->hasMany(NamaSls::class, 'id_bs', 'id');
    }
}
