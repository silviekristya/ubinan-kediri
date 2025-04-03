<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NamaSls extends Model
{
    use HasFactory;

    protected $table = 'nama_sls';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id_bs',
        'nama_sls',
    ];

    // Relasi ke blok_sensus : Nama SLS milik satu Blok Sensus
    public function blok_sensus()
    {
        return $this->belongsTo(BlokSensus::class, 'id_bs', 'id');
    }
    // Relasi ke sampel : satu Nama SLS dapat memiliki banyak Sampel
    public function sampel()
    {
        return $this->hasMany(Sampel::class, 'id_sls', 'id');
    }
}
